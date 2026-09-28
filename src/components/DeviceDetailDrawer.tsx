'use client';

import React from 'react';
import { 
  X, 
  Server, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Radio, 
  Zap, 
  Sliders, 
  Lock, 
  Unlock
} from 'lucide-react';
import { NetworkDevice } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface DeviceDetailDrawerProps {
  device: NetworkDevice | null;
  onClose: () => void;
  onToggleQoS: (deviceId: string) => void;
  onToggleThrottle: (deviceId: string) => void;
  onToggleBlock: (deviceId: string) => void;
  onUpdateLimit: (deviceId: string, newLimit: number) => void;
}

export const DeviceDetailDrawer: React.FC<DeviceDetailDrawerProps> = ({
  device,
  onClose,
  onToggleQoS,
  onToggleThrottle,
  onToggleBlock,
  onUpdateLimit,
}) => {
  if (!device) return null;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'SERVER':
        return <Server className="w-8 h-8 text-indigo-300" />;
      case 'DESKTOP':
        return <Monitor className="w-8 h-8 text-cyan-300" />;
      case 'LAPTOP':
        return <Laptop className="w-8 h-8 text-teal-300" />;
      case 'MOBILE':
        return <Smartphone className="w-8 h-8 text-pink-300" />;
      default:
        return <Radio className="w-8 h-8 text-lime-300" />;
    }
  };

  return (
    /* Outer Floating Panel (clipped by rounded-3xl & overflow-hidden so scrollbar never bleeds out) */
    <div className="fixed top-4 bottom-4 right-4 z-50 w-full max-w-[420px] bg-[#0c081d] border-3 border-pink-500 rounded-3xl shadow-[-8px_8px_0_#000] overflow-hidden flex flex-col">
      
      {/* Inner Scrollable Container */}
      <div className="w-full h-full overflow-y-auto p-5 pr-3 text-xs font-mono flex flex-col justify-between">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-pink-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black border-2 border-pink-500 shadow-[3px_3px_0_#000]">
              {getDeviceIcon(device.type)}
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-display">{device.name}</h3>
              <span className="text-[11px] text-pink-300 font-bold">IP: {device.ip} | MAC: {device.mac}</span>
            </div>
          </div>
          <button
            onClick={() => { onClose(); audioHUD.playClick(); }}
            className="maxi-btn p-1.5 rounded-xl bg-black text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Quick Badges */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-black border-2 border-cyan-400 shadow-[3px_3px_0_#000]">
            <p className="text-slate-400 text-[10px] font-black">DOWNLOAD AKTIF</p>
            <p className="text-xl font-black text-cyan-300">{device.downloadMbps.toFixed(1)} Mbps</p>
          </div>
          <div className="p-3 rounded-2xl bg-black border-2 border-pink-500 shadow-[3px_3px_0_#000]">
            <p className="text-slate-400 text-[10px] font-black">UPLOAD AKTIF</p>
            <p className="text-xl font-black text-pink-300">{device.uploadMbps.toFixed(1)} Mbps</p>
          </div>
          <div className="p-3 rounded-2xl bg-black border-2 border-yellow-400 shadow-[3px_3px_0_#000]">
            <p className="text-slate-400 text-[10px] font-black">PING LATENSI</p>
            <p className={`text-xl font-black ${device.pingMs > 40 ? 'text-rose-400' : 'text-lime-300'}`}>
              {device.pingMs} ms
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-black border-2 border-teal-400 shadow-[3px_3px_0_#000]">
            <p className="text-slate-400 text-[10px] font-black">KONEKSI PORT</p>
            <p className="text-sm font-black text-teal-300 mt-1">{device.port || device.connectionType}</p>
          </div>
        </div>

        {/* Bandwidth Limiter Slider */}
        <div className="mt-5 p-4 rounded-2xl bg-black border-2 border-lime-400 shadow-[4px_4px_0_#000]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black text-lime-300">LIMIT MAKSIMAL BANDWIDTH:</span>
            <span className="text-yellow-300 font-black text-sm">{device.maxMbpsLimit} Mbps</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={device.maxMbpsLimit}
            onChange={(e) => onUpdateLimit(device.id, Number(e.target.value))}
            className="w-full accent-lime-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
            <span>5 Mbps</span>
            <span>50 Mbps</span>
            <span>100 Mbps (Uncapped)</span>
          </div>
        </div>

        {/* Applications Breakdown */}
        <div className="mt-5">
          <h4 className="font-black text-lime-300 mb-2">PENGGUNAAN TRAFIK APLIKASI:</h4>
          <div className="space-y-2">
            {device.topApplications.map((app, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-black border-2 border-slate-800 flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">{app.name}</span>
                  <span className="text-pink-300 font-black">{app.bandwidthMbps} Mbps ({app.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${app.percentage}%`, backgroundColor: app.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-6 pt-4 border-t-2 border-pink-900/80 space-y-2.5">
          <h4 className="font-black text-slate-400 mb-2">MANAJEMEN KONTROL NODE:</h4>

          <button
            onClick={() => { onToggleQoS(device.id); audioHUD.playClick(); }}
            className={`w-full maxi-btn py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 ${
              device.isQosPrioritized 
                ? 'bg-cyan-400 text-black' 
                : 'bg-black text-white border-2 border-cyan-400'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{device.isQosPrioritized ? 'Prioritas QOS [Aktif]' : 'Prioritas QOS Tinggi'}</span>
          </button>

          <button
            onClick={() => { onToggleThrottle(device.id); audioHUD.playAlert(); }}
            className={`w-full maxi-btn py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 ${
              device.isThrottled 
                ? 'bg-yellow-400 text-black' 
                : 'bg-black text-white border-2 border-yellow-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{device.isThrottled ? 'Speed Limiter [Aktif]' : 'Batasi Kecepatan Node'}</span>
          </button>

          <button
            onClick={() => { onToggleBlock(device.id); audioHUD.playAlert(); }}
            className={`w-full maxi-btn py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 ${
              device.isBlocked 
                ? 'bg-rose-500 text-white' 
                : 'bg-black text-rose-300 border-2 border-rose-500'
            }`}
          >
            {device.isBlocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{device.isBlocked ? 'Buka Akses Blokir' : 'Blokir Akses Jaringan'}</span>
          </button>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-slate-800 text-[10px] text-slate-400 text-center font-bold">
        ALFRA Connect • CONNECTED: {device.connectedSince}
      </div>
    </div>
  </div>
);
};
