// src/stores/books.js

import { defineStore } from "pinia";

// Define the base URL for your API endpoint
// Make sure this matches the port your backend server is running on
const API_BASE_URL = "http://localhost:3001/api"; // Adjust port if needed

// --- Mock ID Generation (Still needed for mock ADD action below) ---
const generateMockId = () =>
  `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// Removed the unused mockBooks array declaration

export const useBooksStore = defineStore("books", {
  /**
   * State: Stores the data for this module.
   * @returns {object} Initial state
   */
  state: () => ({
    /** @type {Array<object>} Array to hold all book objects */
    books: [], // Start empty, will be filled by fetchBooks
    /** @type {boolean} Flag to indicate loading operations */
    isLoading: false,
    /** @type {{listType: string, genre: string, author: string}} Filter criteria */
    filterCriteria: {
      listType: "all",
      genre: "",
      author: "",
    },
  }),

  /**
   * Getters: Computed properties derived from state.
   */
  getters: {
    allBooks: (state) => state.books, // Returns the current list (fetched or mock)

    filteredBooks(state) {
      return state.books.filter((book) => {
        const listTypeMatch =
          state.filterCriteria.listType === "all" ||
          book.listType === state.filterCriteria.listType;
        const genreMatch =
          !state.filterCriteria.genre ||
          book.genre
            ?.toLowerCase()
            .includes(state.filterCriteria.genre.toLowerCase());
        const authorMatch =
          !state.filterCriteria.author ||
          book.author
            .toLowerCase()
            .includes(state.filterCriteria.author.toLowerCase());
        return listTypeMatch && genreMatch && authorMatch;
      });
    },

    ownedBooks: (state) =>
      state.books.filter((book) => book.listType === "owned"),
    wantToReadBooks: (state) =>
      state.books.filter((book) => book.listType === "want"),
    getBookById: (state) => {
      return (id) => state.books.find((book) => book.id === id);
    },
  },

  /**
   * Actions: Methods that can contain asynchronous operations and mutate the state.
   */
  actions: {
    /**
     * Fetches the list of books from the back-end API.
     * Replaces the mock data implementation.
     * @returns {Promise<void>}
     */
    async fetchBooks() {
      console.log("Fetching books from API...");
      this.isLoading = true; // Set loading state
      try {
        const response = await fetch(`${API_BASE_URL}/books`); // Call the GET endpoint

        if (!response.ok) {
          // Handle HTTP errors (e.g., 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response body
        // Ensure dateAdded is converted to Date objects if needed
        this.books = data.map((book) => ({
          ...book,
          // Assuming dateAdded comes as a string from the API
          dateAdded: book.dateAdded ? new Date(book.dateAdded) : new Date(),
        }));
        console.log(`API books fetched successfully: ${this.books.length}`);
      } catch (error) {
        console.error("Error fetching books from API:", error);
        // Optionally: Set an error state, show a notification to the user
        this.books = []; // Clear books on error maybe? Or leave stale data?
      } finally {
        // Ensure loading state is turned off regardless of success/failure
        this.isLoading = false;
      }
    },

    /**
     * Adds a new book to the list.
     * NOTE: Still uses MOCK implementation. Will be updated later.
     * @param {object} newBookData - Object containing data for the new book
     * @returns {Promise<object>} Promise resolving with the newly added Book object
     */
    async addBook(newBookData) {
      console.warn("addBook action using MOCK implementation!"); // Log warning
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          const bookToAdd = {
            ...newBookData,
            id: generateMockId(), // Still uses mock ID generator
            dateAdded: new Date(),
          };
          this.books = [...this.books, bookToAdd];
          this.isLoading = false;
          console.log("Mock book added:", bookToAdd.id);
          resolve(bookToAdd);
        }, 300);
      });
    },

    /**
     * Updates an existing book in the list.
     * NOTE: Still uses MOCK implementation. Will be updated later.
     * @param {object} updatedBookData - The complete Book object with updated data
     * @returns {Promise<boolean>} Promise resolving with true if successful
     */
    async updateBook(updatedBookData) {
      console.warn("updateBook action using MOCK implementation!"); // Log warning
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = this.books.findIndex(
            (book) => book.id === updatedBookData.id
          );
          if (index !== -1) {
            this.books = this.books.map((book) =>
              book.id === updatedBookData.id ? { ...updatedBookData } : book
            );
            this.isLoading = false;
            console.log("Mock book updated successfully.");
            resolve(true);
          } else {
            this.isLoading = false;
            console.error(
              "Mock book not found for update:",
              updatedBookData.id
            );
            resolve(false);
          }
        }, 300);
      });
    },

    /**
     * Deletes a book from the list by its ID.
     * NOTE: Still uses MOCK implementation. Will be updated later.
     * @param {string} bookId - The unique ID of the book to delete
     * @returns {Promise<boolean>} Promise resolving with true if successful
     */
    async deleteBook(bookId) {
      console.warn("deleteBook action using MOCK implementation!"); // Log warning
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          const initialLength = this.books.length;
          this.books = this.books.filter((book) => book.id !== bookId);
          const success = this.books.length < initialLength;
          this.isLoading = false;
          if (success) {
            console.log("Mock book deleted successfully.");
          } else {
            console.error("Mock book not found for deletion:", bookId);
          }
          resolve(success);
        }, 300);
      });
    },

    /**
     * Updates the filter criteria state.
     * @param {object} criteria - An object with partial or full filter criteria
     */
    setFilters(criteria) {
      this.filterCriteria = { ...this.filterCriteria, ...criteria };
      console.log("Filters updated:", this.filterCriteria);
    },
  },
});
