import { useState, useEffect } from "react";
import FounderModal from "./FounderModal";

const Founders = [
  {
    id: "madhu.krish",
    name: "Madhu Krishnan",
    role: "Co-Founder, President",
    lead: "Class Lead, Scratch Programming",
    image: "https://inclusiveworld.org/wp-content/uploads/2020/12/MadhuK.jpg",
    intro:
      "is the co-founder and President of Inclusive World. She holds a Masters degree in Computer Applications and has worked in the high tech industry for over 18 years. At Inclusive World, Madhu heads strategy and planning and forges partnerships with local organizations. She also teaches Scratch Programming. Madhu enjoys spending time outdoors, hiking and running with her dog Jazzy and tending to her vegetable garden. Madhu believes that every human is born with innate potential, when tapped, helps them lead productive and content lives. Madhu founded Inclusive World to provide a place for individuals with different abilities to discover and grow their abilities and interests and set them on a path to lead happy lives.",
  },
  {
    id: "deepa.laksh",
    name: "Deepa Lakshminarayan",
    role: "Co-Founder",
    lead: "Advisory Board Member",
    image: "https://inclusiveworld.org/wp-content/uploads/2020/12/DeepaL.jpg",
    fit: "contain",
    intro:
      "is a program manager in the Silicon Valley. As co-founder of Inclusive World, Deepa wears multiple hats including Production Manager and Class Lead for our Arts & Crafts Small Business unit and as a Board Member. Deepa likes to get creative using various media like painting, crafts, jewelry making to name a few. With a deep passion to make a difference to her community, she actively engages and spearheads local community events. Deepa felt the need to help youth who were not seen for their abilities, but always noticed for their disabilities. Alongwith the co-founders of Inclusive World, it has been her endeavor to create an environment where the potential of our differently abled young folks is nurtured. With the help of neurotypical teens and youth acting as their peer buddies, she has strived to create a safe environment for growth and friendships for our members. The peer group environment has opened up avenues for learning, acceptance, friendships and inclusion for all stakeholders, resulting in win-win outcomes at both ends.",
  },
  {
    id: "swapna.iyer",
    name: "Swapna Iyer",
    role: "Co-Founder",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2021/02/profilePic.jpeg",
    lead: "",
    intro:
      "is an AI engineer, currently at Intel. She holds a masters degree in Electrical Engineering and coaches in Algorithms and programming with Interview Kickstart. She has found her calling in building software systems that change the world for the better. To bring the world of Computer Science to the differently abled youth and to foster in them creativity, self-confidence and everyday happiness of being able to make valuable contributions to the society they live in – is the reason why, Swapna helped setup Inclusive World. She remains a steadfast supporter and cherishes the time with all the members and families who receives the support of Inclusive World.",
  },
];

const Founder = () => {
  const [selectedFounder, setSelectedFounder] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16 space-y-12">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
        Founders
      </h2>

      {/* GRID instead of stacked rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {Founders.map((founder) => (
          <div
            key={founder.id}
            onClick={() => setSelectedFounder(founder)}
            className="cursor-pointer text-center"
          >
            <img
              src={founder.image}
              alt={founder.name}
              className="w-full max-w-[260px] mx-auto h-auto md:h-72 border-2 border-[#9e2552] rounded-2xl object-cover transition hover:scale-105"
            />

            <p className="font-semibold mt-4">{founder.name}</p>
            <p className="text-gray-600 text-sm">{founder.role}</p>
            {founder.lead && (
              <p className="text-gray-600 text-sm">{founder.lead}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <FounderModal
        founder={selectedFounder}
        onClose={() => setSelectedFounder(null)}
      />
    </div>
  );
};

export default Founder;
