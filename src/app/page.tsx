'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, PieChart, Wallet, Target, Moon, Sun, ArrowRight, Sparkles, BarChart3, Shield } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse animation-delay-500" />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-[10%] w-2 h-2 bg-primary/30 rounded-full animate-bounce-slow" />
      <div className="absolute top-40 right-[15%] w-3 h-3 bg-primary/20 rounded-full animate-bounce-slow animation-delay-300" />
      <div className="absolute bottom-40 left-[20%] w-2 h-2 bg-primary/25 rounded-full animate-bounce-slow animation-delay-700" />

      {/* Theme toggle button */}
      <div className="absolute top-6 right-6 z-50 animate-fade-in">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="relative group backdrop-blur-md bg-card/50 border-2 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180 relative z-10" />
          ) : (
            <Moon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[-180deg] relative z-10" />
          )}
        </Button>
      </div>

      <main className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in">
          <div className="flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl animate-pulse" />
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border border-primary/20 group hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
              <Wallet className="h-20 w-20 text-primary animate-bounce-slow" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Expense Tracker
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up animation-delay-100">
            Take control of your finances with{' '}
            <span className="text-foreground font-semibold">intelligent tracking</span>,{' '}
            <span className="text-foreground font-semibold">smart budgeting</span>, and{' '}
            <span className="text-foreground font-semibold">beautiful insights</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-200">
            <Link href="/register">
              <Button 
                size="lg" 
                className="group relative text-lg px-10 py-6 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="relative text-lg px-10 py-6 border-2 backdrop-blur-sm bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Sign In</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <Card className="relative group border-2 backdrop-blur-sm bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in animation-delay-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                <TrendingUp className="h-7 w-7 text-primary transition-transform duration-500 group-hover:scale-110" />
              </div>
              <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">Track Expenses</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Effortlessly log and categorize every transaction with our intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative group border-2 backdrop-blur-sm bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in animation-delay-400 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                <PieChart className="h-7 w-7 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-180" />
              </div>
              <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">Visual Insights</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Beautiful charts and graphs reveal your spending patterns instantly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative group border-2 backdrop-blur-sm bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in animation-delay-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                <Target className="h-7 w-7 text-primary transition-transform duration-500 group-hover:scale-110" />
              </div>
              <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">Smart Budgets</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Set category budgets and track progress with real-time notifications
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative group border-2 backdrop-blur-sm bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in animation-delay-600 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                <BarChart3 className="h-7 w-7 text-primary transition-transform duration-500 group-hover:scale-110" />
              </div>
              <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">Export Reports</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Download comprehensive expense reports in CSV format anytime
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 animate-fade-in animation-delay-700">
          <div className="text-center p-8 rounded-2xl backdrop-blur-sm bg-card/30 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              100%
            </div>
            <div className="text-muted-foreground font-medium">Free Forever</div>
          </div>
          <div className="text-center p-8 rounded-2xl backdrop-blur-sm bg-card/30 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              <Shield className="inline h-12 w-12" />
            </div>
            <div className="text-muted-foreground font-medium">Secure & Private</div>
          </div>
          <div className="text-center p-8 rounded-2xl backdrop-blur-sm bg-card/30 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group">
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-muted-foreground font-medium">Always Available</div>
          </div>
        </div>

        {/* Demo Account Card */}
        <Card className="max-w-3xl mx-auto relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-card/80 via-card/50 to-card/80 border-2 border-primary/30 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 animate-fade-in animation-delay-700 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Try Demo Account
              </CardTitle>
              <Sparkles className="h-5 w-5 text-primary animate-pulse animation-delay-300" />
            </div>
            <CardDescription className="text-center text-base">
              Experience all features with pre-loaded sample data
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center relative z-10">
            <div className="backdrop-blur-sm bg-muted/50 p-6 rounded-xl mb-6 border border-primary/20 transition-all duration-300 hover:bg-muted/70 hover:border-primary/40 group/demo">
              <p className="font-mono text-sm mb-2 flex items-center justify-center gap-2">
                <strong className="text-foreground">Email:</strong> 
                <span className="text-primary group-hover/demo:text-primary/80 transition-colors">demo@example.com</span>
              </p>
              <p className="font-mono text-sm flex items-center justify-center gap-2">
                <strong className="text-foreground">Password:</strong> 
                <span className="text-primary group-hover/demo:text-primary/80 transition-colors">demo123</span>
              </p>
            </div>
            
            <Link href="/login">
              <Button 
                size="lg"
                className="group/btn relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 px-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary transition-transform duration-300 group-hover/btn:scale-110" />
                <span className="relative flex items-center gap-2">
                  Try Demo Now
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-24 text-center text-muted-foreground animate-fade-in animation-delay-700">
          <p className="text-sm">
            Made with ❤️ for better financial management
          </p>
        </div>
      </main>
    </div>
  );
}