<template>
  <form @submit.prevent="submitForm" class="space-y-4 max-w-lg">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700"
        >Title *</label
      >
      <input
        type="text"
        id="title"
        v-model.trim="title"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="e.g., The Great Gatsby"
      />
    </div>

    <div>
      <label for="author" class="block text-sm font-medium text-gray-700"
        >Author *</label
      >
      <input
        type="text"
        id="author"
        v-model.trim="author"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="e.g., F. Scott Fitzgerald"
      />
    </div>

    <div>
      <label for="genre" class="block text-sm font-medium text-gray-700"
        >Genre</label
      >
      <input
        type="text"
        id="genre"
        v-model.trim="genre"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="e.g., Classic, Science Fiction"
      />
    </div>

    <div>
      <label for="yearPublished" class="block text-sm font-medium text-gray-700"
        >Year Published</label
      >
      <input
        type="number"
        id="yearPublished"
        v-model.number="yearPublished"
        min="0"
        step="1"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="e.g., 1925"
      />
    </div>

    <div>
      <label for="rating" class="block text-sm font-medium text-gray-700"
        >Rating (1-5)</label
      >
      <input
        type="number"
        id="rating"
        v-model.number="rating"
        min="1"
        max="5"
        step="1"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Enter a number between 1 and 5"
      />
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700"
        >Notes</label
      >
      <textarea
        id="notes"
        v-model.trim="notes"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Add any personal notes about the book..."
      ></textarea>
    </div>

    <fieldset>
      <legend class="block text-sm font-medium text-gray-700">
        List Type *
      </legend>
      <div
        class="mt-2 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"
      >
        <div class="flex items-center">
          <input
            id="listTypeOwned"
            name="listType"
            type="radio"
            value="owned"
            v-model="listType"
            required
            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="listTypeOwned" class="ml-3 block text-sm text-gray-900"
            >Owned Collection</label
          >
        </div>
        <div class="flex items-center">
          <input
            id="listTypeWant"
            name="listType"
            type="radio"
            value="want"
            v-model="listType"
            required
            class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="listTypeWant" class="ml-3 block text-sm text-gray-900"
            >Want to Read</label
          >
        </div>
      </div>
    </fieldset>

    <div class="pt-2 space-x-4">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        :disabled="!title || !author"
      >
        {{ isEditMode ? "Update Book" : "Save Book" }}
      </button>
      <router-link
        :to="cancelRoute"
        class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cancel
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";

// --- Props ---
// Define props to accept initial data for editing mode
const props = defineProps({
  initialData: {
    type: Object,
    default: null, // Default to null when adding a new book (not in edit mode)
  },
});

// --- Emits ---
// Define the custom event emitted by this component on successful submission
const emit = defineEmits(["submit-book"]);

// --- Refs for Form Fields ---
// Initialize refs for two-way data binding with form inputs
const title = ref("");
const author = ref("");
const genre = ref("");
const yearPublished = ref(null); // Use null for optional numbers to avoid default 0
const rating = ref(null); // Use null for optional numbers
const notes = ref("");
const listType = ref("owned"); // Default selection for new books

// --- Computed Property for Mode ---
// Determine if the form is in "edit" mode based on the presence of initialData prop
const isEditMode = computed(() => !!props.initialData);

// --- Computed Property for Cancel Route ---
// Determine where the cancel button should navigate based on the mode
const cancelRoute = computed(() => {
  // If editing (initialData exists and has an id), cancel goes back to the detail page
  if (isEditMode.value && props.initialData?.id) {
    return { name: "BookDetail", params: { id: props.initialData.id } };
  }
  // If adding (no initialData), cancel goes back to the main book list
  return { name: "BookList" };
});

// --- Watcher to Populate Form ---
// Use watchEffect to reactively update local form refs when the initialData prop changes.
// This automatically runs once initially and whenever props.initialData changes.
watchEffect(() => {
  if (props.initialData) {
    // If initialData is provided (edit mode), populate the form fields
    console.log(
      "BookForm: Populating form with initialData:",
      props.initialData
    );
    title.value = props.initialData.title || "";
    author.value = props.initialData.author || "";
    genre.value = props.initialData.genre || "";
    // Handle potential undefined or null values for numbers
    yearPublished.value = props.initialData.yearPublished ?? null;
    rating.value = props.initialData.rating ?? null;
    notes.value = props.initialData.notes || "";
    listType.value = props.initialData.listType || "owned"; // Default if missing
  }
  // Removed the 'else' block here as it was empty and causing an ESLint error
});

// --- Form Submission Handler ---
const submitForm = () => {
  // Simple client-side validation (can be enhanced with libraries like Vuelidate)
  if (!title.value || !author.value) {
    // Consider a more user-friendly validation message display (e.g., inline errors)
    alert("Please fill in the required fields: Title and Author.");
    return;
  }
  // Add more validation if needed (e.g., check rating range)
  if (rating.value !== null && (rating.value < 1 || rating.value > 5)) {
    alert("Rating must be between 1 and 5.");
    return;
  }

  // Construct the data object to be emitted
  // Excludes fields like 'id' and 'dateAdded' which are managed elsewhere
  const bookData = {
    title: title.value,
    author: author.value,
    listType: listType.value, // listType is required
    // Only include optional fields in the emitted object if they have a meaningful value
    ...(genre.value && { genre: genre.value }),
    ...(yearPublished.value !== null &&
      !isNaN(yearPublished.value) && {
        yearPublished: Number(yearPublished.value),
      }), // Ensure it's a number
    ...(rating.value !== null &&
      !isNaN(rating.value) && { rating: Number(rating.value) }), // Ensure it's a number
    ...(notes.value && { notes: notes.value }),
  };

  // Emit the 'submit-book' event, passing the collected form data
  console.log("BookForm emitting submit-book with:", bookData);
  emit("submit-book", bookData);
};
</script>
