'use client';

import React, { useState, useEffect } from 'react';
import { HeaderNav } from '../components/HeaderNav';
import { QuickStatsBanner } from '../components/QuickStatsBanner';
import { NetworkTopologyCanvas } from '../components/NetworkTopologyCanvas';
import { BandwidthChart } from '../components/BandwidthChart';
import { DeviceBandwidthGauge } from '../components/DeviceBandwidthGauge';
import { DeviceTable } from '../components/DeviceTable';
import { AlertsPanel } from '../components/AlertsPanel';
import { NetworkDiagnosticsModal } from '../components/NetworkDiagnosticsModal';
import { DeviceDetailDrawer } from '../components/DeviceDetailDrawer';
import { AddDeviceModal } from '../components/AddDeviceModal';
import { MakassarTestingModal } from '../components/MakassarTestingModal';

import { 
  MapPin, 
  RefreshCw, 
  Wifi, 
  Radio, 
  Share2, 
  Sparkles, 
  RotateCcw 
} from 'lucide-react';

import { NetworkDevice, NetworkAlert, SimulationPreset } from '../types/network';
import { INITIAL_DEVICES, INITIAL_ALERTS, applySimulationPreset } from '../utils/mockNetworkData';
import { audioHUD } from '../utils/audioHUD';

export default function Home() {
  const [devices, setDevices] = useState<NetworkDevice[]>(INITIAL_DEVICES);
  const [alerts, setAlerts] = useState<NetworkAlert[]>(INITIAL_ALERTS);
  const [simulationPreset, setSimulationPreset] = useState<SimulationPreset>('NORMAL');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [scanlineActive, setScanlineActive] = useState<boolean>(true);

  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState<boolean>(false);
  const [isMakassarModalOpen, setIsMakassarModalOpen] = useState<boolean>(false);

  // Status Live Network Makassar
  const [isLiveMakassar, setIsLiveMakassar] = useState<boolean>(false);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  // Live telemetry streaming history state
  const [historyData, setHistoryData] = useState<
    { time: string; download: number; upload: number; ping: number }[]
  >([
    { time: '10:00', download: 72.4, upload: 28.1, ping: 8 },
    { time: '10:05', download: 78.1, upload: 31.0, ping: 10 },
    { time: '10:10', download: 84.5, upload: 38.2, ping: 9 },
    { time: '10:15', download: 89.2, upload: 41.5, ping: 12 },
    { time: '10:20', download: 96.0, upload: 44.8, ping: 11 },
    { time: '10:25', download: 88.0, upload: 39.2, ping: 8 },
  ]);

  // Handle Preset Changes
  const handlePresetChange = (preset: SimulationPreset) => {
    setSimulationPreset(preset);
    const { updatedDevices, newAlerts } = applySimulationPreset(devices, preset);
    setDevices(updatedDevices);
    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev]);
    }
  };

  // Muat Data Live Jaringan Makassar dari Router Tenda / ARP Scanner
  const handleLoadMakassarLive = async () => {
    setIsLoadingLive(true);
    audioHUD.playClick();
    try {
      const res = await fetch('/api/tenda');
      const data = await res.json();
      if (data.success && data.devices && data.devices.length > 0) {
        setDevices(data.devices);
        setIsLiveMakassar(true);
        audioHUD.playSuccess();
        setAlerts((prev) => [
          {
            id: `alert-makassar-${Date.now()}`,
            deviceId: data.devices[0].id,
            deviceName: 'Router Tenda Makassar',
            severity: 'INFO',
            message: `Mode Live Makassar Aktif! Terhubung ke Gateway 192.168.0.1 (${data.dataSource})`,
            metric: '192.168.0.1 (Tenda)',
            timestamp: new Date().toLocaleTimeString('id-ID'),
            resolved: false,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Failed to load Makassar live network:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  const handleResetToSimulation = () => {
    audioHUD.playClick();
    setDevices(INITIAL_DEVICES);
    setIsLiveMakassar(false);
  };

  // Real-time telemetry tick loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDevices((prevDevices) => {
        return prevDevices.map((d) => {
          if (d.status === 'OFFLINE' || d.isBlocked) return d;

          let deltaDown = (Math.random() - 0.5) * 3;
          let deltaUp = (Math.random() - 0.5) * 1.5;
          let deltaPing = (Math.random() - 0.5) * 2;

          // If throttled, cap download
          let targetDown = Math.max(1, d.downloadMbps + deltaDown);
          if (d.isThrottled && targetDown > 10) {
            targetDown = 9.5;
          }

          let targetPing = Math.max(2, Math.round(d.pingMs + deltaPing));

          return {
            ...d,
            downloadMbps: +targetDown.toFixed(1),
            uploadMbps: +Math.max(0.5, d.uploadMbps + deltaUp).toFixed(1),
            pingMs: targetPing,
          };
        });
      });

      // Update streaming history
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistoryData((prev) => {
        const totalDown = devices.reduce((s, dev) => s + dev.downloadMbps, 0);
        const totalUp = devices.reduce((s, dev) => s + dev.uploadMbps, 0);
        const avgPing = Math.round(devices.reduce((s, dev) => s + dev.pingMs, 0) / (devices.length || 1));

        const newSlice = [
          ...prev.slice(1),
          { time: nowTime, download: +totalDown.toFixed(1), upload: +totalUp.toFixed(1), ping: avgPing },
        ];
        return newSlice;
      });

    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, devices]);

  // Keep selected device synced with updated device state
  useEffect(() => {
    if (selectedDevice) {
      const latest = devices.find((d) => d.id === selectedDevice.id);
      if (latest) setSelectedDevice(latest);
    }
  }, [devices, selectedDevice]);

  // Device Action Handlers
  const handleToggleQoS = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, isQosPrioritized: !d.isQosPrioritized } : d))
    );
  };

  const handleToggleThrottle = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              isThrottled: !d.isThrottled,
              status: !d.isThrottled ? 'ONLINE' : d.status,
              downloadMbps: !d.isThrottled ? Math.min(d.downloadMbps, 9.5) : d.downloadMbps,
            }
          : d
      )
    );
  };

  const handleToggleBlock = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              isBlocked: !d.isBlocked,
              status: !d.isBlocked ? 'OFFLINE' : 'ONLINE',
              downloadMbps: !d.isBlocked ? 0 : 15,
              uploadMbps: !d.isBlocked ? 0 : 2,
            }
          : d
      )
    );
  };

  const handleUpdateLimit = (deviceId: string, newLimit: number) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, maxMbpsLimit: newLimit } : d))
    );
  };

  const handleAddDevice = (newDevice: NetworkDevice) => {
    setDevices((prev) => [...prev, newDevice]);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className={`min-h-screen pb-12 flex flex-col ${scanlineActive ? 'scanline' : ''}`}>
      
      {/* Header Navigation */}
      <HeaderNav
        simulationPreset={simulationPreset}
        onPresetChange={handlePresetChange}
        isSimulating={isSimulating}
        onToggleSimulate={() => setIsSimulating(!isSimulating)}
        scanlineActive={scanlineActive}
        onToggleScanline={() => setScanlineActive(!scanlineActive)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenAddDevice={() => setIsAddDeviceOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 mt-6 flex-1 space-y-6">
        
        {/* BANNER KONTROL TESTING MAKASSAR ⇄ SURABAYA */}
        <div className="bg-[#0b081e] p-3.5 rounded-2xl border-2 border-lime-400 shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-lime-400 text-black border-2 border-black">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-lime-400 tracking-wide">
                  PENGUJIAN LOKASI MAKASSAR
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                  isLiveMakassar 
                    ? 'bg-lime-400 text-black animate-pulse' 
                    : 'bg-yellow-400 text-black'
                }`}>
                  {isLiveMakassar ? 'LIVE TENDA ROUTER AKTIF' : 'MODE SIMULASI LAB'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span>Wi-Fi: <strong className="text-white">www.tendawifi.com (192.168.0.1)</strong></span>
                <span className="text-slate-600">•</span>
                <span>PC: <strong className="text-yellow-300">192.168.0.243</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {isLiveMakassar ? (
              <button
                onClick={handleResetToSimulation}
                className="maxi-btn px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulasi Lab</span>
              </button>
            ) : null}

            <button
              onClick={handleLoadMakassarLive}
              disabled={isLoadingLive}
              className="maxi-btn px-3.5 py-1.5 rounded-xl bg-lime-400 text-black hover:bg-lime-300 text-xs font-black flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>{isLoadingLive ? 'Memindai...' : isLiveMakassar ? 'Segarkan Data Live' : 'Muat Data Riil Makassar'}</span>
            </button>

            <button
              onClick={() => {
                setIsMakassarModalOpen(true);
                audioHUD.playClick();
              }}
              className="maxi-btn px-3 py-1.5 rounded-xl bg-pink-500 text-white hover:bg-pink-400 text-xs font-bold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Panduan Remote Surabaya</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Telemetry Cards */}
        <QuickStatsBanner devices={devices} alerts={alerts} />

        {/* Section 1: Animated Network Topology Visualizer */}
        <NetworkTopologyCanvas
          devices={devices}
          onSelectDevice={(device) => setSelectedDevice(device)}
          onOpenAddDevice={() => setIsAddDeviceOpen(true)}
        />

        {/* Section 2: Realtime Bandwidth Chart & Bandwidth Hog Analyzer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BandwidthChart historyData={historyData} devices={devices} />
          <DeviceBandwidthGauge
            devices={devices}
            onThrottleDevice={handleToggleThrottle}
            onSelectDevice={(device) => setSelectedDevice(device)}
          />
        </div>

        {/* Section 3: Device Table Manager & Alerts Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DeviceTable
              devices={devices}
              onSelectDevice={(device) => setSelectedDevice(device)}
              onToggleQoS={handleToggleQoS}
              onToggleThrottle={handleToggleThrottle}
              onToggleBlock={handleToggleBlock}
            />
          </div>
          <div>
            <AlertsPanel
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onClearAll={handleClearAllAlerts}
            />
          </div>
        </div>

      </main>

      {/* Footer Meta */}
      <footer className="mt-12 py-6 border-t border-cyan-950 bg-[#02050f]/80 text-center text-xs font-mono text-slate-500">
        <p className="text-cyan-400 font-bold">
          PERANCANGAN APLIKASI MONITORING JARINGAN KANTOR TEMPAT MAGANG
        </p>
        <p className="mt-1 text-slate-400">
          Kelompok 1: Raffi Fadlika (42623002) • Fatrah Aryadi Abduh (42623012) • Andi Muh. Al Qaf Wiryawan Fahri (42623022)
        </p>
        <p className="mt-0.5 text-slate-600">
          PT Primus Indonesia & PT Anugrah Inti Spektra • Next.js Sci-Fi Cyberguard UI
        </p>
      </footer>

      {/* Modals & Drawers */}
      <NetworkDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        devices={devices}
      />

      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onAddDevice={handleAddDevice}
      />

      <MakassarTestingModal
        isOpen={isMakassarModalOpen}
        onClose={() => setIsMakassarModalOpen(false)}
        onLoadLiveDevices={handleLoadMakassarLive}
        isLoadingLive={isLoadingLive}
        isLiveMode={isLiveMakassar}
        deviceCount={devices.length}
      />

      <DeviceDetailDrawer
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
        onToggleQoS={handleToggleQoS}
        onToggleThrottle={handleToggleThrottle}
        onToggleBlock={handleToggleBlock}
        onUpdateLimit={handleUpdateLimit}
      />

    </div>
  );
}
