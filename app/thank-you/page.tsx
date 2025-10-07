import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#0c0f10'}}>
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">Thank You!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your message has been sent successfully!
            </p>
            <p className="text-gray-400 mb-8">
              We&apos;ve received your inquiry and will get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block w-full sm:w-auto px-8 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Back to Home
            </Link>
            <div className="block sm:inline-block sm:ml-4">
              <Link
                href="/contact"
                className="inline-block w-full sm:w-auto px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-colors"
              >
                Send Another Message
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Need immediate help? <Link href="/feedback" className="text-emerald-400 hover:text-emerald-300">Contact our support team</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}