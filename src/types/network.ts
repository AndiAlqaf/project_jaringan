export type DeviceType = 'ROUTER' | 'SERVER' | 'DESKTOP' | 'LAPTOP' | 'MOBILE' | 'INTERNET' | 'OTHER';
export type ConnectionType = 'WAN' | 'LAN' | 'WIFI';
export type DeviceStatus = 'ONLINE' | 'HIGH_USAGE' | 'LATENCY_SPIKE' | 'WARNING' | 'OFFLINE';

export interface ApplicationUsage {
  name: string;
  category: string;
  bandwidthMbps: number;
  percentage: number;
  color: string;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: DeviceType;
  connectionType: ConnectionType;
  ip: string;
  mac: string;
  status: DeviceStatus;
  downloadMbps: number;
  uploadMbps: number;
  maxMbpsLimit: number;
  pingMs: number;
  packetLossPercent: number;
  connectedSince: string;
  port?: string;
  interfaceName: string;
  isQosPrioritized?: boolean;
  isThrottled?: boolean;
  isBlocked?: boolean;
  topApplications: ApplicationUsage[];
  history: {
    time: string;
    download: number;
    upload: number;
    ping: number;
  }[];
}

export interface NetworkAlert {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  metric: string;
  resolved: boolean;
}

export interface TopologyNode {
  id: string;
  label: string;
  sublabel: string;
  type: DeviceType;
  connectionType: ConnectionType;
  x: number;
  y: number;
  status: DeviceStatus;
  ip: string;
  downloadMbps: number;
  uploadMbps: number;
}

export interface TopologyLink {
  source: string;
  target: string;
  type: ConnectionType;
  label: string;
  activeMbps: number;
  isHighLoad?: boolean;
}

export type SimulationPreset = 'NORMAL' | 'SERVER_BACKUP' | 'WIFI_HOG' | 'HIGH_LATENCY' | 'ROUTER_SPIKE';
