# Rose City Beauty Storefront

A modern e-commerce storefront for **Rose City Beauty**, Bloemfontein's premium destination for skincare, makeup, and self-care. Reconstructed to match the original WordPress FSE visual layout, powered by Next.js, Tailwind CSS, Supabase (PostgreSQL), and PayPal payments.

## Key Features

*   **Custom WordPress Layout Replication**: Elegant e-commerce layout featuring a boxed card container theme on a soft grey background (`#F4F4F4`), social header strips, and brand alignment.
*   **Hero & Promo Sections**: Lavender hero card section featuring brand aesthetics and horizontal grid promotions (image left, description and action right).
*   **Store Catalog**: Dynamic grid product listings (SPF50 Daily Defence, Makeup Brush Set, Shea Body Lotion, Hyaluronic Acid, Argan Hair Oil, and Eau de Parfum).
*   **Cart & Quantity Controls**: Product page variant support, quantity pickers, and side-by-side secondary "Add to Cart" and primary "Pay Now" actions.
*   **Unified Guest Checkout**: Support for guest checkout where orders are stored in the database, with shipping and contact details saved in the order notes to prevent guest Row-Level Security policy errors.
*   **PayPal Sandbox Checkout**: Embedded PayPal payment widget, with an automated ZAR-to-EUR currency converter to handle international payment processor boundaries cleanly.
*   **Cash on Delivery (COD)**: Custom cash on delivery payment routing with a configured flat **R49.54** service surcharge.
*   **Supabase PostgreSQL Schema**: Complete migrations catalog (`supabase/migrations/`) featuring a profile RLS recursion fix using a security-definer function, and guest insertion permissions.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Styling**: Tailwind CSS
*   **Database & Auth**: Supabase (PostgreSQL)
*   **Payments**: PayPal SDK Integration
*   **State Management**: Zustand
*   **Language**: TypeScript

## Getting Started

### Prerequisites

*   Node.js 20+
*   Supabase Account
*   PayPal Developer Account (Sandbox)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# PayPal credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Apply Database Migrations

Apply the migration schemas and initial seed data using the Supabase CLI in your terminal:

```bash
supabase db push
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store locally.

## Deployment

To deploy to **Vercel**:

1. Push the code to your GitHub repository.
2. Link the repository in the Vercel dashboard.
3. Configure the environment variables matching `.env.local`.
4. Deploy!
# rose-city-store
