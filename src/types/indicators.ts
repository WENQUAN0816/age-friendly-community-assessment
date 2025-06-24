// 老龄友好社区指标体系类型定义
export interface IndicatorData {
  code: string;
  name: string;
  value: number | null; // 允许为空，支持手动输入
  unit?: string;
  description?: string;
}

export interface CategoryData {
  code: string;
  name: string;
  indicators: IndicatorData[];
  score?: number; // 计算得出的分数
  weight: number; // 权重
}

export interface CommunityAssessment {
  id: string;
  name: string;
  location: {
    province: string;
    city: string;
    district: string;
    address?: string;
    coordinates?: [number, number]; // [lng, lat]
  };
  categories: CategoryData[];
  totalScore?: number;
  assessmentDate: string;
  assessor?: string;
  notes?: string;
}

// 指标体系定义
export const INDICATOR_SYSTEM: CategoryData[] = [
  {
    code: 'A',
    name: '公共空间环境安全性',
    weight: 0.125,
    indicators: [
      // A1 - 社区户外空间
      { code: 'A11', name: '老年友好休闲空间设计', value: null, unit: '分' },
      { code: 'A12', name: '公共空间遮阴覆盖率', value: null, unit: '%' },
      { code: 'A13', name: '老年人专用停车位比例', value: null, unit: '%' },
      { code: 'A14', name: '户外空间应急功能适应性', value: null, unit: '分' },
      // A2 - 住宅公共环境
      { code: 'A21', name: '电梯紧急呼叫系统覆盖率', value: null, unit: '%' },
      { code: 'A22', name: '住宅公共空间防滑地面覆盖率', value: null, unit: '%' },
      { code: 'A23', name: '公共空间室内空气质量', value: null, unit: '分' },
    ]
  },
  {
    code: 'B',
    name: '老年友好设施建设',
    weight: 0.125,
    indicators: [
      { code: 'B11', name: '公共厕所老年友好设施完备性', value: null, unit: '分' },
      { code: 'B12', name: '老年友好休憩设施覆盖率', value: null, unit: '%' },
      { code: 'B13', name: '老年友好照明设施覆盖率', value: null, unit: '%' },
      { code: 'B14', name: '老年友好设施15分钟步行覆盖率', value: null, unit: '%' },
    ]
  },
  {
    code: 'C',
    name: '交通与出行',
    weight: 0.125,
    indicators: [
      { code: 'C11', name: '轮椅通行走廊宽度达标率', value: null, unit: '%' },
      { code: 'C12', name: '路面及排水标准达标率', value: null, unit: '%' },
      { code: 'C13', name: '社区主要道路人车分离比例', value: null, unit: '%' },
      { code: 'C14', name: '公交站点老年友好设施覆盖率', value: null, unit: '%' },
      { code: 'C15', name: '夜间人行道照明标准达标率', value: null, unit: '%' },
      { code: 'C16', name: '社区应急出口老年人无障碍性和便利性', value: null, unit: '分' },
    ]
  },
  {
    code: 'D',
    name: '健康服务',
    weight: 0.125,
    indicators: [
      { code: 'D11', name: '居家养老服务覆盖率', value: null, unit: '%' },
      { code: 'D12', name: '基层医疗服务满意率', value: null, unit: '%' },
      { code: 'D13', name: '家庭医生签约率', value: null, unit: '%' },
      { code: 'D14', name: '健康档案和慢病管理覆盖率', value: null, unit: '%' },
      { code: 'D21', name: '每千名老年人心理健康咨询师比例', value: null, unit: '‰' },
      { code: 'D22', name: '年度心理筛查参与率', value: null, unit: '%' },
    ]
  },
  {
    code: 'E',
    name: '应急响应',
    weight: 0.125,
    indicators: [
      { code: 'E11', name: '应急救援设施覆盖率', value: null, unit: '%' },
      { code: 'E12', name: '综合应急物资储备达标率', value: null, unit: '%' },
      { code: 'E21', name: '应急志愿服务参与率', value: null, unit: '%' },
      { code: 'E22', name: '社区应急演练频次', value: null, unit: '次/年' },
      { code: 'E23', name: '关键应急响应预案要素完备率', value: null, unit: '%' },
      { code: 'E24', name: '应急车辆平均响应时间', value: null, unit: '分钟' },
    ]
  },
  {
    code: 'F',
    name: '社区支持网络',
    weight: 0.125,
    indicators: [
      { code: 'F11', name: '志愿者助老服务覆盖率', value: null, unit: '%' },
      { code: 'F12', name: '老年人就业培训参与率', value: null, unit: '%' },
      { code: 'F13', name: '老年人数字技能培训年度频次', value: null, unit: '次/年' },
      { code: 'F14', name: '传统线下服务窗口保留率', value: null, unit: '%' },
      { code: 'F21', name: '失能老年人一对一帮扶比例', value: null, unit: '%' },
      { code: 'F22', name: '独居老年人访问频次', value: null, unit: '次/月' },
      { code: 'F23', name: '邻里互助网络活跃度', value: null, unit: '分' },
    ]
  },
  {
    code: 'G',
    name: '社区文化与组织',
    weight: 0.125,
    indicators: [
      { code: 'G11', name: '活动信息传播渠道多样性', value: null, unit: '分' },
      { code: 'G12', name: '活动安排对老年人的适宜性', value: null, unit: '分' },
      { code: 'G21', name: '普惠性老年导向活动频次', value: null, unit: '次/月' },
      { code: 'G22', name: '敬老文化推广活动覆盖率', value: null, unit: '%' },
      { code: 'G23', name: '代际互动活动频次', value: null, unit: '次/月' },
    ]
  },
  {
    code: 'H',
    name: '智慧社区发展',
    weight: 0.125,
    indicators: [
      { code: 'H11', name: '政务服务老年友好化改造率', value: null, unit: '%' },
      { code: 'H12', name: '老年友好公共信息达标率', value: null, unit: '%' },
      { code: 'H21', name: '线上社区养老服务利用率', value: null, unit: '%' },
      { code: 'H22', name: '老年人智能健康监测设备使用率', value: null, unit: '%' },
      { code: 'H23', name: '智能安防系统覆盖率及运行效果', value: null, unit: '分' },
      { code: 'H24', name: 'AI跌倒检测系统覆盖率', value: null, unit: '%' },
    ]
  }
];