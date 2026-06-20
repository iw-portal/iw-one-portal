import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubscribe = () => {
    if (!valid) return;

    const formData = new FormData();
    formData.append("EMAIL", email);

    fetch(
      "https://inclusiveworld.us13.list-manage.com/subscribe/post?u=32de3663325ad99eabf3dd1d7&id=5d21e9a2d9",
      {
        method: "POST",
        mode: "no-cors",
        body: formData,
      },
    );

    setEmail("");
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  const valid = isValidEmail(email);

  return (
    <footer className="bg-[#1f1f1f] text-gray-300 pt-12 sm:pt-14 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pb-12 md:pb-16">
          {/* ABOUT */}
          <div>
            <h3 className="text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6 text-gray-400">
              About
            </h3>

            <p className="text-sm sm:text-base leading-relaxed">
              Inclusive World is a 501(c)(3) non-profit organization whose
              mission is to develop skills and abilities of differently abled
              individuals based on their interests and goals for the future. The
              goal is for differently abled individuals to lead a productive
              life of acceptance and inclusion.
            </p>
          </div>

          {/* NEWSLETTER */}
          <div className="md:border-l md:border-gray-600 md:pl-10">
            <h3 className="text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6 text-gray-400">
              Sign Up For Our Newsletter
            </h3>

            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              Please sign up for our newsletters to receive latest news, updates
              and information about upcoming events:
            </p>

            {/* INPUT */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 bg-gray-200 p-2 sm:p-3 rounded">
              <input
                type="email"
                placeholder="email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-gray-800 outline-none bg-transparent"
              />

              <button
                disabled={!valid}
                onClick={handleSubscribe}
                className={`px-5 py-2 rounded text-white transition w-full sm:w-auto
                ${
                  valid
                    ? "bg-[#e16a5b] hover:bg-[#cf5b4c]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Subscribe
              </button>
            </div>
            {showThankYou && (
              <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
                <div className="bg-white shadow-2xl border border-gray-200 rounded-2xl px-6 py-4 max-w-sm">
                  <div className="flex items-start gap-3">
                    <div className="text-green-500 text-2xl">✓</div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Successfully Subscribed!
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        Thank you for subscribing to the InclusiveWorld
                        newsletter.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700 py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Inclusive World. All Rights Reserved.
          </p>

          <div className="flex gap-4 text-gray-400 text-lg sm:text-xl md:text-2xl">
            <a
              href="https://www.facebook.com/InclusiveWorld"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e16a5b] transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.youtube.com/channel/UC7i-6R26DrnbgQd__xdREDQ"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e16a5b] transition"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.instagram.com/_inclusiveworld"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e16a5b] transition"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/company/inclusive-world/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e16a5b] transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
