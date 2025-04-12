<template>
  <div class="book-detail-view p-4 max-w-3xl mx-auto">
    <div class="mb-4">
      <router-link to="/books" class="text-indigo-600 hover:text-indigo-800">
        &larr; Back to List
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center text-gray-500">
      Loading book details...
    </div>
    <div v-else-if="!book" class="text-center text-red-500">
      Book not found.
    </div>

    <div v-else class="bg-white p-6 rounded shadow-md space-y-3">
      <h1 class="text-3xl font-bold mb-2">{{ book.title }}</h1>
      <p class="text-lg text-gray-700">
        by <span class="font-medium">{{ book.author }}</span>
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <p v-if="book.genre"><strong>Genre:</strong> {{ book.genre }}</p>
        <p v-if="book.yearPublished">
          <strong>Year Published:</strong> {{ book.yearPublished }}
        </p>
        <p v-if="book.rating"><strong>Rating:</strong> {{ book.rating }} / 5</p>
        <p>
          <strong>Status:</strong>
          <span
            class="capitalize font-medium"
            :class="
              book.listType === 'owned' ? 'text-green-700' : 'text-blue-700'
            "
            >{{ book.listType === "want" ? "Want to Read" : "Owned" }}</span
          >
        </p>
        <p><strong>Date Added:</strong> {{ formattedDateAdded }}</p>
      </div>

      <div v-if="book.notes" class="pt-2">
        <h3 class="font-semibold text-gray-800">Notes:</h3>
        <p class="mt-1 text-gray-600 whitespace-pre-wrap">{{ book.notes }}</p>
      </div>

      <div class="pt-4 border-t mt-4">
        <router-link
          v-if="book"
          :to="{ name: 'EditBook', params: { id: book.id } }"
          class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm mr-2"
        >
          Edit
        </router-link>
        <button
          v-if="book"
          @click="confirmAndDeleteBook"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router"; // <-- Import useRouter
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
const router = useRouter(); // <-- Get router instance
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
const { deleteBook } = booksStore; // <-- Get deleteBook action

// --- Methods ---
const confirmAndDeleteBook = async () => {
  // Check if book data is available
  if (!book.value) {
    console.error("Cannot delete: book data not available.");
    return;
  }

  // Confirm with the user
  const isConfirmed = window.confirm(
    `Are you sure you want to delete "${book.value.title}"? This action cannot be undone.`
  );

  if (isConfirmed) {
    console.log(`User confirmed deletion for book ID: ${props.id}`);
    try {
      // Call the store action to delete the book
      const success = await deleteBook(props.id); // Pass the ID from props

      if (success) {
        console.log("Book deleted successfully, navigating back to list.");
        // Navigate back to the book list page
        router.push("/books");
        // Optional: Show success notification
      } else {
        // Handle case where deletion might fail (e.g., book already deleted)
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
/* Add component-specific styles here if needed */
.whitespace-pre-wrap {
  white-space: pre-wrap; /* Ensures notes respect newlines and spaces */
}
</style>
