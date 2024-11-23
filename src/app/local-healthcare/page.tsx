import Image from "next/image";
import Link from "next/link";

export default function LocalHealthCareServices() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Local Healthcare Services</h1>
            
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Search for specific facilities (e.g., 'pediatric care', 'urgent care')" 
                    className="input input-bordered w-full"
                />
            </div>
            
            <div className="mb-8">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Map Integration Here</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Example Service Listing */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Clinic Name</h2>
                        <p>Address: 123 Main St, City, State</p>
                        <p>Operating Hours: 9:00 AM - 5:00 PM</p>
                        <p>Estimated Wait Time: 15 mins</p>
                        <div className="card-actions justify-end">
                            <Link href="#">
                                <a className="btn btn-primary">View Details</a>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Repeat the above block for more listings */}
            </div>
            
            {/* Telehealth Options */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Telehealth Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Example Telehealth Option */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Telehealth Platform</h2>
                            <p>Virtual consultations available 24/7</p>
                            <div className="card-actions justify-end">
                                <Link href="#">
                                    <a className="btn btn-primary">Visit Platform</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Repeat the above block for more telehealth options */}
                </div>
            </div>
        </div>
    );
}