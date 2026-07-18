import { notFound } from 'next/navigation';
import Link from 'next/link';

interface InfoPageContent {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

const INFO_PAGES: Record<string, InfoPageContent> = {
  contact: {
    title: 'Contact Us',
    subtitle: 'Get in touch with the Rose City Beauty team in Bloemfontein.',
    content: (
      <div className="space-y-6 text-sm text-gray-600 font-light leading-relaxed">
        <p>
          We would love to hear from you. Whether you have a question about our skincare range, need help choosing a makeup product, or want to inquire about your order, our dedicated beauty consultants are here to assist.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-2">Our Store</h3>
            <p>21 President Street</p>
            <p>Bloemfontein, 9301</p>
            <p>South Africa</p>
            <p className="mt-4"><strong>Phone:</strong> +27 51 123 4567</p>
            <p><strong>Email:</strong> support@rosecitybeauty.co.za</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-2">Store Hours</h3>
            <p><strong>Monday – Friday:</strong> 09:00 – 17:00</p>
            <p><strong>Saturday:</strong> 09:00 – 13:00</p>
            <p><strong>Sunday & Public Holidays:</strong> Closed</p>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-3">Send Us a Message</h3>
          <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input type="text" placeholder="Your Name" required className="w-full px-3 py-2 border border-accent/20 rounded-none text-xs focus:outline-none focus:border-accent" />
            </div>
            <div>
              <input type="email" placeholder="Your Email Address" required className="w-full px-3 py-2 border border-accent/20 rounded-none text-xs focus:outline-none focus:border-accent" />
            </div>
            <div>
              <textarea placeholder="How can we help you?" rows={4} required className="w-full px-3 py-2 border border-accent/20 rounded-none text-xs focus:outline-none focus:border-accent"></textarea>
            </div>
            <button type="submit" className="py-2.5 px-6 bg-accent text-white uppercase tracking-wider font-semibold text-[10px] hover:bg-deep-contrast transition-all duration-200">
              Send Message
            </button>
          </form>
        </div>
      </div>
    ),
  },
  returns: {
    title: 'Returns & Exchanges',
    subtitle: 'Our 14-day hassle-free return and exchange policy.',
    content: (
      <div className="space-y-6 text-sm text-gray-600 font-light leading-relaxed">
        <p>
          At Rose City Beauty, we want you to love your purchase. If you are not completely satisfied with your skincare or makeup item, you can return or exchange it within <strong>14 days</strong> of purchase.
        </p>
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs pt-2">Return Conditions</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Items must be returned in their original packaging, unopened, and in a sellable condition due to hygiene regulations.</li>
          <li>We cannot accept returns on products that have been used, swatched, or opened unless they are found to be defective or caused an allergic reaction (medical certificate may be requested).</li>
          <li>Sale items and digital gift vouchers are non-refundable.</li>
        </ul>
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs pt-2">How to Return</h3>
        <p>
          Bring the product along with your order number/receipt to our store in Bloemfontein, or email returns@rosecitybeauty.co.za to arrange a courier collection (courier return fees apply). Once checked, refunds are processed back to your original payment method within 5–7 business days.
        </p>
      </div>
    ),
  },
  delivery: {
    title: 'Delivery & Shipping',
    subtitle: 'Reliable door-to-door courier services across South Africa.',
    content: (
      <div className="space-y-6 text-sm text-gray-600 font-light leading-relaxed">
        <p>
          We offer fast, reliable shipping to all cities and towns in South Africa. All orders are packed with care in protective boxes to ensure your cosmetics arrive in perfect condition.
        </p>
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs pt-2">Rates & Times</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-100">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-2.5 px-3 font-semibold text-gray-700">Location</th>
                <th className="py-2.5 px-3 font-semibold text-gray-700">Est. Time</th>
                <th className="py-2.5 px-3 font-semibold text-gray-700">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3 font-medium">Bloemfontein Local</td>
                <td className="py-2.5 px-3">Same Day / 1 Day</td>
                <td className="py-2.5 px-3">R45 (Free over R300)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3 font-medium">Major SA Cities (JHB, CPT, DBN)</td>
                <td className="py-2.5 px-3">2 – 3 Days</td>
                <td className="py-2.5 px-3">R79 (Free over R500)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Outlying / Rural Areas</td>
                <td className="py-2.5 px-3">3 – 5 Days</td>
                <td className="py-2.5 px-3">R99 (Free over R750)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">
          * Note: If Cash on Delivery is selected, an additional R49.54 service charge is applied to cover the secure handling fee.
        </p>
      </div>
    ),
  },
  'gift-cards': {
    title: 'Digital Gift Cards',
    subtitle: 'Give the gift of premium beauty and self-care.',
    content: (
      <div className="space-y-6 text-sm text-gray-600 font-light leading-relaxed">
        <p>
          Unsure about the perfect shade or skincare match? A Rose City Beauty gift card lets them choose exactly what their skin needs.
        </p>
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs pt-2">Gift Card Details</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Available in values from R100 to R2000.</li>
          <li>Delivered instantly via email with instructions on how to redeem them at checkout.</li>
          <li>No service fees and valid for 3 full years from the date of purchase.</li>
        </ul>
        <p>
          To purchase a gift card, visit our store in Bloemfontein or contact our order desk. Balance checks can be done directly by contacting our support team.
        </p>
      </div>
    ),
  },
  manufacturers: {
    title: 'Our Brands',
    subtitle: 'Premium cosmetic and skincare brands curated for your rituals.',
    content: (
      <div className="space-y-6 text-sm text-gray-600 font-light leading-relaxed">
        <p>
          We pride ourselves on sourcing the highest quality ingredients. We partner with ethical manufacturers globally to bring you skincare and makeup that is effective, dermatologically tested, and cruelty-free.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="border border-gray-100 p-4 text-center">
            <h4 className="font-semibold text-[#2d1f33] text-sm">Organics SA</h4>
            <p className="text-xs text-gray-400 mt-1">Locally sourced, clean botanical extracts.</p>
          </div>
          <div className="border border-gray-100 p-4 text-center">
            <h4 className="font-semibold text-[#2d1f33] text-sm">Parisian Rituals</h4>
            <p className="text-xs text-gray-400 mt-1">Luxury French skincare formulations.</p>
          </div>
          <div className="border border-gray-100 p-4 text-center">
            <h4 className="font-semibold text-[#2d1f33] text-sm">Bloom Cosmetics</h4>
            <p className="text-xs text-gray-400 mt-1">Bold colors and professional tools.</p>
          </div>
        </div>
      </div>
    ),
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'Compliance with POPIA and protection of your personal information.',
    content: (
      <div className="space-y-6 text-sm text-gray-600 font-light leading-relaxed">
        <p>
          Rose City Beauty is committed to protecting your privacy. This policy outlines how we collect, store, and process your information in compliance with the South African Protection of Personal Information Act (POPIA).
        </p>
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs pt-2">What We Collect</h3>
        <p>
          When you place an order or sign in via Google OAuth, we collect basic details such as name, email address, shipping address, and phone number to fulfill your orders. Google OAuth metadata (such as full name) is shared strictly to auto-fill your account registry. We do not store credit card or PayPal details directly on our servers.
        </p>
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs pt-2">Security</h3>
        <p>
          All customer databases are encrypted and stored securely using Supabase servers. We never sell, lease, or share your data with external advertisers.
        </p>
      </div>
    ),
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function InfoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = INFO_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh]">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <Link href="/" className="text-[11px] uppercase tracking-wider text-gray-400 hover:text-accent">
          &larr; Back to home
        </Link>
        <h1 className="text-3xl font-light text-[#2d1f33] mt-2 uppercase tracking-wide">
          {page.title}
        </h1>
        <p className="text-sm text-gray-500 font-light mt-1">
          {page.subtitle}
        </p>
      </div>

      <div className="bg-white border border-accent/20 p-6 md:p-10 shadow-sm">
        {page.content}
      </div>
    </main>
  );
}
