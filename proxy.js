// 本地映射代理: Claude 模型名 -> GLM 模型名 (思考强度用 low/medium/high 等档位表示)
// modelMap 条目:
//   "glm-5.3"                              简写, 不注入思考配置
//   { "model": "...", "thinking": "high" } 档位见 mapping.json 的 thinkingLevels
//   thinking 也支持直接写数字 (自定义 budget_tokens)
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

const cfg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "mapping.json"), "utf8")
);
const LEVELS = cfg.thinkingLevels || {
  off: null,
  low: 2048,
  medium: 10240,
  high: 32000,
  max: 65536,
};

// 模型名匹配: 先精确匹配, 再前缀匹配 (claude-opus 能匹配 claude-opus-4-7)
function findEntry(name) {
  if (!name) return null;
  if (cfg.modelMap[name]) return cfg.modelMap[name];
  for (const [k, v] of Object.entries(cfg.modelMap)) {
    if (name.startsWith(k)) return v;
  }
  return null;
}

function entryModel(entry) {
  return typeof entry === "string" ? entry : entry.model;
}

// 把档位/数字/null 统一解析成 budget_tokens
function resolveBudget(thinking) {
  if (thinking == null) return null;
  if (typeof thinking === "number") return thinking;
  if (Object.prototype.hasOwnProperty.call(LEVELS, thinking)) {
    return LEVELS[thinking]; // "off" 返回 null
  }
  return undefined; // 未知档位
}

const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  let body = Buffer.concat(chunks);

  if (body.length && req.method === "POST") {
    try {
      const data = JSON.parse(body.toString("utf8"));
      const entry = findEntry(data.model);
      if (entry) {
        const mapped = entryModel(entry);
        console.log(`[map] ${data.model} -> ${mapped}`);
        data.model = mapped;

        if (data.thinking) {
          console.log(`[map] 思考模式: 客户端自带, 保留原样`);
        } else if (typeof entry === "object" && entry !== null && "thinking" in entry) {
          const budget = resolveBudget(entry.thinking);
          if (budget === undefined) {
            console.log(`[map] 思考档位未知: ${entry.thinking}, 忽略`);
          } else if (budget === null) {
            data.thinking = { type: "disabled" };
            console.log(`[map] 思考模式: off (关闭)`);
          } else {
            data.thinking = { type: "enabled", budget_tokens: budget };
            console.log(`[map] 思考模式: budget=${budget}`);
          }
        }
      } else {
        console.log(`[map] ${data.model} 无匹配, 保持原名`);
      }
      body = Buffer.from(JSON.stringify(data), "utf8");
    } catch (e) {
      console.error("[warn] body 解析失败, 原样转发:", e.message);
    }
  }

  const url = cfg.upstream + req.url;
  const headers = {
    "content-type": "application/json",
    "anthropic-version": req.headers["anthropic-version"] || "2023-06-01",
    authorization: `Bearer ${cfg.apiKey}`,
    // 上游 br 流被截断时 undici 解压会报 BrotliDecompressionError，只允许 gzip
    "accept-encoding": "gzip, deflate",
  };
  if (body.length) headers["content-length"] = Buffer.byteLength(body);

  const controller = new AbortController();
  const onClose = () => { if (!res.writableFinished) controller.abort(); };
  res.on("close", onClose);
  try {
    const upstream = await fetch(url, {
      method: req.method,
      signal: controller.signal,
      headers,
      body: req.method === "POST" || req.method === "PUT" ? body : undefined,
    });
    // fetch decodes compressed bodies; its original encoding/length no longer apply.
    const responseHeaders = Object.fromEntries(upstream.headers);
    const connectionHeaders = (upstream.headers.get("connection") || "")
      .split(",").map(h => h.trim().toLowerCase()).filter(Boolean);
    for (const name of [
      "content-encoding", "content-length", "transfer-encoding", "connection",
      "keep-alive", "proxy-authenticate", "proxy-authorization", "te",
      "trailer", "upgrade", ...connectionHeaders,
    ]) delete responseHeaders[name];
    res.writeHead(upstream.status, responseHeaders);
    res.flushHeaders();

    if (upstream.body) {
      // Preserve SSE streaming and apply backpressure without buffering the response.
      await pipeline(Readable.fromWeb(upstream.body), res);
    } else {
      res.end();
    }
  } catch (e) {
    console.error("[error]", e.message);
    if (res.headersSent || res.destroyed) {
      if (!res.destroyed) res.destroy();
    } else {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: { message: "Upstream request failed" } }));
    }
  } finally {
    res.off("close", onClose);
  }
});

server.on("connection", (socket) => socket.setNoDelay(true));

server.listen(cfg.port, () => {
  console.log(`Claude映射代理已启动: http://127.0.0.1:${cfg.port}`);
  console.log(`上游: ${cfg.upstream}`);
  console.log("模型映射 (思考强度):");
  for (const [k, v] of Object.entries(cfg.modelMap)) {
    const m = entryModel(v);
    const t = typeof v === "object" && v !== null && "thinking" in v ? v.thinking : "-";
    console.log(`  ${k}* -> ${m}  (思考: ${t})`);
  }
});
