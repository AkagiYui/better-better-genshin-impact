import { createRouter, createWebHistory } from "vue-router"

// 路由配置
const routes = [
  { path: "/login", name: "login", component: () => import("@/pages/login.vue"), meta: { requires: false } },
  { path: "/", name: "home", component: () => import("@/pages/index.vue"), meta: { requires: true } },
  { path: "/:path(.*)", component: () => import("@/pages/[...path].vue") },

  { path: "/archive", name: "archive", component: () => import("@/pages/archive.vue"), meta: { requires: true } },
  { path: "/auto-log", name: "auto-log", component: () => import("@/pages/auto-log.vue"), meta: { requires: true } },
  { path: "/bag-statistics-trend", name: "bag-statistics-trend", component: () => import("@/pages/bag-statistics-trend.vue"), meta: { requires: true } },
  { path: "/bag-statistics", name: "bag-statistics", component: () => import("@/pages/bag-statistics.vue"), meta: { requires: true } },
  { path: "/bg", name: "bg", component: () => import("@/pages/bg.vue"), meta: { requires: true } },
  { path: "/calculate-task-enabled-list", name: "calculate-task-enabled-list", component: () => import("@/pages/calculate-task-enabled-list.vue"), meta: { requires: true } },
  { path: "/cd-aware-auto-gather", name: "cd-aware-auto-gather", component: () => import("@/pages/cd-aware-auto-gather.vue"), meta: { requires: true } },
  { path: "/collection-management", name: "collection-management", component: () => import("@/pages/collection-management.vue"), meta: { requires: true } },
  { path: "/config", name: "config", component: () => import("@/pages/config.vue"), meta: { requires: true } },
  { path: "/get-auto-artifacts-pro", name: "get-auto-artifacts-pro", component: () => import("@/pages/get-auto-artifacts-pro.vue"), meta: { requires: true } },
  { path: "/get-auto-artifacts-pro2", name: "get-auto-artifacts-pro2", component: () => import("@/pages/get-auto-artifacts-pro2.vue"), meta: { requires: true } },
  { path: "/gitlog", name: "gitlog", component: () => import("@/pages/gitlog.vue"), meta: { requires: true } },
  { path: "/harvest", name: "harvest", component: () => import("@/pages/harvest.vue"), meta: { requires: true } },
  { path: "/js-names", name: "js-names", component: () => import("@/pages/js-names.vue"), meta: { requires: true } },
  { path: "/list-groups", name: "list-groups", component: () => import("@/pages/list-groups.vue"), meta: { requires: true } },
  { path: "/log-analysis", name: "log-analysis", component: () => import("@/pages/log-analysis.vue"), meta: { requires: true } },
  { path: "/log-detail", name: "log-detail", component: () => import("@/pages/log-detail.vue"), meta: { requires: true } },
  { path: "/log", name: "log", component: () => import("@/pages/log.vue"), meta: { requires: true } },
  { path: "/material-trend", name: "material-trend", component: () => import("@/pages/material-trend.vue"), meta: { requires: true } },
  { path: "/morale", name: "morale", component: () => import("@/pages/morale.vue"), meta: { requires: true } },
  { path: "/obs-video", name: "obs-video", component: () => import("@/pages/obs-video.vue"), meta: { requires: true } },
  { path: "/one-dragon-flow-config", name: "one-dragon-flow-config", component: () => import("@/pages/one-dragon-flow-config.vue"), meta: { requires: true } },
  { path: "/online", name: "online", component: () => import("@/pages/online.vue"), meta: { requires: true } },
  { path: "/other", name: "other", component: () => import("@/pages/other.vue"), meta: { requires: true } },
  { path: "/pathing", name: "pathing", component: () => import("@/pages/pathing.vue"), meta: { requires: true } },
  { path: "/screen", name: "screen", component: () => import("@/pages/screen.vue"), meta: { requires: true } },
  { path: "/task-cron", name: "task-cron", component: () => import("@/pages/task-cron.vue"), meta: { requires: true } },
  { path: "/update", name: "update", component: () => import("@/pages/update.vue"), meta: { requires: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫 - 检查认证状态
router.beforeEach((to, from) => {
  const token = localStorage.getItem("bbgi-token")
  const requires = to.meta.requires

  // 如果路由需要认证但没有token，重定向到登录页
  if (requires && !token) {
    return { name: "login" }
  }

  // 如果已登录且尝试访问登录页，重定向到首页
  if (to.name === "login" && token) {
    return { name: "home" }
  }

  // 其他情况正常导航
  return true
})

export default router
