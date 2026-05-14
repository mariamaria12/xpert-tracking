import { Wrench } from "lucide-react";

export default function ToolsPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Tools</h1>
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <Wrench className="mx-auto mb-4 h-12 w-12 text-cyan-400" aria-hidden />
        <p className="font-medium text-white">No tools configured</p>
        <p className="mt-1 text-sm text-white/40">
          Available tools will appear here
        </p>
      </div>
    </div>
  );
}
