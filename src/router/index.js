import { createRouter, createWebHistory } from "vue-router";

// Import
import BookListView from "../views/books/BookListView.vue";
import AddBookView from "../views/books/AddBookView.vue";
import BookDetailView from "../views/books/BookDetailView.vue";
import EditBookView from "../views/books/EditBookView.vue";

// Define the routes
const routes = [
  {
    path: "/books",
    name: "BookList",
    component: BookListView,
  },
  {
    path: "/books/add",
    name: "AddBook",
    component: AddBookView,
  },
  {
    path: "/books/:id",
    name: "BookDetail",
    component: BookDetailView,
    props: true,
  },
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

// Router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
