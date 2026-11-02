import type { Color } from "@/lib/event";

export const BG: Record<Color, string> = {
  saffron: "bg-saffron text-ink",
  brick: "bg-brick text-cream",
  nile: "bg-nile text-cream",
  rose: "bg-rose text-ink",
  sky: "bg-sky text-ink",
  lime: "bg-lime text-ink",
  ink: "bg-ink text-cream",
};

export const openMentor = (prompt?: string) =>
  window.dispatchEvent(new CustomEvent("busla:open-mentor", { detail: { prompt } }));
