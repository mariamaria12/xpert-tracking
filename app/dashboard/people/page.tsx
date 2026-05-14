import { Users } from "lucide-react";

export default function PeoplePage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">People</h1>
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <Users className="mx-auto mb-4 h-12 w-12 text-cyan-400" aria-hidden />
        <p className="font-medium text-white">No people added yet</p>
        <p className="mt-1 text-sm text-white/40">
          Team members will appear here
        </p>
      </div>
    </div>
  );
}
