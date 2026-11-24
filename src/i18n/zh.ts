const zh = {
  // Header / brand
  "app.title": "行策 RouteMate",
  "app.subtitle": "出行决策智能体 · 找商场 / 比距离 / 给推荐",
  "brand.name": "行策",
  "brand.en": "ROUTE MATE",
  "brand.role": "出行决策智能体",

  // Mode badges
  "mode.plan": "规划模式",
  "mode.tools": "工具待命",
  "mode.running": "推理中",
  "mode.immersive": "沉浸模式",
  "mode.exitImmersive": "退出沉浸",

  // Empty state
  "empty.title": "你好，我是小策",
  "empty.hint": "告诉我你在哪儿、想找什么品牌，我会用地图帮你检索附近商场、比较距离，给出最合适的推荐。",
  "empty.features": "高德地图 · 品牌匹配 · 距离比较 · 连续追问",

  // Chat input
  "chat.placeholder": "说说你的位置和想去的品牌…  ⏎ 发送 · Shift+⏎ 换行",
  "chat.hint": "数据来自高德地图 · 由 OpenAI Agents SDK + EdgeOne Makers 驱动",

  // Preset chips
  "preset.1": "我在红莲南路地铁站附近，想找个有倍轻松的商场",
  "preset.2": "帮我按距离排序附近的商场",

  // Quick actions (top bar)
  "action.plan": "开始规划",
  "action.malls": "找商场",
  "action.brand": "品牌筛选",
  "action.followup": "换个条件",
  "action.more": "更多",

  // Tool indicators
  "tool.geocode": "地点解析",
  "tool.search": "商场检索",
  "tool.distance": "距离计算",

  // Status & errors
  "status.error": "⚠️ 请求失败，请检查后端服务是否启动。",
  "status.stopped": "⏹ *已停止生成*",
  "status.backendError": "⚠️ 后端中断请求失败，服务端可能仍在运行。",

  // Debug panel
  "debug.title": "运行轨迹",
  "debug.events": "事件",
  "debug.clear": "清除",
  "debug.empty": "等待 SSE 事件...",
  "debug.emptyHint": "发送消息后，所有原始后端数据将在此处显示。",

  // Right panel tabs
  "panel.code": "代码",
  "panel.trace": "运行轨迹",

  // Conversation sidebar
  "sidebar.label": "会话列表",
  "sidebar.title": "行程记录",
  "sidebar.newChat": "新建行程",
  "sidebar.loading": "正在加载会话...",
  "sidebar.loadMore": "加载更多",
  "sidebar.loadingMore": "加载中...",
  "sidebar.emptyTitle": "暂无行程",
  "sidebar.emptyHint": "点击「新建行程」开始规划第一段路线。",
  "sidebar.delete": "删除会话",
  "sidebar.deleteConfirm": "确定要永久删除这个会话吗？此操作不可恢复。",

  // Hero panel
  "hero.badge": "向导在线",
  "hero.name": "小策",
  "hero.role": "你的出行决策向导",
  "hero.status": "随时帮你找商场、比距离",
  "hero.tip": "试着告诉我你的位置和想去的品牌",

  // Aria labels
  "aria.send": "发送",
  "aria.clearHistory": "清除历史",
  "aria.stopGeneration": "停止生成",

  // Language toggle
  "lang.switch": "English",

  // Floating badges
  "floatingLink.deploy": "一键部署",
  "floatingLink.github": "GitHub",
} as const;

export default zh;
