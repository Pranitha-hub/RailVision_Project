/**
 * ⚠️  DEPRECATED — This file is no longer used.
 *
 * Crowd predictions are now fetched from the live FastAPI backend:
 *   GET /predict/{train_id}  →  returns 8-hour predictions
 *
 * The backend uses real crowd_data from PostgreSQL seeded in seed_data.py
 * and applies time-based pattern modelling in predictions.py
 *
 * Do NOT re-import this file.
 */
