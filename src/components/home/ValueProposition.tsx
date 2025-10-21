export default function ValueProposition() {
  return (
    <section className="bg-white py-20 px-4 font-plus-jakarta-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl  font-bold text-gray-900 mb-4 text-balance">
              Find your dream home with our curated listings and expert
              guidance.
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 w-full max-w-6xl mx-auto">
            {/* Text Card */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl p-10 text-center aspect-square md:aspect-auto">
              <div>
                <p className="text-gray-400 text-sm">Property Investments</p>
                <div className="text-6xl font-semibold text-black">$1B+</div>
              </div>
            </div>

            {/* Image Card */}
            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden aspect-square md:aspect-auto">
              <img
                src="https://www.e-estate.co/assets/img/sect-1-img.webp"
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
