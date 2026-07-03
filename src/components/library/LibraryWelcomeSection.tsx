const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

export function LibraryWelcomeSection() {
  return (
    <section
      className="mt-[80px] ml-[137px] flex items-start gap-[324px]"
      aria-labelledby="library-welcome-heading"
      style={{ fontFamily: pangeaFont }}
    >
      <h2
        id="library-welcome-heading"
        className="shrink-0 text-[48px] leading-[120%] text-black"
      >
        <span className="block font-normal not-italic">WELCOME TO THE</span>
        <span className="block font-semibold italic">LIBRARY SECTION</span>
      </h2>

      <p className="w-[403px] shrink-0 text-[24px] font-normal not-italic leading-[127%] text-black">
        Explore thousands of online material in design, typography, illustration,
        photography, and more.
      </p>
    </section>
  );
}
