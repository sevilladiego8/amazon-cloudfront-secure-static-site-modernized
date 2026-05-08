export default function Home() {
  return (
    <>
      <title>{`Home | CF Static Site`}</title>
      <meta name="description" content="Welcome to CF Static Site — simple, secure, and fast." />
      <section className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-5xl font-medium text-gray-900">Welcome</h1>
        <p className="text-gray-500">This is the home page. Simple and clean.</p>
      </section>
    </>
  )
}
