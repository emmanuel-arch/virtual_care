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
  Clock,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  Paperclip,
  Smile,
  ImageIcon
} from 'lucide-react';
import { Conversation, Message } from '@/lib/api/types';

// Mock data
const MOCK_CONVERSATIONS: (Conversation & { 
  practitioner_name: string; 
  practitioner_specialty: string;
  practitioner_avatar: string;
  appointment_date?: string;
  unread_count: number;
  is_verified: boolean;
})[] = [
  {
    id: 'conv1',
    patient_id: 'p1',
    practitioner_id: 'pr1',
    appointment_id: 'a1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    practitioner_name: 'Dr. Sarah Johnson',
    practitioner_specialty: 'Internal Medicine',
    practitioner_avatar: 'SJ',
    appointment_date: '2024-01-20',
    unread_count: 2,
    is_verified: true,
  },
  {
    id: 'conv2',
    patient_id: 'p1',
    practitioner_id: 'pr2',
    appointment_id: 'a2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    practitioner_name: 'Dr. Michael Chen',
    practitioner_specialty: 'Dermatology',
    practitioner_avatar: 'MC',
    appointment_date: '2024-01-18',
    unread_count: 0,
    is_verified: true,
  },
  {
    id: 'conv3',
    patient_id: 'p1',
    practitioner_id: 'pr3',
    appointment_id: 'a3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    practitioner_name: 'Dr. Emily Williams',
    practitioner_specialty: 'Mental Health',
    practitioner_avatar: 'EW',
    unread_count: 0,
    is_verified: false,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  conv1: [
    {
      id: 'm1',
      conversation_id: 'conv1',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'Hello! I just wanted to follow up on our upcoming appointment. Do you have any specific concerns you\'d like to discuss?',
      is_read: true,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'm2',
      conversation_id: 'conv1',
      sender_id: 'p1',
      sender_type: 'patient',
      content: 'Hi Dr. Johnson! Yes, I\'ve been having some recurring headaches lately that I\'d like to discuss.',
      is_read: true,
      created_at: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: 'm3',
      conversation_id: 'conv1',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'I see. Can you tell me more about the frequency and intensity of these headaches? Have you noticed any triggers?',
      is_read: true,
      created_at: new Date(Date.now() - 3400000).toISOString(),
    },
    {
      id: 'm4',
      conversation_id: 'conv1',
      sender_id: 'p1',
      sender_type: 'patient',
      content: 'They happen about 2-3 times a week, usually in the afternoon. I think stress and screen time might be contributing factors.',
      is_read: true,
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'm5',
      conversation_id: 'conv1',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'Thank you for sharing that. We\'ll definitely discuss this in detail during our appointment. In the meantime, try to take regular breaks from screens.',
      is_read: false,
      created_at: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: 'm6',
      conversation_id: 'conv1',
      sender_id: 'pr1',
      sender_type: 'practitioner',
      content: 'Also, please keep a note of when the headaches occur and what you were doing before they started. This will help us identify patterns.',
      is_read: false,
      created_at: new Date(Date.now() - 600000).toISOString(),
    },
  ],
  conv2: [
    {
      id: 'm7',
      conversation_id: 'conv2',
      sender_id: 'pr2',
      sender_type: 'practitioner',
      content: 'Hi! Just a reminder to continue with the prescribed skincare routine for the next 2 weeks.',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'm8',
      conversation_id: 'conv2',
      sender_id: 'p1',
      sender_type: 'patient',
      content: 'Thank you, Dr. Chen! I\'ve been following the routine and already seeing some improvement.',
      is_read: true,
      created_at: new Date(Date.now() - 82800000).toISOString(),
    },
  ],
  conv3: [
    {
      id: 'm9',
      conversation_id: 'conv3',
      sender_id: 'pr3',
      sender_type: 'practitioner',
      content: 'Thank you for your consultation today. Remember, it\'s important to practice the breathing exercises we discussed.',
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
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
      sender_id: 'p1',
      sender_type: 'patient',
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
    return lastMsg.content.length > 40 ? lastMsg.content.substring(0, 40) + '...' : lastMsg.content;
  };

  const filteredConversations = conversations.filter(c =>
    c.practitioner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.practitioner_specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showConversationList = !isMobileView || !selectedConversation;
  const showChat = !isMobileView || selectedConversation;

  return (
    <div className="h-[calc(100vh-2rem)] flex">
      {/* Conversations List */}
      {showConversationList && (
        <div className={`${isMobileView ? 'w-full' : 'w-96'} border-r border-slate-200 bg-white flex flex-col`}>
          <div className="p-4 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-800 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-100">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id || null)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-teal-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {conversation.practitioner_avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-800 truncate">
                            {conversation.practitioner_name}
                          </span>
                          {conversation.is_verified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {conversation.updated_at ? formatDate(conversation.updated_at) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {conversation.practitioner_specialty}
                      </p>
                      <p className="text-sm text-slate-600 truncate mt-1">
                        {conversation.id ? getLastMessage(conversation.id) : ''}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
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
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getSelectedConversationData()?.practitioner_avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-slate-800">
                          {getSelectedConversationData()?.practitioner_name}
                        </h2>
                        {getSelectedConversationData()?.is_verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {getSelectedConversationData()?.practitioner_specialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-slate-600">
                      <Phone className="w-5 h-5" />
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
                  <div className="mt-3 bg-teal-50 rounded-lg p-3 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-teal-800">
                      Upcoming appointment: {new Date(getSelectedConversationData()!.appointment_date!).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                    <Badge className="ml-auto bg-teal-100 text-teal-700 hover:bg-teal-100">
                      View Details
                    </Badge>
                  </div>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.sender_type === 'patient';
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
                                ? 'bg-teal-500 text-white rounded-br-md' 
                                : 'bg-white text-slate-800 rounded-bl-md shadow-sm'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                              <span className="text-xs text-slate-400">{formatTime(message.created_at)}</span>
                              {isOwnMessage && (
                                message.is_read 
                                  ? <CheckCheck className="w-4 h-4 text-teal-500" />
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

              {/* Message Input */}
              <div className="bg-white border-t border-slate-100 p-4">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border-slate-200"
                  />
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-teal-500 hover:bg-teal-600"
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
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Your Messages</h3>
                <p className="text-slate-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
