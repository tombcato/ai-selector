const STORAGE_KEY = 'ai-provider-config'

export function saveConfig(config) {
    try {
        // 简单 base64 编码 API Key (非安全加密，仅避免明文)
        const toSave = {
            ...config,
            apiKey: config.apiKey ? btoa(config.apiKey) : ''
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
        return true
    } catch (e) {
        console.error('保存配置失败:', e)
        return false
    }
}

export function loadConfig() {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (!data) return null

        const config = JSON.parse(data)
        // 解码 API Key
        return {
            ...config,
            apiKey: config.apiKey ? atob(config.apiKey) : ''
        }
    } catch (e) {
        console.error('加载配置失败:', e)
        return null
    }
}

export function clearConfig() {
    localStorage.removeItem(STORAGE_KEY)
}
