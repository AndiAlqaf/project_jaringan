'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Server, 
  Monitor, 
  Laptop, 
  Smartphone, 
  Zap, 
  Sliders, 
  Lock, 
  Unlock, 
  ArrowUpDown,
  Radio
} from 'lucide-react';
import { NetworkDevice } from '../types/network';
import { audioHUD } from '../utils/audioHUD';

interface DeviceTableProps {
  devices: NetworkDevice[];
  onSelectDevice: (device: NetworkDevice) => void;
  onToggleQoS: (deviceId: string) => void;
  onToggleThrottle: (deviceId: string) => void;
  onToggleBlock: (deviceId: string) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  onSelectDevice,
  onToggleQoS,
  onToggleThrottle,
  onToggleBlock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'LAN' | 'WIFI'>('ALL');
  const [sortBy, setSortBy] = useState<'download' | 'ping' | 'name'>('download');
  const [sortDesc, setSortDesc] = useState(true);

  const filteredDevices = devices.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.ip.includes(searchQuery) ||
      dev.mac.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'LAN') return matchesSearch && dev.connectionType === 'LAN';
    if (filterType === 'WIFI') return matchesSearch && dev.connectionType === 'WIFI';
    return matchesSearch;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let res = 0;
    if (sortBy === 'download') res = b.downloadMbps - a.downloadMbps;
    else if (sortBy === 'ping') res = b.pingMs - a.pingMs;
    else res = a.name.localeCompare(b.name);
    return sortDesc ? res : -res;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HIGH_USAGE':
        return <span className="maxi-sticker bg-yellow-400 text-black">HIGH USAGE</span>;
      case 'LATENCY_SPIKE':
        return <span className="maxi-sticker bg-rose-500 text-white animate-bounce">LATENCY SPIKE</span>;
      case 'OFFLINE':
        return <span className="maxi-sticker bg-slate-800 text-slate-400">OFFLINE</span>;
      default:
        return <span className="maxi-sticker bg-lime-400 text-black">ONLINE</span>;
    }
  };

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
        return <Radio className="w-4 h-4 text-lime-300" />;
    }
  };

  return (
    <div className="maxi-card rounded-3xl p-5 border-3 border-lime-400 font-mono">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b-2 border-lime-900/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="maxi-sticker bg-lime-400 text-black">DAFTAR NODE</span>
            <h3 className="text-lg font-black text-white font-display">
              MANAJEMEN PERANGKAT TERHUBUNG
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-bold mt-1">
            Inspeksi alamat IP, MAC address, port kabel LAN & Wi-Fi Direct
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Tabs */}
          <div className="flex items-center bg-black p-1 rounded-xl border-2 border-lime-400 text-xs font-black shadow-[3px_3px_0_#000]">
            <button
              onClick={() => { setFilterType('ALL'); audioHUD.playClick(); }}
              className={`px-3 py-1 rounded-lg transition-colors ${filterType === 'ALL' ? 'bg-lime-400 text-black' : 'text-slate-400'}`}
            >
              Semua ({devices.length})
            </button>
            <button
              onClick={() => { setFilterType('LAN'); audioHUD.playClick(); }}
              className={`px-3 py-1 rounded-lg transition-colors ${filterType === 'LAN' ? 'bg-cyan-400 text-black' : 'text-slate-400'}`}
            >
              Kabel LAN
            </button>
            <button
              onClick={() => { setFilterType('WIFI'); audioHUD.playClick(); }}
              className={`px-3 py-1 rounded-lg transition-colors ${filterType === 'WIFI' ? 'bg-pink-500 text-white' : 'text-slate-400'}`}
            >
              Wi-Fi
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-52">
            <Search className="w-4 h-4 text-lime-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari IP / Nama / MAC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border-2 border-lime-400 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-none shadow-[3px_3px_0_#000]"
            />
          </div>
        </div>
      </div>

      {/* Cyber Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-black bg-black text-lime-300 font-black">
              <th className="p-3">Perangkat / Node</th>
              <th className="p-3">IP & MAC Address</th>
              <th className="p-3">Port Koneksi</th>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => { setSortBy('download'); setSortDesc(!sortDesc); }}>
                <div className="flex items-center gap-1">
                  <span>Down / Up</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => { setSortBy('ping'); setSortDesc(!sortDesc); }}>
                <div className="flex items-center gap-1">
                  <span>Ping</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi Kontrol</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-900">
            {sortedDevices.map((dev) => (
              <tr 
                key={dev.id} 
                className={`hover:bg-purple-950/40 transition-colors ${dev.isBlocked ? 'opacity-50 bg-rose-950/20' : ''}`}
              >
                <td className="p-3">
                  <div 
                    onClick={() => { onSelectDevice(dev); audioHUD.playClick(); }}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className="p-2 rounded-xl bg-black border-2 border-slate-700 group-hover:border-lime-400">
                      {getDeviceIcon(dev.type)}
                    </div>
                    <div>
                      <p className="font-black text-white group-hover:text-lime-300 transition-colors text-sm">
                        {dev.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">{dev.interfaceName}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <p className="text-cyan-300 font-black">{dev.ip}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{dev.mac}</p>
                </td>

                <td className="p-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black border-2 border-black shadow-[2px_2px_0_#000] ${
                    dev.connectionType === 'LAN' 
                      ? 'bg-blue-400 text-black' 
                      : dev.connectionType === 'WIFI'
                      ? 'bg-pink-400 text-black'
                      : 'bg-purple-400 text-black'
                  }`}>
                    {dev.port || dev.connectionType}
                  </span>
                </td>

                <td className="p-3">
                  <p className="text-lime-300 font-black text-sm">{dev.downloadMbps.toFixed(1)} Mbps</p>
                  <p className="text-[10px] text-pink-300 font-bold">&uarr; {dev.uploadMbps.toFixed(1)} Mbps</p>
                </td>

                <td className="p-3">
                  <span className={`font-black text-sm ${dev.pingMs > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {dev.pingMs} ms
                  </span>
                  <p className="text-[10px] text-slate-400 font-bold">Loss: {dev.packetLossPercent}%</p>
                </td>

                <td className="p-3">
                  {getStatusBadge(dev.status)}
                </td>

                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => { onToggleQoS(dev.id); audioHUD.playClick(); }}
                      className={`maxi-btn p-1.5 rounded-lg text-xs ${
                        dev.isQosPrioritized 
                          ? 'bg-cyan-400 text-black' 
                          : 'bg-black text-slate-400'
                      }`}
                      title="Prioritas QOS"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => { onToggleThrottle(dev.id); audioHUD.playAlert(); }}
                      className={`maxi-btn p-1.5 rounded-lg text-xs ${
                        dev.isThrottled 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-black text-slate-400'
                      }`}
                      title="Batasi Speed"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => { onToggleBlock(dev.id); audioHUD.playAlert(); }}
                      className={`maxi-btn p-1.5 rounded-lg text-xs ${
                        dev.isBlocked 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-black text-slate-400'
                      }`}
                      title={dev.isBlocked ? 'Buka Blokir' : 'Blokir'}
                    >
                      {dev.isBlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => { onSelectDevice(dev); audioHUD.playClick(); }}
                      className="maxi-btn px-3 py-1 rounded-lg bg-lime-400 text-black text-[10px] font-black"
                    >
                      Inspeksi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
