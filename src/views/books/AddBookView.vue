<template>
  <div class="add-book-view container py-4">
    <h2 class="h3 mb-4 text-center">Add a New Book</h2>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <book-form @submit-book="handleAddNewBook" />
      </div>
    </div>
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
    await booksStore.addBook(bookData);
    // If the addBook action completes without errors, navigate back to the list
    console.log("Book added successfully, navigating back to list.");
    router.push("/books");
  } catch (error) {
    // Handle potential errors during the addBook process
    console.error("Error adding book:", error);
    alert(
      "Failed to add book. Please check the console for details and try again."
    );
  }
};
</script>
