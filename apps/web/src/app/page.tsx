import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">ContentCommand AI</h1>
        <p className="mt-4">Create. Schedule. Publish. Track. Profit.</p>
        <Link href="/dashboard" className="mt-8 px-4 py-2 bg-blue-500 text-white rounded">Go to Dashboard</Link>
      </div>
    </main>
  );
}
