// Public data API used across the app.
//
// For now, the source of truth is the mock dataset in `mock-data.ts`. When
// Supabase env vars are set, the async helpers in `supabase-data.ts` query
// the real DB and the sync re-exports below fall back to mocks. This keeps
// the build green without env vars and lets pages migrate to the async API
// progressively.

export {
  categories,
  products,
  getCategory,
  getProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getAdjacentProducts,
} from "./mock-data";
