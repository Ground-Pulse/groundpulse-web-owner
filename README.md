

 `groundpulse-web-owner`

```markdown
# groundpulse-web-owner

Customer-facing web application for Property Owners and Field Inspectors[cite: 1].

---

## 🎯 Purpose of This Repo
This Next.js application hosts the interfaces for remote Property Owners to register assets and approve repairs, as well as the specialized field checklists used by Inspectors on site[cite: 1].

## ❓ Why We Created This Repo
We isolated the owner and inspector surfaces into this repo because they form the customer-facing core loop of GroundPulse[cite: 1]:
- **Owner Experience:** Remote visibility for NRI and portfolio owners via multi-property dashboards, health scores, and an approval gate for flagged issues[cite: 1].
- **Inspector Experience:** Mobile-optimized, room-by-room digital checklists that allow saving drafts locally and uploading photos/videos per checklist item[cite: 1].
- **Isolation:** Keeps end-user client code and customer design tokens decoupled from back-office admin and contractor interfaces[cite: 1].

## 📂 File Structure
```text
groundpulse-web-owner/
├── app/
│   ├── (owner)/
│   │   ├── dashboard/page.tsx         # Multi-property cards & health rings
│   │   ├── property/[id]/page.tsx     # Inspection timeline & issue list
│   │   └── issue/[id]/page.tsx        # Media evidence & Approve/Decline actions
│   ├── (inspector)/
│   │   ├── inspections/page.tsx       # Daily assigned jobs schedule
│   │   └── inspection/[id]/checklist/page.tsx # Room-by-room inspection form
│   ├── (modals)/
│   │   ├── add-property.tsx           # Property onboarding dialog
│   │   └── schedule-inspection.tsx    # Date & recurrence booking modal
│   ├── layout.tsx                     # Global layout & context providers
│   └── middleware.ts                  # Route guard matching user roles
├── components/
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   └── HealthScoreRing.tsx        # Animated SVG health ring
│   ├── checklist/
│   │   ├── ChecklistItemRow.tsx       # Pass/Fail/Attention segmented control
│   │   └── FlagIssueSheet.tsx         # Issue-flagging bottom sheet
│   └── ui/                            # Shared Radix/shadcn UI primitives
├── stores/
│   ├── activeChecklistStore.ts        # Zustand draft store with optimistic updates
│   └── realtimeStore.ts               # Socket.IO client event store
├── lib/
│   ├── apiClient.ts                   # Fetch wrapper targeting groundpulse-api
│   └── socket.ts                      # Authenticated WebSocket client singleton
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
💻 Commands
Bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Run tests
npm test

# 5. Build for production
npm run build
🔑 Required Environment Variables
Code snippet
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
