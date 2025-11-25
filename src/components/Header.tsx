"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface HeaderProps {
  favoritesCount?: number;
  userNameOrEmail?: string | null;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function Header({
  favoritesCount,
  userNameOrEmail,
  className = "bg-linear-to-r from-blue-500 to-gray-700 text-white shadow-lg",
  title = <Link href="/" className="text-3xl font-bold hover:opacity-80 transition-opacity">Influencer Platform</Link>,
  subtitle = <p className="text-blue-100 text-sm mt-1">Discover and manage your favorite influencers</p>,
  rightContent,
}: HeaderProps) {
  return (
    <header className={className}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          {title}
          {subtitle}
        </div>
        {rightContent ?? (
          <div className="flex items-center max-sm:flex-col gap-4">
            <Link
              href="/favorites"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 max-sm:text-sm rounded-lg transition-colors"
            >
            <span className="max-sm:hidden">❤️</span> Favorites ({favoritesCount})
            </Link>
            <div className="text-sm">
              <p>Welcome, {userNameOrEmail}!</p>
            </div>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
