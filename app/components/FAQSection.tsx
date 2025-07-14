'use client';
import { useState } from 'react';

const faqs = [
  {
    question: 'What types of projects can launch on ECOSYZ?',
    answer:
      'Any open, collaborative, and impact-driven project! This includes software, data, research, hardware, sustainability initiatives, social good campaigns, and more. If your project is open for contributors and transparent in its goals, you belong here.',
  },
  {
    question: 'Why is everything open source?',
    answer:
      'Open source empowers community innovation, ensures transparency, and breaks down silos. By sharing code, data, and designs, ECOSYZ accelerates collective progress, trust, and impact across the globe.',
  },
  {
    question: 'How does the AI matching work?',
    answer:
      'Our platform uses AI to suggest the best projects and collaborators for you based on your skills, interests, and past contributions—making it easier to find your tribe and create meaningful change.',
  },
];

export default function FAQSection() {
const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
      <section className="py-20 bg-gradient-to-br from-[#142622] via-[#152624] to-[#1b2a26] text-white relative">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-300 bg-clip-text animate-glow">
              Frequently Asked Questions
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-teal-400/30 bg-[#182925]/80 shadow hover:shadow-[0_0_14px_#30ffb08f] transition"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() =>
                    setOpenIndex(openIndex === idx ? null : idx)
                  }
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="text-lg font-medium text-white">
                    {faq.question}
                  </span>
                  <i
                    className={`fas ${
                      openIndex === idx ? 'fa-minus' : 'fa-plus'
                    } text-cyan-400 transition-transform duration-200`}
                  ></i>
                </button>
                {/* Answer */}
                <div
                  id={`faq-answer-${idx}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === idx ? 'max-h-40 py-2 px-6' : 'max-h-0 px-6 py-0'
                  }`}
                  style={{
                    transitionProperty: 'max-height, padding',
                  }}
                >
                  {openIndex === idx && (
                    <p className="text-teal-100/90 text-base">{faq.answer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
