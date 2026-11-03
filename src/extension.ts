import * as vscode from "vscode";

// Define the logging messages for different languages.
const logging_messages = {
    zh: {
        // Warning messages.
        no_editor: "没有打开的编辑器",
        not_supported: "不支持的文件类型",

        // Information messages.
        already_json: "文件已经是 JSON 模式",
        already_text: "文件已经是文本模式",
        switched_to_json: (file: string) => `已将 ${file} 切换为 JSON 模式`,
        switched_to_text: (file: string) => `已将 ${file} 切换为文本模式`,
        auto_switched_to_json: (file: string) => `已将 ${file} 自动切换为 JSON 模式`,

        // Error messages.
        switch_failed: (error: string) => `切换失败: ${error}`,

        // Prompt messages.
        detected_prompt: (file: string) => `检测到 ${file} 可能是 JSON 文件，是否切换为 JSON 模式？`,
        switch_button: "切换",
        cancel_button: "取消",

        // Status bar messages.
        json_mode: "JSON 模式",
        text_mode: "文本模式",
        click_to_switch_to_json: "点击切换到 JSON 模式",
        click_to_switch_to_text: "点击切换到文本模式"
    },
    en: {
        // Warning messages.
        no_editor: "No active editor found",
        not_supported: "Unsupported file type",

        // Information messages.
        already_json: "The file is already in JSON mode",
        already_text: "The file is already in text mode",
        switched_to_json: (file: string) => `Switched ${file} to JSON mode`,
        switched_to_text: (file: string) => `Switched ${file} to text mode`,
        auto_switched_to_json: (file: string) => `Automatically switched ${file} to JSON mode`,

        // Error messages.
        switch_failed: (error: string) => `Switching failed: ${error}`,

        // Prompt messages.
        detected_prompt: (file: string) => `Detected that ${file} might be a JSON file. Do you want to switch to JSON mode?`,
        switch_button: "Switch",
        cancel_button: "Cancel",

        // Status bar messages.
        json_mode: "JSON Mode",
        text_mode: "Text Mode",
        click_to_switch_to_json: "Click to switch to JSON mode",
        click_to_switch_to_text: "Click to switch to text mode"
    }
}


// Utility function to extract the file name from a full path.
function get_file_name(file_full_path: string): string {
    return file_full_path.split(/[\\/]/).pop() || file_full_path;
}


// Check if the file should be handled by this extension.
function should_handle_file(file_name: string): boolean {
    const lower_file_name = file_name.toLowerCase();

    // Pattern 1: Standard _json.txt file.
    if (lower_file_name.endsWith("_json.txt")) {
        return true;
    }

    // Pattern 2: SVN temp file: config_json.txt-revHEAD.svn002.tmp.txt.
    // Pattern: *_json.txt-*.tmp.txt
    if (lower_file_name.includes("_json.txt-") && lower_file_name.endsWith(".tmp.txt")) {
        return true;
    }

    // Pattern 3: More general pattern for any temp JSON file.
    // Matches: *_json.txt.*.tmp.txt or *_json.txt-*.tmp.txt.
    const temp_json_pattern = /_json\.txt[-.].+\.tmp\.txt$/i;
    if (temp_json_pattern.test(lower_file_name)) {
        return true;
    }

    return false;
}


// Get messages based on the user's language preference.
function get_messages(): typeof logging_messages.zh {
    const config = vscode.workspace.getConfiguration("txtToJson");
    const use_chinese = config.get<boolean>("useChinese", false);

    return use_chinese?logging_messages.zh:logging_messages.en;
}


// Check if silent mode is enabled, which suppresses all informational messages.
function is_silent(): boolean {
    const config = vscode.workspace.getConfiguration("txtToJson");
    return config.get<boolean>("silent", false);
}


// This method is called when your extension is activated.
export function activate(context: vscode.ExtensionContext) {
    console.log("Extension \"txt-to-json\" is now active!");

    // Command 1: Convert TXT to JSON.
    const command_to_json = vscode.commands.registerCommand("txt-to-json.toJson", async () => {
        const editor = vscode.window.activeTextEditor;
        const msg = get_messages();

        if (!editor) {
            vscode.window.showErrorMessage(msg.no_editor);
            return;
        }

        const document = editor.document;
        const file_name = get_file_name(document.fileName);

        // Check if the file should be handled.
        if (!should_handle_file(file_name)) {
            vscode.window.showErrorMessage(msg.not_supported);
            return;
        }

        // Check if the current file is already in JSON language.
        if (document.languageId === "json") {
            vscode.window.showErrorMessage(msg.already_json);
            return;
        }

        try {
            await vscode.languages.setTextDocumentLanguage(document, "json");
            if (!is_silent()) {
                vscode.window.showInformationMessage(msg.switched_to_json(file_name));
            }
        } catch (error) {
            const message = error instanceof Error?error.message:String(error);
            vscode.window.showErrorMessage(msg.switch_failed(message));
        }
    });

    // Command 2: Convert JSON to TXT.
    const command_to_txt = vscode.commands.registerCommand("txt-to-json.toText", async () => {
        const editor = vscode.window.activeTextEditor;
        const msg = get_messages();

        if (!editor) {
            vscode.window.showErrorMessage(msg.no_editor);
            return;
        }

        const document = editor.document;
        const file_name = get_file_name(document.fileName);

        // Check if the file should be handled.
        if (!should_handle_file(file_name)) {
            vscode.window.showErrorMessage(msg.not_supported);
            return;
        }

        // Check if the current file is already in TXT language.
        if (document.languageId === "plaintext") {
            vscode.window.showErrorMessage(msg.already_text);
            return;
        }

        try {
            await vscode.languages.setTextDocumentLanguage(document, "plaintext");
            if (!is_silent()) {
                vscode.window.showInformationMessage(msg.switched_to_text(file_name));
            }
        } catch (error) {
            const message = error instanceof Error?error.message:String(error);
            vscode.window.showErrorMessage(msg.switch_failed(message));
        }
    });

    // Event 1: Automatically converting TXT to JSON.
    const auto_detect = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (!editor) {
            return;
        }

        const msg = get_messages();
        const document = editor.document;
        const file_name = get_file_name(document.fileName);
        const auto_behavior = vscode.workspace.getConfiguration("txtToJson").get<string>("autoBehavior", "prompt");

        // Check if the file needs to be converted.
        if (!should_handle_file(file_name)) {
            return;
        }

        // Check if the current file is already in JSON language.
        if (document.languageId === "json") {
            return;
        }

        switch (auto_behavior) {
            case "auto": {
                try {
                    await vscode.languages.setTextDocumentLanguage(document, "json");
                    if (!is_silent()) {
                        vscode.window.showInformationMessage(msg.auto_switched_to_json(file_name));
                    }
                } catch (error) {
                    const message = error instanceof Error?error.message:String(error);
                    vscode.window.showErrorMessage(msg.switch_failed(message));
                }
                break;
            }
            case "prompt": {
                // In silent mode, do not show the prompt dialog.
                if (is_silent()) {
                    break;
                }

                const choice = await vscode.window.showInformationMessage(
                    msg.detected_prompt(file_name),
                    msg.switch_button,
                    msg.cancel_button
                );

                if (choice === msg.switch_button) {
                    try {
                        await vscode.languages.setTextDocumentLanguage(document, "json");
                        vscode.window.showInformationMessage(msg.auto_switched_to_json(file_name));
                    } catch (error) {
                        const message = error instanceof Error?error.message:String(error);
                        vscode.window.showErrorMessage(msg.switch_failed(message));
                    }
                }
                break;
            }
            case "none": {
                // Do nothing.
                break;
            }
        }
    });

    // The status bar item will only be shown for files that are supported.
    const status_bar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    const update_status_bar = () => {
        const editor = vscode.window.activeTextEditor;
        const msg = get_messages();

        if (editor && should_handle_file(editor.document.fileName)) {
            const is_json = editor.document.languageId === "json";

            status_bar_item.text = is_json?`$(json) ${msg.json_mode}`:`$(file-code) ${msg.text_mode}`;
            status_bar_item.tooltip = is_json?msg.click_to_switch_to_text:msg.click_to_switch_to_json;
            status_bar_item.command = is_json?"txt-to-json.toTxt":"txt-to-json.toJson";
            status_bar_item.show();
        } else {
            status_bar_item.hide();
        }
    };

    // Whenever the configuration changes (including language switch), update the status bar.
    const config_change_listener = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("txtToJson")) {
            console.log("Configuration changed, updating status bar...");
            update_status_bar();
        }
    });

    // Whenever the active editor changes or the document language changes, update the status bar.
    context.subscriptions.push(
        command_to_json,
        command_to_txt,
        auto_detect,
        status_bar_item,
        vscode.window.onDidChangeActiveTextEditor(update_status_bar),
        vscode.workspace.onDidChangeTextDocument((event) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                update_status_bar();
            }
        }),
        config_change_listener
    );
    
    update_status_bar();
}


// This method is called when your extension is deactivated.
export function deactivate() {
    console.log("Extension \"txt-to-json\" is now deactivated!");
}
