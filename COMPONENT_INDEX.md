# EMET Platform - Complete Component Index

**Last Updated:** February 19, 2026  
**Total Components:** 18  
**Status:** Production-Ready  

## Quick Navigation

### Core Components
- [Sidebar](#sidebar) - Collapsible navigation with wallet support
- [TopNav](#topnav) - Search bar, notifications, theme toggle
- [ThemeToggle](#themetoggle) - Dark/light mode switcher
- [AppShell](#appshell) - Main layout wrapper

### Dashboard
- [KPICard](#kpicard) - Metric display cards
- [ActivityFeed](#activityfeed) - Timeline of activities
- [NewsHeadlines](#newsheadlines) - Alert feed with threat levels

### Marketplace
- [ProductCard](#productcard) - Product display
- [FilterTabs](#filtertabs) - Category filtering

### DAO
- [ProposalCard](#proposalcard) - Proposal voting display
- [VoteBreakdown](#votebreakdown) - Detailed vote analysis

### Chat
- [ChatInterface](#chatinterface) - Full chat UI with file upload
- [EmetAvatar](#emetavatar) - EMET's avatar icon

### Other
- [KillSwitchGauge](#killswitchgauge) - Emergency shutdown gauge
- [DocumentUpload](#documentupload) - File upload with drag-and-drop
- [ScoreGauge](#scoregauge) - SVG progress indicator
- [Hero](#hero) - Landing page hero
- [FeatureCards](#featurecards) - Feature grid display

---

## Component Details

### Sidebar
**File:** `/src/components/core/Sidebar.tsx`  
**Type:** Layout Component  
**Complexity:** Advanced  

A collapsible sidebar with full navigation and wallet integration.

**Key Features:**
- Toggleable collapse (240px → 64px)
- 11 navigation items with icons
- Active state indicators
- Wallet address display (truncated)
- Disconnect button
- Mobile-friendly overlay

**Props:**
```typescript
currentPath: string
onNavigate: (path: string) => void
walletAddress: string
onDisconnect: () => void
```

**Example:**
```tsx
<Sidebar
  currentPath="/dashboard"
  onNavigate={(path) => router.push(path)}
  walletAddress="0x1234...5678"
  onDisconnect={() => handleDisconnect()}
/>
```

---

### TopNav
**File:** `/src/components/core/TopNav.tsx`  
**Type:** Layout Component  
**Complexity:** Medium  

Top navigation bar with search, notifications, and theme toggle.

**Key Features:**
- Breadcrumb title and subtitle
- Center search input
- Notifications bell with badge
- Theme toggle button
- User avatar menu
- Fixed positioned with backdrop blur

**Props:**
```typescript
title: string
subtitle?: string
notificationCount?: number
```

**Example:**
```tsx
<TopNav
  title="Dashboard"
  subtitle="Welcome back"
  notificationCount={3}
/>
```

---

### ThemeToggle
**File:** `/src/components/core/ThemeToggle.tsx`  
**Type:** Utility Component  
**Complexity:** Simple  

Simple sun/moon icon toggle for theme switching.

**Key Features:**
- Smooth icon transitions
- Hover effects
- Circular button design
- Dark/light mode toggle

**Example:**
```tsx
<ThemeToggle />
```

---

### AppShell
**File:** `/src/components/core/AppShell.tsx`  
**Type:** Layout Component  
**Complexity:** Advanced  

Main application layout combining sidebar, top nav, and content.

**Key Features:**
- Combines all layout components
- Responsive design
- Mobile sidebar overlay
- State management

**Props:**
```typescript
children: React.ReactNode
currentPath: string
onNavigate: (path: string) => void
walletAddress: string
onDisconnect: () => void
pageTitle: string
pageSubtitle?: string
notificationCount?: number
```

**Example:**
```tsx
<AppShell
  currentPath="/dashboard"
  onNavigate={handleNav}
  walletAddress={wallet}
  onDisconnect={handleDisconnect}
  pageTitle="Dashboard"
>
  <YourContent />
</AppShell>
```

---

### KPICard
**File:** `/src/components/dashboard/KPICard.tsx`  
**Type:** Dashboard Component  
**Complexity:** Medium  

Displays key performance indicators with trends.

**Key Features:**
- Icon in colored circle
- Large monospace value
- Optional trend indicator with arrow
- 4 color variants
- Glass-morphism design

**Props:**
```typescript
title: string
value: string | number
change?: string
icon: React.ReactNode
color?: 'blue' | 'green' | 'orange' | 'red'
```

**Example:**
```tsx
<KPICard
  title="Active Proposals"
  value={42}
  change="+5"
  icon={<Vote className="w-6 h-6" />}
  color="blue"
/>
```

---

### ActivityFeed
**File:** `/src/components/dashboard/ActivityFeed.tsx`  
**Type:** Dashboard Component  
**Complexity:** Medium  

Timeline-style activity list with type badges.

**Key Features:**
- Timeline visualization with dots
- Type badges (vote, content, alert, kill_switch)
- Relative timestamps
- Actor information
- Smooth animations

**Props:**
```typescript
activities: Activity[]

// Activity interface
interface Activity {
  id: string
  type: 'vote' | 'content' | 'alert' | 'kill_switch'
  title: string
  description: string
  timestamp: Date
  actor: string
}
```

**Example:**
```tsx
<ActivityFeed
  activities={[
    {
      id: '1',
      type: 'vote',
      title: 'Proposal Passed',
      description: 'Community fund increase approved',
      timestamp: new Date(),
      actor: '0xabcd...ef12'
    }
  ]}
/>
```

---

### NewsHeadlines
**File:** `/src/components/dashboard/NewsHeadlines.tsx`  
**Type:** Dashboard Component  
**Complexity:** Medium  

Alert feed with threat level indicators.

**Key Features:**
- 4 threat levels (critical, high, medium, low)
- Pulsing critical alerts
- Category and timestamp display
- Hover effects
- Limits to 5 most recent

**Props:**
```typescript
alerts: NewsAlert[]

// NewsAlert interface
interface NewsAlert {
  id: string
  title: string
  description: string
  category: string
  threatLevel: 'critical' | 'high' | 'medium' | 'low'
  timestamp: Date
}
```

**Example:**
```tsx
<NewsHeadlines
  alerts={[
    {
      id: '1',
      title: 'System Alert',
      description: 'High-risk activity detected',
      category: 'Security',
      threatLevel: 'critical',
      timestamp: new Date()
    }
  ]}
/>
```

---

### ProductCard
**File:** `/src/components/marketplace/ProductCard.tsx`  
**Type:** Marketplace Component  
**Complexity:** Advanced  

Product display with specs and reseller links.

**Key Features:**
- Image display with gradient overlay
- Category badge (4 colors)
- Financing available indicator
- Product specifications
- Price display
- Star rating
- Reseller links with external icon
- Hover scale effect (1.02)

**Props:**
```typescript
product: Product
onAddToCart?: (product: Product) => void

// Product interface
interface Product {
  id: string
  name: string
  description: string
  category: 'awg' | 'solar' | 'food' | 'housing'
  price: number
  currency?: string
  image?: string
  specs: Spec[]
  resellerLinks: ResellerLink[]
  hasFinancing?: boolean
  rating?: number
}
```

**Example:**
```tsx
<ProductCard
  product={{
    id: '1',
    name: 'SkyFlow AWG-2000',
    description: 'Atmospheric water generation',
    category: 'awg',
    price: 2499,
    specs: [{ label: 'Yield', value: '50L' }],
    resellerLinks: [{ name: 'Amazon', url: 'https://amazon.com' }]
  }}
  onAddToCart={(p) => cart.add(p)}
/>
```

---

### FilterTabs
**File:** `/src/components/marketplace/FilterTabs.tsx`  
**Type:** Marketplace Component  
**Complexity:** Medium  

Horizontal scrollable category filter tabs.

**Key Features:**
- Left/right scroll buttons
- Smooth scrolling animation
- Active tab highlighting
- 5 default categories
- ARIA accessibility

**Props:**
```typescript
categories: Category[]
active: string
onChange: (categoryId: string) => void

// Category interface
interface Category {
  id: string
  label: string
}
```

**Example:**
```tsx
<FilterTabs
  categories={[
    { id: 'all', label: 'All' },
    { id: 'awg', label: 'AWGs' }
  ]}
  active="all"
  onChange={(id) => setCategory(id)}
/>
```

---

### ProposalCard
**File:** `/src/components/dao/ProposalCard.tsx`  
**Type:** DAO Component  
**Complexity:** Advanced  

Proposal display with voting progress.

**Key Features:**
- Status badge (4 states)
- Vote progress bar (yes/no segments)
- Vote counts and percentages
- Creator wallet (truncated)
- Time remaining countdown
- Hover effects

**Props:**
```typescript
proposal: Proposal
onVote?: (proposalId: string, vote: 'yes' | 'no') => void

// Proposal interface
interface Proposal {
  id: string
  title: string
  description: string
  status: 'ACTIVE' | 'VOTING' | 'PASSED' | 'FAILED'
  creator: string
  yesVotes: number
  noVotes: number
  totalVotes: number
  votingEndsAt?: Date
  createdAt: Date
}
```

**Example:**
```tsx
<ProposalCard
  proposal={{
    id: '1',
    title: 'Fund Increase',
    description: 'Increase allocation to 7%',
    status: 'VOTING',
    creator: '0xabcd...ef12',
    yesVotes: 7500,
    noVotes: 2300,
    totalVotes: 9800,
    votingEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  }}
  onVote={(id, vote) => submitVote(id, vote)}
/>
```

---

### VoteBreakdown
**File:** `/src/components/dao/VoteBreakdown.tsx`  
**Type:** DAO Component  
**Complexity:** Advanced  

Detailed vote analysis with threshold visualization.

**Key Features:**
- Stacked horizontal bar (yes, no, abstain)
- 75% threshold line marker
- Vote count cards
- Participation indicator
- Threshold status display

**Props:**
```typescript
yesCount: number
noCount: number
abstainCount: number
threshold?: number (default: 75)
minParticipants?: number (default: 1000)
totalVotes: number
```

**Example:**
```tsx
<VoteBreakdown
  yesCount={7500}
  noCount={2300}
  abstainCount={1000}
  threshold={75}
  minParticipants={5000}
  totalVotes={9800}
/>
```

---

### ChatInterface
**File:** `/src/components/chat/ChatInterface.tsx`  
**Type:** Chat Component  
**Complexity:** Advanced  

Full-featured chat UI with file upload and typing indicator.

**Key Features:**
- Message list with auto-scroll
- User messages (right-aligned, blue)
- EMET messages (left-aligned, avatar)
- Typing indicator with animated dots
- Auto-resizing textarea
- File upload (Paperclip icon)
- Send button with disabled state
- Shift+Enter for new line
- Privacy disclaimer

**Props:**
```typescript
messages: Message[]
onSendMessage?: (content: string) => void
isThinking?: boolean
onFileUpload?: (file: File) => void

// Message interface
interface Message {
  id: string
  role: 'user' | 'emet'
  content: string
  timestamp: Date
}
```

**Example:**
```tsx
<ChatInterface
  messages={messages}
  onSendMessage={(content) => handleMessage(content)}
  isThinking={aiThinking}
  onFileUpload={(file) => uploadDoc(file)}
/>
```

---

### EmetAvatar
**File:** `/src/components/chat/EmetAvatar.tsx`  
**Type:** Chat Component  
**Complexity:** Simple  

EMET's branded avatar icon with shield.

**Key Features:**
- Blue gradient background
- Shield icon
- 3 size variants (sm, md, lg)
- Pulse animation when speaking
- Ping effect ring

**Props:**
```typescript
size?: 'sm' | 'md' | 'lg'
speaking?: boolean
```

**Example:**
```tsx
<EmetAvatar size="md" speaking={isThinking} />
```

---

### KillSwitchGauge
**File:** `/src/components/kill-switch/KillSwitchGauge.tsx`  
**Type:** Special Component  
**Complexity:** Advanced  

Emergency shutdown voting gauge visualization.

**Key Features:**
- Large circular SVG gauge
- Semi-circle progress indicator
- Red/green gradient based on votes
- 75% threshold line
- Vote count display
- Status badge (INACTIVE, VOTING, SHUTDOWN)
- Pulsing animation for active states

**Props:**
```typescript
votePercentage: number
currentVotes: number
requiredVotes: number
status: 'inactive' | 'voting' | 'shutdown'
```

**Example:**
```tsx
<KillSwitchGauge
  votePercentage={32}
  currentVotes={3200}
  requiredVotes={10000}
  status="voting"
/>
```

---

### DocumentUpload
**File:** `/src/components/documents/DocumentUpload.tsx`  
**Type:** Document Component  
**Complexity:** Advanced  

Drag-and-drop document uploader with progress tracking.

**Key Features:**
- Drag-and-drop zone
- File browser button
- Category selector (5 options)
- File status tracking (4 states)
- Progress bars
- File list display
- Remove file button
- Status icons

**Props:**
```typescript
onUpload?: (file: File, category: string) => void
acceptedFormats?: string[]
```

**Example:**
```tsx
<DocumentUpload
  onUpload={(file, category) => handleUpload(file, category)}
  acceptedFormats={['application/pdf', 'text/plain']}
/>
```

---

### ScoreGauge
**File:** `/src/components/shared/ScoreGauge.tsx`  
**Type:** Utility Component  
**Complexity:** Medium  

SVG-based circular progress indicator.

**Key Features:**
- Semi-circle gauge design
- 3 size variants (sm, md, lg)
- Color-coded by value (green ≥75%, yellow ≥50%, red <50%)
- Smooth animations
- Optional label
- Monospace font for values

**Props:**
```typescript
value: number (0-100)
size?: 'sm' | 'md' | 'lg'
label?: string
```

**Example:**
```tsx
<ScoreGauge value={82} size="md" label="Community Score" />
```

---

### Hero
**File:** `/src/components/landing/Hero.tsx`  
**Type:** Landing Component  
**Complexity:** Advanced  

Landing page hero with animated particles and CTAs.

**Key Features:**
- Animated particle background (20 particles)
- Gradient text for EMET
- Hebrew subtitle (אמת)
- Feature icons row (6 icons)
- Dual CTA buttons
- Trust indicators
- Responsive typography

**Props:**
```typescript
onConnectWallet?: () => void
onLearnMore?: () => void
```

**Example:**
```tsx
<Hero
  onConnectWallet={() => navigateTo('/connect')}
  onLearnMore={() => scrollTo('#features')}
/>
```

---

### FeatureCards
**File:** `/src/components/landing/FeatureCards.tsx`  
**Type:** Landing Component  
**Complexity:** Advanced  

Feature grid with hover effects and glow.

**Key Features:**
- 6-card responsive grid (1/2/3 columns)
- Color-coded cards (6 colors)
- Icon badges per card
- Hover scale and glow effects
- Bottom accent line animation
- Default 6 features (customizable)

**Props:**
```typescript
features?: Feature[]

// Feature interface
interface Feature {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: 'blue' | 'orange' | 'green' | 'purple' | 'emerald' | 'cyan'
}
```

**Example:**
```tsx
<FeatureCards
  features={[
    {
      id: 'water',
      icon: Droplets,
      title: 'Water',
      description: 'Independence through AWG technology',
      color: 'blue'
    }
  ]}
/>
```

---

## Import Guide

### Barrel Imports (Recommended)
```typescript
import {
  Sidebar,
  TopNav,
  AppShell,
  KPICard,
  ActivityFeed,
  ChatInterface,
  ProductCard,
  ProposalCard,
  Hero,
  FeatureCards
} from '@/components'
```

### Individual Imports
```typescript
import { Sidebar } from '@/components/core/Sidebar'
import { KPICard } from '@/components/dashboard/KPICard'
import { ChatInterface } from '@/components/chat/ChatInterface'
```

### Type Imports
```typescript
import type {
  Activity,
  NewsAlert,
  Product,
  Proposal,
  ChatMessage
} from '@/components/types'
```

---

## Component Categories

### Layout (4)
- Sidebar
- TopNav
- ThemeToggle
- AppShell

### Dashboard (3)
- KPICard
- ActivityFeed
- NewsHeadlines

### Data Display (5)
- ProductCard
- ProposalCard
- VoteBreakdown
- ScoreGauge
- FeatureCards

### Forms & Input (2)
- FilterTabs
- DocumentUpload

### Chat (2)
- ChatInterface
- EmetAvatar

### Landing (2)
- Hero
- FeatureCards

### Specialized (1)
- KillSwitchGauge

---

## Quick Component Selection

**For Dashboard:**
Use KPICard + ActivityFeed + NewsHeadlines

**For Marketplace:**
Use ProductCard + FilterTabs

**For DAO:**
Use ProposalCard + VoteBreakdown

**For Chat:**
Use ChatInterface + EmetAvatar

**For Landing:**
Use Hero + FeatureCards

**For Main Layout:**
Use AppShell (wraps everything)

---

## Component Statistics by Size

| Component | Lines | Complexity | Type |
|-----------|-------|-----------|------|
| EmetAvatar | 40 | Simple | Avatar |
| ThemeToggle | 50 | Simple | Toggle |
| ScoreGauge | 85 | Medium | Gauge |
| TopNav | 85 | Medium | Nav |
| FilterTabs | 95 | Medium | Filter |
| KPICard | 95 | Medium | Card |
| NewsHeadlines | 105 | Medium | Feed |
| ActivityFeed | 110 | Medium | Feed |
| Sidebar | 160 | Advanced | Nav |
| ProductCard | 150 | Advanced | Card |
| ProposalCard | 125 | Advanced | Card |
| VoteBreakdown | 135 | Advanced | Chart |
| KillSwitchGauge | 140 | Advanced | Gauge |
| DocumentUpload | 220 | Advanced | Upload |
| FeatureCards | 160 | Advanced | Grid |
| Hero | 130 | Advanced | Hero |
| ChatInterface | 200 | Advanced | Chat |
| AppShell | 75 | Advanced | Layout |

---

**Total:** 18 Components | 2,241+ Lines | Production-Ready

For more information, see the documentation files in the project root.
