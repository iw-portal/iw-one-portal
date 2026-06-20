import { useState } from "react";
import LeadershipModal from "./LeadershipModal";

const Leaders = [
  {
    id: "srividya.bala",
    name: "Srividya Balaji",
    role: "Secretary",
    bio1: "Srividya Balaji joins us as Secretary of the Board, with the responsibility to manage and run the board meetings and ensure that our organizational objectives are met. Srividya is not new to volunteering, she has served at hospitals, for the homeless, run fundraisers and campaigns. Srividya says, 'I learned early on in life from my parents, who lived a life of service (both of whom are doctors at government hospitals), that the ‘greatest gift you can give is the gift of time’ – I highly encourage everyone to find time to give back to whatever cause is near and dear to their hearts.'",
    bio2: "Srividya has known about Inclusive World since its inception from our founder Madhu. She adds “Inclusive World’s mission is what has drawn me here. What I have observed is the sheer sincerity and commitment with which the founders & other volunteers run these programs. They make such a big difference, they give a sense of purpose and achievement that cannot be matched. I am looking forward to being a part of this journey in helping reach more differently abled youth achieve their potential.",
    bio3: "Srividya holds a BS & MS in Electrical Engineering and is currently the Global Head of Professional Services and Solution Architecture at Wrike. Srividya loves outdoor activities like running & hiking, and also enjoys cooking, music, and dance. She lives in San Jose with her husband, who she says “has always been the wind beneath my wings”, and her two children Arya and Keshav, who are in college. She is a HUGE dog lover and has two adorable pups!",
    bio4: "Welcome Srividya, and we thank you for taking on this responsibility!",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2022/01/SrividyaBScaled.png",
  },
  {
    id: "janaki.venka",
    name: "Janaki Venkatasubramanian",
    role: "Treasurer and MS Excel Class Lead",
    bio: "Janaki is the financial backbone of Inclusive World. In her role as Treasurer, Janaki critically appraises the organization’s financial standing, policies and procedures, process controls, drives budgeting and reporting as well as our fundraising work.  In addition, Janaki is a Class Lead for the intermediate MS Excel Classes. Her goal is to teach and enable students to fall in love with numbers and be able to organize data  while learning the tools and techniques of MS Excel. Janaki comes with  a decade long experience with the Financial Planning and Analysis group at Siemens where she is Head of Performance Controlling. Janaki has previously volunteered at temples and schools but inspired by the passion and vision of the founders of IW, she joined IW as her first formal volunteer work, where she is part of the Leadership team. When she is not crunching numbers, Janaki loves to travel, cook and to enjoy time with the family and her dear Nella (her dog).",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/08/JanakiVenkat.jpg",
  },
  {
    id: "gowri.kutha",
    name: "Gowri Kuthanur",
    role: "Board Member",
    bio: "Gowri leads Inclusive World’s efforts towards adopting Person Centered Thinking and in the development and implementation of building One-page profiles for all our members and volunteers. Gowri believes that person centered approaches and asset-based teaching have the power to unlock our members’ potential by focusing on their interest, abilities and talents. She is passionate about education and believes access to free flowing knowledge can change and empower all. After spending 15 years as a Software and Systems Engineer in the SF bay area, Gowri has been engrossed in the education field for the last eight years as a learning Coach/Instructional Aide for her own daughter, a  differently abled youth at Inclusive World. Gowri keeps her passion for learning strong by continuing education through Coursera courses. She enjoys listening to music, reading, cooking and hiking with her family and friends.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/08/GowriKuthanur.jpg",
  },
  {
    id: "rohini.pancha",
    name: "Rohini Panchapakesan",
    role: "Executive Director",
    bio: "As Executive Director, Rohini is  responsible for planning, organization, and the direction of the organization’s operations and programs, towards Inclusive World’s strategic goals. Rohini loves to explore opportunities for continuous learning, improvising and serving in her role at Inclusive World. She brings a wide range of management knowledge and experience from managing and leading a software development team and involvement with Chinmaya mission as a parent as well as a volunteer teacher to teach spirituality to elementary school kids. Rohini’s journey began with attending a workshop in her children’s school that inspired her to commit her time to positively engaging with people with different abilities. Her association with Inclusive World began through volunteering opportunities that her children pursued at the organization. Over time as she got more immersed in the mission, Rohini took the plunge to dedicate her time to organize and run program operations by leveraging her in-depth corporate experience. Her relentless pursuit of bringing the organization together in its journey makes Rohini a core asset on the Leadership team. Rohini is a music lover and listens to all kinds of music and loves to sing classical Carnatic music. She also loves going out on hikes with friends and family.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/08/RohiniPanchapakesan.jpg",
  },
  {
    id: "jaya.rupa",
    name: "Jaya Rupanagunta",
    role: "Strategy Advisor",
    bio: "In her role as a Strategy Advisor, Jaya Rupanagunta supports the leadership team by undertaking strategic initiatives that help us inch closer towards our mission and tracks our progress in making that success a reality. Jaya has more than 20 years of experience in Banking and Financial Services as well as the non-profit sector in leadership roles across areas such as product management, business strategy and operations, FP&A and impact research & analytics. She appreciates different genres of music and dance. In her spare time, she tinkers in DIY arts & crafts and culinary experiments, loves the outdoors and cuddles with her kids and her dog Frodo. Jaya first came across Inclusive World at a UNDP conference in Palo Alto a few years ago. She was very impressed by the organization and its vision and initially undertook project based work. Excited by the opportunity to contribute to building a strong sustainable social impact organization, Jaya joined Inclusive World formally in 2020.",
    image: "https://inclusiveworld.org/wp-content/uploads/2020/12/JayR.jpg",
  },
  {
    id: "geetha.gopal",
    name: "Geetha Gopalakrishnan",
    role: "Co-Head, Arts & Crafts Small Business",
    bio: "Geetha Gopalakrishnan has been involved with Inclusive World since 2013 and currently she is the co-head of Arts & Crafts Small Business  alongside Maria Hassonjee. She enjoys her time in class interacting with members and volunteers and feels ever so proud in seeing them grow over the years. As a Core team member, Geetha is also involved in many different aspects of the organization. Geetha has been a Bay area resident for the last twenty years and currently works as an IT Manager in a tech company. Committed to giving back to her community and believing in the power and spirit of volunteering, Geetha volunteers her time for few other non-profit organizations, besides Inclusive World. She enjoys running, cooking and yoga in her spare time and is an avid Marathoner.",
    image: "https://inclusiveworld.org/wp-content/uploads/2020/08/GeetaG.jpg",
  },
  {
    id: "vidya.bharat",
    name: "Vidya Bharat",
    role: "Advisory Board Member",
    bio: "We are so happy to share that Vidya Bharat has joined Inclusive World as an Advisory Board Member. Vidya has been a long-time patron and well-wisher and has been advising IW with various technology products since 2017. Vidya enjoys program development and looks forward to advising IW in this capacity as Advisory Board Member. Vidya holds a Master’s in Computer Science and brings a wealth of experience from her work at Intel and as Head of Engineering in various technology companies. Vidya wanted to further impact the community in different ways and found her passion in Psychology. She completed her PhD. in clinical psychology in 2019 and has switched careers and currently works as a clinical psychologist at the United States Department of Veterans Affairs. Vidya co-founded Cognimint along with a group of high school youth in 2020 to develop mobile applications for helping individuals in improving cognitive skills. She mentors the Cognimint team where she is able to leverage her expertise in technology along with her knowledge of psychology. Vidya likes singing karaoke songs with her family of three boys and friends over the weekend as well as going out for walks. Her motto in life is “Life is short and live it to the fullest without regrets.” Welcome aboard, Vidya!",
    image: "https://inclusiveworld.org/wp-content/uploads/2021/07/VidyaB.png",
  },
];

// const Leadership = () => {
//   const [selectedLeader, setSelectedLeader] = useState(null);

//   return (
//     <div className="px-24 py-16">
//       <h2 className="text-2xl md:text-3xl font-semibold text-left mb-12">
//         Leadership
//       </h2>

//       <div className="grid grid-cols-8 gap-x-2 ml-10 gap-y-10 justify-items-center">
//         {Leaders.map((leader, index) => (
//           <div
//             key={index}
//             onClick={() => setSelectedLeader(leader)}
//             className={`col-span-2 text-center ${
//               index === 4 ? "col-start-2" : ""
//             }`}
//           >
//             <img
//               src={leader.image}
//               alt={leader.name}
//               className="w-64 h-80 border-2 border-[#9e2552] rounded-2xl object-cover"
//             />

//             <p className="font-semibold mt-4">{leader.name}</p>
//             <p className="text-gray-600">{leader.role}</p>
//           </div>
//         ))}
//       </div>
//       {/* Modal */}
//       <LeadershipModal
//         leader={selectedLeader}
//         onClose={() => setSelectedLeader(null)}
//       />
//     </div>
//   );
// };

// export default Leadership;

const Leadership = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-10">
        Leadership
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Leaders.map((leader, index) => (
          <div
            key={index}
            onClick={() => setSelectedLeader(leader)}
            className="text-center cursor-pointer"
          >
            <img
              src={leader.image}
              alt={leader.name}
              className="w-full max-w-[260px] mx-auto h-auto md:h-72 border-2 border-[#9e2552] rounded-2xl object-cover"
            />

            <p className="font-semibold mt-4">{leader.name}</p>
            <p className="text-gray-600 text-sm">{leader.role}</p>
          </div>
        ))}
      </div>

      <LeadershipModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
};

export default Leadership;
