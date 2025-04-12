<template>
  <div class="book-detail-view container py-4">
    <div class="mb-3">
      <router-link to="/books" class="text-decoration-none">
        &larr; Back to List
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center text-muted py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading book details...</p>
    </div>

    <div v-else-if="!book" class="text-center text-danger py-5">
      <p class="fw-bold">Book not found.</p>
      <router-link to="/books" class="btn btn-sm btn-outline-secondary mt-2">
        &larr; Back to List
      </router-link>
    </div>

    <div v-else class="card">
      <div class="card-body">
        <h1 class="card-title h2 mb-2">{{ book.title }}</h1>
        <h2 class="card-subtitle h5 mb-3 text-muted">by {{ book.author }}</h2>

        <div class="row mb-3">
          <div class="col-md-6 mb-2">
            <strong class="d-block text-muted small">Genre:</strong>
            <span>{{ book.genre || "N/A" }}</span>
          </div>
          <div class="col-md-6 mb-2">
            <strong class="d-block text-muted small">Year Published:</strong>
            <span>{{ book.yearPublished || "N/A" }}</span>
          </div>
          <div class="col-md-6 mb-2">
            <strong class="d-block text-muted small">Rating:</strong>
            <span>{{ book.rating ? `${book.rating} / 5` : "N/A" }}</span>
          </div>
          <div class="col-md-6 mb-2">
            <strong class="d-block text-muted small">Status:</strong>
            <span
              class="badge"
              :class="book.listType === 'owned' ? 'bg-success' : 'bg-info'"
            >
              {{ book.listType === "want" ? "Want to Read" : "Owned" }}
            </span>
          </div>
          <div class="col-md-6 mb-2">
            <strong class="d-block text-muted small">Date Added:</strong>
            <span>{{ formattedDateAdded }}</span>
          </div>
        </div>

        <div v-if="book.notes" class="mt-3">
          <h3 class="h6 fw-bold">Notes:</h3>
          <p class="mt-1 text-muted" style="white-space: pre-wrap">
            {{ book.notes }}
          </p>
        </div>

        <div class="pt-3 border-top mt-4">
          <router-link
            v-if="book"
            :to="{ name: 'EditBook', params: { id: book.id } }"
            class="btn btn-warning btn-sm me-2"
          >
            Edit
          </router-link>
          <button
            v-if="book"
            @click="confirmAndDeleteBook"
            class="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBooksStore } from "../../stores/books";
import { storeToRefs } from "pinia";

// --- Props ---
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// --- Composables ---
const router = useRouter();
const booksStore = useBooksStore();

// --- State ---
const { isLoading } = storeToRefs(booksStore);

// --- Getters ---
const book = computed(() => {
  return booksStore.getBookById(props.id);
});

const formattedDateAdded = computed(() => {
  if (book.value?.dateAdded) {
    const date =
      book.value.dateAdded instanceof Date
        ? book.value.dateAdded
        : new Date(book.value.dateAdded);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "N/A";
});

// --- Actions ---
const { deleteBook } = booksStore;

// --- Methods ---
const confirmAndDeleteBook = async () => {
  if (!book.value) {
    console.error("Cannot delete: book data not available.");
    return;
  }
  const isConfirmed = window.confirm(
    `Are you sure you want to delete "${book.value.title}"? This action cannot be undone.`
  );
  if (isConfirmed) {
    console.log(`User confirmed deletion for book ID: ${props.id}`);
    try {
      const success = await deleteBook(props.id);
      if (success) {
        console.log("Book deleted successfully, navigating back to list.");
        router.push("/books");
      } else {
        console.error("Store action deleteBook reported failure.");
        alert("Failed to delete book. It might have already been removed.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("An error occurred while deleting the book.");
    }
  } else {
    console.log("User cancelled deletion.");
  }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  if (!book.value && booksStore.books.length === 0) {
    console.log(
      "Book not found in store and store is empty, fetching books..."
    );
    await booksStore.fetchBooks();
  } else if (!book.value) {
    console.warn(`Book with ID ${props.id} not found in the store.`);
  }
});
</script>

<style scoped>
/* Using inline style for pre-wrap as it's less common */
/* Other styles rely on Bootstrap classes */
</style>
