"use client";

export default function LocationMarquee() {
  const locations = [
    "San Francisco",
    "London",
    "Los Angeles",
    "New York",
    "San Francisco",
    "Berlin",
    "Paris",
    "Tokyo",
    "Sydney",
    "Berlin",
    "Paris",
    "Tokyo",
  ];

  return (
    <section className="bg-white py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* First Marquee Row */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden py-5">
            <div className="animate-marquee whitespace-nowrap flex gap-8">
              {locations.slice(0, 5).map((location, index) => (
                <div
                  key={index}
                  className="flex items-center gap-8 text-4xl font-semibold font-plus-jakarta-sans text-gray-900"
                >
                  <span>{location}</span>
                  <span className="text-gray-400">•</span>
                </div>
              ))}
              {locations.slice(0, 5).map((location, index) => (
                <div
                  key={`repeat-${index}`}
                  className="flex items-center gap-8 text-4xl font-semibold font-plus-jakarta-sans text-gray-900"
                >
                  <span>{location}</span>
                  <span className="text-gray-400">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Marquee Row */}
        <div className="relative ">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden py-5 ">
            <div className="animate-marquee-reverse whitespace-nowrap flex gap-8">
              {locations.slice(5).map((location, index) => (
                <div
                  key={index}
                  className="flex items-center gap-8 text-4xl font-semibold font-plus-jakarta-sans text-gray-900"
                >
                  <span>{location}</span>
                  <span className="text-gray-400">•</span>
                </div>
              ))}
              {locations.slice(5).map((location, index) => (
                <div
                  key={`repeat-${index}`}
                  className="flex items-center gap-8 text-4xl font-semibold font-plus-jakarta-sans text-gray-900"
                >
                  <span>{location}</span>
                  <span className="text-gray-400">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
