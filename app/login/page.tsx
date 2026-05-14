import { Truck } from "lucide-react";
import LoginForm from "@/ui/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220]">
      <div className="card mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Truck className="h-8 w-8 text-[#22D3EE]" aria-hidden />
            <span className="text-2xl font-bold text-[#22D3EE]">trackingXpert</span>
          </div>
          <p className="text-sm text-white/50">Logistics & Tracking Platform</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
