'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Radio, 
  Wifi, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw,
  Share2
} from 'lucide-react';
import { audioHUD } from '../utils/audioHUD';

interface MakassarTestingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadLiveDevices: () => void;
  isLoadingLive: boolean;
  isLiveMode: boolean;
  deviceCount: number;
}

export const MakassarTestingModal: React.FC<MakassarTestingModalProps> = ({
  isOpen,
  onClose,
  onLoadLiveDevices,
  isLoadingLive,
  isLiveMode,
  deviceCount,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    audioHUD.playClick();
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-2xl bg-[#090615] border-4 border-lime-400 rounded-3xl shadow-[8px_8px_0_#000] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-lime-400 text-black border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-black fill-black animate-bounce" />
            <div>
              <h2 className="text-lg font-black tracking-tight leading-tight">
                PENGUJIAN JARINGAN MAKASSAR ⇄ SURABAYA
              </h2>
              <p className="text-xs font-bold text-slate-900">
                PT Primus Indonesia & PT Anugrah Inti Spektra (Makassar)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              audioHUD.playClick();
            }}
            className="p-1 rounded-xl bg-black text-lime-400 hover:bg-neutral-800 border-2 border-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Status Koneksi Wi-Fi Makassar Saat Ini */}
          <div className="bg-[#120a2a] p-4 rounded-2xl border-2 border-cyan-400 shadow-[3px_3px_0_#000]">
            <div className="flex items-center justify-between mb-3">
              <span className="maxi-sticker bg-cyan-400 text-black flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" /> STATUS WI-FI KANTOR MAKASSAR
              </span>
              <span className="text-lime-400 font-bold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping inline-block" />
                TERHUBUNG AKTIF
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-black/60 p-2.5 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[10px]">SSID / GATEWAY</div>
                <div className="text-cyan-300 font-bold mt-0.5">www.tendawifi.com</div>
              </div>
              <div className="bg-black/60 p-2.5 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[10px]">ROUTER IP (GATEWAY)</div>
                <div className="text-lime-300 font-bold mt-0.5">192.168.0.1</div>
              </div>
              <div className="bg-black/60 p-2.5 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                <div className="text-slate-400 text-[10px]">IP LAPTOP MAKASSAR</div>
                <div className="text-yellow-300 font-bold mt-0.5">192.168.0.243</div>
              </div>
            </div>

            {/* Tombol Ambil Data Live */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onLoadLiveDevices}
                disabled={isLoadingLive}
                className="maxi-btn flex-1 py-2.5 px-4 rounded-xl bg-lime-400 text-black font-extrabold flex items-center justify-center gap-2 hover:bg-lime-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLive ? 'animate-spin' : ''}`} />
                <span>{isLoadingLive ? 'Memindai Jaringan...' : isLiveMode ? 'Segarkan Data Live Makassar' : 'Tampilkan Data Riil Makassar Sekarang'}</span>
              </button>
              
              <a
                href="/api/tenda"
                target="_blank"
                rel="noreferrer"
                className="maxi-btn py-2.5 px-3 rounded-xl bg-cyan-400 text-black font-bold flex items-center gap-1.5 hover:bg-cyan-300"
              >
                <span>Cek API JSON</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            {isLiveMode && (
              <p className="text-[11px] text-lime-400 mt-2 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 inline" />
                Sedang menampilkan {deviceCount} perangkat aktif riil dari kantor Makassar!
              </p>
            )}
          </div>

          {/* Opsi Tunneling untuk Tim Surabaya */}
          <div className="bg-[#120a2a] p-4 rounded-2xl border-2 border-pink-500 shadow-[3px_3px_0_#000]">
            <span className="maxi-sticker bg-pink-500 text-white flex items-center gap-1.5 mb-2 inline-flex">
              <Share2 className="w-3.5 h-3.5" /> BERBAGI AKSES KE TIM SURABAYA
            </span>
            <p className="text-slate-300 text-xs mb-3">
              Jalankan salah satu perintah di bawah ini di Terminal baru pada laptop Makassar agar tim di Surabaya bisa membuka dashboard ini lewat internet:
            </p>

            {/* Opsi 1: Cloudflare Tunnel (Tanpa Password, Sangat Cepat) */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between items-center text-[11px] text-lime-300 font-bold">
                <span>Opsi 1: Cloudflare Tunnel (Tanpa Password, Otomatis HTTPS)</span>
                <span className="text-lime-400">PALING DIREKOMENDASIKAN ⭐</span>
              </div>
              <div className="flex items-center justify-between bg-black p-2.5 rounded-xl border border-lime-400 font-mono text-lime-400 text-xs">
                <code>npx -y cloudflared tunnel --url http://localhost:3000</code>
                <button
                  onClick={() => copyToClipboard('npx -y cloudflared tunnel --url http://localhost:3000', 'cf')}
                  className="ml-2 p-1.5 rounded-lg bg-lime-400 text-black hover:bg-lime-300 flex items-center gap-1 font-bold"
                >
                  {copiedCmd === 'cf' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'cf' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Opsi 2: LocalTunnel */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between items-center text-[11px] text-pink-300 font-bold">
                <span>Opsi 2: LocalTunnel (Perlu input IP: 125.162.211.76)</span>
              </div>
              <div className="flex items-center justify-between bg-black p-2.5 rounded-xl border border-pink-400 font-mono text-pink-300 text-xs">
                <code>npx -y localtunnel --port 3000</code>
                <button
                  onClick={() => copyToClipboard('npx -y localtunnel --port 3000', 'lt')}
                  className="ml-2 p-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 flex items-center gap-1"
                >
                  {copiedCmd === 'lt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'lt' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Checklist Bukti Pengujian untuk Laporan */}
          <div className="bg-[#120a2a] p-4 rounded-2xl border-2 border-yellow-400 shadow-[3px_3px_0_#000]">
            <span className="maxi-sticker bg-yellow-400 text-black flex items-center gap-1.5 mb-2 inline-flex">
              <CheckCircle2 className="w-3.5 h-3.5" /> CHECKLIST BUKTI LAPORAN SIDANG
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-lime-400 font-bold">✓</span>
                Buka & screenshot respons JSON: <code className="text-cyan-300">http://localhost:3000/api/tenda</code>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-400 font-bold">✓</span>
                Screenshot dashboard topologi menampilkan Router Tenda Makassar (192.168.0.1)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime-400 font-bold">✓</span>
                Jalankan tombol <strong>TES DIAGNOSTIK</strong> dan screenshot hasil ping & latensi router
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={() => {
              onClose();
              audioHUD.playClick();
            }}
            className="maxi-btn px-6 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-bold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
