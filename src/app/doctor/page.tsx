import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import DoctorChat from "@/components/doctor/doctor";

export default function AIDoctorPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-primary">
            AI Doctor
          </h1>
          <p className="text-center text-lg text-gray-600 mb-8">
            Describe your symptoms below, and our AI Doctor will provide you with guidance.
          </p>
          <DoctorChat />
        </div>
      </div>
      <Footer />
    </>
  );
}
