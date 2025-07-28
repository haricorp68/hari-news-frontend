"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/modules/auth/auth.store";

export default function Home() {
  const { setShowLoginDialog } = useAuthStore();
  return (
    <div className="max-w-2xl mx-auto py-8 grid gap-6">
      <Button onClick={() => setShowLoginDialog(true)}>
        Open Login Dialog
      </Button>
    </div>
  );
}
