'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { DeviceType, ConnectionType, NetworkDevice } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (device: NetworkDevice) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onAddDevice,
}) => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('192.168.1.50');
  const [type, setType] = useState<DeviceType>('LAPTOP');
  const [connectionType, setConnectionType] = useState<ConnectionType>('WIFI');
  const [maxLimit, setMaxLimit] = useState(50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDevice: NetworkDevice = {
      id: 'dev-' + Date.now(),
      name,
      type,
      connectionType,
      ip,
      mac: `00:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:FF`,
      status: 'ONLINE',
      downloadMbps: +(Math.random() * 15 + 5).toFixed(1),
      uploadMbps: +(Math.random() * 5 + 1).toFixed(1),
      maxMbpsLimit: maxLimit,
      pingMs: connectionType === 'LAN' ? 5 : 18,
      packetLossPercent: 0,
      connectedSince: 'Baru saja',
      interfaceName: connectionType === 'LAN' ? 'Ethernet GbE' : 'Wi-Fi 6',
      port: connectionType === 'LAN' ? 'Kabel LAN 3' : 'Wi-Fi Direct',
      topApplications: [
        { name: 'Web Traffic', category: 'HTTP', bandwidthMbps: 8.2, percentage: 70, color: '#06b6d4' },
        { name: 'Cloud Sync', category: 'Storage', bandwidthMbps: 3.5, percentage: 30, color: '#a3e635' },
      ],
      history: [],
    };

    onAddDevice(newDevice);
    audioHUD.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="maxi-card rounded-3xl w-full max-w-lg border-3 border-lime-400 p-6 shadow-[10px_10px_0_#000] font-mono relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-lime-900/80">
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-lime-400 text-black">NEW NODE</span>
            <h2 className="text-lg font-black text-white font-display">
              TAMBAH PERANGKAT KE JARINGAN
            </h2>
          </div>
          <button
            onClick={() => { onClose(); audioHUD.playClick(); }}
            className="maxi-btn p-1.5 rounded-xl bg-black text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-mono text-xs font-bold">
          <div>
            <label className="block text-slate-300 mb-1">NAMA PERANGKAT:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Printer Office / Laptop Tamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border-2 border-lime-400 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none shadow-[3px_3px_0_#000]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">ALAMAT IP:</label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="w-full bg-black border-2 border-cyan-400 rounded-xl px-3 py-2 text-cyan-300 focus:outline-none shadow-[3px_3px_0_#000]"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">TIPE PERANGKAT:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DeviceType)}
                className="w-full bg-black border-2 border-cyan-400 rounded-xl px-3 py-2 text-cyan-300 focus:outline-none shadow-[3px_3px_0_#000]"
              >
                <option value="SERVER">Server</option>
                <option value="DESKTOP">PC Desktop (LAN)</option>
                <option value="LAPTOP">Laptop (Wi-Fi/LAN)</option>
                <option value="MOBILE">Ponsel Pegawai</option>
                <option value="OTHER">Lainnya (Printer/CCTV)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">TIPE KONEKSI:</label>
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value as ConnectionType)}
                className="w-full bg-black border-2 border-pink-500 rounded-xl px-3 py-2 text-pink-300 focus:outline-none shadow-[3px_3px_0_#000]"
              >
                <option value="LAN">Kabel LAN (Garis Penuh)</option>
                <option value="WIFI">Wi-Fi Router (Garis Putus)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">BATAS BANDWIDTH (Mbps):</label>
              <input
                type="number"
                min="5"
                max="100"
                value={maxLimit}
                onChange={(e) => setMaxLimit(Number(e.target.value))}
                className="w-full bg-black border-2 border-yellow-400 rounded-xl px-3 py-2 text-yellow-300 focus:outline-none shadow-[3px_3px_0_#000]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="maxi-btn px-4 py-2 rounded-xl bg-black text-slate-400 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="maxi-btn px-5 py-2 rounded-xl bg-lime-400 text-black font-black"
            >
              Hubungkan Node
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
