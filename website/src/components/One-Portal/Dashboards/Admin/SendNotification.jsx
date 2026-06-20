import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [targetEmail, setTargetEmail] = useState("");
  const [allEmails, setAllEmails] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    loadAllEmails();
  }, []);

  const generatePreview = () => {
    return `
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      bgcolor="#f4f8f7"
    >
      <tr>
        <td align="center" style="padding:40px 16px;">

          <table
            role="presentation"
            width="100%"
            style="
              max-width:620px;
              border-radius:24px;
              overflow:hidden;
              border:1px solid #e4ece9;
              font-family:Arial,Helvetica,sans-serif;
            "
          >

            <tr>
              <td
                bgcolor="#0c4f49"
                align="center"
                style="padding:50px 36px;"
              >
                <img
                  src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png"
                  width="72"
                  style="display:block;margin-bottom:24px;"
                />

                <div
                  style="
                    color:white;
                    font-size:34px;
                    font-weight:bold;
                  "
                >
                  ${title}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:42px 36px;">

                <div
                  style="
                    color:#5d6c69;
                    font-size:16px;
                    line-height:30px;
                    white-space:pre-wrap;
                  "
                >
                  ${message}
                </div>

                <div
                  style="
                    margin-top:40px;
                    color:#667572;
                    font-size:15px;
                    line-height:28px;
                  "
                >
                  Thanks,
                  <br/><br/>
                  <strong>Inclusive World</strong>
                </div>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  `;
  };

  const handleSend = async () => {
    try {
      if (!date || !time) {
        alert("Please select date and time");
        return;
      }

      // Combine input
      const local = new Date(`${date}T${time}`);

      // Get offset for Pacific (handles DST automatically)
      const pacificOffset = new Date().toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });

      const pacificDate = new Date(pacificOffset);

      // Calculate difference between local + Pacific
      const diff =
        local.getTime() -
        new Date(
          local.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
        ).getTime();

      // Apply correction → true Pacific time
      const corrected = new Date(local.getTime() + diff);

      const { error } = await supabase.from("notifications").insert([
        {
          title,
          message,
          role_target: audience,
          expires_at: corrected.toISOString(),
        },
      ]);

      if (error) {
        console.error(error);
        alert("Error sending notification");
      } else {
        const emailResponse = await fetch("/api/send_notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audience,

            subject: title,

            htmlContent: generatePreview(),

            senderName: "Inclusive World",

            receiverName:
              audience === "all"
                ? "All Users"
                : audience.charAt(0).toUpperCase() + audience.slice(1),
          }),
        });

        if (!emailResponse.ok) {
          const text = await emailResponse.text();

          let result = {};

          try {
            result = JSON.parse(text);
          } catch {
            result = {
              error: text || "Failed to send email",
            };
          }

          throw new Error(result.error);
        }

        alert("Notification and Email Sent!");

        setTitle("");
        setMessage("");
        setDate("");
        setTime("");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const loadRoleEmail = async (role) => {
    const { data } = await supabase
      .from("year_emails")
      .select("email")
      .eq("role", role)
      .single();

    if (data) {
      setTargetEmail(data.email);
    }
  };

  const loadAllEmails = async () => {
    const { data, error } = await supabase
      .from("year_emails")
      .select("role,email")
      .order("role");

    if (error) {
      console.error(error);
      return;
    }

    setAllEmails(data || []);
  };

  const saveEmail = async () => {
    try {
      if (!targetEmail.trim()) {
        alert("Please enter an email address");
        return;
      }

      const { error } = await supabase.from("year_emails").upsert(
        {
          role: audience,
          email: targetEmail.trim(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "role",
        },
      );

      if (error) {
        console.error(error);
        alert("Failed to update email");
        return;
      }

      alert(`${audience} email updated successfully`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    // <div className="w-full px-4 sm:px-6 md:px-8 py-6">
    //   {/* Header */}
    //   <h1 className="text-2xl sm:text-3xl font-bold mb-6">Send Notification</h1>

    //   {/* Card */}
    //   <div className="bg-white p-5 sm:p-6 rounded-xl shadow w-full max-w-2xl">
    //     {/* Audience */}
    //     <label className="block mb-2 font-semibold text-sm sm:text-base">
    //       Audience
    //     </label>
    //     <select
    //       className="border p-2 sm:p-3 rounded w-full mb-4 text-sm sm:text-base"
    //       value={audience}
    //       onChange={async (e) => {
    //         setAudience(e.target.value);
    //         await loadRoleEmail(e.target.value);
    //       }}
    //     >
    //       <option value="all">All</option>
    //       <option value="member">Members</option>
    //       <option value="volunteer">Volunteers</option>
    //       <option value="lead">Leads</option>
    //     </select>

    //     <div className="mt-4">
    //       <label className="block text-sm font-semibold mb-1">
    //         Recipient Email
    //       </label>

    //       <input
    //         value={targetEmail}
    //         onChange={(e) => setTargetEmail(e.target.value)}
    //         className="border p-3 rounded w-full"
    //       />
    //     </div>

    //     <button
    //       onClick={async () => {
    //         await supabase
    //           .from("year_emails")
    //           .update({
    //             email: targetEmail,
    //             updated_at: new Date(),
    //           })
    //           .eq("role", audience);

    //         alert("Email updated");
    //       }}
    //     >
    //       Save Email
    //     </button>

    //     {/* Title */}
    //     <input
    //       placeholder="Title"
    //       className="border p-2 sm:p-3 rounded w-full mb-4 text-sm sm:text-base"
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //     />

    //     {/* Message */}
    //     <textarea
    //       placeholder="Message"
    //       className="border p-2 sm:p-3 rounded w-full mb-4 text-sm sm:text-base"
    //       rows={4}
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //     />

    //     {/* Date + Time */}
    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
    //       <div>
    //         <label className="block text-sm font-semibold mb-1">
    //           Visible Until Date
    //         </label>
    //         <input
    //           type="date"
    //           className="border p-2 sm:p-3 rounded w-full"
    //           value={date}
    //           onChange={(e) => setDate(e.target.value)}
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-semibold mb-1">
    //           Visible Until Time
    //         </label>
    //         <input
    //           type="time"
    //           className="border p-2 sm:p-3 rounded w-full"
    //           value={time}
    //           onChange={(e) => setTime(e.target.value)}
    //         />
    //       </div>
    //     </div>

    //     {/* Button */}
    //     <button
    //       onClick={handleSend}
    //       className="w-full sm:w-auto bg-teal-800 text-white px-6 py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-teal-700 transition"
    //     >
    //       Send Notification
    //     </button>
    //   </div>
    // </div>
    <div className="w-full px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Send Notification
          </h1>

          <p className="text-gray-500 mt-2">
            Create a dashboard notification and send an email announcement.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          {/* Delivery Settings */}
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Audience
                </label>

                <select
                  value={audience}
                  onChange={async (e) => {
                    const value = e.target.value;

                    setAudience(value);

                    if (value === "all") {
                      await loadAllEmails();
                      setTargetEmail("");
                    } else {
                      await loadRoleEmail(value);
                    }
                  }}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="all">All Users</option>
                  <option value="member">Members</option>
                  <option value="volunteer">Volunteers</option>
                  <option value="lead">Leads</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Email
                </label>

                {audience === "all" ? (
                  <div className="border rounded-xl p-4 bg-gray-50">
                    <p className="text-sm text-gray-500 mb-3">
                      Notifications will be sent to:
                    </p>

                    <div className="space-y-2">
                      {allEmails.map((entry) => (
                        <div
                          key={entry.role}
                          className="
              flex
              justify-between
              items-center
              bg-white
              border
              rounded-lg
              px-3
              py-2
            "
                        >
                          <span className="capitalize font-medium">
                            {entry.role}
                          </span>

                          <span className="text-gray-600">{entry.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={targetEmail}
                      onChange={(e) => setTargetEmail(e.target.value)}
                      className="flex-1 border rounded-xl p-3"
                    />

                    <button
                      onClick={saveEmail}
                      className="
          px-4
          rounded-xl
          border
          bg-gray-50
          hover:bg-gray-100
        "
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notification Content */}
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Notification Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>

              <textarea
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification..."
                className="w-full border rounded-xl p-3"
              />
            </div>

            {/* Expiration */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Visibility</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded-xl p-3"
                />

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border rounded-xl p-3"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t p-6 flex justify-end">
            <button
              onClick={handleSend}
              className="
            bg-[#0f5b54]
            hover:bg-[#0c4a45]
            text-white
            px-8
            py-3
            rounded-xl
            font-medium
            shadow-sm
          "
            >
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;
