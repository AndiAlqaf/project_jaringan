'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { NetworkDevice } from '../types/network';

interface BandwidthChartProps {
  historyData: {
    time: string;
    download: number;
    upload: number;
    ping: number;
  }[];
  devices: NetworkDevice[];
}

export const BandwidthChart: React.FC<BandwidthChartProps> = ({ historyData, devices }) => {
  const currentTotalDownload = devices.reduce((sum, d) => sum + d.downloadMbps, 0);
  const currentTotalUpload = devices.reduce((sum, d) => sum + d.uploadMbps, 0);

  return (
    <div className="maxi-card rounded-3xl p-5 border-3 border-cyan-500 font-mono flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-cyan-900/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-cyan-400 text-black">STREAM REALTIME</span>
            <h3 className="text-lg font-black text-white font-display">
              TELEMETRI TRAFIK REAL-TIME
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-bold mt-1">
            Grafik streaming konsumsi total bandwidth router (Mbps)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          <div className="flex items-center gap-1.5 text-cyan-300 bg-black px-2.5 py-1 rounded-lg border-2 border-cyan-400">
            <span className="w-3 h-3 rounded-full bg-cyan-400" />
            <span>Down ({currentTotalDownload.toFixed(1)}M)</span>
          </div>
          <div className="flex items-center gap-1.5 text-pink-300 bg-black px-2.5 py-1 rounded-lg border-2 border-pink-400">
            <span className="w-3 h-3 rounded-full bg-pink-500" />
            <span>Up ({currentTotalUpload.toFixed(1)}M)</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Area Chart */}
      <div className="w-full h-64 mt-4 bg-black/60 p-2 rounded-2xl border-2 border-cyan-950">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDownloadMaxi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorUploadMaxi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(236, 72, 153, 0.2)" />
            
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="monospace"
              fontWeight="bold"
            />
            
            <YAxis 
              stroke="#94a3b8" 
              fontSize={11} 
              tickLine={false} 
              fontFamily="monospace" 
              fontWeight="bold"
              unit="M"
            />

            <Tooltip 
              contentStyle={{
                backgroundColor: '#000',
                border: '2.5px solid #06b6d4',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '4px 4px 0px #ec4899'
              }}
              labelStyle={{ color: '#a3e635', fontWeight: '900' }}
            />

            <Area 
              type="monotone" 
              dataKey="download" 
              name="Download (Mbps)" 
              stroke="#06b6d4" 
              strokeWidth={3.5}
              fillOpacity={1} 
              fill="url(#colorDownloadMaxi)" 
            />

            <Area 
              type="monotone" 
              dataKey="upload" 
              name="Upload (Mbps)" 
              stroke="#ec4899" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUploadMaxi)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t-2 border-cyan-900/80 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-lime-400" />
          <span>Kapasitas Tersedia: <strong className="text-white">65.5 Mbps (43.6%)</strong></span>
        </div>
        <div className="flex items-center gap-2 text-yellow-300">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span>Batas Ambang Peringatan: <strong className="text-yellow-400">120 Mbps</strong></span>
        </div>
      </div>

    </div>
  );
};
