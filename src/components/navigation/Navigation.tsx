import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, NotebookPen, CalendarPlus2, FolderOpen, Eye } from "lucide-react";

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
  return (
    <nav className="w-full bg-card/80 backdrop-blur-sm border-b border-border">
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

          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === "Study" ? "default" : "outline"}
              onClick={() => onViewChange("Study")}
              className={cn(
                "transition-all duration-300 border-gray-600",
                currentView === "Study" && "shadow-glow-primary"
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
                currentView === "Create" && "shadow-glow-primary"
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
                currentView === "Manage" && "shadow-glow-primary"
              )}
            >
              <FolderOpen className="w-4 h-4" />
              Manage Cards
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={signOut}
                className="ml-4 flex items-center gap-2"
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
