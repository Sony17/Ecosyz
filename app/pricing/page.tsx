
'use client'

import Link from 'next/link'
import dynamicImport from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const dynamic = 'force-dynamic'

// Dynamically import PaymentComponent with SSR disabled
const PaymentComponent = dynamicImport(() => import('../components/PaymentComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full text-center px-4 py-3 rounded-md font-medium bg-gray-600 text-white cursor-not-allowed">
      Loading payment options...
    </div>
  )
})



function Tier({ title, price, description, features, isPopular }: {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) {
  return (
    <div className={`relative p-8 rounded-xl flex flex-col border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/20 ${
      isPopular 
        ? 'border-emerald-500 bg-emerald-500/10 shadow-xl shadow-emerald-400/20' 
        : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-white">{price}</span>
          {price !== 'Custom' && <span className="text-gray-400 ml-2 text-lg">/month</span>}
        </div>
      </div>
      <ul className="space-y-4 text-sm flex-1 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 items-start text-gray-300">
            <div className="bg-emerald-400/20 rounded-full p-1 mt-0.5">
              <svg className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="none">
                <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      {price === '₹0' ? (
        <Link 
          href="/auth?plan=free"
          className={`w-full text-center px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            isPopular
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 hover:shadow-xl hover:shadow-emerald-400/25'
              : 'bg-white text-gray-900 hover:bg-gray-100 hover:shadow-lg'
          }`}
        >
          Get Started
        </Link>
      ) : price === 'Custom' ? (
        <Link 
          href="/contact?enquiry=enterprise"
          className="w-full text-center px-6 py-4 rounded-lg font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 hover:shadow-xl hover:shadow-emerald-400/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Contact Sales
        </Link>
      ) : (
        <div className="space-y-3">
          <div className="text-center text-sm text-gray-400">
            Razorpay payment integration coming soon. Please contact sales for Plus plan.
          </div>
          <Link 
            href="/contact?enquiry=plus"
            className="w-full text-center px-6 py-4 rounded-lg font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 hover:shadow-xl hover:shadow-emerald-400/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Sales for Plus Plan
          </Link>
        </div>
      )}
    </div>
  );
}


export default function PricingPage() {
  const tiers = [
    {
      title: "Free",
      price: "₹0",
      description: "Perfect for individuals getting started with Open Idea",
      features: [
        "3 workspaces for personal use",
        "Basic AI search capabilities",
        "Access to public knowledge graph",
        "Standard community support",
        "1GB storage per workspace",
        "Core research tools"
      ],
      cta: "Get started"
    },
    {
      title: "Plus",
      price: "₹999",
      description: "Enhanced capabilities for power users and small teams",
      features: [
        "Everything in Free plan",
        "Unlimited workspaces",
        "Advanced AI research tools",
        "Full knowledge graph access",
        "Priority email support",
        "5GB storage per workspace",
        "API access (100K requests/month)",
        "Advanced collaboration features"
      ],
      cta: "Upgrade to Plus",
      ctaHref: "/auth?plan=plus",
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "Advanced features for organizations and large teams",
      features: [
        "Everything in Plus plan",
        "Custom workspace limits",
        "Dedicated success manager",
        "Custom AI model training",
        "Advanced security & compliance",
        "Unlimited storage",
        "Custom API limits",
        "SSO & team management",
        "White-label options"
      ],
      cta: "Contact sales",
      ctaHref: "/contact?enquiry=enterprise"
    }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0c0f10'}}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-emerald-400 text-sm font-medium">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get Access to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Open Idea</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your research needs. Start free and scale as you grow. 
            All plans include our core AI-powered research tools and knowledge graph.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {tiers.map((tier) => (
            <Tier key={tier.title} {...tier} />
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-xl bg-gray-900/50 backdrop-blur-sm p-8 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Secure Payment Methods</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-emerald-400/10 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none">
                    <path d="M21 5H3V19H21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-cyan-400/10 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none">
                    <path d="M19 5H5V19H19V5Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 9H19" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="font-medium">Net Banking</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="bg-purple-400/10 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-medium">International</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Have questions about pricing? <Link href="/contact" className="text-emerald-500 hover:text-emerald-400">Talk to us</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
