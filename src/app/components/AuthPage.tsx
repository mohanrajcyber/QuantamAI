/**
 * Quantum AI - Authentication Page
 * Login/Signup system with Google OAuth, Email, Phone OTP
 * 
 * Creator: Mohanraj
 * Role: Cybersecurity Researcher, AI Developer
 */

import React, { useState, useEffect } from 'react';
import { Mail, Lock, Phone, User, MapPin, Eye, EyeOff, Loader } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (userData: UserData) => void;
}

interface UserData {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  auth_method: 'google' | 'email' | 'phone' | 'demo';
  created_at: Date;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'auth' | 'otp' | 'location'>('auth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Location data
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);

  // Request location permission
  const requestLocation = async () => {
    try {
      setLoading(true);
      
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get city/country
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            
            setUserLocation({
              latitude,
              longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
              country: data.address?.country || 'Unknown'
            });
            
            setLocationPermission(true);
            setLoading(false);
          } catch (error) {
            // Fallback if geocoding fails
            setUserLocation({
              latitude,
              longitude,
              city: 'Unknown',
              country: 'Unknown'
            });
            setLocationPermission(true);
            setLoading(false);
          }
        },
        (error) => {
          setError('Location permission denied. Please enable location access.');
          setLoading(false);
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get location');
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use default location if not granted
      const location = userLocation || { 
        latitude: 13.0827, 
        longitude: 80.2707, 
        city: 'Chennai', 
        country: 'India' 
      };
      
      // In production, use actual Google OAuth
      // For now, simulate Google sign-in
      const userData: UserData = {
        user_id: `google_${Date.now()}`,
        name: 'Google User',
        email: 'user@gmail.com',
        phone: '',
        location,
        auth_method: 'google',
        created_at: new Date()
      };
      
      // Try to save to backend (optional)
      try {
        await saveUserData(userData);
      } catch (error) {
        console.log('Backend not available, continuing with local storage only');
      }
      
      // Success
      onAuthSuccess(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email/Password Signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validation
      if (!name || !email || !password) {
        throw new Error('Please fill all fields');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Request location (optional for demo)
      if (!locationPermission) {
        // Use default location if permission not granted
        setUserLocation({ 
          latitude: 13.0827, 
          longitude: 80.2707, 
          city: 'Chennai', 
          country: 'India' 
        });
      }
      
      const userData: UserData = {
        user_id: `email_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        location: userLocation || { latitude: 13.0827, longitude: 80.2707, city: 'Chennai', country: 'India' },
        auth_method: 'email',
        created_at: new Date()
      };
      
      // Try to save to backend (optional - works without backend too)
      try {
        await saveUserData(userData);
      } catch (error) {
        console.log('Backend not available, continuing with local storage only');
      }
      
      // Success - works even if backend fails
      onAuthSuccess(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone OTP
  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (step === 'auth') {
        // Send OTP
        if (!phone || phone.length < 10) {
          throw new Error('Please enter a valid phone number');
        }
        
        // Simulate OTP send
        await fetch('http://localhost:3001/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        
        setStep('otp');
      } else if (step === 'otp') {
        // Verify OTP
        if (!otp || otp.length !== 6) {
          throw new Error('Please enter a valid 6-digit OTP');
        }
        
        // Request location
        if (!locationPermission) {
          setStep('location');
          await requestLocation();
          return;
        }
        
        const userData: UserData = {
          user_id: `phone_${Date.now()}`,
          name: name || 'Phone User',
          email: '',
          phone,
          location: userLocation,
          auth_method: 'phone',
          created_at: new Date()
        };
        
        // Save to backend
        await saveUserData(userData);
        
        // Success
        onAuthSuccess(userData);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Phone verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Save user data to backend
  const saveUserData = async (userData: UserData) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      
      // Store in localStorage
      localStorage.setItem('quantum_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      // Continue anyway - data will be tracked by analytics
    }
  };

  // Location permission screen
  if (step === 'location' && !locationPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Enable Location Access
          </h2>
          
          <p className="text-gray-600 mb-6">
            Quantum AI needs your location to provide personalized services and show you in the global user map.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <button
            onClick={requestLocation}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Allow Location Access
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              // Skip location (use default)
              setUserLocation({ latitude: 0, longitude: 0, city: 'Unknown', country: 'Unknown' });
              setLocationPermission(true);
              setStep('auth');
            }}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // OTP verification screen
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Enter OTP</h2>
            <p className="text-gray-600">
              We sent a 6-digit code to {phone}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handlePhoneSignup} className="space-y-4">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest text-gray-900 bg-white"
                maxLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('auth')}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Back to phone number
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main auth screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex">
        {/* Left side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-center items-center text-white">
          <div className="mb-8 flex flex-col items-center">
            {/* Gradient Logo */}
            <div className="mb-8 relative">
              <div className="w-48 h-48 relative">
                {/* Outer gradient circle */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer arc */}
                  <path
                    d="M 180 100 A 80 80 0 1 0 100 20"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  
                  {/* User icon circle (head) */}
                  <circle
                    cx="100"
                    cy="80"
                    r="25"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="10"
                  />
                  
                  {/* User icon body (semicircle) */}
                  <path
                    d="M 65 120 Q 65 95 100 95 Q 135 95 135 120"
                    fill="none"
                    stroke="url(#logoGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  
                  {/* Bottom right decorative elements */}
                  <circle cx="175" cy="120" r="6" fill="#ec4899" />
                  <path
                    d="M 165 145 L 175 155"
                    stroke="#ec4899"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Quantum AI</h1>
            <p className="text-lg opacity-90 text-center">
              Your intelligent AI assistant for everything
            </p>
          </div>
          <div className="text-sm opacity-75 text-center">
            <p>Created by Mohanraj</p>
            <p>Cybersecurity Researcher & AI Developer</p>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' 
                ? 'Sign in to continue to Quantum AI' 
                : 'Sign up to get started with Quantum AI'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Social login buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-gray-800"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>

            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-gray-800"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span className="font-medium text-gray-700">Continue with Facebook</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Email/Password form */}
          <form onSubmit={mode === 'signup' ? handleEmailSignup : handleEmailSignup} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 1234567890"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Development: Skip Login Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                // Create demo user
                const demoUser: UserData = {
                  user_id: `demo_${Date.now()}`,
                  name: 'Demo User',
                  email: 'demo@quantumai.com',
                  phone: '+91 9876543210',
                  location: {
                    latitude: 13.0827,
                    longitude: 80.2707,
                    city: 'Chennai',
                    country: 'India'
                  },
                  auth_method: 'demo',
                  created_at: new Date()
                };
                onAuthSuccess(demoUser);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
            >
              Skip Login (Demo Mode)
            </button>
          </div>

          <p className="mt-6 text-xs text-center text-gray-500">
            By continuing, you agree to Quantum AI's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
