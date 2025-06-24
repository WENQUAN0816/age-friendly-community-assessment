'use client';

import { useEffect, useRef, useState } from 'react';

interface CommunityMapProps {
  onLocationSelect?: (location: { lng: number; lat: number; address: string }) => void;
  initialLocation?: { lng: number; lat: number };
  height?: string;
}

declare global {
  interface Window {
    AMap: any;
  }
}

export default function CommunityMap({ 
  onLocationSelect, 
  initialLocation = { lng: 116.397428, lat: 39.90923 }, // 默认北京
  height = '400px' 
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.AMap) {
          resolve(window.AMap);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://webapi.amap.com/maps?v=2.0&key=4ff904ae7801718e67ca9447737b80df&plugin=AMap.Geocoder,AMap.PlaceSearch`;
        script.onload = () => resolve(window.AMap);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        setIsLoading(true);
        await loadAMapScript();

        if (!mapRef.current) return;

        const mapInstance = new window.AMap.Map(mapRef.current, {
          zoom: 15,
          center: [initialLocation.lng, initialLocation.lat],
          mapStyle: 'amap://styles/normal',
        });

        // 添加比例尺
        mapInstance.addControl(new window.AMap.Scale());
        
        // 添加工具条
        mapInstance.addControl(new window.AMap.ToolBar({
          locate: true,
          noIpLocate: false,
          direction: true,
          autoPosition: false,
          position: { top: '10px', right: '10px' }
        }));

        // 创建标记
        const markerInstance = new window.AMap.Marker({
          position: [initialLocation.lng, initialLocation.lat],
          draggable: true,
          title: '社区位置'
        });

        mapInstance.add(markerInstance);

        // 添加点击事件
        mapInstance.on('click', (e: any) => {
          const { lng, lat } = e.lnglat;
          markerInstance.setPosition([lng, lat]);
          
          // 逆地理编码获取详细地址信息，包括小区名称
          const geocoder = new window.AMap.Geocoder({
            radius: 1000, // 搜索半径1000米
            extensions: 'all' // 返回详细信息
          });
          geocoder.getAddress([lng, lat], (status: string, result: any) => {
            if (status === 'complete' && result.regeocode) {
              const regeocode = result.regeocode;
              let address = regeocode.formattedAddress;
              let communityName = '';
              
              // 尝试获取更详细的地址信息，包括小区名称
              if (regeocode.addressComponent) {
                const component = regeocode.addressComponent;
                // 优先显示小区名称
                if (component.neighborhood && component.neighborhood.name) {
                  communityName = component.neighborhood.name;
                } else if (component.building && component.building.name) {
                  communityName = component.building.name;
                }
              }
              
              // 使用POI搜索进一步获取附近的小区信息
              const placeSearch = new window.AMap.PlaceSearch({
                type: '120300|120200', // 住宅区和商业区分类代码
                pageSize: 3,
                pageIndex: 1
              });
              
              placeSearch.searchNearBy('', [lng, lat], 300, (poiStatus: string, poiResult: any) => {
                let finalAddress = address;
                
                if (poiStatus === 'complete' && poiResult.poiList && poiResult.poiList.pois.length > 0) {
                  // 查找最近的住宅小区
                  const residentialPoi = poiResult.poiList.pois.find((poi: any) => 
                    poi.type.includes('住宅') || poi.type.includes('小区') || poi.name.includes('小区') || 
                    poi.name.includes('花园') || poi.name.includes('苑') || poi.name.includes('家园')
                  );
                  
                  if (residentialPoi && residentialPoi.name) {
                    communityName = residentialPoi.name;
                  } else if (poiResult.poiList.pois[0].name) {
                    // 如果没找到住宅类POI，使用最近的POI
                    const nearestPoi = poiResult.poiList.pois[0];
                    if (nearestPoi.distance < 100) { // 只有距离很近才使用
                      communityName = nearestPoi.name;
                    }
                  }
                }
                
                // 构建最终地址
                if (communityName && !finalAddress.includes(communityName)) {
                  finalAddress = `${communityName} - ${finalAddress}`;
                }
                
                onLocationSelect?.({ lng, lat, address: finalAddress });
              });
            } else {
              onLocationSelect?.({ lng, lat, address: '未知位置' });
            }
          });
        });

        // 标记拖拽事件
        markerInstance.on('dragend', (e: any) => {
          const { lng, lat } = e.lnglat;
          
          // 使用与点击事件相同的增强逆地理编码逻辑
          const geocoder = new window.AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          });
          
          geocoder.getAddress([lng, lat], (status: string, result: any) => {
            if (status === 'complete' && result.regeocode) {
              const regeocode = result.regeocode;
              let address = regeocode.formattedAddress;
              let communityName = '';
              
              if (regeocode.addressComponent) {
                const component = regeocode.addressComponent;
                if (component.neighborhood && component.neighborhood.name) {
                  communityName = component.neighborhood.name;
                } else if (component.building && component.building.name) {
                  communityName = component.building.name;
                }
              }
              
              // POI搜索获取小区信息
              const placeSearch = new window.AMap.PlaceSearch({
                type: '120300|120200',
                pageSize: 3,
                pageIndex: 1
              });
              
              placeSearch.searchNearBy('', [lng, lat], 300, (poiStatus: string, poiResult: any) => {
                let finalAddress = address;
                
                if (poiStatus === 'complete' && poiResult.poiList && poiResult.poiList.pois.length > 0) {
                  const residentialPoi = poiResult.poiList.pois.find((poi: any) => 
                    poi.type.includes('住宅') || poi.type.includes('小区') || poi.name.includes('小区') || 
                    poi.name.includes('花园') || poi.name.includes('苑') || poi.name.includes('家园')
                  );
                  
                  if (residentialPoi && residentialPoi.name) {
                    communityName = residentialPoi.name;
                  } else if (poiResult.poiList.pois[0].name) {
                    const nearestPoi = poiResult.poiList.pois[0];
                    if (nearestPoi.distance < 100) {
                      communityName = nearestPoi.name;
                    }
                  }
                }
                
                if (communityName && !finalAddress.includes(communityName)) {
                  finalAddress = `${communityName} - ${finalAddress}`;
                }
                
                onLocationSelect?.({ lng, lat, address: finalAddress });
              });
            } else {
              onLocationSelect?.({ lng, lat, address: '未知位置' });
            }
          });
        });

        setMap(mapInstance);
        setMarker(markerInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('地图初始化失败:', err);
        setError('地图加载失败，请检查网络连接');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, [initialLocation.lng, initialLocation.lat, onLocationSelect]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-300">
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">加载地图中...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ height }}
        className="w-full"
      />
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        点击地图或拖拽标记选择社区位置
      </div>
    </div>
  );
}