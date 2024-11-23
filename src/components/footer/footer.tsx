export default function Footer() {
    return (
        <footer className="footer w-full bg-neutral text-neutral-content py-10">
            <div className="w-full max-w-[80%] m-auto grid grid-cols-2 gap-4">
                <nav className="">
                    <span className="footer-title block mb-2">Services</span>
                    <a className="link link-hover block">Local Healthcare Services</a>
                    <a className="link link-hover block">Emergency Hotlines</a>
                    <a className="link link-hover block">Mental Health Support</a>
                    <a className="link link-hover block">Fitness Programs</a>
                </nav>
                <nav>
                    <span className="footer-title block mb-2">Coders</span>
                    <a className="link link-hover block">About Us</a>
                </nav>
            </div>
        </footer>
    );
}
