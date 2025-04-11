// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

// --- Import View Components ---
import BookListView from "../views/books/BookListView.vue";
import AddBookView from "../views/books/AddBookView.vue";
import BookDetailView from "../views/books/BookDetailView.vue"; // <-- Added Import
// import HomeView from '../views/HomeView.vue'; // Example
// import NotFoundView from '../views/NotFoundView.vue'; // Example for 404

// Define the routes for the application
const routes = [
  // Route for the book list view
  {
    path: "/books",
    name: "BookList",
    component: BookListView,
  },
  // Route for adding a new book
  {
    path: "/books/add",
    name: "AddBook",
    component: AddBookView,
  },
  // Route for viewing book details (dynamic)
  {
    path: "/books/:id", // Dynamic segment ':id' captures the book ID
    name: "BookDetail", // Unique name for this route
    component: BookDetailView, // Component to render
    props: true, // Pass route params (like :id) as props to the component
    // No meta: { requiresAuth: true } needed since login is descoped
  },
  // Example: Add a default route that redirects to the book list
  {
    path: "/",
    name: "Home",
    redirect: "/books",
  },

  // Example: Add a catch-all 404 route (must be last)
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: NotFoundView
  // }
];

// Create the router instance
const router = createRouter({
  // Use HTML5 history mode
  history: createWebHistory(process.env.BASE_URL),
  routes, // Pass the array of route configurations
});

/*
 * Navigation Guard Example (if/when authentication is added back)
 * import { useAuthStore } from '../stores/auth';
 * router.beforeEach((to, from, next) => { ... });
 */

// Export the router instance
export default router;
