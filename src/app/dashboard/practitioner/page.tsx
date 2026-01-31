'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Users, 
  Star,
  Video,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { Appointment, PractitionerDashboardStats } from '@/lib/api/types';

export default function PractitionerDashboard() {
  const [stats, setStats] = useState<PractitionerDashboardStats>({
    today_appointments: 0,
    upcoming_appointments: 0,
    unread_messages: 0,
    total_patients: 0,
    average_rating: 0,
    total_reviews: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For demo, using mock data
        setStats({
          today_appointments: 4,
          upcoming_appointments: 12,
          unread_messages: 5,
          total_patients: 156,
          average_rating: 4.9,
          total_reviews: 127,
        });

        const today = new Date().toISOString().split('T')[0];
        
        setTodayAppointments([
          {
            id: '1',
            patient_id: 'p1',
            practitioner_id: 'pr1',
            appointment_date: today,
            start_time: '09:00',
            end_time: '09:30',
            status: 'completed',
            notes: 'Follow-up for blood pressure',
            created_at: '',
            updated_at: '',
            patient: {
              id: 'p1',
              email: 'john@example.com',
              full_name: 'John Smith',
              user_type: 'patient',
              state: 'California',
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
            patient_id: 'p2',
            practitioner_id: 'pr1',
            appointment_date: today,
            start_time: '10:30',
            end_time: '11:00',
            status: 'confirmed',
            notes: 'New patient consultation',
            created_at: '',
            updated_at: '',
            patient: {
              id: 'p2',
              email: 'sarah@example.com',
              full_name: 'Sarah Johnson',
              user_type: 'patient',
              state: 'California',
              created_at: '',
              updated_at: '',
            },
            service: {
              id: 's2',
              name: 'Initial Assessment',
              category: 'Primary Care',
              duration_minutes: 30,
              created_at: '',
            },
          },
          {
            id: '3',
            patient_id: 'p3',
            practitioner_id: 'pr1',
            appointment_date: today,
            start_time: '14:00',
            end_time: '14:30',
            status: 'scheduled',
            created_at: '',
            updated_at: '',
            patient: {
              id: 'p3',
              email: 'mike@example.com',
              full_name: 'Michael Chen',
              user_type: 'patient',
              state: 'California',
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
            id: '4',
            patient_id: 'p4',
            practitioner_id: 'pr1',
            appointment_date: today,
            start_time: '15:30',
            end_time: '16:00',
            status: 'scheduled',
            created_at: '',
            updated_at: '',
            patient: {
              id: 'p4',
              email: 'emily@example.com',
              full_name: 'Emily Davis',
              user_type: 'patient',
              state: 'California',
              created_at: '',
              updated_at: '',
            },
            service: {
              id: 's3',
              name: 'Mental Health Check',
              category: 'Mental Health',
              duration_minutes: 30,
              created_at: '',
            },
          },
        ]);

        setUpcomingAppointments([
          {
            id: '5',
            patient_id: 'p5',
            practitioner_id: 'pr1',
            appointment_date: '2026-02-02',
            start_time: '09:00',
            end_time: '09:30',
            status: 'confirmed',
            created_at: '',
            updated_at: '',
            patient: {
              id: 'p5',
              email: 'alex@example.com',
              full_name: 'Alex Wilson',
              user_type: 'patient',
              state: 'California',
              created_at: '',
              updated_at: '',
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
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isCurrentOrUpcoming = (startTime: string) => {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    const appointmentTime = new Date();
    appointmentTime.setHours(hours, minutes, 0);
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    return appointmentTime <= thirtyMinutesFromNow && appointmentTime >= now;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Good morning, Doctor!</h1>
          <p className="text-slate-500 mt-1">Here&apos;s your schedule for today</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/practitioner/availability">
            <Button variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Manage Availability
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-xs uppercase tracking-wider">Today</p>
                <p className="text-3xl font-bold mt-1">{stats.today_appointments}</p>
                <p className="text-indigo-200 text-xs mt-1">appointments</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs uppercase tracking-wider">Upcoming</p>
                <p className="text-3xl font-bold mt-1">{stats.upcoming_appointments}</p>
                <p className="text-blue-200 text-xs mt-1">this week</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg shadow-teal-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-xs uppercase tracking-wider">Messages</p>
                <p className="text-3xl font-bold mt-1">{stats.unread_messages}</p>
                <p className="text-teal-200 text-xs mt-1">unread</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs uppercase tracking-wider">Patients</p>
                <p className="text-3xl font-bold mt-1">{stats.total_patients}</p>
                <p className="text-emerald-200 text-xs mt-1">total</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs uppercase tracking-wider">Rating</p>
                <p className="text-3xl font-bold mt-1">{stats.average_rating}</p>
                <p className="text-amber-200 text-xs mt-1">{stats.total_reviews} reviews</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Today&apos;s Schedule</h2>
            <Link href="/dashboard/practitioner/appointments" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No appointments scheduled for today</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => {
                const isCurrent = isCurrentOrUpcoming(appointment.start_time);
                return (
                  <Card 
                    key={appointment.id} 
                    className={`transition-all duration-200 ${
                      isCurrent ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Time */}
                        <div className={`text-center min-w-[60px] ${isCurrent ? 'text-indigo-600' : 'text-slate-500'}`}>
                          <p className="text-lg font-bold">{appointment.start_time}</p>
                          <p className="text-xs">{appointment.end_time}</p>
                        </div>

                        {/* Divider */}
                        <div className={`w-1 h-14 rounded-full ${
                          appointment.status === 'completed' ? 'bg-emerald-400' :
                          isCurrent ? 'bg-indigo-500' : 'bg-slate-200'
                        }`} />

                        {/* Patient Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800 truncate">{appointment.patient?.full_name}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <p className="text-sm text-slate-500">{appointment.service?.name}</p>
                          {appointment.notes && (
                            <p className="text-xs text-slate-400 mt-1 truncate">{appointment.notes}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {appointment.status === 'confirmed' && (
                            <Link href={`/consultation/${appointment.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                                <Video className="w-4 h-4 mr-1" />
                                {isCurrent ? 'Join Now' : 'Start'}
                              </Button>
                            </Link>
                          )}
                          {appointment.status === 'scheduled' && (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                          )}
                          <Link href={`/dashboard/practitioner/messages?patient=${appointment.patient_id}`}>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
              <Link href="/dashboard/practitioner/appointments" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">All Appointments</p>
                    <p className="text-xs text-slate-500">View & manage</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/dashboard/practitioner/messages" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Messages</p>
                    <p className="text-xs text-slate-500">{stats.unread_messages} unread</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>

              <Link href="/dashboard/practitioner/patients" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">My Patients</p>
                    <p className="text-xs text-slate-500">{stats.total_patients} total</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming This Week */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming</CardTitle>
              <Badge variant="secondary">{upcomingAppointments.length} this week</Badge>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No upcoming appointments</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 text-xs font-semibold">
                        {new Date(apt.appointment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{apt.patient?.full_name}</p>
                        <p className="text-xs text-slate-500">{apt.start_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
