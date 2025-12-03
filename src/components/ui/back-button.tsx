'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function BackButton({ 
  href, 
  label = 'Back', 
  variant = 'ghost',
  className 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={cn(
        'group transition-all duration-300 hover:scale-105',
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      {label}
    </Button>
  );
}
