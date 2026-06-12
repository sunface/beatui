# Admin Template 改造方案

> 基于 shadcn-admin (satnaing/shadcn-admin v2.2.1) 改造为可复用的 admin 模板。
> 状态：**已执行完成**（lint / 114 测试 / build / starter 派生全部验证通过）。未决问题见文末。
>
> 执行中的三处裁定补充：
> 1. `config/fonts.ts` 改判框架支撑（零业务属性）迁 `lib/fonts.ts`，`config/` 纯化为填空区（仅 sidebar-data）——由 eslint 边界规则首次运行抓出。
> 2. `nav-user.tsx` 内写死的 `/settings/account`、`/settings/notifications` 链接与 "Upgrade to Pro" 营销项精简为 Settings + Sign out——由 starter 派生后的类型化路由抓出（框架组件不得指向 demo 依赖的路由）。
> 3. 已知豁免：`ui/sonner.tsx` 依赖 theme context（shadcn 官方实现如此，移层会破坏 CLI 同步），是 ui 层唯一获准的向上依赖。

## 0. 术语表（固定）

**基础组件**（`components/ui/`）、**框架组件**（`components/features/`）、**demo**（`demo/`）、**starter-template**（派生仓库）。
"业务组件"一词退役：业务只存在于下游用户项目，本仓库中不存在业务，只有 demo 的演示性填充。

## 1. 定位与哲学

- 遵循 shadcn 哲学：**源码分发，代码 100% 归用户**。不发 npm 包，不建 registry。
- 尽可能简洁：只留一种正统做法，不堆变体、不做配置 API（源码可改 = 配置）。
- 升级机制走 git：用户 fork 后以本仓库为 upstream，merge / cherry-pick。
- shadcn CLI 对用户保持可用：`components.json` 随模板分发，可继续 `npx shadcn add` 官方组件。

**三件套结构**——框架不是独立产物，是两板共享的 `components/` 层：

```
demo 仓库（= 本仓库整理后）              starter 仓库（脚本自动派生）
├─ src/components/ (ui + features)  ←── 同一份框架层 ──→   一模一样
├─ src/demo/        （填空示范）                            （无）
└─ routes 全量                                             routes 骨架 + 空首页
```

- **demo 仓库**：完整管理后台演示 + 圣本 + 框架开发工作台。
- **starter-template**：用户真正 clone 的起点。布局壳 + sidebar/顶部导航 + 路由骨架 + 主题切换/config-drawer + auth 页 + settings 页 + errors + 空首页。
- starter 不手工维护：脚本从 demo 仓库删 `demo/`、删除所有 import `@/demo` 的路由文件，并写入两个替换物——空首页路由 + 最小版 `config/sidebar-data.ts`（Dashboard/Settings），routeTree 重新生成，CI 推送，永不漂移。

```
shadcn 官方 registry --(CLI, 开发时抄源码)--> demo 仓库 --(派生)--> starter --(clone)--> 用户项目
```

## 2. 目录与分层

```
src/
├─ components/          可开源的框架层（整体零项目业务属性）
│  ├─ ui/               ① 基础组件：shadcn 原件 + 自研 shadcn 风格件
│  │                       （password-input、date-picker 归位至此）
│  └─ features/         ② 框架组件（admin 场景组件）
│     ├─ data-table/       七件套 + 待抽的 <DataTable> 渲染体、MultiDeleteConfirmDialog
│     ├─ layout/           sidebar、header、main、auth-layout
│     ├─ auth/             登录/注册/忘记密码/OTP 表单
│     ├─ settings/         sidebar-nav、content-section、appearance/display 表单
│     ├─ errors/           401/403/404/500/503
│     └─ command-menu、confirm-dialog、theme-switch、config-drawer …
├─ context/ hooks/ lib/ styles/ stores/   ② 框架支撑：五个 provider、use-dialog-state、
│                                            use-table-url-state、auth-store（认证骨架）、
│                                            样式三管辖区（§5）
├─ config/                                ④ 应用填空配置区（组装层级）：sidebar-data.ts、fonts.ts
│                                            框架组件不得 import，由 routes 组装时以 props 注入
├─ demo/                ③ 填空示范（原 features/，仅存在于 demo 仓库）
│  ├─ users/               圣本：columns + 过滤配置 + 业务 dialog + 文案
│  ├─ dashboard/           演示特例：一次性图表组合留 demo 本地
│  └─ settings-forms/      profile/account/notifications 表单范例（演示字段，不下沉）
└─ routes/              组装层：页面 = 路由 + ②直接引用 + ③填空
                        （物理上必须单目录＝TanStack 文件路由约定；逻辑归属看 import：
                          引 `@/demo` 的路由文件即 demo 路由，搜索参数 schema 随之同生共死）
```

| 层 | 位置 | 语义 | 硬判据 |
|---|---|---|---|
| **基础组件** | `components/ui/` | 零场景语义的 UI 原子 | 受控/无状态，不碰 context 和路由；纯到可给 shadcn 提 PR |
| **框架组件** | `components/features/` | 有场景语义（auth、table、settings…），可用框架 provider 和路由 | **零项目业务属性**——换任何项目原样可用，一行不改 |
| **demo** | `demo/` | 不是组件层；用项目业务属性"填空"出的演示页面 | 整删不坏框架；下游用户复制它诞生自己的业务代码 |

**开源红线（最高判据）**：`components/` 整层公开开源、完全可复用。
但凡带任何**项目业务属性**（项目特定的字段、枚举、文案），不得进入组件层，只能以演示填充身份
存在于 `demo/`。**场景语义不算业务属性**——区分测试：*换一家公司，这个组件能原样用吗？*
登录表单能（场景），users 的 columns 不能（项目业务）。

**单向依赖铁律**：

```
components/ui  ←  components/features  ←  demo  ←  routes（顶端组装层）
（ui 不许 import features；features 不许 import demo；demo 不许 import routes；routes 随便）
另：config/（填空配置）属组装层级——components/* 一律不得 import，由 routes 注入 props。
```

推论：`demo/` 整删 + 删除 import `@/demo` 的路由文件，框架不坏——starter 即由此派生。可加 eslint import 边界规则守门。

**判定算法**（新代码放哪，三问递进）：
1. 有任何项目业务属性吗？有 → `demo/`（在用户项目里即业务代码）
2. 碰 context / 路由吗？碰 → `components/features/`
3. 否则 → `components/ui/`

心智模型：ui 是字，features 是词组，demo 是范文——用户的文章写在自己的仓库里。

## 3. Demo 薄原则与抽取停止线

**原则：demo 尽可能薄——页面 = 路由 + 框架组件直接引用 + 填数据。**
填数据 = 列定义、过滤器选项、表单字段 + zod schema、action 菜单项、文案。
特例：真正一次性的演示组件（如 dashboard 的图表组合）可留 demo 本地。

**抽取停止线**（抽象唯一合法方向 demo → components/features，三条判据连环过）：

> 1. 重复且内容相同 → 抽进框架；重复但内容不同 → 填空，留下。
> 2. 抽完 demo 侧代码变短 → 该抽；只是把同样的信息从 JSX 搬进 props → 不该抽（配置搬家，滑向 ProTable）。
> 3. **只抽行为/逻辑，不抽代码形状**：重复的若是 React 惯用法 + 类型声明（零逻辑）→ 不抽，复制圣本就是这类代码的复用机制。

**已识别的两块待抽取**（users/tasks 各有一份相同副本，重复即复用性证明）：

1. 表格渲染体 ~70 行（`users-table.tsx:124-189`：flexRender 循环 + 空态行）→ `<DataTable table={table}>`
2. "输入 DELETE 确认"删除框（users/tasks 的 multi-delete-dialog，仅文案不同）→ `MultiDeleteConfirmDialog`

**不抽的反面判例**：`users-provider.tsx`——dialog 开关 + currentRow 的 context，37 行全是 React
惯用法和类型声明，零逻辑；dialog 种类、行类型全是项目内容。其中唯一的逻辑件框架已提供
（`hooks/use-dialog-state.tsx`），provider 文件随圣本复制改名即可。曾考虑 `createCrudContext<T>()`
工厂，已否决：隐藏惯用法、引入专有 API、卡死扩展。

## 4. 迁移方案（现 features/ → 新结构）

调研结论：features 之间零互相引用。两处越线：`routes/__root.tsx` 引用 `features/errors`；clerk 路由树引用 users 组件。

### 4.1 下沉框架组件（逐组件过"零项目业务属性"审计，不按目录整搬）
- `features/errors/` 五个错误页 → `components/features/errors/`（被 `__root.tsx` 用作路由默认错误页）
- `features/auth/`：auth-layout + 四个表单 → `components/features/`（邮箱/密码/OTP 是认证固有属性）；页面壳由 routes 直接组装；删 `sign-in-2.tsx` 变体
- `features/settings/`：sidebar-nav + content-section、appearance/display 表单 → `components/features/settings/`
- profile/account/notifications 表单：演示字段，**不下沉** → `demo/settings-forms/`

### 4.2 components/ 根部散件分拣（分拣完根部不留散文件）
- → `ui/`：password-input、date-picker
- → `features/`：data-table/、layout/、confirm-dialog、command-menu、theme-switch、config-drawer、search、profile-dropdown、select-dropdown、coming-soon、navigation-progress 等

### 4.3 demo/ 成形
- `features/users/` 薄化后 → `demo/users/`（圣本）；tasks 独有的 import-dialog 范式并入
- `features/dashboard/` → `demo/dashboard/`
- README 写明"复制 demo/users 做新 CRUD 页面"三步：拷目录 → 加路由 → 加 sidebar-data 条目

### 4.4 删除
- `features/apps/`、`features/chats/`（纯演示，无独特范式）
- `routes/clerk/` 整棵树（可选演示，依赖 users 组件）
- `features/tasks/`（先当对照组：两块抽取时 users/tasks 同步切换验证，完成后删）
- `components/learn-more.tsx`（上游宣传组件）
- 对应路由文件 + sidebar-data 条目同步清理

### 4.5 填空数据出清（红线复查：components/ 内不得残留填空）
- `components/layout/data/sidebar-data.ts`（demo 用户/团队/菜单）→ `config/sidebar-data.ts`；
  `app-sidebar`、`command-menu` 改为 props 接收，由 authenticated 布局路由注入
- `profile-dropdown.tsx`：硬编码演示用户（satnaing）改 props 注入；死链菜单项（Billing 等全指 /settings）精简
- `app-title.tsx` 品牌名 → 填空（随"命名与品牌"未决项处理）
- `stores/auth-store.ts` **改判**：字段（accountNo/email/role[]/exp）通用，属认证骨架=场景语义，
  保留在框架支撑层；演示 cookie 名修正；具体认证逻辑由用户接线

## 5. 主题与样式分区

```
src/styles/
├─ index.css       入口：只做 @import 编排（顺序即覆盖顺序）
├─ shadcn.css      ① shadcn 管辖区：标准 token 合同（:root/.dark 默认值 + @theme inline 映射）
├─ framework.css   ② 框架管辖区：@layer base 全局样式、@utility、动画、字体变量
└─ themes/         ③ 皮肤区（可选）：一个主题 = 一个 CSS 文件，只覆盖 token 值，最后 import
```

- **区分标准：在 shadcn 标准 token 合同内的 → shadcn.css；其余一切样式 → framework.css。**
  框架永不手改 shadcn.css 的合同结构。
- **升级机制**：`components.json` 的 `tailwind.css` 指针改指 `shadcn.css`——shadcn CLI 合并 cssVars
  时写入即被圈在管辖区内；上游合同演进（如当年新增 sidebar-*）只 diff 这一个文件，框架样式与皮肤零牵连。
- **现状迁移**：theme.css 的 token + 色彩映射 → shadcn.css；`--font-inter/--font-manrope`（项目自有）
  → framework.css；index.css 的 @layer base / @utility / 动画 → framework.css。
- **换肤约定：一个主题 = 一个 CSS 文件**，只含 `:root` 与 `.dark` 两块 token 值覆盖。
  [tweakcn.com](https://tweakcn.com) 即官配主题编辑器：可视化调 → 导出 → 存 `themes/xxx.css` → 末位 import。
  覆盖块是普通 CSS（不在 `@layer`），后加载者赢。
- token 合同现状：Tailwind v4 / OKLCH，含 chart-1~5、sidebar-* 全套。

## 6. 现状备忘（调研结论）

- 技术栈：Vite + React 19 + TS + Tailwind v4 + TanStack Router/Query/Table + RHF + Zod + Zustand。纯 SPA，无 lib 构建。
- 运行时与 shadcn 零依赖；真实依赖为 Radix UI、cva、clsx、tailwind-merge、lucide-react。
- `context/` 五个 provider（theme / direction / layout / font / search）为框架级，cookie 持久化。
- 布局耦合 TanStack Router（Link / useLocation / Outlet）：模板统一技术栈，不视为问题。
- `stores/auth-store.ts` 为认证骨架（场景语义，字段通用），判属框架支撑层；具体认证逻辑由用户接线。

## 7. 待办（按序执行）

- [ ] 抽取两块：`<DataTable>` 渲染体、`MultiDeleteConfirmDialog`（users/tasks 同步切换验证）
- [ ] 目录重组：components 根部散件分拣进 ui/ 与 features/；下沉 errors、auth、settings（逐组件审计）
- [ ] 样式分区：theme.css/index.css 拆为 shadcn.css + framework.css + themes/；components.json 的 css 指针改向 shadcn.css
  - 验证点：拆分后实测 `npx shadcn add`（CLI 对 Tailwind v4 的检测可能依赖 css 文件含 `@import "tailwindcss"`）；不兼容则指针回退 index.css，CLI 写入后人工搬运
- [ ] 填空数据出清（§4.5）：sidebar-data 迁 config/ 并 props 化；profile-dropdown 用户信息 props 化；删 learn-more
- [ ] `features/` → `demo/`：users 薄化为圣本、dashboard 迁入、settings 演示表单迁入；routes 改为直接组装
- [ ] 删除：apps、chats、clerk、sign-in-2；tasks 最后删；同步清理路由与 sidebar-data
- [ ] eslint import 边界规则（可选）
- [ ] starter 生成脚本 + CI 同步
- [ ] README 重写：定位、术语表、分层判据、demo 薄原则、复制圣本三步、主题约定
- [ ] 跑通 lint / test / build

## 8. 未决问题（待讨论）

- ~~模板命名与品牌~~ → **已定：BeatUI**（包名 beatui，starter 包名 beatui-starter；上游 satnaing/shadcn-admin 署名保留）；仓库目录/远程改名由用户在 GitHub 侧执行
- dashboard 首页保留多少演示内容
- starter 要不要带一个可删的最小圣本（当前倾向：不带，README 指路 demo 仓库的 demo/users）
- README 语言（中/英/双语）
- demo 数据（faker）保留策略：留作开发态 mock 还是裁剪
