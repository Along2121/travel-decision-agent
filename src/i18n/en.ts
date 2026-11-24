const en = {
  // Header / brand
  "app.title": "RouteMate",
  "app.subtitle": "Travel Decision Agent · Find malls / Compare distance / Recommend",
  "brand.name": "RouteMate",
  "brand.en": "ROUTE MATE",
  "brand.role": "Travel Decision Agent",

  // Mode badges
  "mode.plan": "PLAN MODE",
  "mode.tools": "TOOLS READY",
  "mode.running": "THINKING",
  "mode.immersive": "Immersive",
  "mode.exitImmersive": "Exit Immersive",

  // Empty state
  "empty.title": "Hi, I'm Xiao Ce",
  "empty.hint": "Tell me where you are and which brands you like. I'll search nearby malls on the map, compare distances, and give you the best recommendation.",
  "empty.features": "AMap · Brand Match · Distance · Follow-ups",

  // Chat input
  "chat.placeholder": "Tell me your location and preferred brands...  ⏎ Send · Shift+⏎ Newline",
  "chat.hint": "Data from AMap · Powered by OpenAI Agents SDK + EdgeOne Makers",

  // Preset chips
  "preset.1": "I'm near Honglian South Rd subway. Find a mall with 倍轻松.",
  "preset.2": "Rank nearby malls by distance for me.",

  // Quick actions (top bar)
  "action.plan": "Start Planning",
  "action.malls": "Find Malls",
  "action.brand": "Brand Filter",
  "action.followup": "Try Another",
  "action.more": "More",

  // Tool indicators
  "tool.geocode": "Geocode",
  "tool.search": "Mall Search",
  "tool.distance": "Distance",

  // Status & errors
  "status.error": "⚠️ Request failed. Please check if the backend service is running.",
  "status.stopped": "⏹ *Generation stopped*",
  "status.backendError": "Backend abort request failed. The server may still be running.",

  // Debug panel
  "debug.title": "Trace",
  "debug.events": "events",
  "debug.clear": "Clear",
  "debug.empty": "Waiting for SSE events...",
  "debug.emptyHint": "After sending a message, all raw backend data will be displayed here.",

  // Right panel tabs
  "panel.code": "Code",
  "panel.trace": "Trace",

  // Conversation sidebar
  "sidebar.label": "Conversation list",
  "sidebar.title": "Trips",
  "sidebar.newChat": "New trip",
  "sidebar.loading": "Loading conversations...",
  "sidebar.loadMore": "Load more",
  "sidebar.loadingMore": "Loading...",
  "sidebar.emptyTitle": "No trips yet",
  "sidebar.emptyHint": "Click \"New trip\" to start planning your first route.",
  "sidebar.delete": "Delete conversation",
  "sidebar.deleteConfirm": "Permanently delete this conversation? This cannot be undone.",

  // Hero panel
  "hero.badge": "GUIDE ONLINE",
  "hero.name": "Xiao Ce",
  "hero.role": "Your travel decision guide",
  "hero.status": "Ready to find malls & compare distances",
  "hero.tip": "Try telling me your location and a brand you like",

  // Aria labels
  "aria.send": "Send",
  "aria.clearHistory": "Clear history",
  "aria.stopGeneration": "Stop generation",

  // Language toggle
  "lang.switch": "中文",

  // Floating badges
  "floatingLink.deploy": "Deploy",
  "floatingLink.github": "GitHub",
} as const;

export default en;
