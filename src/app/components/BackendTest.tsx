import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import backendService from '../services/backendService';
import { getAvailableModels, getOllamaStatus } from '../services/aiService';

interface BackendTestProps {}

const BackendTest: React.FC<BackendTestProps> = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [ollamaStatus, setOllamaStatus] = useState<any>(null);
  const [availableModels, setAvailableModels] = useState<any>(null);
  const [testResponse, setTestResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkHealth();
    loadOllamaStatus();
    loadAvailableModels();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await backendService.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      setError('Backend health check failed');
      console.error(err);
    }
  };

  const loadOllamaStatus = async () => {
    try {
      const status = await getOllamaStatus();
      setOllamaStatus(status);
    } catch (err) {
      console.error('Failed to load Ollama status:', err);
    }
  };

  const loadAvailableModels = async () => {
    try {
      const models = await getAvailableModels();
      setAvailableModels(models);
    } catch (err) {
      console.error('Failed to load available models:', err);
    }
  };

  const testOllamaChat = async () => {
    setLoading(true);
    setError('');
    setTestResponse('');
    
    try {
      const response = await backendService.ollamaChat({
        prompt: 'Hello! Please introduce yourself in one sentence.',
        options: {
          temperature: 0.7,
          max_tokens: 100
        }
      });
      
      setTestResponse(response.response);
    } catch (err: any) {
      setError(`Ollama test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Backend Integration Test</h2>
      
      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Backend Health Status
            {healthStatus && (
              <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
                {healthStatus.status}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthStatus ? (
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {healthStatus.status}</p>
              <p><strong>Uptime:</strong> {Math.floor(healthStatus.uptime)} seconds</p>
              <p><strong>Memory Usage:</strong> {Math.round(healthStatus.memory.heapUsed / 1024 / 1024)}MB</p>
              <p><strong>Version:</strong> {healthStatus.version}</p>
            </div>
          ) : (
            <p className="text-red-500">Failed to connect to backend</p>
          )}
        </CardContent>
      </Card>

      {/* Ollama Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ollama Free API Status</CardTitle>
        </CardHeader>
        <CardContent>
          {ollamaStatus ? (
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {ollamaStatus.status}</p>
              {ollamaStatus.statistics && (
                <>
                  <p><strong>Total Families:</strong> {ollamaStatus.statistics.totalFamilies}</p>
                  <p><strong>Total Models:</strong> {ollamaStatus.statistics.totalModels}</p>
                  <p><strong>Estimated Servers:</strong> {ollamaStatus.statistics.estimatedServers}</p>
                </>
              )}
            </div>
          ) : (
            <p>Loading Ollama status...</p>
          )}
        </CardContent>
      </Card>

      {/* Available Models */}
      <Card>
        <CardHeader>
          <CardTitle>Available AI Models</CardTitle>
        </CardHeader>
        <CardContent>
          {availableModels ? (
            <div className="space-y-4">
              {Object.entries(availableModels).map(([provider, models]: [string, any]) => (
                <div key={provider}>
                  <h4 className="font-semibold capitalize mb-2">{provider}</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider === 'ollama' ? (
                      <>
                        <p className="text-sm text-gray-600 w-full">
                          Families: {models.families?.length || 0} | Models: {models.models?.length || 0}
                        </p>
                        {models.families?.slice(0, 5).map((family: string) => (
                          <Badge key={family} variant="outline">{family}</Badge>
                        ))}
                      </>
                    ) : (
                      Array.isArray(models) && models.slice(0, 5).map((model: string) => (
                        <Badge key={model} variant="outline">{model}</Badge>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading available models...</p>
          )}
        </CardContent>
      </Card>

      {/* Test Chat */}
      <Card>
        <CardHeader>
          <CardTitle>Test Ollama Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testOllamaChat} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Ollama Chat'}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {testResponse && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-800 mb-2">Response:</p>
              <p className="text-green-700">{testResponse}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendTest;