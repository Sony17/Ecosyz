
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Container } from '@/app/components/ui/Container';

export const metadata = {
  title: 'Pricing • Open Idea',
  description: 'Flexible pricing for individuals, teams, and organizations.',
};



function Tier({ title, price, description, features, badge, cta, ctaHref }: {
  title: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <div className="p-8 rounded-xl glass-card glass-border flex flex-col text-white shadow-lg transition hover:-translate-y-1 bg-gradient-to-br from-[#0c2321]/80 via-[#121f22]/80 to-[#0a1016]/90">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold gradient-text">{title}</h3>
        {badge && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">{badge}</span>}
      </div>
      <p className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">{price}</p>
      <p className="opacity-90 mb-4 text-teal-100/90">{description}</p>
      <ul className="space-y-2 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1 text-emerald-400">✓</span>
            <span className="text-teal-100/90">{f}</span>
          </li>
        ))}
      </ul>
      {cta && ctaHref && (
        <div className="mt-6">
          <Link href={ctaHref} className="inline-block w-full text-center px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow-lg transition hover:scale-105 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-emerald-400/60">{cta}</Link>
        </div>
      )}
    </div>
  );
}


export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
          <header className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 uppercase" style={{background: 'linear-gradient(90deg, #4ef2a7 0%, #6ec6ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
              PLANS & ACCESS
            </h1>
            <p className="text-lg text-teal-100/90 font-medium max-w-2xl mx-auto">Choose your path to join the Open Idea community. Whether you’re exploring, building, or leading change, there’s a place for you.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <Tier
              title="Open Access"
              price="Free"
              description="For curious minds and contributors. Access open resources, join discussions, and start your journey."
              features={[
                'Unified search across open research, code, and data',
                'AI-powered quick summaries',
                'Public projects and collections',
                'Integrations with open platforms',
                'Community Q&A and feedback',
              ]}
              badge="Community"
              cta="Start Exploring"
              ctaHref="/openresources"
            />

            <Tier
              title="Pro"
              price="$12 / month"
              description="For active builders and teams. Unlock private workspaces, advanced AI, and deeper insights."
              features={[
                'Private and shared workspaces',
                'Advanced AI summarization and analytics',
                'Trend and impact reports',
                'Priority support',
                'Early access to new features',
              ]}
              badge="Pro"
              cta="Go Pro"
              ctaHref="/feedback"
            />

            <Tier
              title="Sponsored Challenges"
              price="Custom"
              description="For organizations and funders to host innovation challenges and crowdsource solutions."
              features={[
                'Host branded innovation challenges',
                'Custom challenge curation and moderation',
                'Community engagement and reporting',
                'Sponsor recognition and impact metrics',
                'Direct access to top contributors',
              ]}
              badge="Sponsor"
              cta="Sponsor a Challenge"
              ctaHref="/feedback"
            />

            <Tier
              title="Enterprise"
              price="Contact us"
              description="For large organizations needing private deployments, advanced governance, and custom integrations."
              features={[
                'Private cloud or on-premise deployment',
                'Admin dashboards and SSO',
                'Custom ingestion pipelines',
                'Compliance and security features',
                'Dedicated onboarding and SLAs',
              ]}
              badge="Enterprise"
              cta="Contact Sales"
              ctaHref="/feedback"
            />
          </section>

          <section className="mt-16 text-center">
            <p className="text-teal-100/80">Have a question or need a custom plan?</p>
            <Link href="/feedback" className="inline-block mt-4 px-6 py-2 rounded-lg border border-emerald-400 text-emerald-300 font-semibold transition hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">Contact Us</Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
