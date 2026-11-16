import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main container not-found">
        <p className="eyebrow">404</p>
        <h1>That listing is gone.</h1>
        <p className="page-copy">
          It may have sold, or the link may be wrong. There are more things to
          browse.
        </p>
        <Link href="/" className="button button-primary">
          Back to listings
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
