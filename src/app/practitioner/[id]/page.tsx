'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  GraduationCap,
  Award,
  Video,
  MessageSquare,
  ChevronLeft,
  Check,
  Users,
  Heart,
  Languages
} from 'lucide-react';
import { Practitioner, Service } from '@/lib/api/types';

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock data for demonstration
const MOCK_PRACTITIONER: Practitioner & {
  languages: string[];
  services: Service[];
  reviews: Review[];
  weekly_availability: { day: string; slots: string[] }[];
} = {
  id: 'pr1',
  user_id: 'u1',
  license_number: 'MD12345',
  license_state: 'California',
  is_verified: true,
  rating: 4.9,
  total_reviews: 127,
  full_name: 'Dr. Sarah Johnson',
  education: 'Internal Medicine',
  bio: 'I am a board-certified Internal Medicine physician with over 15 years of experience in providing comprehensive primary care. My approach focuses on preventive medicine, chronic disease management, and building long-lasting patient relationships. I believe in treating the whole person, not just symptoms, and empowering patients to take charge of their health.',
  years_of_experience: 15,
  created_at: '',
  updated_at: '',
  languages: ['English', 'Spanish'],
  services: [
    { id: 's1', name: 'General Consultation', description: 'Comprehensive medical consultation for general health concerns', category: 'Primary Care', duration_minutes: 30, price: 75, created_at: '' },
    { id: 's2', name: 'Follow-up Visit', description: 'Follow-up on previous consultation or treatment', category: 'Primary Care', duration_minutes: 15, price: 45, created_at: '' },
    { id: 's3', name: 'Wellness Checkup', description: 'Complete health assessment and preventive care consultation', category: 'Preventive', duration_minutes: 45, price: 120, created_at: '' },
    { id: 's4', name: 'Chronic Care Management', description: 'Ongoing management for chronic conditions', category: 'Chronic Care', duration_minutes: 30, price: 85, created_at: '' },
  ],
  reviews: [
    { id: 'r1', patient_name: 'John D.', rating: 5, comment: 'Dr. Johnson is incredibly thorough and caring. She took the time to explain everything and made sure I understood my treatment plan.', date: '2024-01-10' },
    { id: 'r2', patient_name: 'Maria S.', rating: 5, comment: 'Excellent doctor! Very professional and knowledgeable. The video consultation was smooth and efficient.', date: '2024-01-05' },
    { id: 'r3', patient_name: 'Robert K.', rating: 4, comment: 'Great experience overall. Dr. Johnson is very attentive and provides clear guidance.', date: '2023-12-28' },
    { id: 'r4', patient_name: 'Emily T.', rating: 5, comment: 'I\'ve been seeing Dr. Johnson for years and she\'s the best. Highly recommend!', date: '2023-12-15' },
  ],
  weekly_availability: [
    { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
    { day: 'Tuesday', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'] },
    { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'] },
    { day: 'Thursday', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM', '10:00 AM', '11:00 AM'] },
  ],
};

export default function PractitionerDetail() {
  const params = useParams();
  const router = useRouter();
  const practitionerId = params.id as string;
  const [practitioner, setPractitioner] = useState<typeof MOCK_PRACTITIONER | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo, use mock data. In production, fetch from API
    setTimeout(() => {
      setPractitioner(MOCK_PRACTITIONER);
      setLoading(false);
    }, 300);
  }, [practitionerId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-slate-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-8 pb-6 text-center">
            <p className="text-slate-600">Practitioner not found</p>
            <Link href="/dashboard/patient/find-practitioner">
              <Button className="mt-4">Back to Search</Button>
            </Link>
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
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ChevronLeft className="w-5 h-5" />
              Back to search
            </button>
            <Link href="/" className="text-xl font-bold text-slate-800">VirtualCare</Link>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-32"></div>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                  {practitioner.full_name?.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-800">{practitioner.full_name}</h1>
                  {practitioner.is_verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 mb-3">{practitioner.education}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {practitioner.license_state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {practitioner.years_of_experience} years experience
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {practitioner.total_reviews} patients
                  </div>
                </div>
              </div>

              {/* Rating & CTA */}
              <div className="flex flex-col items-end gap-3 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(practitioner.rating || 0)}</div>
                  <span className="font-bold text-slate-800">{practitioner.rating?.toFixed(1)}</span>
                  <span className="text-slate-500">({practitioner.total_reviews} reviews)</span>
                </div>
                <Link href={`/booking/${practitioner.id}`}>
                  <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-white border border-slate-200 p-1">
                <TabsTrigger value="about" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">About</TabsTrigger>
                <TabsTrigger value="services" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">Services</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">Reviews</TabsTrigger>
                <TabsTrigger value="availability" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About {practitioner.full_name?.split(' ')[1]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600 leading-relaxed">{practitioner.bio}</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Education</p>
                          <p className="text-sm text-slate-500">{practitioner.education}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">License</p>
                          <p className="text-sm text-slate-500">{practitioner.license_number}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Languages className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Languages</p>
                          <p className="text-sm text-slate-500">{practitioner.languages?.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Consultation</p>
                          <p className="text-sm text-slate-500">Video calls available</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Services Offered</CardTitle>
                    <CardDescription>Choose a service when booking your appointment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {practitioner.services?.map((service) => (
                      <div key={service.id} className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-800">{service.name}</h4>
                              <Badge variant="secondary">{service.duration_minutes} min</Badge>
                            </div>
                            <p className="text-sm text-slate-500">{service.description}</p>
                          </div>
                          <p className="text-lg font-bold text-slate-800">${service.price}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Patient Reviews</CardTitle>
                    <CardDescription>
                      {practitioner.rating?.toFixed(1)} out of 5 based on {practitioner.total_reviews} reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {practitioner.reviews?.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                              {review.patient_name[0]}
                            </div>
                            <span className="font-medium text-slate-800">{review.patient_name}</span>
                          </div>
                          <span className="text-sm text-slate-400">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex mb-2">{renderStars(review.rating)}</div>
                        <p className="text-slate-600">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Availability</CardTitle>
                    <CardDescription>Typical available time slots</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {practitioner.weekly_availability?.map((day) => (
                      <div key={day.day} className="flex items-start gap-4">
                        <div className="w-24 font-medium text-slate-700">{day.day}</div>
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot) => (
                            <span key={slot} className="px-3 py-1 bg-slate-100 rounded-lg text-sm text-slate-600">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/booking/${practitioner.id}`} className="block">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Why Choose */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Choose {practitioner.full_name?.split(' ')[1]}?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: ShieldCheck, text: 'Verified credentials and license' },
                  { icon: Star, text: 'Highly rated by patients' },
                  { icon: Clock, text: 'Punctual and responsive' },
                  { icon: Video, text: 'Excellent video consultations' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-600">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Insurance & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Accepts most major insurance plans
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Self-pay options available
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Payment due at time of service
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
