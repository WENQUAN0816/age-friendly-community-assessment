# 老龄友好社区评估系统

## Age-Friendly Community Assessment System

一个基于中国国情的老龄友好社区宜居性评估平台，采用8大类别47个指标的综合评估体系。

### 🎯 项目特色

- **科学的评估体系**: 基于8大类别47个专业指标
- **灵活的数据输入**: 支持手动数据录入，适应不同数据源
- **地图可视化**: 集成高德地图，直观展示社区位置和评估结果
- **社区对比功能**: 多维度对比分析不同社区的老龄友好程度
- **现代化界面**: 基于React + TypeScript + Tailwind CSS

### 📊 评估指标体系

| 类别代码 | 类别名称 | 指标数量 | 描述 |
|---------|---------|---------|------|
| A | 公共空间环境安全性 | 7个 | 户外空间、住宅公共环境 |
| B | 老年友好设施建设 | 4个 | 公共设施的老年友好程度 |
| C | 交通与出行 | 6个 | 交通基础设施和出行便利性 |
| D | 健康服务 | 6个 | 医疗服务和心理健康支持 |
| E | 应急响应 | 6个 | 应急设施和管理能力 |
| F | 社区支持网络 | 7个 | 服务提供和社区互助 |
| G | 社区文化与组织 | 5个 | 管理参与和文化发展 |
| H | 智慧社区发展 | 6个 | 信息服务和智能养老 |

### 🚀 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS + Headless UI
- **图表**: Recharts
- **地图**: 高德地图 API
- **图标**: Lucide React
- **部署**: Vercel (推荐)

### 📦 快速开始

1. **克隆项目**
```bash
git clone <repository-url>
cd age-friendly-community-assessment
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加以下配置：
```
NEXT_PUBLIC_AMAP_KEY=your_amap_api_key
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**
打开 [http://localhost:3000](http://localhost:3000)

### 🗂️ 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首页
│   ├── assessment/       # 评估相关页面
│   ├── comparison/       # 对比分析页面
│   └── data/            # 数据管理页面
├── components/           # 可复用组件
│   ├── ui/              # 基础UI组件
│   ├── forms/           # 表单组件
│   ├── charts/          # 图表组件
│   └── maps/            # 地图组件
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
└── lib/                 # 第三方库配置
```

### 🔧 主要功能

#### 1. 社区评估
- 创建新的社区评估
- 基于47个指标的数据录入
- 自动计算各类别和总体得分
- 评估结果可视化展示

#### 2. 数据管理
- 支持手动数据录入
- 数据验证和错误提示
- 评估历史记录管理
- 数据导入导出功能

#### 3. 地图集成
- 高德地图集成
- 社区位置标注
- 地理信息可视化
- 区域分析功能

#### 4. 对比分析
- 多社区横向对比
- 指标详细对比
- 可视化图表展示
- 报告生成功能

### 🌐 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# 高德地图API密钥
NEXT_PUBLIC_AMAP_KEY=your_amap_api_key

# 数据库连接（如果使用）
DATABASE_URL=your_database_url

# API基础URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 📝 开发指南

#### 添加新指标
1. 修改 `src/types/indicators.ts` 中的 `INDICATOR_SYSTEM`
2. 更新相关的表单组件
3. 调整评分算法

#### 自定义样式
- 主要样式在 `src/app/globals.css`
- 使用Tailwind CSS类进行样式设置
- 自定义组件样式在各组件文件中

#### 地图配置
- 在 `src/components/maps/` 中配置地图组件
- 高德地图API文档: https://lbs.amap.com/

### 🚢 部署

#### Vercel部署（推荐）
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 自动部署

#### 其他平台
```bash
npm run build
npm run start
```

### 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](../../issues)
- 邮箱: your.email@example.com

### 🙏 致谢

感谢所有为老龄友好社区建设贡献力量的研究者和实践者。