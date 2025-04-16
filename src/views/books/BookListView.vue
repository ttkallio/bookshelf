<template>
  <div class="book-list-view p-4">
    <h1 class="h2 mb-4">My Books</h1>
    <div class="mb-4">
      <router-link to="/books/add" class="btn btn-primary">
        + Add New Book
      </router-link>
    </div>

    <div
      v-if="filterCriteria"
      class="filter-controls bg-light p-3 rounded mb-4 border"
    >
      <h3 class="h5 mb-3">Filter Books</h3>
      <div class="row g-3">
        <div class="col-sm-4">
          <label for="filterListType" class="form-label">List Type</label>
          <select
            id="filterListType"
            v-model="filterCriteria.listType"
            @change="applyFilters"
            class="form-select form-select-sm"
          >
            <option value="all">All</option>
            <option value="owned">Owned Collection</option>
            <option value="want">Want to Read</option>
          </select>
        </div>

        <div class="col-sm-4">
          <label for="filterGenre" class="form-label">Genre Contains</label>
          <input
            type="text"
            id="filterGenre"
            v-model.lazy="filterCriteria.genre"
            @change="applyFilters"
            class="form-control form-control-sm"
            placeholder="e.g., Fiction"
          />
        </div>

        <div class="col-sm-4">
          <label for="filterAuthor" class="form-label">Author Contains</label>
          <input
            type="text"
            id="filterAuthor"
            v-model.lazy="filterCriteria.author"
            @change="applyFilters"
            class="form-control form-control-sm"
            placeholder="e.g., Tolkien"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="filter-controls bg-light p-3 rounded mb-4 border text-muted"
    >
      Loading filters...
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <ul v-if="filteredBooks.length > 0" class="list-group">
        <li
          v-for="book in filteredBooks"
          :key="book.id"
          class="list-group-item"
        >
          <router-link
            :to="{ name: 'BookDetail', params: { id: book.id } }"
            class="text-decoration-none"
          >
            <h2 class="h5 mb-1 text-primary">{{ book.title }}</h2>
            <p class="mb-1 text-muted small">by {{ book.author }}</p>
            <div class="text-muted small">
              <span v-if="book.genre">Genre: {{ book.genre }} | </span>
              <span
                >Status:
                <span class="text-capitalize fw-medium">{{
                  book.listType === "want" ? "Want to Read" : "Owned"
                }}</span></span
              >
            </div>
          </router-link>
        </li>
      </ul>
      <p v-else class="text-muted text-center py-5">
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

// Setup
const booksStore = useBooksStore();
const { books, isLoading, filterCriteria, filteredBooks } =
  storeToRefs(booksStore);
const { fetchBooks, setFilters } = booksStore;

// Fetch Data
onMounted(async () => {
  if (books.value.length === 0) {
    await fetchBooks();
  }
});

// Filtering
const applyFilters = () => {
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
.list-group-item > a h2 {
  color: var(--bs-primary);
}
.list-group-item > a:hover h2 {
  color: var(--bs-link-hover-color);
}
</style>
