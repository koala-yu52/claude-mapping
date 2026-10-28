# Claude 本地映射代理（claude-mapping）

把 Claude Desktop / Claude Code 请求中的 Claude 模型名映射到国产大模型（如 GLM）的纯本地 Node 代理脚本。无第三方软件，Token 全部走你自己申请的 API Key。

> ⚠️ **仅限本机 `127.0.0.1` 本地学习测试，禁止公网部署、禁止对外提供中转服务。**

- 📖 在线阅读教程：[本地代理使用教程](docs/tutorial.md)
- 📄 离线 PDF 手册：[本地代理使用手册.pdf](docs/本地代理使用手册.pdf)
- 📦 一键下载代理脚本压缩包：[claude-mapping.zip](claude-mapping.zip)

> 下载 zip 后解压，阅读教程再启动；所有上游 API Key 需要自行在各大模型开放平台申请。

## 文件说明

| 文件 | 作用 |
|---|---|
| `proxy.js` | 本地映射代理主脚本（Node.js，无第三方依赖） |
| `mapping.json` | 配置：端口、上游地址、API Key、模型映射与思考强度 |
| `start-proxy.bat` | Windows 双击启动脚本 |
| `claude-mapping.zip` | 上述脚本的打包下载 |

## 快速开始

```bash
# 1. 编辑 mapping.json，填入 upstream、apiKey 和 modelMap
# 2. 启动（或直接双击 start-proxy.bat）
node proxy.js
# 3. 在 Claude Desktop 的 Developer - Configure third-party inference 里
#    填入终端显示的 http://127.0.0.1:8082
```

详细图文步骤见 [docs/tutorial.md](docs/tutorial.md)。

## mapping.json 示例

```json
{
  "port": 8082,
  "upstream": "<上游 API 地址>",
  "apiKey": "<你的 API Key>",
  "modelMap": {
    "claude-sonnet-5": { "model": "<映射到的模型>", "thinking": "high" },
    "claude-opus-5": { "model": "<映射到的模型>" }
  }
}
```

思考强度档位（`thinking`）：`off` / `low` / `medium` / `high` / `max`，也支持直接写数字自定义 `budget_tokens`。

## 许可

仅供个人学习和参考使用，禁止修改监听地址为公网、禁止搭建公共中转服务。
