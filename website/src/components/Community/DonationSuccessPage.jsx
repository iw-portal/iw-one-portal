// import { useEffect, useState } from "react";

// export default function DonateSuccessPage() {
//   const [message, setMessage] = useState("Verifying your donation...");

//   useEffect(() => {
//     const verifyDonation = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const sessionId = params.get("session_id");

//       if (!sessionId) {
//         setMessage("Missing payment session. Redirecting...");
//         setTimeout(() => {
//           window.location.href = "/";
//         }, 2000);
//         return;
//       }

//       try {
//         const res = await fetch("/api/verify-donation-checkout", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ sessionId }),
//         });

//         const data = await res.json();

//         if (!res.ok || !data.success) {
//           setMessage("We could not verify the donation. Redirecting...");
//         } else {
//           if (res.ok && data.success && !data.alreadyVerified) {
//             await fetch("/api/donation_received_email", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 email: data.donorEmail,
//                 donorName: data.donorName,
//                 amount: data.amount,
//               }),
//             });

//             setMessage("Donation received. Thank you!");
//           }
//         }

//         setTimeout(() => {
//           window.location.href = "/";
//         }, 2500);
//       } catch {
//         setMessage("Something went wrong. Redirecting...");
//         setTimeout(() => {
//           window.location.href = "/";
//         }, 2500);
//       }
//     };

//     verifyDonation();
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-6">
//       <div className="text-center">
//         <h1 className="text-2xl font-bold text-[#f26d63]">{message}</h1>
//         <p className="mt-4 text-gray-600">
//           You will be redirected to Inclusive World shortly.
//         </p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

export default function DonateSuccessPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your donation...");

  useEffect(() => {
    const verifyDonation = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setMessage("Missing payment session. Redirecting...");
        setTimeout(() => (window.location.href = "/"), 2000);
        return;
      }

      try {
        const res = await fetch("/api/verify-donation-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setStatus("error");
          setMessage("We could not verify the donation.");
        } else {
          if (!data.alreadyVerified) {
            await fetch("/api/donation_received_email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: data.donorEmail,
                donorName: data.donorName,
                amount: data.amount,
              }),
            });
          }

          setStatus("success");
          setMessage("Donation received. Thank you!");
        }

        setTimeout(() => (window.location.href = "/"), 2500);
      } catch {
        setStatus("error");
        setMessage("Something went wrong.");
        setTimeout(() => (window.location.href = "/"), 2500);
      }
    };

    verifyDonation();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white border border-gray-100 shadow-xl rounded-3xl p-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#eef8f6]">
          {status === "loading" ? (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d7efeb] border-t-[#0f5b54]" />
          ) : status === "success" ? (
            <HiCheckCircle className="h-12 w-12 text-[#0f5b54]" />
          ) : (
            <HiExclamationCircle className="h-12 w-12 text-[#f26d63]" />
          )}
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f26d63]">
          Inclusive World
        </p>

        <h1 className="mt-4 text-3xl font-bold text-[#0f5b54]">{message}</h1>

        <p className="mt-4 text-gray-600 leading-7">
          Your support helps us continue creating meaningful opportunities for
          differently abled individuals.
        </p>

        <div className="mt-8 rounded-2xl bg-[#f8fbfa] border p-4 text-sm text-gray-500">
          You will be redirected to Inclusive World shortly.
        </div>
      </div>
    </div>
  );
}
