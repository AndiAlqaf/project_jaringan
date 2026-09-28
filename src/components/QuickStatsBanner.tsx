'use client';

import React from 'react';
import { 
  DownloadCloud, 
  UploadCloud, 
  Wifi, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  Radio,
  Server,
  Zap,
  Flame
} from 'lucide-react';
import { NetworkDevice, NetworkAlert } from '../types/network';

interface QuickStatsBannerProps {
  devices: NetworkDevice[];
  alerts: NetworkAlert[];
}

export const QuickStatsBanner: React.FC<QuickStatsBannerProps> = ({ devices, alerts }) => {
  const totalDownload = devices.reduce((sum, d) => sum + d.downloadMbps, 0);
  const totalUpload = devices.reduce((sum, d) => sum + d.uploadMbps, 0);
  
  const lanDevicesCount = devices.filter(d => d.connectionType === 'LAN').length;
  const wifiDevicesCount = devices.filter(d => d.connectionType === 'WIFI').length;
  const activeDevicesCount = devices.filter(d => d.status !== 'OFFLINE').length;

  const nonRouterDevices = devices.filter(d => d.type !== 'ROUTER');
  const avgPing = Math.round(
    nonRouterDevices.reduce((sum, d) => sum + d.pingMs, 0) / (nonRouterDevices.length || 1)
  );

  const avgPacketLoss = +(
    nonRouterDevices.reduce((sum, d) => sum + d.packetLossPercent, 0) / (nonRouterDevices.length || 1)
  ).toFixed(1);

  const activeCriticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'CRITICAL').length;
  const activeWarningAlerts = alerts.filter(a => !a.resolved && a.severity === 'WARNING').length;

  // Health Index calculation
  let healthScore = 100;
  if (avgPing > 50) healthScore -= 20;
  if (avgPacketLoss > 1) healthScore -= 25;
  if (activeCriticalAlerts > 0) healthScore -= 30;
  if (activeWarningAlerts > 0) healthScore -= 15;
  healthScore = Math.max(10, healthScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
      
      {/* 1. Download Bandwidth Card */}
      <div className="maxi-card maxi-card-cyan rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="maxi-sticker bg-cyan-400 text-black">TOTAL DOWNLOAD</span>
          <div className="p-2 rounded-xl bg-cyan-950 border-2 border-black">
            <DownloadCloud className="w-5 h-5 text-cyan-300" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">
            {totalDownload.toFixed(1)}
          </span>
          <span className="text-xs font-extrabold text-cyan-300">Mbps</span>
        </div>
        <div className="mt-3 pt-2 border-t-2 border-cyan-900/80">
          <div className="w-full bg-black rounded-full h-2.5 border border-cyan-500 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-teal-300 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalDownload / 150) * 100)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-extrabold text-slate-300">
            <span>BEBAN KAPASITAS</span>
            <span className="text-cyan-300">{Math.round((totalDownload / 150) * 100)}% (150M)</span>
          </div>
        </div>
      </div>

      {/* 2. Upload Bandwidth Card */}
      <div className="maxi-card maxi-card-pink rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="maxi-sticker bg-pink-400 text-black">TOTAL UPLOAD</span>
          <div className="p-2 rounded-xl bg-pink-950 border-2 border-black">
            <UploadCloud className="w-5 h-5 text-pink-300" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">
            {totalUpload.toFixed(1)}
          </span>
          <span className="text-xs font-extrabold text-pink-300">Mbps</span>
        </div>
        <div className="mt-3 pt-2 border-t-2 border-pink-900/80">
          <div className="w-full bg-black rounded-full h-2.5 border border-pink-500 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalUpload / 100) * 100)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-extrabold text-slate-300">
            <span>UPSTREAM CAP</span>
            <span className="text-pink-300">{Math.round((totalUpload / 100) * 100)}% (100M)</span>
          </div>
        </div>
      </div>

      {/* 3. Connected Devices Card */}
      <div className="maxi-card maxi-card-lime rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="maxi-sticker bg-lime-400 text-black">NODE TERHUBUNG</span>
          <div className="p-2 rounded-xl bg-lime-950 border-2 border-black">
            <Radio className="w-5 h-5 text-lime-300 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">
            {activeDevicesCount}
          </span>
          <span className="text-xs font-extrabold text-lime-300">Active Nodes</span>
        </div>
        <div className="mt-3 pt-2 border-t-2 border-lime-900/80 flex items-center justify-between text-[11px] font-extrabold">
          <span className="px-2 py-0.5 rounded-lg bg-blue-950 text-blue-300 border border-blue-500 flex items-center gap-1">
            <Server className="w-3 h-3 text-blue-400" /> LAN: {lanDevicesCount}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-500 flex items-center gap-1">
            <Wifi className="w-3 h-3 text-teal-400" /> Wi-Fi: {wifiDevicesCount}
          </span>
        </div>
      </div>

      {/* 4. Average Ping & Latency Card */}
      <div className="maxi-card maxi-card-yellow rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="maxi-sticker bg-yellow-400 text-black">PING LATENSI</span>
          <div className="p-2 rounded-xl bg-yellow-950 border-2 border-black">
            <Clock className="w-5 h-5 text-yellow-300" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-black ${avgPing > 40 ? 'text-rose-400' : 'text-white'}`}>
            {avgPing}
          </span>
          <span className="text-xs font-extrabold text-yellow-300">ms</span>
        </div>
        <div className="mt-3 pt-2 border-t-2 border-yellow-900/80 flex items-center justify-between text-[11px] font-extrabold">
          <span className="text-slate-300">PACKET LOSS:</span>
          <span className={`px-2 py-0.5 rounded ${avgPacketLoss > 1 ? 'bg-rose-950 text-rose-300 border border-rose-500' : 'bg-emerald-950 text-emerald-300 border border-emerald-500'}`}>
            {avgPacketLoss}%
          </span>
        </div>
      </div>

      {/* 5. Health Index Card */}
      <div className={`maxi-card rounded-2xl p-4 flex flex-col justify-between ${
        healthScore < 60 ? 'bg-rose-950 border-2 border-rose-500 shadow-[6px_6px_0_#f43f5e]' : 'bg-purple-950 border-2 border-purple-500 shadow-[6px_6px_0_#8b5cf6]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`maxi-sticker ${healthScore >= 80 ? 'bg-emerald-400 text-black' : 'bg-rose-500 text-white'}`}>
            KESEHATAN
          </span>
          <div className="p-2 rounded-xl bg-black border-2 border-black">
            {healthScore >= 80 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
            )}
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-black ${
            healthScore >= 80 ? 'text-emerald-300' : healthScore >= 60 ? 'text-yellow-300' : 'text-rose-400'
          }`}>
            {healthScore}%
          </span>
          <span className="text-xs font-extrabold text-slate-300">
            {healthScore >= 80 ? 'OPTIMAL' : 'WARNING'}
          </span>
        </div>
        <div className="mt-3 pt-2 border-t-2 border-slate-800 flex items-center justify-between text-[10px] font-extrabold text-slate-300">
          <span>ALERTS:</span>
          <span className="text-rose-400 font-black">{activeCriticalAlerts} KRITIS / {activeWarningAlerts} WASPADA</span>
        </div>
      </div>

    </div>
  );
};
