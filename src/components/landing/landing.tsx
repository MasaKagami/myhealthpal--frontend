import Link from "next/link";

export default function Landing(){
    return(
        <div className="text-black  h-full text-center flex flex-col items-center justify-center gap-12">
            <div className="flex flex-col gap-4">
                <svg width="300" height="300" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="45.6462" width="47.7692" height="138" rx="23.8846" fill="#2260FF"/>
                    <rect x="138" y="45.646" width="46.7077" height="138" rx="23.3538" transform="rotate(90 138 45.646)" fill="#2260FF"/>
                    <path d="M42.9181 44.5075C55.2097 46.2592 63.1825 55.2229 68.7944 64.8629C71.9003 70.2893 74.5195 76.0707 78.5892 80.6973C81.6097 84.1502 85.148 87.0488 89.0328 89.6178C91.6262 91.3179 94.3727 92.8293 97.8147 93.3185C95.9333 93.5923 94.1005 93.498 92.3884 93.1788C87.2918 92.1286 82.9262 89.8425 78.9413 87.0848C74.9767 84.3141 71.7416 80.5667 69.2289 76.3863C66.7729 72.3308 64.705 67.9266 62.2968 63.9109C57.4839 55.8576 51.6425 48.7319 42.9181 44.5075Z" fill="white"/>
                    <path d="M72.1007 64.2936C72.1007 64.2936 57.5208 51.4635 64.3092 34.244C69.9049 20.05 77.8759 17.3227 77.4767 6.03955C83.2516 11.1407 93.7348 24.4133 88.8917 40.1236C84.1538 55.494 72.1007 64.2936 72.1007 64.2936Z" fill="white"/>
                    <path d="M77.4767 6.03955C84.4748 14.5774 84.5776 24.9928 81.1327 35.3419C78.0663 45.0675 72.6403 53.6101 71.3816 63.78C71.2313 62.8979 70.9368 61.7371 70.9166 60.8277C70.8438 59.2473 70.9651 57.6109 71.1891 56.0371C72.2868 48.5499 75.6089 41.3907 77.8702 34.3436C81.2834 24.1618 81.6617 15.8135 77.4767 6.03955Z" fill="#2260FF"/>
                    <path d="M67.5926 75.83C67.5926 75.83 52.8262 52.7869 36.0797 60.1279C22.2757 66.1791 20.0559 71.3004 5.55921 67.7444C10.8083 73.2352 22.5404 85.5249 40.3063 83.6619C56.1307 82.0018 67.5926 75.83 67.5926 75.83Z" fill="white"/>
                    <path d="M5.33315 67.9561C12.8334 72.1433 21.6984 72.9605 29.8826 70.9978C31.3204 70.7259 33.0762 70.1172 34.483 69.7138C45.3926 65.8694 59.2082 67.3543 67.5815 75.8445C58.103 71.3193 46.8381 70.7079 36.9385 73.8898C36.4603 74.0397 35.4812 74.3265 34.9965 74.4617C34.6166 74.5684 32.7638 75.0946 32.4227 75.1801C31.2162 75.3949 29.9303 75.6637 28.7175 75.8218C27.9843 75.8589 26.2086 76.0519 25.4914 76.0536C24.9568 76.0415 23.8659 76.0209 23.3299 76.0075C16.6958 75.6861 9.69593 73.1049 5.33315 67.9561Z" fill="#2260FF"/>
                </svg>
                <h1 className="font-semibold text-myblue text-4xl">myhealthpal</h1>
            </div>

            <div className="flex justify-center items-center flex-col gap-6">
                <p className="font-light text-xs max-w-[60%]">Your trusted virtual health assistant, designed to guide you through personalized symptom assessments, mental health support, and local healthcare services. Whether you&apos;re seeking advice for a healthier lifestyle or immediate support, we&apos;re here to empower you every step of the way.</p>
                <div className="flex flex-col gap-2 w-[40%]">
                    <Link href="/assessment-user" 
                        className="btn rounded-full hover:bg-gray-500 bg-myblue text-white text-lg font-medium py-2 w-full border-none"
                    >
                        <span className="hidden sm:block">Start</span> Assessment
                    </Link>
                    <Link 
                        href="/therapist"
                        className="btn rounded-full hover:bg-gray-500 hover:text-white bg-mylightblue text-myblue text-lg font-medium py-2 w-full border-none"
                    >
                        <span className="hidden sm:block">Start</span> Pal-Chat
                    </Link>

                </div>
            </div>
        </div>
    )
}