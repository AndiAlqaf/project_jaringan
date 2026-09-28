'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Router, 
  Server, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Plus, 
  Zap, 
  Info,
  Wifi,
  Cable,
  Flame,
  Radio
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
  const routerNode = devices.find(d => d.type === 'ROUTER');
  const serverNode = devices.find(d => d.type === 'SERVER');
  const pcNode = devices.find(d => d.type === 'DESKTOP');
  const laptopNode = devices.find(d => d.type === 'LAPTOP');
  const mobileNode = devices.find(d => d.type === 'MOBILE');

  const coords = {
    internet: { x: 740, y: 65 },
    router: { x: 450, y: 110 },
    server: { x: 700, y: 350 },
    pc: { x: 500, y: 355 },
    laptop: { x: 300, y: 355 },
    mobile: { x: 100, y: 350 },
  };

  const getStatusBoxStyle = (status: string) => {
    switch (status) {
      case 'HIGH_USAGE':
        return 'bg-amber-400 text-black border-3 border-black shadow-[4px_4px_0_#000]';
      case 'LATENCY_SPIKE':
      case 'WARNING':
        return 'bg-rose-500 text-white border-3 border-black shadow-[4px_4px_0_#000] animate-bounce';
      case 'OFFLINE':
        return 'bg-slate-800 text-slate-400 border-2 border-slate-700 opacity-60';
      default:
        return 'bg-lime-400 text-black border-3 border-black shadow-[4px_4px_0_#000]';
    }
  };

  return (
    <div className="maxi-card rounded-3xl p-5 border-3 border-purple-500 relative overflow-hidden flex flex-col font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-purple-900/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-pink-500 text-white">INTERAKTIF CANVAS</span>
            <h2 className="text-xl font-black text-white font-display">
              TOPOLOGI JARINGAN KANTOR (DIAGRAM SKEMATIK)
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-bold mt-1">
            Visualisasi Diagram PDF: Internet WAN, Router Gateway, Kabel LAN (Server, PC) & Wi-Fi Direct (Laptop, HP)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-bold bg-black px-3 py-1.5 rounded-xl border-2 border-pink-500 shadow-[3px_3px_0_#000]">
            <span className="flex items-center gap-1 text-lime-400">
              <Cable className="w-3.5 h-3.5 text-lime-400" />
              Kabel LAN (Garis Penuh)
            </span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Wifi className="w-3.5 h-3.5 text-cyan-300" />
              Wi-Fi (Garis Putus)
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
          
          {/* 1. Internet -> Router (WAN) */}
          <g>
            <line
              x1={coords.router.x}
              y1={coords.router.y}
              x2={coords.internet.x}
              y2={coords.internet.y}
              stroke="#06b6d4"
              strokeWidth="4"
            />
            <circle r="6" fill="#facc15" stroke="#000" strokeWidth="2">
              <animateMotion
                path={`M ${coords.internet.x} ${coords.internet.y} L ${coords.router.x} ${coords.router.y}`}
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
            <foreignObject
              x={(coords.router.x + coords.internet.x) / 2 - 50}
              y={(coords.router.y + coords.internet.y) / 2 - 16}
              width="100"
              height="32"
            >
              <div className="bg-black text-[10px] font-black text-cyan-300 px-2 py-0.5 rounded-lg border-2 border-cyan-400 text-center shadow-[3px_3px_0_#000]">
                WAN {routerNode?.downloadMbps.toFixed(1) || 84.5}M
              </div>
            </foreignObject>
          </g>

          {/* 2. Router -> Server (LAN 1 - Garis Penuh) */}
          {serverNode && (
            <g>
              <line
                x1={coords.router.x}
                y1={coords.router.y}
                x2={coords.server.x}
                y2={coords.server.y}
                stroke={serverNode.status === 'HIGH_USAGE' ? '#facc15' : '#a3e635'}
                strokeWidth="4"
              />
              <circle r="6" fill="#ec4899" stroke="#000" strokeWidth="2">
                <animateMotion
                  path={`M ${coords.router.x} ${coords.router.y} L ${coords.server.x} ${coords.server.y}`}
                  dur={serverNode.downloadMbps > 50 ? '0.7s' : '1.4s'}
                  repeatCount="indefinite"
                />
              </circle>
              <foreignObject
                x={600}
                y={245}
                width="90"
                height="30"
              >
                <div className="bg-black text-[10px] font-black text-lime-300 px-2 py-0.5 rounded-lg border-2 border-lime-400 text-center shadow-[3px_3px_0_#000]">
                  LAN-1 {serverNode.downloadMbps.toFixed(1)}M
                </div>
              </foreignObject>
            </g>
          )}

          {/* 3. Router -> PC (LAN 2 - Garis Penuh) */}
          {pcNode && (
            <g>
              <line
                x1={coords.router.x}
                y1={coords.router.y}
                x2={coords.pc.x}
                y2={coords.pc.y}
                stroke="#a3e635"
                strokeWidth="4"
              />
              <circle r="5" fill="#06b6d4" stroke="#000" strokeWidth="2">
                <animateMotion
                  path={`M ${coords.router.x} ${coords.router.y} L ${coords.pc.x} ${coords.pc.y}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <foreignObject
                x={430}
                y={255}
                width="90"
                height="30"
              >
                <div className="bg-black text-[10px] font-black text-lime-300 px-2 py-0.5 rounded-lg border-2 border-lime-400 text-center shadow-[3px_3px_0_#000]">
                  LAN-2 {pcNode.downloadMbps.toFixed(1)}M
                </div>
              </foreignObject>
            </g>
          )}

          {/* 4. Router -> Laptop (Wi-Fi - Garis Putus) */}
          {laptopNode && (
            <g>
              <line
                x1={coords.router.x}
                y1={coords.router.y}
                x2={coords.laptop.x}
                y2={coords.laptop.y}
                stroke="#ec4899"
                strokeWidth="3.5"
                strokeDasharray="8 6"
              />
              <circle r="5" fill="#a3e635" stroke="#000" strokeWidth="2">
                <animateMotion
                  path={`M ${coords.router.x} ${coords.router.y} L ${coords.laptop.x} ${coords.laptop.y}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <foreignObject
                x={290}
                y={245}
                width="100"
                height="30"
              >
                <div className="bg-black text-[10px] font-black text-pink-300 px-2 py-0.5 rounded-lg border-2 border-pink-400 text-center shadow-[3px_3px_0_#000]">
                  Wi-Fi {laptopNode.downloadMbps.toFixed(1)}M
                </div>
              </foreignObject>
            </g>
          )}

          {/* 5. Router -> Ponsel Mobile (Wi-Fi - Garis Putus) */}
          {mobileNode && (
            <g>
              <line
                x1={coords.router.x}
                y1={coords.router.y}
                x2={coords.mobile.x}
                y2={coords.mobile.y}
                stroke={mobileNode.status === 'LATENCY_SPIKE' ? '#f43f5e' : '#ec4899'}
                strokeWidth="3.5"
                strokeDasharray="8 6"
              />
              <circle r="5.5" fill={mobileNode.status === 'LATENCY_SPIKE' ? '#f43f5e' : '#facc15'} stroke="#000" strokeWidth="2">
                <animateMotion
                  path={`M ${coords.router.x} ${coords.router.y} L ${coords.mobile.x} ${coords.mobile.y}`}
                  dur={mobileNode.downloadMbps > 20 ? '0.6s' : '2.2s'}
                  repeatCount="indefinite"
                />
              </circle>
              <foreignObject
                x={180}
                y={240}
                width="100"
                height="30"
              >
                <div className={`bg-black text-[10px] font-black px-2 py-0.5 rounded-lg border-2 text-center shadow-[3px_3px_0_#000] ${
                  mobileNode.status === 'LATENCY_SPIKE' ? 'border-rose-500 text-rose-300 font-extrabold animate-bounce' : 'border-pink-400 text-pink-300'
                }`}>
                  Wi-Fi {mobileNode.downloadMbps.toFixed(1)}M
                </div>
              </foreignObject>
            </g>
          )}

        </svg>

        {/* NODE AVATARS LAYER */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* A. INTERNET CLOUD NODE */}
          <div
            style={{ left: `${coords.internet.x}px`, top: `${coords.internet.y}px` }}
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
          {routerNode && (
            <div
              style={{ left: `${coords.router.x}px`, top: `${coords.router.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <div 
                onClick={() => {
                  onSelectDevice(routerNode);
                  audioHUD.playClick();
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-22 h-22 rounded-3xl bg-lime-400 border-3 border-black p-3 flex flex-col items-center justify-center shadow-[6px_6px_0_#000] group-hover:scale-110 transition-transform">
                  <Router className="w-11 h-11 text-black stroke-[2.5] animate-pulse" />
                  <span className="text-[10px] font-black text-black mt-1 bg-white px-2 rounded border border-black">ROUTER GW</span>
                </div>
                <div className="mt-2 px-3 py-1 rounded-xl bg-black border-2 border-lime-400 text-center shadow-[4px_4px_0_#000]">
                  <p className="text-xs font-black text-white">{routerNode.name}</p>
                  <p className="text-[10px] text-lime-300 font-bold">IP: {routerNode.ip}</p>
                </div>
              </div>
            </div>
          )}

          {/* C. SERVER NODE (LAN 1) */}
          {serverNode && (
            <div
              style={{ left: `${coords.server.x}px`, top: `${coords.server.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <div 
                onClick={() => {
                  onSelectDevice(serverNode);
                  audioHUD.playClick();
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500 border-3 border-black flex items-center justify-center shadow-[5px_5px_0_#000] group-hover:scale-110 transition-transform">
                  <Server className="w-9 h-9 text-white stroke-[2.5]" />
                </div>
                <div className="mt-1.5 px-2.5 py-1 rounded-xl bg-black border-2 border-indigo-400 text-center shadow-[3px_3px_0_#000]">
                  <p className="text-xs font-black text-white">Server (LAN 1)</p>
                  <p className="text-[10px] text-indigo-300 font-bold">{serverNode.ip}</p>
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-black rounded bg-indigo-950 text-indigo-300 border border-indigo-500">
                    {serverNode.downloadMbps.toFixed(1)} Mbps
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* D. PC NODE (LAN 2) */}
          {pcNode && (
            <div
              style={{ left: `${coords.pc.x}px`, top: `${coords.pc.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <div 
                onClick={() => {
                  onSelectDevice(pcNode);
                  audioHUD.playClick();
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-400 border-3 border-black flex items-center justify-center shadow-[5px_5px_0_#000] group-hover:scale-110 transition-transform">
                  <Monitor className="w-9 h-9 text-black stroke-[2.5]" />
                </div>
                <div className="mt-1.5 px-2.5 py-1 rounded-xl bg-black border-2 border-cyan-400 text-center shadow-[3px_3px_0_#000]">
                  <p className="text-xs font-black text-white">PC Admin (LAN 2)</p>
                  <p className="text-[10px] text-cyan-300 font-bold">{pcNode.ip}</p>
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-black rounded bg-cyan-950 text-cyan-300 border border-cyan-500">
                    {pcNode.downloadMbps.toFixed(1)} Mbps
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* E. LAPTOP NODE (Wi-Fi) */}
          {laptopNode && (
            <div
              style={{ left: `${coords.laptop.x}px`, top: `${coords.laptop.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <div 
                onClick={() => {
                  onSelectDevice(laptopNode);
                  audioHUD.playClick();
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-400 border-3 border-black flex items-center justify-center shadow-[5px_5px_0_#000] group-hover:scale-110 transition-transform">
                  <Laptop className="w-9 h-9 text-black stroke-[2.5]" />
                </div>
                <div className="mt-1.5 px-2.5 py-1 rounded-xl bg-black border-2 border-teal-400 text-center shadow-[3px_3px_0_#000]">
                  <p className="text-xs font-black text-white">Laptop (Wi-Fi)</p>
                  <p className="text-[10px] text-teal-300 font-bold">{laptopNode.ip}</p>
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-black rounded bg-teal-950 text-teal-300 border border-teal-500">
                    {laptopNode.downloadMbps.toFixed(1)} Mbps
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* F. MOBILE PHONE NODE (Wi-Fi) */}
          {mobileNode && (
            <div
              style={{ left: `${coords.mobile.x}px`, top: `${coords.mobile.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <div 
                onClick={() => {
                  onSelectDevice(mobileNode);
                  audioHUD.playClick();
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-2xl border-3 border-black flex items-center justify-center shadow-[5px_5px_0_#000] group-hover:scale-110 transition-transform ${
                  mobileNode.status === 'LATENCY_SPIKE' ? 'bg-rose-500 text-white animate-bounce' : 'bg-pink-400 text-black'
                }`}>
                  <Smartphone className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div className="mt-1.5 px-2.5 py-1 rounded-xl bg-black border-2 border-pink-400 text-center shadow-[3px_3px_0_#000]">
                  <p className="text-xs font-black text-white">Ponsel (Wi-Fi)</p>
                  <p className="text-[10px] text-pink-300 font-bold">{mobileNode.ip}</p>
                  <span className={`inline-block px-1.5 py-0.2 text-[9px] font-black rounded ${
                    mobileNode.status === 'LATENCY_SPIKE' ? 'bg-rose-950 text-rose-300 border border-rose-500 animate-pulse' : 'bg-pink-950 text-pink-300 border border-pink-500'
                  }`}>
                    {mobileNode.downloadMbps.toFixed(1)} Mbps
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Info Strip */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-extrabold text-black bg-lime-400 px-4 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0_#000] pointer-events-auto">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-black stroke-[3]" />
            <span>KLIK PADA NODE MANAPUN UNTUK INSPEKSI DETAILED METRICS & BATAS BANDWIDTH</span>
          </div>
          <span className="bg-black text-white px-2.5 py-0.5 rounded-lg text-[11px] font-black hidden md:block">
            {devices.length} NODE MONITORING
          </span>
        </div>

      </div>

    </div>
  );
};
