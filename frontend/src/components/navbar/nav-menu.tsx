import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { type NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { Link } from "react-router";



export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className=" flex flex-col items-start md:flex-row md:items-center md:justify-center ">
      <NavigationMenuItem  >
        <NavigationMenuLink asChild>
          <Link to="#" >
           <h1 className="text-lg">မူလစာမျက်နှာ</h1>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
       <NavigationMenuItem>
        <NavigationMenuLink asChild>
         <Link to="#">
           <h1 className=" text-lg">အစည်းအဝေးများ</h1>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
         <Link to="#">
           <h1 className="text-lg">ဥပဒေများ</h1>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
           <Link to="#">
           <h1 className=" text-lg">ကိုယ်စားလှယ်များ</h1>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      
    </NavigationMenuList>
  </NavigationMenu>
);
