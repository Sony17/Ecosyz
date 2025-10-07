import Header from '../components/Header';
import Footer from '../components/Footer';
import FeedbackForm from '../components/FeedbackForm';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: '#0c0f10'}}>
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">We value your feedback</h1>
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
