<template>
  <form @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="title" class="form-label">Title *</label>
      <input
        type="text"
        id="title"
        v-model.trim="title"
        required
        class="form-control"
        placeholder="e.g., The Great Gatsby"
      />
    </div>

    <div class="mb-3">
      <label for="author" class="form-label">Author *</label>
      <input
        type="text"
        id="author"
        v-model.trim="author"
        required
        class="form-control"
        placeholder="e.g., F. Scott Fitzgerald"
      />
    </div>

    <div class="mb-3">
      <label for="genre" class="form-label">Genre</label>
      <input
        type="text"
        id="genre"
        v-model.trim="genre"
        class="form-control"
        placeholder="e.g., Classic, Science Fiction"
      />
    </div>

    <div class="mb-3">
      <label for="yearPublished" class="form-label">Year Published</label>
      <input
        type="number"
        id="yearPublished"
        v-model.number="yearPublished"
        min="0"
        step="1"
        class="form-control"
        placeholder="e.g., 1925"
      />
    </div>

    <div class="mb-3">
      <label for="rating" class="form-label">Rating (1-5)</label>
      <input
        type="number"
        id="rating"
        v-model.number="rating"
        min="1"
        max="5"
        step="1"
        class="form-control"
        placeholder="Enter a number between 1 and 5"
      />
    </div>

    <div class="mb-3">
      <label for="notes" class="form-label">Notes</label>
      <textarea
        id="notes"
        v-model.trim="notes"
        rows="3"
        class="form-control"
        placeholder="Add any personal notes about the book..."
      ></textarea>
    </div>

    <div class="mb-3">
      <label class="form-label d-block">List Type *</label>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="listType"
          id="listTypeOwned"
          value="owned"
          v-model="listType"
          required
        />
        <label class="form-check-label" for="listTypeOwned"
          >Owned Collection</label
        >
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="listType"
          id="listTypeWant"
          value="want"
          v-model="listType"
          required
        />
        <label class="form-check-label" for="listTypeWant">Want to Read</label>
      </div>
    </div>

    <div class="pt-2">
      <button
        type="submit"
        class="btn btn-primary me-2"
        :disabled="!title || !author"
      >
        {{ isEditMode ? "Update Book" : "Save Book" }}
      </button>
      <router-link :to="cancelRoute" class="btn btn-secondary">
        Cancel
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit-book"]);

// Form Fields
const title = ref("");
const author = ref("");
const genre = ref("");
const yearPublished = ref(null);
const rating = ref(null);
const notes = ref("");
const listType = ref("owned");

const isEditMode = computed(() => !!props.initialData);

const cancelRoute = computed(() => {
  if (isEditMode.value && props.initialData?.id) {
    return { name: "BookDetail", params: { id: props.initialData.id } };
  }
  return { name: "BookList" };
});

watchEffect(() => {
  if (props.initialData) {
    console.log(
      "BookForm: Populating form with initialData:",
      props.initialData
    );
    title.value = props.initialData.title || "";
    author.value = props.initialData.author || "";
    genre.value = props.initialData.genre || "";
    yearPublished.value = props.initialData.yearPublished ?? null;
    rating.value = props.initialData.rating ?? null;
    notes.value = props.initialData.notes || "";
    listType.value = props.initialData.listType || "owned";
  }
});

// Submission Handler
const submitForm = () => {
  if (!title.value || !author.value) {
    alert("Please fill in the required fields: Title and Author.");
    return;
  }
  if (rating.value !== null && (rating.value < 1 || rating.value > 5)) {
    alert("Rating must be between 1 and 5.");
    return;
  }

  const bookData = {
    title: title.value,
    author: author.value,
    listType: listType.value,
    ...(genre.value && { genre: genre.value }),
    ...(yearPublished.value !== null &&
      !isNaN(yearPublished.value) && {
        yearPublished: Number(yearPublished.value),
      }),
    ...(rating.value !== null &&
      !isNaN(rating.value) && { rating: Number(rating.value) }),
    ...(notes.value && { notes: notes.value }),
  };

  console.log("BookForm emitting submit-book with:", bookData);
  emit("submit-book", bookData);
};
</script>
