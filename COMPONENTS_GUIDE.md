# EMET Platform - Component Library Guide

## Overview

This guide covers all 18 UI components created for the EMET platform. All components are production-ready and follow React 19, TypeScript, and Tailwind CSS best practices.

**Total Components:** 18  
**Total Lines of Code:** 2,241+  
**Design System:** Dark-mode first with blue (#3b82f6) as primary color

## Quick Start

### 1. Core Layout Components

Use `AppShell` as your main layout wrapper:

```tsx
import { AppShell } from '@/components';

export default function DashboardPage() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  
  return (
    <AppShell
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      walletAddress="0x1234567890123456789012345678901234567890"
      onDisconnect={() => handleDisconnect()}
      pageTitle="Dashboard"
      pageSubtitle="Welcome back"
      notificationCount={3}
    >
      {/* Your page content goes here */}
    </AppShell>
  );
}
```

### 2. Dashboard

Build your dashboard with KPI cards and activity feed:

```tsx
import { KPICard, ActivityFeed, NewsHeadlines } from '@/components';
import { Vote, Users, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard
        title="Active Proposals"
        value={42}
        change="+5"
        icon={<Vote className="w-6 h-6" />}
        color="blue"
      />
      <KPICard
        title="Community Members"
        value={15234}
        change="+12%"
        icon={<Users className="w-6 h-6" />}
        color="green"
      />
      <KPICard
        title="Platform Health"
        value="99.9%"
        icon={<TrendingUp className="w-6 h-6" />}
        color="green"
      />
    </div>
  );
}
```

### 3. Chat with EMET

Integrate the chat interface for AI interactions:

```tsx
import { ChatInterface } from '@/components';
import { useState } from 'react';

export function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (content) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }]);
    
    setIsThinking(true);
    // Call your AI API here
    const response = await emetApi.chat(content);
    setIsThinking(false);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'emet',
      content: response,
      timestamp: new Date()
    }]);
  };

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isThinking={isThinking}
      onFileUpload={(file) => uploadDocument(file)}
    />
  );
}
```

### 4. Marketplace

Display products with filtering:

```tsx
import { ProductCard, FilterTabs } from '@/components';
import { useState } from 'react';

export function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'awg', label: 'Atmospheric Water' },
    { id: 'solar', label: 'Solar Energy' },
    { id: 'food', label: 'Food Growing' },
    { id: 'housing', label: 'Housing' }
  ];

  const products = [
    {
      id: 1,
      name: 'SkyFlow AWG-2000',
      description: 'Atmospheric water generation system for homes',
      category: 'awg',
      price: 2499,
      image: 'image-url',
      specs: [
        { label: 'Daily Yield', value: '50L' },
        { label: 'Power', value: '500W' }
      ],
      resellerLinks: [
        { name: 'Amazon', url: 'https://amazon.com' }
      ]
    }
  ];

  return (
    <div>
      <FilterTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => addToCart(p)}
          />
        ))}
      </div>
    </div>
  );
}
```

### 5. DAO Voting

Display proposals and voting:

```tsx
import { ProposalCard, VoteBreakdown } from '@/components';

export function DAOVoting() {
  const proposals = [
    {
      id: '1',
      title: 'Increase Community Fund Allocation',
      description: 'Proposal to increase monthly community fund from 5% to 7%',
      status: 'VOTING',
      creator: '0x1234...5678',
      yesVotes: 7500,
      noVotes: 2300,
      abstainVotes: 1200,
      totalVotes: 11000,
      votingEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    }
  ];

  return (
    <div className="space-y-8">
      {proposals.map(proposal => (
        <div key={proposal.id}>
          <ProposalCard
            proposal={proposal}
            onVote={(id, vote) => submitVote(id, vote)}
          />
          
          <div className="mt-6 pl-6">
            <h4 className="font-semibold text-white mb-4">Vote Details</h4>
            <VoteBreakdown
              yesCount={proposal.yesVotes}
              noCount={proposal.noVotes}
              abstainCount={proposal.abstainVotes}
              threshold={75}
              minParticipants={5000}
              totalVotes={proposal.totalVotes}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 6. Kill Switch

Display emergency shutdown voting gauge:

```tsx
import { KillSwitchGauge } from '@/components';

export function KillSwitchPage() {
  const [votePercentage, setVotePercentage] = useState(32);
  const currentVotes = 3200;
  const requiredVotes = 10000;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">
        Emergency Kill Switch
      </h1>
      
      <KillSwitchGauge
        votePercentage={votePercentage}
        currentVotes={currentVotes}
        requiredVotes={requiredVotes}
        status="voting"
      />
      
      <button
        onClick={() => submitKillSwitchVote()}
        className="mt-8 px-6 py-3 bg-destructive text-white rounded-lg font-bold"
      >
        Vote for Shutdown
      </button>
    </div>
  );
}
```

### 7. Document Management

Handle document uploads with progress tracking:

```tsx
import { DocumentUpload } from '@/components';

export function DocumentsPage() {
  const handleUpload = async (file, category) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    await uploadDocument(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">
        Document Library
      </h1>
      
      <DocumentUpload
        onUpload={handleUpload}
        acceptedFormats={[
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/csv'
        ]}
      />
    </div>
  );
}
```

### 8. Landing Page

Create a stunning landing page:

```tsx
import { Hero, FeatureCards } from '@/components';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const router = useRouter();

  return (
    <>
      <Hero
        onConnectWallet={() => router.push('/auth/connect')}
        onLearnMore={() => scrollToSection('features')}
      />
      
      <div id="features">
        <FeatureCards />
      </div>
    </>
  );
}
```

## Component Props Reference

### Core Components

#### Sidebar
```typescript
interface SidebarProps {
  currentPath: string;           // Current route path
  onNavigate: (path: string) => void;  // Navigation callback
  walletAddress: string;          // Connected wallet address
  onDisconnect: () => void;       // Disconnect callback
}
```

#### TopNav
```typescript
interface TopNavProps {
  title: string;                  // Page title
  subtitle?: string;              // Optional page subtitle
  notificationCount?: number;     // Number of notifications
}
```

#### AppShell
```typescript
interface AppShellProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  walletAddress: string;
  onDisconnect: () => void;
  pageTitle: string;
  pageSubtitle?: string;
  notificationCount?: number;
}
```

### Dashboard Components

#### KPICard
```typescript
interface KPICardProps {
  title: string;                  // Card title
  value: string | number;         // Main value
  change?: string;                // Change indicator (e.g., "+12%")
  icon: React.ReactNode;          // Icon component
  color?: 'blue' | 'green' | 'orange' | 'red';
}
```

#### ActivityFeed
```typescript
interface ActivityFeedProps {
  activities: Activity[];         // Array of activity items
}

interface Activity {
  id: string;
  type: 'vote' | 'content' | 'alert' | 'kill_switch';
  title: string;
  description: string;
  timestamp: Date;
  actor: string;
}
```

#### NewsHeadlines
```typescript
interface NewsHeadlinesProps {
  alerts: NewsAlert[];            // Array of news alerts
}

interface NewsAlert {
  id: string;
  title: string;
  description: string;
  category: string;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
}
```

### Marketplace Components

#### ProductCard
```typescript
interface ProductCardProps {
  product: Product;               // Product data
  onAddToCart?: (product: Product) => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'awg' | 'solar' | 'food' | 'housing';
  price: number;
  currency?: string;
  image?: string;
  specs: Spec[];
  resellerLinks: ResellerLink[];
  hasFinancing?: boolean;
  rating?: number;
}
```

#### FilterTabs
```typescript
interface FilterTabsProps {
  categories: Category[];         // Filter categories
  active: string;                 // Active category ID
  onChange: (categoryId: string) => void;
}

interface Category {
  id: string;
  label: string;
}
```

### DAO Components

#### ProposalCard
```typescript
interface ProposalCardProps {
  proposal: Proposal;             // Proposal data
  onVote?: (proposalId: string, vote: 'yes' | 'no') => void;
}

interface Proposal {
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
```

#### VoteBreakdown
```typescript
interface VoteBreakdownProps {
  yesCount: number;               // Number of yes votes
  noCount: number;                // Number of no votes
  abstainCount: number;           // Number of abstain votes
  threshold?: number;             // Threshold percentage (default: 75)
  minParticipants?: number;       // Minimum participants (default: 1000)
  totalVotes: number;             // Total votes cast
}
```

### Chat Components

#### ChatInterface
```typescript
interface ChatInterfaceProps {
  messages: Message[];            // Chat message history
  onSendMessage?: (content: string) => void;
  isThinking?: boolean;           // AI thinking state
  onFileUpload?: (file: File) => void;
}

interface Message {
  id: string;
  role: 'user' | 'emet';
  content: string;
  timestamp: Date;
}
```

#### EmetAvatar
```typescript
interface EmetAvatarProps {
  size?: 'sm' | 'md' | 'lg';      // Avatar size
  speaking?: boolean;              // Pulse animation
}
```

### Kill Switch Component

#### KillSwitchGauge
```typescript
interface KillSwitchGaugeProps {
  votePercentage: number;         // Current percentage (0-100)
  currentVotes: number;           // Current vote count
  requiredVotes: number;          // Votes required for activation
  status: 'inactive' | 'voting' | 'shutdown';
}
```

### Document Component

#### DocumentUpload
```typescript
interface DocumentUploadProps {
  onUpload?: (file: File, category: string) => void;
  acceptedFormats?: string[];     // MIME types
}
```

### Landing Components

#### Hero
```typescript
interface HeroProps {
  onConnectWallet?: () => void;   // Wallet connection callback
  onLearnMore?: () => void;       // Learn more callback
}
```

#### FeatureCards
```typescript
interface FeatureCardsProps {
  features?: Feature[];           // Custom features (optional)
}

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'emerald' | 'cyan';
}
```

## Styling & Customization

All components use Tailwind CSS with the following color variables:

- `primary` → `#3b82f6` (Blue)
- `success` → `#10b981` (Green)
- `warning` → `#f59e0b` (Amber)
- `destructive` → `#ef4444` (Red)
- Dark background → `#0a0f1a`

To customize colors, update your Tailwind config or override with inline classes.

## Common Patterns

### Loading States
```tsx
// Use isThinking prop in ChatInterface
<ChatInterface
  messages={messages}
  isThinking={true}
  onSendMessage={handleSend}
/>
```

### Error Handling
```tsx
// Use status 'failed' in DocumentUpload
// Implement error boundaries around components
```

### Responsive Design
All components are fully responsive:
- Mobile-first design
- Sidebar collapses on small screens
- Grid layouts adapt to viewport size

## Performance Tips

1. **Memoize heavy parent components**
   ```tsx
   const Dashboard = React.memo(() => { ... });
   ```

2. **Use key props in lists**
   ```tsx
   {activities.map(activity => (
     <ActivityItem key={activity.id} {...activity} />
   ))}
   ```

3. **Lazy load large components**
   ```tsx
   const ChatInterface = lazy(() => import('@/components/chat/ChatInterface'));
   ```

## Accessibility

All components include:
- Proper ARIA labels on buttons and form elements
- Semantic HTML (buttons, links, lists)
- Focus states for keyboard navigation
- High contrast colors (WCAG AA compliant)
- Screen reader friendly markup

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## File Structure

```
src/components/
├── core/
│   ├── Sidebar.tsx
│   ├── TopNav.tsx
│   ├── ThemeToggle.tsx
│   └── AppShell.tsx
├── shared/
│   └── ScoreGauge.tsx
├── dashboard/
│   ├── KPICard.tsx
│   ├── ActivityFeed.tsx
│   └── NewsHeadlines.tsx
├── marketplace/
│   ├── ProductCard.tsx
│   └── FilterTabs.tsx
├── dao/
│   ├── ProposalCard.tsx
│   └── VoteBreakdown.tsx
├── chat/
│   ├── ChatInterface.tsx
│   └── EmetAvatar.tsx
├── kill-switch/
│   └── KillSwitchGauge.tsx
├── documents/
│   └── DocumentUpload.tsx
├── landing/
│   ├── Hero.tsx
│   └── FeatureCards.tsx
├── index.ts (barrel exports)
├── types.ts (shared types)
└── README.md
```

## Support & Issues

For detailed information about each component, see the individual component files which include:
- Full TypeScript types
- Props documentation
- Example usage
- Implementation notes

---

**Created:** February 19, 2026  
**Design System:** EMET Platform  
**React Version:** 19+  
**Build Tool:** Next.js
