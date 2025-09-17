import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-1/2 flex flex-col">
        <div className="ml-2">
          <img src="/img/NavLogo.png" alt="" width={100} />
        </div>
        <div>
        <NavMenu className="ml-2"/>
        </div>
      </SheetContent>
    </Sheet>
  );
};
