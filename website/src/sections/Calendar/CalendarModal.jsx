const CalendarModal = ({ date, events, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">{date.toDateString()}</h2>

        {events.length === 0 ? (
          <p>No events for this day</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="mb-4 border-b pb-2">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {event.start_time} - {event.end_time}
              </p>
              <br />
              <p className="text-sm">{event.description}</p>
              <br />
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          ))
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-[#e0705d] text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;
