import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ScriptConfig {
	id: string;
	title: string;
	scriptPath: string;
	description: string;
	runInTerminal: boolean;
	reuseTerminal?: boolean;
	terminalName?: string;
	initCommand?: string;
	preCommand?: string;
}

interface ScriptsConfig {
	scripts: ScriptConfig[];
}

function loadScriptsConfig(extensionPath: string): ScriptConfig[] {
	const configPath = path.join(extensionPath, 'scripts-config.json');
	try {
		const content = fs.readFileSync(configPath, 'utf-8');
		const config: ScriptsConfig = JSON.parse(content);
		return config.scripts || [];
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to load scripts-config.json: ${error}`);
		return [];
	}
}

let sharedTerminal: vscode.Terminal | undefined;
const namedTerminals: Map<string, vscode.Terminal> = new Map();

function getOrCreateSharedTerminal(): vscode.Terminal {
	if (!sharedTerminal || !sharedTerminal.exitStatus) {
		sharedTerminal = vscode.window.createTerminal({
			name: 'AOSP Build Helper',
			shellPath: '/bin/bash',
			shellArgs: ['-i']
		});
		sharedTerminal.show();
	}
	return sharedTerminal;
}

function getOrCreateNamedTerminal(name: string, initCommand?: string): vscode.Terminal {
	const existing = namedTerminals.get(name);
	if (existing && !existing.exitStatus) {
		return existing;
	}
	const terminal = vscode.window.createTerminal({
		name: name,
		shellPath: '/bin/bash',
		shellArgs: ['-i']
	});
	namedTerminals.set(name, terminal);
	terminal.show();
	if (initCommand) {
		terminal.sendText(initCommand);
	}
	return terminal;
}

function executeScriptInTerminal(script: ScriptConfig, extensionPath: string) {
	const fullPath = path.join(extensionPath, script.scriptPath);
	let terminal: vscode.Terminal;

	if (script.terminalName) {
		terminal = getOrCreateNamedTerminal(script.terminalName, script.initCommand);
	} else if (script.reuseTerminal) {
		terminal = getOrCreateSharedTerminal();
	} else {
		terminal = vscode.window.createTerminal({
			name: script.title,
			shellPath: '/bin/bash',
			shellArgs: ['-i']
		});
	}
	if (script.preCommand) {
		terminal.sendText(script.preCommand);
	}
	terminal.sendText(`bash "${fullPath}"`);
	terminal.show();
}

function executeScriptDirect(script: ScriptConfig) {
	vscode.window.showInformationMessage(script.description);
}

export function activate(context: vscode.ExtensionContext) {
	const scripts = loadScriptsConfig(context.extensionPath);

	const disposable = vscode.commands.registerCommand('lazy-aosp-build-helper.showScripts', async () => {
		if (scripts.length === 0) {
			vscode.window.showInformationMessage('No scripts configured.');
			return;
		}

		const items: vscode.QuickPickItem[] = scripts.map(script => ({
			label: script.title,
			description: script.description,
			detail: script.scriptPath || '(no script)'
		}));

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: 'Select a script to run'
		});

		if (!selected) {
			return;
		}

		const script = scripts.find(s => s.title === selected.label);
		if (!script) {
			return;
		}

		if (script.runInTerminal) {
			executeScriptInTerminal(script, context.extensionPath);
		} else {
			executeScriptDirect(script);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
