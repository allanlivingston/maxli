import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900">
      <div className="p-8 bg-stone-800 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-emerald-500 text-center">Your Orders</h1>
        <p className="mb-6 text-stone-300 text-center">This page is under construction. Check back soon to view your order history.</p>
        <Link href="/" className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
