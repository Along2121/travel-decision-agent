import type React from 'react';
import styles from './CodeViewer.module.css';

const token = (cls: string) =>
  function Token({ t }: { t: string }) { return <span className={cls}>{t}</span>; };

const Cmt = token(styles.cmt);
const Dec = token(styles.dec);
const Kw  = token(styles.kw);
const Fn  = token(styles.fn);
const Ty  = token(styles.ty);
const Str = token(styles.str);
const Doc = token(styles.doc);
const Op  = token(styles.op);
const Va  = token(styles.va);

interface LineProps { n: number; children?: React.ReactNode }
const L = ({ n, children }: LineProps) => (
  <div className={styles.line}>
    <span className={styles.ln}>{String(n).padStart(2, ' ')}</span>
    <span className={styles.lc}>{children ?? ' '}</span>
  </div>
);
const I1 = ({ children }: { children?: React.ReactNode }) => (
  <><span className={styles.indent} />{children}</>
);

export default function CodeViewer() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.fileIcon}>⬡</span>
          <span className={styles.filename}>agents/_tools.py</span>
        </div>
        <span className={styles.badge}>READ ONLY</span>
      </div>

      <div className={styles.body}>
        <div className={styles.scanline} aria-hidden />

        <div className={styles.code}>
          <L n={1}><Cmt t="# 出行决策 Agent —— 高德地图工具集" /></L>
          <L n={2}><Kw t="from " /><Va t="agents" /><Kw t=" import " /><Ty t="function_tool" /></L>
          <L n={3} />
          <L n={4}><Cmt t="# 1. 地点 → 经纬度" /></L>
          <L n={5}><Dec t="@function_tool" /></L>
          <L n={6}><Kw t="def " /><Fn t="geocode_location" /><Op t="(" /><Va t="location" /><Op t=": " /><Ty t="str" /><Op t=") -> " /><Ty t="str" /><Op t=":" /></L>
          <L n={7}><I1><Doc t='"""把用户描述的地点解析成经纬度坐标"""' /></I1></L>
          <L n={8}><I1><Va t="r" /><Op t=" = " /><Fn t="_amap_get" /><Op t="(" /><Str t='"/v3/place/text"' /><Op t=", " /><Va t="params" /><Op t=")" /></I1></L>
          <L n={9}><I1><Kw t="return " /><Va t="json" /><Op t="." /><Fn t="dumps" /><Op t="(" /><Va t="r" /><Op t=")" /></I1></L>
          <L n={10} />
          <L n={11}><Cmt t="# 2. 按品牌关键词检索商场" /></L>
          <L n={12}><Dec t="@function_tool" /></L>
          <L n={13}><Kw t="def " /><Fn t="search_malls_by_keyword" /><Op t="(" /></L>
          <L n={14}><I1><Va t="keyword" /><Op t=": " /><Ty t="str" /><Op t=", " /><Va t="city" /><Op t=": " /><Ty t="str" /><Op t=" = " /><Str t='""' /><Op t="," /></I1></L>
          <L n={15}><I1><Va t="center" /><Op t=": " /><Ty t="str" /><Op t=" = " /><Str t='""' /><Op t=", " /><Va t="radius" /><Op t=": " /><Ty t="str" /><Op t=" = " /><Str t='"5000"' /><Op t="," /></I1></L>
          <L n={16}><Op t=") -> " /><Ty t="str" /><Op t=":" /></L>
          <L n={17}><I1><Doc t='"""检索商场/店铺 POI，返回名称、地址、坐标、距离"""' /></I1></L>
          <L n={18}><I1><Va t="pois" /><Op t=" = " /><Fn t="_amap_get" /><Op t="(" /><Str t='"/v3/place/text"' /><Op t=", " /><Va t="params" /><Op t=")" /></I1></L>
          <L n={19}><I1><Kw t="return " /><Fn t="format_results" /><Op t="(" /><Va t="pois" /><Op t=")" /></I1></L>
          <L n={20} />
          <L n={21}><Cmt t="# 3. 距离矩阵（驾车）" /></L>
          <L n={22}><Dec t="@function_tool" /></L>
          <L n={23}><Kw t="def " /><Fn t="get_distance" /><Op t="(" /><Va t="origin" /><Op t=": " /><Ty t="str" /><Op t=", " /><Va t="destination" /><Op t=": " /><Ty t="str" /><Op t=") -> " /><Ty t="str" /><Op t=":" /></L>
          <L n={24}><I1><Doc t='"""计算起点到商场的驾车距离与预计时长"""' /></I1></L>
          <L n={25}><I1><Va t="r" /><Op t=" = " /><Fn t="_amap_get" /><Op t="(" /><Str t='"/v3/distance"' /><Op t=", " /><Op t="{" /><Str t='"type"' /><Op t=": " /><Str t='"1"' /><Op t="}" /><Op t=")" /></I1></L>
          <L n={26}><I1><Kw t="return " /><Va t="json" /><Op t="." /><Fn t="dumps" /><Op t="(" /><Va t="r" /><Op t=")" /></I1></L>
          <L n={27} />
          <L n={28}><Cmt t="# 密钥只从环境变量读取，绝不写入代码" /></L>
          <L n={29}><Va t="AMAP_BASE" /><Op t=" = " /><Str t='"https://restapi.amap.com"' /></L>
          <L n={30}><Va t="key" /><Op t=" = " /><Va t="os" /><Op t="." /><Fn t="getenv" /><Op t="(" /><Str t='"AMAP_API_KEY"' /><Op t=")" /></L>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerDot} />
        <span>OpenAI Agents SDK · EdgeOne Makers · AMap</span>
      </div>
    </div>
  );
}
