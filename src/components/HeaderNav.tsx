'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Tv, 
  Play, 
  Pause, 
  Cpu, 
  Zap,
  Building2,
  ListFilter,
  Flame,
  Radio
} from 'lucide-react';
import { SimulationPreset } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface HeaderNavProps {
  simulationPreset: SimulationPreset;
  onPresetChange: (preset: SimulationPreset) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
  scanlineActive: boolean;
  onToggleScanline: () => void;
  onOpenDiagnostics: () => void;
  onOpenAddDevice: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  simulationPreset,
  onPresetChange,
  isSimulating,
  onToggleSimulate,
  scanlineActive,
  onToggleScanline,
  onOpenDiagnostics,
  onOpenAddDevice,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = audioHUD.toggleSound();
    setSoundEnabled(nextState);
    if (nextState) audioHUD.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d091e]/95 border-b-4 border-pink-500 shadow-[0_8px_0_#000]">
      
      {/* 1. MAXIMALIST MARQUEE TICKER BANNER */}
      <div className="bg-lime-400 text-black py-1 overflow-hidden font-mono text-[11px] font-extrabold border-b-2 border-black flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
            ALFRA Connect — MONITORING KINERJA & TRAFIK JARINGAN KANTOR TEMPAT MAGANG
          </span>
          <span>⚡ KELOMPOK 1: RAFFI FADLIKA • FATRAH ARYADI ABDUH • ANDI MUH. AL QAF</span>
          <span>🏢 PT PRIMUS INDONESIA & PT ANUGRAH INTI SPEKTRA</span>
          <span>🔥 BANDWIDTH MONITORING REAL-TIME • TOPOLOGI INTERAKTIF • DETEKSI BOTTLENECK</span>
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
            ALFRA Connect — MONITORING KINERJA & TRAFIK JARINGAN KANTOR TEMPAT MAGANG
          </span>
          <span>⚡ KELOMPOK 1: RAFFI FADLIKA • FATRAH ARYADI ABDUH • ANDI MUH. AL QAF</span>
          <span>🏢 PT PRIMUS INDONESIA & PT ANUGRAH INTI SPEKTRA</span>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand & Team Meta */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="p-2.5 rounded-xl bg-pink-500 border-2 border-black shadow-[3px_3px_0_#000] rotate-[-2deg]">
            <Activity className="w-7 h-7 text-black animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-gradient-rainbow">
                ALFRA Connect
              </h1>
              <span className="maxi-sticker bg-lime-400 text-black">
                v3.0 HUD
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold mt-0.5">
              <span className="text-cyan-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-pink-400" />
                Kelompok 1 (PT Primus & PT Anugrah)
              </span>
              <span className="text-pink-400">•</span>
              <span className="text-lime-300 font-mono">Monitoring Kantor Tempat Magang</span>
            </div>
          </div>
        </div>

        {/* Center Live Telemetry Counter */}
        <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-xl border-2 border-cyan-400 shadow-[4px_4px_0_#000] text-xs font-mono font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-lime-400 animate-ping" />
            <span className="text-slate-400">STATUS:</span>
            <span className="text-lime-400">ONLINE</span>
          </div>
          <div className="h-4 w-0.5 bg-slate-700" />
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>ROUTER: <strong className="text-white">192.168.1.1</strong></span>
          </div>
          <div className="h-4 w-0.5 bg-slate-700 hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5 text-pink-300">
            <span className="text-slate-400">WAKTU:</span>
            <span className="text-yellow-300 font-black tracking-widest" suppressHydrationWarning>{timeStr || '10:33:43'}</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap">
          
          {/* Preset Selector */}
          <div className="flex items-center gap-1 bg-purple-950 p-1.5 rounded-xl border-2 border-pink-500 shadow-[3px_3px_0_#000]">
            <ListFilter className="w-4 h-4 text-pink-400 ml-1" />
            <select
              value={simulationPreset}
              onChange={(e) => {
                onPresetChange(e.target.value as SimulationPreset);
                audioHUD.playClick();
              }}
              className="bg-transparent text-xs font-bold text-lime-300 focus:outline-none cursor-pointer py-0.5 pr-2 font-mono"
              title="Pilih Skenario Simulasi Beban Jaringan"
            >
              <option value="NORMAL" className="bg-slate-900 text-slate-200">Skenario: Normal Traffic</option>
              <option value="SERVER_BACKUP" className="bg-slate-900 text-yellow-300">Skenario: Server Backup (LAN 1)</option>
              <option value="WIFI_HOG" className="bg-slate-900 text-pink-300">Skenario: Wi-Fi Hog (HP)</option>
              <option value="HIGH_LATENCY" className="bg-slate-900 text-rose-400">Skenario: Latency Spike</option>
              <option value="ROUTER_SPIKE" className="bg-slate-900 text-cyan-300">Skenario: Router Peak</option>
            </select>
          </div>

          {/* Pause / Play Live Stream */}
          <button
            onClick={() => {
              onToggleSimulate();
              audioHUD.playClick();
            }}
            className={`maxi-btn px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
              isSimulating 
                ? 'bg-lime-400 text-black hover:bg-lime-300' 
                : 'bg-yellow-400 text-black hover:bg-yellow-300'
            }`}
            title={isSimulating ? 'Pause Telemetry' : 'Resume Telemetry'}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              onToggleScanline();
              audioHUD.playClick();
            }}
            className={`maxi-btn p-2 rounded-xl text-xs ${
              scanlineActive 
                ? 'bg-pink-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Scanlines Visual Effect"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`maxi-btn p-2 rounded-xl text-xs ${
              soundEnabled 
                ? 'bg-cyan-400 text-black' 
                : 'bg-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'Matikan Suara HUD' : 'Aktifkan Suara HUD'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Diagnostics Button */}
          <button
            onClick={() => {
              onOpenDiagnostics();
              audioHUD.playClick();
            }}
            className="maxi-btn px-4 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 text-xs flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-black text-black animate-spin-slow" />
            <span>TES DIAGNOSTIK</span>
          </button>

        </div>

      </div>
    </header>
  );
};
