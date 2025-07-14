'use client';

import { useState } from 'react';
import emailjs from 'emailjs-com';

// Replace these with your actual IDs/keys
const SERVICE_ID = 'service_vq39t28';
const TEMPLATE_ID = 'template_cn2j1xs';
const USER_ID = 'Qv7kBjOI9KWh5Uw7G';
const COMPANY_EMAIL = 'sohni2012@gmail.com';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; isBot?: boolean }[]>([]);
  const [stage, setStage] = useState<'ask' | 'askContact' | 'done'>('ask');
  const [userChat, setUserChat] = useState('');
  const [loading, setLoading] = useState(false);

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
          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
              email: COMPANY_EMAIL, // send to yourself!
              message: emailBody,
              subject: "New website chat submission",
            },
            USER_ID
          );
          setLoading(false);
          setTimeout(() => {
            setMessages((msgs) => [
              ...msgs,
              { text: "Thank you! We'll get in touch soon.", isBot: true },
            ]);
            setStage('done');
          }, 500);
        } catch (err) {
          setLoading(false);
          setMessages((msgs) => [
            ...msgs,
            { text: "Sorry, failed to send feedback. Please try again later.", isBot: true },
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
