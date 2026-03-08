/**
 * Quantum AI - Creator Control Panel
 * Secure administrative interface for system creator
 * 
 * Creator: Mohanraj
 * Role: Cybersecurity Researcher, AI Developer
 */

import React, { useState, useEffect } from 'react';
import { Shield, Power, Lock, Unlock, Trash2, RotateCw, Activity, AlertTriangle } from 'lucide-react';

interface SystemStatus {
  system: string;
  creator: string;
  status: string;
  uptime: number;
  memory: any;
  timestamp: string;
  version: string;
  mode: string;
}

export default function CreatorControlPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [shutdownId, setShutdownId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const API_BASE = 'http://localhost:3001/api/admin';

  // Authenticate
  const handleAuth = () => {
    if (authToken) {
      setIsAuthenticated(true);
      setMessage('✅ Authenticated as Creator');
      fetchStatus();
    }
  };

  // Fetch system status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/quantum/status`, {
        method: 'POST',
        headers: {
          'x-creator-token': authToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        setMessage('❌ Failed to fetch status');
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Execute command
  const executeCommand = async (command: string) => {
    if (!window.confirm(`Execute command: /quantum ${command}?`)) {
      return;
    }

    try {
      setLoading(true);
      setMessage(`⏳ Executing /quantum ${command}...`);

      const response = await fetch(`${API_BASE}/quantum/${command}`, {
        method: 'POST',
        headers: {
          'x-creator-token': authToken,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        
        if (command === 'shutdown' && data.shutdownId) {
          setShutdownId(data.shutdownId);
          setShowVerification(true);
        }
        
        fetchStatus();
      } else {
        setMessage(`❌ Error: ${data.error || data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Verify shutdown
  const verifyShutdown = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/quantum/shutdown/verify`, {
        method: 'POST',
        headers: {
          'x-creator-token': authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shutdownId,
          verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setShowVerification(false);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Format uptime
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-blue-500">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            Quantum AI
          </h1>
          <p className="text-center text-gray-400 mb-6">Creator Control Panel</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Creator Authentication Token
            </label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter your creator token"
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={!authToken}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Authenticate
          </button>

          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
            <p className="text-xs text-yellow-400">
              ⚠️ This panel is restricted to the system creator only.
              Unauthorized access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6 border border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-12 h-12 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Quantum AI Control</h1>
                <p className="text-gray-400">Creator: Mohanraj | Cybersecurity Researcher & AI Developer</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-4 mb-6 border border-blue-500">
            <p className="text-white font-mono text-sm">{message}</p>
          </div>
        )}

        {/* System Status */}
        {status && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6 border border-blue-500">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-green-400" />
              System Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-white font-semibold">{status.status}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Uptime</p>
                <p className="text-white font-semibold">{formatUptime(status.uptime)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Version</p>
                <p className="text-white font-semibold">{status.version}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mode</p>
                <p className="text-white font-semibold">{status.mode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {showVerification && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
              Shutdown Verification Required
            </h2>
            <p className="text-gray-300 mb-4">
              A verification code has been sent to your registered email.
              Enter the code to complete shutdown.
            </p>
            <div className="flex space-x-4">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <button
                onClick={verifyShutdown}
                disabled={loading || verificationCode.length !== 6}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Verify & Shutdown
              </button>
            </div>
          </div>
        )}

        {/* Command Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => fetchStatus()}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-6 rounded-lg shadow-xl transition-colors flex items-center justify-center space-x-3"
          >
            <Activity className="w-6 h-6" />
            <span className="font-semibold">/quantum status</span>
          </button>

          <button
            onClick={() => executeCommand('lockdown')}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white p-6 rounded-lg shadow-xl transition-colors flex items-center justify-center space-x-3"
          >
            <Lock className="w-6 h-6" />
            <span className="font-semibold">/quantum lockdown</span>
          </button>

          <button
            onClick={() => executeCommand('unlock')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-6 rounded-lg shadow-xl transition-colors flex items-center justify-center space-x-3"
          >
            <Unlock className="w-6 h-6" />
            <span className="font-semibold">/quantum unlock</span>
          </button>

          <button
            onClick={() => executeCommand('memory/purge')}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-6 rounded-lg shadow-xl transition-colors flex items-center justify-center space-x-3"
          >
            <Trash2 className="w-6 h-6" />
            <span className="font-semibold">/quantum memory purge</span>
          </button>

          <button
            onClick={() => executeCommand('restart')}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white p-6 rounded-lg shadow-xl transition-colors flex items-center justify-center space-x-3"
          >
            <RotateCw className="w-6 h-6" />
            <span className="font-semibold">/quantum restart</span>
          </button>

          <button
            onClick={() => executeCommand('shutdown')}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-6 rounded-lg shadow-xl transition-colors flex items-center justify-center space-x-3"
          >
            <Power className="w-6 h-6" />
            <span className="font-semibold">/quantum shutdown</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-gray-800 border border-yellow-600 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            🔒 All commands are logged and require creator authentication.
            Shutdown requires email verification for security.
          </p>
        </div>
      </div>
    </div>
  );
}
