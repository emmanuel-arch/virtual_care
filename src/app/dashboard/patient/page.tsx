'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MessageSquare, 
  Clock, 
  Search, 
  ChevronRight,
  Video,
  User,
  Heart,
  ArrowRight
} from 'lucide-react';
import { Appointment, PatientDashboardStats } from '@/lib/api/types';

export default function PatientDashboard() {
  const [stats, setStats] = useState<PatientDashboardStats>({
    upcoming_appointments: 0,
    unread_messages: 0,
    past_consultations: 0,
    favorite_practitioners: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In production, these would be real API calls
        // For demo, we'll use mock data
        setStats({
          upcoming_appointments: 2,
          unread_messages: 3,
          past_consultations: 8,
          favorite_practitioners: 4,
        });
        
        setUpcomingAppointments([
          {
            id: '1',
            patient_id: 'p1',
            practitioner_id: 'pr1',
            appointment_date: '2026-02-03',
            start_time: '10:00',
            end_time: '10:30',
            status: 'confirmed',
            created_at: '',
            updated_at: '',
            practitioner: {
              id: 'pr1',
              user_id: 'u1',
              license_number: 'MD12345',
              license_state: 'California',
              is_verified: true,
              rating: 4.9,
              total_reviews: 127,
              full_name: 'Dr. Sarah Johnson',
              education: 'Internal Medicine',
              created_at: '',
              updated_at: '',
            },
            service: {
              id: 's1',
              name: 'General Consultation',
              category: 'Primary Care',
              duration_minutes: 30,
              created_at: '',
            },
          },
          {
            id: '2',
            patient_id: 'p1',
            practitioner_id: 'pr2',
            appointment_date: '2026-02-05',
            start_time: '14:00',
            end_time: '14:45',
            status: 'scheduled',
            created_at: '',
            updated_at: '',
            practitioner: {
              id: 'pr2',
              user_id: 'u2',
              license_number: 'MD67890',
              license_state: 'California',
              is_verified: true,
              rating: 4.8,
              total_reviews: 89,
              full_name: 'Dr. Michael Chen',
              education: 'Cardiology',
              created_at: '',
              updated_at: '',
            },
            service: {
              id: 's2',
              name: 'Heart Health Checkup',
              category: 'Cardiology',
              duration_minutes: 45,
              created_at: '',
            },
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Confirmed</Badge>;
      case 'scheduled':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Welcome back!</h1>
          <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your health journey</p>
        </div>
        <Link href="/dashboard/patient/find-practitioner">
          <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25">
            <Search className="w-4 h-4 mr-2" />
            Find a Practitioner
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg shadow-teal-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Upcoming</p>
                <p className="text-3xl font-bold mt-1">{stats.upcoming_appointments}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Messages</p>
                <p className="text-3xl font-bold mt-1">{stats.unread_messages}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Past Visits</p>
                <p className="text-3xl font-bold mt-1">{stats.past_consultations}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0 shadow-lg shadow-rose-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm">My Practitioners</p>
                <p className="text-3xl font-bold mt-1">{stats.favorite_practitioners}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Upcoming Appointments</h2>
            <Link href="/dashboard/patient/appointments" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">No upcoming appointments</p>
                <Link href="/dashboard/patient/find-practitioner">
                  <Button variant="outline">Find a Practitioner</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Practitioner Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-teal-500/25">
                          {appointment.practitioner?.full_name?.split(' ').map(n => n[0]).join('') || 'DR'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800">{appointment.practitioner?.full_name}</h3>
                            {appointment.practitioner?.is_verified && (
                              <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0">✓ Verified</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{appointment.service?.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(appointment.appointment_date)}
                            </span>
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {appointment.start_time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}
                        {appointment.status === 'confirmed' && (
                          <Link href={`/consultation/${appointment.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                              <Video className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          </Link>
                        )}
                        <Link href={`/dashboard/patient/messages?appointment=${appointment.id}`}>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/patient/find-practitioner" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Find Practitioner</p>
                    <p className="text-xs text-slate-500">Search by specialty</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/dashboard/patient/messages" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Messages</p>
                    <p className="text-xs text-slate-500">{stats.unread_messages} unread</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/dashboard/patient/health-records" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Health Records</p>
                    <p className="text-xs text-slate-500">View your history</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                Health Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                Regular check-ups help catch potential health issues early. Consider scheduling a wellness visit with your primary care provider.
              </p>
              <Link href="/dashboard/patient/find-practitioner">
                <Button variant="link" className="text-emerald-600 p-0 mt-2 h-auto">
                  Schedule a wellness visit →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
