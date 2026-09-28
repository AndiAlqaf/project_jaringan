'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';
import { NetworkAlert } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface AlertsPanelProps {
  alerts: NetworkAlert[];
  onResolveAlert: (alertId: string) => void;
  onClearAll: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onResolveAlert,
  onClearAll,
}) => {
  return (
    <div className="maxi-card rounded-3xl p-5 border-3 border-rose-500 font-mono flex flex-col justify-between">
      
      <div>
        <div className="flex items-center justify-between pb-3 border-b-2 border-rose-900/80">
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-rose-500 text-white">LOG SYSTEM</span>
            <h3 className="text-lg font-black text-white font-display">
              PERINGATAN GANGGUAN
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-black text-rose-400 px-2.5 py-0.5 rounded-xl border-2 border-rose-500 text-xs font-black">
              {alerts.filter(a => !a.resolved).length} Active
            </span>
            {alerts.length > 0 && (
              <button
                onClick={() => { onClearAll(); audioHUD.playClick(); }}
                className="maxi-btn p-1.5 rounded-lg bg-black text-slate-400 hover:text-white"
                title="Clear Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Alert List */}
        <div className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-9 h-9 text-lime-400" />
              <span>Jaringan Berjalan 100% Optimal Tanpa Gangguan.</span>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0_#000] text-xs font-bold flex items-start justify-between gap-3 ${
                  alert.resolved
                    ? 'bg-slate-900 text-slate-400 opacity-60'
                    : alert.severity === 'CRITICAL'
                    ? 'bg-rose-950 text-white border-rose-500'
                    : alert.severity === 'WARNING'
                    ? 'bg-yellow-950 text-white border-yellow-500'
                    : 'bg-black text-white border-cyan-500'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {alert.severity === 'CRITICAL' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    ) : alert.severity === 'WARNING' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Info className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{alert.deviceName}</span>
                      <span className="text-[10px] text-slate-400 font-mono" suppressHydrationWarning>[{alert.timestamp}]</span>
                    </div>
                    <p className="mt-0.5 text-slate-200">{alert.message}</p>
                    <p className="mt-1 text-[10px] text-yellow-300 font-black">{alert.metric}</p>
                  </div>
                </div>

                {!alert.resolved && (
                  <button
                    onClick={() => { onResolveAlert(alert.id); audioHUD.playSuccess(); }}
                    className="maxi-btn px-2.5 py-1 rounded-xl bg-lime-400 text-black text-[10px] font-black shrink-0"
                  >
                    Selesai
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-2 border-rose-900/80 text-[10px] font-extrabold text-slate-300 flex justify-between">
        <span>STATUS STREAM: <strong className="text-lime-400">ONLINE</strong></span>
        <span>AUTO-ARCHIVE: 24h</span>
      </div>

    </div>
  );
};
