import { defineTool } from "@deepseek-ai/dsh-tools";

// 插件生成器：注册 plugin_scaffold 工具，按名称/平台/类型生成
// 符合 cordis-plugin-development 规范的 Cordis 插件代码骨架。
const name = "插件生成器";
const inject = ["tools"];

function buildScaffold(args) {
  const pname = (args.name || "my-plugin").trim();
  const platform = args.platform || "host";
  const kind = args.kind || "basic";
  const toolName = (args.toolName || (pname + "-tool")).trim();
  const eventName = (args.eventName || "some/event").trim();
  const slotName = (args.slotName || "target.slot").trim();

  const hostBlocks = [];
  const clientBlocks = [];
  const note = [];

  if (kind === "basic") {
    hostBlocks.push(
      "return {\n  name: '" + pname + "',\n  apply(ctx) {\n" +
      "    // TODO: 用 ctx.get('serviceName') 读取可选服务，或声明 inject 硬依赖；\n" +
      "    // 用 ctx.on(...) 监听事件，用 ctx.effect(...) 持有可逆副作用。\n  },\n}"
    );
  } else if (kind === "tool") {
    hostBlocks.push(
      "return {\n  name: '" + pname + "',\n  apply(ctx) {\n" +
      "    harness.registerTool(ctx, harness.defineTool({\n" +
      "      name: '" + toolName + "',\n" +
      "      description: '描述这个工具做什么，以及何时使用。',\n" +
      "      parameters: {\n        input: { type: 'string', required: true, description: '参数说明。' },\n      },\n" +
      "      output: {\n        schema: { type: 'string' },\n        render(_a, v) { return [{ type: 'text', text: v }] },\n      },\n" +
      "      async execute(args) {\n        return '收到: ' + String(args.input)\n      },\n" +
      "    }))\n  },\n}"
    );
    note.push("生成的骨架面向动态插件（cordis_define 环境，用 harness）；若要写成持久化 npm 包，改用 import { defineTool } from '@deepseek-ai/dsh-tools' + ctx.tools.register。");
  } else if (kind === "event") {
    hostBlocks.push(
      "return {\n  name: '" + pname + "',\n  apply(ctx) {\n" +
      "    ctx.on('" + eventName + "', (payload) => {\n      console.log(payload)\n    })\n  },\n}"
    );
    note.push("Waterfall 事件的最后一个参数是 next，除非有意截断，否则必须调用并 return next()。");
  } else if (kind === "ui") {
    clientBlocks.push(
      "return {\n  name: '" + pname + "',\n  apply(ctx) {\n" +
      "    const slots = ctx.get('slots')\n    if (slots === undefined) return\n" +
      "    slots.inject('" + slotName + "', () => slots.register(\n" +
      "      { name: '" + slotName + "', key: 'self' },\n" +
      "      () => React.createElement('div', null, 'Hello from " + pname + "'),\n    ))\n  },\n}"
    );
    note.push("Client 用 React.createElement，禁止 JSX；先查询 Slots.listSubTree 确认 Slot 与注册协议。");
  } else if (kind === "rpc") {
    hostBlocks.push(
      "return {\n  name: '" + pname + "',\n  apply(ctx) {\n" +
      "    harness.handle('echo', async (args) => {\n      return { received: args }\n    })\n  },\n}"
    );
    clientBlocks.push(
      "return {\n  name: '" + pname + "',\n  async apply(ctx) {\n" +
      "    const result = await host.call('echo', { hello: 'world' })\n" +
      "    console.log(result.received)\n  },\n}"
    );
    note.push("rpc 用于动态插件（host 有 harness，client 有 host）；持久化插件的跨线通信需用 Service 或 Remote 接口。");
  } else {
    return "未知 kind: " + kind + "。可选：basic / tool / event / ui / rpc。";
  }

  const parts = [];
  parts.push('# "' + pname + '" 插件骨架');
  parts.push("kind=" + kind + "  platform=" + platform + "\n");
  if ((platform === "host" || platform === "both") && hostBlocks.length) {
    parts.push("--- code.host ---");
    parts.push(hostBlocks.join("\n"));
  }
  if ((platform === "client" || platform === "both") && clientBlocks.length) {
    parts.push("\n--- code.client ---");
    parts.push(clientBlocks.join("\n"));
  }
  if (note.length) {
    parts.push("\n注意:");
    note.forEach((n) => parts.push("- " + n));
  }
  parts.push("\n生成后：用 cordis_define 定义（kind=new 给 idPrefix，或 existing 追加到已有插件），再 cordis_run 激活。");
  return parts.join("\n");
}

function apply(ctx) {
  ctx.tools.register(defineTool({
    name: "plugin_scaffold",
    description: "生成动态 Cordis 插件的代码骨架。输入插件名、平台和类型，输出符合规范、可直接用于 cordis_define 的纯 JavaScript host/client 代码。",
    parameters: {
      name: { type: "string", required: true, description: "插件名（返回对象里 name 字段的值，kebab-case）。" },
      platform: { type: "string", required: true, description: "目标平台：host / client / both。" },
      kind: { type: "string", required: true, description: "骨架类型：basic（空骨架）/ tool（注册模型工具）/ event（监听事件）/ ui（注册 Client Slot UI）/ rpc（Client 到 Host 通信）。" },
      toolName: { type: "string", description: "kind=tool 时的工具名。" },
      eventName: { type: "string", description: "kind=event 时的事件名。" },
      slotName: { type: "string", description: "kind=ui 时的 Slot 名。" },
    },
    output: {
      schema: { type: "string" },
      render: (_args, value) => [{ type: "text", text: value }],
    },
    async execute(args) {
      return buildScaffold(args);
    },
  }));
}

export { apply, inject, name };
