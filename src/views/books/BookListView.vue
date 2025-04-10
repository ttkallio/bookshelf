<template>
  <div class="book-list-view p-4">
    <h1 class="text-2xl font-bold mb-4">My Books</h1>
    <div v-if="isLoading" class="text-gray-500">Loading books...</div>

    <div v-else>
      <ul v-if="books.length > 0" class="space-y-2">
        <li
          v-for="book in books"
          :key="book.id"
          class="p-3 border rounded shadow-sm bg-white"
        >
          <h2 class="text-lg font-semibold">{{ book.title }}</h2>
          <p class="text-sm text-gray-600">by {{ book.author }}</p>
        </li>
      </ul>
      <p v-else class="text-gray-500">No books found in your collection yet.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
// Assuming your store file is now named books.js or similar
// Adjust the path if necessary
import { useBooksStore } from "../../stores/books";

// 1. Get the books store instance
const booksStore = useBooksStore();

// 2. Use storeToRefs to get reactive refs for state and getters
// This ensures that when the store state changes, the component updates.
const { books, isLoading } = storeToRefs(booksStore); // Use 'books' state directly

// 3. Get actions from the store (actions are just methods, no need for storeToRefs)
const { fetchBooks } = booksStore;

// 4. Call fetchBooks when the component is mounted
onMounted(async () => {
  // Check if books haven't been loaded yet to avoid redundant fetches
  // Note: Simple check, might need refinement depending on fetch logic
  if (books.value.length === 0) {
    // Using await here ensures the loading state is more accurate if
    // fetchBooks returns a promise (which it does in the mock example)
    await fetchBooks();
  }
});
</script>

<style scoped>
/* Add component-specific styles here if needed */
/* Basic Tailwind classes are used inline in the template for this example */
</style>
