import { useState } from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

export default function DonatePaymentPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleDonate = async (e) => {
    e.preventDefault();

    const donationAmount = Number(amount);

    if (!donationAmount || donationAmount < 1) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/create-donation-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: donationAmount,
        donorName: name,
        donorEmail: email,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to start donation checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      <section className="px-6 py-20">
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 border">
          <h1 className="text-2xl font-bold text-center text-[#f26d63]">
            Make a Donation
          </h1>

          <p className="text-center text-sm mt-4 text-gray-600">
            Enter the amount you would like to donate to Inclusive World.
          </p>

          <form onSubmit={handleDonate} className="mt-8">
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border rounded-lg px-4 py-3 mb-6 outline-none"
            />

            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full border rounded-lg px-4 py-3 mb-6 outline-none"
            />

            <label className="block text-sm font-semibold mb-2">
              Donation Amount
            </label>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-4 text-gray-600 font-semibold">$</span>

              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#f26d63] hover:bg-[#e75f55] disabled:bg-gray-400 text-white font-bold py-3 rounded-lg"
            >
              {loading ? "Redirecting..." : "Continue to Payment"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
