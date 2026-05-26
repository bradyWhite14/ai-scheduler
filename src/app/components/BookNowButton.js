'use client';

export default function BookNowButton({ variant = 'nav' }) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent('openChat'));
  }

  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        className="inline-block border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Book Now
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition"
    >
      Book Now
    </button>
  );
}
