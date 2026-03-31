/**
 * ⚠️  DEPRECATED — This file is no longer used.
 *
 * All train and crowd data is now fetched from the live FastAPI backend:
 *   GET /trains  →  list & search trains
 *   GET /crowd/{id}  →  live crowd levels + compartment breakdown
 *   GET /predict/{id}  →  8-hour forecast
 *   GET /dashboard/kpis | /heatmap | /routes
 *
 * Station reference data has been moved to: src/data/stations.js
 * API calls are handled by:               src/data/apiClient.js
 *
 * Do NOT re-import this file.
 */

// getCrowdLevel is kept here as a no-dependency utility
// (also exported from stations.js — use that instead)
export function getCrowdLevel(density) {
  if (density <= 40) return 'low';
  if (density <= 70) return 'moderate';
  return 'high';
}
