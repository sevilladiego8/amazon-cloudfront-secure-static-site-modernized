import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <title>{`404 Not Found | CF Static Site`}</title>
      <meta name="description" content="Page not found." />
      <meta name="robots" content="noindex" />
      <section className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-5xl font-medium text-gray-900">404</h1>
        <p className="text-gray-500">Page not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Go home</Link>
      </section>
    </>
  )
}
