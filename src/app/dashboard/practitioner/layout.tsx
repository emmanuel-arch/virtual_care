'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Users, 
  Stethoscope, 
  Star, 
  User, 
  Settings,
  Menu,
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PractitionerLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard/practitioner', icon: LayoutDashboard },
  { name: 'Appointments', href: '/dashboard/practitioner/appointments', icon: Calendar },
  { name: 'Availability', href: '/dashboard/practitioner/availability', icon: Clock },
  { name: 'Messages', href: '/dashboard/practitioner/messages', icon: MessageSquare },
  { name: 'Patients', href: '/dashboard/practitioner/patients', icon: Users },
  { name: 'Services & Specialties', href: '/dashboard/practitioner/services', icon: Stethoscope },
  { name: 'Reviews', href: '/dashboard/practitioner/reviews', icon: Star },
  { name: 'Profile & Verification', href: '/dashboard/practitioner/profile', icon: ShieldCheck },
  { name: 'Settings', href: '/dashboard/practitioner/settings', icon: Settings },
];

export default function PractitionerDashboardLayout({ children }: PractitionerLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">VirtualCare</span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Practitioner badge */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              DR
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Dr. Practitioner</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 lg:px-8">
          <button
            className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {/* Today indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                5
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
