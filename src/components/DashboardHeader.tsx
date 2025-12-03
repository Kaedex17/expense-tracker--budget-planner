'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, Download } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  onExportCSV: () => void;
}

export function DashboardHeader({ onExportCSV }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="border-b bg-card shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-card/95 animate-slide-in-left">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-2 animate-fade-in animation-delay-100">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              className="transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 transition-transform duration-500" />
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onExportCSV}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}