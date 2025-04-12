<template>
  <div id="app-layout" class="min-h-screen bg-gray-100">
    <header class="bg-indigo-700 text-white shadow-md">
      <nav class="container mx-auto px-4 py-3">
        <h1 class="text-xl font-semibold">
          <router-link to="/books" class="hover:text-indigo-200">
            My Bookshelf
          </router-link>
        </h1>
      </nav>
    </header>

    <main class="container mx-auto p-4"><router-view /></main>
  </div>
</template>

<script setup>
// No specific script logic needed for this basic layout component yet.
// Imports and logic can be added here later if the layout needs state
// (e.g., for dynamic navigation based on auth status, which is currently descoped).
</script>

<style scoped>
/* Add component-specific styles here if needed */
/* We are primarily using Tailwind utility classes in the template */
/* Example: Add global styles in src/assets/main.css if needed */

/* Ensure the layout takes up at least the full viewport height */
/* #app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
} */

/* Ensure the main content area can grow */
/* main {
  flex-grow: 1;
} */
</style>
