import { SellForm } from "@/components/sell-form";
import { SetupNotice } from "@/components/setup-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default function SellPage() {
  const supabase = getSupabaseServerClient();

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">
        {supabase ? (
          <SellForm />
        ) : (
          <div className="container form-page">
            <SetupNotice />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
