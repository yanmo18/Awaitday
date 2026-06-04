# Awaitday - 精美倒计时小程序

> 记录每一个重要时刻，用最美的方式等待

## 项目简介

**Awaitday** 是一款专注于视觉体验的倒计时小程序，支持多种展示样式和自定义配色。无论是生日、假期、出行还是任何重要日子，都能用最优雅的方式呈现。

### 核心特性

- **4种倒计时样式**：圆环进度、翻牌动画、渐变卡片、极简风格
- **18种预设颜色**：支持自定义主色调和渐变色
- **翻牌动画**：CSS 3D transform 实现的翻页时钟效果
- **圆环进度**：SVG 绘制的环形进度条
- **本地存储**：数据持久化，自动保存/加载
- **跨端支持**：微信小程序 / 抖音小程序 / H5
- **微信小程序原生组件**：ScrollView、Picker、Swiper

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Taro 4.x + React 18 |
| 语言 | TypeScript 5.4 |
| 样式 | Tailwind CSS 4 + weapp-tailwindcss |
| 状态管理 | Zustand |
| 图标 | lucide-react-taro |
| 动画 | CSS 3D Transform |
| 平台 | 微信小程序 / 抖音小程序 / H5 |

---

## 项目结构

```
src/
├── pages/
│   ├── index/              # 首页 - 倒计时列表
│   ├── add/                # 添加页 - 创建倒计时
│   └── theme/              # 样式页 - 选择展示样式
│
├── components/
│   ├── ui/                 # 通用UI组件 (shadcn/ui)
│   └── business/
│       └── styles/         # 倒计时样式组件
│           ├── flip-card-style.tsx    # 翻牌动画样式
│           ├── ring-style.tsx         # 圆环进度样式
│           ├── gradient-style.tsx     # 渐变卡片样式
│           └── minimal-style.tsx      # 极简风格样式
│
├── store/
│   ├── countdown.ts        # 倒计时数据状态
│   └── theme.ts            # 样式设置状态
│
├── network/
│   └── index.ts            # 网络请求封装
│
└── assets/
    └── tabbar/             # TabBar 图标资源
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev        # 同时启动 H5 前端和后端
pnpm dev:web    # 仅 H5 前端
pnpm dev:weapp  # 仅微信小程序
pnpm dev:tt     # 仅抖音小程序
```

- 前端地址：http://localhost:5000
- 后端地址：http://localhost:3000

### 构建

```bash
pnpm build        # 构建所有
pnpm build:web    # 仅构建 H5
pnpm build:weapp  # 仅构建微信小程序
pnpm build:tt     # 仅构建抖音小程序
```

### 预览小程序

```bash
pnpm preview:weapp  # 构建并生成微信小程序预览二维码
```

---

## 功能详解

### 1. 首页（倒计时列表）

- 显示所有已创建的倒计时
- 实时更新剩余时间（天/时/分/秒）
- 根据全局样式设置渲染对应组件
- 支持删除倒计时
- 圆形添加按钮

### 2. 添加页

- 输入倒计时名称
- 选择目标日期（年月日）
- 选择颜色（18色调色盘）
- 支持自定义主色调和渐变色
- 实时预览效果

### 3. 样式页

- 4种展示样式可选
- 点击即可切换，全局生效
- 样式预览效果展示

---

## 样式展示

### 圆环进度 (RingStyle)

```
┌─────────────────┐
│   生日倒计时    │
│    ◐ 07 天     │  ← SVG圆环 + 中心数字
│   12:30:45     │
└─────────────────┘
```

### 翻牌动画 (FlipCardStyle)

```
┌─────────────────┐
│   生日倒计时    │
│  ┌──┐┌──┐ 天   │  ← 数字卡片 + 右侧单位
│  │07│    │     │
│  └──┘└──┘      │
│   12:30:45     │
└─────────────────┘
```

### 渐变卡片 (GradientStyle)

```
┌─────────────────┐
│   生日倒计时    │
│ ═══════════════ │  ← 渐变背景
│      07         │  ← 大数字
│     天          │
└─────────────────┘
```

### 极简风格 (MinimalStyle)

```
┌─────────────────┐
│   生日倒计时    │
│                 │
│      07 天      │  ← 纯数字
│                 │
└─────────────────┘
```

---

## 数据存储

项目使用 `Taro.setStorage` 进行本地持久化存储：

| Key | 说明 |
|-----|------|
| `countdown_list` | 倒计时列表数据 |
| `countdown_style` | 全局样式设置 |

### 数据结构

```typescript
// 倒计时数据
interface CountdownItem {
  id: string
  name: string
  date: string      // YYYY-MM-DD
  color: string     // 主色调
  gradient?: string // 渐变色
  createdAt: number
}

// 样式设置
type CountdownStyle = 'ring' | 'flip' | 'gradient' | 'minimal'
```

---

## 组件库

### UI 组件

UI 组件位于 `@/components/ui`，推荐按需引入：

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
```

可用组件：Accordion, Alert, AlertDialog, Avatar, Badge, Button, Card, Carousel, Checkbox, Dialog, Drawer, Input, Label, Progress, Select, Tabs, Toast 等

### 业务组件

位于 `@/components/business/styles/`，包含4种倒计时样式组件：

- `RingStyle` - 圆环进度样式
- `FlipCardStyle` - 翻牌动画样式
- `GradientStyle` - 渐变卡片样式
- `MinimalStyle` - 极简风格样式

---

## 路径别名

项目配置了 `@/*` 路径别名指向 `src/*`：

```typescript
import { useCountdownStore } from '@/store/countdown'
import { RingStyle } from '@/components/business/styles/ring-style'
```

---

## 开发规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `flip-card-style.tsx` |
| 组件名 | PascalCase | `FlipCardStyle` |
| 变量/函数 | camelCase | `getCountdown` |
| 常量 | UPPER_SNAKE_CASE | `STORAGE_KEY` |

### Git 提交规范

```bash
git commit -m "feat: 新增功能"
git commit -m "fix: 修复问题"
git commit -m "style: 样式调整"
git commit -m "refactor: 代码重构"
```

---

## 许可证

MIT License
