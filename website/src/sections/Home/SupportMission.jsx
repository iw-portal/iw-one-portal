const images = [
  {
    src: "https://inclusiveworld.org/wp-content/uploads/2024/06/IMG_8546-800x1067.jpg",
    alt: "Product 1",
  },
  {
    src: "https://inclusiveworld.org/wp-content/uploads/2024/06/IMG_8557-800x1067.jpg",
    alt: "Product 2",
  },
  {
    src: "https://inclusiveworld.org/wp-content/uploads/2024/06/IMG_8571-800x1067.jpg",
    alt: "Product 3",
  },
  {
    src: "https://inclusiveworld.org/wp-content/uploads/2024/06/IMG_8646-800x1036.jpg",
    alt: "Product 4",
  },
  {
    src: "https://inclusiveworld.org/wp-content/uploads/2024/06/IMG_8582-800x1019.jpg",
    alt: "Product 5",
  },
];

function SupportMission() {
  return (
    <section className="bg-white py-1">
      <div className="max-w-[1300px] mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-[#e16a5b]">
            Support Our Mission
          </h2>

          <div className="w-20 h-[3px] bg-[#e16a5b] mx-auto mt-4"></div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {images.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-10">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScEmuzsBl2knD6Uo0tnF5yZX7DXsFR75mKoysDH8NrAVSTmHA/viewform"
            target="_blank"
            className="bg-[#e16a5b] text-white px-8 py-4 rounded-md font-semibold hover:bg-[#cf5b4c] transition flex items-center gap-2"
          >
            Order Now
            <span>›</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default SupportMission;
