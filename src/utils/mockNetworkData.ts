import { NetworkDevice, NetworkAlert, SimulationPreset } from '../types/network';

export const INITIAL_DEVICES: NetworkDevice[] = [
  {
    id: 'router-01',
    name: 'Router Utama (Kantor Tempat Magang)',
    type: 'ROUTER',
    connectionType: 'WAN',
    ip: '192.168.1.1',
    mac: '00:0C:29:4F:A1:B2',
    status: 'ONLINE',
    downloadMbps: 84.5,
    uploadMbps: 38.2,
    maxMbpsLimit: 100.0,
    pingMs: 2,
    packetLossPercent: 0.0,
    connectedSince: '14 Hari 08 Jam',
    interfaceName: 'ether1-WAN / bridge-LAN',
    topApplications: [
      { name: 'System NAT & Routing', category: 'Core Service', bandwidthMbps: 45.0, percentage: 53, color: '#00f0ff' },
      { name: 'DHCP & DNS Relay', category: 'Network', bandwidthMbps: 22.0, percentage: 26, color: '#00ff9d' },
      { name: 'VPN Gateway', category: 'Security', bandwidthMbps: 15.5, percentage: 18, color: '#a855f7' },
    ],
    history: generateHistory(84.5, 38.2, 2),
  },
  {
    id: 'srv-01',
    name: 'Server Utama Office (Database & App)',
    type: 'SERVER',
    connectionType: 'LAN',
    ip: '192.168.1.10',
    mac: '00:50:56:9A:11:22',
    status: 'HIGH_USAGE',
    downloadMbps: 42.8,
    uploadMbps: 28.4,
    maxMbpsLimit: 100.0,
    pingMs: 4,
    packetLossPercent: 0.1,
    connectedSince: '30 Hari 12 Jam',
    port: 'Kabel LAN 1 (Eth1)',
    interfaceName: 'eth0 Gigabit Ethernet',
    isQosPrioritized: true,
    topApplications: [
      { name: 'PostgreSQL DB Sync', category: 'Database', bandwidthMbps: 24.5, percentage: 57, color: '#3b82f6' },
      { name: 'Docker Registry Backup', category: 'DevOps', bandwidthMbps: 12.1, percentage: 28, color: '#06b6d4' },
      { name: 'Internal Web API', category: 'HTTP/HTTPS', bandwidthMbps: 6.2, percentage: 15, color: '#10b981' },
    ],
    history: generateHistory(42.8, 28.4, 4),
  },
  {
    id: 'pc-01',
    name: 'PC Workstation Admin',
    type: 'DESKTOP',
    connectionType: 'LAN',
    ip: '192.168.1.20',
    mac: '18:C0:4D:88:99:AA',
    status: 'ONLINE',
    downloadMbps: 14.2,
    uploadMbps: 4.1,
    maxMbpsLimit: 100.0,
    pingMs: 8,
    packetLossPercent: 0.0,
    connectedSince: '06 Jam 15 Menit',
    port: 'Kabel LAN 2 (Eth2)',
    interfaceName: 'Realtek PCIe GbE',
    topApplications: [
      { name: 'Browser (ERP Admin)', category: 'Web App', bandwidthMbps: 8.5, percentage: 60, color: '#00f0ff' },
      { name: 'Zoom Conference', category: 'VoIP', bandwidthMbps: 4.2, percentage: 30, color: '#f59e0b' },
      { name: 'Git LFS Sync', category: 'Development', bandwidthMbps: 1.5, percentage: 10, color: '#8b5cf6' },
    ],
    history: generateHistory(14.2, 4.1, 8),
  },
  {
    id: 'lap-01',
    name: 'Laptop Pegawai (Dell XPS - Dev)',
    type: 'LAPTOP',
    connectionType: 'WIFI',
    ip: '192.168.1.35',
    mac: 'F4:D1:08:77:66:55',
    status: 'ONLINE',
    downloadMbps: 18.6,
    uploadMbps: 3.5,
    maxMbpsLimit: 50.0,
    pingMs: 14,
    packetLossPercent: 0.2,
    connectedSince: '04 Jam 45 Menit',
    interfaceName: 'Wi-Fi 6 (802.11ax)',
    topApplications: [
      { name: 'VS Code Sync & NPM', category: 'Dev Tools', bandwidthMbps: 11.2, percentage: 60, color: '#00ff9d' },
      { name: 'Figma Cloud Asset Load', category: 'Design', bandwidthMbps: 5.4, percentage: 29, color: '#ec4899' },
      { name: 'Slack Messaging', category: 'Chat', bandwidthMbps: 2.0, percentage: 11, color: '#6366f1' },
    ],
    history: generateHistory(18.6, 3.5, 14),
  },
  {
    id: 'mob-01',
    name: 'Ponsel Pegawai (Samsung S23)',
    type: 'MOBILE',
    connectionType: 'WIFI',
    ip: '192.168.1.42',
    mac: 'AC:7F:3E:22:11:00',
    status: 'LATENCY_SPIKE',
    downloadMbps: 22.4,
    uploadMbps: 2.2,
    maxMbpsLimit: 30.0,
    pingMs: 45,
    packetLossPercent: 1.5,
    connectedSince: '02 Jam 10 Menit',
    interfaceName: 'Wi-Fi 5 (802.11ac)',
    isThrottled: false,
    topApplications: [
      { name: 'YouTube 4K Streaming', category: 'Media', bandwidthMbps: 17.8, percentage: 79, color: '#ff0055' },
      { name: 'Social Media Background', category: 'Background', bandwidthMbps: 3.2, percentage: 14, color: '#eab308' },
      { name: 'Cloud Photos Sync', category: 'Cloud Storage', bandwidthMbps: 1.4, percentage: 7, color: '#38bdf8' },
    ],
    history: generateHistory(22.4, 2.2, 45),
  },
];

export const INITIAL_ALERTS: NetworkAlert[] = [
  {
    id: 'alt-01',
    timestamp: '10:25:00',
    deviceId: 'mob-01',
    deviceName: 'Ponsel Pegawai (Samsung S23)',
    severity: 'WARNING',
    message: 'Penggunaan Bandwidth Wi-Fi Tinggi (YouTube 4K 17.8 Mbps). Potensi Latency Spike!',
    metric: 'Download: 22.4 Mbps / Ping: 45ms',
    resolved: false,
  },
  {
    id: 'alt-02',
    timestamp: '10:20:00',
    deviceId: 'srv-01',
    deviceName: 'Server Utama Office',
    severity: 'INFO',
    message: 'Proses Backup Database PostgreSQL Aktif pada Kabel LAN 1.',
    metric: 'Upload/Download: 71.2 Mbps',
    resolved: true,
  },
];

function generateHistory(baseDown: number, baseUp: number, basePing: number) {
  const times = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'];
  return times.map((time, idx) => {
    const variance = (idx % 2 === 0 ? 1 : -1) * (Math.random() * 3);
    return {
      time,
      download: Math.max(1, +(baseDown + variance).toFixed(1)),
      upload: Math.max(0.5, +(baseUp + variance * 0.5).toFixed(1)),
      ping: Math.max(1, Math.round(basePing + variance)),
    };
  });
}

export function applySimulationPreset(
  devices: NetworkDevice[],
  preset: SimulationPreset
): { updatedDevices: NetworkDevice[]; newAlerts: NetworkAlert[] } {
  const newAlerts: NetworkAlert[] = [];
  const updatedDevices = devices.map((d) => {
    const dev = { ...d };
    if (preset === 'SERVER_BACKUP') {
      if (dev.id === 'srv-01') {
        dev.downloadMbps = 78.5;
        dev.uploadMbps = 89.2;
        dev.pingMs = 18;
        dev.status = 'HIGH_USAGE';
      } else if (dev.id === 'router-01') {
        dev.downloadMbps = 96.2;
        dev.uploadMbps = 94.0;
        dev.status = 'HIGH_USAGE';
      }
    } else if (preset === 'WIFI_HOG') {
      if (dev.id === 'mob-01') {
        dev.downloadMbps = 29.8;
        dev.uploadMbps = 5.2;
        dev.pingMs = 120;
        dev.packetLossPercent = 4.2;
        dev.status = 'LATENCY_SPIKE';
      }
      if (dev.id === 'lap-01') {
        dev.pingMs = 65;
        dev.status = 'WARNING';
      }
    } else if (preset === 'HIGH_LATENCY') {
      dev.pingMs = Math.round(dev.pingMs * 3.5 + 20);
      dev.packetLossPercent = +(dev.packetLossPercent + 1.8).toFixed(1);
      dev.status = dev.type === 'ROUTER' ? 'WARNING' : 'LATENCY_SPIKE';
    } else if (preset === 'ROUTER_SPIKE') {
      if (dev.id === 'router-01') {
        dev.downloadMbps = 99.8;
        dev.uploadMbps = 98.4;
        dev.pingMs = 85;
        dev.packetLossPercent = 3.0;
        dev.status = 'LATENCY_SPIKE';
      }
    } else {
      // NORMAL
      if (dev.id === 'srv-01') {
        dev.downloadMbps = 35.0;
        dev.uploadMbps = 20.0;
        dev.status = 'HIGH_USAGE';
      } else if (dev.id === 'mob-01') {
        dev.downloadMbps = 12.0;
        dev.uploadMbps = 1.5;
        dev.pingMs = 18;
        dev.packetLossPercent = 0.1;
        dev.status = 'ONLINE';
      } else {
        dev.status = 'ONLINE';
        dev.pingMs = dev.type === 'ROUTER' ? 2 : 10;
        dev.packetLossPercent = 0;
      }
    }
    return dev;
  });

  if (preset === 'SERVER_BACKUP') {
    newAlerts.push({
      id: 'alt-sim-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('id-ID'),
      deviceId: 'srv-01',
      deviceName: 'Server Utama Office',
      severity: 'WARNING',
      message: 'SIMULASI: Traffic Backup Server mencapai 98% Kapasitas Kabel LAN 1!',
      metric: 'Download: 78.5 Mbps / Upload: 89.2 Mbps',
      resolved: false,
    });
  } else if (preset === 'WIFI_HOG') {
    newAlerts.push({
      id: 'alt-sim-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('id-ID'),
      deviceId: 'mob-01',
      deviceName: 'Ponsel Pegawai',
      severity: 'CRITICAL',
      message: 'SIMULASI: Ponsel Pegawai memonopoli 99% Bandwidth Wi-Fi Router!',
      metric: 'Download: 29.8 Mbps / Ping Spike: 120ms',
      resolved: false,
    });
  } else if (preset === 'HIGH_LATENCY') {
    newAlerts.push({
      id: 'alt-sim-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('id-ID'),
      deviceId: 'router-01',
      deviceName: 'Router Utama',
      severity: 'CRITICAL',
      message: 'SIMULASI: Terdeteksi Penggelembung Latensi Tinggi di Seluruh Perangkat Kantor!',
      metric: 'Average Ping > 80ms / Loss > 2%',
      resolved: false,
    });
  }

  return { updatedDevices, newAlerts };
}
