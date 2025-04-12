<template>
  <div class="edit-book-view container py-4">
    <h2 v-if="bookToEdit" class="h3 mb-4 text-center">
      Edit Book: <span class="fst-italic">{{ bookToEdit.title }}</span>
    </h2>
    <h2 v-else class="h3 mb-4 text-center">Edit Book</h2>

    <div v-if="isLoading || isFetching" class="text-center text-muted my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading book data...</p>
    </div>

    <div v-else-if="!bookToEdit" class="text-center text-danger my-5">
      <p class="fw-bold">Book with ID "{{ props.id }}" not found.</p>
      <router-link to="/books" class="btn btn-sm btn-outline-secondary mt-2">
        &larr; Back to List
      </router-link>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <book-form :initial-data="bookToEdit" @submit-book="handleUpdateBook" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Removed 'computed' as it was not used in this component
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBooksStore } from "../../stores/books"; // Adjust path if needed
import BookForm from "../../components/books/BookForm.vue"; // Adjust path if needed
import { storeToRefs } from "pinia";

// --- Props ---
// Get the book ID from the route params (passed via props: true in router)
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
// Use storeToRefs for reactive access to global loading state from the store
const { isLoading } = storeToRefs(booksStore);
// Local ref to hold the specific book data fetched for editing
const bookToEdit = ref(null);
// Local loading state specifically for the initial fetch in this view
const isFetching = ref(false);

// --- Fetch Book Data ---
// Fetch the specific book data when the component mounts
onMounted(async () => {
  isFetching.value = true; // Indicate local fetching started
  console.log(`EditBookView: Mounting for ID: ${props.id}`);

  // Attempt to get the book directly from the store's state/getter first
  let book = booksStore.getBookById(props.id);

  // If not found in store AND the main books array hasn't been loaded yet, fetch all books
  // This handles cases where the user navigates directly to the edit page URL
  if (!book && booksStore.books.length === 0) {
    console.log("Book not in store and store empty, fetching all books...");
    try {
      // Use the store action to fetch (mock) data
      await booksStore.fetchBooks();
      // Try getting the book again from the now populated store
      book = booksStore.getBookById(props.id);
    } catch (error) {
      console.error("Error fetching books in EditBookView:", error);
      // Optionally set an error state to display to the user
    }
  }

  if (book) {
    // Assign the found book data to the local ref
    // Use a shallow copy ({...book}) to avoid potential direct mutation issues if needed,
    // although passing as prop is generally safe with Vue 3 reactivity.
    bookToEdit.value = { ...book };
    console.log("Book found for editing:", bookToEdit.value);
  } else {
    console.warn(`Book with ID ${props.id} not found after potential fetch.`);
    // bookToEdit remains null, the template will show the "Not Found" message
  }
  isFetching.value = false; // Indicate local fetching finished
});

// --- Event Handler ---
/**
 * Handles the 'submit-book' event from BookForm.
 * Calls the store's updateBook action and navigates on success.
 * @param {object} formData - The updated book data (without id/dateAdded) from the form.
 */
const handleUpdateBook = async (formData) => {
  // Ensure we have the book ID from props
  if (!props.id) {
    console.error("Cannot update book, ID is missing.");
    alert("An error occurred: Book ID is missing.");
    return;
  }
  // Ensure we actually loaded the book to preserve fields like dateAdded
  if (!bookToEdit.value) {
    console.error("Cannot update book, original book data not loaded.");
    alert("An error occurred: Original book data not available.");
    return;
  }

  console.log(
    `EditBookView received submit-book event for ID ${props.id} with:`,
    formData
  );

  // Construct the full book object including the ID and preserving original dateAdded
  const bookDataToUpdate = {
    id: props.id, // Add the original ID back
    ...formData, // Spread the updated form data
    dateAdded: bookToEdit.value.dateAdded, // Preserve the original dateAdded
  };

  try {
    // Call the updateBook action from the Pinia store
    const success = await booksStore.updateBook(bookDataToUpdate);

    if (success) {
      console.log("Book updated successfully, navigating back to detail view.");
      // Navigate back to the detail view for the updated book upon success
      router.push({ name: "BookDetail", params: { id: props.id } });
      // Optional: Display a success notification
    } else {
      // Handle case where update might fail (e.g., book not found in store action)
      console.error("Store action updateBook reported failure.");
      alert("Failed to update book. Please try again.");
    }
  } catch (error) {
    console.error("Error updating book:", error);
    // Handle potential errors during the updateBook process
    alert("An error occurred while updating the book. Please try again.");
  }
};
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>
