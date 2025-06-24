'use client';

import { useState } from 'react';
import { ArrowLeft, Save, MapPin, Calculator } from 'lucide-react';
import Link from 'next/link';
import { INDICATOR_SYSTEM, type CommunityAssessment, type CategoryData, type IndicatorData } from '@/types/indicators';
import CommunityMap from '@/components/maps/CommunityMap';
import CommunitySearch from '@/components/maps/CommunitySearch';

export default function NewAssessmentPage() {
  const [assessment, setAssessment] = useState<CommunityAssessment>({
    id: '',
    name: '',
    location: {
      province: '',
      city: '',
      district: '',
      address: '',
      coordinates: undefined
    },
    categories: INDICATOR_SYSTEM.map(category => ({
      ...category,
      indicators: category.indicators.map(indicator => ({ ...indicator }))
    })),
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showMap, setShowMap] = useState(false);

  // 计算单个类别得分
  const calculateCategoryScore = (category: CategoryData): number => {
    const validIndicators = category.indicators.filter(ind => ind.value !== null && ind.value !== undefined);
    if (validIndicators.length === 0) return 0;
    
    const sum = validIndicators.reduce((acc, ind) => acc + (ind.value || 0), 0);
    return Math.round((sum / validIndicators.length) * 10) / 10;
  };

  // 计算总分
  const calculateTotalScore = (): number => {
    const categoryScores = assessment.categories.map(category => ({
      score: calculateCategoryScore(category),
      weight: category.weight
    }));
    
    const totalScore = categoryScores.reduce((acc, { score, weight }) => acc + (score * weight), 0);
    return Math.round(totalScore * 10) / 10;
  };

  // 更新指标值
  const updateIndicatorValue = (categoryCode: string, indicatorCode: string, value: number | null) => {
    setAssessment(prev => ({
      ...prev,
      categories: prev.categories.map(category => 
        category.code === categoryCode
          ? {
              ...category,
              indicators: category.indicators.map(indicator =>
                indicator.code === indicatorCode
                  ? { ...indicator, value }
                  : indicator
              )
            }
          : category
      )
    }));
  };

  // 处理地图位置选择
  const handleLocationSelect = (location: { lng: number; lat: number; address: string }) => {
    setAssessment(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: location.address,
        coordinates: [location.lng, location.lat]
      }
    }));
  };

  // 保存评估
  const handleSave = () => {
    const updatedAssessment = {
      ...assessment,
      id: Date.now().toString(),
      totalScore: calculateTotalScore(),
      categories: assessment.categories.map(category => ({
        ...category,
        score: calculateCategoryScore(category)
      }))
    };

    // 这里可以保存到localStorage或发送到API
    localStorage.setItem(`assessment_${updatedAssessment.id}`, JSON.stringify(updatedAssessment));
    
    alert('评估已保存！');
  };

  const steps = [
    '基本信息',
    '公共空间环境安全性 (A)',
    '老年友好设施建设 (B)',
    '交通与出行 (C)',
    '健康服务 (D)',
    '应急响应 (E)',
    '社区支持网络 (F)',
    '社区文化与组织 (G)',
    '智慧社区发展 (H)',
    '评估总结'
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            社区名称 *
          </label>
          <input
            type="text"
            value={assessment.name}
            onChange={(e) => setAssessment(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入社区名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评估人员
          </label>
          <input
            type="text"
            value={assessment.assessor}
            onChange={(e) => setAssessment(prev => ({ ...prev, assessor: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入评估人员姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            省份
          </label>
          <input
            type="text"
            value={assessment.location.province}
            onChange={(e) => setAssessment(prev => ({ 
              ...prev, 
              location: { ...prev.location, province: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入省份"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            城市
          </label>
          <input
            type="text"
            value={assessment.location.city}
            onChange={(e) => setAssessment(prev => ({ 
              ...prev, 
              location: { ...prev.location, city: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入城市"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            区县
          </label>
          <input
            type="text"
            value={assessment.location.district}
            onChange={(e) => setAssessment(prev => ({ 
              ...prev, 
              location: { ...prev.location, district: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入区县"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评估日期
          </label>
          <input
            type="date"
            value={assessment.assessmentDate}
            onChange={(e) => setAssessment(prev => ({ ...prev, assessmentDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            社区位置
          </label>
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <MapPin className="h-4 w-4 mr-1" />
            {showMap ? '隐藏地图' : '选择位置'}
          </button>
        </div>
        
        {/* 小区搜索功能 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            搜索小区名称
          </label>
          <CommunitySearch onLocationSelect={handleLocationSelect} />
        </div>
        
        {assessment.location.address && (
          <p className="text-sm text-gray-600 mb-2">
            当前地址: {assessment.location.address}
          </p>
        )}
        
        {showMap && (
          <CommunityMap
            onLocationSelect={handleLocationSelect}
            initialLocation={
              assessment.location.coordinates 
                ? { lng: assessment.location.coordinates[0], lat: assessment.location.coordinates[1] }
                : undefined
            }
            height="300px"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          备注说明
        </label>
        <textarea
          value={assessment.notes}
          onChange={(e) => setAssessment(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入评估相关的备注信息..."
        />
      </div>
    </div>
  );

  const renderCategoryForm = (categoryIndex: number) => {
    const category = assessment.categories[categoryIndex];
    if (!category) return null;

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {category.code} - {category.name}
          </h3>
          <p className="text-blue-600 text-sm">
            请为以下 {category.indicators.length} 个指标输入相应的数值
          </p>
        </div>

        <div className="grid gap-4">
          {category.indicators.map((indicator, index) => (
            <div key={indicator.code} className="bg-white p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {indicator.code} - {indicator.name}
                  </label>
                  {indicator.unit && (
                    <span className="text-xs text-gray-500">单位: {indicator.unit}</span>
                  )}
                </div>
                <div className="ml-4 w-32">
                  <input
                    type="number"
                    step="0.1"
                    value={indicator.value || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseFloat(e.target.value);
                      updateIndicatorValue(category.code, indicator.code, value);
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入数值"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {category.name} 得分:
            </span>
            <span className="text-lg font-bold text-blue-600">
              {calculateCategoryScore(category).toFixed(1)} 分
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">评估总分</h3>
          <div className="text-4xl font-bold">{calculateTotalScore().toFixed(1)}</div>
          <p className="text-blue-100 mt-2">满分100分</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {assessment.categories.map((category) => (
          <div key={category.code} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">
                {category.code} - {category.name}
              </h4>
              <span className="text-lg font-bold text-blue-600">
                {calculateCategoryScore(category).toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {category.indicators.filter(ind => ind.value !== null).length} / {category.indicators.length} 个指标已填写
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(calculateCategoryScore(category) / 100) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">评估说明</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 评估基于8大类别47个指标</li>
          <li>• 每个类别权重为12.5%</li>
          <li>• 总分为各类别得分的加权平均</li>
          <li>• 建议完善所有指标数据以获得准确评估</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span>返回首页</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">新建社区评估</h1>
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              保存评估
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 步骤导航 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">评估步骤</h3>
              <nav className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentStep === index
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}. {step}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calculator className="h-4 w-4" />
                  <span>当前总分:</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {calculateTotalScore().toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep]}
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* 渲染当前步骤内容 */}
              {currentStep === 0 && renderBasicInfo()}
              {currentStep >= 1 && currentStep <= 8 && renderCategoryForm(currentStep - 1)}
              {currentStep === 9 && renderSummary()}

              {/* 导航按钮 */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一步
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一步
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}