import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";
import { FeedbackPageHeader } from "./FeedbackPageHeader";

export default function FeedbackPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <FeedbackPageHeader />
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
