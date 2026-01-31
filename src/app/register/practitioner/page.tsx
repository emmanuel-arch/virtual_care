'use client';

import React from "react";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function PractitionerRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    license_number: '',
    license_state: '',
    bio: '',
    years_of_experience: '',
    education: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      license_state: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          user_type: 'practitioner',
          state: formData.license_state,
          phone_number: formData.phone_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Create practitioner profile
      const practitionerResponse = await fetch('/api/practitioners/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_number: formData.license_number,
          license_state: formData.license_state,
          bio: formData.bio,
          years_of_experience: parseInt(formData.years_of_experience) || 0,
          education: formData.education,
        }),
      });

      if (!practitionerResponse.ok) {
        const error = await practitionerResponse.json();
        setError(error.error || 'Failed to create practitioner profile');
        return;
      }

      router.push('/register/practitioner/specialties');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/virtual_health.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.15)",
        }}
      ></div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-10 top-1/3 h-40 w-40 rounded-full opacity-40 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
        ></div>
        <div
          className="absolute right-16 bottom-1/4 h-28 w-28 rounded-full opacity-35 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute right-1/3 top-20 h-20 w-20 rounded-full opacity-30 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            animationDelay: "2s",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link 
            href="/" 
            className="text-xl font-bold text-white drop-shadow-lg"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            VirtualCare
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link 
              href="/register" 
              className="text-white/90 hover:text-white transition-colors"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
            >
              Back to get started
            </Link>
            <Link 
              href="/login" 
              className="text-white/90 hover:text-white transition-colors"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <Card
        className="relative z-10 w-full max-w-2xl border-transparent shadow-2xl mt-16 mb-8"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(40px) saturate(250%)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow:
            "0 32px 80px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(255, 255, 255, 0.2), inset 0 3px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
        }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Register as Practitioner</CardTitle>
          <CardDescription className="text-gray-700">
            Create your account to start accepting patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-gray-900 font-medium">Full Name *</Label>
                  <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-900 font-medium">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-gray-900 font-medium">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">License Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="license_number" className="text-gray-900 font-medium">License Number *</Label>
                  <Input
                    id="license_number"
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license_state" className="text-gray-900 font-medium">License State *</Label>
                  <Select value={formData.license_state} onValueChange={handleSelectChange}>
                    <SelectTrigger className="border-white/40 bg-white/30 text-gray-900">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Professional Profile</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="years_of_experience" className="text-gray-900 font-medium">Years of Experience</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-gray-900 font-medium">Education</Label>
                  <Input
                    id="education"
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-900 font-medium">Professional Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/40 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-5 font-bold transition-all duration-300"
              style={{ 
                backgroundColor: "#8b5cf6", 
                color: "white",
                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.4)",
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
