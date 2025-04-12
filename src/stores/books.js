// src/stores/books.js

import { defineStore } from "pinia";

// --- Mock Data ---
const generateMockId = () =>
  `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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

export const useBooksStore = defineStore("books", {
  /**
   * State: Stores the data for this module.
   * @returns {object} Initial state
   */
  state: () => ({
    /** @type {Array<object>} Array to hold all book objects */
    books: [],
    /** @type {boolean} Flag to indicate loading operations */
    isLoading: false,
    /** @type {{listType: string, genre: string, author: string}} Filter criteria */
    filterCriteria: {
      listType: "all", // 'all', 'owned', 'want'
      genre: "",
      author: "",
      // Add ratingMin: 0, etc. if needed
    },
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
     * Returns books filtered according to the current filterCriteria.
     * @param {object} state The current state of the books store
     * @returns {Array<object>} Filtered books
     */
    filteredBooks(state) {
      // Start with all books
      return state.books.filter((book) => {
        // Filter by List Type
        const listTypeMatch =
          state.filterCriteria.listType === "all" ||
          book.listType === state.filterCriteria.listType;

        // Filter by Genre (case-insensitive partial match)
        const genreMatch =
          !state.filterCriteria.genre || // Show all if filter is empty
          book.genre
            ?.toLowerCase()
            .includes(state.filterCriteria.genre.toLowerCase());

        // Filter by Author (case-insensitive partial match)
        const authorMatch =
          !state.filterCriteria.author || // Show all if filter is empty
          book.author
            .toLowerCase()
            .includes(state.filterCriteria.author.toLowerCase());

        // Add other filters here (e.g., rating)
        // const ratingMatch = book.rating >= state.filterCriteria.ratingMin;

        // Book must match all active filters
        return listTypeMatch && genreMatch && authorMatch; // && ratingMatch;
      });
    },

    /**
     * Returns only the books marked as 'owned'. (Still useful potentially)
     * @param {object} state The current state of the books store
     * @returns {Array<object>} Owned books
     */
    ownedBooks: (state) =>
      state.books.filter((book) => book.listType === "owned"),

    /**
     * Returns only the books marked as 'want' to read. (Still useful potentially)
     * @param {object} state The current state of the books store
     * @returns {Array<object>} Books on the wishlist
     */
    wantToReadBooks: (state) =>
      state.books.filter((book) => book.listType === "want"),

    /**
     * Returns a function that can find a specific book by its ID.
     * @param {object} state The current state of the books store
     * @returns {function(string): object|undefined} Function to get book by ID
     */
    getBookById: (state) => {
      return (id) => state.books.find((book) => book.id === id);
    },
  },

  /**
   * Actions: Methods that can contain asynchronous operations and mutate the state.
   */
  actions: {
    /**
     * Fetches the initial list of books.
     * @returns {Promise<void>}
     */
    async fetchBooks() {
      console.log("Fetching books...");
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.books = [...mockBooks];
          this.isLoading = false;
          console.log("Mock books fetched:", this.books.length);
          resolve();
        }, 800);
      });
    },

    /**
     * Adds a new book to the list.
     * @param {object} newBookData - Object containing data for the new book
     * @returns {Promise<object>} Promise resolving with the newly added Book object
     */
    async addBook(newBookData) {
      console.log("Adding book:", newBookData.title);
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          const bookToAdd = {
            ...newBookData,
            id: generateMockId(),
            dateAdded: new Date(),
          };
          this.books = [...this.books, bookToAdd];
          this.isLoading = false;
          console.log("Book added:", bookToAdd.id);
          resolve(bookToAdd);
        }, 300);
      });
    },

    /**
     * Updates an existing book in the list.
     * @param {object} updatedBookData - The complete Book object with updated data
     * @returns {Promise<boolean>} Promise resolving with true if successful
     */
    async updateBook(updatedBookData) {
      console.log("Updating book:", updatedBookData.id);
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
            console.log("Book updated successfully.");
            resolve(true);
          } else {
            this.isLoading = false;
            console.error("Book not found for update:", updatedBookData.id);
            resolve(false);
          }
        }, 300);
      });
    },

    /**
     * Deletes a book from the list by its ID.
     * @param {string} bookId - The unique ID of the book to delete
     * @returns {Promise<boolean>} Promise resolving with true if successful
     */
    async deleteBook(bookId) {
      console.log("Deleting book:", bookId);
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          const initialLength = this.books.length;
          this.books = this.books.filter((book) => book.id !== bookId);
          const success = this.books.length < initialLength;
          this.isLoading = false;
          if (success) {
            console.log("Book deleted successfully.");
          } else {
            console.error("Book not found for deletion:", bookId);
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
      // Merge the new criteria with the existing state
      // This allows updating individual filters without affecting others
      this.filterCriteria = { ...this.filterCriteria, ...criteria };
      console.log("Filters updated:", this.filterCriteria);
    },
  },
});
