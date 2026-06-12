# 皮肤区

约定：**一个主题 = 一个 CSS 文件**，只包含 `:root` 与 `.dark` 两块 token 值覆盖（合同见 `../shadcn.css`）。

用法：

1. 在 [tweakcn.com](https://tweakcn.com) 可视化调主题，导出 CSS；
2. 把导出的 `:root` / `.dark` 两块存为本目录下的 `<name>.css`；
3. 在 `../index.css` 末位取消注释并 import 它（后加载者赢）。
