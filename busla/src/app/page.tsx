import { About } from "@/components/About";
import { Activities } from "@/components/Activities";
import { ChatWidget } from "@/components/ChatWidget";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MentorSection } from "@/components/MentorSection";
import { Nav } from "@/components/Nav";
import { Partners } from "@/components/Partners";
import { Register } from "@/components/Register";
import { Schedule } from "@/components/Schedule";
import { Speakers } from "@/components/Speakers";
import { Venue } from "@/components/Venue";
import { EVENT } from "@/lib/event";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: `${EVENT.name}: University & Career Discovery Day`,
  startDate: EVENT.date,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  isAccessibleForFree: true,
  location: { "@type": "Place", name: EVENT.venue, address: EVENT.area },
  description: EVENT.tagline,
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Activities />
        <MentorSection />
        <Schedule />
        <Speakers />
        <Partners />
        <Register />
        <FAQ />
        <Venue />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
