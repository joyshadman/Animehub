import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/home"}>
    <div className="flex items-center space-x-2">
      <h1 className="gradient-text select-none flex text-3xl">JoyNime</h1>
    </div>
    </Link>
  );
};

export default Logo;
