// ============================================
// RailVision — Main Entry Point
// AI-Powered Crowd Intelligence Platform
// ============================================

import './styles/index.css';
import { initRouter } from './router.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  initRouter();
}
