import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LogOut,
  NotebookPen,
  CalendarPlus2,
  FolderOpen,
  AlignJustify,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface NavigationProps {
  currentView: "Study" | "Create" | "Manage";
  onViewChange: (view: "Study" | "Create" | "Manage") => void;
  user?: any;
}

export default function Navigation({
  currentView,
  onViewChange,
  user,
}: NavigationProps) {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuButtonRef.current?.contains(target)) {
        setMobileMenuOpen((prev) => !prev);
        return;
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobileMenuOpen]);

  const closeModal = () => setMobileMenuOpen(false);

  return (
    <nav className="w-full bg-card/80 backdrop-blur-sm border-b border-border relative">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                FC
              </span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              FlashCards
            </h1>
          </div>

          <button ref={menuButtonRef} className="md:hidden text-gray-600">
            <AlignJustify />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant={currentView === "Study" ? "default" : "outline"}
              onClick={() => onViewChange("Study")}
              className={cn(
                "transition-all duration-300 border-gray-600",
                currentView === "Study" && "shadow-glow-primary outline-1 outline-dashed outline-purple-500 outline-offset-2"
              )}
            >
              <NotebookPen className="w-4 h-4" />
              Study
            </Button>
            <Button
              variant={currentView === "Create" ? "default" : "outline"}
              onClick={() => onViewChange("Create")}
              className={cn(
                "transition-all duration-300 border-gray-600",
                currentView === "Create" && "shadow-glow-primary outline-1 outline-dashed outline-purple-500 outline-offset-2"
              )}
            >
              <CalendarPlus2 className="w-4 h-4" />
              Create Card
            </Button>
            <Button
              variant={currentView === "Manage" ? "default" : "outline"}
              onClick={() => onViewChange("Manage")}
              className={cn(
                "transition-all duration-300 border-gray-600",
                currentView === "Manage" && "shadow-glow-primary outline-1 outline-dashed outline-purple-500 outline-offset-2"
              )}
            >
              <FolderOpen className="w-4 h-4" />
              Manage Cards
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={signOut}
                className="ml-4 flex items-center gap-2 border-gray-600 "
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed flex items-center justify-center bg-black/50 top-16 right-0 rounded-md z-50 transition-all duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        ref={mobileMenuRef}
      >
        <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                onViewChange("Study");
                closeModal();
              }}
            >
              <NotebookPen className="w-4 h-4" />
              Study
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onViewChange("Create");
                closeModal();
              }}
            >
              <CalendarPlus2 className="w-4 h-4" />
              Create Card
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onViewChange("Manage");
                closeModal();
              }}
            >
              <FolderOpen className="w-4 h-4" />
              Manage Cards
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={() => {
                  signOut();
                  closeModal();
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
