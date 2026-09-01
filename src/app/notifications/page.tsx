'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import {
  Bell,
  CheckCircle2,
  Shield,
  DollarSign,
  AlertCircle,
  Calendar,
  Clock,
  Trash2,
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bot-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-bot-gold/15 flex items-center justify-center text-bot-gold">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-bot-white">Notifications</h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={markAllRead}
                className="px-3 py-1.5 rounded-lg bg-bot-elevated border border-bot-border text-xs text-bot-text-secondary hover:text-bot-white"
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="p-1.5 rounded-lg bg-bot-elevated border border-bot-border text-xs text-bot-text-secondary hover:text-bot-danger"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-bot-card/60 border-bot-border'
                    : 'bg-bot-card border-bot-gold/40 shadow-lg shadow-bot-gold/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bot-elevated border border-bot-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    {n.type === 'booking_confirmed' && <CheckCircle2 className="w-4 h-4 text-bot-success" />}
                    {n.type === 'bouncer_accepted' && <Shield className="w-4 h-4 text-bot-gold" />}
                    {n.type === 'booking_completed' && <Calendar className="w-4 h-4 text-bot-gold" />}
                    {n.type === 'payment_credited' && <DollarSign className="w-4 h-4 text-bot-success" />}
                    {n.type === 'new_request' && <Bell className="w-4 h-4 text-bot-warning" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-semibold ${n.read ? 'text-bot-white' : 'text-bot-gold'}`}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-bot-text-secondary whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-bot-text-secondary mt-1">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-16 rounded-2xl bg-bot-card border border-bot-border">
                <Bell className="w-10 h-10 text-bot-text-secondary mx-auto mb-3 opacity-30" />
                <p className="text-sm text-bot-text-secondary">All caught up! No unread notifications.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
