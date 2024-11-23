import Footer from "@/components/footer/footer";
import LocalHealthcareServices from "@/components/local-healthcare/local-services/local-services";
import Navbar from "@/components/navbar/navbar";


export default function LocalHealthCareServicesPage() {

    return (
        <>  
            <Navbar />
            <div className="container mx-auto p-4">
                <LocalHealthcareServices />
            </div>
            <Footer />
        </>
    );
}