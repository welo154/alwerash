import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Projects
        </h1>
      </div>
    </div>
  );
}
