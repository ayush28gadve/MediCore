import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, HeartPulse, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === role) {
        navigate(`/${role}/dashboard`);
      } else {
        // Redirect to their actual role dashboard if they logged into the wrong page
        navigate(`/${user.role}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = () => {
    if (!role) return 'Login';
    return role.charAt(0).toUpperCase() + role.slice(1) + ' Login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            <HeartPulse size={32} className="text-[#0ea5e9]" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          {getRoleDisplayName()}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Welcome back to MediCore
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#0ea5e9] hover:text-[#0284c7]">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                Create new account
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Button 
              variant="ghost" 
              className="w-full text-slate-500"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Role Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
