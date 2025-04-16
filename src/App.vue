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

<script setup></script>

<style scoped></style>
