import type { CatalogTrackSeed } from "../lib/catalog-import";

/** Tracks 4–17 catalog data. */
export const CATALOG_TRACKS_4_17: CatalogTrackSeed[] = [
  {
    title: "Creative Coding",
    slug: "creative-coding",
    description:
      "A track introducing creative coding from beginner to advanced levels, focusing on code as a visual and interactive creative medium.",
    order: 4,
    published: true,
    courses: [
      {
        title: "Introduction to Creative Coding",
        level: "Beginner",
        mainMentor: "Mohamed Yasin",
        summary:
          "A beginner introduction to creative coding and using code for visual and interactive experiments.",
        order: 1,
      },
      {
        title: "Intermediate Creative Coding",
        level: "Intermediate",
        mainMentor: "Mohamed Yasin",
        summary:
          "An intermediate course expanding creative coding techniques and project-based visual experimentation.",
        order: 2,
      },
      {
        title: "Advanced Creative Coding",
        level: "Advanced",
        mainMentor: "Youchen Braun",
        summary:
          "An advanced course exploring complex creative coding workflows, generative systems, and interactive visual experiments.",
        order: 3,
      },
    ],
  },
  {
    title: "Poster Design",
    slug: "poster-design",
    description:
      "A track focused on poster design, including poster history, typographic posters, mixed media posters, festival posters, bilingual posters, and folklore-inspired posters.",
    order: 5,
    published: true,
    courses: [
      {
        title: "History of Poster Design",
        level: "Beginner",
        mainMentor: "Rana Wasef",
        reference: "Poster design intro lecture",
        summary:
          "A beginner course introducing the history of poster design and its visual evolution.",
        order: 1,
      },
      {
        title: "Basic Typographic Poster Design",
        level: "Beginner",
        mainMentor: "Alaa El Hadidy",
        summary:
          "A beginner course focused on creating typographic posters using layout, hierarchy, and type-driven composition.",
        order: 2,
      },
      {
        title: "Mixed Media Poster",
        level: "Beginner",
        mainMentor: "Nabila Roshdy",
        secondaryReference: "Rana Wasef",
        summary: "A beginner course exploring mixed media approaches in poster design.",
        order: 3,
      },
      {
        title: "Festival Poster",
        level: "Intermediate",
        mainMentor: "Nora Ali",
        summary:
          "An intermediate course focused on designing posters for festivals, events, and cultural programs.",
        order: 4,
      },
      {
        title: "Bilingual Poster Design",
        level: "Intermediate",
        mainMentor: "Nada Sultan",
        secondaryReference: "Rana Wasef",
        summary:
          "An intermediate course focused on designing posters that combine Arabic and Latin typography.",
        order: 5,
      },
      {
        title: "Folklore Poster",
        level: "Intermediate",
        mainMentor: "Toka Assal",
        summary:
          "An intermediate course exploring folklore-inspired poster design and cultural visual storytelling.",
        order: 6,
      },
    ],
  },
  {
    title: "Lettering",
    slug: "lettering",
    description:
      "A track focused on Arabic and Latin lettering, digitalization techniques, calligraphic lettering, Kufic lettering, monograms, conceptual lettering, and illustration-based lettering.",
    order: 6,
    published: true,
    courses: [
      {
        title: "Arabic Lettering Fundamentals",
        level: "Beginner",
        mainMentor: "Eman Fikri",
        summary: "A beginner course introducing Arabic lettering fundamentals.",
        order: 1,
      },
      {
        title: "Digitalization Techniques",
        level: "Beginner",
        mainMentor: "Shoair Studio",
        summary:
          "A beginner course focused on digitizing lettering and preparing lettering work for digital use.",
        order: 2,
      },
      {
        title: "Calligraphic Lettering",
        level: "Intermediate",
        mainMentor: "Negmedine",
        summary:
          "An intermediate course exploring lettering inspired by calligraphic forms and writing systems.",
        order: 3,
      },
      {
        title: "Kufic Lettering",
        level: "Beginner",
        mainMentor: "Shaker Kashgari",
        summary: "A beginner course introducing Kufic lettering principles and visual construction.",
        order: 4,
      },
      {
        title: "Simple Lettering",
        level: "Beginner",
        mainMentor: "Shoair",
        summary:
          "A beginner course focused on simple lettering techniques and foundational lettering practice.",
        order: 5,
      },
      {
        title: "Lettering & Illustration",
        level: "Intermediate",
        mainMentor: "Waleed Abodouh",
        summary:
          "An intermediate course combining lettering with illustration and visual storytelling.",
        order: 6,
      },
      {
        title: "Arabic Lettering",
        level: "Intermediate",
        mainMentor: "Mahmoud Abdelghany",
        summary:
          "An intermediate course expanding Arabic lettering techniques and stylistic exploration.",
        order: 7,
      },
      {
        title: "Monogram Letters",
        level: "Beginner",
        mainMentor: "Areej Atallah",
        summary: "A beginner course focused on designing monograms and letter-based marks.",
        order: 8,
      },
      {
        title: "Conceptual Lettering",
        level: "Beginner",
        mainMentor: "Mariam Abutaleb",
        summary:
          "A beginner course exploring concept-driven lettering and expressive word forms.",
        order: 9,
      },
    ],
  },
  {
    title: "Logo Design",
    slug: "logo-design",
    description:
      "A track focused on logo design, including Arabic lettering logos, logo fundamentals, icon design, bilingual logos, research, sketching, Arabized logos, and calligraphy-based logos.",
    order: 7,
    published: true,
    courses: [
      {
        title: "Arabic Lettering Logos",
        level: "Intermediate",
        mainMentor: "Alaa El Hadidy",
        summary: "An intermediate course focused on creating Arabic lettering-based logos.",
        order: 1,
      },
      {
        title: "Logo Fundamentals",
        level: "Beginner",
        mainMentor: "Abdelrahman Farahat",
        summary:
          "A beginner course introducing logo design fundamentals, forms, concepts, and visual clarity.",
        order: 2,
      },
      {
        title: "Icon Design",
        level: "Beginner",
        mainMentor: "Raghda Motaaz",
        summary: "A beginner course focused on designing icons and simplified visual symbols.",
        order: 3,
      },
      {
        title: "Bilingual Logos",
        level: "Beginner",
        mainMentor: "Abdelrahman Farahat",
        summary:
          "A beginner course focused on designing logos that combine Arabic and Latin visual systems.",
        order: 4,
      },
      {
        title: "Research, Concept, Sketching",
        level: "Intermediate",
        mainMentor: "Raghda Motaaz",
        summary:
          "An intermediate course focused on research, concept development, and sketching for logo design.",
        order: 5,
      },
      {
        title: "Arabizing Latin Logos",
        level: "Intermediate",
        mainMentor: "Eman Fikri",
        internalNote: "Consider whether this should be merged with Bilingual Logos later.",
        summary:
          "An intermediate course focused on adapting Latin logo forms into Arabic visual systems.",
        order: 6,
      },
      {
        title: "Calligraphy Logos",
        level: "Intermediate",
        mainMentor: "Abdelghany Shoair",
        summary: "An intermediate course focused on creating logos using calligraphic forms.",
        order: 7,
      },
    ],
  },
  {
    title: "Branding and Visual Identities",
    slug: "branding-and-visual-identities",
    description:
      "A track focused on branding and visual identity systems, including brand fundamentals, communication systems, bilingual identities, F&B branding, corporate branding, brand strategy, collateral, guidelines, storytelling, and pattern making.",
    order: 8,
    published: true,
    courses: [
      {
        title: "Fundamentals of Branding",
        level: "Beginner",
        mainMentor: "Raghda Motaaz",
        summary:
          "A beginner course introducing branding fundamentals and the role of identity in communication.",
        order: 1,
      },
      {
        title: "Visual Communication System",
        level: "Intermediate",
        mainMentor: "Abdulla Samir",
        summary:
          "An intermediate course focused on building visual communication systems for brands.",
        order: 2,
      },
      {
        title: "Bilingual Identities",
        level: "Intermediate",
        mainMentor: "Ntsal",
        secondaryReference: "Nada Sultan / Malak Ghoneim",
        summary:
          "An intermediate course focused on building bilingual visual identities using Arabic and Latin systems.",
        order: 3,
      },
      {
        title: "F&B Branding",
        level: "Intermediate",
        mainMentor: "Ali Nageeb",
        summary:
          "An intermediate course focused on branding for restaurants, cafes, food, and beverage businesses.",
        order: 4,
      },
      {
        title: "Corporate Branding",
        level: "Intermediate",
        mainMentor: "Nourhan El Banna",
        summary:
          "An intermediate course focused on corporate branding systems and professional identity applications.",
        order: 5,
      },
      {
        title: "Illustration Based Branding",
        level: "Intermediate",
        mainMentor: "Akram William",
        summary:
          "An intermediate course focused on using illustration as the core language of brand identities.",
        order: 6,
      },
      {
        title: "Brand Strategy & Positioning",
        level: "Beginner",
        mainMentor: "Raghda Motaaz",
        secondaryReference: "Hadeel Sayed Ahmed",
        summary:
          "A beginner course focused on brand strategy, positioning, audience, and market direction.",
        order: 7,
      },
      {
        title: "Logo Systems & Dynamic Identities",
        level: "Advanced",
        mainMentor: "Ntsal",
        summary:
          "An advanced course focused on logo systems, flexible identities, and dynamic brand behavior.",
        order: 8,
      },
      {
        title: "Brand Collateral & Touch Points",
        level: "Intermediate",
        mainMentor: "Raghda Motaaz",
        summary:
          "An intermediate course focused on brand applications, collateral, and customer touchpoints.",
        order: 9,
      },
      {
        title: "Brand Guidelines & Documentation",
        level: "Intermediate",
        mainMentor: null,
        summary:
          "An intermediate course focused on creating brand guidelines and documenting identity systems.",
        order: 10,
      },
      {
        title: "Storytelling & Presentation",
        level: "Intermediate",
        mainMentor: null,
        summary:
          "An intermediate course focused on presenting brand stories, identity concepts, and design directions.",
        order: 11,
      },
      {
        title: "Pattern Making",
        level: null,
        mainMentor: null,
        summary:
          "A course focused on pattern making as part of branding and visual identity systems.",
        order: 12,
      },
    ],
  },
  {
    title: "Type Design",
    slug: "type-design",
    description:
      "A track focused on type design, font tools, Arabic and Latin type design, font engineering, adaptation between scripts, gaming type, classic calligraphy type, and font character development.",
    order: 9,
    published: true,
    courses: [
      {
        title: "Glyphs Fundamentals",
        level: "Beginner",
        mainMentor: "Farida Falafel",
        summary: "A beginner course introducing Glyphs and type design workflows.",
        order: 1,
      },
      {
        title: "Lttr Ink Fundamentals",
        level: "Beginner",
        mainMentor: null,
        summary: "A beginner course introducing Lttr Ink fundamentals and type-related workflows.",
        order: 2,
      },
      {
        title: "Arabic Type Design Fundamentals",
        level: "Beginner",
        mainMentor: "Farida Falafel",
        secondaryReference: "Eman Fikri",
        summary: "A beginner course introducing Arabic type design fundamentals.",
        order: 3,
      },
      {
        title: "Font Engineering Fundamentals",
        level: "Intermediate",
        mainMentor: "Khaled Hosny",
        summary: "An intermediate course introducing font engineering fundamentals.",
        order: 4,
      },
      {
        title: "Intermediate Font Engineering",
        level: "Advanced",
        mainMentor: "Khaled Hosny",
        summary:
          "An advanced course expanding font engineering techniques and production workflows.",
        order: 5,
      },
      {
        title: "Latin Type Design Fundamentals",
        level: "Beginner",
        mainMentor: "Bakrawi",
        summary: "A beginner course introducing Latin type design fundamentals.",
        order: 6,
      },
      {
        title: "Adaptation of Arabic to Latin Type",
        level: "Intermediate",
        mainMentor: "Shaqa",
        summary:
          "An intermediate course focused on adapting Arabic type concepts into Latin type systems.",
        order: 7,
      },
      {
        title: "Type Design for Gaming",
        level: "Intermediate",
        mainMentor: "Ibrahim Hamdy",
        summary:
          "An intermediate course focused on designing type for gaming, entertainment, and interactive contexts.",
        order: 8,
      },
      {
        title: "Type Design for Classic Calligraphy",
        level: "Intermediate",
        mainMentor: "Bakrawi",
        summary: "An intermediate course focused on type design inspired by classic calligraphy.",
        order: 9,
      },
      {
        title: "Concept, Style and Character of Font",
        level: "Beginner",
        mainMentor: null,
        summary:
          "A beginner course focused on developing the concept, style, and personality of a font.",
        order: 10,
      },
    ],
  },
  {
    title: "Calligraphy",
    slug: "calligraphy",
    description:
      "A track focused on Arabic calligraphy, handwriting enhancement, classical scripts, Kufic styles, Maghribi, Hurr, Shkesta, Wisam, and advanced calligraphic forms.",
    order: 10,
    published: true,
    courses: [
      {
        title: "Handwriting Enhancement Ruqaa",
        level: "Beginner",
        mainMentor: "Waleed Abdeen",
        summary:
          "A beginner course focused on improving handwriting using Ruqaa script principles.",
        order: 1,
      },
      {
        title: "Handwriting Enhancement Naskh",
        level: "Beginner",
        mainMentor: "Waleed Abdeen",
        summary:
          "A beginner course focused on improving handwriting using Naskh script principles.",
        order: 2,
      },
      {
        title: "Calligraphy Fundamentals",
        level: "Beginner",
        mainMentor: "Islam Ramadan",
        summary: "A beginner course introducing Arabic calligraphy fundamentals.",
        order: 3,
      },
      {
        title: "Naskh Script",
        level: "Beginner",
        mainMentor: "Khodair School",
        summary: "A beginner course introducing Naskh script.",
        order: 4,
      },
      {
        title: "Ruqaa Script",
        level: "Beginner",
        mainMentor: "Khodair School",
        summary: "A beginner course introducing Ruqaa script.",
        order: 5,
      },
      {
        title: "Farisy Script",
        level: "Beginner",
        mainMentor: "Khodair School",
        summary: "A beginner course introducing Farisy script.",
        order: 6,
      },
      {
        title: "Thuluth Script",
        level: "Beginner",
        mainMentor: "Khodair School",
        summary: "A beginner course introducing Thuluth script.",
        order: 7,
      },
      {
        title: "Diwani Script",
        level: "Beginner",
        mainMentor: "Khodair School",
        summary: "A beginner course introducing Diwani script.",
        order: 8,
      },
      {
        title: "Diwani Jali",
        level: "Intermediate",
        mainMentor: "Khodair School",
        summary: "An intermediate course focused on Diwani Jali.",
        order: 9,
      },
      {
        title: "Farisy Jali",
        level: "Intermediate",
        mainMentor: "Khodair School",
        summary: "An intermediate course focused on Farisy Jali.",
        order: 10,
      },
      {
        title: "Thuluth Jali",
        level: "Intermediate",
        mainMentor: "Khodair School",
        summary: "An intermediate course focused on Thuluth Jali.",
        order: 11,
      },
      {
        title: "Kufi Qairawani",
        level: "Beginner",
        mainMentor: "Salah Abdulkhalek",
        summary: "A beginner course introducing Kufi Qairawani.",
        order: 12,
      },
      {
        title: "Kufi Fatimi",
        level: "Beginner",
        mainMentor: "Salah Abdulkhalek",
        summary: "A beginner course introducing Kufi Fatimi.",
        order: 13,
      },
      {
        title: "Kufi Moshafi",
        level: "Beginner",
        mainMentor: "Salah Abdulkhalek",
        summary: "A beginner course introducing Kufi Moshafi.",
        order: 14,
      },
      {
        title: "Kufi Mamluki",
        level: "Beginner",
        mainMentor: "Salah Abdulkhalek",
        summary: "A beginner course introducing Kufi Mamluki.",
        order: 15,
      },
      {
        title: "Kufi Handasi",
        level: "Beginner",
        mainMentor: "Reda El Anwar",
        summary: "A beginner course introducing Kufi Handasi.",
        order: 16,
      },
      {
        title: "Maghribi Mujawhar",
        level: "Beginner",
        mainMentor: "Hashem Al-Halaby",
        summary: "A beginner course introducing Maghribi Mujawhar.",
        order: 17,
      },
      {
        title: "Hurr Script",
        level: "Beginner",
        mainMentor: "Mahmoud Al-Nemr",
        summary: "A beginner course introducing Hurr Script.",
        order: 18,
      },
      {
        title: "Thuluth Mamluki",
        level: "Beginner",
        mainMentor: "Ahmed Fahd",
        summary: "A beginner course introducing Thuluth Mamluki.",
        order: 19,
      },
      {
        title: "Shkesta Script",
        level: "Beginner",
        mainMentor: "Taha Abdulnaser",
        summary: "A beginner course introducing Shkesta Script.",
        order: 20,
      },
      {
        title: "Wisam Script",
        level: "Beginner",
        mainMentor: "Mohamed Esam",
        summary: "A beginner course introducing Wisam Script.",
        order: 21,
      },
    ],
  },
  {
    title: "Ornamentation",
    slug: "ornamentation",
    description:
      "A track focused on floral, geometric, Batik, and digital ornamentation, including Rumi, Mamluki, Hatai, geometric systems, Illustrator workflows, and pattern making.",
    order: 11,
    published: true,
    courses: [
      {
        title: "Floral Rumi",
        level: "Beginner",
        mainMentor: "Mai El Karaksi",
        secondaryReference: "JAMEEL HOUSE",
        reference: "Moma",
        summary: "A beginner course introducing Floral Rumi ornamentation.",
        order: 1,
      },
      {
        title: "Floral Rumi Advanced",
        level: "Intermediate",
        mainMentor: "Mai El Karaksi",
        summary: "An intermediate course expanding Floral Rumi ornamentation techniques.",
        order: 2,
      },
      {
        title: "Floral Mamluki",
        level: "Beginner",
        mainMentor: "Abdelrahman Aboulfadl",
        summary: "A beginner course introducing Floral Mamluki ornamentation.",
        order: 3,
      },
      {
        title: "Floral Mamluki Advanced",
        level: "Intermediate",
        mainMentor: "Abdelrahman Aboulfadl",
        summary: "An intermediate course expanding Floral Mamluki ornamentation techniques.",
        order: 4,
      },
      {
        title: "Floral Hatai",
        level: "Beginner",
        mainMentor: "Amber Khokhar",
        summary: "A beginner course introducing Floral Hatai ornamentation.",
        order: 5,
      },
      {
        title: "Floral Hatai Advanced",
        level: "Intermediate",
        mainMentor: "Amber Khokhar",
        summary: "An intermediate course expanding Floral Hatai ornamentation techniques.",
        order: 6,
      },
      {
        title: "Geometric Ornamentation",
        level: "Beginner",
        mainMentor: "Basma Khaleel",
        summary: "A beginner course introducing geometric ornamentation systems.",
        order: 7,
      },
      {
        title: "Geometric Advanced",
        level: "Intermediate",
        mainMentor: "Basma Khaleel",
        summary: "An intermediate course expanding geometric ornamentation systems.",
        order: 8,
      },
      {
        title: "Batik Ornamentation",
        level: "Beginner",
        mainMentor: "Abdelrahman Aboulfadl",
        summary: "A beginner course introducing Batik ornamentation.",
        order: 9,
      },
      {
        title: "Batik Advanced",
        level: "Intermediate",
        mainMentor: "Abdelrahman Aboulfadl",
        summary: "An intermediate course expanding Batik ornamentation.",
        order: 10,
      },
      {
        title: "Ornamentation on Illustrator",
        level: "Intermediate",
        mainMentor: "Abdelrahman Aboulfadl",
        summary:
          "An intermediate course focused on creating ornamentation using Adobe Illustrator.",
        order: 11,
      },
      {
        title: "Pattern Making",
        level: null,
        mainMentor: null,
        summary:
          "A course focused on pattern making for digital and traditional ornamentation.",
        order: 12,
      },
      {
        title: "Digital Ornamentation",
        level: null,
        mainMentor: null,
        summary:
          "A course focused on digital ornamentation workflows and visual systems.",
        order: 13,
      },
    ],
  },
  {
    title: "Apparel Design",
    slug: "apparel-design",
    description:
      "A track introducing apparel and clothing-related design, starting with T-shirt design basics and visual applications for fashion products.",
    order: 12,
    published: true,
    courses: [
      {
        title: "T-shirt Design Basics",
        level: "Beginner",
        mainMentor: "Kimokono / Wokeuplikejunk",
        secondaryReference: "Habiba Sirag",
        summary:
          "A beginner course introducing the basics of T-shirt design, apparel graphics, and visual applications for clothing.",
        order: 1,
      },
    ],
  },
  {
    title: "Illustration & Drawing",
    slug: "illustration-and-drawing",
    description:
      "A track covering illustration and drawing for branding, characters, storyboards, architecture, products, vibrant styles, graffiti, and creative visual storytelling.",
    order: 13,
    published: true,
    courses: [
      {
        title: "Illustration for Branding",
        level: "Intermediate",
        mainMentor: "Gamal Alaasy",
        summary:
          "An intermediate course focused on using illustration as part of branding systems and visual identity.",
        order: 1,
      },
      {
        title: "Character Design 1",
        level: "Beginner/Intermediate",
        mainMentor: "Ahmed Nady",
        secondaryReference: "Twinscartoon",
        summary:
          "A beginner to intermediate course introducing character design fundamentals and visual character development.",
        order: 2,
      },
      {
        title: "Character Design 2",
        level: "Beginner/Intermediate",
        mainMentor: "Abdulla Moatasem",
        summary:
          "A beginner to intermediate character design course exploring different approaches to character creation.",
        order: 3,
      },
      {
        title: "Character Design 3",
        level: "Beginner/Intermediate",
        mainMentor: "Vladlena Ibrahim",
        summary:
          "A beginner to intermediate course expanding character design skills, style exploration, and creative character building.",
        order: 4,
      },
      {
        title: "Storyboard",
        level: "Intermediate",
        mainMentor: "Ahmed Nady",
        summary:
          "An intermediate course introducing storyboard creation, visual sequencing, and storytelling through frames.",
        order: 5,
      },
      {
        title: "Architectural Illustration",
        level: "Intermediate",
        mainMentor: "Nora Zeid",
        summary:
          "An intermediate course focused on architectural illustration, spatial drawing, and visualizing built environments.",
        order: 6,
      },
      {
        title: "Knitting Illustration",
        level: "Intermediate",
        mainMentor: "Maged Elsokkary",
        summary:
          "An intermediate course focused on knitting-inspired illustration and textile-related visual styles.",
        order: 7,
      },
      {
        title: "Vibrant Illustration",
        level: "Beginner/Intermediate",
        mainMentor: "Rahma Medhat",
        summary:
          "A beginner to intermediate course exploring colorful, expressive, and vibrant illustration styles.",
        order: 8,
      },
      {
        title: "Illustration for Product Design",
        level: "Beginner/Intermediate",
        mainMentor: "Youssif Wasel",
        summary:
          "A beginner to intermediate course focused on using illustration in product design and visual product communication.",
        order: 9,
      },
      {
        title: "Graffiti Illustration",
        level: "Beginner/Intermediate",
        mainMentor: "Toxiclk",
        summary:
          "A beginner to intermediate course introducing graffiti-inspired illustration, street visual language, and expressive drawing styles.",
        order: 10,
      },
      {
        title: "Drawing Illustration",
        level: "Beginner/Intermediate",
        mainMentor: "Amina Tamer",
        summary:
          "A beginner to intermediate course focused on drawing-based illustration fundamentals and creative visual expression.",
        order: 11,
      },
    ],
  },
  {
    title: "3D Designs",
    slug: "3d-designs",
    description:
      "A beginner-friendly track introducing 3D design workflows, including Blender modeling, texturing, rendering, scene creation, animation, and 3D lettering.",
    order: 14,
    published: true,
    courses: [
      {
        title: "Modeling in Blender",
        level: "Beginner",
        mainMentor: "Mohamed Refai",
        reference: "Blender donut tutorial",
        summary: "A beginner course introducing 3D modeling in Blender.",
        order: 1,
      },
      {
        title: "Texturing in Blender",
        level: "Beginner",
        mainMentor: "Mohamed Refai",
        reference: "Blender donut tutorial",
        summary: "A beginner course introducing texturing workflows in Blender.",
        order: 2,
      },
      {
        title: "Rendering in Blender",
        level: "Beginner",
        mainMentor: "Mohamed Refai",
        reference: "Blender donut tutorial",
        summary:
          "A beginner course introducing rendering in Blender, lighting, camera setup, and output preparation.",
        order: 3,
      },
      {
        title: "3D Scene",
        level: "Beginner",
        mainMentor: "Ahmed Ismail",
        summary:
          "A beginner course focused on creating complete 3D scenes and arranging visual elements in space.",
        order: 4,
      },
      {
        title: "Animating in Blender",
        level: "Beginner",
        mainMentor: "Mohamed Refai",
        reference: "Blender donut tutorial",
        summary: "A beginner course introducing basic animation workflows inside Blender.",
        order: 5,
      },
      {
        title: "3D Lettering",
        level: "Intermediate",
        mainMentor: "Ibrahim Hamdy",
        summary:
          "An intermediate course focused on creating lettering in 3D and exploring dimensional typographic forms.",
        order: 6,
      },
    ],
  },
  {
    title: "Animation",
    slug: "animation",
    description:
      "A track introducing animation principles for designers and the fundamentals of bringing visual work to life through movement.",
    order: 15,
    published: true,
    courses: [
      {
        title: "Animation Principles for Designers",
        level: "Beginner",
        mainMentor: "Samaka Studio",
        summary: "A beginner course introducing animation principles for designers.",
        order: 1,
      },
    ],
  },
  {
    title: "Creatives' Needs",
    slug: "creatives-needs",
    description:
      "A practical track for creatives covering financial management, workflow, client management, time management, Notion, portfolio building, CV building, project presentation, marketing, and personal branding.",
    order: 16,
    published: true,
    courses: [
      {
        title: "Financial Management",
        level: "Beginner",
        mainMentor: null,
        summary: "A beginner course introducing financial management basics for creatives.",
        order: 1,
      },
      {
        title: "Workflow",
        level: "Beginner",
        mainMentor: "Mohamed Hossam Aldeen",
        summary: "A beginner course focused on building a professional creative workflow.",
        order: 2,
      },
      {
        title: "Client Management",
        level: "Beginner",
        mainMentor: null,
        summary:
          "A beginner course focused on managing clients, communication, expectations, and project delivery.",
        order: 3,
      },
      {
        title: "Tasks and Time Management",
        level: "Beginner",
        mainMentor: null,
        summary:
          "A beginner course focused on organizing tasks, managing time, and improving productivity.",
        order: 4,
      },
      {
        title: "Notion",
        level: "Beginner",
        mainMentor: "Abdelrahman Salah",
        summary: "A beginner course focused on using Notion for creative work organization.",
        order: 5,
      },
      {
        title: "Portfolio Building",
        level: "Beginner",
        mainMentor: "Nourhan Ghabour",
        summary: "A beginner course focused on building a strong creative portfolio.",
        order: 6,
      },
      {
        title: "CV Building",
        level: "Beginner",
        mainMentor: "Nourhan Ghabour",
        summary: "A beginner course focused on creating a professional creative CV.",
        order: 7,
      },
      {
        title: "Project Presentation",
        level: "Beginner",
        mainMentor: null,
        summary:
          "A beginner course focused on presenting creative projects clearly and professionally.",
        order: 8,
      },
      {
        title: "How to Market Your Work",
        level: "Beginner",
        mainMentor: "Mostafa Kamal",
        summary:
          "A beginner course focused on marketing creative work and reaching the right audience.",
        order: 9,
      },
      {
        title: "Personal Branding",
        level: "Beginner",
        mainMentor: null,
        summary: "A beginner course focused on building a personal brand as a creative.",
        order: 10,
      },
    ],
  },
  {
    title: "UI/UX",
    slug: "ui-ux",
    description:
      "A track focused on UI/UX and digital product design, including mobile front-end design, website front-end design, advanced Figma plugins and animation, editorial design, book covers, and internal book layout.",
    order: 17,
    published: true,
    courses: [
      {
        title: "Mobile Design Front End",
        level: "Beginner",
        mainMentor: "Farah / Merna",
        summary:
          "A beginner course focused on mobile interface design and front-end visual structure.",
        order: 1,
      },
      {
        title: "Website Design Front End",
        level: "Intermediate",
        mainMentor: "Farah / Merna",
        summary:
          "An intermediate course focused on website interface design and front-end visual structure.",
        order: 2,
      },
      {
        title: "Website Design Front End: Advanced Plugins and Animation in Figma",
        level: "Advanced",
        mainMentor: "Farah / Merna",
        summary:
          "An advanced course focused on Figma plugins, advanced website design workflows, and interface animation.",
        order: 3,
      },
      {
        title: "Editorial Design",
        level: "Intermediate",
        mainMentor: "Rana Wasef",
        summary:
          "An intermediate course focused on editorial design, layouts, grids, and publication systems.",
        order: 4,
      },
      {
        title: "Book Covers Design",
        level: null,
        mainMentor: null,
        summary:
          "A course focused on book cover design, visual concepts, and publishing-focused composition.",
        order: 5,
      },
      {
        title: "Internal Layout of Books",
        level: null,
        mainMentor: null,
        summary:
          "A course focused on internal book layout, reading flow, grids, and publication structure.",
        order: 6,
      },
    ],
  },
];
