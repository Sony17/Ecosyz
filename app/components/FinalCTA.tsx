'use client';
import { useState } from 'react';
import emailjs from 'emailjs-com';
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (action: string) => {
    if (!email) return;
    setSending(true);
    setStatus('');
    const fullMessage = `User Email: ${email}\nInterested in: ${action}`;
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[FinalCTA] sending', { SERVICE_ID, TEMPLATE_ID, hasUserId: Boolean(USER_ID), company: COMPANY_EMAIL });
      }
      if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) throw new Error('EmailJS env not configured');
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { message: fullMessage, to_email: COMPANY_EMAIL, from_email: email, subject: 'CTA submission' },
        USER_ID
      );
      setStatus('success');
      setEmail('');
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('[FinalCTA] send failed', err);
      setStatus('error');
    }
    setSending(false);
  };

  return (
    <div>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
      <section className="pt-8 pb-20 bg-gradient-to-br from-[#162624] via-[#12362f] to-[#122324] text-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[220px] bg-gradient-radial from-emerald-400/15 to-transparent blur-2xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-2 tracking-tight text-center uppercase">
              Be First to Join
            </h2>
            <p className="mt-2 max-w-2xl mx-auto text-lg sm:text-xl text-teal-100/90 font-medium">
              Enter your email and choose what you want to join!
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex flex-col gap-5 max-w-xl mx-auto items-center"
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-md glass glass-border text-white focus:outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={sending}
              />
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  type="button"
                  onClick={() => handleSend('Waitlist')}
                  className="w-full sm:w-auto px-8 py-3 rounded-md bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow-lg transition hover:scale-105"
                  disabled={sending || !email}
                >
                  {sending ? 'Submitting...' : 'Join the waitlist'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSend('Newsletter')}
                  className="w-full sm:w-auto px-8 py-3 rounded-md bg-cyan-400 text-gray-900 font-semibold shadow-lg transition hover:scale-105"
                  disabled={sending || !email}
                >
                  {sending ? 'Submitting...' : 'Subscribe to newsletter'}
                </button>
              </div>
              {status === 'success' && (
                <div className="text-emerald-400 font-semibold mt-2">
                  Thank you! We’ll get in touch soon.
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-400 font-semibold mt-2">
                  Something went wrong. Please try again!
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
