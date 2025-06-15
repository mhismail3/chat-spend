"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <main style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <p>This page is protected and only visible to authenticated users.</p>
    </main>
  );
} 