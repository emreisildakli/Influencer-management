import React from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionItem = motion(NavigationMenuItem);

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const itemClasses =
    "block data-[active=true]:bg-accent select-none space-y-1 rounded-md p-3 px-5 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer";

  const linkClasses = "cursor-pointer";
  const itemTransition = { scale: 1.05, transition: { ease: ["easeIn", "easeOut"], duration: 0.3 } };

  const isActive = (path: string) => {
    return pathname?.toLowerCase().includes(path);
  };

  return (
    <NavigationMenu className="relative z-10 h-[100px] flex items-center justify-center max-w-full p-8">
      <NavigationMenuList className="group flex flex-1 list-none items-center justify-center space-x-1">
        <MotionItem
          className={itemClasses}
          onClick={() => navigate("/influencers")}
          data-active={isActive("/influencers")}
          whileHover={itemTransition}
        >
          <NavigationMenuLink className={linkClasses}>Home</NavigationMenuLink>
        </MotionItem>

        <MotionItem
          className={itemClasses + " ml-auto"}
          onClick={() => window.open("https://github.com/emreisildakli", "_blank")}
          whileHover={itemTransition}
        >
          <NavigationMenuLink className={linkClasses}>Emre Işıldaklı</NavigationMenuLink>
        </MotionItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
