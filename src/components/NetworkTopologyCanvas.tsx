'use client';

import React from 'react';
import { 
  Globe, 
  Router, 
  Server, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Plus, 
  Wifi,
  Cable,
  Radio,
  Info,
  Sliders,
  Zap
} from 'lucide-react';
import { NetworkDevice, DeviceType } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface NetworkTopologyCanvasProps {
  devices: NetworkDevice[];
  onSelectDevice: (device: NetworkDevice) => void;
  onOpenAddDevice: () => void;
}

export const NetworkTopologyCanvas: React.FC<NetworkTopologyCanvasProps> = ({
  devices,
  onSelectDevice,
  onOpenAddDevice,
}) => {
  // 1. Cari atau buat fallback Router Node
  const routerNode = devices.find(d => d.type === 'ROUTER') || {
    id: 'router-gw-main',
    name: 'Router Tenda Utama (Makassar)',
    type: 'ROUTER' as DeviceType,
    connectionType: 'LAN' as const,
    ip: '192.168.0.1',
    mac: 'b4:0f:3b:ef:25:60',
    status: 'ONLINE' as const,
    downloadMbps: devices.reduce((sum, d) => sum + (d.type !== 'ROUTER' ? d.downloadMbps : 0), 0) || 45.0,
    uploadMbps: devices.reduce((sum, d) => sum + (d.type !== 'ROUTER' ? d.uploadMbps : 0), 0) || 12.0,
    maxMbpsLimit: 100,
    pingMs: 6,
    packetLossPercent: 0,
    connectedSince: 'Terhubung',
    interfaceName: 'Gateway WAN/LAN',
    topApplications: [],
    history: [],
  };

  // 2. Ambil seluruh perangkat client yang terhubung (Wi-Fi & LAN)
  const clientDevices = devices.filter(d => d.id !== routerNode.id && d.type !== 'ROUTER');

  const internetCoords = { x: 750, y: 65 };
  const routerCoords = { x: 450, y: 110 };

  // 3. Hitung koordinat dinamis untuk setiap perangkat terhubung
  const totalClients = clientDevices.length;
  const getChildCoords = (index: number) => {
    if (totalClients <= 1) {
      return { x: 450, y: 350 };
    }
    const startX = 80;
    const endX = 820;
    const stepX = (endX - startX) / (totalClients - 1);
    const x = startX + index * stepX;
    
    // Zig-zag Y offset jika banyak perangkat agar tidak bertumpukan
    const yOffset = totalClients > 5 ? (index % 2 === 0 ? 0 : 45) : 0;
    const y = 340 + yOffset;
    
    return { x, y };
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'SERVER':
        return <Server className="w-8 h-8 text-white stroke-[2.5]" />;
      case 'DESKTOP':
        return <Monitor className="w-8 h-8 text-black stroke-[2.5]" />;
      case 'LAPTOP':
        return <Laptop className="w-8 h-8 text-black stroke-[2.5]" />;
      case 'MOBILE':
        return <Smartphone className="w-8 h-8 stroke-[2.5]" />;
      default:
        return <Radio className="w-8 h-8 text-black stroke-[2.5]" />;
    }
  };

  const getDeviceBgColor = (dev: NetworkDevice) => {
    if (dev.status === 'LATENCY_SPIKE') return 'bg-rose-500 text-white animate-bounce';
    if (dev.isBlocked) return 'bg-slate-800 text-slate-400 opacity-60';
    if (dev.connectionType === 'WIFI') {
      if (dev.type === 'MOBILE') return 'bg-pink-400 text-black';
      return 'bg-teal-400 text-black';
    }
    if (dev.type === 'SERVER') return 'bg-indigo-500 text-white';
    if (dev.type === 'DESKTOP') return 'bg-cyan-400 text-black';
    return 'bg-lime-400 text-black';
  };

  const getBorderColor = (dev: NetworkDevice) => {
    if (dev.status === 'LATENCY_SPIKE') return 'border-rose-500 text-rose-300';
    if (dev.connectionType === 'WIFI') return 'border-pink-400 text-pink-300';
    if (dev.type === 'SERVER') return 'border-indigo-400 text-indigo-300';
    return 'border-lime-400 text-lime-300';
  };

  return (
    <div className="maxi-card rounded-3xl p-5 border-3 border-purple-500 relative overflow-hidden flex flex-col font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-purple-900/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-pink-500 text-white">CANVAS TOPOLOGI REALTIME</span>
            <h2 className="text-xl font-black text-white font-display">
              TOPOLOGI JARINGAN KANTOR MAKASSAR
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-bold mt-1">
            Menampilkan <strong className="text-lime-400 font-black">{totalClients} Perangkat Terhubung</strong> (Router Tenda, Wi-Fi Staff & Cable LAN)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-bold bg-black px-3 py-1.5 rounded-xl border-2 border-pink-500 shadow-[3px_3px_0_#000]">
            <span className="flex items-center gap-1 text-lime-400">
              <Cable className="w-3.5 h-3.5 text-lime-400" />
              Kabel LAN (Garis Penuh)
            </span>
            <span className="flex items-center gap-1 text-pink-400">
              <Wifi className="w-3.5 h-3.5 text-pink-400" />
              Wi-Fi Direct ({devices.filter(d => d.connectionType === 'WIFI').length} Perangkat)
            </span>
          </div>

          <button
            onClick={() => {
              onOpenAddDevice();
              audioHUD.playClick();
            }}
            className="maxi-btn px-4 py-1.5 rounded-xl bg-lime-400 text-black text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Tambah Node</span>
          </button>
        </div>
      </div>

      {/* Interactive Topology Visualizer Canvas */}
      <div className="relative w-full h-[530px] my-3 bg-[#080516] rounded-2xl border-3 border-black maxi-dots overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
        
        {/* SVG LINK VECTOR LINES WITH ANIMATED PACKET BUBBLES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          
          {/* 1. Internet -> Router (WAN Link) */}
          <g>
            <line
              x1={routerCoords.x}
              y1={routerCoords.y}
              x2={internetCoords.x}
              y2={internetCoords.y}
              stroke="#06b6d4"
              strokeWidth="4"
            />
            <circle r="6" fill="#facc15" stroke="#000" strokeWidth="2">
              <animateMotion
                path={`M ${internetCoords.x} ${internetCoords.y} L ${routerCoords.x} ${routerCoords.y}`}
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
            <foreignObject
              x={(routerCoords.x + internetCoords.x) / 2 - 50}
              y={(routerCoords.y + internetCoords.y) / 2 - 16}
              width="100"
              height="32"
            >
              <div className="bg-black text-[10px] font-black text-cyan-300 px-2 py-0.5 rounded-lg border-2 border-cyan-400 text-center shadow-[3px_3px_0_#000]">
                WAN {routerNode.downloadMbps.toFixed(1)}M
              </div>
            </foreignObject>
          </g>

          {/* 2. Dynamic Router -> Client Devices Links */}
          {clientDevices.map((dev, idx) => {
            const target = getChildCoords(idx);
            const isWifi = dev.connectionType === 'WIFI';
            const strokeColor = dev.status === 'LATENCY_SPIKE' ? '#f43f5e' : isWifi ? '#ec4899' : '#a3e635';
            const animDur = dev.downloadMbps > 25 ? '0.7s' : '1.8s';

            return (
              <g key={`link-${dev.id}`}>
                <line
                  x1={routerCoords.x}
                  y1={routerCoords.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={strokeColor}
                  strokeWidth={isWifi ? '3.5' : '4'}
                  strokeDasharray={isWifi ? '8 6' : undefined}
                />
                <circle r="5.5" fill={isWifi ? '#ec4899' : '#a3e635'} stroke="#000" strokeWidth="2">
                  <animateMotion
                    path={`M ${routerCoords.x} ${routerCoords.y} L ${target.x} ${target.y}`}
                    dur={animDur}
                    repeatCount="indefinite"
                  />
                </circle>
                <foreignObject
                  x={(routerCoords.x + target.x) / 2 - 45}
                  y={(routerCoords.y + target.y) / 2 - 14}
                  width="90"
                  height="28"
                >
                  <div className={`bg-black text-[9px] font-black px-1.5 py-0.5 rounded-lg border-2 text-center shadow-[2px_2px_0_#000] truncate ${
                    isWifi ? 'border-pink-400 text-pink-300' : 'border-lime-400 text-lime-300'
                  }`}>
                    {isWifi ? 'Wi-Fi' : 'LAN'} {dev.downloadMbps.toFixed(1)}M
                  </div>
                </foreignObject>
              </g>
            );
          })}

        </svg>

        {/* NODE AVATARS LAYER */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* A. INTERNET CLOUD NODE */}
          <div
            style={{ left: `${internetCoords.x}px`, top: `${internetCoords.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-cyan-400 border-3 border-black p-2.5 flex items-center justify-center shadow-[5px_5px_0_#000] group-hover:scale-110 transition-transform">
                <Globe className="w-10 h-10 text-black stroke-[2.5]" />
              </div>
              <span className="mt-2 maxi-sticker bg-black text-cyan-300 border-2 border-cyan-400">
                INTERNET (WAN)
              </span>
            </div>
          </div>

          {/* B. ROUTER NODE (GATEWAY) */}
          <div
            style={{ left: `${routerCoords.x}px`, top: `${routerCoords.y}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          >
            <div 
              onClick={() => {
                onSelectDevice(routerNode);
                audioHUD.playClick();
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-3xl bg-lime-400 border-3 border-black p-2.5 flex flex-col items-center justify-center shadow-[6px_6px_0_#000] group-hover:scale-110 transition-transform">
                <Router className="w-10 h-10 text-black stroke-[2.5] animate-pulse" />
                <span className="text-[9px] font-black text-black mt-0.5 bg-white px-1.5 rounded border border-black">GATEWAY</span>
              </div>
              <div className="mt-2 px-3 py-1 rounded-xl bg-black border-2 border-lime-400 text-center shadow-[4px_4px_0_#000]">
                <p className="text-xs font-black text-white">{routerNode.name}</p>
                <p className="text-[10px] text-lime-300 font-bold">IP: {routerNode.ip}</p>
              </div>
            </div>
          </div>

          {/* C. DYNAMIC CLIENT NODES */}
          {clientDevices.map((dev, idx) => {
            const coords = getChildCoords(idx);
            const badgeBorder = getBorderColor(dev);

            return (
              <div
                key={dev.id}
                style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <div 
                  onClick={() => {
                    onSelectDevice(dev);
                    audioHUD.playClick();
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-2xl border-3 border-black flex items-center justify-center shadow-[5px_5px_0_#000] group-hover:scale-110 transition-transform ${getDeviceBgColor(dev)}`}>
                    {getDeviceIcon(dev.type)}
                  </div>
                  <div className={`mt-1.5 px-2 py-0.5 rounded-xl bg-black border-2 text-center shadow-[3px_3px_0_#000] max-w-[120px] ${badgeBorder}`}>
                    <p className="text-[11px] font-black text-white truncate">{dev.name}</p>
                    <p className="text-[9px] font-bold text-slate-300">{dev.ip}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="inline-block px-1 py-0.2 text-[8px] font-black rounded bg-slate-900 text-cyan-300 border border-slate-700">
                        {dev.downloadMbps.toFixed(1)} Mbps
                      </span>
                      {dev.isThrottled && (
                        <span className="inline-block px-1 text-[8px] font-black rounded bg-yellow-400 text-black">
                          LIMIT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Footer Info Strip */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-extrabold text-black bg-lime-400 px-4 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0_#000] pointer-events-auto">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-black stroke-[3]" />
            <span>TERHUBUNG REAL-TIME: KLIK NODE UNTUK INSPEKSI METRIK & LIMIT BANDWIDTH</span>
          </div>
          <span className="bg-black text-white px-2.5 py-0.5 rounded-lg text-[11px] font-black hidden md:block">
            {totalClients} CLIENT TERHUBUNG
          </span>
        </div>

      </div>

    </div>
  );
};

