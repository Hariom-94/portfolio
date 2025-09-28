import Logo from "../assets/logo.png";

const NavLayout = ({ setIsChecked, isChecked }) => {
  return (
    <header className="container mx-auto flex gap-5 justify-between items-center bg-[#ffffff10] px-5 py-3 sm:px-10 sm:py-5 rounded-4xl">
      <a href="#home" className="logo">
        <img src={Logo} alt="Logo" className="max-w-[70px] max-h-[70px]" />
      </a>
      <div className="menu">
        <label className="hamburger">
          <input
            type="checkbox"
            checked={isChecked} // Binds the checkbox's checked state to your component's state
            onChange={(e) => {
              e.stopPropagation(); // This prevents the click from reaching the document
              setIsChecked((prev) => !prev);
            }} // Attaches the handler
          />
          <svg viewBox="0 0 32 32">
            <path
              class="line line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            ></path>
            <path class="line" d="M7 16 27 16"></path>
          </svg>
        </label>
      </div>
      <div className={`navigation ${isChecked && "show"}`}>
        <ul className="flex sm:gap-10 gap-7">
          <li>
            <a href="#home" onClick={() => setIsChecked(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#projects" onClick={() => setIsChecked(false)}>
              Projects
            </a>
          </li>
          <li>
            <a href="#pricing" onClick={() => setIsChecked(false)}>
              Pricing
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setIsChecked(false)}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavLayout;
