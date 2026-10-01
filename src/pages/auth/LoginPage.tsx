import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { Logo } from '../../components/common/Logo';
import { UserRole } from '../../types';
import {
  UserCheck,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { switchRole, setCurrentUser, addToast } = useStore();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('buyer@ecomma.in');
  const [password, setPassword] = useState('password123');

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'seller') navigate('/seller');
    else if (role === 'admin') navigate('/admin');
    else navigate('/');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      setCurrentUser(found);
      addToast({ title: `Welcome back, ${found.name}!`, type: 'success' });
      if (found.role === 'seller') navigate('/seller');
      else if (found.role === 'admin') navigate('/admin');
      else navigate('/');
    } else {
      // Create user or fallback
      handleDemoLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <Logo size="lg" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-[#0F1B2D]">
          Sign in to Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Select your role or click any 1-Click Demo Login to explore immediately.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
          {/* Quick 1-Click Demo Logins */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Logins:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('buyer')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#0F1B2D] hover:bg-stone-50 text-center transition-all flex flex-col items-center gap-1.5 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Buyer</span>
                <span className="text-[10px] text-slate-400">Priya S.</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('seller')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#0F1B2D] hover:bg-stone-50 text-center transition-all flex flex-col items-center gap-1.5 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/20 text-[#0F1B2D] flex items-center justify-center">
                  <Store className="w-4 h-4 text-amber-700" />
                </div>
                <span className="text-xs font-bold text-slate-900">Seller</span>
                <span className="text-[10px] text-slate-400">Rajesh V.</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#0F1B2D] hover:bg-stone-50 text-center transition-all flex flex-col items-center gap-1.5 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Admin</span>
                <span className="text-[10px] text-slate-400">Anita D.</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs font-medium">Or log in with credentials</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['buyer', 'seller', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      if (r === 'buyer') setEmail('buyer@ecomma.in');
                      else if (r === 'seller') setEmail('seller@ecomma.in');
                      else setEmail('admin@ecomma.in');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      selectedRole === r
                        ? 'bg-[#0F1B2D] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In as {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Want to sell on Ecomma?{' '}
            <Link to="/seller/onboarding" className="text-amber-800 font-bold hover:underline">
              Register as Artisan Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
