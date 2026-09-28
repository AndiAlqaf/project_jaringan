'use client';

import React, { useState } from 'react';
import { X, Zap, RefreshCw, CheckCircle2, AlertTriangle, Radio, Activity } from 'lucide-react';
import { NetworkDevice } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface NetworkDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: NetworkDevice[];
}

interface PingTarget {
  name: string;
  ip: string;
  status: 'PENDING' | 'TESTING' | 'SUCCESS' | 'WARNING';
  pingMs: number;
}

export const NetworkDiagnosticsModal: React.FC<NetworkDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  devices,
}) => {
  const [isRunningSpeedTest, setIsRunningSpeedTest] = useState(false);
  const [speedProgress, setSpeedProgress] = useState(0);
  const [testedDown, setTestedDown] = useState(0);
  const [testedUp, setTestedUp] = useState(0);
  const [testedPing, setTestedPing] = useState(0);

  const [pingTargets, setPingTargets] = useState<PingTarget[]>([
    { name: 'Router Kantor (Gateway)', ip: '192.168.1.1', status: 'SUCCESS', pingMs: 2 },
    { name: 'Server Utama Office', ip: '192.168.1.10', status: 'SUCCESS', pingMs: 4 },
    { name: 'PC Admin Workstation', ip: '192.168.1.20', status: 'SUCCESS', pingMs: 7 },
    { name: 'Laptop Pegawai (Wi-Fi)', ip: '192.168.1.35', status: 'SUCCESS', pingMs: 14 },
    { name: 'Ponsel Pegawai (Wi-Fi)', ip: '192.168.1.42', status: 'WARNING', pingMs: 45 },
    { name: 'DNS Utama Cloudflare', ip: '1.1.1.1', status: 'SUCCESS', pingMs: 18 },
    { name: 'DNS Google Gateway', ip: '8.8.8.8', status: 'SUCCESS', pingMs: 22 },
  ]);

  if (!isOpen) return null;

  const handleStartDiagnostics = () => {
    setIsRunningSpeedTest(true);
    setSpeedProgress(0);
    setTestedDown(0);
    setTestedUp(0);
    setTestedPing(0);
    audioHUD.playAlert();

    setPingTargets((prev) => prev.map((t) => ({ ...t, status: 'TESTING' })));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setSpeedProgress(progress);
      setTestedDown(+(Math.random() * 40 + 60).toFixed(1));
      setTestedUp(+(Math.random() * 20 + 30).toFixed(1));
      setTestedPing(Math.round(Math.random() * 10 + 5));

      if (progress >= 100) {
        clearInterval(interval);
        setIsRunningSpeedTest(false);
        setPingTargets((prev) =>
          prev.map((t) => ({
            ...t,
            status: t.ip === '192.168.1.42' ? 'WARNING' : 'SUCCESS',
            pingMs: t.ip === '192.168.1.42' ? 42 : Math.round(Math.random() * 12 + 2),
          }))
        );
        audioHUD.playSuccess();
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="maxi-card rounded-3xl w-full max-w-2xl border-3 border-yellow-400 p-6 shadow-[10px_10px_0_#000] font-mono relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-yellow-500/50">
          <div className="flex items-center gap-3">
            <span className="maxi-sticker bg-yellow-400 text-black">SPEEDTEST</span>
            <div>
              <h2 className="text-xl font-black text-white font-display">
                UJI DIAGNOSTIK JARINGAN KANTOR
              </h2>
              <p className="text-xs text-slate-300 font-bold">
                Pemeriksaan Latensi Ping Sweep & Bandwidth Realtime
              </p>
            </div>
          </div>

          <button
            onClick={() => { onClose(); audioHUD.playClick(); }}
            className="maxi-btn p-2 rounded-xl bg-black text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speedtest Circular Gauge */}
        <div className="mt-6 flex flex-col items-center justify-center p-6 bg-black rounded-2xl border-3 border-black shadow-[5px_5px_0_#000] relative">
          
          <div className="relative w-44 h-44 rounded-full border-4 border-lime-400 flex flex-col items-center justify-center bg-purple-950 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
            {isRunningSpeedTest && (
              <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-cyan-400 border-b-transparent border-l-transparent animate-spin" />
            )}

            <Activity className="w-8 h-8 text-lime-400 mb-1" />
            <span className="text-3xl font-black text-white">
              {isRunningSpeedTest ? testedDown : 84.5}
            </span>
            <span className="text-xs font-black text-lime-300">Mbps (Download)</span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6 w-full text-center font-bold text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border-2 border-cyan-400 shadow-[3px_3px_0_#000]">
              <p className="text-slate-400 text-[10px]">DOWNLOAD</p>
              <p className="text-base font-black text-cyan-300">{isRunningSpeedTest ? testedDown : 84.5} Mbps</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border-2 border-pink-500 shadow-[3px_3px_0_#000]">
              <p className="text-slate-400 text-[10px]">UPLOAD</p>
              <p className="text-base font-black text-pink-300">{isRunningSpeedTest ? testedUp : 38.2} Mbps</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border-2 border-yellow-400 shadow-[3px_3px_0_#000]">
              <p className="text-slate-400 text-[10px]">PING LATENCY</p>
              <p className="text-base font-black text-yellow-300">{isRunningSpeedTest ? testedPing : 8} ms</p>
            </div>
          </div>

          <button
            onClick={handleStartDiagnostics}
            disabled={isRunningSpeedTest}
            className="mt-6 maxi-btn px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRunningSpeedTest ? 'animate-spin' : ''}`} />
            <span>{isRunningSpeedTest ? `Menguji (${speedProgress}%)...` : 'Jalankan Diagnostics Sweep'}</span>
          </button>
        </div>

        {/* Ping Sweep Targets */}
        <div className="mt-5">
          <h4 className="text-xs font-black text-yellow-300 mb-2">PING SWEEP TARGETS:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
            {pingTargets.map((target, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black border-2 border-slate-800 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="font-black text-white text-[11px]">{target.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{target.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-black ${target.pingMs > 30 ? 'text-yellow-300' : 'text-lime-300'}`}>
                    {target.pingMs} ms
                  </span>
                  {target.status === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 text-lime-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
