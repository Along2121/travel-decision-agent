import { useT } from '../i18n';
import GuideCharacter from './GuideCharacter';
import styles from './HeroPanel.module.css';

interface Props {
  immersive: boolean;
  onToggleImmersive: () => void;
}

export default function HeroPanel({ immersive, onToggleImmersive }: Props) {
  const { t } = useT();

  return (
    <div className={`${styles.panel} ${immersive ? styles.immersive : ''}`}>
      <div className={styles.aura} aria-hidden />

      <div className={styles.top}>
        <span className={styles.online}>
          <span className={styles.onlineDot} />
          {t('hero.badge')}
        </span>
      </div>

      <div className={styles.figure}>
        <GuideCharacter className={styles.character} />
        <div className={styles.platform} aria-hidden />
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{t('hero.name')}</span>
          <span className={styles.role}>{t('hero.role')}</span>
        </div>
        <p className={styles.status}>{t('hero.status')}</p>
        {!immersive && <p className={styles.tip}>{t('hero.tip')}</p>}
      </div>

      <button
        type="button"
        className={styles.immersiveBtn}
        onClick={onToggleImmersive}
        title={immersive ? t('mode.exitImmersive') : t('mode.immersive')}
      >
        <span className={styles.btnIcon} aria-hidden>
          {immersive ? '⤢' : '⤡'}
        </span>
        {immersive ? t('mode.exitImmersive') : t('mode.immersive')}
      </button>
    </div>
  );
}
