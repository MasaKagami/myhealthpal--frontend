import Link from "next/link";

export default function Landing(){
    return(
        <div className="text-white  h-full text-center flex flex-col items-center justify-center gap-4">
            <h1 className="text-7xl font-bold">Welcome!</h1>
            <p className="font-medium">Your vitual health assistance for both physical and mental health needs.</p>
            <div className="flex gap-2">
                <Link href="/assessment-user">
                    <div className="btn hover:bg-gray-500 bg-red-500 text-white text-xl font-semibold p-4 h-auto">Start Symptom Assessment</div>
                </Link>
                <Link href="/assessment-user">
                    <div className="btn hover:bg-gray-500 bg-blue-500 text-white text-xl font-semibold p-4 h-auto">Start Pal Chat</div>
                </Link>
            </div>
        </div>
    )
}