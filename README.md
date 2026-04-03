# lazy-aosp-build-helper

A VSCode extension for managing and executing predefined shell scripts through a command palette interface.

## Features

- **Command Palette Integration** - Execute scripts via `Cmd+Shift+P` → "Show Scripts"
- **Flexible Terminal Management** - Multiple terminal modes to suit different workflows:
  - **New Terminal** - Each execution opens a fresh terminal
  - **Shared Terminal** - Reuse a single terminal for all scripts (environment persists)
  - **Named Terminal** - Use a dedicated terminal by name, survives across sessions

- **Environment Initialization** - Configure `initCommand` to set environment variables when creating a named terminal for the first time

## Configuration

Edit `scripts-config.json` to define your scripts:

```json
{
  "scripts": [
    {
      "id": "unique-id",
      "title": "Display Name",
      "scriptPath": "scripts/your-script.sh",
      "description": "What this script does",
      "runInTerminal": true,
      "reuseTerminal": false,
      "terminalName": "Optional Terminal Name",
      "initCommand": "echo 'run once on new terminal'"
    }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (optional) |
| `title` | string | Display name in command palette |
| `scriptPath` | string | Path to shell script relative to extension root |
| `description` | string | Description shown in quick pick |
| `runInTerminal` | boolean | `true` = run in terminal, `false` = show message only |
| `reuseTerminal` | boolean | Use shared terminal (default: `false`) |
| `terminalName` | string | Use a named terminal (persists across executions) |
| `initCommand` | string | Command to run only when creating a new named terminal |

### Terminal Modes

| Mode | Configuration | Behavior |
|------|---------------|----------|
| New Terminal | Default (no special config) | Opens fresh terminal each time |
| Shared Terminal | `reuseTerminal: true` | Reuses "AOSP Build Helper" terminal |
| Named Terminal | `terminalName: "name"` | Uses dedicated terminal by name |

## Directory Structure

```
.
├── scripts/              # Shell scripts directory
│   ├── build.sh
│   ├── sync.sh
│   └── make.sh
├── scripts-config.json  # Script configuration
├── src/
│   └── extension.ts      # Main extension code
└── out/                 # Compiled output
```

## Usage

1. Add scripts to `scripts/` directory
2. Configure them in `scripts-config.json`
3. Press `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)
4. Type "Show Scripts" and select a script to run

## Extension Settings

This extension contributes the following command:

- `lazy-aosp-build-helper.showScripts` - Opens script selection menu
