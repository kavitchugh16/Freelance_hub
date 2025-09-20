export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'freelancer';
  avatar?: string;
  rating?: number;
  completedProjects?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  clientId: string;
  client?: User;
  status: 'open' | 'awarded' | 'in_progress' | 'completed' | 'cancelled';
  skills: string[];
  deadline: string;
  awardedFreelancerId?: string;
  awardedFreelancer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancer?: User;
  amount: number;
  proposal: string;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'paid';
  order: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancer?: User;
  role: string;
  revenuePercentage: number;
  status: 'invited' | 'accepted' | 'active';
  invitedBy: string;
  createdAt: string;
}

export interface EscrowWallet {
  id: string;
  projectId: string;
  totalAmount: number;
  availableAmount: number;
  lockedAmount: number;
  stripeAccountId?: string;
  status: 'pending' | 'funded' | 'active' | 'completed';
}