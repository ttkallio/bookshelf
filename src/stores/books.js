// src/stores/books.js

import { defineStore } from "pinia";

// --- Mock Data ---
// Helper function to generate simple unique IDs for mock data
const generateMockId = () =>
  `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// Initial mock data array for development and testing
// Structure matches the fields used in BookListView.vue and potential future forms
const mockBooks = [
  {
    id: generateMockId(),
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    yearPublished: 1937,
    rating: 5,
    notes: "A classic adventure.",
    listType: "owned",
    dateAdded: new Date(2023, 5, 15),
  },
  {
    id: generateMockId(),
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    yearPublished: 1965,
    rating: 5,
    notes: "Epic sci-fi.",
    listType: "owned",
    dateAdded: new Date(2023, 8, 20),
  },
  {
    id: generateMockId(),
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Science Fiction",
    yearPublished: 2021,
    rating: 4,
    notes: "Enjoyed this one.",
    listType: "want",
    dateAdded: new Date(2024, 1, 10),
  },
  {
    id: generateMockId(),
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classic Romance",
    yearPublished: 1813,
    rating: 4,
    notes: "",
    listType: "owned",
    dateAdded: new Date(2023, 11, 1),
  },
  {
    id: generateMockId(),
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    yearPublished: 1949,
    rating: 5,
    notes: "Thought-provoking.",
    listType: "want",
    dateAdded: new Date(2024, 3, 5),
  },
];
// --- End Mock Data ---

// Define the books store using defineStore
// First argument is a unique ID for the store
// Second argument is the options object (state, getters, actions)
export const useBooksStore = defineStore("books", {
  /**
   * State: Stores the data for this module.
   * Must be a function that returns the initial state object.
   * @returns {object} Initial state
   */
  state: () => ({
    /** @type {Array<object>} Array to hold all book objects */
    books: [],
    /** @type {boolean} Flag to indicate loading operations */
    isLoading: false,
    // Example: Add filter criteria state later if needed for REQ-FUN-010
    // filterCriteria: { listType: 'all', genre: null, author: '', ratingMin: 0 }
  }),

  /**
   * Getters: Computed properties derived from state.
   */
  getters: {
    /**
     * Returns all books currently in the state.
     * @param {object} state The current state of the books store
     * @returns {Array<object>} All books
     */
    allBooks: (state) => state.books,

    /**
     * Returns only the books marked as 'owned'.
     * @param {object} state The current state of the books store
     * @returns {Array<object>} Owned books
     */
    ownedBooks: (state) =>
      state.books.filter((book) => book.listType === "owned"),

    /**
     * Returns only the books marked as 'want' to read.
     * @param {object} state The current state of the books store
     * @returns {Array<object>} Books on the wishlist
     */
    wantToReadBooks: (state) =>
      state.books.filter((book) => book.listType === "want"),

    /**
     * Returns a function that can find a specific book by its ID.
     * Usage: getBookById('some-id')
     * @param {object} state The current state of the books store
     * @returns {function(string): object|undefined} Function to get book by ID
     */
    getBookById: (state) => {
      return (id) => state.books.find((book) => book.id === id);
    },

    /**
     * Example getter for applying filters (implement based on filterCriteria state)
     * filteredBooks(state) {
     * let books = state.books;
     * // Apply filters based on state.filterCriteria...
     * return books;
     * }
     */
  },

  /**
   * Actions: Methods that can contain asynchronous operations and mutate the state.
   * Use `this` to access state properties (e.g., `this.books`).
   */
  actions: {
    /**
     * Fetches the initial list of books.
     * In a real app, this would make an API call. Here, it uses mock data.
     * @returns {Promise<void>}
     */
    async fetchBooks() {
      console.log("Fetching books...");
      this.isLoading = true;
      // ** Mock Implementation **
      // Replace with actual API call (e.g., using fetch or axios)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Use spread operator (...) to create a shallow copy of mockBooks
          this.books = [...mockBooks];
          this.isLoading = false;
          console.log("Mock books fetched:", this.books.length);
          resolve();
        }, 800); // Simulate network delay
      });
    },

    /**
     * Adds a new book to the list.
     * In a real app, this would send data to an API endpoint.
     * @param {object} newBookData - Object containing data for the new book (excluding id and dateAdded)
     * @returns {Promise<object>} Promise resolving with the newly added Book object (including generated id)
     */
    async addBook(newBookData) {
      console.log("Adding book:", newBookData.title);
      this.isLoading = true; // Optional: indicate loading during add
      // ** Mock Implementation **
      // Replace with actual API POST request
      return new Promise((resolve) => {
        setTimeout(() => {
          const bookToAdd = {
            ...newBookData, // Spread properties from input object
            id: generateMockId(), // Generate a unique ID for the mock book
            dateAdded: new Date(), // Set the current date/time
          };
          // Use spread syntax to add the new book immutably (good practice)
          this.books = [...this.books, bookToAdd];
          this.isLoading = false;
          console.log("Book added:", bookToAdd.id);
          resolve(bookToAdd); // Return the newly created book object
        }, 300); // Simulate network delay
      });
    },

    /**
     * Updates an existing book in the list.
     * In a real app, this would send data to an API endpoint (e.g., PUT or PATCH).
     * @param {object} updatedBookData - The complete Book object with updated data (must include the correct id)
     * @returns {Promise<boolean>} Promise resolving with true if update was successful, false otherwise
     */
    async updateBook(updatedBookData) {
      console.log("Updating book:", updatedBookData.id);
      this.isLoading = true;
      // ** Mock Implementation **
      // Replace with actual API PUT/PATCH request
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = this.books.findIndex(
            (book) => book.id === updatedBookData.id
          );
          if (index !== -1) {
            // Update the book immutably using map (good practice)
            this.books = this.books.map((book) =>
              book.id === updatedBookData.id ? { ...updatedBookData } : book
            );
            this.isLoading = false;
            console.log("Book updated successfully.");
            resolve(true);
          } else {
            this.isLoading = false;
            console.error("Book not found for update:", updatedBookData.id);
            resolve(false); // Indicate failure: book not found
          }
        }, 300); // Simulate network delay
      });
    },

    /**
     * Deletes a book from the list by its ID.
     * In a real app, this would send a request to a DELETE API endpoint.
     * @param {string} bookId - The unique ID of the book to delete
     * @returns {Promise<boolean>} Promise resolving with true if deletion was successful, false otherwise
     */
    async deleteBook(bookId) {
      console.log("Deleting book:", bookId);
      this.isLoading = true;
      // ** Mock Implementation **
      // Replace with actual API DELETE request
      return new Promise((resolve) => {
        setTimeout(() => {
          const initialLength = this.books.length;
          // Filter out the book to delete immutably (good practice)
          this.books = this.books.filter((book) => book.id !== bookId);
          const success = this.books.length < initialLength; // Check if a book was actually removed
          this.isLoading = false;
          if (success) {
            console.log("Book deleted successfully.");
          } else {
            console.error("Book not found for deletion:", bookId);
          }
          resolve(success); // Indicate success/failure
        }, 300); // Simulate network delay
      });
    },

    /**
     * Example action to update filter criteria
     * updateFilterCriteria(criteria) {
     * // Assuming filterCriteria is part of state
     * // this.filterCriteria = { ...this.filterCriteria, ...criteria };
     * }
     */
  },
});
