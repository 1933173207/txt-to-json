# Change Log

All notable changes to the "txt-to-json" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.2.2] - 2026-11-03

### Added

- 🔇 新增静默模式（配置项：`txtToJson.silent`）：
    - `true`：静默运行，不再弹出切换成功的提示消息
    - 静默模式下同时跳过打开文件时的切换询问弹窗
    - `false`：正常显示提示消息（默认）

### Technical Details

- 新增 `is_silent()` 函数读取 `txtToJson.silent` 配置，统一控制提示消息的显示
- 手动切换、自动切换成功后的提示消息受静默模式控制
- 错误消息不受静默模式影响，切换失败时仍会提示

## [0.2.1] - 2026-08-27

### Fixed

- 降低 VS Code 版本要求为 1.106.0 或更高版本

## [0.2.0] - 2026-05-12

### Added

- 🎯 新增 SVN 临时文件支持：`*_json.txt-*.tmp.txt`
- 🔧 支持更通用的临时文件模式：`*_json.txt.*.tmp.txt`
- 📝 改进了文件匹配逻辑，使用正则表达式进行模式匹配

### Fixed

- 🐛 修复 SVN UI 预览时插件无法识别临时文件的问题

## [0.1.0] - 2026-05-11

### Added

- ✨ 初始版本发布
- 🔄 支持在纯文本和 JSON 语法高亮之间双向切换
- ⌨️ 添加快捷键支持：
    - `alt+shift+j`：切换到 JSON 模式
    - `alt+shift+t`：切换到文本模式
- 🎯 智能文件检测：自动识别 `_json.txt` 文件
- 💬 自动提示功能：打开文件时询问是否切换
- 🌐 多语言支持：中英文界面可切换（配置项：`txtToJson.useChinese`）
- 📊 状态栏集成：显示当前语言模式，支持点击切换
- ⚙️ 灵活自动化配置（配置项：`txtToJson.autoBehavior`）：
    - `prompt`：弹出提示窗口询问
    - `auto`：自动切换，无需确认
    - `none`：不做任何操作

### Technical Details

- 使用 VS Code API 的 `vscode.languages.setTextDocumentLanguage` 实现语言切换
- 通过 `onDidChangeActiveTextEditor` 事件监听文件切换
- 状态栏动态更新，实时反映当前语言模式
