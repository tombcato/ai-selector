"""从 LiteLLM 获取 Together AI 模型并更新"""
import httpx, json, os

r = httpx.get('https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json', timeout=30)
data = r.json()

# 筛选 together_ai 模型
models = []
for k, v in data.items():
    if k.startswith('together_ai/') or k.startswith('together/'):
        mid = k.replace('together_ai/', '').replace('together/', '')
        name = mid.split('/')[-1] if '/' in mid else mid
        name = name.replace('-', ' ').replace('_', ' ').title()
        models.append({'id': mid, 'name': name})

# 去重
seen = set()
unique = []
for m in models:
    if m['id'] not in seen:
        seen.add(m['id'])
        unique.append(m)

# 更新 static-models.json
path = os.path.join(os.path.dirname(__file__), 'src/data/static-models.json')
with open(path, 'r', encoding='utf-8') as f:
    static = json.load(f)
static['together_ai'] = unique[:15]
with open(path, 'w', encoding='utf-8') as f:
    json.dump(static, f, indent=4, ensure_ascii=False)

print(f'✅ 已更新 together_ai 模型 ({len(unique[:15])} 个)')
for m in unique[:15]:
    print(f"  {m['name'][:35]:35} ({m['id'][:40]})")
