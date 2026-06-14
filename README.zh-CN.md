<sub><a href="README.md">English</a> · 🌐 中文</sub>

<div align="center">

# screenshot-to-html

**丢一张截图，拿回一个像素级还原、可真实交互的单文件 HTML 页面。**

[![skills.sh Compatible](https://img.shields.io/badge/skills.sh-Compatible-22c55e)](https://skills.sh)
[![Agent-Agnostic](https://img.shields.io/badge/agent-agnostic-7c3aed)](#安装)
[![Verified in real Chrome](https://img.shields.io/badge/interactive-verified-000000)](#实现细节)
[![License: MIT](https://img.shields.io/badge/License-MIT-3da639.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/sevzq/screenshot-to-html?style=social)](https://github.com/sevzq/screenshot-to-html/stargazers)

<br>

一个 AI 编程 agent 技能，把任意 UI 截图重建成**一个干净、自包含、可交互的 HTML 文件**。不是一次性瞎猜，而是一个**渲染 → 截图 → 对比 → 修正**的闭环（在真实 Chrome 里），直到 `render(code) ≈ target`。然后给它接上真实的 hover / focus / 点击状态，并**用无头 Chrome 验证**。

```
npx skills add sevzq/screenshot-to-html
```

可在 **Cursor · Claude Code · Codex · Windsurf · Copilot** 等 40+ agent 中使用。

[案例展示](#案例展示) · [安装](#安装) · [工作原理](#工作原理) · [为什么不一样](#为什么不一样)

</div>

---

<p align="center">
  <img src="assets/hero.zh.gif" alt="在真实的 Claude Code 终端里：先用 'npx skills add sevzq/screenshot-to-html' 安装技能，再粘贴一张 Modal 首页截图，输入一句「把这张截图复刻成一个可真实交互的单文件 HTML 页面」。技能读取图片、写出 output.html，并用无头 Chrome 验证控件，最后揭示成品页面 —— 一个像素级还原、可真实交互的单一 HTML 文件。" width="100%">
</p>

<p align="center"><sub>
  ▲ 先安装技能，打开 <b>Claude Code</b>（或 Cursor / Codex），粘贴一张截图，输入一句话 —— 技能写出单个 <code>output.html</code> 并<b>用真实 Chrome 验证交互</b>。
  &nbsp;·&nbsp; <a href="assets/hero.zh.mp4">高清 MP4</a>
</sub></p>

---

## 案例展示

左边是真实 App 截图，右边是技能生成的**单文件 HTML 复刻**。下面每个复刻都由技能产出，是带内联 CSS/JS 的单一文件（无框架、无构建），并通过 `node scripts/shot.mjs --verify`。完整源文件见 [`examples/`](examples/)。

### 精选 —— 完整应用界面，完全可交互

**ElevenLabs —— 语音库**

[![ElevenLabs 语音库：原始截图 vs HTML 复刻](examples/app-elevenlabs/comparison.webp)](examples/app-elevenlabs/output.html)

浅色 Voices / Explore 工作区：侧边栏、Explore / My Voices 标签、筛选标签、3×2 Trending 网格、带速度吸附的「Handpicked」拖拽轮播，以及每周精选。语音头像是分层 CSS 渐变、图标是内联 SVG，仅卡片插画从原图裁切。
[原图](examples/app-elevenlabs/input.png) · [HTML 复刻](examples/app-elevenlabs/output.html) · [▶ 实时演示](assets/elevenlabs-demo.gif)

**Spotify —— 网页播放器（暗色）**

[![Spotify 网页播放器：原始截图 vs HTML 复刻](examples/app-spotify/comparison.webp)](examples/app-spotify/output.html)

暗色三栏播放器；封面是从原图裁出的真实图像，图标全内联 SVG。歌曲行悬停出现播放图标，播放控制（播放 / 随机 / 循环）可切换，正在播放面板可收起，音量是真实滑块。
[原图](examples/app-spotify/input.png) · [HTML 复刻](examples/app-spotify/output.html) · [▶ 实时演示](assets/spotify-demo.gif)

**Airbnb —— iOS App（移动端）**

[![Airbnb iOS App：原始截图 vs HTML 复刻](examples/mobile-airbnb/comparison.webp)](examples/mobile-airbnb/output.html)

按 393px @3x 编写并包进装饰性 iPhone 外框。每个房源卡片都是可滑动图片轮播（拖拽、速度吸附、圆点指示、悬停箭头），爱心带触感弹跳，底部 tab 栏切换屏幕 —— 全部零依赖。
[原图](examples/mobile-airbnb/input.png) · [HTML 复刻](examples/mobile-airbnb/output.html) · [▶ 实时演示](assets/airbnb-demo.gif)

### 更多案例

<table>
<tr>
<td width="50%" valign="top">

**Cloudflare —— 落地页**

[![Cloudflare 落地页复刻](examples/landing-cloudflare/comparison.webp)](examples/landing-cloudflare/output.html)

黑橙巨字标题 + 完整导航全是纯 CSS；只有那颗测地球体从原图裁切并溢出右边缘。
[原图](examples/landing-cloudflare/input.png) · [HTML](examples/landing-cloudflare/output.html)

</td>
<td width="50%" valign="top">

**Modal —— 落地页（暗色 / 霓虹）**

[![Modal 落地页复刻](examples/landing-modal/comparison.webp)](examples/landing-modal/output.html)

纯黑 Hero 配春绿点缀；发光方块用 `screen` 混合叠到黑底上，毫无接缝。
[原图](examples/landing-modal/input.png) · [HTML](examples/landing-modal/output.html)

</td>
</tr>
<tr>
<td width="50%" valign="top">

**Clay —— 落地页（彩色）**

[![Clay 落地页复刻](examples/landing-clay/comparison.webp)](examples/landing-clay/output.html)

白底奶油色 Hero 配超大标题；四组黏土雕塑用 `multiply` 混合干净地骑在面板边缘上。
[原图](examples/landing-clay/input.png) · [HTML](examples/landing-clay/output.html)

</td>
<td width="50%" valign="top">

**Stripe —— 落地页**

[![Stripe 落地页复刻](examples/landing-stripe/comparison.webp)](examples/landing-stripe/output.html)

斜向渐变 + 正片叠底标题是纯 CSS；只有收银/仪表盘卡片簇裁切。邮箱输入框可用。
[原图](examples/landing-stripe/input.png) · [HTML](examples/landing-stripe/output.html)

</td>
</tr>
<tr>
<td width="50%" valign="top">

**Tesla —— 充电屏（iOS）**

[![Tesla 充电屏复刻](examples/mobile-tesla/comparison.webp)](examples/mobile-tesla/output.html)

393px @3x iPhone 外框；Model 3 渲染图与屏幕底色精确匹配。充电上限滑块是真实 `range`。
[原图](examples/mobile-tesla/input.png) · [HTML](examples/mobile-tesla/output.html)

</td>
<td width="50%" valign="top">

**Stripe —— 仪表盘**

[![Stripe 仪表盘复刻](examples/dashboard-stripe/comparison.webp)](examples/dashboard-stripe/output.html)

整屏纯代码重建（内联 SVG 图表、CSS 条），零裁切。侧边导航、Test mode 开关、日期 pill 都有反馈。
[原图](examples/dashboard-stripe/input.png) · [HTML](examples/dashboard-stripe/output.html)

</td>
</tr>
<tr>
<td width="50%" valign="top">

**Linear —— 落地页**

[![Linear 落地页复刻](examples/landing-linear/comparison.webp)](examples/landing-linear/output.html)

手写 HTML/CSS；仅产品 UI 卡片从原图取出。导航 + 注册有 hover/focus，页内链接平滑滚动。
[原图](examples/landing-linear/input.png) · [HTML](examples/landing-linear/output.html)

</td>
<td width="50%" valign="top">

**更多见 [`examples/`](examples/)**

每个目录都含原始截图、单文件 `output.html` 和并排 `comparison.webp`。欢迎 PR 新案例。

</td>
</tr>
</table>

> 喜欢的话，**[⭐ 给个 Star](https://github.com/sevzq/screenshot-to-html)** —— 能帮更多人发现它。

## 为什么不一样

大多数「截图转代码」工具生成一次就停了。`screenshot-to-html` 优化的是你**真正看到**、并且**真正可交互**的东西：

- **靠闭环还原，不靠运气** —— 它用真实 Chrome 给自己的产物截图，分区域和你的原图对比（布局 → 间距 → 颜色 → 字体 → 细节），不断修正直到吻合。是语义化 HTML + 设计令牌，而不是一堆绝对定位的魔法数字。
- **真的可交互 —— 而且经过验证** —— 真实的 `<button>` / `<a>`、hover / focus / active 状态，以及截图暗示的可用 tab、导航、轮播。用 `shot.mjs --verify` 审计，发现「死按钮」直接让构建不通过。
- **单一自包含文件** —— 内联 CSS/JS，零依赖、零构建，随处可开。
- **素材自动且锐利** —— 每个图片位都用最合适的来源填充：从你截图里裁出的清晰区域、官方 logo SVG、或一张真实的图库照片 —— 绝不用模糊的占位图或「AI 味」的剪影。
- **真实尺寸、自适应** —— 按真实设计宽度 + 流式单位（`clamp()` / `max-width`）编写，所以 100% 缩放下也正常显示并自适应，绝不是一个固定的「迷你版」。

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

<details>
<summary><b>手动安装</b>（克隆进 agent 的 skills 目录）</summary>

仓库根目录*就是*技能本体：

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

</details>

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
