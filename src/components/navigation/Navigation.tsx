import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

interface NavigationProps {
  currentView: 'study' | 'create' | 'manage';
  onViewChange: (view: 'study' | 'create' | 'manage') => void;
  user?: any;
}

export default function Navigation({ currentView, onViewChange, user }: NavigationProps) {
  const { signOut } = useAuth();
  return (
    <nav className="w-full bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Cognition Cards
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === 'study' ? 'default' : 'outline'}
              onClick={() => onViewChange('study')}
              className={cn(
                "transition-all duration-300",
                currentView === 'study' && "shadow-glow-primary"
              )}
            >
              Study
            </Button>
            <Button
              variant={currentView === 'create' ? 'default' : 'outline'}
              onClick={() => onViewChange('create')}
              className={cn(
                "transition-all duration-300",
                currentView === 'create' && "shadow-glow-primary"
              )}
            >
              Create Card
            </Button>
            <Button
              variant={currentView === 'manage' ? 'default' : 'outline'}
              onClick={() => onViewChange('manage')}
              className={cn(
                "transition-all duration-300",
                currentView === 'manage' && "shadow-glow-primary"
              )}
            >
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