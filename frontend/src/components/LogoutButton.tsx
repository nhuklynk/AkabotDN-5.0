"use client";

import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/auth/useLogout";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {logoutMutation.isPending ? (
        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
