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

    <div
      v-if="filterCriteria"
      class="filter-controls bg-gray-100 p-4 rounded-md mb-6 shadow"
    >
      <h3 class="text-lg font-semibold mb-3">Filter Books</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            for="filterListType"
            class="block text-sm font-medium text-gray-700"
            >List Type</label
          >
          <select
            id="filterListType"
            v-model="filterCriteria.listType"
            @change="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="owned">Owned Collection</option>
            <option value="want">Want to Read</option>
          </select>
        </div>

        <div>
          <label
            for="filterGenre"
            class="block text-sm font-medium text-gray-700"
            >Genre Contains</label
          >
          <input
            type="text"
            id="filterGenre"
            v-model.lazy="filterCriteria.genre"
            @change="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Fiction"
          />
        </div>

        <div>
          <label
            for="filterAuthor"
            class="block text-sm font-medium text-gray-700"
            >Author Contains</label
          >
          <input
            type="text"
            id="filterAuthor"
            v-model.lazy="filterCriteria.author"
            @change="applyFilters"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Tolkien"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="filter-controls bg-gray-100 p-4 rounded-md mb-6 shadow text-gray-400"
    >
      Loading filters...
    </div>

    <div v-if="isLoading" class="text-gray-500 text-center py-6">
      Loading books...
    </div>

    <div v-else>
      <ul v-if="filteredBooks.length > 0" class="space-y-2">
        <li
          v-for="book in filteredBooks"
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
            <div class="text-xs text-gray-500 mt-1">
              <span v-if="book.genre">Genre: {{ book.genre }} | </span>
              <span
                >Status:
                <span class="capitalize">{{
                  book.listType === "want" ? "Want to Read" : "Owned"
                }}</span></span
              >
            </div>
          </router-link>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-center py-6">
        No books found matching your current filters.
        <span v-if="books.length > 0">Try adjusting the filters above.</span>
        <span v-else>Add one using the button above!</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBooksStore } from "../../stores/books";
// Debounce is no longer needed for v-model.lazy approach
// import debounce from "lodash.debounce";

// --- Store Setup ---
const booksStore = useBooksStore();
// Get reactive refs for state and getters needed in the template
const { books, isLoading, filterCriteria, filteredBooks } =
  storeToRefs(booksStore);
// Get the action to update filters
const { fetchBooks, setFilters } = booksStore;

// --- Fetch Initial Data ---
onMounted(async () => {
  // Fetch books only if the main books array is empty
  if (books.value.length === 0) {
    await fetchBooks();
  }
});

// --- Filter Logic ---
// Function to explicitly apply filters (e.g., after select change or lazy input change)
const applyFilters = () => {
  // Ensure filterCriteria exists before trying to access its properties
  if (filterCriteria.value) {
    setFilters({
      listType: filterCriteria.value.listType,
      genre: filterCriteria.value.genre,
      author: filterCriteria.value.author,
    });
  } else {
    console.warn(
      "Attempted to apply filters, but filterCriteria is not ready."
    );
  }
};
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>
