import AfterEffect from "../../assets/afterEffect.svg"; // adjust path
import PremierePro from "../../assets/premiere-pro.svg"; // adjust path
import Krita from "../../assets/krita.svg"; // adjust path
import CapCut from "../../assets/capcut.png"; // adjust path
import AfterMotion from "../../assets/after-motion.webp"; // adjust path
import Photoshop from "../../assets/photoshop.png"; // adjust path
import SectionHeader from "./SectionHeader";

const skills = [
  { id: 1, title: "After Effect", img: AfterEffect },
  { id: 2, title: "After Motion", img: AfterMotion },
  { id: 3, title: "Premiere Pro", img: PremierePro },
  { id: 4, title: "Krita", img: Krita },
  { id: 5, title: "Photoshop", img: Photoshop },
  { id: 6, title: "CapCut", img: CapCut },
];

export default function Skills() {
  return (
    <>
      <div className="bg"></div>
      <SectionHeader heading={"Software I Use"} />
      <div className="skills-cards grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mt-10 sm:mt-15">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="card bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center"
          >
            <div className="blur"></div>
            <div className="card-img w-12 h-12 sm:w-16 sm:h-16 mb-4">
              <img
                src={skill.img}
                alt={skill.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="card-title text-center">
              <h3 className="text-[0.7rem] sm:text-base lg:text-lg font-light tracking-wider text-gray-800">
                {skill.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
