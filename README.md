
### 3. `groundpulse-web-owner` 

```markdown
# GroundPulse Owner & Inspector Web Application (`groundpulse-web-owner`)

Client-facing web application containing the **Owner Dashboard** and the **Inspector Field Interface** for GroundPulse.

---

## 📌 Work of This Repo
This frontend application serves the property condition monitoring loop:
- **Owner Dashboard (`/dashboard`, `/property/[id]`):** Portfolio management cards, 
animated property health score rings, timeline of past inspections, issue inspection galleries, 
and the approve/decline repair workflow.
- **Inspector Field Checklist (`/inspections`, `/inspection/[id]/checklist`):** Mobile-optimized 
on-site checklist categorized by room/area, optimistic pass/fail/attention toggles, 
photo/video capture uploads, draft saving, and issue flagging sheets.
- **Real-Time Updates:** Live status tracker for repairs and notification updates pushed directly 
via Socket.IO without manual browser refreshes.

## ❓ Why We Created This Repo
The Owner and Inspector workflows are directly interdependent: the owner books an inspection, 
the inspector executes the field checklist, and the owner immediately reviews the 
flagged items and reports. Grouping them into this repository keeps client-facing customer UX isolated from internal admin and contractor management tooling.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router) + React 18
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **State Management:** TanStack Query v5 (server data) + Zustand (active checklist draft & preferences)
- **Forms & Validation:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Sockets:** Socket.IO Client

## 📁 File Structure
```text
groundpulse-web-owner/
├── app/
│   ├── (owner)/
│   │   ├── dashboard/page.tsx
│   │   ├── property/[id]/page.tsx
│   │   └── issue/[id]/page.tsx
│   ├── (inspector)/
│   │   ├── inspections/page.tsx
│   │   └── inspection/[id]/checklist/page.tsx
│   ├── layout.tsx
│   └── middleware.ts
├── components/
│   ├── ui/
│   ├── checklist/
│   │   ├── ChecklistItemRow.tsx
│   │   └── FlagIssueSheet.tsx
│   └── property/
│       ├── HealthScoreRing.tsx
│       └── PropertyCard.tsx
├── hooks/
│   ├── useInspections.ts
│   ├── useIssues.ts
│   └── useProperties.ts
├── stores/
│   └── activeChecklistStore.ts
├── lib/
│   ├── apiClient.ts
│   └── socket.ts
├── package.json
└── README.md
💻 Commands
Bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Run build for production
npm run build

# Run component and unit tests
npm test
🔑 Required Environment Variables
Code snippet
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
