import { MarketplaceBrowser } from "@/components/marketplace-browser";
import { SetupNotice } from "@/components/setup-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  categoryFromParam,
  LISTING_LIMIT,
  parseListing,
  searchFromParam,
  type Listing,
} from "@/lib/listings";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeCategory = categoryFromParam(params.category);
  const query = searchFromParam(params.q);
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main container">
          <SetupNotice />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { data, error } = await supabase
    .from("listings")
    .select("id,title,description,price,email,category,image_url,status,created_at")
    .order("created_at", { ascending: false })
    .limit(LISTING_LIMIT);

  if (error) {
    console.error("Supabase listings fetch failed:", error.message);
  }

  const listings = (data ?? [])
    .map(parseListing)
    .filter((listing): listing is Listing => listing !== null);

  const admin = getSupabaseAdminClient();
  let buyableSellerEmails: string[] = [];
  if (admin) {
    const { data: sellers, error: sellerError } = await admin
      .from("seller_accounts")
      .select("email")
      .eq("onboarding_complete", true)
      .eq("charges_enabled", true);
    if (sellerError) {
      console.error("Supabase seller status fetch failed:", sellerError.message);
    }
    buyableSellerEmails = (sellers ?? [])
      .map((seller) => seller.email)
      .filter((email): email is string => typeof email === "string");
  }

  return (
    <MarketplaceBrowser
      initialListings={listings}
      initialCategory={activeCategory}
      initialQuery={query}
      initialError={
        error
          ? "Check the Supabase tables and policies, then refresh."
          : null
      }
      buyableSellerEmails={buyableSellerEmails}
    />
  );
}
