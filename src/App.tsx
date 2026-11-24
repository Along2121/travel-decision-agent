import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  Message,
  ToolLampState,
  ConversationSummary,
} from './types';
import {
  fetchConversationHistory,
  sendMessageStream,
  stopAgent,
  listConversations,
  deleteConversation,
} from './api';
import type { RawSseEvent } from './api';
import ToolIndicators from './components/ToolIndicators';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import DebugPanel from './components/DebugPanel';
import CodeViewer from './components/CodeViewer';
import ConversationSidebar from './components/ConversationSidebar';
import HeroPanel from './components/HeroPanel';
import GitHubLink from './components/GitHubLink';
import DeployLink from './components/DeployLink';
import { I18nProvider, LangToggle, useT, MessageKeys } from './i18n';
import { deleteSnapshot, loadSnapshot, saveSnapshot } from './lib/chatUiStore';
import styles from './App.module.css';

/** 三个高德地图工具 —— 与 agents/_tools.py 一一对应 */
const LAMP_IDS = ['geocode_location', 'search_malls_by_keyword', 'get_distance'] as const;
const LAMP_ICONS: Record<string, string> = {
  geocode_location: '📍',
  search_malls_by_keyword: '🏬',
  get_distance: '📏',
};
const LAMP_I18N_KEYS: Record<string, string> = {
  geocode_location: 'tool.geocode',
  search_malls_by_keyword: 'tool.search',
  get_distance: 'tool.distance',
};

/** 顶部快捷功能按钮：点击即发送对应的真实提问 */
const QUICK_ACTIONS = [
  { key: 'action.plan', message: '我在红莲南路地铁站附近，想找一个有倍轻松的商场，哪个最近' },
  { key: 'action.malls', message: '帮我找附近的商场，按距离从近到远排序' },
  { key: 'action.brand', message: '我想找一个既有倍轻松又有西厅村屋的商场，哪个最近' },
  { key: 'action.followup', message: '如果不要求两个品牌同时存在，还有没有距离更近的选择？' },
  { key: 'action.more', message: '你能帮我做什么？请介绍一下你的能力' },
] as const;

const CONVERSATION_ID_STORAGE_KEY = 'eo_conversation_id';

/** stable per-browser identifier, scoped to "this browser's conversations only" */
const EO_USER_ID_STORAGE_KEY = 'eo-uuid';
const CONVERSATIONS_PAGE_SIZE = 20;

function getExistingConversationId(): string | null {
  return localStorage.getItem(CONVERSATION_ID_STORAGE_KEY);
}

function getOrCreateConversationId(): string {
  const cached = getExistingConversationId();
  if (cached) return cached;
  const conversationId = crypto.randomUUID();
  localStorage.setItem(CONVERSATION_ID_STORAGE_KEY, conversationId);
  return conversationId;
}

function getOrCreateEoUuid(): string {
  const cached = localStorage.getItem(EO_USER_ID_STORAGE_KEY);
  if (cached) return cached;
  const eoUuid = crypto.randomUUID();
  localStorage.setItem(EO_USER_ID_STORAGE_KEY, eoUuid);
  return eoUuid;
}

let _historyFetchInFlight = false;

export default function App() {
  return (
    <I18nProvider>
      <LangToggle />
      <AppInner />
    </I18nProvider>
  );
}

function AppInner() {
  const { t } = useT();
  const buildLamps = useCallback((): ToolLampState[] =>
    LAMP_IDS.map(id => ({
      id,
      label: t(LAMP_I18N_KEYS[id] as MessageKeys),
      icon: LAMP_ICONS[id],
      active: false,
      animKey: 0,
    })),
  [t]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [lamps, setLamps]       = useState<ToolLampState[]>(buildLamps);
  const [loading, setLoading]   = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [debugEvents, setDebugEvents] = useState<RawSseEvent[]>([]);
  const [rightPanelMode, setRightPanelMode] = useState<'code' | 'debug'>('code');
  const [immersive, setImmersive] = useState(false);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsLoadingMore, setConversationsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [activeConversationId, setActiveConversationId] = useState<string>(() => getOrCreateConversationId());

  const botMsgIdRef = useRef<string>('');
  const abortCtrlRef = useRef<AbortController | null>(null);
  const hadExistingConversationIdRef = useRef(getExistingConversationId() !== null);
  const conversationIdRef = useRef<string>(activeConversationId);
  const eoUuidRef = useRef<string>(getOrCreateEoUuid());
  const initDoneRef = useRef(false);
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    conversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    setLamps(prev =>
      prev.map(l => ({
        ...l,
        label: t(LAMP_I18N_KEYS[l.id] as MessageKeys),
      }))
    );
  }, [t]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (!initDoneRef.current) return;
    if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
    snapshotTimerRef.current = setTimeout(() => {
      saveSnapshot(conversationIdRef.current, messages).catch(err => {
        console.warn('[chatUiStore] snapshot save failed:', err);
      });
    }, 500);
    return () => {
      if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
    };
  }, [messages]);

  const loadConversation = useCallback(async (convId: string) => {
    setHistoryLoading(true);
    let restoredFromSnapshot = false;
    let snapshotMessageCount = 0;
    try {
      const snapshot = await loadSnapshot(convId).catch(() => [] as Message[]);
      snapshotMessageCount = snapshot.length;
      if (snapshot.length > 0) {
        restoredFromSnapshot = true;
        setMessages(snapshot);
        setHistoryLoading(false);
      }
      const history = await fetchConversationHistory(convId, eoUuidRef.current);
      if (history.length > 0) {
        if (!restoredFromSnapshot || history.length > snapshotMessageCount) {
          setMessages(history);
        }
        saveSnapshot(convId, history).catch(() => {});
      } else if (!restoredFromSnapshot) {
        setMessages([]);
      }
    } finally {
      setHistoryLoading(false);
      initDoneRef.current = true;
    }
  }, []);

  const refreshConversations = useCallback(async (mode: 'replace' | 'append', cursor?: string) => {
    if (mode === 'append') {
      setConversationsLoadingMore(true);
    } else {
      setConversationsLoading(true);
    }
    try {
      const res = await listConversations({
        userId: eoUuidRef.current,
        limit: CONVERSATIONS_PAGE_SIZE,
        order: 'desc',
        after: cursor,
      });
      setNextCursor(res.nextCursor);
      if (mode === 'append') {
        setConversations(prev => {
          const seen = new Set(prev.map(c => c.id));
          const merged = [...prev];
          for (const c of res.conversations) {
            if (!seen.has(c.id)) merged.push(c);
          }
          return merged;
        });
      } else {
        setConversations(res.conversations);
      }
    } finally {
      if (mode === 'append') {
        setConversationsLoadingMore(false);
      } else {
        setConversationsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (_historyFetchInFlight) {
      void refreshConversations('replace');
      return;
    }
    _historyFetchInFlight = true;
    if (!hadExistingConversationIdRef.current) {
      setHistoryLoading(false);
      initDoneRef.current = true;
      void refreshConversations('replace').finally(() => {
        _historyFetchInFlight = false;
      });
      return;
    }
    void loadConversation(conversationIdRef.current).finally(() => {
      void refreshConversations('replace').finally(() => {
        _historyFetchInFlight = false;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBotMessage = useCallback((updater: (content: string) => string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === botMsgIdRef.current ? { ...m, content: updater(m.content) } : m
      )
    );
  }, []);

  const clearBotStreaming = useCallback(() => {
    setMessages(prev => {
      let changed = false;
      const next = prev.map(m => {
        if (m.id === botMsgIdRef.current && m.streaming) {
          changed = true;
          const { streaming, ...rest } = m;
          return rest;
        }
        return m;
      });
      return changed ? next : prev;
    });
  }, []);

  const finishStream = useCallback(() => {
    setLoading(false);
    abortCtrlRef.current = null;
  }, []);

  const handleSend = useCallback(async (text: string) => {
    initDoneRef.current = true;
    setRightPanelMode('debug');

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    const botMsgId = crypto.randomUUID();
    botMsgIdRef.current = botMsgId;
    const botMsg: Message = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setLoading(true);

    let sidebarPrimed = false;
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    const optimisticTitle =
      cleanedText.length === 0 ? 'New chat'
        : cleanedText.length <= 8 ? cleanedText
          : `${cleanedText.slice(0, 8)}...`;

    const primeSidebar = () => {
      if (sidebarPrimed) return;
      sidebarPrimed = true;
      const convId = conversationIdRef.current;
      const now = Date.now();
      setConversations(prev => {
        const idx = prev.findIndex(c => c.id === convId);
        if (idx === -1) {
          const summary: ConversationSummary = {
            id: convId,
            title: optimisticTitle,
            lastMessageAt: now,
            userId: eoUuidRef.current,
          };
          return [summary, ...prev];
        }
        const next = [...prev];
        const [moved] = next.splice(idx, 1);
        next.unshift({ ...moved, lastMessageAt: now });
        return next;
      });
    };

    const ctrl = sendMessageStream(text, {
      onTextDelta(delta) {
        updateBotMessage(content => content + delta);
      },
      onToolCalled(toolName) {
        setLamps(prev =>
          prev.map(l =>
            l.id === toolName ? { ...l, active: true, animKey: l.animKey + 1 } : l
          )
        );
        setTimeout(() => {
          setLamps(prev => prev.map(l => (l.id === toolName ? { ...l, active: false } : l)));
        }, 1000);
      },
      onRawEvent(event) {
        primeSidebar();
        if (event.eventType === 'text_delta') {
          const delta = (event.data as { delta?: string } | null)?.delta ?? '';
          setRightPanelMode('debug');
          setDebugEvents(prev => {
            const last = prev[prev.length - 1];
            if (last && last.eventType === 'text_delta') {
              const prevDelta = (last.data as { delta?: string } | null)?.delta ?? '';
              const merged: RawSseEvent = {
                ...last,
                data: { delta: prevDelta + delta },
                raw: last.raw + delta,
                timestamp: event.timestamp,
              };
              return [...prev.slice(0, -1), merged];
            }
            return [...prev, event];
          });
          return;
        }
        setRightPanelMode('debug');
        setDebugEvents(prev => [...prev, event]);
      },
      onDone() {
        clearBotStreaming();
        finishStream();
        void refreshConversations('replace');
      },
      onError() {
        clearBotStreaming();
        updateBotMessage(content => content || t("status.error"));
        finishStream();
      },
    }, conversationIdRef.current, {
      userId: eoUuidRef.current,
      userMsgId: userMsg.id,
      botMsgId,
    });
    abortCtrlRef.current = ctrl;
  }, [updateBotMessage, clearBotStreaming, finishStream, refreshConversations, t]);

  const handleClearHistory = useCallback(() => {
    const oldConvId = conversationIdRef.current;
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
      abortCtrlRef.current = null;
    }
    setConversations(prev => prev.filter(c => c.id !== oldConvId));
    deleteConversation(oldConvId, eoUuidRef.current).then(ok => {
      if (!ok) console.warn('[delete-conversation] backend request failed');
    }).finally(() => {
      void refreshConversations('replace');
    });
    deleteSnapshot(oldConvId).catch(() => {});
    const newId = crypto.randomUUID();
    localStorage.setItem(CONVERSATION_ID_STORAGE_KEY, newId);
    conversationIdRef.current = newId;
    setActiveConversationId(newId);
    setMessages([]);
    setDebugEvents([]);
    setRightPanelMode('code');
    setLoading(false);
    initDoneRef.current = false;
  }, [refreshConversations]);

  const handleStop = useCallback(() => {
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
      abortCtrlRef.current = null;
    }
    updateBotMessage(content => content ? content + '\n\n' + t("status.stopped") : t("status.stopped"));
    setLoading(false);
    stopAgent(conversationIdRef.current).then(ok => {
      if (!ok) updateBotMessage(content => content + '\n\n' + t("status.backendError"));
    });
  }, [updateBotMessage, t]);

  const handleSelectConversation = useCallback((id: string) => {
    if (loading) return;
    if (id === conversationIdRef.current) return;
    localStorage.setItem(CONVERSATION_ID_STORAGE_KEY, id);
    conversationIdRef.current = id;
    setActiveConversationId(id);
    setRightPanelMode('code');
    void loadConversation(id);
  }, [loading, loadConversation]);

  const handleCreateConversation = useCallback(() => {
    if (loading) return;
    const newId = crypto.randomUUID();
    localStorage.setItem(CONVERSATION_ID_STORAGE_KEY, newId);
    conversationIdRef.current = newId;
    setActiveConversationId(newId);
    setMessages([]);
    setDebugEvents([]);
    setRightPanelMode('code');
    initDoneRef.current = false;
    setHistoryLoading(false);
  }, [loading]);

  const handleLoadMoreConversations = useCallback(() => {
    if (!nextCursor || conversationsLoadingMore) return;
    void refreshConversations('append', nextCursor);
  }, [nextCursor, conversationsLoadingMore, refreshConversations]);

  const handleDeleteConversation = useCallback((id: string) => {
    if (loading) return;
    if (!id) return;
    const confirmed = window.confirm(t('sidebar.deleteConfirm'));
    if (!confirmed) return;
    const isActive = id === conversationIdRef.current;
    setConversations(prev => prev.filter(c => c.id !== id));
    if (isActive) {
      const newId = crypto.randomUUID();
      localStorage.setItem(CONVERSATION_ID_STORAGE_KEY, newId);
      conversationIdRef.current = newId;
      setActiveConversationId(newId);
      setMessages([]);
      setDebugEvents([]);
      setRightPanelMode('code');
      initDoneRef.current = false;
      setHistoryLoading(false);
    }
    void deleteSnapshot(id).catch(() => {});
    void deleteConversation(id, eoUuidRef.current).catch(e => {
      console.warn('[delete-conversation] backend request failed:', e);
    });
  }, [loading, t]);

  const sidebarHasMore = useMemo(() => Boolean(nextCursor), [nextCursor]);

  return (
    <div className={styles.shell}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={`${styles.stage} ${immersive ? styles.stageImmersive : ''}`}>
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          loading={conversationsLoading}
          loadingMore={conversationsLoadingMore}
          hasMore={sidebarHasMore}
          disabled={loading}
          onSelect={handleSelectConversation}
          onCreate={handleCreateConversation}
          onLoadMore={handleLoadMoreConversations}
          onDelete={handleDeleteConversation}
        />

        <div className={styles.chatPanel}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.logo}>⬡</span>
              <div>
                <p className={styles.title}>{t("app.title")}</p>
                <p className={styles.subtitle}>{t("app.subtitle")}</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <span className={styles.modeBadge}>
                <span className={styles.modeDot} />
                {t("mode.plan")}
              </span>
              <span className={`${styles.modeBadge} ${loading ? styles.modeBadgeActive : ''}`}>
                <span className={styles.modeDot} />
                {loading ? t("mode.running") : t("mode.tools")}
              </span>
            </div>
          </header>

          <div className={styles.toolBar}>
            <ToolIndicators lamps={lamps} />
          </div>

          <div className={styles.quickBar}>
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.key}
                type="button"
                className={styles.quickBtn}
                onClick={() => !loading && handleSend(action.message)}
                disabled={loading}
              >
                {t(action.key as MessageKeys)}
              </button>
            ))}
          </div>

          <div className={styles.chatWindowShell}>
            <ChatWindow messages={messages} loading={loading} />
            {historyLoading && messages.length === 0 && (
              <div className={styles.historyOverlay}>
                <div className={styles.historySpinner} />
              </div>
            )}
          </div>
          <ChatInput onSend={handleSend} onStop={handleStop} onClear={handleClearHistory} disabled={loading} />
        </div>

        <div className={`${styles.rightRail} ${immersive ? styles.rightRailImmersive : ''}`}>
          <div className={styles.codePanel}>
            <div className={styles.panelTabs}>
              <button
                type="button"
                className={`${styles.panelTab} ${rightPanelMode === 'code' ? styles.panelTabActive : ''}`}
                onClick={() => setRightPanelMode('code')}
              >
                {t('panel.code')}
              </button>
              <button
                type="button"
                className={`${styles.panelTab} ${rightPanelMode === 'debug' ? styles.panelTabActive : ''}`}
                onClick={() => setRightPanelMode('debug')}
              >
                {t('panel.trace')}
              </button>
            </div>
            <div className={styles.panelBody}>
              {rightPanelMode === 'code' ? (
                <CodeViewer />
              ) : (
                <DebugPanel events={debugEvents} onClear={() => setDebugEvents([])} />
              )}
            </div>
          </div>
          <HeroPanel immersive={immersive} onToggleImmersive={() => setImmersive(v => !v)} />
        </div>
      </div>
      <GitHubLink />
      <DeployLink />
    </div>
  );
}
