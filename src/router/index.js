import { createRouter, createWebHistory } from "vue-router";

// Import the View component we want to map a route to
// Path uses lowercase 'books' assuming that's the directory name
import BookListView from "../views/books/BookListView.vue";
// Import the AddBookView component
import AddBookView from "../views/books/AddBookView.vue";
// Import other views as you create them
// import HomeView from '../views/HomeView.vue'; // Example
// import NotFoundView from '../views/NotFoundView.vue'; // Example for 404

// Define the routes for the application
// Each object represents a route configuration
const routes = [
  // Removed TypeScript type annotation: Array<RouteRecordRaw>
  // Route for the book list view
  {
    path: "/books", // The URL path for this route
    name: "BookList", // A unique name for this route (useful for programmatic navigation)
    component: BookListView, // The component to render when this path is visited
    // If authentication was required, you would add:
    // meta: { requiresAuth: true }
  },
  // Route for adding a new book
  {
    path: "/books/add",
    name: "AddBook",
    component: AddBookView,
    // No meta: { requiresAuth: true } needed since login is descoped
  },
  // Example: Add a default route that redirects to the book list
  {
    path: "/",
    name: "Home",
    redirect: "/books", // Automatically go to /books when visiting the root path
  },

  // Example: Add a catch-all 404 route (must be last)
  // {
  //   path: '/:pathMatch(.*)*', // Matches any path not matched above
  //   name: 'NotFound',
  //   component: NotFoundView
  // }
];

// Create the router instance
const router = createRouter({
  // Use HTML5 history mode for cleaner URLs (no #)
  // Requires server configuration for deployment if users access deep links directly.
  // Use process.env.BASE_URL for Vue CLI projects (Webpack)
  history: createWebHistory(process.env.BASE_URL), // <-- CORRECTED THIS LINE
  routes, // Pass the array of route configurations
});

/*
 * Navigation Guard Example (if/when authentication is added back)
 * Note: If using JS, you wouldn't typically import the store type here.
 * You'd import the store instance directly inside the guard.
 *
 * import { useAuthStore } from '../stores/auth'; // Assuming you have an auth store in JS
 *
 * router.beforeEach((to, from, next) => {
 * const authStore = useAuthStore();
 * const requiresAuth = to.meta.requiresAuth;
 *
 * // Check a getter or state property like authStore.isAuthenticated or authStore.isLoggedIn
 * if (requiresAuth && !authStore.isAuthenticated) {
 * // If route requires auth and user is not logged in, redirect to login
 * next({ name: 'Login', query: { redirect: to.fullPath } });
 * } else {
 * // Otherwise, allow navigation
 * next();
 * }
 * });
 */

// Export the router instance so it can be used in main.js
export default router;
