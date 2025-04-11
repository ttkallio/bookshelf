<template>
  <div class="add-book-view p-4 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold mb-4 text-center">Add a New Book</h2>
    <book-form @submit-book="handleAddNewBook" />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useBooksStore } from "../../stores/books"; // Adjust path if needed
import BookForm from "../../components/books/BookForm.vue"; // Adjust path if needed

// Get instances of the store and router
const booksStore = useBooksStore();
const router = useRouter();

/**
 * Handles the 'submit-book' event emitted by BookForm.vue
 * Calls the store action to add the book and navigates on success.
 * @param {object} bookData - The book data object emitted from the form.
 */
const handleAddNewBook = async (bookData) => {
  console.log("AddBookView received submit-book event with:", bookData);
  try {
    // Call the addBook action from the Pinia store
    // The action handles the mock async operation and updates the state
    await booksStore.addBook(bookData);

    // If the addBook action completes without errors, navigate back to the list
    console.log("Book added successfully, navigating back to list.");
    router.push("/books");

    // Optional: Display a success notification to the user (e.g., using a toast library)
  } catch (error) {
    // Handle potential errors during the addBook process
    console.error("Error adding book:", error);
    // Optional: Display an error message to the user
    alert(
      "Failed to add book. Please check the console for details and try again."
    );
  }
};
</script>
