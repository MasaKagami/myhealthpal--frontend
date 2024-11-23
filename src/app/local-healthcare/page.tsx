import Footer from "@/components/footer/footer";
import LocalHealthcareServices from "@/components/local-healthcare/local-services/local-services";
import Navbar from "@/components/navbar/navbar";


export default function LocalHealthCareServicesPage() {

    return (
        <>
            <div className="flex flex-col h-screen w-full max-w-[80%] m-auto">  
                <Navbar />
                <LocalHealthcareServices />
            </div>
            <Footer />
        </>
    );
}