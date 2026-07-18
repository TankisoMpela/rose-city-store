import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <img src="/logo.png" alt="Rose City Beauty" className="w-40 h-auto mx-auto mb-6" />
        <p className="text-accent text-sm leading-loose">
          21 President Street, Bloemfontein, 9301<br />
          +27 51 123 4567
        </p>
      </div>
      <div className="bg-accent py-3">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-white text-xs uppercase tracking-wider">
          <Link href="/info/contact">Contact</Link>
          <Link href="/info/returns">Returns</Link>
          <Link href="/info/delivery">Delivery</Link>
          <Link href="/info/gift-cards">Gift cards</Link>
          <Link href="/info/manufacturers">Manufacturers</Link>
          <Link href="/info/privacy-policy">Privacy policy</Link>
        </div>
      </div>
      <div className="bg-deep-contrast text-white py-3">
        <p className="text-center text-sm font-light">© 2026 Rose City Beauty</p>
      </div>
    </footer>
  );
}
