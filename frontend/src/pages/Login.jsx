import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { IndianRupee, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-surface)] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-12">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
            <IndianRupee className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent italic">
            Vyapar IQ
          </h1>
        </div>

        <Card className="p-8 backdrop-blur-md bg-surface-card/80 border-surface-border/30">
          <h2 className="text-2xl font-bold text-surface-foreground mb-2">Welcome back</h2>
          <p className="text-surface-muted-foreground text-sm mb-8">Login to manage your business health</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-surface-muted-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-muted-foreground" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-muted border border-surface-border/20 rounded-xl py-3 pl-12 pr-4 text-surface-foreground focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-muted-foreground" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-muted border border-surface-border/20 rounded-xl py-3 pl-12 pr-4 text-surface-foreground focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-surface-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand font-semibold hover:underline">
              Sign up now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
