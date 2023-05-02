# GCoder-ChatGPT Assistant

> 一款基于 OpenAI Chat API 的助手项目

## 部署及使用

1. `在config_template.js`文件中输入 `OpenAI` 的 `Api Key` 和所需要使用的模型（推荐默认）
2. 将 `config_template.js` 改名为 `config.js`
3. 使用 `Docker` 进行编译
4. `Docker` 运行
5. 使用 `Docker Compose` 进行运行

## Todo 📝

-   [x] 基础聊天回答
-   [x] 可持续 Session 会话模式
-   [x] 历史聊天记录
-   [x] 智能搜索
-   [x] 高级搜索生成
-   [ ] 图像处理能力
-   [ ] 语言处理能力
-   [x] 适配深色模式

## Bugs 🐛

1. ~~上键显示历史输入记录后，无法通过`Esc`或者点击空白处关闭~~
2. ~~出现 OpenAI API 接口响应失败后显示为空~~
3. ~~修复智能输入框和输入‘/’冲突问题~~

## LICENSE

**Apache-2.0 license**
