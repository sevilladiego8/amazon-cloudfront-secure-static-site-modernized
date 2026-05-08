export default function Contact() {
  return (
    <>
      <title>{`Contact | CF Static Site`}</title>
      <meta name="description" content="Get in touch with us via the CF Static Site contact page." />
      <section className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-5xl font-medium text-gray-900">Contact</h1>
        <p className="text-gray-500">
          Reach out at{' '}
          <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">
            hello@example.com
          </a>
          .
        </p>
      </section>
    </>
  )
}
