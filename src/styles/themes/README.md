# 皮肤区

约定：**一个皮肤 = 一个 CSS 文件**，文件名即皮肤名，只含 token 值覆盖（合同见 `../shadcn.css`）。
`lib/skins.ts` 会 glob 本目录自动引入并生成皮肤列表——**新增皮肤 = 丢一个文件进来**，无需注册。
用户在 Theme Settings 面板（config-drawer）里选择，cookie 持久化，落在 `<html data-skin>` 上生效。

内置皮肤：

| 文件                 | 说明                                                          |
| -------------------- | ------------------------------------------------------------- |
| `default.css`        | shadcn/ui 官方默认值（出厂默认）                              |
| `claude.css`         | [tweakcn](https://tweakcn.com) 的 Claude 主题（暖米色 / 橙）  |
| `sunset-horizon.css` | [tweakcn](https://tweakcn.com) 的 Sunset Horizon（落日暖橙）  |
| `amethyst-haze.css`  | [tweakcn](https://tweakcn.com) 的 Amethyst Haze（紫水晶灰雾） |

新增皮肤（以 tweakcn 导出为例）：

1. 在 [tweakcn.com](https://tweakcn.com) 可视化调主题，导出 CSS；
2. 只保留合同内 token（颜色 + radius；字体/阴影等合同外变量裁掉），把两块选择器改写为：
   - `:root` → `:root[data-skin='<name>'], [data-skin='<name>']`
   - `.dark` → `:root[data-skin='<name>'].dark`
3. 存为本目录 `<name>.css`，完成（自动出现在 Theme Settings 面板里）。

选择器为何长这样：属性选择器抬高 specificity，皮肤覆盖 shadcn.css 默认值时不依赖加载顺序；
裸 `[data-skin]` 份额让任意元素可局部套用皮肤 token——config-drawer 的色板预览即此用法。
