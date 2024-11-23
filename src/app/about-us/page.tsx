import Navbar from "@/components/navbar/navbar";
import Image from "next/image";

export default function AboutUs(){
    return(
        <>
            <div className="flex flex-col min-h-screen w-full max-w-[80%] m-auto">
                <Navbar />  
                <div className="flex flex-col justify-center items-center w-full h-full bg-pink-400">
                    <h1>About US</h1>
                    <div className="flex">
                        <div className="flex flex-col">
                            <h1>Masa Kagami</h1>
                            <p>5-th year Electrical Engineering Student @ McGill</p>
                        </div>
                        {/* <Image></Image> */}
                    </div>
                    <div className="flex">
                        <div className="flex flex-col">
                            <h1>Erik Cupsa</h1>
                            <p>4-th year Computer Engineering Student @ McGill</p>
                        </div>{/* <Image></Image> */}
                    </div>
                    <div className="flex">
                        <div className="flex flex-col">
                            <h1>Wasif Somji</h1>
                            <p>4-th year Computer Engineering Student @ McGill</p>
                        </div>{/* <Image></Image> */}
                    </div>
                    <div className="flex">
                        <div className="flex flex-col">
                            <h1>Yassine Mimet</h1>
                            <p>4-th year Computer Engineering Student @ McGill</p>
                        </div>{/* <Image></Image> */}
                    </div>
                </div>
            </div>
        </>
    )
}