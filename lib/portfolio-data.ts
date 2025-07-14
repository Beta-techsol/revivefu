export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string
  heroImages: string[]
  location: string
  year: string
  materials: string[]
  category: string
  client: string
  gallery: string[]
  story: {
    title: string
    description: string
    highlights: string[]
    quote?: string
  }
}

const projects: Project[] = [
  {
    id: "1",
    slug: "cwsa-murree-office",
    title: "CWSA Murree Office",
    subtitle: "A serene outdoor workspace that merges natural textures with productivity and comfort.",
    heroImages: [
      "/portfolio/cwsa-murree-1.jpg",
      "/portfolio/cwsa-murree-2.jpg",
      "/portfolio/cwsa-murree-3.jpg",
      "/portfolio/cwsa-murree-4.jpg",
    ],
    location: "Murree, Pakistan",
    year: "2023",
    materials: ["Teak Wood", "Steel Frame", "Natural Stone", "Ceramic Tiles"],
    category: "Office & Commercial",
    client: "Community World Service Asia",
    gallery: [
      "/portfolio/cwsa-murree-1.jpg",
      "/portfolio/cwsa-murree-2.jpg",
      "/portfolio/cwsa-murree-3.jpg",
      "/portfolio/cwsa-murree-4.jpg",
    ],
    story: {
      title: "Creating an Outdoor Office Paradise",
      description:
        "This project transformed a traditional office concept into an inspiring outdoor workspace. The CWSA Murree Office combines the tranquility of nature with the functionality required for productive work environments.",
      highlights: [
        "Sustainable outdoor furniture design",
        "Weather-resistant materials selection",
        "Ergonomic seating solutions",
        "Natural lighting optimization",
      ],
      quote:
        "We wanted to create a space where work doesn't feel like work - where nature and productivity coexist harmoniously.",
    },
  },
  {
    id: "2",
    slug: "cowo-coworking-space",
    title: "Cowo Coworking Space",
    subtitle: "A modern collaborative workspace designed for creativity, focus, and professional networking.",
    heroImages: ["/portfolio/cowo-1.jpg", "/portfolio/cowo-2.jpg", "/portfolio/cowo-3.jpg", "/portfolio/cowo-4.jpg"],
    location: "Lahore, Pakistan",
    year: "2023",
    materials: ["Glass Partitions", "Oak Wood", "Steel", "LED Lighting"],
    category: "Coworking & Office",
    client: "Cowo Pakistan",
    gallery: ["/portfolio/cowo-1.jpg", "/portfolio/cowo-2.jpg", "/portfolio/cowo-3.jpg", "/portfolio/cowo-4.jpg"],
    story: {
      title: "Redefining Collaborative Workspaces",
      description:
        "The Cowo Coworking Space project focused on creating flexible, modern work environments that adapt to the changing needs of today's professionals. Glass partitions provide privacy while maintaining an open, collaborative atmosphere.",
      highlights: [
        "Flexible workspace configurations",
        "Sound-proof meeting rooms",
        "Modern lighting systems",
        "Ergonomic furniture solutions",
      ],
      quote: "This space represents the future of work - flexible, collaborative, and designed for human connection.",
    },
  },
  {
    id: "3",
    slug: "fig-solutions-dha",
    title: "Fig Solutions DHA",
    subtitle: "Executive office design combining modern aesthetics with functional workspace solutions.",
    heroImages: [
      "/portfolio/fig-solutions-1.jpg",
      "/portfolio/fig-solutions-2.jpg",
      "/portfolio/fig-solutions-3.jpg",
      "/portfolio/fig-solutions-4.jpg",
    ],
    location: "DHA, Lahore",
    year: "2022",
    materials: ["Engineered Wood", "Mesh Fabric", "Steel Frame", "Laminate Finish"],
    category: "Corporate Office",
    client: "Fig Solutions",
    gallery: [
      "/portfolio/fig-solutions-1.jpg",
      "/portfolio/fig-solutions-2.jpg",
      "/portfolio/fig-solutions-3.jpg",
      "/portfolio/fig-solutions-4.jpg",
      "/portfolio/fig-solutions-5.jpg",
    ],
    story: {
      title: "Executive Excellence in Office Design",
      description:
        "Fig Solutions DHA project showcases our expertise in creating sophisticated corporate environments. The design emphasizes professionalism while maintaining comfort and functionality for daily operations.",
      highlights: [
        "Executive conference room design",
        "Ergonomic office seating solutions",
        "Modern reception area with brick accents",
        "Integrated cable management systems",
      ],
      quote: "A workspace that reflects the company's values while enhancing productivity and professional image.",
    },
  },
  {
    id: "4",
    slug: "forrun-office-lahore",
    title: "Forrun Office Lahore",
    subtitle: "Contemporary office space with panoramic city views and modern workspace solutions.",
    heroImages: ["/portfolio/forrun-office-1.jpg", "/portfolio/forrun-office-2.jpg", "/portfolio/forrun-office-3.jpg"],
    location: "Lahore, Pakistan",
    year: "2023",
    materials: ["Marble Finish", "Glass Partitions", "Ergonomic Mesh", "LED Systems"],
    category: "Corporate Office",
    client: "Forrun Technologies",
    gallery: ["/portfolio/forrun-office-1.jpg", "/portfolio/forrun-office-2.jpg", "/portfolio/forrun-office-3.jpg"],
    story: {
      title: "Modern Workspace with Natural Light",
      description:
        "The Forrun Office project maximizes natural light and city views while creating a productive work environment. The design incorporates modern furniture solutions with biophilic elements to enhance employee wellbeing.",
      highlights: [
        "Floor-to-ceiling windows for natural light",
        "Open-plan workspace design",
        "Modern reception with brick feature wall",
        "Ergonomic workstation configurations",
      ],
      quote: "Creating spaces where innovation thrives through thoughtful design and natural elements.",
    },
  },
  {
    id: "5",
    slug: "meezan-bank-corporate-office",
    title: "Meezan Bank Corporate Office",
    subtitle:
      "Comprehensive corporate headquarters featuring modern workspaces, executive offices, and collaborative areas.",
    heroImages: [
      "/portfolio/meezan-bank-1.jpg",
      "/portfolio/meezan-bank-5.jpg",
      "/portfolio/meezan-bank-6.jpg",
      "/portfolio/meezan-bank-3.jpg",
    ],
    location: "Karachi, Pakistan",
    year: "2023",
    materials: ["Oak Wood Veneer", "Glass Partitions", "Geometric Panels", "LED Strip Lighting", "Ergonomic Mesh"],
    category: "Corporate Banking",
    client: "Meezan Bank Limited",
    gallery: [
      "/portfolio/meezan-bank-1.jpg",
      "/portfolio/meezan-bank-2.jpg",
      "/portfolio/meezan-bank-3.jpg",
      "/portfolio/meezan-bank-4.jpg",
      "/portfolio/meezan-bank-5.jpg",
      "/portfolio/meezan-bank-6.jpg",
      "/portfolio/meezan-bank-cafeteria.jpg",
    ],
    story: {
      title: "Banking Excellence Through Design",
      description:
        "The Meezan Bank Corporate Office project represents a comprehensive approach to modern banking workspace design. From open collaborative areas to executive suites, every space is crafted to enhance productivity while reflecting the bank's commitment to innovation and excellence.",
      highlights: [
        "Modular workstation systems with integrated storage",
        "Glass-walled conference rooms with geometric accent walls",
        "Executive offices with panoramic city views",
        "Modern cafeteria with biophilic design elements",
        "Sophisticated reception areas with custom geometric shelving",
        "Advanced LED lighting systems throughout",
        "Ergonomic furniture solutions for all staff levels",
      ],
      quote: "A workspace that embodies the future of banking - where tradition meets innovation in perfect harmony.",
    },
  },
]

export function getAllProjects(): Project[] {
  return projects
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((project) => project.slug === slug) || null
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug)
}
