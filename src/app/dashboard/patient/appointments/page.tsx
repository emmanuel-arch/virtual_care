'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Video,
  MapPin,
  Star,
  Search,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Appointment } from '@/lib/api/types';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // For demo, using mock data
        setAppointments([
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
          {
            id: '3',
            patient_id: 'p1',
            practitioner_id: 'pr1',
            appointment_date: '2026-01-25',
            start_time: '11:00',
            end_time: '11:30',
            status: 'completed',
            notes: 'Regular checkup. Blood pressure normal.',
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
        ]);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== 'cancelled' && apt.status !== 'completed' && new Date(apt.appointment_date) >= new Date()
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'completed' || new Date(apt.appointment_date) < new Date()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Confirmed</Badge>;
      case 'scheduled':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending Confirmation</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
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
      return { day: 'Today', full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { day: 'Tomorrow', full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
    }
    return { 
      day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const AppointmentCard = ({ appointment, isUpcoming = true }: { appointment: Appointment; isUpcoming?: boolean }) => {
    const dateInfo = formatDate(appointment.appointment_date);
    
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Date/Time Block */}
            <div className="flex items-center gap-4 lg:min-w-[180px]">
              <div className="text-center p-3 bg-teal-50 rounded-xl min-w-[80px]">
                <p className="text-xs text-teal-600 font-medium uppercase">{dateInfo.day.split(' ')[0]}</p>
                <p className="text-2xl font-bold text-teal-700">{new Date(appointment.appointment_date).getDate()}</p>
                <p className="text-xs text-teal-600">{new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short' })}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{appointment.start_time}</p>
                <p className="text-sm text-slate-500">{appointment.service?.duration_minutes} min</p>
              </div>
            </div>

            {/* Practitioner Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-teal-500/25 flex-shrink-0">
                {appointment.practitioner?.full_name?.split(' ').map(n => n[0]).join('') || 'DR'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800">{appointment.practitioner?.full_name}</h3>
                  {appointment.practitioner?.is_verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0">✓ Verified</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500">{appointment.practitioner?.education}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {appointment.practitioner?.license_state}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {appointment.practitioner?.rating?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Service & Status */}
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="text-slate-600">{appointment.service?.name}</Badge>
              {getStatusBadge(appointment.status)}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:ml-4">
              {isUpcoming && appointment.status === 'confirmed' && (
                <Link href={`/consultation/${appointment.id}`}>
                  <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                    <Video className="w-4 h-4 mr-2" />
                    Join Call
                  </Button>
                </Link>
              )}
              <Link href={`/dashboard/patient/messages?appointment=${appointment.id}`}>
                <Button variant="outline" size="icon">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </Link>
              {isUpcoming && (
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                  <XCircle className="w-4 h-4" />
                </Button>
              )}
              {!isUpcoming && (
                <Link href={`/booking/${appointment.practitioner_id}`}>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Book Again
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Notes for completed appointments */}
          {!isUpcoming && appointment.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Notes:</span> {appointment.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your upcoming and past appointments</p>
        </div>
        <Link href="/dashboard/patient/find-practitioner">
          <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25">
            <Search className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">No upcoming appointments</h3>
                <p className="text-slate-500 mb-4">Find a practitioner and book your next appointment</p>
                <Link href="/dashboard/patient/find-practitioner">
                  <Button className="bg-teal-600 hover:bg-teal-700">Find a Practitioner</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isUpcoming={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">No past appointments</h3>
                <p className="text-slate-500">Your completed appointments will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isUpcoming={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
