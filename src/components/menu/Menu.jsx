import "./Menu.css";

const Menu = ({ onChange }) => {
  return (
    <label for="check">
      <input type="checkbox" id="check" onChange={onChange} />
      <span></span>
      <span></span>
      <span></span>
    </label>
  );
};

export default Menu;
