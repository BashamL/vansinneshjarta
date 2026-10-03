import Link from "next/link";
export default function NotFound() {
  return (
    <main className="section">
      <p className="eyebrow">404 / Sidan saknas</p>
      <div>
        <h1>Sidan finns inte här.</h1>
        <Link className="button" href="/">
          Till startsidan ↗
        </Link>
      </div>
    </main>
  );
}
