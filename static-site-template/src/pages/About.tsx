export default function About() {
  return (
    <>
      <title>{`About | CF Static Site`}</title>
      <meta name="description" content={"About Page of the CF Static Site"} />
      <section className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-5xl font-medium text-gray-900">About</h1>
        <p className="text-gray-500">
          This is the about page. Tell the world who you are.
        </p>
      </section>
    </>
  );
}
