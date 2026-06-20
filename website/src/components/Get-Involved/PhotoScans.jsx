import psh from "/photo_scan_hero.png";
import { useState } from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const faqData = [
  {
    q: "Where do I ship my photos?",
    a: (
      <p>
        Inclusive World Photo Scanning Services <br />
        <br />
        21441 Arrowhead Ln, Saratoga, CA 95070
      </p>
    ),
  },
  {
    q: "Will my digitized photos be kept private?",
    a: "Yes. Your photos will be stored in a password protected folder. A private link to the folder will be shared with you.",
  },
  {
    q: "How much time does it take to process my order?",
    a: "Depending upon the size of the order, it will take about 2-4 weeks. We will keep you updated on the timeline periodically.",
  },
  {
    q: "Can you provide me shipping instructions to send and receive my physical photos?",
    a: (
      <div className="space-y-3">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Place photos straight and upright (please ensure they are not bent).
          </li>
          <li>
            Photos should be sent in loose form. We cannot process your photos
            if they arrive to us in sleeves, photo albums, carousels, or any
            other packaging outside of plastic bags or envelopes. This is to
            make sure that the process is as timely and optimal as possible.
          </li>
          <li>
            Please sort photos by event(s) (especially if you are sending us a
            bundle of photos across different events) and wrap the event
            specific photos using a paper, with the event name written on each
            of the specific bundles.
          </li>
          <li>
            Avoid sending damaged photos for scanning. Please inspect your
            photos to make sure that they do not have any tape or glue residue.
          </li>
          <li>
            We do not hold any responsibility for lost or damaged photos. No
            refunds or cancellations after receipt of order and delivery of
            photos.
          </li>
          <li>Ship photos in an envelope with bubble wrap.</li>
          <li>
            Please include a pre-paid return envelope (USPS/UPS/Fedex) with your
            shipping address and a tracking number along with the photos you
            ship to us so that we can return them promptly.
          </li>
        </ul>

        <div className="text-sm text-gray-700">
          <p className="font-semibold">
            Please ship/deliver your photo package to:
          </p>
          <p>Inclusive World Photo Scanning Services</p>
          <p>21441 Arrowhead Ln</p>
          <p>Saratoga, CA 95070</p>
        </div>
      </div>
    ),
  },
  {
    q: "How do I contact you?",
    a: "Please email iwsbservices@inclusiveworld.org if you have any questions. Please include your order number along with your full name in your email.",
  },
  {
    q: "How long does it take to get my physical photos back?",
    a: "If payment has been received, we should be able to mail your originals back to you within a week of completing digitization of your photos.",
  },
  {
    q: "How long will I have access to my digital photos?",
    a: "You will have access to your digital photos for 4 weeks.",
  },
  {
    q: "What happens if I forget to send a return envelope along with my photos?",
    a: "A flat rate of $20 will be charged for return shipment via an invoice. Once we receive payment, your photos will be shipped back to you.",
  },
];

export default function PhotoScanPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="flex justify-center mt-6">
        <img
          src={psh}
          alt="Photo Scan"
          className="w-full max-w-5xl object-contain"
        />
      </div>

      {/* BEIGE SECTION */}
      <section className="bg-[#e6d3ce] mt-6 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[#e0705d] font-semibold text-lg mb-4">
            Small Business@IW Photo Scanning Service
          </h2>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            Thank you for your interest in digitizing your valuable memories!
            Photo Scanning Services at Inclusive World help preserve your
            cherished memories by converting physical photos into high-quality
            digital formats.
          </p>

          {/* HOW IT WORKS */}
          <div className="text-left text-sm text-gray-700 space-y-3 mb-6">
            <h3 className="font-semibold text-gray-800">How does it work?</h3>

            <ul className="list-disc pl-5 space-y-1">
              <li>Place your order using the button below.</li>
              <li>Receive confirmation and shipping instructions.</li>
              <li>Send your photos to us securely.</li>
              <li>We scan, organize, and return them safely.</li>
            </ul>
          </div>

          {/* PRICING */}
          <div className="text-left text-sm text-gray-700 space-y-2 mb-6">
            <h3 className="font-semibold text-gray-800">Price Structure</h3>

            <p>
              <strong>Less than 100 photos:</strong> $0.50 per photo
            </p>
            <p>
              <strong>More than 100 photos:</strong> $0.35 per photo
            </p>
          </div>

          {/* NOTES */}
          <div className="text-left text-sm text-gray-700 space-y-2 mb-6">
            <h3 className="font-semibold text-gray-800">Please Note</h3>

            <ul className="list-disc pl-5 space-y-1">
              <li>We cannot scan photos placed inside albums.</li>
              <li>
                Photos should be loose and properly packaged before shipping.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 mb-8 text-center text-2xl">
        <span className="font-bold">
          Please click on the button below to place your order. Thank you for
          your business!
        </span>
        <br />
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScVbysZuAfjAD4mJH75tbVG7eP-qkKUwvUag3MUWONPZcWA0w/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-[#e16a5b] text-white px-5 py-2 text-xl rounded hover:bg-[#cf5b4c]"
        >
          Start Order
        </a>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mt-10 px-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Frequently Asked Questions (FAQs)
        </h3>

        <div className="space-y-2">
          {faqData.map((item, i) => (
            <div key={i} className="border rounded">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-4 py-3 text-sm"
              >
                <span>{item.q}</span>

                <span className="bg-[#b24a60] text-white w-5 h-5 flex items-center justify-center text-xs rounded">
                  {open === i ? "−" : "+"}
                </span>
              </button>

              {open === i && (
                <div className="px-4 pb-4 text-sm text-gray-600">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="h-16"></div>
      <Footer />
    </div>
  );
}
