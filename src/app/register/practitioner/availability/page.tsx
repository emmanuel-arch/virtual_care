'use client';

import React from "react";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function SetAvailability() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(
    DAYS.map((_, index) => ({
      day_of_week: index,
      start_time: '09:00',
      end_time: '17:00',
      is_available: index >= 1 && index <= 5, // Mon-Fri by default
    }))
  );

  const handleDayToggle = (dayIndex: number) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.day_of_week === dayIndex
          ? { ...slot, is_available: !slot.is_available }
          : slot
      )
    );
  };

  const handleTimeChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.day_of_week === dayIndex
          ? { ...slot, [field]: value }
          : slot
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const activeSlots = availability.filter((slot) => slot.is_available);
    if (activeSlots.length === 0) {
      setError('Please select at least one available day');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/practitioners/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activeSlots),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save availability');
        return;
      }

      router.push('/dashboard/practitioner');
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
            <CardTitle className="text-3xl">Set Your Availability</CardTitle>
            <CardDescription>
              Choose when you're available to see patients
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

            <div className="space-y-4">
              {availability.map((slot) => (
                <div key={slot.day_of_week} className="flex items-center space-x-4 rounded-lg border border-slate-200 bg-white/70 p-4">
                  <Checkbox
                    id={`day-${slot.day_of_week}`}
                    checked={slot.is_available}
                    onCheckedChange={() => handleDayToggle(slot.day_of_week)}
                  />
                  
                  <Label htmlFor={`day-${slot.day_of_week}`} className="flex-1 font-semibold cursor-pointer">
                    {DAYS[slot.day_of_week]}
                  </Label>

                  {slot.is_available && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={slot.start_time}
                        onChange={(e) =>
                          handleTimeChange(slot.day_of_week, 'start_time', e.target.value)
                        }
                        className="w-24"
                      />
                      <span className="text-slate-500">to</span>
                      <Input
                        type="time"
                        value={slot.end_time}
                        onChange={(e) =>
                          handleTimeChange(slot.day_of_week, 'end_time', e.target.value)
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full btn-medical"
              disabled={loading}
            >
              {loading ? 'Saving Availability...' : 'Complete Registration'}
            </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
