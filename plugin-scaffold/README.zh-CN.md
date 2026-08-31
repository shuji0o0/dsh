# plugin-scaffold

DeepSeek Harness（DSH）的「插件生成器」插件：一个**模型工具** + 一个**侧边栏入口**，用来生成符合 `cordis-plugin-development` 规范的 Cordis 插件代码骨架。

## 功能

1. **`plugin_scaffold` 模型工具**（host 端注册）
   在对话里让 agent 按「名称 + 平台 + 类型」生成插件骨架代码，可直接用于 `cordis_define`。

2. **侧边栏「插件生成器」入口**（client 端 DOM 注入）
   排在「技能中心」下方，与任务看板 / SSH / 技能中心风格一致；点击打开浮层，产出可粘贴到对话里的提示。

## 安装

发布到 npm 后：

```sh
npx -y @deepseek-ai/dsh plugin --profile web add @shuji0o0/plugin-scaffold
```

若 `dsh` 提示 `declares no dsh.bundle`，说明装到了旧版本，请用 `npm view @shuji0o0/plugin-scaffold version` 查看版本后显式指定版本号安装。

安装完成后**重启 DSH**，侧边栏会出现「插件生成器」入口，模型工具 `plugin_scaffold` 也会生效。

## 使用

### 方式一：对话调用

直接说「用插件生成器生成一个名为 xxx 的 tool 类型 host 插件」，agent 会调用 `plugin_scaffold` 工具生成骨架。

### 方式二：侧边栏入口

点击侧边栏「插件生成器」→ 填写插件名 / 平台 / 类型 → 「生成提示」→ 复制提示粘贴到对话。

## 生成的骨架类型

| kind | 生成内容 | 平台 |
| --- | --- | --- |
| `basic` | 空骨架（服务 / 事件占位） | host |
| `tool` | 注册模型工具（`harness.registerTool`） | host |
| `event` | 监听事件（`ctx.on`） | host |
| `ui` | 注册 Client Slot UI（`slots.inject` + `React.createElement`） | client |
| `rpc` | Client→Host 通信（`harness.handle` + `host.call`） | both |

## 目录结构

```
plugin-scaffold/
├── index.js           # host 端：注册 plugin_scaffold 工具
├── client.js          # client 端：侧边栏入口 + 浮层（__ModuleLoader__ 工厂格式）
├── cordis.patch.yml   # dsh bundle patch：挂载 host 行
├── package.json
├── README.md
├── README.zh-CN.md
└── LICENSE
```

## 许可

MIT
