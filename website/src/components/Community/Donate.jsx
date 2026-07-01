import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import donatePic from "../../iw-brand-kit/donate.png";
import { useNavigate } from "react-router-dom";

export default function DonatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />
      {/* Hero Image */}
      <section className="w-full flex justify-center pt-6 pb-6 px-4">
        <img
          src={donatePic}
          alt="Donate"
          className="w-full max-w-[1080px] h-[180px] sm:h-[240px] md:h-[310px] object-cover"
        />
      </section>

      {/* Mission Section */}
      <section className="bg-[#fdecea] px-4 py-10 md:py-12 text-center">
        <h1 className="text-[#f26d63] font-bold text-lg md:text-xl tracking-wide">
          Ways to Contribute to Our Mission
        </h1>

        <div className="w-24 h-[2px] bg-[#f26d63] mx-auto mt-4 mb-7" />

        <div className="max-w-[1180px] mx-auto text-xs md:text-sm leading-6 text-black">
          <p>
            Inclusive World is a 501(c)(3) non-profit organization whose mission
            is to develop the skills and abilities of differently abled
            individuals based on their interests and goals for the future.
            Donations are tax-deductible and 100% of your donation goes towards
            funding our programs. If you have any questions or want to speak
            with us about donations, please do write to us at{" "}
            <a href="mailto:donate@inclusiveworld.org">
              <span className="text-[#ef4d3f] font-semibold">
                donate@inclusiveworld.org
              </span>
            </a>
            .
          </p>

          <p className="mt-6">
            Please use the button below to donate. Thank you for your support!
          </p>

          <p className="mt-6">
            Our EIN is <span className="font-bold">61-1714629</span>.
          </p>
        </div>
      </section>

      {/* Donation Options */}
      <section className="px-6 py-14 md:py-16">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {/* Column 1 */}
          <div>
            <h2 className="font-bold text-base md:text-lg leading-6">
              Click to Donate via <br />
              Credit card:
            </h2>

            <div className="w-24 h-[2px] bg-[#f26d63] mt-6 mb-7" />

            {/* <button className="bg-[#ffc439] text-black font-bold text-sm px-6 py-1 rounded">
              Donate
            </button> */}
            <button
              onClick={() => navigate("/donate/payment")}
              className="bg-[#ffc439] text-black font-bold text-sm px-6 py-1 rounded"
            >
              Donate
            </button>

            <p className="mt-5 text-sm">
              <span className="font-bold">PayPal:</span>{" "}
              payment@inclusiveworld.org
            </p>

            <p className="mt-5 text-sm">
              <span className="font-bold">Zelle:</span>{" "}
              payment@inclusiveworld.org
            </p>

            <p className="mt-7 text-sm leading-6">
              <span className="font-bold">via Check:</span> Please send an email
              to{" "}
              <a href="mailto:donate@inclusiveworld.org">
                <span className="text-[#ef4d3f] font-semibold">
                  donate@inclusiveworld.org
                </span>
              </a>{" "}
              to get more details.
            </p>

            <p className="mt-7 text-sm leading-6">
              <span className="font-bold">Matching Donations:</span> If your
              company has a matching policy towards contributions made to
              non-profits, please send an email to{" "}
              <a href="mailto:donate@inclusiveworld.org">
                <span className="text-[#ef4d3f] font-semibold">
                  donate@inclusiveworld.org
                </span>
              </a>
              .
            </p>

            <p className="mt-7 text-sm">
              You can find us on{" "}
              <a
                href="https://www.benevity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ef4d3f] font-semibold hover:underline"
              >
                www.benevity.com
              </a>
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h2 className="font-bold text-base md:text-lg leading-6">
              You can make your <br />
              donation towards:
            </h2>

            <div className="w-24 h-[2px] bg-[#f26d63] mt-6 mb-7" />

            <div className="space-y-5 text-sm">
              {[
                "In honor of/Dedicated to",
                "In celebration of (birth, anniversaries)",
                "In honor of ADA/Neuro Diversity",
                "To nurture an Inclusive society",
                "Any event or fundraising event organized by us",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef4d3f] text-white text-xs font-bold">
                    ▣
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h2 className="font-bold text-base md:text-lg leading-6">
              Shop at Shastha Foods online to <br />
              support us
            </h2>

            <div className="w-24 h-[2px] bg-[#f26d63] mt-6 mb-7" />

            <p className="text-sm leading-6">
              Please choose Inclusive World as your choice of charity when you
              shop at Shastha Foods Online store.
            </p>

            <button className="mt-8 bg-[#f26d63] hover:bg-[#e75f55] text-white font-bold text-sm px-7 py-3 rounded">
              Shop At Shastha Foods
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
