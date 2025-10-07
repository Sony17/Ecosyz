'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '../../src/lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Company email configuration
const COMPANY_EMAIL = 'sohni2012@gmail.com';

function ContactForm() {
  const searchParams = useSearchParams();
  const enquiry = searchParams?.get('enquiry') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enquiryType: enquiry || 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!COMPANY_EMAIL) {
        throw new Error('Company email is not configured');
      }

      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      // Send email via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: COMPANY_EMAIL,
          subject: `New contact form submission - ${formData.enquiryType}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Enquiry Type:</strong> ${formData.enquiryType}</p>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
          `,
          text: `New Contact Form Submission\n\nEnquiry Type: ${formData.enquiryType}\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to send email');
      }

      if (!data?.success) {
        throw new Error('Email service returned an error');
      }

      toast.success('Thank you! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        enquiryType: 'general',
        message: ''
      });

      // Redirect to thank you page after successful submission
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);

    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0c0f10' }}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-emerald-400">Home</Link></li>
            <li>/</li>
            <li className="text-white">Contact</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Touch</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions or need support? We&apos;re here to help. Send us a message and we&apos;ll get back to you soon.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-300 mb-2">Inquiry Type</label>
                <select
                  id="enquiryType"
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="enterprise">Enterprise Sales</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg hover:shadow-lg hover:shadow-emerald-400/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Quick Contact Options */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-5">Quick Contact</h3>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-emerald-400/10 p-3 rounded-lg flex-shrink-0">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 truncate">sohni2012@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-purple-400/10 p-3 rounded-lg flex-shrink-0">
                    <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">Location</p>
                    <p className="text-gray-400">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
              <p className="text-gray-300">
                We typically respond to all inquiries within 24 hours during business days. For urgent technical issues, please include &ldquo;URGENT&rdquo; in your subject line.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}