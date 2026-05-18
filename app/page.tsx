export default function HomePage() {
  return (
    <main>
      {/* Hero placeholder — full-screen dark bg to test transparent nav */}
      <section className="relative min-h-screen bg-lawo-black flex items-center justify-center">
        <div className="text-center text-lawo-white">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-4">
            The Lawo Homestay
          </h1>
          <p className="font-outfit text-lg text-lawo-white/70">
            Kuala Terengganu — Fasa 2 Nav Test
          </p>
        </div>
      </section>

      {/* Content below fold to test scroll behaviour */}
      <section className="min-h-screen flex items-center justify-center bg-lawo-bg">
        <p className="font-outfit text-lawo-gray text-lg">
          Scroll ke bawah — header bertukar kepada solid
        </p>
      </section>
    </main>
  );
}
