'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface CommunitySearchProps {
  onLocationSelect?: (location: { lng: number; lat: number; address: string }) => void;
}

interface SearchResult {
  id: string;
  name: string;
  address: string;
  location: [number, number];
}

declare global {
  interface Window {
    AMap: any;
  }
}

export default function CommunitySearch({ onLocationSelect }: CommunitySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadAMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.AMap) {
          resolve(window.AMap);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://webapi.amap.com/maps?v=2.0&key=4ff904ae7801718e67ca9447737b80df&plugin=AMap.PlaceSearch`;
        script.onload = () => resolve(window.AMap);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadAMapScript();
  }, []);

  // 搜索小区
  const searchCommunities = async (keyword: string) => {
    if (!keyword.trim() || !window.AMap) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      const placeSearch = new window.AMap.PlaceSearch({
        type: '120300|120200', // 住宅区和商业区
        pageSize: 10,
        pageIndex: 1,
        city: '全国', // 在全国范围内搜索
        citylimit: false
      });

      placeSearch.search(keyword, (status: string, result: any) => {
        setIsSearching(false);
        
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          const results: SearchResult[] = result.poiList.pois
            .filter((poi: any) => 
              poi.name.includes('小区') || poi.name.includes('花园') || 
              poi.name.includes('苑') || poi.name.includes('家园') ||
              poi.name.includes('新村') || poi.name.includes('公馆') ||
              poi.type.includes('住宅')
            )
            .map((poi: any) => ({
              id: poi.id || Math.random().toString(),
              name: poi.name,
              address: poi.pname + poi.cityname + poi.adname + poi.address,
              location: [poi.location.lng, poi.location.lat]
            }));

          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      });
    } catch (error) {
      console.error('搜索失败:', error);
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchCommunities(searchTerm);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 选择搜索结果
  const selectResult = (result: SearchResult) => {
    setSearchTerm(result.name);
    setShowResults(false);
    onLocationSelect?.({
      lng: result.location[0],
      lat: result.location[1],
      address: `${result.name} - ${result.address}`
    });
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索小区名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">搜索中...</p>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchTerm.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">未找到相关小区</p>
              <p className="text-xs mt-1">请尝试更换关键词</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectResult(result)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {result.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {result.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 