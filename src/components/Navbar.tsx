import { Link } from "react-router-dom";
import MicIcon from "./MicIcon";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  return (
    <header className="h-16 flex items-center justify-between px-5 border-b border-border bg-card/80 backdrop-blur-md shrink-0 z-40">
      <Link to="/dashboard" className="flex items-center gap-2">
        <MicIcon size={22} />
        <span className="text-lg font-semibold tracking-tight text-foreground">VoiceScribe</span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
