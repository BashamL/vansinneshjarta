import ArrowIcon from "./arrow-icon";
import Link from "next/link";
export default function NotFound() {
  return (
    <main className="error-page">
      <p className="small-caps">404 / sidan saknas</p>
      <h1>den här sidan är oskriven.</h1>
      <Link className="read-link" href="/">
        till första sidan <ArrowIcon direction="up" />
      </Link>
    </main>
  );
}
