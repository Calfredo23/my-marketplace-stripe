export function SetupNotice() {
  return (
    <section className="setup-notice" data-testid="setup-notice">
      <p className="eyebrow">One setup step left</p>
      <h1>Connect Supabase</h1>
      <p className="setup-copy">
        The marketplace is ready. It needs a database and a photo bucket before
        listings can go live.
      </p>
      <ol className="setup-list">
        <li>
          Create a Supabase project and run <code>supabase/schema.sql</code>.
        </li>
        <li>
          Run <code>supabase/storage.sql</code> for the public{" "}
          <code>listing-images</code> bucket.
        </li>
        <li>
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and a publishable key to{" "}
          <code>.env.local</code>.
        </li>
        <li>
          Optional: run <code>supabase/demo-listings.sql</code> for sample data.
        </li>
      </ol>
      <p className="setup-note">
        Follow <code>.env.example</code>. No keys belong in git.
      </p>
    </section>
  );
}
