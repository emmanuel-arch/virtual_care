'use client';

import React from "react";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Service } from '@/lib/api/types';

export default function SelectSpecialties() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedServices.length === 0) {
      setError('Please select at least one specialty');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/practitioners/specialties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_ids: selectedServices,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save specialties');
        return;
      }

      router.push('/register/practitioner/availability');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-medical-50 via-white to-health-50">
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            VirtualCare
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/register" className="text-slate-600 hover:text-medical-600">
              Back to get started
            </Link>
            <Link href="/login" className="text-slate-600 hover:text-medical-600">
              Login
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-2xl medical-card">
          <CardHeader>
            <CardTitle className="text-3xl">Select Your Specialties</CardTitle>
            <CardDescription>
              Choose the services and specialties you provide
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white/70 p-3 hover:bg-medical-50">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <Label htmlFor={service.id} className="cursor-pointer flex-1">
                    <div className="font-semibold">{service.name}</div>
                    {service.description && (
                      <div className="text-sm text-slate-600">{service.description}</div>
                    )}
                  </Label>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full btn-medical"
              disabled={loading}
            >
              {loading ? 'Saving Specialties...' : 'Continue to Availability'}
            </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
