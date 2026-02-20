# EMET Platform Components - Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Verify Dependencies

The components require these packages (should already be in your project):

```bash
npm list react typescript tailwindcss lucide-react
```

If missing, install:
```bash
npm install react@19 typescript tailwindcss lucide-react
```

### 2. Ensure Required Utility Function

Check that `/lib/utils` has the `cn` function:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 3. Configure Tailwind Colors (if needed)

Update `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        destructive: '#ef4444',
      },
      backgroundColor: {
        'dark-bg': '#0a0f1a',
      }
    }
  }
}
```

## Basic Usage Examples

### Example 1: Simple Dashboard Layout

```tsx
'use client';

import { useState } from 'react';
import { AppShell, KPICard } from '@/components';
import { Users, Vote, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  return (
    <AppShell
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      walletAddress="0x1234567890123456789012345678901234567890"
      onDisconnect={() => alert('Disconnected')}
      pageTitle="Dashboard"
      notificationCount={3}
    >
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
    </AppShell>
  );
}
```

### Example 2: Chat Page

```tsx
'use client';

import { useState, useCallback } from 'react';
import { ChatInterface } from '@/components';
import type { ChatMessage } from '@/components/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI thinking
    setIsThinking(true);
    
    // Call your API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content })
      });
      const data = await response.json();
      
      // Add EMET response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'emet',
        content: data.response,
        timestamp: new Date(),
      }]);
    } finally {
      setIsThinking(false);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-16rem)] p-4">
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isThinking={isThinking}
        onFileUpload={(file) => console.log('Upload:', file)}
      />
    </div>
  );
}
```

### Example 3: Marketplace

```tsx
'use client';

import { useState } from 'react';
import { ProductCard, FilterTabs } from '@/components';
import type { Product } from '@/components/types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'SkyFlow AWG-2000',
    description: 'Atmospheric water generation system',
    category: 'awg',
    price: 2499,
    currency: 'USD',
    specs: [
      { label: 'Daily Yield', value: '50L' },
      { label: 'Power', value: '500W' }
    ],
    resellerLinks: [
      { name: 'Amazon', url: 'https://amazon.com' }
    ],
    hasFinancing: true,
    rating: 4.8,
  },
  // ... more products
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'awg', label: 'AWGs' },
    { id: 'solar', label: 'Solar' },
    { id: 'food', label: 'Food Growing' },
    { id: 'housing', label: 'Housing' }
  ];

  return (
    <div className="space-y-6">
      <FilterTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRODUCTS.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('Added:', p.name)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Example 4: DAO Voting

```tsx
'use client';

import { ProposalCard, VoteBreakdown } from '@/components';
import type { Proposal } from '@/components/types';

const PROPOSAL: Proposal = {
  id: '1',
  title: 'Increase Community Fund Allocation',
  description: 'Raise monthly allocation from 5% to 7%',
  status: 'VOTING',
  creator: '0xabcd...ef12',
  yesVotes: 7500,
  noVotes: 2300,
  totalVotes: 9800,
  votingEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
};

export default function ProposalPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ProposalCard
        proposal={PROPOSAL}
        onVote={(id, vote) => console.log('Vote:', vote)}
      />

      <VoteBreakdown
        yesCount={PROPOSAL.yesVotes}
        noCount={PROPOSAL.noVotes}
        abstainCount={100}
        threshold={75}
        minParticipants={5000}
        totalVotes={PROPOSAL.totalVotes}
      />
    </div>
  );
}
```

### Example 5: Landing Page

```tsx
import { Hero, FeatureCards } from '@/components';

export default function LandingPage() {
  return (
    <>
      <Hero
        onConnectWallet={() => window.location.href = '/auth/connect'}
        onLearnMore={() => document.getElementById('features')?.scrollIntoView()}
      />

      <div id="features">
        <FeatureCards />
      </div>
    </>
  );
}
```

## Component Import Paths

All components can be imported from the main barrel export:

```typescript
// This works
import { Sidebar, KPICard, ChatInterface } from '@/components';

// Or individual imports
import { Sidebar } from '@/components/core/Sidebar';
import { KPICard } from '@/components/dashboard/KPICard';

// Types
import type { Product, Proposal, Activity } from '@/components/types';
```

## Common Tasks

### Change Primary Color Globally

All primary color usages use the `primary` Tailwind class. To change:

```tailwind
/* In your CSS or tailwind.config.ts */
--color-primary: #your-color-here;
```

### Add a New Navigation Item to Sidebar

Edit `/src/components/core/Sidebar.tsx`:

```tsx
const NAV_ITEMS: NavItem[] = [
  // ... existing items
  { 
    id: 'new-page', 
    label: 'New Page', 
    icon: NewIcon, 
    path: '/new-page' 
  },
];
```

### Customize Component Colors

Most components accept a `color` prop:

```tsx
<KPICard
  title="Example"
  value={100}
  icon={<Icon />}
  color="green"  // or 'blue', 'orange', 'red'
/>
```

### Disable/Enable Features

Most features are props-based:

```tsx
// Optional notifications
<TopNav title="Page" notificationCount={0} />

// Optional change indicator
<KPICard title="Value" value={123} change="+5%" />

// Optional voting
<ProposalCard proposal={data} onVote={handleVote} />
```

## Troubleshooting

### "cn is not defined" Error
- Ensure `/lib/utils.ts` exists with cn function
- Check import path: `import { cn } from '@/lib/utils'`

### Icons not showing
- Install lucide-react: `npm install lucide-react`
- Verify imports: `import { IconName } from 'lucide-react'`

### Styling issues
- Ensure Tailwind CSS is configured in your project
- Check that dark mode is enabled in tailwind.config.ts
- Verify color classes are available (primary, success, warning, destructive)

### TypeScript errors
- Install types: `npm install -D @types/react @types/node`
- Ensure tsconfig.json has proper path aliases configured
- Check `@/components` alias resolves correctly

## Performance Tips

1. **Memoize complex components:**
   ```tsx
   const Dashboard = React.memo(() => { ... });
   ```

2. **Lazy load components:**
   ```tsx
   const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'));
   ```

3. **Use proper keys in lists:**
   ```tsx
   {items.map(item => <Component key={item.id} {...item} />)}
   ```

4. **Separate state management:**
   ```tsx
   const [messages, setMessages] = useState([]); // Keep separate
   ```

## File Structure Reference

```
Your Project
├── src/
│   ├── components/          ← All 18 components here
│   ├── lib/
│   │   └── utils.ts        ← Must have cn() function
│   ├── app/
│   │   ├── dashboard/
│   │   ├── chat/
│   │   ├── marketplace/
│   │   ├── dao/
│   │   └── layout.tsx      ← Use AppShell here
│   └── ...
└── tailwind.config.ts      ← Configure colors
```

## Next Steps

1. ✓ Install dependencies
2. ✓ Create utility function (`cn`)
3. ✓ Import components in your pages
4. ✓ Connect to your data/APIs
5. ✓ Customize colors if needed
6. ✓ Add routes matching Sidebar nav items

## Support Resources

- Component Documentation: `/src/components/README.md`
- Detailed Guide: `/COMPONENTS_GUIDE.md`
- Full Inventory: `/COMPONENT_INVENTORY.md`
- TypeScript Types: `/src/components/types.ts`

---

**Ready to go!** Start using components immediately. All are production-ready and fully tested.
