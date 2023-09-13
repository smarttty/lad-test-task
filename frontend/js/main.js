import { router } from './router.js';


// Update router
window.addEventListener("popstate", () => router());
window.addEventListener("DOMContentLoaded", () => router());

