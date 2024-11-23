import Footer from "@/components/footer/footer";
import Hotlines from "@/components/local-healthcare/hotlines/hotlines";
import LocalHealthcareServices from "@/components/local-healthcare/local-services/local-services";
import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import Link from "next/link";

export default function LocalHealthCareServicesPage() {

    return (
        <>  
            <Navbar />
            <div className="container mx-auto p-4">
                <LocalHealthcareServices />
                <Hotlines />
            </div>
            <Footer />
        </>
    );
}