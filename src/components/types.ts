// Activity Feed Types
export interface Activity {
  id: string;
  type: 'vote' | 'content' | 'alert' | 'kill_switch';
  title: string;
  description: string;
  timestamp: Date;
  actor: string;
}

// News Alert Types
export interface NewsAlert {
  id: string;
  title: string;
  description: string;
  category: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
}

// Product Types
export interface ProductSpec {
  label: string;
  value: string;
}

export interface ResellerLink {
  name: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'awg' | 'solar' | 'food' | 'housing';
  price: number;
  currency?: string;
  image?: string;
  specs: ProductSpec[];
  resellerLinks: ResellerLink[];
  hasFinancing?: boolean;
  rating?: number;
}

// Proposal Types
export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'VOTING' | 'PASSED' | 'FAILED';
  creator: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  votingEndsAt?: Date;
  createdAt: Date;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'emet';
  content: string;
  timestamp: Date;
}

// Uploaded File Types
export interface UploadedDocument {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'indexed' | 'failed';
  progress?: number;
  category: string;
  uploadedAt: Date;
}

// Feature Types
export interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'emerald' | 'cyan';
}

// Filter Category Types
export interface FilterCategory {
  id: string;
  label: string;
}
