import { type ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">RestaurantOS</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/90 to-primary lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold">Manage your restaurant operations</h2>
          <p className="mt-4 text-lg text-white/80">
            Streamline orders, manage staff, track performance, and grow your business with our comprehensive platform.
          </p>
        </div>
      </div>
    </div>
  );
}
