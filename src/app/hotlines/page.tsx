import Footer from "@/components/footer/footer";
import Hotlines from "@/components/local-healthcare/hotlines/hotlines";
import Navbar from "@/components/navbar/navbar";

export default function LocalHealthCareServicesPage() {

    return (
        <>  
            <Navbar />
            <div className="container mx-auto p-4">
                <Hotlines />
            </div>
            <Footer />
        </>
    );
}