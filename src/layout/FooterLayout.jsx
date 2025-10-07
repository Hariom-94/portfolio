import { TbBrandFiverr } from "react-icons/tb";
import Logo from "../assets/logo.png";
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

const FooterLayout = () => {
  return (
    <footer className="flex flex-col gap-6 text-center items-center py-5 md:flex-row sm:justify-between sm:items-center sm:px-20 md:px-30">
      <a href="#home" className="logo">
        <img src={Logo} alt="" className="max-w-[90px] max-h-[90px]" />
      </a>
      <div className="navigation">
        <ul className="flex flex-col gap-2 md:flex-row sm:justify-between sm:gap-8">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
      <div className="links flex gap-4 justify-center text-xl">
        <a
          href={`https://wa.me/+917364877930?text=${encodeURIComponent(
            "Hi! I was just looking through your website and wanted to connect."
          )}`}
        >
          <FaWhatsapp />
        </a>
        <a href="https://www.instagram.com/harii_0m_">
          <FaInstagram />
        </a>
        <a href="mailto:hariomkumar8988@gmail.com">
          <FaEnvelope />
        </a>
        <a href="https://www.linkedin.com/in/hariiomkumar">
          <FaLinkedinIn />
        </a>
        <a href="https://www.fiverr.com/hariom_89">
          <TbBrandFiverr />
        </a>
      </div>
    </footer>
  );
};

export default FooterLayout;
