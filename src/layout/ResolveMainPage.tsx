import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  LayoutGrid, 
  Bell, 
  Settings, 
  Menu 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDarkTheme, toggleTheme }: NavbarProps) {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Handle Time and Greeting
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      let greet = "Good Evening";
      if (hour < 12) greet = "Good Morning";
      else if (hour < 18) greet = "Good Afternoon";
      
      setGreeting(greet);
      
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    // Update every minute to keep current
    const interval = setInterval(updateTime, 60000); 

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled 
          ? isDarkTheme 
            ? "bg-zinc-950/80 backdrop-blur-xl border-zinc-800 py-3" 
            : "bg-white/80 backdrop-blur-xl border-zinc-200/60 py-3"
          : isDarkTheme
            ? "bg-zinc-950 border-transparent py-5"
            : "bg-zinc-50 border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className={`w-6 h-6 ${isDarkTheme ? "text-zinc-400" : "text-zinc-600"}`} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5 shadow-lg shadow-blue-600/20">
              <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className={`text-lg md:text-xl font-black tracking-tighter ${isDarkTheme ? "text-white" : "text-zinc-900"}`}>
              Momentum
            </span>
          </div>
        </div>

        {/* Center: Greeting (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2">
          <h1 className={`text-sm font-medium ${isDarkTheme ? "text-zinc-400" : "text-zinc-500"}`}>
            {currentDate}
          </h1>
          <p className={`text-lg font-bold ${isDarkTheme ? "text-zinc-100" : "text-zinc-800"}`}>
            {greeting}, <span className="text-blue-500">Dikie</span>
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            onClick={toggleTheme} 
            variant="ghost" 
            size="icon"
            className={`rounded-full w-9 h-9 md:w-10 md:h-10 ${isDarkTheme ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
          >
            {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`hidden md:flex rounded-full w-10 h-10 ${isDarkTheme ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
          >
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full ml-1">
                <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-blue-600/20">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@dikie" />
                  <AvatarFallback className="bg-blue-600 text-white font-bold">DK</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dickens Omondi</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    dikie@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}