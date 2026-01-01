#!/usr/bin/env python3
"""
通用 AI Provider 模型获取脚本
支持 OpenAI 兼容格式的 API，按创建时间倒序排列

使用方法: python fetch_models.py <provider> <API_KEY>
示例:
  python fetch_models.py openai sk-xxx
  python fetch_models.py openrouter sk-or-xxx
  python fetch_models.py siliconflow sk-xxx
  python fetch_models.py doubao xxx
"""

import sys
import json
import urllib.request

# Provider 配置
PROVIDERS = {
    'openai': {
        'url': 'https://api.openai.com/v1/models',
        'name': 'OpenAI',
    },
    'openrouter': {
        'url': 'https://openrouter.ai/api/v1/models',
        'name': 'OpenRouter',
    },
    'siliconflow': {
        'url': 'https://api.siliconflow.cn/v1/models',
        'name': 'SiliconFlow',
    },
    'doubao': {
        'url': 'https://ark.cn-beijing.volces.com/api/v3/models',
        'name': 'Doubao',
    },
    'deepseek': {
        'url': 'https://api.deepseek.com/models',
        'name': 'DeepSeek',
    },
    'groq': {
        'url': 'https://api.groq.com/openai/v1/models',
        'name': 'Groq',
    },
    'together': {
        'url': 'https://api.together.xyz/v1/models',
        'name': 'Together',
    },
    'mistral': {
        'url': 'https://api.mistral.ai/v1/models',
        'name': 'Mistral',
    },
    'minimax': {
        'url': 'https://api.minimax.chat/v1/models',
        'name': 'MiniMax',
    },
}

def fetch_models(provider: str, api_key: str):
    if provider not in PROVIDERS:
        print(f"❌ 不支持的 provider: {provider}")
        print(f"   支持的: {', '.join(PROVIDERS.keys())}")
        return
    
    config = PROVIDERS[provider]
    url = config['url']
    name = config['name']
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            # 提取模型列表
            models = data.get('data', data.get('models', []))
            
            if not models:
                print("未获取到模型数据")
                print(json.dumps(data, indent=2, ensure_ascii=False)[:500])
                return
            
            # 按 created 时间倒序排列（新的在前）
            models_sorted = sorted(
                models,
                key=lambda m: m.get('created', 0),
                reverse=True
            )
            
            # 生成简化列表
            simplified = []
            for m in models_sorted:
                simplified.append({
                    'id': m.get('id'),
                    'name': m.get('name', m.get('id')),
                    'created': m.get('created'),
                })
            
            # 生成 TypeScript 格式
            provider_id = provider.upper()
            ts_lines = []
            ts_lines.append(f"// {name} 模型列表 - 共 {len(simplified)} 个 (按时间倒序)")
            ts_lines.append(f"[PROVIDER_ID.{provider_id}]: [")
            for m in simplified:
                ts_lines.append(f"    {{ id: '{m['id']}', name: '{m['name']}' }},")
            ts_lines.append("],")
            
            output = {
                'provider': name,
                'total': len(simplified),
                'models': simplified,
                'typescript': '\n'.join(ts_lines),
            }
            
            # 写入文件
            output_file = f'{provider}_models.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(output, f, indent=2, ensure_ascii=False)
            
            print(f"✅ 已保存到 {output_file}")
            print(f"   模型数: {len(simplified)}")
            print(f"\n📋 前 10 个模型:\n")
            for m in simplified[:10]:
                print(f"   - {m['id']}")
                
    except urllib.error.HTTPError as e:
        print(f"HTTP 错误: {e.code}")
        try:
            print(e.read().decode('utf-8'))
        except:
            pass
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法: python fetch_models.py <provider> <API_KEY>")
        print(f"支持的 provider: {', '.join(PROVIDERS.keys())}")
        sys.exit(1)
    
    fetch_models(sys.argv[1].lower(), sys.argv[2])
