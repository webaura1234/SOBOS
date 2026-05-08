import { type ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel — full hero image ── */}
      <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">
        <Image
          src="/login-hero.png"
          alt="SOBOS Restaurant POS"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-[42%] bg-white">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
