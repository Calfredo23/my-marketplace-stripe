import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>the market. a small marketplace for good finds.</p>
        <div className="footer-links">
          <Link href="/">Browse</Link>
          <Link href="/sell">Sell something</Link>
          <Link href="/stripe">Stripe payouts</Link>
        </div>
      </div>
    </footer>
  );
}
