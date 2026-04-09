# Kubecost — Kubernetes Cost Visibility Dashboard

## Feature Choice
I chose the **Kubernetes Cost Allocation Dashboard** — inspired by Kubecost — because it maps naturally to all the challenge's technical requirements: hierarchical data (Cluster → Namespace → Workflow), real async fetching, meaningful animations for cost numbers, and complex responsive layout needs.

---

## Architecture

```
src/
  tokens/
    tokens.ts          ← CSS variables + TS token references
  hooks/
    useClusterData.ts  ← Fetching, data shaping, in-memory cache
  components/
    Dashboard.tsx      ← Root layout, header, tab nav, global CSS
    KpiBar.tsx         ← Animated KPI summary row
    ClusterCard.tsx    ← Expandable cluster with CountUp animation
    NamespaceCard.tsx  ← Expandable namespace inside cluster
    WorkflowCard.tsx   ← Leaf-level workflow row
    MetricsBar.tsx     ← Stacked + individual metric bars
    SpendChart.tsx     ← Horizontal stacked bar chart by cluster
    SavingsInsights.tsx ← Auto-generated optimization recommendations
```

---

## Token Architecture

All colors, radii, shadows, and transitions are defined once in `tokens/tokens.ts` as CSS custom properties on `:root`. Components reference `var(--color-accent-primary)` etc. — never hardcoded hex. This makes theming and dark/light mode a one-line change.

---

## Animation Approach

- **Scroll-triggered entrance**: `IntersectionObserver` drives `opacity` + `translateY` on every card. Each card animates in staggered via `transition-delay`.
- **CountUp**: KPI values and cluster totals count from 0 using `requestAnimationFrame` with a cubic-ease-out curve.
- **Bar fill animations**: Resource allocation bars animate from `width: 0%` to their value on mount, staggered per metric.
- **Expand/collapse**: Namespace and workflow panels use `slideDown` keyframe.
- **`prefers-reduced-motion`**: A single media query sets all animation/transition durations to `0.01ms`, fully disabling motion for users who need it.

---

## Data Fetching & Caching

Uses a **manual in-memory cache** with stale-while-revalidate pattern:

```ts
const CACHE = { data: null, ts: 0, TTL: 5 * 60 * 1000 };
const isFresh = () => Date.now() - CACHE.ts < CACHE.TTL;
```

- First visit: shows skeleton loaders, fetches from `dummyjson.com/products`, transforms & caches.
- Revisit within 5 minutes: instant display from cache (no network request). A "Cached" badge confirms it.
- Uses `AbortController` to cancel in-flight requests on unmount.

---

## Modern CSS Used

| Feature | Where |
|---|---|
| `clamp()` | Fluid font sizes and grid column widths (`clamp(260px, 40%, 460px)`) |
| CSS custom properties | Every color, radius, shadow, transition |
| `container-type: inline-size` | ClusterCard adapts at small container sizes |
| Logical properties | `margin-inline`, `padding-inline`, `padding-block` throughout |
| CSS nesting | Via style injection (works in modern browsers) |
| `backdrop-filter` | Sticky header frosted glass effect |

---

## Libraries Used

| Library | Why |
|---|---|
| React | Component architecture |
| TypeScript | Type safety for data shapes |
| No UI library | Built from scratch per requirements |

---

## Tradeoffs & Decisions

- **DummyJSON as data source**: Product data is mapped to cost metrics. CPU ≈ price, RAM ≈ stock, etc. Not semantically "real" but the async data handling is genuine.
- **Manual cache over TanStack Query**: Avoids a dependency for a straightforward use case. TanStack Query would be preferred in a real app for retry, background refetch, devtools.
- **Inline styles for component logic**: Keeps components self-contained and avoids CSS Modules setup overhead for this challenge.

---

## What I'd Improve With More Time

- Replace manual cache with TanStack Query
- Add a real charting library (Recharts) for sparklines matching the reference screenshot
- Dark/light toggle (token architecture makes it trivial)
- Proper Next.js App Router with `fetch` cache headers
- Unit tests for data transformation functions
- More breakpoints for the sidebar → stacks below the grid on mobile
