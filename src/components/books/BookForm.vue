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
        Add to list: *
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

    <div class="pt-2">
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        :disabled="!title || !author"
      >
        Save Book
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

// Define refs for two-way data binding with form inputs
const title = ref("");
const author = ref("");
const genre = ref("");
const yearPublished = ref(null); // Use null for optional numbers to avoid default 0
const rating = ref(null); // Use null for optional numbers
const notes = ref("");
const listType = ref("owned"); // Default selection for radio button

// Define the custom event emitted by this component
const emit = defineEmits(["submit-book"]);

// Function called when the form is submitted
const submitForm = () => {
  // Simple client-side validation (can be enhanced)
  if (!title.value || !author.value) {
    // Consider a more user-friendly validation message display
    alert("Please fill in the required fields: Title and Author.");
    return;
  }
  // Additional validation (e.g., rating range) can be added here

  // Construct the data object to be emitted
  // Only include optional fields if they have a value entered by the user
  const bookData = {
    title: title.value,
    author: author.value,
    listType: listType.value, // listType is required
    // Use spread syntax for conditional properties
    ...(genre.value && { genre: genre.value }),
    ...(yearPublished.value !== null && { yearPublished: yearPublished.value }),
    ...(rating.value !== null && { rating: rating.value }),
    ...(notes.value && { notes: notes.value }),
  };

  // Emit the 'submit-book' event with the collected data
  console.log("BookForm emitting submit-book with:", bookData);
  emit("submit-book", bookData);

  // Note: Clearing the form here might be undesirable if the parent
  // component handles navigation *after* submission.
  // Let the parent component decide what happens after the event.
};
</script>
