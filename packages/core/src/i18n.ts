export const I18N = {
    zh: {
        save: '保存配置',
        saved: '保存成功',
        selectProvider: '选择 Provider...',
        customBaseUrl: '自定义 Base URL',
        apiKeyPlaceholder: '输入 API Key...',
        testSuccess: '连接成功',
        testFailed: '连通性测试失败，请检查 API Key 有效性',
        selectModel: '选择 Model...',
        searchModel: '搜索或自定义模型...',
        useCustom: '使用自定义',
        noModels: '暂无模型数据',
        apiKeyTip: '输入 API Key 后可获取完整模型列表',
        preview: '配置预览',
        unselected: '(未选择)',
    },
    en: {
        save: 'Save Config',
        saved: 'Saved',
        selectProvider: 'Select Provider...',
        customBaseUrl: 'Custom Base URL',
        apiKeyPlaceholder: 'Enter API Key...',
        testSuccess: 'Connection Successful',
        testFailed: 'Connection failed, please check your API Key',
        selectModel: 'Select Model...',
        searchModel: 'Search or custom models...',
        useCustom: 'Use custom',
        noModels: 'No models found',
        apiKeyTip: 'Enter API Key to fetch full model list',
        preview: 'Config Preview',
        unselected: '(Unselected)',
    }
} as const;

export type Language = keyof typeof I18N;
export type I18NKeys = keyof typeof I18N['zh'];

