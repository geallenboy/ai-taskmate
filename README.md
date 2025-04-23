### AI TaskMate



智能任务助手

一个基于AI的任务管理和规划工具，帮助你分解目标、研究资料并创建全面的计划


## 📋 目录

- [项目概述](#项目概述)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [演示](#演示)
- [安装指南](#安装指南)
- [使用说明](#使用说明)
- [项目结构](#项目结构)
- [环境变量](#环境变量)
- [代理系统](#代理系统)
- [LangSmith集成](#langsmith集成)
- [贡献指南](#贡献指南)
- [许可证](#许可证)


## 🔍 项目概述

AI TaskMate 是一个智能任务助手，利用多个专业AI代理来帮助用户分解复杂目标、收集相关信息、分析数据并生成结构化的行动计划。该应用采用现代化的玻璃态UI设计，提供流畅的用户体验和直观的交互界面。

AI TaskMate 使用 LangChain 和 OpenAI 的大语言模型，通过多代理协作系统处理用户的任务需求，并提供详细的评估和反馈机制。

## ✨ 功能特性

- **多代理协作系统**：规划、搜索、推理和写作四个专业代理协同工作
- **任务分解**：将复杂目标分解为可管理的步骤
- **信息收集**：自动收集与任务相关的信息
- **智能分析**：分析收集到的信息并提供见解
- **结构化输出**：生成清晰、可操作的计划
- **结果评估**：对生成结果进行质量评估
- **用户反馈**：收集用户对结果的评价
- **任务历史**：保存和查看历史任务
- **性能仪表板**：查看系统性能和用户统计数据
- **LangSmith集成**：跟踪和分析AI代理性能
- **现代化UI**：玻璃态设计风格，支持深色模式
- **响应式设计**：适配桌面和移动设备


## 🛠️ 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI库**：React, TailwindCSS, shadcn/ui
- **状态管理**：Zustand
- **AI/ML**：LangChain, OpenAI API
- **分析工具**：LangSmith
- **类型系统**：TypeScript
- **部署**：Vercel


## 🎬 演示

![video](./public/video.gif)




## 📥 安装指南

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 yarn 或 pnpm
- OpenAI API 密钥
- (可选) LangSmith API 密钥


### 安装步骤

1. 克隆仓库


```shellscript
git clone https://github.com/geallenboy/ai-taskmate.git
cd ai-taskmate
```

2. 安装依赖


```shellscript
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量


创建 `.env.local` 文件并添加以下内容：

```plaintext
OPENAI_API_KEY=your_openai_api_key
LANGCHAIN_TRACING_V2=true  # 启用 LangSmith 跟踪 (可选)
LANGCHAIN_API_KEY=your_langsmith_api_key  # 可选
LANGCHAIN_PROJECT=ai-taskmate  # 可选
```

4. 启动开发服务器


```shellscript
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)


## 📖 使用说明

### 创建新任务

1. 在首页输入你想要完成的目标
2. 点击"开始"按钮
3. 系统将启动多个AI代理处理你的任务
4. 等待处理完成，查看结果


### 查看任务历史

1. 点击顶部导航栏的"任务历史"
2. 浏览之前完成的任务
3. 点击任务卡片查看详细结果


### 查看性能仪表板

1. 点击顶部导航栏的"仪表板"
2. 查看系统性能指标和用户统计数据


## 📁 项目结构

```plaintext
ai-taskmate/
├── app/                    # Next.js 应用目录
│   ├── dashboard/          # 仪表板页面
│   ├── history/            # 任务历史页面
│   ├── process/            # 任务处理页面
│   ├── result/             # 结果页面
│   ├── layout.tsx          # 根布局组件
│   └── page.tsx            # 首页
├── components/             # React 组件
│   ├── ui/                 # UI 组件 (shadcn/ui)
│   ├── agent-step.tsx      # 代理步骤组件
│   ├── chat-input.tsx      # 聊天输入组件
│   ├── evaluation-display.tsx # 评估显示组件
│   └── feedback-form.tsx   # 反馈表单组件
├── hooks/                  # React Hooks
│   ├── use-agent-flow.ts   # 代理流程 Hook
│   └── use-analytics.ts    # 分析 Hook
├── lib/                    # 工具函数和库
│   ├── agents/             # 代理实现
│   ├── analytics.ts        # 分析功能
│   ├── direct-openai.ts    # 直接 OpenAI API 调用
│   ├── env.ts              # 环境变量配置
│   ├── evaluation.ts       # 评估功能
│   ├── feedback.ts         # 反馈系统
│   ├── langchain-config.ts # LangChain 配置
│   └── utils.ts            # 通用工具函数
├── stores/                 # 状态管理
│   └── agent-store.ts      # 代理状态存储
├── types/                  # TypeScript 类型定义
│   └── index.ts            # 类型定义
├── public/                 # 静态资源
├── .env.local              # 本地环境变量
├── next.config.js          # Next.js 配置
├── package.json            # 项目依赖
├── tailwind.config.js      # Tailwind CSS 配置
└── tsconfig.json           # TypeScript 配置
```

## 🔑 环境变量

| 变量名 | 描述 | 必需
|-----|-----|-----
| `OPENAI_API_KEY` | OpenAI API 密钥 | 是
| `LANGCHAIN_TRACING_V2` | 启用 LangSmith 跟踪 (true/false) | 否
| `LANGCHAIN_API_KEY` | LangSmith API 密钥 | 否
| `LANGCHAIN_PROJECT` | LangSmith 项目名称 | 否
| `NEXT_PUBLIC_LANGCHAIN_TRACING` | 客户端跟踪 (true/false) | 否
| `NEXT_PUBLIC_LANGCHAIN_API_KEY` | 客户端 LangSmith API 密钥 | 否
| `NEXT_PUBLIC_LANGCHAIN_PROJECT` | 客户端 LangSmith 项目名称 | 否


## 🤖 代理系统

AI TaskMate 使用四个专业代理协同工作：

1. **规划代理**：将用户目标分解为清晰、可操作的任务
2. **搜索代理**：收集任务相关的信息
3. **推理代理**：处理和分析收集到的信息
4. **写作代理**：将所有信息和分析综合成结构化输出


每个代理都使用专门的提示词和参数配置，以优化其特定任务的性能。系统还包含备用实现，在 LangChain 出现问题时可以直接调用 OpenAI API。

## 📊 LangSmith 集成

AI TaskMate 与 LangSmith 平台集成，提供以下功能：

- **跟踪**：记录所有 LLM 调用和链执行
- **评估**：分析代理性能和输出质量
- **调试**：识别和解决问题
- **优化**：改进提示词和参数


要启用 LangSmith 集成，请设置以下环境变量：

```plaintext
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_PROJECT=ai-taskmate
```

## 🤝 贡献指南

我们欢迎并感谢所有形式的贡献。以下是一些贡献方式：

1. **报告 Bug**：如果你发现了 Bug，请创建一个 Issue
2. **提出新功能**：如果你有新功能的想法，请创建一个 Issue 讨论
3. **提交代码**：如果你想贡献代码，请提交 Pull Request


### 开发流程

1. Fork 仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request


## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
