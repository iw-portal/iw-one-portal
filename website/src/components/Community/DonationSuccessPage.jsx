import { useEffect, useState } from "react";

export default function DonateSuccessPage() {
  const [message, setMessage] = useState("Verifying your donation...");

  useEffect(() => {
    const verifyDonation = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setMessage("Missing payment session. Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      try {
        const res = await fetch("/api/verify-donation-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setMessage("We could not verify the donation. Redirecting...");
        } else {
          if (res.ok && data.success && !data.alreadyVerified) {
            await fetch("/api/donation_received_email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.donorEmail,
                donorName: data.donorName,
                amount: data.amount,
              }),
            });

            setMessage("Donation received. Thank you!");
          }
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } catch {
        setMessage("Something went wrong. Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      }
    };

    verifyDonation();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#f26d63]">{message}</h1>
        <p className="mt-4 text-gray-600">
          You will be redirected to Inclusive World shortly.
        </p>
      </div>
    </div>
  );
}
