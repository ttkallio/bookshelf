// src/stores/books.js

import { defineStore } from "pinia";

// Define the base URL for your API endpoint
const API_BASE_URL = "http://localhost:3306/api"; // Adjust port if needed

// Removed the unused generateMockId function

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
    allBooks: (state) => state.books,

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
     * @returns {Promise<void>}
     */
    async fetchBooks() {
      console.log("Fetching books from API...");
      this.isLoading = true;
      try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.books = data.map((book) => ({
          ...book,
          dateAdded: book.dateAdded ? new Date(book.dateAdded) : new Date(),
        }));
        console.log(`API books fetched successfully: ${this.books.length}`);
      } catch (error) {
        console.error("Error fetching books from API:", error);
        this.books = [];
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Adds a new book by calling the back-end API.
     * @param {object} newBookData - Object containing data for the new book (title, author, listType, etc.)
     * @returns {Promise<object|null>} Promise resolving with the newly added Book object from the API, or null on failure.
     */
    async addBook(newBookData) {
      console.log("Adding book via API:", newBookData);
      this.isLoading = true;
      try {
        const response = await fetch(`${API_BASE_URL}/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBookData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`API Error (${response.status}):`, errorData);
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorData.error || response.statusText
            }`
          );
        }

        const addedBook = await response.json();
        const bookWithDate = {
          ...addedBook,
          dateAdded: addedBook.dateAdded
            ? new Date(addedBook.dateAdded)
            : new Date(),
        };
        this.books.unshift(bookWithDate); // Add to beginning of local state
        console.log("Book added successfully via API:", bookWithDate.id);
        return bookWithDate;
      } catch (error) {
        console.error("Error adding book via API:", error);
        return null; // Indicate failure
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Updates an existing book by calling the back-end API.
     * @param {object} updatedBookData - The complete Book object with updated data (must include id)
     * @returns {Promise<boolean>} Promise resolving with true if successful, false otherwise.
     */
    async updateBook(updatedBookData) {
      if (!updatedBookData?.id) {
        console.error(
          "updateBook action failed: Book data must include an ID."
        );
        return false;
      }
      const bookId = updatedBookData.id;
      console.log(`Updating book via API (ID: ${bookId}):`, updatedBookData);
      this.isLoading = true;
      try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBookData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`API Error (${response.status}):`, errorData);
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorData.error || response.statusText
            }`
          );
        }

        const returnedUpdatedBook = await response.json();
        const bookWithDate = {
          ...returnedUpdatedBook,
          dateAdded: returnedUpdatedBook.dateAdded
            ? new Date(returnedUpdatedBook.dateAdded)
            : new Date(),
        };

        const index = this.books.findIndex((book) => book.id === bookId);
        if (index !== -1) {
          this.books[index] = bookWithDate; // Update local state
          console.log(
            "Book updated successfully via API and in store:",
            bookId
          );
          return true;
        } else {
          console.warn(
            `Book with ID ${bookId} was updated via API but not found in local store state. Refetching.`
          );
          await this.fetchBooks(); // Re-fetch to ensure consistency
          return true; // Still count as success as API call worked
        }
      } catch (error) {
        console.error(`Error updating book (ID: ${bookId}) via API:`, error);
        return false; // Indicate failure
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Deletes a book by calling the back-end API.
     * Replaces the mock implementation.
     * @param {string} bookId - The unique ID of the book to delete
     * @returns {Promise<boolean>} Promise resolving with true if successful, false otherwise.
     */
    async deleteBook(bookId) {
      if (!bookId) {
        console.error("deleteBook action failed: Book ID is required.");
        return false;
      }
      console.log(`Deleting book via API (ID: ${bookId})`);
      this.isLoading = true; // Optional: indicate loading during delete
      try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
          method: "DELETE",
        });

        // Check for successful deletion (status 204 No Content or potentially 200 OK)
        // Also handle 404 Not Found specifically
        if (response.status === 204 || response.ok) {
          // Remove the book from the local state array
          this.books = this.books.filter((book) => book.id !== bookId);
          console.log(
            "Book deleted successfully via API and from store:",
            bookId
          );
          return true; // Indicate success
        } else if (response.status === 404) {
          console.warn(
            `Book with ID ${bookId} not found on server for deletion.`
          );
          // Optional: Remove from local state anyway if it exists locally but not on server
          this.books = this.books.filter((book) => book.id !== bookId);
          return false; // Indicate failure (not found)
        } else {
          // Handle other errors (e.g., 500)
          const errorData = await response.json().catch(() => ({}));
          console.error(`API Error (${response.status}):`, errorData);
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorData.error || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error(`Error deleting book (ID: ${bookId}) via API:`, error);
        return false; // Indicate failure
      } finally {
        this.isLoading = false;
      }
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
