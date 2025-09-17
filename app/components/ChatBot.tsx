'use client';

import { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

// Read EmailJS config from public env vars (client-side)
// Note: EmailJS public key is intended to be public; service/template IDs are non-secret identifiers.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; isBot?: boolean }[]>([]);
  const [stage, setStage] = useState<'ask' | 'askContact' | 'done'>('ask');
  const [userChat, setUserChat] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize EmailJS once with public key (safe on client)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[ChatBot] Mounting. Env presence:', {
        hasServiceId: Boolean(SERVICE_ID),
        hasTemplateId: Boolean(TEMPLATE_ID),
        hasPublicKey: Boolean(USER_ID),
        hasCompanyEmail: Boolean(COMPANY_EMAIL),
      });
      // Ping server to log envs on server-side too (dev only)
      fetch('/api/debug/emailjs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'mount', stage }),
      }).catch((e) => console.warn('[ChatBot] Debug ping failed:', e));
    }
    if (USER_ID) {
      try {
        // Some versions require init; passing user ID to send also works, but init is explicit
        // @ts-ignore - types may vary between packages
        emailjs.init?.(USER_ID);
      } catch (e) {
        console.warn('EmailJS init warning:', e);
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('EmailJS public key is missing. Set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      console.info('EmailJS env present:', {
        hasServiceId: Boolean(SERVICE_ID),
        hasTemplateId: Boolean(TEMPLATE_ID),
        hasPublicKey: Boolean(USER_ID),
        hasCompanyEmail: Boolean(COMPANY_EMAIL),
      });
    }
  }, []);

  // Simple regex for email and phone (very basic)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const phoneRegex = /\b\d{6,}\b/; // At least 6 digits for phone

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((msgs) => [...msgs, { text: userMessage }]);
    setInput('');

    // 1st stage: Get user's message
    if (stage === 'ask') {
      setUserChat(userMessage);
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { text: "Please leave your email and phone number for further contact.", isBot: true },
        ]);
        setStage('askContact');
      }, 500);
    }

    // 2nd stage: Get email/phone, send to your inbox
    if (stage === 'askContact') {
      // Parse user input for email & phone
      const email = userMessage.match(emailRegex)?.[0] || '';
      const phone = userMessage.match(phoneRegex)?.[0] || '';

      if (email && phone) {
        setLoading(true);

        // Build one big message with all details
        const emailBody = `
New chat submission from your site:

Message: ${userChat}

User Email: ${email}
Phone: ${phone}
        `.trim();

        try {
          if (process.env.NODE_ENV !== 'production') {
            console.info('[ChatBot] Attempting send with params:', {
              SERVICE_ID,
              TEMPLATE_ID,
              USER_ID: USER_ID ? `${USER_ID.slice(0, 4)}...` : '',
              COMPANY_EMAIL,
              email,
              phone,
            });
            // Notify server for logging
            fetch('/api/debug/emailjs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ event: 'pre-send', userEmail: email, userPhone: phone, stage }),
            }).catch(() => {});
          }
          if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID || !COMPANY_EMAIL) {
            throw new Error('EmailJS environment variables are not set');
          }

          // Provide common param names to match typical EmailJS templates.
          // Your template can use any of these: to_email, from_email, user_email, user_phone, message, subject
          const templateParams = {
            to_email: COMPANY_EMAIL,
            from_email: email,
            user_email: email,
            user_phone: phone,
            message: emailBody,
            subject: 'New website chat submission',
          };

          const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            USER_ID
          );

          if ((result as any)?.status && (result as any)?.status !== 200) {
            throw new Error(`EmailJS responded with status ${(result as any)?.status}`);
          }
          setLoading(false);
          setTimeout(() => {
            setMessages((msgs) => [
              ...msgs,
              { text: "Thank you! We'll get in touch soon.", isBot: true },
            ]);
            setStage('done');
          }, 500);
        } catch (err: any) {
          setLoading(false);
          console.error('EmailJS send failed:', err);
          const status = err?.status ?? err?.response?.status;
          const is412 = status === 412 || /412/.test(String(err));
          if (process.env.NODE_ENV !== 'production') {
            try {
              await fetch('/api/debug/emailjs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'send-error', status, message: String(err) }),
              });
            } catch {}
          }
          setMessages((msgs) => [
            ...msgs,
            {
              text: is412
                ? 'Send blocked by EmailJS policy (domain/public key/service). Please try again later or email us directly.'
                : 'Sorry, failed to send. Please try again later or email us directly.',
              isBot: true,
            },
          ]);
        }
      } else {
        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            { text: "Please enter a valid email and phone number.", isBot: true },
          ]);
        }, 500);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-sm">
      {open ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-72 flex flex-col h-80">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-semibold">Chat</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="hover:text-red-500"
            >
              &times;
            </button>
          </div>
          <div className="flex-grow p-2 overflow-y-auto space-y-2">
            {messages.length === 0 && (
              <p className="text-gray-500">How can we help?</p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`self-end max-w-full ${msg.isBot ? "text-left" : "text-right"}`}>
                <div
                  className={`${
                    msg.isBot
                      ? "bg-gray-200 text-gray-800"
                      : "bg-emerald-500 text-white"
                  } p-2 rounded-md break-words`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center text-gray-400">Sending...</div>
            )}
          </div>
          {stage !== 'done' && (
            <form onSubmit={handleSend} className="p-2 border-t border-gray-200 dark:border-gray-700">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                value={input}
                placeholder={
                  stage === "ask"
                    ? "Type a message..."
                    : "Enter email & phone..."
                }
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </form>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="p-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 shadow-lg hover:scale-105 transition"
        >
          Chat
        </button>
      )}
    </div>
  );
}
