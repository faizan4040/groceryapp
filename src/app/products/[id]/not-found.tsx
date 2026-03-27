import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 text-center px-4">
      <span className="text-6xl">🥦</span>
      <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
      <p className="text-gray-500 text-sm max-w-sm">
        This item may have been removed, gone out of stock, or the link is incorrect.
      </p>
      <Link
        href="/"
        className="mt-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}