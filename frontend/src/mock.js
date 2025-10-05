// Mock data for Freelance Hub platform

export const mockProjects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "TechStart Solutions",
    skills: ["React", "Node.js", "MongoDB"],
    budget: "$2,500 - $5,000",
    deadline: "2 weeks",
    description: "Build a modern e-commerce platform with payment integration",
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    client: "InnovateCorp",
    skills: ["Figma", "UI/UX", "Prototyping"],
    budget: "$1,200 - $2,000",
    deadline: "1 week",
    description: "Design mobile app interface for fitness tracking application",
    posted: "1 day ago"
  },
  {
    id: 3,
    title: "Python Data Analysis Script",
    client: "DataViz Inc",
    skills: ["Python", "Pandas", "Data Analysis"],
    budget: "$800 - $1,500",
    deadline: "5 days",
    description: "Create automated data processing and visualization scripts",
    posted: "3 days ago"
  },
  {
    id: 4,
    title: "WordPress Blog Customization",
    client: "Creative Agency",
    skills: ["WordPress", "PHP", "CSS"],
    budget: "$500 - $1,000",
    deadline: "1 week",
    description: "Customize existing WordPress theme and add new functionality",
    posted: "1 week ago"
  },
  {
    id: 5,
    title: "Logo and Brand Identity Design",
    client: "StartupVenture",
    skills: ["Graphic Design", "Branding", "Illustrator"],
    budget: "$300 - $800",
    deadline: "3 days",
    description: "Complete brand identity package including logo and guidelines",
    posted: "4 days ago"
  }
];

export const mockApplications = [
  {
    id: 1,
    projectTitle: "React Dashboard Development",
    client: "BusinessPro",
    appliedDate: "2024-01-15",
    status: "Pending",
    proposedBudget: "$3,000"
  },
  {
    id: 2,
    projectTitle: "SEO Content Writing",
    client: "DigitalMarketing Co",
    appliedDate: "2024-01-12",
    status: "Accepted",
    proposedBudget: "$500"
  },
  {
    id: 3,
    projectTitle: "Database Optimization",
    client: "TechSolutions",
    appliedDate: "2024-01-10",
    status: "Rejected",
    proposedBudget: "$1,200"
  },
  {
    id: 4,
    projectTitle: "API Integration Project",
    client: "CloudServices",
    appliedDate: "2024-01-08",
    status: "Pending",
    proposedBudget: "$2,500"
  }
];

export const mockFreelancerProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  skills: ["React", "Node.js", "Python", "UI/UX Design"],
  experience: 3,
  hourlyRate: "$50",
  bio: "Passionate full-stack developer with expertise in modern web technologies",
  profilePicture: null,
  projectsCompleted: 12,
  activeProjects: 2,
  totalEarnings: "$15,240"
};

export const skillOptions = [
  "React", "Vue.js", "Angular", "Node.js", "Python", "Django", "Flask",
  "JavaScript", "TypeScript", "HTML/CSS", "PHP", "Laravel", "WordPress",
  "MongoDB", "PostgreSQL", "MySQL", "UI/UX Design", "Figma", "Photoshop",
  "Illustrator", "Graphic Design", "Mobile Development", "Flutter", "React Native",
  "Data Analysis", "Machine Learning", "DevOps", "AWS", "Docker", "Kubernetes",
  "SEO", "Content Writing", "Digital Marketing", "Social Media Management"
];

export const jobRoleOptions = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "UI/UX Designer", "Graphic Designer", "Mobile App Developer",
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
  "Content Writer", "SEO Specialist", "Digital Marketer", "Project Manager",
  "Quality Assurance", "Database Administrator", "System Administrator"
];