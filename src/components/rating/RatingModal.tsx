'use client';

import { useState } from 'react';
import { Star, X, CheckCircle2, Shield } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ratings: {
    overall: number;
    professionalism: number;
    punctuality: number;
    behaviour: number;
    communication: number;
    comment: string;
  }) => void;
  bouncersCount?: number;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  bouncersCount = 2,
}: RatingModalProps) {
  const [overall, setOverall] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [behaviour, setBehaviour] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ overall, professionalism, punctuality, behaviour, communication, comment });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-bot-card border border-bot-border p-6 md:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-bot-elevated hover:bg-bot-border text-bot-text-secondary hover:text-bot-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 animate-bounce-in">
            <div className="w-16 h-16 rounded-full bg-bot-success/20 text-bot-success flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-bot-white mb-2">Thank you!</h3>
            <p className="text-sm text-bot-text-secondary">Your feedback helps maintain elite security standards.</p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-bot-gold/15 flex items-center justify-center text-bot-gold mx-auto mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-bot-white">Rate Your Experience</h2>
              <p className="text-xs text-bot-text-secondary mt-1">
                How was the service provided by your {bouncersCount} bouncer{bouncersCount > 1 ? 's' : ''}?
              </p>
            </div>

            {/* Overall Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverall(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= overall
                        ? 'fill-bot-gold text-bot-gold drop-shadow-[0_0_8px_rgba(212,168,67,0.5)]'
                        : 'text-bot-border'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Detailed Categories */}
            <div className="space-y-3 mb-6 bg-bot-elevated/50 p-4 rounded-2xl border border-bot-border">
              <CategoryRating label="Professionalism" value={professionalism} onChange={setProfessionalism} />
              <CategoryRating label="Punctuality & Arrival" value={punctuality} onChange={setPunctuality} />
              <CategoryRating label="Conduct & Demeanor" value={behaviour} onChange={setBehaviour} />
              <CategoryRating label="Communication" value={communication} onChange={setCommunication} />
            </div>

            {/* Comments Input */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-bot-text-secondary mb-1.5">
                Leave an optional review note
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any special feedback about your protection team..."
                className="w-full p-3 rounded-xl bg-bot-elevated border border-bot-border text-bot-white text-xs focus:border-bot-gold focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-gradient-gold text-bot-bg font-extrabold text-sm hover:shadow-lg hover:shadow-bot-gold/25 transition-all"
            >
              Submit Rating & Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-bot-text-secondary">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="p-0.5"
          >
            <Star
              className={`w-4 h-4 ${
                s <= value ? 'fill-bot-gold text-bot-gold' : 'text-bot-border'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
