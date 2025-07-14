'use client';
import { useState } from 'react';
import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_vq39t28';
const TEMPLATE_ID = 'template_cn2j1xs';
const USER_ID = 'Qv7kBjOI9KWh5Uw7G';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

const handleSend = async (action: string) => {
    if (!email) return;
    setSending(true);
    setStatus('');
    // Combine everything into a single message string
    const fullMessage = `User Email: ${email}\nInterested in: ${action}`;
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          message: fullMessage,
        },
        USER_ID
      );
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
    setSending(false);
  };

  return (
    <div>                   
    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>

    <section className="py-20 bg-gradient-to-br from-[#162624] via-[#12362f] to-[#122324] text-white relative">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[220px] bg-gradient-radial from-emerald-400/15 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-300 bg-clip-text animate-glow">
            Be First to Join
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-teal-100/90 font-medium">
            Enter your email and choose what you want to join!
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex flex-col gap-5 max-w-xl mx-auto items-center"
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="w-full px-4 py-3 rounded-md bg-[#151c1a] border border-emerald-400/20 text-white focus:outline-none"
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
