import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { useTheme } from "@/providers/theme-provider";
import { Sun, Moon, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router";
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="h-18 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-screen-xs mx-auto px-4  ">
        {/* Logo */}
      <img src="/img/NavLogo.png" alt="" width={100}  />
        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          {theme === "light" ? (
            <Moon
              className="h-[1.2rem] w-[1.2rem]"
              onClick={() => setTheme("dark")}
            />
          ) : (
            <Sun
              className="h-[1.2rem] w-[1.2rem]"
              onClick={() => setTheme("light")}
            />
          )}
          <Link to="/login">
            <Button className="rounded-full">
              <LogIn />
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="rounded-full">
              <UserPlus />
              Register
            </Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
