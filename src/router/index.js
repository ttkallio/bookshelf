import { createRouter, createWebHistory } from "vue-router";

// Import
import BookListView from "../views/books/BookListView.vue";
import AddBookView from "../views/books/AddBookView.vue";
import BookDetailView from "../views/books/BookDetailView.vue";
import EditBookView from "../views/books/EditBookView.vue"; // <-- Added Import for Edit View

// Define the routes
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
    path: "/books/:id",
    name: "BookDetail",
    component: BookDetailView,
    props: true,
  },
  // Route for editing an existing book (dynamic)
  {
    path: "/books/:id/edit",
    name: "EditBook",
    component: EditBookView,
    props: true,
  },

  {
    path: "/",
    name: "Home",
    redirect: "/books",
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
