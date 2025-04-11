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
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
          disabled
        >
          Delete (Soon)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
// import { useRoute } from 'vue-router'; // Not needed if using props: true
import { useBooksStore } from "../../stores/books";
import { storeToRefs } from "pinia"; // Import storeToRefs

// Define props to receive the 'id' from the router
const props = defineProps({
  id: {
    type: String, // The route param is always a string
    required: true,
  },
});

// Get the books store instance
const booksStore = useBooksStore();

// Use storeToRefs to get reactive access to isLoading state
const { isLoading } = storeToRefs(booksStore);

// Find the book using the ID prop and the store's getter
// Use a computed property so it automatically updates if the store changes
const book = computed(() => {
  return booksStore.getBookById(props.id);
});

// Computed property to format the dateAdded
const formattedDateAdded = computed(() => {
  if (book.value?.dateAdded) {
    // Ensure dateAdded is a Date object before formatting
    const date =
      book.value.dateAdded instanceof Date
        ? book.value.dateAdded
        : new Date(book.value.dateAdded); // Attempt conversion if it's not
    // Check if date is valid after potential conversion
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString(undefined, {
      // Use locale default format
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "N/A";
});

// Optional: Handle case where user navigates directly to this page
// If the book isn't found AND the main list hasn't been loaded, fetch it.
onMounted(async () => {
  // Check if the computed book is undefined AND the main books array is empty
  if (!book.value && booksStore.books.length === 0) {
    console.log(
      "Book not found in store and store is empty, fetching books..."
    );
    await booksStore.fetchBooks();
    // Note: The computed 'book' property will update automatically if the fetch succeeds
    // and the book with props.id is found in the newly fetched list.
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
