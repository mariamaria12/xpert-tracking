import { Truck } from "lucide-react";
import LoginForm from "@/ui/login/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4">
      <div className="card mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Truck className="h-8 w-8 text-[#22D3EE]" aria-hidden />
            <h1 id="login-heading" className="text-2xl font-bold text-[#22D3EE]">
              trackingXpert
            </h1>
          </div>
          <p className="text-sm text-white/50">Logistics & Tracking Platform</p>
        </div>
        <Suspense>
          <LoginForm headingId="login-heading" />
        </Suspense>
      </div>
    </main>
  );
}
