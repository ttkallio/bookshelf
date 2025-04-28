import { defineStore } from "pinia";

const API_BASE_URL = "https://api.medtae.com/api";

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

  //Getters
  getters: {
    allBooks: (state) => state.books,

    /**
     * @param {object} state The current state of the books store
     * @returns {Array<object>} Filtered books
     */
    filteredBooks(state) {
      const booksToFilter = Array.isArray(state.books) ? state.books : [];

      return booksToFilter.filter((book) => {
        if (!book) return false;

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
            ?.toLowerCase()
            .includes(state.filterCriteria.author.toLowerCase());

        return listTypeMatch && genreMatch && authorMatch;
      });
    },

    ownedBooks: (state) =>
      (Array.isArray(state.books) ? state.books : []).filter(
        (book) => book?.listType === "owned"
      ),
    wantToReadBooks: (state) =>
      (Array.isArray(state.books) ? state.books : []).filter(
        (book) => book?.listType === "want"
      ),
    getBookById: (state) => {
      return (id) =>
        (Array.isArray(state.books) ? state.books : []).find(
          (book) => book?.id === id
        );
    },
  },

  actions: {
    /**
     * Fetches the list of books from the back-end API.
     * @returns {Promise<void>}
     */
    async fetchBooks() {
      console.log("Fetching books from API:", API_BASE_URL);
      this.isLoading = true;
      // Ensure books is an array before starting fetch
      if (!Array.isArray(this.books)) {
        this.books = [];
      }
      try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error (${response.status}):`, errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
        const data = await response.json();
        this.books = data.map((book) => ({
          ...book,
          dateAdded: book.dateAdded ? new Date(book.dateAdded) : new Date(),
        }));
        console.log(`API books fetched successfully: ${this.books.length}`);
      } catch (error) {
        console.error("Error fetching books from API:", error);
        this.books = []; // Reset to empty array on error
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Adds a new book by calling the back-end API.
     * @param {object} newBookData - Object containing data for the new book
     * @returns {Promise<object|null>} Promise resolving with the newly added Book object from the API, or null on failure.
     */
    async addBook(newBookData) {
      console.log("Adding book via API:", API_BASE_URL);
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
          const errorData = await response
            .json()
            .catch(() => ({ error: response.statusText }));
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
        if (!Array.isArray(this.books)) {
          this.books = [];
        }
        this.books.unshift(bookWithDate);
        console.log("Book added successfully via API:", bookWithDate.id);
        return bookWithDate;
      } catch (error) {
        console.error("Error adding book via API:", error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Updates an existing book by calling the back-end API.
     * @param {object} updatedBookData - The complete Book object with updated data
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
      console.log(`Updating book via API (ID: ${bookId}):`, API_BASE_URL);
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
          const errorData = await response
            .json()
            .catch(() => ({ error: response.statusText }));
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

        if (!Array.isArray(this.books)) {
          this.books = [];
        }
        const index = this.books.findIndex((book) => book?.id === bookId);
        if (index !== -1) {
          this.books[index] = bookWithDate;
          console.log(
            "Book updated successfully via API and in store:",
            bookId
          );
          return true;
        } else {
          console.warn(
            `Book with ID ${bookId} was updated via API but not found in local store state. Refetching.`
          );
          await this.fetchBooks();
          return true;
        }
      } catch (error) {
        console.error(`Error updating book (ID: ${bookId}) via API:`, error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Deletes a book by calling the back-end API.
     * @param {string} bookId - The unique ID of the book to delete
     * @returns {Promise<boolean>} Promise resolving with true if successful, false otherwise.
     */
    async deleteBook(bookId) {
      if (!bookId) {
        console.error("deleteBook action failed: Book ID is required.");
        return false;
      }
      console.log(`Deleting book via API (ID: ${bookId}):`, API_BASE_URL);
      this.isLoading = true;
      try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
          method: "DELETE",
        });

        if (response.ok || response.status === 204) {
          if (!Array.isArray(this.books)) {
            this.books = [];
          }
          this.books = this.books.filter((book) => book?.id !== bookId);
          console.log(
            "Book deleted successfully via API and from store:",
            bookId
          );
          return true;
        } else if (response.status === 404) {
          console.warn(
            `Book with ID ${bookId} not found on server for deletion.`
          );
          if (!Array.isArray(this.books)) {
            this.books = [];
          }
          this.books = this.books.filter((book) => book?.id !== bookId);
          return false;
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ error: response.statusText }));
          console.error(`API Error (${response.status}):`, errorData);
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorData.error || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error(`Error deleting book (ID: ${bookId}) via API:`, error);
        return false;
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
