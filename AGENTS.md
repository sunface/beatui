# Agent 规则

beatui 是一个 UI 框架：`src/components/` 下的组件本身就是产品，`src/demo/` 只是展示窗口。

- 禁止以「demo/页面是否引用」判断组件去留。没被引用 ≠ 死代码。
- 被要求移除某个组件的使用时，只删用法，严禁顺手删除组件文件本身。删除 `src/components/` 下的文件需维护者明确同意。
- knip 中 `src/components/ui/**` 与 `src/components/features/**` 已声明为 `entry`（公开 API，见 knip.config.ts），「knip 报 unused」不构成删除理由。
