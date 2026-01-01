# FormGuard Dashboard

A comprehensive SaaS dashboard for FormGuard - a form intelligence and lead quality scoring platform. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Magic link email authentication
- **Dashboard**: Overview with stats, charts, and recent submissions
- **Forms Management**: Create, edit, and manage form tracking
- **Submissions**: View and analyze all form submissions with filtering
- **Analytics**: Charts and visualizations for form performance
- **Settings**: Organization, team members, billing, and API keys management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: JWT tokens with localStorage

## Project Structure

```
├── app/
│   ├── auth/verify/          # Email verification page
│   ├── dashboard/            # Main dashboard
│   ├── forms/                # Forms management
│   │   └── [id]/            # Form details
│   ├── submissions/          # Submissions list & details
│   │   └── [id]/            # Submission details
│   ├── settings/             # Settings with tabs
│   ├── analytics/            # Analytics page
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout with auth provider
│   └── globals.css           # Global styles with custom theme
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard-layout.tsx  # Main dashboard layout
│   ├── protected-route.tsx   # Auth protection wrapper
│   ├── stat-card.tsx         # Reusable stat display
│   ├── quality-score-badge.tsx
│   ├── action-badge.tsx
│   ├── create-form-dialog.tsx
│   ├── copy-button.tsx
│   ├── code-block.tsx
│   ├── empty-state.tsx
│   ├── confirm-dialog.tsx
│   └── loading-skeleton.tsx
├── lib/
│   ├── auth-context.tsx      # Authentication context
│   ├── api.ts                # API client functions
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # Utility functions
└── proxy.ts                  # Middleware for route protection
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (required)

## API Integration

The app connects to a backend API at `/api/v1` with the following endpoints:

### Authentication
- `POST /auth/magic-link` - Send magic link email
- `POST /auth/verify` - Verify magic link token
- `GET /auth/me` - Get current user

### Organizations
- `GET /organizations` - Get organization details
- `PUT /organizations` - Update organization
- `GET /organizations/stats` - Dashboard statistics
- `POST /organizations/members` - Invite team member
- `DELETE /organizations/members/:id` - Remove member

### Forms
- `GET /forms` - List all forms
- `POST /forms` - Create new form
- `GET /forms/:id` - Get form details
- `PUT /forms/:id` - Update form
- `DELETE /forms/:id` - Delete form
- `POST /forms/:id/regenerate-key` - Regenerate API key
- `GET /forms/:id/analytics` - Form analytics

### Submissions
- `GET /submissions` - List submissions (with filters)
- `GET /submissions/:id` - Submission details
- `PUT /submissions/:id` - Update submission action
- `DELETE /submissions/:id` - Delete submission
- `GET /submissions/export` - Export to CSV

## Key Features

### Dashboard Layout
- Responsive sidebar with collapsible mobile menu
- Top bar with usage stats and plan badge
- User profile dropdown with logout

### Forms Management
- Create forms with auto-action configurations
- API key management with copy and regenerate
- SDK installation instructions
- Form-specific analytics and submissions

### Submissions
- Filterable table with bulk actions
- Color-coded quality scores (red: 0-40, yellow: 41-70, green: 71-100)
- Detailed submission view with flags and timeline
- CSV export functionality

### Settings
- Organization profile management
- Team member invitations
- Billing with usage tracking and plan comparison
- Centralized API keys view

## Color System

The app uses a custom blue-themed color palette:

- **Primary**: Blue (#3B82F6) - Main brand color
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Yellow (#F59E0B) - Flagged items
- **Danger**: Red (#EF4444) - Blocked/destructive actions

## Authentication Flow

1. User enters email on login page
2. Magic link sent to email
3. User clicks link with token
4. Token verified and JWT stored in localStorage
5. Protected routes check for valid token

## Development

### Adding New Pages

1. Create page component in `app/` directory
2. Wrap with `<ProtectedRoute>` if authentication required
3. Use `<DashboardLayout>` for consistent layout
4. Add navigation item in `dashboard-layout.tsx` if needed

### Adding New API Endpoints

1. Add function to `lib/api.ts`
2. Use the `fetchApi` wrapper for consistent error handling
3. JWT token automatically included in requests

### Styling Guidelines

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use semantic color tokens from globals.css
- Maintain consistent spacing with Tailwind scale

## Building for Production

```bash
npm run build
npm start
```

## License

This project is private and confidential.
