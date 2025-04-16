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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBooksStore } from "../../stores/books";
import BookForm from "../../components/books/BookForm.vue";
import { storeToRefs } from "pinia";

// Get the book ID
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const booksStore = useBooksStore();

const { isLoading } = storeToRefs(booksStore);
const bookToEdit = ref(null);
const isFetching = ref(false);

// Fetch Book Data
onMounted(async () => {
  isFetching.value = true;
  console.log(`EditBookView: Mounting for ID: ${props.id}`);

  let book = booksStore.getBookById(props.id);

  if (!book && booksStore.books.length === 0) {
    console.log("Book not in store and store empty, fetching all books...");
    try {
      await booksStore.fetchBooks();
      book = booksStore.getBookById(props.id);
    } catch (error) {
      console.error("Error fetching books in EditBookView:", error);
    }
  }

  if (book) {
    bookToEdit.value = { ...book };
    console.log("Book found for editing:", bookToEdit.value);
  } else {
    console.warn(`Book with ID ${props.id} not found after potential fetch.`);
  }
  isFetching.value = false;
});

// Event Handler
const handleUpdateBook = async (formData) => {
  if (!props.id) {
    console.error("Cannot update book, ID is missing.");
    alert("An error occurred: Book ID is missing.");
    return;
  }
  if (!bookToEdit.value) {
    console.error("Cannot update book, original book data not loaded.");
    alert("An error occurred: Original book data not available.");
    return;
  }

  console.log(
    `EditBookView received submit-book event for ID ${props.id} with:`,
    formData
  );

  const bookDataToUpdate = {
    id: props.id,
    ...formData,
    dateAdded: bookToEdit.value.dateAdded,
  };

  try {
    const success = await booksStore.updateBook(bookDataToUpdate);

    if (success) {
      console.log("Book updated successfully, navigating back to detail view.");
      router.push({ name: "BookDetail", params: { id: props.id } });
    } else {
      console.error("Store action updateBook reported failure.");
      alert("Failed to update book. Please try again.");
    }
  } catch (error) {
    console.error("Error updating book:", error);
    alert("An error occurred while updating the book. Please try again.");
  }
};
</script>

<style scoped></style>
