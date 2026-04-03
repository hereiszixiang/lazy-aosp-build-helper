# lazy-aosp-build-helper

一款 VSCode 插件，通过命令面板界面管理和执行预定义的 shell 脚本。

## ⚠️ 需要手动配置

使用此插件需要手动配置：
1. 将你的 shell 脚本添加到 `scripts/` 目录
2. 在 `scripts-config.json` 中配置脚本

配置完成后，通过 `Cmd+Shift+P` → "Show Scripts" 访问脚本。

## 功能特性

- **命令面板集成** - 通过 `Cmd+Shift+P` → "Show Scripts" 执行脚本
- **灵活的终端管理** - 多种终端模式满足不同工作流需求：
  - **新终端** - 每次执行打开一个新的终端
  - **共享终端** - 复用单个终端执行所有脚本（环境变量持久化）
  - **命名终端** - 使用指定名称的专用终端，跨执行会话持久化

- **环境初始化** - 配置 `initCommand` 可在首次创建命名终端时设置环境变量

## 配置说明

编辑 `scripts-config.json` 来定义脚本：

```json
{
  "scripts": [
    {
      "id": "唯一标识",
      "title": "显示名称",
      "scriptPath": "scripts/你的脚本.sh",
      "description": "脚本描述",
      "runInTerminal": true,
      "reuseTerminal": false,
      "terminalName": "可选终端名称",
      "initCommand": "echo '新终端时执行一次'"
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符（可选） |
| `title` | string | 在命令面板中显示的名称 |
| `scriptPath` | string | 脚本路径（相对于插件根目录） |
| `description` | string | 快速选择中的描述 |
| `runInTerminal` | boolean | `true` = 在终端中运行，`false` = 仅显示消息 |
| `reuseTerminal` | boolean | 使用共享终端（默认 `false`） |
| `terminalName` | string | 使用指定名称的终端（跨执行持久化） |
| `initCommand` | string | 仅在创建新命名终端时执行一次 |

### 终端模式

| 模式 | 配置方式 | 行为 |
|------|----------|------|
| 新终端 | 默认（无特殊配置） | 每次打开新终端 |
| 共享终端 | `reuseTerminal: true` | 复用 "AOSP Build Helper" 终端 |
| 命名终端 | `terminalName: "名称"` | 使用指定名称的专用终端 |

## 目录结构

```
.
├── scripts/              # Shell 脚本目录
│   ├── build.sh
│   ├── sync.sh
│   └── make.sh
├── scripts-config.json  # 脚本配置
├── src/
│   └── extension.ts      # 插件主代码
└── out/                  # 编译输出
```

## 使用方法

1. 将脚本添加到 `scripts/` 目录
2. 在 `scripts-config.json` 中配置脚本
3. 按 `Cmd+Shift+P`（Mac）/ `Ctrl+Shift+P`（Windows/Linux）
4. 输入 "Show Scripts" 并选择要执行的脚本

## 插件设置

本插件提供以下命令：

- `lazy-aosp-build-helper.showScripts` - 打开脚本选择菜单
