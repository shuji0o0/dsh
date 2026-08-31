# plugin-scaffold

A DeepSeek Harness (DSH) plugin generator: a **model tool** plus a **sidebar entry** that produce Cordis plugin code skeletons conforming to the `cordis-plugin-development` conventions.

## Features

1. **`plugin_scaffold` model tool** (host side)
   Generates a plugin skeleton by name / platform / kind, ready for `cordis_define`.

2. **Sidebar "插件生成器" entry** (client side, DOM-injected)
   Sits below the skill center, styled like the task board / SSH / skill center entries. Clicking opens an overlay that produces a prompt you can paste into the conversation.

## Install

Once published to npm:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add @shuji0o0/plugin-scaffold
```

If `dsh` warns `declares no dsh.bundle`, an old version was installed — run `npm view @shuji0o0/plugin-scaffold version` and install the explicit version instead.

Restart DSH after installing: the sidebar entry and the `plugin_scaffold` tool both come online.

## Usage

### Via conversation

Say "generate a tool-type host plugin named xxx with the plugin generator" and the agent calls `plugin_scaffold`.

### Via the sidebar entry

Click "插件生成器" in the sidebar → fill in name / platform / kind → "生成提示" → copy the prompt into the conversation.

## Skeleton kinds

| kind | What it generates | Platform |
| --- | --- | --- |
| `basic` | Empty skeleton (service / event placeholders) | host |
| `tool` | Model tool registration (`harness.registerTool`) | host |
| `event` | Event listener (`ctx.on`) | host |
| `ui` | Client Slot UI (`slots.inject` + `React.createElement`) | client |
| `rpc` | Client→Host RPC (`harness.handle` + `host.call`) | both |

## Layout

```
plugin-scaffold/
├── index.js           # host half: registers the plugin_scaffold tool
├── client.js          # client half: sidebar entry + overlay (__ModuleLoader__ factory)
├── cordis.patch.yml   # dsh bundle patch: mounts the host row
├── package.json
├── README.md
├── README.zh-CN.md
└── LICENSE
```

## License

MIT
