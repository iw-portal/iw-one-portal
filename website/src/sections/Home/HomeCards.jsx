// import { FaHandsHolding, FaHandsHelping, FaDonate } from "react-icons/fa6";
import { HandHeart, HandCoins, DollarSign, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const homeCards = [
  {
    id: 1,
    title: "Explore Programs & Services",
    description:
      "Explore technology, vocational, life skills, and employment programs for ages 13+ and adults.",
    buttonText: "Learn more",
    link: "/programs/skills-development",
    icon: HandHeart,
  },
  {
    id: 2,
    title: "Sign up as a member",
    description:
      "Join Inclusive World programs to build skills, grow confidence, and be part of a supportive community.",
    icon: UserPlus,
    buttonText: "Apply Now",
    link: "/apply/member",
  },
  {
    id: 3,
    title: "Sign up to be a volunteer today",
    description:
      "Login to sign up as a volunteer and contribute to societal inclusion while expanding your world perspective.",
    icon: HandCoins,
    buttonText: "Apply Now",
    link: "/apply/volunteer",
  },
  // {
  //   id: 4,
  //   title: "Donate now & make a difference!",
  //   description:
  //     "Login to donate and help fund programs that support differently abled youth in achieving societal inclusion.",
  //   icon: DollarSign,
  //   buttonText: "Login",
  //   link: "/one-portal/login",
  // },
];

const HomeCards = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {homeCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-md p-10 text-center hover:shadow-xl transition"
              >
                <Icon size={60} className="mx-auto text-[#E16A5B] mb-6" />

                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {card.title}
                </h3>

                <div className="w-20 h-[3px] bg-[#E16A5B] mx-auto mb-6"></div>

                <p className="text-gray-600 mb-8">{card.description}</p>

                <Link to={card.link}>
                  <button className="bg-[#E16A5B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#cf5b4c] transition">
                    {card.buttonText}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
