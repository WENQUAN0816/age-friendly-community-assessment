'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, MapPin, BarChart3, Trash2 } from 'lucide-react';
import { CommunityAssessment } from '@/types/indicators';

export default function AssessmentPage() {
  const [assessments, setAssessments] = useState<CommunityAssessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');

  useEffect(() => {
    // 从localStorage加载评估数据
    const loadAssessments = () => {
      const savedAssessments: CommunityAssessment[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('assessment_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '');
            savedAssessments.push(data);
          } catch (error) {
            console.error('Failed to parse assessment data:', error);
          }
        }
      }
      setAssessments(savedAssessments);
    };

    loadAssessments();
  }, []);

  // 过滤和排序评估数据
  const filteredAndSortedAssessments = assessments
    .filter(assessment => 
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.location.district.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime();
        case 'score':
          return (b.totalScore || 0) - (a.totalScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // 删除评估
  const handleDelete = (assessmentId: string) => {
    if (confirm('确定要删除这个评估吗？此操作不能撤销。')) {
      localStorage.removeItem(`assessment_${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.id !== assessmentId));
    }
  };

  // 获取评估等级颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // 获取评估等级标签
  const getScoreLabel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '待改善';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                老龄友好社区评估系统
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <span className="text-gray-600">评估管理</span>
            </div>
            <Link
              href="/assessment/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建评估
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">总评估数</p>
                <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">平均得分</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.length > 0 
                    ? (assessments.reduce((sum, a) => sum + (a.totalScore || 0), 0) / assessments.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">优秀社区</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => (a.totalScore || 0) >= 80).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">待改善社区</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => (a.totalScore || 0) < 60).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和排序 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索社区名称、城市或区县..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'name')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">按日期排序</option>
                <option value="score">按得分排序</option>
                <option value="name">按名称排序</option>
              </select>
            </div>
          </div>
        </div>

        {/* 评估列表 */}
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredAndSortedAssessments.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {assessments.length === 0 ? '暂无评估记录' : '没有找到匹配的评估'}
              </h3>
              <p className="text-gray-600 mb-4">
                {assessments.length === 0 
                  ? '开始创建您的第一个社区评估'
                  : '尝试使用不同的搜索词'
                }
              </p>
              {assessments.length === 0 && (
                <Link
                  href="/assessment/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新建评估
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedAssessments.map((assessment) => (
                <div key={assessment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assessment.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getScoreColor(assessment.totalScore || 0)}`}>
                          {getScoreLabel(assessment.totalScore || 0)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {assessment.location.city} {assessment.location.district}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{assessment.assessmentDate}</span>
                        </div>
                        {assessment.assessor && (
                          <span>评估人: {assessment.assessor}</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">总分:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {(assessment.totalScore || 0).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${((assessment.totalScore || 0) / 100) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/assessment/${assessment.id}`}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        查看详情
                      </Link>
                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="删除评估"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}