'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Calendar,
  ArrowLeft,
  Paperclip,
  FileText,
  Clock,
  User,
  Filter
} from 'lucide-react';
import { Conversation, Message } from '@/lib/api/types';

// Mock data for practitioner view
const MOCK_CONVERSATIONS: (Conversation & { 
  patient_name: string; 
  patient_age?: number;
  appointment_date?: string;
  appointment_type?: string;
  unread_count: number;
  last_visit?: string;
})[] = [
  {
    id: 'conv1',
    patient_id: 'p1',
    practitioner_id: 'pr1',
    appointment_id: 'a1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient_name: 'John Smith',
    patient_age: 45,
    appointment_date: '2024-01-20',
    appointment_type: 'General Consultation',
    unread_count: 1,
    last_visit: '2023-12-15',
  },
  {
    id: 'conv2',
    patient_id: 'p2',
    practitioner_id: 'pr1',
    appointment_id: 'a2',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    patient_name: 'Maria Garcia',
    patient_age: 32,
    appointment_date: '2024-01-22',
    appointment_type: 'Follow-up Visit',
    unread_count: 0,
    last_visit: '2024-01-05',
  },
  {
    id: 'conv3',
    patient_id: 'p3',
    practitioner_id: 'pr1',
    appointment_id: 'a3',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    patient_name: 'Robert Johnson',
    patient_age: 58,
    unread_count: 2,
    last_visit: '2023-11-20',
  },
  {
    id: 'conv4',
    patient_id: 'p4',
    practitioner_id: 'pr1',
    appointment_id: 'a4',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    patient_name: 'Emily Chen',
    patient_age: 28,
    appointment_date: '2024-01-25',
    appointment_type: 'Wellness Checkup',
    unread_count: 0,
    last_visit: '2023-10-10',
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  conv1: [
    {
      id: 'm1',
      conversation_id: 'conv1',
      sender_id: 'p1',
      sender_type: 'patient',
      content: 'Hi Dr. Johnson, I wanted to ask about my upcoming appointment. Should I fast before the consultation?',
      is_read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'm2',
      conversation_id: 'conv1',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'Hello John! No, fasting isn\'t necessary for this particular consultation. Just make sure to bring a list of any medications you\'re currently taking.',
      is_read: true,
      created_at: new Date(Date.now() - 7000000).toISOString(),
    },
    {
      id: 'm3',
      conversation_id: 'conv1',
      sender_id: 'p1',
      sender_type: 'patient',
      content: 'Perfect, thank you! I\'ll also bring my recent blood work results from last month.',
      is_read: false,
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  conv2: [
    {
      id: 'm4',
      conversation_id: 'conv2',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'Hi Maria, just following up on your treatment. How are you feeling after starting the new medication?',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'm5',
      conversation_id: 'conv2',
      sender_id: 'p2',
      sender_type: 'patient',
      content: 'Much better, thank you! The symptoms have reduced significantly over the past week.',
      is_read: true,
      created_at: new Date(Date.now() - 82800000).toISOString(),
    },
  ],
  conv3: [
    {
      id: 'm6',
      conversation_id: 'conv3',
      sender_id: 'p3',
      sender_type: 'patient',
      content: 'Doctor, I\'ve been experiencing some new symptoms I\'d like to discuss.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'm7',
      conversation_id: 'conv3',
      sender_id: 'p3',
      sender_type: 'patient',
      content: 'Should I schedule an appointment or is this something we can address here?',
      is_read: false,
      created_at: new Date(Date.now() - 3500000).toISOString(),
    },
  ],
  conv4: [
    {
      id: 'm8',
      conversation_id: 'conv4',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'Looking forward to your wellness checkup next week. Please complete the pre-visit questionnaire I\'ve sent to your email.',
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

export default function PractitionerMessagesPage() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(MOCK_MESSAGES[selectedConversation] || []);
      // Mark messages as read
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation ? { ...c, unread_count: 0 } : c
      ));
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      conversation_id: selectedConversation,
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getSelectedConversationData = () => {
    return conversations.find(c => c.id === selectedConversation);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getLastMessage = (conversationId: string) => {
    const msgs = MOCK_MESSAGES[conversationId];
    if (!msgs || msgs.length === 0) return '';
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg.content.length > 35 ? lastMsg.content.substring(0, 35) + '...' : lastMsg.content;
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.patient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterUnread || c.unread_count > 0;
    return matchesSearch && matchesFilter;
  });

  const showConversationList = !isMobileView || !selectedConversation;
  const showChat = !isMobileView || selectedConversation;

  return (
    <div className="h-[calc(100vh-2rem)] flex">
      {/* Conversations List */}
      {showConversationList && (
        <div className={`${isMobileView ? 'w-full' : 'w-96'} border-r border-slate-200 bg-white flex flex-col`}>
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-slate-800">Messages</h1>
              {totalUnread > 0 && (
                <Badge className="bg-indigo-500">{totalUnread} unread</Badge>
              )}
            </div>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients..."
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
              <Button 
                variant={filterUnread ? "default" : "outline"} 
                size="icon"
                onClick={() => setFilterUnread(!filterUnread)}
                className={filterUnread ? "bg-indigo-500 hover:bg-indigo-600" : ""}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-100">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id || null)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {conversation.patient_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 truncate">
                          {conversation.patient_name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {conversation.updated_at ? formatDate(conversation.updated_at) : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {conversation.patient_age && <span>{conversation.patient_age}y</span>}
                        {conversation.appointment_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(conversation.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 truncate mt-1">
                        {conversation.id ? getLastMessage(conversation.id) : ''}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Area */}
      {showChat && (
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isMobileView && (
                      <button 
                        onClick={() => setSelectedConversation(null)}
                        className="p-1 -ml-1 mr-1"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                    )}
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getSelectedConversationData()?.patient_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-800">
                        {getSelectedConversationData()?.patient_name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {getSelectedConversationData()?.patient_age && (
                          <span>{getSelectedConversationData()?.patient_age} years old</span>
                        )}
                        {getSelectedConversationData()?.last_visit && (
                          <span>• Last visit: {new Date(getSelectedConversationData()!.last_visit!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-600">
                      <User className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-600">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Appointment Context */}
                {getSelectedConversationData()?.appointment_date && (
                  <div className="mt-3 bg-indigo-50 rounded-lg p-3 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <div className="flex-1">
                      <span className="text-sm text-indigo-800">
                        {getSelectedConversationData()?.appointment_type}: {new Date(getSelectedConversationData()!.appointment_date!).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                      View Appointment
                    </Badge>
                  </div>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender_type === 'practitioner';
                    const showDate = index === 0 || 
                      formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="bg-white px-3 py-1 rounded-full text-xs text-slate-500 shadow-sm">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] ${isOwnMessage ? 'order-2' : ''}`}>
                            <div className={`rounded-2xl px-4 py-2 ${
                              isOwnMessage 
                                ? 'bg-indigo-500 text-white rounded-br-md' 
                                : 'bg-white text-slate-800 rounded-bl-md shadow-sm'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                              <span className="text-xs text-slate-400">{formatTime(message.created_at)}</span>
                              {isOwnMessage && (
                                message.is_read 
                                  ? <CheckCheck className="w-4 h-4 text-indigo-500" />
                                  : <Check className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Responses */}
              <div className="bg-white border-t border-slate-100 px-4 pt-2">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    'Please schedule a follow-up appointment',
                    'Your test results look normal',
                    'I\'ll review and get back to you shortly',
                  ].map((response) => (
                    <button
                      key={response}
                      onClick={() => setNewMessage(response)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 whitespace-nowrap transition-colors"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-slate-100 p-4">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <FileText className="w-5 h-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border-slate-200"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-indigo-500 hover:bg-indigo-600"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Patient Messages</h3>
                <p className="text-slate-500">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
