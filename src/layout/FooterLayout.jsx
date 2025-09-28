import Logo from "../assets/logo.png";

const FooterLayout = () => {
  return (
    <footer className="flex flex-col gap-7 text-center items-center py-5 sm:flex-row sm:justify-between sm:items-center sm:px-20 md:px-30">
      <a href="#home" className="logo">
        <img src={Logo} alt="" className="max-w-[90px] max-h-[90px]" />
      </a>
      <div className="navigation">
        <ul className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-8">
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
      <div className="links flex gap-3 justify-center text-xl">
        <a
          href={`https://wa.me/+917364877930?text=${encodeURIComponent(
            "Hi! I was just looking through your website and wanted to connect."
          )}`}
        >
          <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a href="https://www.instagram.com/harii_0m_">
          <i class="fa-brands fa-instagram"></i>
        </a>
        <a href="mailto:hariomkumar8988@gmail.com">
          <i class="fa-solid fa-envelope"></i>
        </a>
        <a href="https://www.linkedin.com/in/hariiomkumar">
          <i class="fa-brands fa-linkedin-in"></i>{" "}
        </a>
      </div>
    </footer>
  );
};

export default FooterLayout;
