import axios from "axios"
import router from "./route"

// 获取当前baseURL的函数
export const getBaseURL = () => {
  // 优先使用动态设置的基础URL
  return localStorage.getItem("dynamicBaseURL") || ""
}

// 设置baseURL的函数
export const setBaseURL = (url) => {
  if (url) {
    localStorage.setItem("dynamicBaseURL", url)
  } else {
    localStorage.removeItem("dynamicBaseURL")
  }
}

// 创建axios实例
const api = axios.create({
  baseURL: undefined, // 使用相对路径，让Vite代理处理
  timeout: 35000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 动态获取baseURL
    const dynamicBaseURL = getBaseURL()
    if (dynamicBaseURL) {
      config.baseURL = dynamicBaseURL
    }

    console.debug("API请求:", config.method?.toUpperCase(), config.url, "BaseURL:", config.baseURL || "Vite代理")

    // 从 localStorage 获取 token 并添加到 Authorization 头
    const token = localStorage.getItem("bbgi-token")
    if (token) {
      config.headers.Authorization = `${token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV !== "production") {
      console.log("API响应:", response.status, response.config.url)
    }
    return response
  },
  error => {
    // 1. 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("bbgi-token")
      console.warn("认证已过期，请重新登录")
      router.push({ name: "login" })
      return Promise.reject(error)
    }

    //处理888错误，强制更新前端
    if (error.response && error.response.status === 888) {
      console.warn("等待重启中，请稍后...")
      router.push({ name: "home" })
      return Promise.reject("等待重启中，请稍后...")
    }

    // 如果 error.response 不存在，说明根本没有收到后端的响应
    if (error.code === "ERR_BAD_RESPONSE") {
      console.error("连接失败：后端未启动或网络异常", error.message)
      const token = localStorage.getItem("bbgi-token")
      if (token == null) {
        localStorage.removeItem("bbgi-token")
        // 只有当前不在登录页时才跳转，防止重复跳转报错
        if (router.currentRoute.value.name !== "login") {
          router.push({ name: "login" })
          return
        }
      }

      return Promise.reject(error)
    }

    // 3. 其他业务错误情况
    return error.response?.data || Promise.reject(error)
  },
)

export const login = (username, password) => api.post("/api/auth/login", { username, password }) // 登录
export const getSystemConfig = () => api.get("/api/auth/getSystemConfig") // 获取系统配置

// 获取系统状态
export const getStatus = () => api.get("/api/index")
export const restartBetterBgi = () => api.get("/api/indexSX")
export const updateABgi = () => api.post("/api/updateABgi")

// 获取轮播图图片列表
export const getImages = () => api.get("/api/images")

export const getScreenshot = () => api.get(`/api/aBgiJt?t=${new Date().getTime()}`, { responseType: "blob" }).then(response => {
  const url = URL.createObjectURL(response.data)
  return url
})
// 发送桌面截图
export const sendImage = () => api.post("/api/sendImage")

//查看桌面图片
export const viewImage = () => api.get(`/api/aBgiJt?t=${new Date().getTime()}`)

// 米游社手动签到
export const mysSignIn = () => api.post("/api/mysSignIn")
// 设置米游社签到推送（将 NoticeType 发送到后端）
export const mysPush = (NoticeType) => api.post(`/api/mysPush?NoticeType=${encodeURIComponent(NoticeType)}`)

// 系统操作
export const startOneLong = (data) => api.post("/api/oneLong/startOneLong", data)
export const closeBgi = () => api.post("/api/closeBgi")
export const closeYuanShen = () => api.post("/closeYuanShen")
export const backup = () => api.post("/api/backup")
export const autoUpdateJsAndPathing = () => api.post("/autoUpdateJsAndPathing")

// 配置相关
export const getConfig = () => api.get("/api/config")
export const updateConfig = (data) => api.post("/api/saveConfig", data)
export const getOneLongAllName = () => api.get("/api/oneLong/oneLongAllName")
// BGI 配置相关
export const getBgiConfigAll = () => api.get("/api/bgiConfig/allConfig")
export const findBgiConfig = (configName) => api.get("/api/bgiConfig/findConfig", { params: { configName } })
export const saveBgiConfig = (data) => api.post("/api/bgiConfig/saveConfig", data)

// 日志相关
export const getLog = () => api.get("/api/gitLog")
export const getLogFiles = () => api.get("/api/logFiles")
export const getLogAnalysis = (file) => api.get("/api/logAnalysis", { params: { file } })
export const queryAutoLogs = (keyword = "") => {
  const params = {}
  if (keyword && keyword.trim()) {
    params.data = keyword.trim()
  }
  return api.get("/api/autoLog", { params })
}

// 归档
export const getArchive = (params) => api.get("/archive", { params })
export const getArchiveList = () => api.get("/api/archiveList")
export const deleteArchive = (id) => api.delete(`/api/archive?id=${id}`)
export const deleteAllArchive = () => api.delete("/api/allArchives")

// 其他功能
export const getOther = () => api.get("/other")

export const getListGroups = () => api.get("/api/scriptGroup/listGroups")
// 读取配置组所有的地图追踪
export const listPathingUpdatePaths = () => api.get("/api/scriptGroup/listPathingUpdatePaths")
export const getAutoArtifactsPro = () => api.get("/api/getAutoArtifactsPro")
export const getAutoArtifactsPro2 = () => api.get("/api/getAutoArtifactsPro2")
export const getHarvest = () => api.get("/api/harvest")
export const getBg = () => api.get("/api/bg")
export const getOneLong = () => api.get("/api/onelong")
export const getError = () => api.get("/api/error")
export const getCalculateTaskEnabledList = () => api.get("/CalculateTaskEnabledList")
export const getBagStatistics = () => api.get("/api/BagStatistics")
export const addBagStatistics = (name) => api.post(`/api/BagStatistics/ADD?name=${encodeURIComponent(name)}`)
export const getCDAwareAutoGather = (status = "3") => api.get("/api/CD-Aware-AutoGather/ReadInfo", { params: { status } })
// 采集管理
export const getCollectionManagement = (name) => api.get("/api/CDCollectionManagement/list", { params: { name } })
export const getAllUserFiles = () => api.get("/api/CDCollectionManagement/AllUserFile")
export const getPickupHistory = (name) => api.get("/api/CDCollectionManagement/ReadPickup", { params: { name } })
// 更新是否加入背包统计
export const CDAllMaterial = () => api.post("/api/CD-Aware-AutoGather/CDAllMaterial")
// 一键更新全部材料
export const UpdateAllCD = () => api.post("/api/CD-Aware-AutoGather/UpdateAllCD")

// 启动配置组
export const startGroups = (names) => {
  const payload = Array.isArray(names) ? names : [names]
  return api.post("/api/startGroups", payload)
}

//脚本组管理
//批量更新脚本
export const batchUpdate = () => api.post("/api/batchUpdate")
//更新指定脚本
export const updateJs = (name) => api.post(`/api/updateJs/${name}`)
//获取脚本列表
export const getJsNames = () => api.get("/api/jsNames")
//重置仓库
export const resetRepo = () => api.post("/api/resetRepo")
//查询所有脚本
export const getAllScripts = (search) => api.get(`/api/jsNamesAll?search=${search}`)

// 在你的 api.js 或 api定义文件中添加：
export const subscribeScript = (scriptName) => {
  return api.post(`/api/repo/subscribe?ScriptName=${scriptName}`, null, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 10 * 60 * 1000, // 10 分钟
  })
}

// 狗粮联机
export const StartOnline = (typeKey, runDebug) => api.post(`/api/abgiSSE/connect/${typeKey}?runDebug=${runDebug}`)
export const offline = () => api.post("/api/abgiSSE/disconnect")
export const DogFooddisconnect = () => api.post("/api/abgiSSE/disconnect")
export const reportBomb = (payload) => api.post("/api/abgiSSE/reportBomb", payload)
// 查询上线次数
export const getNumberOfLaunches = () => api.get("/api/NumberOfLaunches")
// 清零上线次数
export const clearNumberOfLaunches = () => api.post("/api/abgiSSE/clearNumberOfLaunches")

// 黑名单相关
export const getBlackList = () => api.get("/api/betterGi/blackList")
export const addBlackList = (blackList) => api.post("/api/betterGi/addBlackList", blackList)
export const deleteBlackList = (blackName) => api.post("/api/betterGi/deleteBlackList", blackName)

//获取录制状态
export const IsRecording = () => api.get("/api/abgiObs/IsRecording")
// 开始录制
export const StartRecording = () => api.post("/api/abgiObs/StartRecording")
// 停止录制
export const StopRecording = () => api.post("/api/abgiObs/StopRecording")
// 获取回放缓冲区状态
export const GetReplayBufferStatus = () => api.get("/api/abgiObs/GetReplayBufferStatus")
// 启动回放缓冲区
export const StartReplayBuffer = () => api.post("/api/abgiObs/StartReplayBuffer")
// 停止回放缓冲区
export const StopReplayBuffer = () => api.post("/api/abgiObs/StopReplayBuffer")
// 保存回放缓冲区
export const SaveReplayBuffer = () => api.post("/api/abgiObs/SaveReplayBuffer")
// 获取视频信息
export const GetVideoInfo = () => api.get("/api/abgiObs/GetVideoInfo")
//删除视频
export const DeleteVideo = (filePath) => api.post(`/api/abgiObs/DeleteVideo?videoName=${filePath}`)
// 删除所有视频
export const DeleteAllVideo = () => api.post("/api/abgiObs/DeleteAllVideo")

// 定时任务管理
export const getTaskCronList = () => api.get("/api/taskCron/list")
export const getAvailableTaskCronNames = () => api.get("/api/taskCron/getTasks")
export const addTaskCron = (payload) => api.post("/api/taskCron/add", payload)
export const updateTaskCron = (payload) => api.post("/api/taskCron/update", payload)
export const pauseTaskCron = (id) => api.post(`/api/taskCron/pause?id=${id}`)

export const resumeTaskCron = (id) => api.post(`/api/taskCron/resume?id=${id}`)
// 删除定时任务
export const removeTaskCron = (id, EntryID) => api.post(`/api/taskCron/remove?id=${id}&EntryID=${EntryID}`)
// 立即执行定时任务
export const AtOnceRunTaskCron = (type, data) => api.post(`/api/taskCron/AtOnceRun?type=${type}&data=${data}`)

export const GetAppInfo = () => api.get("/api/appInfo")

// BGI更新
export const uploadBgi = (file) => {
  const formData = new FormData()
  formData.append("file", file)
  return api.post("/api/uploadBgi", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 10 * 60 * 1000, // 10 分钟
  })
}
// 版本检查相关
export const aBgiGetCurrentVersion = () => api.get("/api/aBgiUpdate/version")
export const aBgiGetLastVersion = () => api.post("/api/aBgiUpdate/GetLastVersion")
// 新的合并接口：获取当前和最新版本并返回 canUpdate
export const aBgiGetVersions = () => api.get("/api/aBgiUpdate/GetBgiVersion")
export const aBgiUpdate = () => api.post("/api/aBgiUpdate/Update", {}, {
  timeout: 10 * 60 * 1000, // 10 分钟
})
// 通过 URL 下载并更新 BGI
// 通过 URL 下载并更新 BGI（单独超时）
export const downloadBgi = () =>
  api.post(
    "/api/UpdateBgi/Download",
    {},
    {
      timeout: 10 * 60 * 1000, // 10 分钟
    },
  )
export const getBgiDownloadStatus = () => api.get("/api/UpdateBgi/DownloadStatus")

// 其他未在上方定义的 API 方法
export const getLogInfo = (fileName) => api.get(`/api/logInfo?fileName=${encodeURIComponent(fileName)}`)
export const getMd = (file) => api.get(`/api/md?filePath=${encodeURIComponent(file)}`)
export const getMorale = (params) => api.get("/api/BagStatistics/Morale", { params })
export const updateMorale = () => api.post("/api/BagStatistics/updateMorale")
export const checkBag = () => api.get("/api/checkBag")
export const deleteBag = () => api.post("/api/deleteBag")
export const eatStatistics = () => api.get("/api/EatStatistics")
export const deleteBagStatistics = (name) => api.delete(`/api/BagStatistics/DELETE?name=${encodeURIComponent(name)}`)
export const clearBagStatistics = () => api.post("/api/BagStatistics/CLEAR")
export const logAnalysis2Page = (file) => api.get(`/api/LogAnalysis2Page?file=${encodeURIComponent(file)}`)
export const archive = (archiveItem) => api.post("/api/archive", archiveItem)
