<sub><a href="README.md">English</a> · 🌐 中文</sub>

<div align="center">

# screenshot-to-html

**丢一张截图，拿回一个像素级还原、可真实交互的单文件 HTML 页面。**

[![License: MIT](https://img.shields.io/badge/License-MIT-3da639.svg)](LICENSE)
[![Agent Skill](https://img.shields.io/badge/Agent-Skill-2b6cb0)](https://agentskills.io)
[![skills.sh Compatible](https://img.shields.io/badge/skills.sh-Compatible-22c55e)](https://skills.sh)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-7c3aed)](#安装)
[![Verified with Chrome](https://img.shields.io/badge/interactive-verified-000000)](#实现细节)

<br>

一个 AI 编程 agent 技能，把任意 UI 截图重建成**一个干净、自包含、可交互的 HTML 文件**。不是一次性瞎猜，而是一个**渲染态闭环**：构建 → 用真实 Chrome 截图 → 和你的原图对比 → 修正，直到 `render(code) ≈ target`。然后给它接上真实的 hover / focus / 点击状态，并**用无头 Chrome 验证**。

```
npx skills add sevzq/screenshot-to-html
```

可在 **Cursor · Claude Code · Codex · Windsurf · Copilot** 等 40+ agent 中使用。

[看案例展示](#案例展示) · [安装](#安装) · [工作原理](#工作原理) · [为什么不一样](#为什么不一样)

</div>

---

<p align="center">
  <img src="assets/hero.zh.gif" alt="在真实的 Claude Code 终端里：先用 'npx skills add sevzq/screenshot-to-html' 安装技能，再粘贴一张 Modal 首页截图，输入一句「把这张截图复刻成一个可真实交互的单文件 HTML 页面」。技能读取图片、写出 output.html，并用无头 Chrome 验证控件，最后揭示成品页面 —— 一个像素级还原、可真实交互的单一 HTML 文件。" width="100%">
</p>

<p align="center"><sub>
  ▲ 先安装技能，打开 <b>Claude Code</b>（或 Cursor / Codex），粘贴一张截图，输入一句话。技能读取图片、写出单个 <code>output.html</code>，并<b>用真实 Chrome 验证交互</b> —— 最后揭示成品页面。
  &nbsp;·&nbsp; <a href="assets/hero.zh.mp4">高清 MP4</a>
</sub></p>

> **这篇 README 里的每一个复刻页，都是这个技能自己产出的**，并且用无头 Chrome 验证过可真实交互 —— 每个都是带内联 CSS/JS 的单一 HTML 文件，无框架、无构建步骤。

---

## 为什么不一样

大多数「截图转代码」工具生成一次就停了。`screenshot-to-html` 优化的是你**真正看到**、并且**真正可交互**的东西：

- **靠闭环还原，不靠运气** —— 它用真实 Chrome 给自己的产物截图，分区域和你的原图对比（布局 → 间距 → 颜色 → 字体 → 细节），不断修正直到吻合。是语义化 HTML + 设计令牌，而不是一堆绝对定位的魔法数字。
- **真的可交互 —— 而且经过验证** —— 真实的 `<button>` / `<a>`、hover / focus / active 状态，以及截图暗示的可用 tab、导航、弹窗。用 `shot.mjs --verify` 审计，发现「死按钮」直接让构建不通过。不是一张假装成页面的静态图。
- **单一自包含文件** —— 内联 CSS/JS，零依赖、零构建，随处可开。
- **素材自动且锐利** —— 每个图片位都用最合适的来源填充：从你截图里裁出的清晰区域、官方 logo SVG、或一张真实的图库照片 —— 绝不用模糊的占位图或「AI 味」的剪影。无需提问、无需手动。
- **真实尺寸、自适应** —— 按真实设计宽度 + 流式单位（`clamp()` / `max-width`）编写，所以 100% 缩放下也正常显示并自适应，绝不是一个固定的「迷你版」。
- **就跑在你已经在用的 agent 里** —— 无需部署 web 应用、无需额外 API key、无需基础设施。它就是一个技能。

## 案例展示

左边是真实 App 截图，右边是生成出来的单文件 HTML 复刻 —— 明暗、桌面与移动、落地页、后台、完整 App UI 都有。完整源文件见 [`examples/`](examples/)。每个复刻都可交互，并且通过 `node scripts/shot.mjs --verify`。

### Cloudflare —— 落地页

![Cloudflare 落地页：原始截图 vs HTML 复刻](examples/landing-cloudflare/comparison.webp)

[原图](examples/landing-cloudflare/input.png) · [HTML 复刻](examples/landing-cloudflare/output.html) —— 黑橙巨字标题、完整导航、底部报告卡都是纯 HTML/CSS；只有那颗橙色测地球体是从原图裁切并溢出到右边缘的。两个 CTA、每个导航项、以及「Under attack?」按钮都是带 hover/focus 的真实控件。

### Modal —— 落地页（暗色 / 霓虹）

![Modal 落地页：原始截图 vs HTML 复刻](examples/landing-modal/comparison.webp)

[原图](examples/landing-modal/input.png) · [HTML 复刻](examples/landing-modal/output.html) —— 纯黑 Hero 配春绿点缀；发光的半透明方块从原图裁出并用 `screen` 混合叠到黑底上，毫无接缝，客户 logo 行是真实图像。公告链接、悬浮导航 pill、两个 Hero 按钮都是带 hover/focus 的真实控件。

### Clay —— 落地页（彩色）

![Clay 落地页：原始截图 vs HTML 复刻](examples/landing-clay/comparison.webp)

[原图](examples/landing-clay/input.png) · [HTML 复刻](examples/landing-clay/output.html) —— 白底上的奶油色 Hero 面板配超大标题；四组彩色黏土雕塑裁切后用 `multiply` 混合，干净地骑在面板边缘上，20 个品牌的 logo 墙是真实图像。导航、⌘K 搜索、「Get a demo」和注册按钮都有 hover/focus。

### Tesla —— 充电屏（iOS / 移动端）

![Tesla 充电屏：原始截图 vs HTML 复刻](examples/mobile-tesla/comparison.webp)

[原图](examples/mobile-tesla/input.png) · [HTML 复刻](examples/mobile-tesla/output.html) —— 按 393px @3x 编写并包进装饰性 iPhone 外框；带绿色充电线的黑色 Model 3 渲染图裁切后与屏幕底色精确匹配，无缝衔接。充电上限滑块是真实的 `range` 输入并实时更新绿色进度，每个控件都有 hover/focus。

### Stripe —— 落地页

![Stripe 落地页：原始截图 vs HTML 复刻](examples/landing-stripe/comparison.webp)

[原图](examples/landing-stripe/input.png) · [HTML 复刻](examples/landing-stripe/output.html) —— 斜向渐变和正片叠底标题是纯 CSS；只有浮动的收银 + 仪表盘卡片簇是从原图裁切的。导航、公告 pill、可用的邮箱输入框 + Start now 按钮都是带 hover/focus 的真实控件。

### Spotify —— 网页播放器（暗色）

![Spotify 网页播放器：原始截图 vs HTML 复刻](examples/app-spotify/comparison.webp)

[原图](examples/app-spotify/input.png) · [HTML 复刻](examples/app-spotify/output.html) —— 暗色三栏播放器；每个封面和专辑缩略图都是从原图裁出的真实图像，所有图标是内联 SVG。完全可交互：歌曲行悬停高亮并出现播放图标，播放控制（播放 / 随机 / 循环）可切换，正在播放面板可收起，音量是真实滑块。_（[查看实时交互演示](assets/spotify-demo.gif)。）_

### Airbnb —— iOS App（移动端）

![Airbnb iOS App：原始截图 vs HTML 复刻](examples/mobile-airbnb/comparison.webp)

[原图](examples/mobile-airbnb/input.png) · [HTML 复刻](examples/mobile-airbnb/output.html) —— 按 393px @3x 编写并包进一个装饰性 iPhone 外框；每张卡片的首图与 3D 分类图标均从原图裁切（轮播里的额外照片为可免费商用的 Unsplash 室内图）。完全可交互：每个房源卡片都是可滑动的图片轮播（拖拽切换、按速度吸附、圆点指示、悬停箭头），爱心收藏带触感「弹跳」反馈，底部 tab 栏 / 顶部分类 tab 在外框内切换屏幕 —— 全部零依赖实现。_（[查看实时交互演示](assets/airbnb-demo.gif)。）_

### Linear —— 落地页

![Linear 落地页：原始截图 vs HTML 复刻](examples/landing-linear/comparison.webp)

[原图](examples/landing-linear/input.png) · [HTML 复刻](examples/landing-linear/output.html) —— 产品 UI 卡片用 [`crop.mjs`](scripts/crop.mjs) 从原图取出，其余都是手写 HTML/CSS。导航链接和注册按钮有 hover/focus 状态，页内链接平滑滚动。

### Stripe —— 仪表盘

![Stripe 仪表盘：原始截图 vs HTML 复刻](examples/dashboard-stripe/comparison.webp)

[原图](examples/dashboard-stripe/input.png) · [HTML 复刻](examples/dashboard-stripe/output.html) —— 图表是内联 SVG，堆叠条是 CSS；整屏零图片裁切、纯代码重建。可交互：侧边导航、Test mode 开关、日期/周期 pill 都有反馈，卡片和行悬停高亮。

## 可选：用 GSAP 加动效

动效是**可选项** —— agent 不会主动问、也不会主动加，只有你明确要求时才会加。需要时，Phase 6 会通过一个 CDN 标签叠加克制、自包含的 [GSAP](https://gsap.com/)（无构建步骤），而且动画始终是「动到」最终的 CSS 状态，所以关掉 JS 或开启 `prefers-reduced-motion` 的访客依然能看到完整页面。

下面是给 Modal 复刻页加了一层可选动效：错峰的 Hero 入场、持续轻浮的算力立方体，以及带回弹的按钮 hover：

![加了可选 GSAP 动效的 Modal 复刻页：错峰入场 + 浮动立方体](assets/gsap-modal.gif)

[动效源码](examples/landing-modal/output.gsap.html) · [高清 MP4](assets/gsap-modal.mp4) —— 和[静态 Modal 复刻页](examples/landing-modal/output.html)用的是同一套 HTML，只多了约 20 行 GSAP。可复用的动效模式见 [`references/animation.md`](references/animation.md)。

## 工作原理

```
Phase 0  准备     —— 输入、技术栈，以及真实的设计宽度 / 缩放
Phase 1  读设计   —— 设计令牌、布局意图、精确文案
Phase 2  搭草稿   —— 一个语义化、自包含的初版
Phase 3  闭环     —— shot.mjs → 对比原图 → 修正   （重复 2–4 次）
Phase 4  加交互   —— 真实 hover / focus / 可点击状态，再 --verify
Phase 5  终检     —— 自适应、精确文案、还原度
Phase 6  动效     —— 可选，仅当你主动要求
```

渲染步骤用 [`scripts/shot.mjs`](scripts/shot.mjs)，它通过 `playwright-core` 驱动你本机已装的 Chrome（不下载浏览器）。同一个脚本还能审计交互（`--verify`）、抓取 hover / focus / 打开态（`--hover` / `--focus` / `--click` / `--states`）。

## 安装

### npx skills（推荐）

自动识别你的 agent（Cursor、Claude Code、Codex、Windsurf、Copilot，40+）：

```bash
npx skills add sevzq/screenshot-to-html
```

### Cursor

**Settings → Rules → Add Rule → Remote Rule (GitHub)** → 填 `sevzq/screenshot-to-html`，或直接用上面的 `npx skills add`。

### 其它 agent（Codex、OpenCode、Gemini CLI…）

把这个仓库地址给 agent，让它从 [`SKILL.md`](SKILL.md) 开始用这个技能：

```text
https://github.com/sevzq/screenshot-to-html
```

### 手动安装

直接把仓库克隆进你 agent 的 skills 目录（仓库根目录*就是*技能本体）：

| Agent        | Skills 目录                  |
| ------------ | ---------------------------- |
| Claude Code  | `~/.claude/skills/`          |
| Cursor       | `~/.cursor/skills/`          |
| OpenAI Codex | `~/.codex/skills/`           |
| OpenCode     | `~/.config/opencode/skills/` |

```bash
git clone https://github.com/sevzq/screenshot-to-html.git ~/.cursor/skills/screenshot-to-html
```

渲染/裁切脚本需要装一次 Node 依赖（在仓库根目录）：`npm i` 装 `playwright-core`；裁切再加 `npm i -D sharp`。

## 使用

把截图交给 agent，让它复刻：

```text
把这张截图复刻成 HTML：  ./design.png
```

它会读懂设计、搭出初稿，然后循环（渲染 → 对比 → 修正），接上交互，最后交给你一个自包含 HTML 文件 + 一张并排对比图。

## 实现细节

- **交互经过验证。** `node scripts/shot.mjs --in page.html --verify` 会审计页面里的「死按钮」（看起来可点击却没接事件的 `<div>`）、缺失的 `cursor: pointer`、以及没有任何 `:hover` / `:focus` 规则的情况，没修好就一直报 `WARN`。交互被当作还原度的一部分，而不是事后补丁。
- **素材质量优先（自动）。** 每个图片位都不问你、按「最锐利、最具体」自动解析：**你提供的素材** → **官方品牌 SVG/logo** → 从原图裁出的**清晰区域**（[`crop.mjs`](scripts/crop.mjs)）→ 真实的 [Unsplash](https://unsplash.com) / `picsum.photos` 照片 → 兜底才用 `placehold.co`。
- **动效是可选项。** 基础交互（hover / focus / 可点击）默认就有，但动画**只在**你明确要求时才加 —— Phase 6 会通过 CDN 叠加克制、自包含的 GSAP。见 [`references/animation.md`](references/animation.md)。

## Star 趋势

<p align="center">
  <a href="https://star-history.com/#sevzq/screenshot-to-html&Date">
    <img src="https://api.star-history.com/svg?repos=sevzq/screenshot-to-html&type=Date" alt="Star History Chart" width="70%">
  </a>
</p>

## 贡献

欢迎 issue 和 PR —— 尤其欢迎新的复刻案例。技能结构和编写规范见 [AGENTS.md](AGENTS.md)。

## 许可证

[MIT](LICENSE) © SevenZhang

> 案例里的截图均为真实 App UI，仅用于复刻演示，版权归各自所有者。
