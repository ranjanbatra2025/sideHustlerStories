export interface SideHustle {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string; // e.g., "Online", "Creative", "Services", "Gig Economy"
  income: string; // e.g., "$10-$50/hr", "$100-$500/month", "Varies"
  difficulty: "Low" | "Medium" | "Hard";
  timeCommitment: string; // e.g., "Flexible", "5-10 hrs/week", "Part-time"
  startupCost: string; // e.g., "Low", "Medium", "None", "$0-$100"
  rating: number; // e.g., 4.5
  reviewCount: number; // e.g., 120
  pros: string[];
  cons: string[];
  steps: { title: string; description: string }[];
  platforms: { name: string; description: string; url: string }[];
  resources: { name: string; description: string; url?: string }[]; // url is optional
  popularSkills: string[]; // e.g., ["Writing", "SEO", "Graphic Design"]
  image?: string; // Optional image URL for the card
}

export const sideHustles: SideHustle[] = [
  {
    id: "freelance-writing",
    title: "Freelance Writing",
    description: "Create compelling content for blogs, websites, and businesses.",
    longDescription: "Freelance writing involves creating written content for various clients. This can range from blog posts and articles to website copy, marketing materials, and technical documentation. It's a flexible way to earn money using your writing skills.",
    category: "Online",
    income: "$20-$100/hr",
    difficulty: "Medium",
    timeCommitment: "Flexible",
    startupCost: "Low ($0-$50 for tools)",
    rating: 4.7,
    reviewCount: 250,
    pros: ["Flexible hours", "Work from anywhere", "Diverse projects"],
    cons: ["Finding clients can be hard initially", "Inconsistent income at start"],
    steps: [
      { title: "Build a Portfolio", description: "Showcase your best writing samples." },
      { title: "Choose a Niche", description: "Specialize in areas like tech, finance, or health." },
      { title: "Find Clients", description: "Use platforms like Upwork, Fiverr, or direct outreach." },
    ],
    platforms: [
      { name: "Upwork", description: "Popular freelancing platform.", url: "https://www.upwork.com" },
      { name: "Fiverr", description: "Platform for offering 'gigs'.", url: "https://www.fiverr.com" },
    ],
    resources: [
      { name: "ProBlogger Job Board", description: "Find writing gigs." , url: "https://problogger.com/jobs/"},
      { name: "Copyblogger", description: "Learn about copywriting.", url: "https://copyblogger.com/" },
    ],
    popularSkills: ["Content Writing", "SEO", "Copywriting", "Editing", "Research"],
    image: "/images/hustles/freelance-writing.jpg", // Example path
  },
  {
    id: "graphic-design",
    title: "Graphic Design Services",
    description: "Offer logo design, branding, and visual content creation.",
    longDescription: "Provide graphic design services to individuals and businesses. This can include creating logos, branding packages, social media graphics, website mockups, and more. Strong visual skills and proficiency in design software are key.",
    category: "Creative",
    income: "$25-$150/hr",
    difficulty: "Medium",
    timeCommitment: "Flexible",
    startupCost: "Medium ($50-$500 for software/hardware)",
    rating: 4.9,
    reviewCount: 180,
    pros: ["Creative freedom", "High demand for good designers", "Build a strong portfolio"],
    cons: ["Software costs", "Subjective client feedback"],
    steps: [
      { title: "Master Design Tools", description: "Become proficient in Adobe Creative Suite, Figma, etc." },
      { title: "Create a Stunning Portfolio", description: "Showcase your diverse design projects." },
      { title: "Network and Market", description: "Reach out to potential clients and use design platforms." },
    ],
    platforms: [
      { name: "Dribbble", description: "Showcase portfolio and find work.", url: "https://dribbble.com" },
      { name: "99designs", description: "Compete in design contests or work 1-on-1.", url: "https://99designs.com" },
    ],
    resources: [
      { name: "Smashing Magazine", description: "Articles and resources for designers.", url: "https://www.smashingmagazine.com/" },
    ],
    popularSkills: ["Logo Design", "Branding", "UI/UX", "Adobe Illustrator", "Figma"],
    image: "/images/hustles/graphic-design.jpg", // Example path
  },
  {
    id: "virtual-assistant",
    title: "Virtual Assistant",
    description: "Provide administrative, technical, or creative assistance to clients remotely.",
    longDescription: "As a Virtual Assistant (VA), you offer a variety of services to clients from a remote location. Tasks can include email management, scheduling, social media management, customer service, data entry, and more.",
    category: "Services",
    income: "$15-$75/hr",
    difficulty: "Low",
    timeCommitment: "5-20 hrs/week",
    startupCost: "Low ($0-$100)",
    rating: 4.6,
    reviewCount: 310,
    pros: ["Wide range of services to offer", "Low barrier to entry", "Work with diverse clients"],
    cons: ["Can be repetitive", "Requires strong organizational skills"],
    steps: [
        { title: "Identify Your Skills", description: "Determine what services you can offer (e.g., admin, social media, tech support)." },
        { title: "Set Your Rates", description: "Research competitive pricing for VA services." },
        { title: "Market Your Services", description: "Use social media, freelance platforms, or create a simple website." }
    ],
    platforms: [
        { name: "BELAY", description: "Connects VAs with clients.", url: "https://belaysolutions.com/" },
        { name: "Fancy Hands", description: "Platform for US-based VAs.", url: "https://www.fancyhands.com/" }
    ],
    resources: [
        { name: "The VA Handbook", description: "Resources and community for VAs.", url: "https://thevahandbook.com/" },
        { name: "International Virtual Assistants Association", description: "Professional organization for VAs.", url: "https://ivaa.org/" }
    ],
    popularSkills: ["Admin Support", "Social Media Management", "Customer Service", "Scheduling", "Data Entry"],
    image: "/images/hustles/virtual-assistant.jpg", // Example path
  }
  // Add more side hustle objects here...
];