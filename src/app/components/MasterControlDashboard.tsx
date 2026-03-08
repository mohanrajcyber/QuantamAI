/**
 * Quantum AI - Master Control Dashboard
 * Advanced monitoring and administration system
 * 
 * Creator: Mohanraj
 * Role: Cybersecurity Researcher, AI Developer
 * Access Code: 17120105MOHANRAJ
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Users, HardDrive, Cpu, Database, 
  Globe, Lock, Power, Trash2, Save, Wrench, AlertTriangle,
  Smartphone, Laptop, Monitor, MapPin, Clock, Mail, Phone
} from 'lucide-react';

interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  device_type: 'mobile' | 'laptop' | 'desktop' | 'tablet';
  device_os: string;
  ip_address: string;
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  last_active: Date;
  status: 'online' | 'idle' | 'offline';
}

interface SystemStats {
  activeUsers: number;
  totalDevices: number;
  processingPower: number;
  memoryUsage: number;
  dataLogs: number;
  activeSessions: number;
}

export default function MasterControlDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    activeUsers: 0,
    totalDevices: 0,
    processingPower: 0,
    memoryUsage: 0,
    dataLogs: 0,
    activeSessions: 0
  });

  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Auto-refresh stats every 3 seconds
  useEffect(() => {
    // Fetch initial data
    fetchRealData();

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRealData();
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Fetch real data from analytics API
  const fetchRealData = async () => {
    try {
      setApiError(null);
      
      // Fetch system stats
      const statsResponse = await fetch('http://localhost:3001/api/analytics/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          activeUsers: statsData.activeUsers,
          totalDevices: statsData.totalDevices,
          processingPower: statsData.processingPower,
          memoryUsage: statsData.memoryUsage,
          dataLogs: statsData.dataLogs,
          activeSessions: statsData.activeSessions
        });
      } else {
        throw new Error(`Stats API returned ${statsResponse.status}`);
      }

      // Fetch users
      const usersResponse = await fetch('http://localhost:3001/api/analytics/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      } else {
        throw new Error(`Users API returned ${usersResponse.status}`);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching real data:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to connect to analytics API');
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'laptop': return <Laptop className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAdminAction = (action: string) => {
    console.log(`🔷 Master Control: ${action}`);
    alert(`Master Control: ${action} executed`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-950 text-white p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwwLDAsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6 border-2 border-red-600 rounded-lg p-6 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <div className="text-red-500 text-sm font-mono mb-1">//source code 17120105MOHANRAJ</div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Lock className="w-8 h-8 text-red-500" />
                  Access Granted - Welcome Master Mohanraj
                </h1>
                <p className="text-gray-400 mt-1">
                  Quantum AI | Cybersecurity Researcher, AI Developer, Creator of Quantum AI
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Master Control Mode</div>
              <div className="text-2xl font-bold text-red-500">ENGAGED</div>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-black/50 border border-red-600/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-400">CURRENT STATUS</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.activeUsers}</div>
            <div className="text-xs text-gray-400">Active Users</div>
          </div>

          <div className="bg-black/50 border border-red-600/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Monitor className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-400">DEVICES</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.totalDevices}</div>
            <div className="text-xs text-gray-400">Devices</div>
          </div>

          <div className="bg-black/50 border border-red-600/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-400">DATA LOGS</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.dataLogs.toFixed(1)} GB</div>
            <div className="text-xs text-gray-400">Data Logs</div>
          </div>

          <div className="bg-black/50 border border-red-600/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-400">PROCESSING</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.processingPower.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Processing</div>
          </div>

          <div className="bg-black/50 border border-red-600/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-400">MEMORY</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.memoryUsage.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Memory Usage</div>
          </div>

          <div className="bg-black/50 border border-red-600/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-400">SESSIONS</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{stats.activeSessions}</div>
            <div className="text-xs text-gray-400">Active Sessions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Users Table */}
          <div className="lg:col-span-2 bg-black/50 border border-red-600/50 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-red-500" />
                DASHBOARD - ACTIVE USERS MONITORING
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Auto Refresh:</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    autoRefresh ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  {autoRefresh ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-4 bg-red-900/30 border border-red-600 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Analytics API Error</div>
                    <div className="text-sm">{apiError}</div>
                    <div className="text-xs mt-1">Make sure backend is running: npm start</div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && users.length === 0 && (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading real-time data...</p>
              </div>
            )}

            {/* No Users State */}
            {!isLoading && users.length === 0 && !apiError && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No active users yet</p>
                <p className="text-sm text-gray-500">Visit Quantum AI from different devices to see them here</p>
              </div>
            )}

            {/* Users Table */}
            {users.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-600/30">
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Name</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Device</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Email</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">IP Address</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Last Active</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.user_id}
                        onClick={() => setSelectedUser(user)}
                        className="border-b border-red-600/10 hover:bg-red-900/20 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(user.device_type)}
                            <span className="text-gray-300">{user.device_os}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-300">{user.email}</td>
                        <td className="py-3 px-2 text-gray-300 font-mono text-xs">{user.ip_address}</td>
                        <td className="py-3 px-2 text-gray-300 text-xs">
                          {new Date(user.last_active).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.status === 'online' ? 'bg-green-600' :
                            user.status === 'idle' ? 'bg-yellow-600' : 'bg-red-600'
                          }`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Selected User Details */}
            {selectedUser && (
              <div className="bg-black/50 border border-red-600/50 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  User Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Name</div>
                    <div className="font-semibold">{selectedUser.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Device</div>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(selectedUser.device_type)}
                      <span>{selectedUser.device_os}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Location</div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedUser.location}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Last Active</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(selectedUser.last_active).toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Contact</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Control Panel */}
            <div className="bg-black/50 border border-red-600/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-red-500" />
                Advanced Tools
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAdminAction('Memory Flush')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Memory Flush
                </button>
                <button
                  onClick={() => handleAdminAction('Source Backup')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Source Backup
                </button>
                <button
                  onClick={() => handleAdminAction('AI Maintenance')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Wrench className="w-5 h-5" />
                  AI Maintenance
                </button>
                <button
                  onClick={() => handleAdminAction('Security Lockdown')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  Security Lockdown
                </button>
                <button
                  onClick={() => handleAdminAction('System Shutdown')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Power className="w-5 h-5" />
                  System Shutdown
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* World Map Section */}
        <div className="mt-6 bg-black/50 border border-red-600/50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-red-500" />
            Live World Map - Users System 🌍
          </h2>
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <Globe className="w-16 h-16 text-red-500 mx-auto mb-4 animate-spin" style={{ animationDuration: '10s' }} />
            <p className="text-gray-400 mb-2">World Map Visualization</p>
            <p className="text-sm text-gray-500">
              Showing {users.filter(u => u.status === 'online').length} active users across {new Set(users.map(u => u.country)).size} countries
            </p>
            <div className="mt-4 text-xs text-gray-600">
              Integration: Leaflet.js / Mapbox / Google Maps API
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Quantum AI Master Control Dashboard v1.0.0</p>
          <p>Creator: Mohanraj | Cybersecurity Researcher & AI Developer</p>
          <p className="mt-2 text-xs">🔒 Secure Connection | All actions are logged and monitored</p>
        </div>
      </div>
    </div>
  );
}
