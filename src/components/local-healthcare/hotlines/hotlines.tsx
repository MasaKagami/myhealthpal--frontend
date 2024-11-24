"use client";

export default function Hotlines() {
    const hotlines = [
        {
            name: "Emergency Services",
            number: "911",
            description: "For immediate assistance in case of emergency."
        },
        {
            name: "Mental Health Hotline",
            number: "1-800-273-8255",
            description: "For mental health support and crisis intervention."
        },
        {
            name: "Poison Control",
            number: "1-800-222-1222",
            description: "For poison-related emergencies and information."
        }
    ];

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-semibold text-myblue">Important Hotlines</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotlines.map((hotline, index) => (
                    <div key={index} className="card bg-mylightblue shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-myblue text-base">{hotline.name}</h2>
                            <p className="text-sm">Number: {hotline.number}</p>
                            <p className="text-sm">{hotline.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}