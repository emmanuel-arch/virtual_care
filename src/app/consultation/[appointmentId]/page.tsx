'use client';

import React from "react";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Phone, Video, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message, Appointment } from '@/lib/api/types';

export default function ConsultationPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        const data = await response.json();
        setAppointment(data.appointment);
      } catch (err) {
        console.error('Error fetching appointment:', err);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setCurrentUserId(data.user.id);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch and poll messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?appointment_id=${appointmentId}`);
        const data = await response.json();
        setMessages(data.messages || []);
        setLoading(false);

        // Mark unread messages as read
        data.messages?.forEach(async (msg: Message) => {
          if (!msg.is_read && msg.recipient_id === currentUserId) {
            await fetch('/api/messages/mark-read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message_id: msg.id }),
            });
          }
        });
      } catch (err) {
        console.error('Error fetching messages:', err);
        setLoading(false);
      }
    };

    if (appointmentId && currentUserId) {
      fetchMessages();

      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [appointmentId, currentUserId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !appointment) {
      return;
    }

    setSending(true);
    setError('');

    try {
      const recipientId =
        currentUserId === appointment.patient_id
          ? appointment.practitioner_id
          : appointment.patient_id;

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          recipient_id: recipientId,
          message_text: messageInput,
          message_type: 'text',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to send message');
        return;
      }

      setMessageInput('');

      // Refresh messages
      const messagesResponse = await fetch(
        `/api/messages?appointment_id=${appointmentId}`
      );
      const messagesData = await messagesResponse.json();
      setMessages(messagesData.messages || []);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleVideoCall = () => {
    // Placeholder for video call integration
    alert('Video consultation feature coming soon!');
  };

  const handleVoiceCall = () => {
    // Placeholder for voice call integration
    alert('Voice call feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">Appointment not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Consultation with Practitioner</CardTitle>
              <CardDescription>Appointment on {appointment.appointment_date}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceCall}
                className="gap-2 bg-transparent"
              >
                <Phone className="w-4 h-4" />
                Voice Call
              </Button>
              <Button
                onClick={handleVideoCall}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Video className="w-4 h-4" />
                Start Video
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 container mx-auto max-w-4xl w-full flex flex-col py-4 px-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 border rounded-lg bg-white mb-4 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === currentUserId
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{message.message_text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === currentUserId
                          ? 'text-blue-100'
                          : 'text-gray-600'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={sending || !messageInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
}
