import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-[#f7f9fa] shadow-md border-b border-[#b7c7c9] px-[173px] py-4">
            <div className="max-w-7xl flex items-center justify-between" style={{ minHeight: '89px' }}>
                {/* Logo Only */}
                <aside className="flex items-center gap-2 font-heading">
                    <Link href="/">
                        <img
                            src="/logo.webp"
                            alt="logo"
                            width={200}
                            height={89}
                            style={{ color: 'transparent' }}
                        />
                    </Link>
                </aside>

                {/* Nav Links */}
                <nav className="hidden md:flex gap-2">
                    <Link href="/services" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] font-[Noto_Sans] text-[18px] px-[12px] py-[8px]" style={{ fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' }}>Services</Link>
                    <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] font-[Noto_Sans] text-[18px] px-[12px] py-[8px]" style={{ fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' }}>About</Link>
                    <Link href="/testimonials" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] font-[Noto_Sans] text-[18px] px-[12px] py-[8px]" style={{ fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' }}>Testimonials</Link>
                    <Link href="/faq" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] font-[Noto_Sans] text-[18px] px-[12px] py-[8px]" style={{ fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' }}>Rates & FAQs</Link>
                    <Link href="/areas" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] font-[Noto_Sans] text-[18px] px-[12px] py-[8px]" style={{ fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' }}>Areas Served</Link>
                    <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent text-[#1E4145] font-[Noto_Sans] text-[18px] px-[12px] py-[8px]" style={{ fontWeight: 400, fontFamily: 'Noto Sans, sans-serif' }}>Contact</Link>
                </nav>

                {/* CTA Button */}
                <div className="hidden md:flex">
                    <Link
                        href="/get-started"
                        className="items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E4145]/50 bg-white text-[#1E4145] text-[18px] font-[Noto_Sans] px-[24px] h-[50px] flex shadow-sm border border-[#1E4145]"
                        style={{ fontFamily: 'Noto Sans, sans-serif' }}
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                            <path d="M20 3v4"></path>
                            <path d="M22 5h-4"></path>
                            <path d="M4 17v2"></path>
                            <path d="M5 18H3"></path>
                        </svg>
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
} 