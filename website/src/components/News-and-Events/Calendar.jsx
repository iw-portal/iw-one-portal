import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import CalendarModal from "../../sections/Calendar/CalendarModal";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { GoDotFill } from "react-icons/go";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setEvents(data);
  };

  // Helpers
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  let startDay = startOfMonth.getDay();

  // Convert Sunday (0) → 6, others shift back by 1
  startDay = startDay === 0 ? 6 : startDay - 1;
  const totalDays = endOfMonth.getDate();

  const days = [];

  // Fill empty before start
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day);
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    // const filtered = events.filter((e) => {
    //   return (
    //     new Date(e.event_date).toDateString() === clickedDate.toDateString()
    //   );
    // });

    const filtered = events.filter((e) => {
      return (
        parseDate(e.event_date).toDateString() === clickedDate.toDateString()
      );
    });

    setSelectedDate(clickedDate);
    setSelectedEvents(filtered);
    setOpen(true);
  };

  const changeMonth = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeMonth(-1)}>←</button>

          <h2 className="text-xl font-bold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button onClick={() => changeMonth(1)}>→</button>
        </div>

        {/* Week Labels */}
        <div className="grid grid-cols-7 text-center font-semibold mb-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dateObj =
              day &&
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            const dayEvents = day
              ? events.filter(
                  (e) =>
                    parseDate(e.event_date).toDateString() ===
                    dateObj.toDateString(),
                )
              : [];

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`h-24 border rounded-md p-2 cursor-pointer
                ${day ? "bg-white hover:bg-gray-100" : "bg-gray-100"}
              `}
              >
                {day && (
                  <div className="text-sm font-semibold text-gray-800">
                    {day}
                  </div>
                )}
                {dayEvents && dayEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-1 text-xs text-red-500 truncate"
                      >
                        <GoDotFill className="text-red-500 text-[10px]" />
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {open && (
          <CalendarModal
            date={selectedDate}
            events={selectedEvents}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Calendar;
