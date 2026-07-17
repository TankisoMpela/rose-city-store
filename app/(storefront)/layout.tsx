import HeaderMinimal from '@/components/storefront/HeaderMinimal';
import Footer from '@/components/storefront/Footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderMinimal />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
