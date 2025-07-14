'use client';

import { useState } from 'react';
import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_vq39t28';
const TEMPLATE_ID = 'template_cn2j1xs';
const USER_ID = 'Qv7kBjOI9KWh5Uw7G';
const COMPANY_EMAIL = 'sohni2012@gmail.com';

export default function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');
    setLoading(true);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          email: COMPANY_EMAIL,   // So it always sends to you
          message: `New feedback submission:\n\n${message}`,
          subject: "New feedback from Open Idea website",
        },
        USER_ID
      );
      setSubmitted(true);
      setMessage('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" aria-label="Send us feedback">
      <textarea
        className="w-full p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
        rows={5}
        value={message}
        placeholder="Share your thoughts..."
        onChange={(e) => setMessage(e.target.value)}
        required
        disabled={loading}
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow hover:scale-105 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
      {submitted && (
        <p className="mt-4 text-emerald-500">Thank you for your feedback!</p>
      )}
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </form>
  );
}
