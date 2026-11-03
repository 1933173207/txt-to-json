# TXT to JSON

[![Version](https://img.shields.io/badge/version-0.2.2-green.svg)](https://marketplace.visualstudio.com/items?itemName=[jacky-6092].txt-to-json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

一键将 `_json.txt` 文件在纯文本和 JSON 语法高亮模式之间快速切换。

## 📋 功能特性

- 🔄 **双向切换**：在文本模式和 JSON 模式之间自由切换
- ⌨️ **快捷键支持**：使用快捷键快速切换，无需鼠标操作
- 🎯 **智能检测**：打开 `_json.txt` 文件时自动检测并提示切换
- 🌐 **多语言支持**：中英文界面可切换
- 📊 **状态栏集成**：状态栏显示当前模式，点击即可切换
- ⚙️ **灵活配置**：多种自动化行为可选
- 🔇 **静默模式**：可关闭所有提示消息，安静地完成切换

## 🎯 支持的文件格式

本扩展支持以下文件名模式：

1. **标准格式**：`*_json.txt`
    - 例如：`config_json.txt`、`data_json.txt`

2. **SVN 预览格式**：`*_json.txt-*.tmp.txt`
    - 例如：`config_json.txt-revHEAD.svn002.tmp.txt`

3. **其他临时文件**：`*_json.txt.*.tmp.txt`
    - 例如：`config_json.txt.20240101.tmp.txt`

## 🚀 快速开始

### 安装

1. 打开 VS Code
2. 进入扩展面板 (`Ctrl+Shift+X`)
3. 搜索 `TXT to JSON`
4. 点击安装

### 使用

1. 打开一个以 `_json.txt` 结尾的文件
2. 使用以下任一方式切换语言模式：

| 方式 | 操作 |
|------|------|
| **快捷键** | `alt+shift+j` (文本 → JSON)<br>`alt+shift+t` (JSON → 文本) |
| **命令面板** | `Ctrl+Shift+P` → 输入 "Convert TXT to JSON" |
| **状态栏** | 点击右下角状态栏按钮 |

## ⚙️ 配置选项

本扩展提供以下配置项，可在 VS Code 设置中修改 (`Ctrl+,`)：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `txtToJson.useChinese` | boolean | `false` | `true`：中文界面<br>`false`：英文界面 |
| `txtToJson.autoBehavior` | enum | `"prompt"` | `"prompt"`：弹出提示询问<br>`"auto"`：自动切换<br>`"none"`：不自动切换 |
| `txtToJson.silent` | boolean | `false` | `true`：静默模式，不弹出任何提示消息<br>`false`：正常显示提示消息 |

### 配置示例

在 `settings.json` 中添加：

```json
{
    "txtToJson.useChinese": true,
    "txtToJson.autoBehavior": "auto"
}
