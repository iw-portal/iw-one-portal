import { useState } from "react";

function MeetFamily() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-100 py-20">
        <div className="max-w-[1300px] mx-auto px-6">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#e16a5b]">
              Meet Arun's Family
            </h2>

            <div className="w-20 h-[3px] bg-[#e16a5b] mx-auto mt-4"></div>
          </div>

          <div>
            <img
              src="https://inclusiveworld.org/wp-content/uploads/2020/12/ArunStory.jpg"
              alt="ArunStory"
              className="rounded-lg mb-6 mx-auto"
            />

            <h3 className="text-xl font-semibold text-center mb-4">
              <button
                onClick={() => setOpen(true)}
                className="text-[#e16a5b] border border-[#e16a5b] px-4 py-2 rounded-md hover:bg-[#e16a5b] hover:text-white transition"
              >
                Arun Family Story
              </button>
            </h3>
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white max-w-6xl w-full p-8 rounded-lg shadow-lg relative">
            <h2 className="text-2xl font-semibold text-[#e16a5b] mb-4">
              The Arun Family Story
            </h2>

            <hr></hr>
            <br></br>

            <p className="text-gray-700 text-xl leading-relaxed">
              {`My son is 18 years old and has been attending Inclusive World (IW)
              classes, job opportunities, and other IW events for many years
              now. The kind of experience he gets at IW is unique and, true to
              its name, fully inclusive. The attention to detail and organized
              curriculum that IW puts together makes every moment spent in the
              class thoroughly enjoyable. The teachers are incredibly kind and
              encouraging, which builds confidence and a “can do” attitude in
              the students. I cannot praise the volunteers enough. The young and
              energetic volunteers show acceptance as well as belief in the
              student’s abilities and this is a testament to the training that
              IW has provided to them. What makes IW extraordinary is the Person
              Centered Thinking concept that is worked into every interaction.
              By knowing each student’s needs personally, teachers and
              volunteers are able to tailor the classwork to match the interests
              of the student and motivate the students. My son always looks
              forward to the IW events and to interacting with the teachers and
              peer volunteers. He has become more confident, creative, relaxed,
              and social because of the opportunities provided at IW. IW events
              such as the year-end parties are a blast and give students the
              opportunity to simply have fun in a safe environment. We are
              incredibly thankful to IW organizers and volunteers!`}
            </p>
            <br></br>
            <p className="text-2xl">
              {" "}
              – <i>Shanthi Kalpat</i>, Arun’s mom
            </p>
            <br></br>
            <hr></hr>
            <br></br>
            <br></br>
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute bottom-1 right-3 text-white bg-[#e16a5b] px-2 py-4 hover:text-black text-xl mb-3 mt-6 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MeetFamily;
