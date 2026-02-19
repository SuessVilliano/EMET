# EMET Platform - UI Component Library

A production-ready component library built with React 19, TypeScript, Tailwind CSS, and lucide-react icons for the EMET platform.

## Design System

- **Colors:**
  - Primary: `#3b82f6` (Blue)
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)
  - Destructive: `#ef4444` (Red)
  - Dark Background: `#0a0f1a`

- **Typography:** Dark-mode first, high contrast white text
- **Animations:** Smooth transitions (200-300ms), subtle hover effects
- **Icons:** All from lucide-react

## Core Components

### Sidebar
Navigation sidebar with collapse functionality.
- **Props:** `currentPath`, `onNavigate`, `walletAddress`, `onDisconnect`
- **Width:** 240px expanded, 64px collapsed
- **Features:** Collapsible, mobile overlay, active state indicators, wallet disconnect button
- **Location:** `/core/Sidebar.tsx`

### TopNav
Top navigation bar with search and notifications.
- **Props:** `title`, `subtitle?`, `notificationCount?`
- **Features:** Breadcrumb, search bar, notifications bell with badge, theme toggle, user avatar
- **Location:** `/core/TopNav.tsx`

### ThemeToggle
Simple sun/moon theme toggle.
- **Props:** (Uses internal state, can be extended with context)
- **Features:** Smooth icon transition, circular button
- **Location:** `/core/ThemeToggle.tsx`

### AppShell
Main layout wrapper combining Sidebar + TopNav + content.
- **Props:** `children`, `currentPath`, `onNavigate`, `walletAddress`, `onDisconnect`, `pageTitle`, `pageSubtitle?`, `notificationCount?`
- **Features:** Responsive layout, mobile-friendly, state management
- **Location:** `/core/AppShell.tsx`

## Shared Components

### ScoreGauge
SVG-based circular progress indicator.
- **Props:** `value` (0-100), `size` (sm|md|lg), `label?`
- **Features:** Animated fill, color-coded (green >= 75%, yellow >= 50%, red < 50%)
- **Location:** `/shared/ScoreGauge.tsx`

## Dashboard Components

### KPICard
Metric card with icon, value, and change indicator.
- **Props:** `title`, `value`, `change?`, `icon`, `color?`
- **Features:** Glass-morphism design, trend indicator with arrow, colored icon circle
- **Location:** `/dashboard/KPICard.tsx`

### ActivityFeed
Timeline-based activity list.
- **Props:** `activities[]` with type, title, description, timestamp, actor
- **Features:** Timeline dots, relative timestamps, type badges with colors, scrollable
- **Location:** `/dashboard/ActivityFeed.tsx`

### NewsHeadlines
Mini news feed with threat level indicators.
- **Props:** `alerts[]` with threat levels (critical, high, medium, low)
- **Features:** Pulsing critical badges, category badges, compact cards
- **Location:** `/dashboard/NewsHeadlines.tsx`

## Marketplace Components

### ProductCard
Product display card with image, specs, and reseller links.
- **Props:** `Product` type with name, description, price, image, specs, category, resellerLinks
- **Features:** Hover scale effect, category badges, financing indicator, reseller links with external icon
- **Location:** `/marketplace/ProductCard.tsx`

### FilterTabs
Horizontal scrollable category filter tabs.
- **Props:** `categories`, `active`, `onChange`
- **Features:** Smooth scrolling with buttons, active state highlighting, responsive
- **Location:** `/marketplace/FilterTabs.tsx`

## DAO Components

### ProposalCard
DAO proposal display with voting progress.
- **Props:** `Proposal` type with title, description, status, vote counts, timestamps
- **Features:** Status badges, vote progress bar with percentages, time remaining, creator info
- **Location:** `/dao/ProposalCard.tsx`

### VoteBreakdown
Vote visualization with threshold indicator.
- **Props:** `yesCount`, `noCount`, `abstainCount`, `threshold?`, `minParticipants?`, `totalVotes`
- **Features:** Stacked bar chart, threshold line marker, vote count cards, participation indicator
- **Location:** `/dao/VoteBreakdown.tsx`

## Chat Components

### ChatInterface
Full-featured chat UI with message history and input.
- **Props:** `messages[]`, `onSendMessage?`, `isThinking?`, `onFileUpload?`
- **Features:** Auto-scroll, auto-resizing textarea, file upload, typing indicator, message timestamps
- **Location:** `/chat/ChatInterface.tsx`

### EmetAvatar
EMET's branded avatar with shield icon.
- **Props:** `size?` (sm|md|lg), `speaking?`
- **Features:** Blue gradient background, pulse animation when speaking, consistent branding
- **Location:** `/chat/EmetAvatar.tsx`

## Kill Switch Components

### KillSwitchGauge
Large circular gauge showing shutdown vote progress.
- **Props:** `votePercentage`, `currentVotes`, `requiredVotes`, `status` (inactive|voting|shutdown)
- **Features:** Red/green gradient based on progress, 75% threshold visualization, pulsing shutdown status
- **Location:** `/kill-switch/KillSwitchGauge.tsx`

## Document Components

### DocumentUpload
Drag-and-drop document upload with progress tracking.
- **Props:** `onUpload?`, `acceptedFormats?`
- **Features:** Drag-and-drop support, category selector, progress bars, status indicators, file list
- **Accepted:** PDF, DOCX, TXT, CSV, PNG, JPG, GIF
- **Location:** `/documents/DocumentUpload.tsx`

## Landing Components

### Hero
Landing page hero with gradient text and CTAs.
- **Props:** `onConnectWallet?`, `onLearnMore?`
- **Features:** Animated particle background, gradient text, feature icons row, dual CTAs, Hebrew subtitle
- **Location:** `/landing/Hero.tsx`

### FeatureCards
6-card feature grid with hover effects.
- **Props:** `features?` (defaults to 6 hardcoded features)
- **Features:** Glass-morphism cards, icon badges, hover glow effect, color-coded by feature
- **Location:** `/landing/FeatureCards.tsx`

## Usage Examples

### Importing Components

```typescript
// Individual imports
import { Sidebar } from '@/components/core/Sidebar';
import { KPICard } from '@/components/dashboard/KPICard';

// Barrel imports
import { Sidebar, TopNav, KPICard, ChatInterface } from '@/components';
```

### Using AppShell

```tsx
<AppShell
  currentPath={currentPath}
  onNavigate={setCurrentPath}
  walletAddress="0x1234...5678"
  onDisconnect={handleDisconnect}
  pageTitle="Dashboard"
  pageSubtitle="Welcome back"
  notificationCount={3}
>
  {/* Your page content */}
</AppShell>
```

### Using ChatInterface

```tsx
<ChatInterface
  messages={messages}
  onSendMessage={handleSendMessage}
  isThinking={aiIsThinking}
  onFileUpload={handleFileUpload}
/>
```

### Using Dashboard Components

```tsx
<KPICard
  title="Total Votes"
  value={1234}
  change="+12%"
  icon={<Vote className="w-6 h-6" />}
  color="blue"
/>
```

## Accessibility Features

- All interactive elements have proper `aria-label` attributes
- Semantic HTML with proper heading hierarchy
- High contrast colors meeting WCAG AA standards
- Keyboard navigation support
- Focus states visible on all interactive elements
- Proper role attributes (button, tab, etc.)

## Performance Considerations

- Components use React.memo where appropriate
- Lazy loading support for image-heavy components
- Optimized SVG rendering for gauges
- Minimal re-renders with proper dependency arrays
- No unnecessary DOM mutations

## TypeScript Support

All components are fully typed with:
- Explicit interface definitions for props
- Proper return types
- Type-safe event handlers
- Full IntelliSense support in IDEs

## Dependencies

- `react` 19+
- `typescript`
- `tailwindcss`
- `lucide-react`
- `@/lib/utils` (cn utility from clsx + twMerge)

## Customization

Components can be customized through:
- Tailwind CSS classes (all color utilities are available)
- Component props and callbacks
- SVG values in gauge components
- Custom icon components passed as props

## Animation & Transitions

All components feature:
- Smooth 200-300ms transitions
- Hardware-accelerated transforms
- GPU-friendly opacity changes
- Subtle hover and active states
- Pulse and bounce animations where appropriate

---

For questions or issues, refer to the individual component files for detailed implementation.
