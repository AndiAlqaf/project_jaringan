'use client';

import React from 'react';
import { 
  Flame, 
  AlertOctagon,
  Server,
  Monitor,
  Laptop,
  Smartphone
} from 'lucide-react';
import { NetworkDevice } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface DeviceBandwidthGaugeProps {
  devices: NetworkDevice[];
  onThrottleDevice: (deviceId: string) => void;
  onSelectDevice: (device: NetworkDevice) => void;
}

export const DeviceBandwidthGauge: React.FC<DeviceBandwidthGaugeProps> = ({
  devices,
  onThrottleDevice,
  onSelectDevice,
}) => {
  const totalDownload = devices.reduce((sum, d) => sum + d.downloadMbps, 0) || 1;

  const clientDevices = devices
    .filter((d) => d.type !== 'ROUTER')
    .map((d) => ({
      ...d,
      sharePercent: Math.round((d.downloadMbps / totalDownload) * 100),
    }))
    .sort((a, b) => b.downloadMbps - a.downloadMbps);

  const topHog = clientDevices[0];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'SERVER':
        return <Server className="w-4 h-4 text-indigo-300" />;
      case 'DESKTOP':
        return <Monitor className="w-4 h-4 text-cyan-300" />;
      case 'LAPTOP':
        return <Laptop className="w-4 h-4 text-teal-300" />;
      case 'MOBILE':
        return <Smartphone className="w-4 h-4 text-pink-300" />;
      default:
        return <Monitor className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="maxi-card rounded-3xl p-5 border-3 border-pink-500 font-mono flex flex-col justify-between">
      
      <div>
        <div className="flex items-center justify-between pb-3 border-b-2 border-pink-900/80">
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-pink-500 text-white">ANALISIS BEBAN</span>
            <h3 className="text-lg font-black text-white font-display">
              DETEKSI PEMAKAI BANDWIDTH (HOGS)
            </h3>
          </div>
          <span className="bg-black text-lime-400 px-3 py-1 rounded-xl border-2 border-lime-400 text-xs font-black">
            {clientDevices.length} Client Node
          </span>
        </div>

        {/* Top Hog Warning Banner */}
        {topHog && topHog.sharePercent >= 35 && (
          <div className="mt-3 p-3.5 rounded-2xl bg-rose-950 border-3 border-rose-500 shadow-[5px_5px_0_#f43f5e] flex items-center justify-between gap-3 text-xs font-bold">
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-6 h-6 text-rose-400 animate-bounce shrink-0" />
              <div>
                <p className="font-black text-white text-sm">
                  PERANGKAT MEMONOPOLI BANDWIDTH!
                </p>
                <p className="text-slate-200">
                  <strong className="text-yellow-300 underline">{topHog.name}</strong> menyedot{' '}
                  <strong className="text-rose-400 text-sm font-black">{topHog.sharePercent}%</strong> total bandwidth!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onThrottleDevice(topHog.id);
                audioHUD.playAlert();
              }}
              className="maxi-btn px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shrink-0"
            >
              {topHog.isThrottled ? 'Throttled' : 'Batasi Bandwidth'}
            </button>
          </div>
        )}

        {/* Device Consumption Ranking */}
        <div className="mt-4 space-y-3">
          {clientDevices.map((dev) => {
            const isHog = dev.sharePercent >= 35;
            return (
              <div 
                key={dev.id}
                onClick={() => onSelectDevice(dev)}
                className="p-3 rounded-2xl bg-black border-2 border-slate-800 hover:border-pink-500 cursor-pointer transition-all shadow-[4px_4px_0_#000]"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700">
                      {getDeviceIcon(dev.type)}
                    </div>
                    <span className="font-black text-white text-sm">
                      {dev.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">({dev.connectionType})</span>
                    {dev.isThrottled && (
                      <span className="maxi-sticker bg-yellow-400 text-black text-[9px]">
                        THROTTLED
                      </span>
                    )}
                    {dev.isQosPrioritized && (
                      <span className="maxi-sticker bg-cyan-400 text-black text-[9px]">
                        QOS HIGH
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-cyan-300 text-sm">{dev.downloadMbps.toFixed(1)} Mbps</span>
                    <span className="text-lime-400 font-black">({dev.sharePercent}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border-2 border-slate-700">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isHog 
                        ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-yellow-400' 
                        : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-lime-400'
                    }`}
                    style={{ width: `${dev.sharePercent}%` }}
                  />
                </div>

                {dev.topApplications.length > 0 && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Aplikasi Utama: <strong className="text-cyan-300">{dev.topApplications[0].name}</strong></span>
                    <span className="text-pink-400 font-bold">{dev.topApplications[0].bandwidthMbps} Mbps</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-2 border-pink-900/80 flex items-center justify-between text-xs font-bold text-slate-300">
        <span>Alokasi QOS Otomatis: <strong className="text-lime-400">AKTIF</strong></span>
        <span className="text-pink-400 underline cursor-pointer">Aturan Prioritas &rarr;</span>
      </div>

    </div>
  );
};
