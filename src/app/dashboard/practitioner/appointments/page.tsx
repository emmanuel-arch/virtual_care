'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  patient_name: string;
  patient_age: number;
  date: string;
  start_time: string;
  end_time: string;
  service: string;
  type: 'video' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  is_new_patient: boolean;
}

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patient_name: 'John Smith',
    patient_age: 45,
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '09:30',
    service: 'General Consultation',
    type: 'video',
    status: 'completed',
    is_new_patient: false,
  },
  {
    id: 'a2',
    patient_name: 'Maria Garcia',
    patient_age: 32,
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '10:30',
    service: 'Follow-up Visit',
    type: 'video',
    status: 'in-progress',
    is_new_patient: false,
  },
  {
    id: 'a3',
    patient_name: 'Robert Johnson',
    patient_age: 58,
    date: new Date().toISOString().split('T')[0],
    start_time: '11:00',
    end_time: '11:30',
    service: 'General Consultation',
    type: 'video',
    status: 'scheduled',
    notes: 'Patient requested to discuss new symptoms',
    is_new_patient: true,
  },
  {
    id: 'a4',
    patient_name: 'Emily Chen',
    patient_age: 28,
    date: new Date().toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '14:45',
    service: 'Wellness Checkup',
    type: 'video',
    status: 'scheduled',
    is_new_patient: false,
  },
  {
    id: 'a5',
    patient_name: 'David Wilson',
    patient_age: 52,
    date: new Date().toISOString().split('T')[0],
    start_time: '15:00',
    end_time: '15:30',
    service: 'Chronic Care Management',
    type: 'phone',
    status: 'scheduled',
    is_new_patient: false,
  },
  {
    id: 'a6',
    patient_name: 'Sarah Brown',
    patient_age: 41,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '09:30',
    end_time: '10:00',
    service: 'General Consultation',
    type: 'video',
    status: 'scheduled',
    is_new_patient: true,
  },
  {
    id: 'a7',
    patient_name: 'Michael Lee',
    patient_age: 35,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '11:00',
    end_time: '11:30',
    service: 'Follow-up Visit',
    type: 'video',
    status: 'scheduled',
    is_new_patient: false,
  },
  {
    id: 'a8',
    patient_name: 'Jennifer Davis',
    patient_age: 29,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '10:30',
    service: 'General Consultation',
    type: 'video',
    status: 'completed',
    is_new_patient: false,
  },
];

export default function PractitionerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getDateKey = (date: Date) => date.toISOString().split('T')[0];
  const todayKey = getDateKey(new Date());

  const getDayAppointments = (date: Date) => {
    const dateKey = getDateKey(date);
    return appointments.filter(a => a.date === dateKey);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-slate-100 text-slate-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'no-show': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const todayAppointments = getDayAppointments(selectedDate);
  const upcomingScheduled = todayAppointments.filter(a => a.status === 'scheduled').length;
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500">Manage your patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients..."
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{todayAppointments.length}</p>
                <p className="text-sm text-slate-500">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{upcomingScheduled}</p>
                <p className="text-sm text-slate-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{completedToday}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{todayAppointments.filter(a => a.is_new_patient).length}</p>
                <p className="text-sm text-slate-500">New Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Week View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Week View</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {getWeekDates().map((date) => {
              const dateKey = getDateKey(date);
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === getDateKey(selectedDate);
              const dayAppointments = getDayAppointments(date);
              
              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    isSelected 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                      : isToday 
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-lg font-bold">{date.getDate()}</p>
                  {dayAppointments.length > 0 && (
                    <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                      {dayAppointments.length} appt{dayAppointments.length > 1 ? 's' : ''}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardTitle>
              <p className="text-sm text-slate-500">{getDayAppointments(selectedDate).length} appointments</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getDayAppointments(selectedDate).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No appointments scheduled for this day</p>
              </div>
            ) : (
              getDayAppointments(selectedDate)
                .filter(a => filterStatus === 'all' || a.status === filterStatus)
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    {/* Time */}
                    <div className="w-20 text-center">
                      <p className="font-semibold text-slate-800">{appointment.start_time}</p>
                      <p className="text-xs text-slate-500">{appointment.end_time}</p>
                    </div>

                    {/* Status Indicator */}
                    <div className={`w-1 h-12 rounded-full ${
                      appointment.status === 'completed' ? 'bg-emerald-500' :
                      appointment.status === 'in-progress' ? 'bg-blue-500' :
                      appointment.status === 'cancelled' ? 'bg-red-500' :
                      'bg-slate-300'
                    }`} />

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-800">{appointment.patient_name}</h4>
                        {appointment.is_new_patient && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">New</Badge>
                        )}
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{appointment.patient_age} years old</span>
                        <span className="flex items-center gap-1">
                          {appointment.type === 'video' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                          {appointment.service}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-slate-600 mt-1 italic">"{appointment.notes}"</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {appointment.status === 'scheduled' && (
                        <Link href={`/consultation/${appointment.id}`}>
                          <Button className="bg-indigo-500 hover:bg-indigo-600">
                            <Video className="w-4 h-4 mr-2" />
                            Start Call
                          </Button>
                        </Link>
                      )}
                      {appointment.status === 'in-progress' && (
                        <Link href={`/consultation/${appointment.id}`}>
                          <Button className="bg-blue-500 hover:bg-blue-600">
                            <Video className="w-4 h-4 mr-2" />
                            Rejoin
                          </Button>
                        </Link>
                      )}
                      <Button variant="ghost" size="icon">
                        <User className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments
                  .sort((a, b) => new Date(a.date + ' ' + a.start_time).getTime() - new Date(b.date + ' ' + b.start_time).getTime())
                  .map((appointment) => (
                    <tr key={appointment.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm">
                            {appointment.patient_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{appointment.patient_name}</p>
                            <p className="text-xs text-slate-500">{appointment.patient_age}y</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-800">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-slate-500">{appointment.start_time} - {appointment.end_time}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{appointment.service}</td>
                      <td className="py-3 px-4">
                        {appointment.type === 'video' ? (
                          <Video className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Phone className="w-4 h-4 text-slate-500" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <User className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
