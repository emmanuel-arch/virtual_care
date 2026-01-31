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

export default function PatientRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    state: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      state: value,
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
          user_type: 'patient',
          state: formData.state,
          phone_number: formData.phone_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/login');
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
        backgroundImage: "url('/images/virtual_care.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.1)",
        }}
      ></div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full opacity-50 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
        ></div>
        <div
          className="absolute right-1/4 bottom-1/4 h-24 w-24 rounded-full opacity-40 animate-pulse"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            animationDelay: "1s",
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
        className="relative z-10 w-full max-w-md border-transparent shadow-2xl mt-16"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(40px) saturate(250%)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow:
            "0 32px 80px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(255, 255, 255, 0.2), inset 0 3px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
        }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Register as Patient</CardTitle>
          <CardDescription className="text-gray-700">
            Create an account to find medical practitioners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-teal-400 focus:bg-white/40 focus:ring-2 focus:ring-teal-400"
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
                className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-teal-400 focus:bg-white/40 focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-gray-900 font-medium">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-teal-400 focus:bg-white/40 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-900 font-medium">State *</Label>
              <Select value={formData.state} onValueChange={handleSelectChange}>
                <SelectTrigger className="border-white/40 bg-white/30 text-gray-900">
                  <SelectValue placeholder="Select your state" />
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-medium">Password *</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-teal-400 focus:bg-white/40 focus:ring-2 focus:ring-teal-400"
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
                className="border-white/40 bg-white/30 text-gray-900 placeholder:text-gray-500 focus:border-teal-400 focus:bg-white/40 focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-5 font-bold transition-all duration-300"
              style={{ 
                backgroundColor: "#0d9488", 
                color: "white",
                boxShadow: "0 4px 16px rgba(13, 148, 136, 0.4)",
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
