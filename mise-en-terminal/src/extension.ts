
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { env } from 'process';
import * as vscode from 'vscode';
import { TextDecoder } from 'util';

interface metrcConfig {
	basePath?: string | null;
	terminals: metrcTerminal[];
}

interface metrcTerminal {
	name: string;
	path?: string | null;
	commands: string[];
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let terminals : vscode.Terminal[] = [];

	const run = async () => {
		if(!vscode.workspace.workspaceFolders) {
			vscode.window.showInformationMessage('Mise En Terminal must be run in a workspace!');
			return;
		}

		var configUri = await vscode.workspace.findFiles('.metrc.json', '/node_modules/', 1);
		var workspaceUri = vscode.workspace.getWorkspaceFolder(configUri[0]);
		var encodedText = await vscode.workspace.fs.readFile(configUri[0]);
		var stringOutput = new TextDecoder('utf-8').decode(encodedText);
		var configJson : metrcConfig = JSON.parse(stringOutput);

		configJson.terminals.map(t => {
			const terminalOptions : vscode.TerminalOptions = {
				name: t.name,
				cwd: workspaceUri?.uri ? vscode.Uri.joinPath(workspaceUri?.uri, (t.path ?? "")) : (t.path ?? "")
			};

			const terminal = vscode.window.createTerminal(terminalOptions);
			terminals.push(terminal);
			terminal.show();

			t.commands.forEach(c => terminal.sendText(c, true));
		});
	};

	console.log('Congratulations, your extension "mise-en-terminal" is now active!');

	let disposable = vscode.commands.registerCommand('mise-en-terminal.closeOpened', () => {
		terminals.forEach(t => t.dispose());
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('mise-en-terminal.closeAndRun', async () => {
		vscode.window.terminals.forEach(t => t.dispose());
		await run();
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('mise-en-terminal.run', run);
	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() {}
