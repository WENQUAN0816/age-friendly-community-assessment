'use client';

import { useState } from 'react';
import { MapPin, BarChart3, Users, Settings, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">老龄友好社区评估系统</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">
                评估管理
              </Link>
              <Link href="/comparison" className="text-gray-600 hover:text-blue-600 transition-colors">
                社区对比
              </Link>
              <Link href="/data" className="text-gray-600 hover:text-blue-600 transition-colors">
                数据中心
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主页内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            老龄友好社区评估系统
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            基于8大类别47个指标的综合评估体系，科学评价社区老龄友好水平
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mb-8">
            ✅ 已部署至 Vercel - 版本 1.0
          </div>
          
          {/* 搜索栏 */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索社区..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 快速操作按钮 */}
          <div className="flex justify-center space-x-4">
            <Link href="/assessment/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>开始评估</span>
            </Link>
            <Link href="/comparison" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>社区对比</span>
            </Link>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">综合评估</h3>
            </div>
            <p className="text-gray-600">
              基于8大类别47个指标的科学评估体系，全面评价社区老龄友好水平
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">地图可视化</h3>
            </div>
            <p className="text-gray-600">
              集成高德地图，直观展示社区位置和评估结果，支持地理空间分析
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">社区对比</h3>
            </div>
            <p className="text-gray-600">
              多维度对比分析不同社区的老龄友好程度，为决策提供数据支持
            </p>
          </div>
        </div>

        {/* 评估指标体系预览 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">评估指标体系</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: 'A', name: '公共空间环境安全性', count: 7, color: 'bg-red-100 text-red-800' },
              { code: 'B', name: '老年友好设施建设', count: 4, color: 'bg-orange-100 text-orange-800' },
              { code: 'C', name: '交通与出行', count: 6, color: 'bg-yellow-100 text-yellow-800' },
              { code: 'D', name: '健康服务', count: 6, color: 'bg-green-100 text-green-800' },
              { code: 'E', name: '应急响应', count: 6, color: 'bg-blue-100 text-blue-800' },
              { code: 'F', name: '社区支持网络', count: 7, color: 'bg-indigo-100 text-indigo-800' },
              { code: 'G', name: '社区文化与组织', count: 5, color: 'bg-purple-100 text-purple-800' },
              { code: 'H', name: '智慧社区发展', count: 6, color: 'bg-pink-100 text-pink-800' },
            ].map((category) => (
              <div key={category.code} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${category.color}`}>
                    {category.code}
                  </span>
                  <span className="text-sm text-gray-500">{category.count}个指标</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* 最近评估 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">最近评估</h2>
            <Link href="/assessment" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </Link>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>暂无评估记录</p>
            <p className="text-sm mt-2">
              <Link href="/assessment/new" className="text-blue-600 hover:text-blue-700">
                开始第一个社区评估
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}