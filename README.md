# Kubecost Dashboard

A modern, responsive dashboard for visualizing Kubernetes cost allocation across clusters, namespaces, and workflows. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Hierarchical Cost View**: Navigate from clusters to namespaces to individual workflows
- **Real-time Metrics**: CPU, RAM, storage, network, GPU, and efficiency costs
- **Animated Visualizations**: Smooth count-up animations and progress bars
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Mode Ready**: Token-based theming system

## Project Structure

```
kubecost/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard page
├── Components/             # React components
│   ├── ClusterCard.tsx     # Cluster overview card
│   ├── Dashboard.tsx       # Main dashboard layout
│   ├── KpiBar.tsx          # Key performance indicators
│   ├── MetricsBar.tsx      # Resource allocation bars
│   ├── NamespaceCard.tsx   # Namespace details card
│   ├── SpendChart.tsx      # Cost visualization chart
│   └── WorkflowCard.tsx    # Workflow cost card
├── hooks/
│   └── useClusterData.ts   # Data fetching and caching hook
├── tokens/
│   └── tokens.ts           # Design tokens and theme variables
└── public/                 # Static assets
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Architecture

The application fetches mock data from a JSON API and transforms it into Kubernetes cost metrics:

- **Clusters**: Top-level grouping with aggregated costs
- **Namespaces**: Logical groupings within clusters
- **Workflows**: Individual workloads with detailed resource usage

## Design System

All styling uses CSS custom properties defined in `tokens/tokens.ts` for consistent theming:

- Colors: Primary, secondary, accent, and semantic colors
- Typography: Font families and sizes
- Spacing: Consistent margins and padding
- Animations: Smooth transitions and entrance effects

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management and side effects

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
