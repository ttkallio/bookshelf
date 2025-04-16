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
import { useBooksStore } from "../../stores/books";
import BookForm from "../../components/books/BookForm.vue";

const booksStore = useBooksStore();
const router = useRouter();

const handleAddNewBook = async (bookData) => {
  console.log("AddBookView received submit-book event with:", bookData);
  try {
    // addBook action
    await booksStore.addBook(bookData);
    console.log("Book added successfully, navigating back to list.");
    router.push("/books");
  } catch (error) {
    // Handle potential errors
    console.error("Error adding book:", error);
    alert(
      "Failed to add book. Please check the console for details and try again."
    );
  }
};
</script>
