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
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${process.env.NEXT_PUBLIC_AMAP_KEY}`;
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
          
          // 逆地理编码获取地址
          const geocoder = new window.AMap.Geocoder();
          geocoder.getAddress([lng, lat], (status: string, result: any) => {
            if (status === 'complete' && result.regeocode) {
              const address = result.regeocode.formattedAddress;
              onLocationSelect?.({ lng, lat, address });
            }
          });
        });

        // 标记拖拽事件
        markerInstance.on('dragend', (e: any) => {
          const { lng, lat } = e.lnglat;
          const geocoder = new window.AMap.Geocoder();
          geocoder.getAddress([lng, lat], (status: string, result: any) => {
            if (status === 'complete' && result.regeocode) {
              const address = result.regeocode.formattedAddress;
              onLocationSelect?.({ lng, lat, address });
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