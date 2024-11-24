import Footer from "@/components/footer/footer";
import Hotlines from "@/components/local-healthcare/hotlines/hotlines";
import LocalHealthcareServices from "@/components/local-healthcare/local-services/local-services";
import Navbar from "@/components/navbar/navbar";


export default function LocalHealthCareServicesPage() {

    return (
        <>
            <div className="flex flex-col justify-between gap-10 min-h-screen w-full max-w-[80%] m-auto mb-24">  
                <Navbar />
                <LocalHealthcareServices />
                <Hotlines />
            </div>
            <Footer />
        </>
    );
}