# Claude 本地映射代理（claude-mapping）

把 Claude Desktop / Claude Code 请求中的 Claude 模型名映射到国产大模型（如 GLM）的纯本地 Node 代理脚本。无第三方软件，Token 全部走你自己申请的 API Key。

> ⚠️ **仅限本机 `127.0.0.1` 本地学习测试，禁止公网部署、禁止对外提供中转服务。**

- 📖 在线阅读教程（中文）：[docs/中文/使用教程.md](docs/中文/使用教程.md) ｜ English tutorial: [docs/English/tutorial-en.md](docs/English/tutorial-en.md)
- 📄 离线 PDF 手册：[中文版](docs/中文/本地代理使用手册.pdf) ｜ [English](docs/English/Tutorial-User-Manual.pdf)
- 📦 一键下载代理脚本压缩包：[claude-mapping.zip](claude-mapping.zip)

> 下载 zip 后解压，阅读教程再启动；所有上游 API Key 需要自行在各大模型开放平台申请。

## 项目定位

全网已有不少通用的 OpenAI → Anthropic 协议转换代理项目，但缺少面向国内用户、配套完整中文实操文档、并整合多家国产大模型的一站式教程。本仓库附带自研的本地代理脚本，专注解决 Claude Desktop / Claude Code 通过本地代理接入国产 OpenAI 格式大模型的落地问题，仅供个人本地学习研究。

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

详细图文步骤见 [docs/中文/使用教程.md](docs/中文/使用教程.md)（English: [docs/English/tutorial-en.md](docs/English/tutorial-en.md)）。

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

---

# English

A pure-local Node proxy that maps Claude model names in Claude Desktop / Claude Code requests to Chinese LLMs (e.g. GLM). No third-party software — all tokens go through the API key you apply for yourself.

> ⚠️ **For local learning and testing on `127.0.0.1` only. Public-network deployment and public relay services are strictly prohibited.**

- 📖 Tutorial (English): [docs/English/tutorial-en.md](docs/English/tutorial-en.md) ｜ 中文教程: [docs/中文/使用教程.md](docs/中文/使用教程.md)
- 📄 Offline PDF manual: [English](docs/English/Tutorial-User-Manual.pdf) ｜ [中文版](docs/中文/本地代理使用手册.pdf)
- 📦 One-click download of the proxy scripts: [claude-mapping.zip](claude-mapping.zip)

> Download and extract the zip, read the tutorial before starting; all upstream API keys must be obtained from the model providers' open platforms yourself.

## Why this project exists

Plenty of generic OpenAI → Anthropic protocol-conversion proxy projects already exist, but there is no one-stop tutorial aimed at Chinese users, complete with full hands-on Chinese documentation and covering multiple Chinese LLM providers. This repo ships a self-developed local proxy script focused on one concrete problem: getting Claude Desktop / Claude Code connected to OpenAI-compatible Chinese LLMs through a local proxy. For personal local learning and research only.

## Files

| File | Purpose |
|---|---|
| `proxy.js` | Main mapping-proxy script (Node.js, zero dependencies) |
| `mapping.json` | Config: port, upstream URL, API key, model mapping & thinking strength |
| `start-proxy.bat` | Windows double-click launcher |
| `claude-mapping.zip` | Packaged download of the scripts above |

## Quick start

```bash
# 1. Edit mapping.json: fill in upstream, apiKey and modelMap
# 2. Start it (or just double-click start-proxy.bat)
node proxy.js
# 3. In Claude Desktop: Developer - Configure third-party inference,
#    enter the http://127.0.0.1:8082 shown in the terminal
```

Full illustrated steps: [docs/English/tutorial-en.md](docs/English/tutorial-en.md) (中文: [docs/中文/使用教程.md](docs/中文/使用教程.md)).

## mapping.json example

```json
{
  "port": 8082,
  "upstream": "<upstream API URL>",
  "apiKey": "<your API key>",
  "modelMap": {
    "claude-sonnet-5": { "model": "<target model>", "thinking": "high" },
    "claude-opus-5": { "model": "<target model>" }
  }
}
```

Thinking levels (`thinking`): `off` / `low` / `medium` / `high` / `max`, or a plain number for a custom `budget_tokens`.

## License

For personal learning and reference only. Modifying the listening address to a public network or setting up a public relay service is prohibited.

