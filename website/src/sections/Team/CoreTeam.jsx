import { useState } from "react";
import CoreTeamModal from "./CoreTeamModal";

const CoreTeamMembers = [
  {
    id: "dharma.kuthanur",
    name: "Dharma Kuthanur",
    role: "Coordinator, Grants",
    bio: "As the Coordinator of Grants, Dharma Kuthanur manages the process of applying for sustainable grants that can help fund program initiatives. Such grants are necessary to cover the upfront costs of ongoing programs and expand into new programs. Dharma is a Product management & marketing professional in the Silicon Valley. He currently works on Product Marketing for a data & analytics software company. In his free time, Dharma likes to read, travel, hike with the family, run and cook. The mission of Inclusive World coupled with the passion and commitment of the team towards this mission inspired Dharma to be part of our organization.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/08/DharmeshK.jpg",
  },
  {
    id: "pallavi.kuthanur",
    name: "Pallavi Kuthanur",
    role: "Inventory Controller",
    bio: "In her role as Inventory Controller, Pallavi Kuthanur keeps track of the inventory of the products created by the Arts and Crafts Small Business at Inclusive World. Pallavi has been a proud and enthusiastic student in many of our programs since inception. She finds great joy in her role in both maintaining and seeing the stock flow sheets after sales. Pallavi is a student of Accounting and Economics, at San Jose City College. Pallavi likes to listen to all genres of music to relax, watch movies and likes to go on hikes with her family. She also likes to read and write poetry.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/09/PallaviKuthanur.jpg",
  },
  {
    id: "shalini.suresh",
    name: "Shalini Suresh",
    role: "Manager, Volunteer & Member Relations",
    bio: "In her role as a Manager Volunteer & Member relations, Shalini Suresh recruits and manages a large base of members and volunteers in the organization. In the past, Shalini worked in the Arts and Crafts Small Business Program. Shalini was instrumental in setting up the Shasta-Kidly-Inclusive World collaboration. Shalini works at Cisco designing specialized computer chips. In her free time she loves to read, do  puzzles, do yoga, and spend time with her friends and family. Her search to learn how to interact with her friend’s child who was differently abled, led Shalini to join the Inclusive World team and be an instrumental force in an impactful journey.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/08/ShaliniSuresh.jpg",
  },
  {
    id: "sangeetha.ram",
    name: "Sangeetha Ram",
    role: "Class Lead, MS Excel Level 1",
    bio: "Sangeetha Ram is the Class Lead for the basic Excel class. With an education background in Computer Science, Sangeetha works as a Travel Agent. In her free time she enjoys cooking, reading and hiking. She was intrigued by the organization’s work after seeing the greeting cards made by Inclusive World’s members and wanted to be part of the Inclusive World team. In the process of getting to know and supporting the organization, she learned how to tailor our programs to fit individual member needs and took on the pivotal role of leading the Basic Excel class.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/08/SangeethaRam.jpg",
  },
  {
    id: "geetha.kannan",
    name: "Geetha Kannan",
    role: "Class Lead, Arts & Crafts Small Business",
    bio: "Geetha Kannan is a class lead for Arts and Crafts Small Business program. Her background is in Physics and Computer Science. Geeta currently works as a Behavior Therapist which she feels helps her understand how to approach certain situations better. In her spare time, Geetha likes to read, do gardening and baking. Her journey began way back in 2012 as a volunteer in the Arts and Crafts Small Business Program.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/09/Geetha_Kannan.jpg",
  },
  {
    id: "rucha.desai",
    name: "Rucha Desai",
    role: "Class Lead, Arts & Crafts Small Business",
    bio: "Rucha Desai is a class lead for Arts and Crafts Small Business Program. Rucha holds a Bachelor’s degree in Chemical Engineering and a Master’s degree in Engineering (Software) from SJSU. She worked for 6 years at Sun Microsystems. In her free time, Rucha enjoys traveling with her family, cooking and reading. Rucha was introduced to Inclusive World through her daughters who volunteered with the organization for over five years. Enjoying watching our students and volunteers collaborate to create beautiful artwork, Rucha decided to take on a lead role to support our journey.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/09/RuchaDesai.jpg",
  },
  {
    id: "sowmya.janakiraman",
    name: "Sowmya Janakiraman",
    role: "Coordinator, East Bay",
    lead: "Class Lead, Software Testing Level 1",
    bio: "Introduced to Inclusive World by her friend Geetha Gopalakrishnan in 2015, Sowmya has been actively volunteering for the organization since then and initiated the East Bay program.  Sowmya, an-ex techie in Information Technology services, served as Executive Vice President of the Board at Hidden Hills HAWKS EDFUND. She has participated in many fundraising and community outreach initiatives. Sowmya is currently happily settled as a full time homemaker cherishing the little pleasures of life like a good cup of coffee, spending time with family and friends and listening to her diverse playlist of music. Sowmya believes that there is nothing more rewarding and fulfilling than bringing a smile in someone’s life even if it were momentary.  In addition, Sowmya recently took on the role of a Class Lead for Software Testing Level 1 class.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2020/09/Sowmya-Janakiraman.jpg",
  },
  {
    id: "srilatha.sekaripuram",
    name: "Srilatha Sekaripuram",
    role: "Graphics Designer",
    bio: "We are so excited to welcome Srilatha Sekaripuram to our Inclusive World Team as our Graphics Designer for the Digital Marketing Team! Srilatha has been following Inclusive World for a while and has always been excited to see how much the organization has grown and the impact it has had, and she looks forward to helping the marketing team grow our audience and online presence even more. She was drawn to this particular role because of the creative nature of the work she would be doing. As a Director of Product Management at Verizon Media, she says that this position has given her, “an opportunity to grow and contribute in a space that I am very new to but have always been curious about.” She hopes that those who are on the fence about volunteering look for opportunities to find things “you love to do while helping a cause you are passionate about!” Srilatha has already demonstrated her passion for graphic design by hosting a session on Canva for our youth as part of our Guest Artist series. Srilatha, we are so glad that you are part of team IW!",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2021/07/SrilathaS.png",
  },
  {
    id: "usha.narayanan",
    name: "Usha Narayanan",
    role: "Newsletter Coordinator",
    bio: "Usha Narayanan was drawn to Inclusive World’s mission and wanted to contribute to the organization and she began volunteering in 2019,  at the same time as her son. She is inspired by the volunteers in Inclusive World and the passion they have for the work they do for the organization. Usha has taken on the role of Newsletter Coordinator and is responsible for collaborating with volunteers and leads to deliver the quarterly Inclusive World newsletter. Usha has a Master’s in Computer Science and works in the tech industry. Outside of work and volunteering, she enjoys gardening. Volunteering at Inclusive World has taught Usha the importance of learning from each experience. She looks forward to another great year with Inclusive World.  Thank you, Usha, for taking on this leadership responsibility!",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2022/01/UshaNScaled-1.png",
  },
  {
    id: "shobana.narasimhan",
    name: "Shobana Narasimhan",
    role: "Conversation Skills Program Co-Lead",
    bio1: "Shobana resides in San Jose with her husband and two teenage children. She currently works at VMWare and has worked in the tech industry for a long time. Shobana was brought to Inclusive World through both of her children. Inclusive World was part of several cultural events that she and her daughter attended, and her teenage son volunteered with the arts and crafts program. She identified with the mission, and immediately knew she wanted to volunteer, so when the opportunity to take up the lead role for the Conversational Skills program presented itself, she gladly stepped into the role. . Before her involvement with Inclusive World, Shobana volunteered with Asha for Education, working to help the underprivileged in India receive an education. In more recent years, volunteering sometimes had to “take a backseat” as work and family have kept Shobana busy, but her enthusiasm and readiness to dive back into volunteering are evident!",
    bio2: "Shobana has been impressed with the dedication of her conversational skills team, as well as other programs at Inclusive World, and will clearly keep the energy and dedication alive. Shobana looks forward to future interactions with students and their families, as well as helping to shape the program, surely for the better.  Shobana encourages those considering volunteering, to take the next step, and start volunteering, highlighting the many options and great team support that Inclusive World has to offer. Shobana, we are so happy that you have taken on this Lead role!",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2022/01/ShobanaNScaledNEW.jpg",
  },
  {
    id: "anandi.velayuthan",
    name: "Anandi Velayuthan",
    role: "Content Writer",
    bio1: "Anandi joins us as a content writer to work with the digital marketing team. She is excited to offer her skills and learn more about our organization. She looks forward to this role as an opportunity to give back to the community.",
    bio2: "Anandi is an Indian Craft and Textile Entrepreneur, working to provide sustainable livelihood to Indian craftsmen. She is happily married, enjoys cooking and practicing meditation.",
    bio3: "Thank you, Anandi, for joining Inclusive World as a Content Writer.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2022/11/AnandiVelayuthan-Anandi-Velayuthan.jpeg",
  },
  {
    id: "srivani.nallan",
    name: "Srivani Nallan",
    role: "Summer Program Coordinator",
    bio1: "Srivani joined us in our Operations team to help us be organized for smooth and efficient processes for program executions. She will start as a Summer Program Coordinator.",
    bio2: "Srivani works full time and has two children. She is very passionate about helping women and children and giving back to the community by volunteering her time.",
    bio3: "In her free time, she loves to read books, hiking and has recently taken to gardening.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2022/11/IMG_4352-Srivani-Nallan.jpeg",
  },
  {
    id: "sandhya.charlapathy",
    name: "Sandhya Charlapathy",
    role: "Coordinator of Student-Member Relations",
    bio: "Sandhya joins us as Co-ordinator/Assistant Manager of Student – Member Relations. Her role includes member enrollment, class placements and scouting new leads. Highly impressed by IW member spirit she is committed to giving her best. Her hobbies include watching movies and extensively researching for her son.",
    image: "https://inclusiveworld.org/wp-content/uploads/2022/11/SandhyaC.jpg",
  },
  {
    id: "nithya.nagarajan",
    name: "Nithya Nagarajan",
    role: "Excel Basic Class Lead",
    bio: "Nithya Nagarajan is joining us as a class lead for Excel Basic. Inspired by her daughter who volunteered with IW for the last 2 years, Nithya was moved by the dedication, enthusiasm, perseverance and empathy of our staff and volunteers. From a Finance and Accounting background she is a natural with number crunching and analysis, and has worked on Excel  for a long time. Her hobbies include hiking and reading children’s story books.",
    image: "https://inclusiveworld.org/wp-content/uploads/2022/11/NithyaN.jpg",
  },
  {
    id: "chandrika.hariharan",
    name: "Chandrika Hariharan",
    role: "Python Class Co-Lead",
    bio: "Chandrika Hariharan, is volunteering with IW with the noble intent to give back to the community and set an example for her child. She will co-lead the Python class. Currently a Software quality assurance professional Chandrikal was a homemaker for 15 years actively volunteering in schools and scout events. She is an avid gardener and loves crochet, beading, and DIY crafts.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2022/11/ChandrikaH.jpg",
  },
  {
    id: "madhu.krishnamurthy",
    name: "Madhu Krishnamurthy",
    role: "Small Business Class Co-Lead",
    bio: "Madhu Krishnamurthy is joining us as a Co-lead for the Small Business class! Working with a positive and collaborative attitude, she strongly affirms Inclusive World’s values and openness to creating a community for people on the spectrum! She is inspired by her family member who has Cerebral Palsy and Autism to join Inclusive World. Madhu enjoys going to the arcade with her children to spend quality time! She is passionate about working out and also loves camping, music, movies and gardening.",
    image: "https://inclusiveworld.org/wp-content/uploads/2022/11/MadhuK.jpg",
  },
  {
    id: "debbani.kundu.naskar",
    name: "Debbani Kundu Naskar",
    role: "Mobile App Dev & Web Dev Basic-Level Lead",
    bio: "",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2023/10/myPic-Debbani-Kundu-Naskar.png",
  },
  {
    id: "harshitha.venkatesh",
    name: "Harshitha Venkatesh",
    role: "Outreach Coordinator",
    bio1: "Harshitha Venkatesh is our Outreach Coordinator. She started as a IW volunteer in 2012, driven by a desire to make a positive community impact. She’s held various roles within IW, including as a buddy volunteer, lead instructor, and summer intern.",
    bio2: "Professionally, she is a Neuroscience Research Coordinator at Stanford, where she investigates cognitive, emotional, and social development, as well as brain mechanisms in typically developing children compared to children with math learning disabilities. She is also a skilled dancer. She says, “Through dance, I have learned countless skills of discipline, communication, creativity, and confidence that have helped me succeed.”! Welcome Harshitha!",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2023/10/pic-copy-Harshitha-Venkatesh.jpg",
  },
  {
    id: "vrinda.bangari",
    name: "Vrinda Bangari",
    role: "Excel Intermediate Co-Lead",
    bio1: "Vrinda Bangari volunteers as a co-lead for the Excel Intermediate class, and says that she is driven by her inspiration from Inclusive World’s mission.",
    bio2: "Professionally, she works in the tech industry. She also volunteers as a teacher for middle school children at Chinmaya Mission, emphasizing her commitment to education. Vrinda also likes spending quality time outdoors with her family and enjoys activities like hiking and birding.",
    bio3: "Welcome to Inclusive World Vrinda!",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2023/10/Profile-Vrinda-Bangari-scaled.jpg",
  },
  {
    id: "sateesh.vandavasi",
    name: "Sateesh Vandavasi",
    role: "Software Testing Lead-Instructor",
    bio: "We welcome Sateesh Vandavasi, who is the Lead Instructor for SW Testing class. His motivation for volunteering is rooted in his love for teaching children. In the past Sateesh has taught visually impaired children at Samarthanam in Bangalore.  He was also an active volunteer with RAFT, Debate clubs, AYSO, SHFB, and Krishna temple. He is known for his passion and kindness, always willing to mentor others in pursuing their aspirations. Sateesh works at Cisco as a DevOps Manager and enjoys BollyX Fitness dancing and is a constant learner.",
    image:
      "https://inclusiveworld.org/wp-content/uploads/2023/10/SHFB-Volunteer-Sateesh-Sateesh-Vandavasi-e1698639840717.png",
  },
  {
    id: "pranava.magan",
    name: "Pranava Sai Maganti",
    role: "Mobile App Dev & Web Dev Intermediate-Level Lead",
    bio: "Pranava joins Inclusive World as the lead for the Mobile App Development and Web Development Intermediate-Level programs. He is passionate about using technology to empower students and create opportunities for learning practical skills in software development. Pranava is currently pursuing a degree in Computer Science at Iowa State University, where he is actively involved in teaching, mentoring, and developing technology-focused initiatives. He enjoys helping students understand how technology can be used to build real-world solutions and encourages creativity through coding and application development. In his free time, Pranava enjoys exploring new technologies, working on software projects, and contributing to educational and community initiatives. He is excited to support Inclusive World’s mission of creating inclusive learning opportunities for all.",
    image:
      "https://res.cloudinary.com/ddcxejrmd/image/upload/v1773540698/Pranava_gcrxev.jpg",
  },
];

const CoreTeam = () => {
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-10">
        Core Team
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {CoreTeamMembers.map((member, index) => (
          <div
            key={index}
            onClick={() => setSelectedTeamMember(member)}
            className="text-center cursor-pointer"
          >
            <div className="w-full max-w-[260px] mx-auto aspect-[3/4] overflow-hidden rounded-2xl border-2 border-[#9e2552]">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4">
              <p className="font-semibold">{member.name}</p>
              <p className="text-gray-600 text-sm">{member.role}</p>
              {member.lead && (
                <p className="text-gray-600 text-sm">{member.lead}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <CoreTeamModal
        member={selectedTeamMember}
        onClose={() => setSelectedTeamMember(null)}
      />
    </div>
  );
};

export default CoreTeam;
