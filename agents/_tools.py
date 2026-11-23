"""
Agent Tools — 出行决策 Agent 的高德地图工具集（私有模块，不作为路由暴露）

工具：
  1. geocode_location        — 把用户描述的位置解析成经纬度
  2. search_malls_by_keyword — 按关键词检索附近商场（高德 POI 搜索）
  3. get_distance            — 计算起点到商场的距离（高德距离矩阵）

所有密钥只从环境变量读取（AMAP_API_KEY），绝不写入代码或提示词。
"""

import json
import os
import urllib.parse
import urllib.request
from typing import Annotated

from agents import function_tool

AMAP_BASE = "https://restapi.amap.com"


def _amap_get(path: str, params: dict) -> dict:
    """调用高德 Web 服务 API，返回解析后的 JSON。"""
    key = os.getenv("AMAP_API_KEY", "")
    if not key:
        return {"ok": False, "error": "AMAP_API_KEY 未配置"}
    params = {**params, "key": key, "output": "json"}
    url = f"{AMAP_BASE}{path}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        if str(data.get("status")) != "1":
            return {"ok": False, "error": f"高德接口返回: {data.get('info', '未知错误')}"}
        return {"ok": True, "data": data}
    except Exception as e:
        return {"ok": False, "error": f"调用高德接口失败: {type(e).__name__}: {e}"}


# ========== 工具 1：地点 -> 经纬度 ==========
@function_tool
def geocode_location(
    location: Annotated[str, "用户描述的位置，例如：红莲南路地铁站、北京市朝阳区"],
) -> str:
    """把用户描述的地点解析成经纬度坐标，供后续距离计算使用。"""
    if not location or not location.strip():
        return json.dumps({"ok": False, "error": "位置不能为空"}, ensure_ascii=False)

    r = _amap_get("/v3/place/text", {
        "keywords": location.strip(),
        "offset": 1,
        "page": 1,
        "extensions": "base",
    })
    if not r["ok"]:
        return json.dumps(r, ensure_ascii=False)
    pois = r["data"].get("pois") or []
    if not pois:
        return json.dumps({"ok": False, "error": f"没找到位置: {location}"}, ensure_ascii=False)
    poi = pois[0]
    loc = poi.get("location", "")
    parts = loc.split(",")
    if len(parts) != 2:
        return json.dumps({"ok": False, "error": "位置解析失败"}, ensure_ascii=False)
    return json.dumps({
        "ok": True,
        "name": poi.get("name"),
        "address": poi.get("address"),
        "longitude": parts[0],
        "latitude": parts[1],
        "location": loc,
    }, ensure_ascii=False)


# ========== 工具 2：关键词检索商场 ==========
@function_tool
def search_malls_by_keyword(
    keyword: Annotated[str, "检索关键词，通常是品牌名或商场名，例如：倍轻松、西厅村屋、万象城"],
    city: Annotated[str, "城市名，例如：北京；不填则全国范围"] = "",
    center: Annotated[str, "中心点经纬度，格式 '经度,纬度'；填了则按附近检索"] = "",
    radius: Annotated[str, "附近检索半径（米），默认 5000"] = "5000",
) -> str:
    """根据关键词检索商场/店铺 POI。返回名称、地址、坐标、距离等信息。"""
    if not keyword or not keyword.strip():
        return json.dumps({"ok": False, "error": "检索关键词不能为空"}, ensure_ascii=False)

    params = {
        "keywords": keyword.strip(),
        "offset": 20,
        "page": 1,
        "extensions": "base",
    }
    if city.strip():
        params["city"] = city.strip()
    if center.strip():
        params["location"] = center.strip()
        params["radius"] = radius

    r = _amap_get("/v3/place/text", params)
    if not r["ok"]:
        return json.dumps(r, ensure_ascii=False)

    pois = r["data"].get("pois") or []
    results = []
    for p in pois:
        results.append({
            "name": p.get("name"),
            "address": p.get("address"),
            "location": p.get("location"),
            "distance": p.get("distance"),
            "businessarea": p.get("businessarea"),
            "type": p.get("type"),
        })
    return json.dumps({"ok": True, "count": len(results), "pois": results}, ensure_ascii=False)


# ========== 工具 3：距离矩阵 ==========
@function_tool
def get_distance(
    origin: Annotated[str, "起点经纬度，格式 '经度,纬度'"],
    destination: Annotated[str, "终点经纬度，格式 '经度,纬度'"],
) -> str:
    """计算两个坐标之间的驾车距离（米）和预计时长（秒）。"""
    if not origin.strip() or not destination.strip():
        return json.dumps({"ok": False, "error": "起点和终点不能为空"}, ensure_ascii=False)
    r = _amap_get("/v3/distance", {
        "origins": origin.strip(),
        "destination": destination.strip(),
        "type": "1",  # 驾车距离
    })
    if not r["ok"]:
        return json.dumps(r, ensure_ascii=False)
    results = r["data"].get("results") or []
    if not results:
        return json.dumps({"ok": False, "error": "距离计算无结果"}, ensure_ascii=False)
    item = results[0]
    return json.dumps({
        "ok": True,
        "distance_meters": item.get("distance"),
        "duration_seconds": item.get("duration"),
    }, ensure_ascii=False)
