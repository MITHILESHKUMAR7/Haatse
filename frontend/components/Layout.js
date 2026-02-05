import Link from 'next/link';

export default function Layout({ title, children }) {
  return (
    <main>
      <header className="card">
        <h1>HaatSe</h1>
        <p>HaatSe is not a marketplace. It is a disciplined trade network.</p>
        <nav>
          <Link href="/">Home</Link> | <Link href="/login">Login</Link> |{' '}
          <Link href="/farmer-onboarding">Farmer Onboarding</Link> |{' '}
          <Link href="/buyer-onboarding">Buyer Onboarding</Link>
        </nav>
      </header>
      <h2>{title}</h2>
      {children}
    </main>
  );
}
