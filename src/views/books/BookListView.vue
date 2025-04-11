<template>
  <div class="book-list-view p-4">
    <h1 class="text-2xl font-bold mb-4">My Books</h1>
    <div class="mb-4">
      <router-link
        to="/books/add"
        class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-sm"
      >
        + Add New Book
      </router-link>
    </div>

    <div v-if="isLoading" class="text-gray-500">Loading books...</div>

    <div v-else>
      <ul v-if="books.length > 0" class="space-y-2">
        <li
          v-for="book in books"
          :key="book.id"
          class="border rounded shadow-sm bg-white overflow-hidden"
        >
          <router-link
            :to="{ name: 'BookDetail', params: { id: book.id } }"
            class="block p-3 hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <h2
              class="text-lg font-semibold text-indigo-700 hover:text-indigo-900"
            >
              {{ book.title }}
            </h2>
            <p class="text-sm text-gray-600">by {{ book.author }}</p>
          </router-link>
        </li>
      </ul>
      <p v-else class="text-gray-500">
        No books found in your collection yet. Add one using the button above!
      </p>
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
const { books, isLoading } = storeToRefs(booksStore);

// 3. Get actions from the store
const { fetchBooks } = booksStore;

// 4. Call fetchBooks when the component is mounted
onMounted(async () => {
  // Avoid fetching if books are already loaded
  if (books.value.length === 0) {
    await fetchBooks();
  }
});
</script>

<style scoped>
/* Add component-specific styles here if needed */
/* Basic Tailwind classes are used inline in the template */
</style>
