
export interface Professional {
  id: string;
  name: string;
  services: string[];
  rating: number;
  image: string;
  bio: string;
  location: string;
  availability: string[];
  verified: boolean;
}

export const professionals: Professional[] = [
  {
    id: "1",
    name: "Jessica Martinez",
    services: ["Eyelashes", "Makeup"],
    rating: 4.9,
    image: "/lovable-uploads/bcfe9e75-ecc8-4da9-9e8a-8855be8644bb.png",
    bio: "Certified lash artist with 5 years experience in both classic and volume lash extensions.",
    location: "Mobile - Greater LA Area",
    availability: ["Mon", "Tue", "Thu", "Fri"],
    verified: true
  },
  {
    id: "2",
    name: "Michael Chen",
    services: ["Tattoo"],
    rating: 4.8,
    image: "/lovable-uploads/4ea13f9a-3ea4-4e54-a0b3-41ca972378e7.png",
    bio: "Specialized in fine line tattoos with over 7 years of experience in the industry.",
    location: "Mobile - San Diego Area",
    availability: ["Wed", "Thu", "Fri", "Sat"],
    verified: true
  },
  {
    id: "3",
    name: "Aisha Johnson",
    services: ["Spray Tanning", "Waxing"],
    rating: 4.7,
    image: "/lovable-uploads/d90b0a2f-17c0-4f02-9259-aabda6ffe267.png",
    bio: "Licensed esthetician offering custom spray tans and full body waxing services.",
    location: "Mobile - Orange County",
    availability: ["Mon", "Tue", "Sat", "Sun"],
    verified: true
  },
  {
    id: "4",
    name: "David Kim",
    services: ["Brow Tint", "Makeup"],
    rating: 4.5,
    image: "/placeholder.svg",
    bio: "Celebrity makeup artist specializing in natural looks and eyebrow shaping.",
    location: "Mobile - Beverly Hills",
    availability: ["Tue", "Wed", "Thu", "Sat"],
    verified: false
  },
  {
    id: "5",
    name: "Sophia Rodriguez",
    services: ["Eyelashes", "Brow Tint"],
    rating: 4.9,
    image: "/placeholder.svg",
    bio: "Specialized in Russian volume lashes and microblading with 4+ years experience.",
    location: "Mobile - San Francisco Area",
    availability: ["Mon", "Fri", "Sat", "Sun"],
    verified: true
  },
  {
    id: "6",
    name: "James Wilson",
    services: ["Tattoo"],
    rating: 4.8,
    image: "/placeholder.svg",
    bio: "Award-winning tattoo artist with a specialty in watercolor and minimalist designs.",
    location: "Mobile - Portland Area",
    availability: ["Wed", "Thu", "Fri", "Sat"],
    verified: true
  }
];
