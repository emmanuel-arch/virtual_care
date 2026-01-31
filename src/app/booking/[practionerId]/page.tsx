'use client';

import React from "react";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Star,
  ShieldCheck,
  Video,
  CheckCircle2
} from 'lucide-react';
import { Practitioner, Service } from '@/lib/api/types';

const BOOKING_STEPS = [
  { id: 1, name: 'Select Service', description: 'Choose your consultation type' },
  { id: 2, name: 'Pick Date & Time', description: 'Select your preferred slot' },
  { id: 3, name: 'Confirm Details', description: 'Review and confirm' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const practitionerId = params.practionerId as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingComplete, setBookingComplete] = useState(false);

  const [formData, setFormData] = useState({
    service_id: '',
    service_name: '',
    service_duration: 30,
    appointment_date: '',
    start_time: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo, use mock data
        setPractitioner({
          id: practitionerId,
          user_id: 'u1',
          license_number: 'MD12345',
          license_state: 'California',
          is_verified: true,
          rating: 4.9,
          total_reviews: 127,
          full_name: 'Dr. Sarah Johnson',
          education: 'Internal Medicine',
          bio: 'Experienced physician with 15 years in primary care. Specializing in preventive medicine and chronic disease management.',
          years_of_experience: 15,
          created_at: '',
          updated_at: '',
        });
        
        setServices([
          { id: 's1', name: 'General Consultation', description: 'Standard medical consultation', category: 'Primary Care', duration_minutes: 30, price: 75, created_at: '' },
          { id: 's2', name: 'Follow-up Visit', description: 'Follow-up on previous consultation', category: 'Primary Care', duration_minutes: 15, price: 45, created_at: '' },
          { id: 's3', name: 'Wellness Checkup', description: 'Comprehensive health assessment', category: 'Preventive', duration_minutes: 45, price: 120, created_at: '' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };

    if (practitionerId) {
      fetchData();
    }
  }, [practitionerId]);

  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + durationMinutes);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleServiceSelect = (service: Service) => {
    setFormData(prev => ({
      ...prev,
      service_id: service.id,
      service_name: service.name,
      service_duration: service.duration_minutes,
    }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      appointment_date: date.toISOString().split('T')[0],
      start_time: '', // Reset time when date changes
    }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({
      ...prev,
      start_time: time,
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practitioner_id: practitionerId,
          service_id: formData.service_id,
          appointment_date: formData.appointment_date,
          start_time: formData.start_time,
          end_time: calculateEndTime(formData.start_time, formData.service_duration),
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to book appointment');
        return;
      }

      setBookingComplete(true);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.service_id !== '';
      case 2: return formData.appointment_date !== '' && formData.start_time !== '';
      case 3: return true;
      default: return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Booked!</h2>
            <p className="text-slate-500 mb-6">
              Your appointment with {practitioner?.full_name} has been scheduled.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span className="font-medium">
                  {new Date(formData.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-teal-600" />
                <span className="font-medium">{formData.start_time}</span>
              </div>
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-teal-600" />
                <span className="font-medium">{formData.service_name}</span>
              </div>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard/patient/appointments" className="block">
                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                  View My Appointments
                </Button>
              </Link>
              <Link href="/dashboard/patient" className="block">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/patient/find-practitioner" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ChevronLeft className="w-5 h-5" />
              Back to search
            </Link>
            <Link href="/" className="text-xl font-bold text-slate-800">VirtualCare</Link>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {BOOKING_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                    currentStep > step.id 
                      ? 'bg-emerald-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <p className={`text-sm mt-2 font-medium ${currentStep === step.id ? 'text-teal-600' : 'text-slate-500'}`}>
                    {step.name}
                  </p>
                </div>
                {index < BOOKING_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>Choose the type of consultation you need</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.service_id === service.id 
                          ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-500/10' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-800">{service.name}</h3>
                            <Badge variant="secondary">{service.duration_minutes} min</Badge>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-800">${service.price}</p>
                        </div>
                        {formData.service_id === service.id && (
                          <div className="ml-4 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Pick Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select a Date</CardTitle>
                    <CardDescription>Choose your preferred appointment date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {getUpcomingDates().map((date) => {
                        const isSelected = formData.appointment_date === date.toISOString().split('T')[0];
                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => handleDateSelect(date)}
                            className={`p-3 rounded-xl text-center transition-all duration-200 ${
                              isSelected 
                                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <p className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-lg font-bold">{date.getDate()}</p>
                            <p className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {formData.appointment_date && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select a Time</CardTitle>
                      <CardDescription>Available time slots for {new Date(formData.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {TIME_SLOTS.map((time) => {
                          const isSelected = formData.start_time === time;
                          return (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`py-3 px-2 rounded-xl text-center font-medium transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 3: Confirm Details */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Your Appointment</CardTitle>
                  <CardDescription>Review and add any notes for the practitioner</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Video className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{formData.service_name}</p>
                        <p className="text-sm text-slate-500">{formData.service_duration} minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {new Date(formData.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formData.start_time} - {calculateEndTime(formData.start_time, formData.service_duration)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Additional Notes (Optional)</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Describe your symptoms or reason for the visit..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </Button>
              )}
            </div>
          </div>

          {/* Practitioner Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-500/25">
                    {practitioner?.full_name?.split(' ').map(n => n[0]).join('') || 'DR'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{practitioner?.full_name}</h3>
                      {practitioner?.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-sm text-slate-500">{practitioner?.education}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {practitioner?.license_state}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {practitioner?.rating?.toFixed(1)} ({practitioner?.total_reviews} reviews)
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {practitioner?.years_of_experience} years experience
                  </div>
                </div>

                {practitioner?.bio && (
                  <p className="mt-4 text-sm text-slate-600 border-t pt-4">
                    {practitioner.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
