import ChatWidget from './components/ChatWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <span className="text-lg font-bold tracking-tight">Brady's Detail Shop</span>
        
          <a href="tel:5551234567" className="text-sm text-zinc-400 hover:text-white transition">
            (555) 123-4567
          </a>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 max-w-4xl mx-auto">
        <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-4">
          Lawrenceburg, KY
        </p>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Your car deserves<br />
          <span className="text-blue-500">a proper detail.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mb-10">
          Professional car detailing done right. Interior, exterior, or the full treatment —
          chat with our assistant below to book your appointment in minutes.
        </p>
        <a
          href="#services"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          See Services
        </a>
      </section>

      {/* Services */}
      <section id="services" className="px-8 py-20 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Services & Pricing</h2>
          <p className="text-zinc-400 mb-10">Every detail, every time.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
              <p className="text-3xl mb-4">🚗</p>
              <h3 className="font-semibold text-lg mb-1">Exterior Wash</h3>
              <p className="text-blue-400 font-bold text-2xl mb-3">$60</p>
              <p className="text-zinc-400 text-sm">Hand wash, clay bar, tire shine. About 1 hour.</p>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
              <p className="text-3xl mb-4">🪑</p>
              <h3 className="font-semibold text-lg mb-1">Interior Detail</h3>
              <p className="text-blue-400 font-bold text-2xl mb-3">$100</p>
              <p className="text-zinc-400 text-sm">Vacuum, wipe-down, windows, odor treatment. About 2 hours.</p>
            </div>

            <div className="bg-blue-600 border border-blue-500 rounded-2xl p-6 relative">
              <span className="absolute top-4 right-4 text-xs bg-white text-blue-600 font-bold px-2 py-1 rounded-full">
                Best Value
              </span>
              <p className="text-3xl mb-4">✨</p>
              <h3 className="font-semibold text-lg mb-1">Full Detail</h3>
              <p className="text-white font-bold text-2xl mb-3">$150</p>
              <p className="text-blue-100 text-sm">Interior + exterior complete package. About 3 hours.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Why Brady's?</h2>
        <p className="text-zinc-400 mb-10">Local, reliable, and detail-obsessed.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-blue-500 text-2xl font-bold mb-2">5★</p>
            <p className="font-semibold mb-1">Top Rated Locally</p>
            <p className="text-zinc-400 text-sm">Trusted by hundreds of customers in Lawrenceburg and surrounding areas.</p>
          </div>
          <div>
            <p className="text-blue-500 text-2xl font-bold mb-2">24hr</p>
            <p className="font-semibold mb-1">Fast Turnaround</p>
            <p className="text-zinc-400 text-sm">Most appointments confirmed within 24 hours. Same-day sometimes available.</p>
          </div>
          <div>
            <p className="text-blue-500 text-2xl font-bold mb-2">100%</p>
            <p className="font-semibold mb-1">Satisfaction Guaranteed</p>
            <p className="text-zinc-400 text-sm">Not happy? We'll make it right. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-8 py-8 text-zinc-500 text-sm flex flex-col sm:flex-row justify-between gap-2">
        <p>© 2026 Brady's Detail Shop · Lawrenceburg, KY</p>
        <p>Mon–Sat 8am–6pm · (555) 123-4567</p>
      </footer>

      <ChatWidget />

    </main>
  );
}