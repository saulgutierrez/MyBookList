// Book class: Represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI tasks
class UI {
    // Use static for avoid to create an instance of the method
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        // Create the DOM
        const list = document.querySelector("#book-list");
        // Create a table row for each book
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        // Append to the DOM
        list.appendChild(row);
    }

    static deleteBook(el) {
        // If delete tag (delete button) was clicked
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlerts(message, className) {
        // Creating a div tag with js
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        // Provide text to an element
        div.appendChild(document.createTextNode(message));
        // Inserting a div alert between the container (title of the app) and the form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in three seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store class: Handle storage
class Store {
    // Fetch the list of books from the LocalStorage
    static getBooks() {
        let books;
        // If there are no books avaliable in the LocalStorage
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            // Parse data from string to JSON format
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBooks(book) {
        // Add a book to the list of books already in the localStorage
        const books = Store.getBooks();
        books.push(book);
        // Parse a book from JSON to string for vault it in LocalStorage
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Isbn is a unique value, so we use this for identified the book that will be deleted
    static removeBook(isbn) {
        const books = Store.getBooks();
        // Explore all the list of books in search for the element that will be deleted
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                // This method deletes the element that is passed as parameter
                // The second parameter indicates the quantity of elements that will be deleted
                books.splice(index, 1);
            }
        });
        // Updating the data
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Events: Display book. As soon as the page loads it will call this one display books function, and this display the function
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get values from the form
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validation, must be use three equal operator, for checking data type
    if (title === '' || author === '' || isbn === '') {
        UI.showAlerts('Please fill in the fields', 'danger');
    } else {
        // Instantiate book
        const book = new Book(title, author, isbn);
        // Success message
        UI.showAlerts('Book added', 'success');
        // Add book to UI
        UI.addBookToList(book);
        // Add book to store (LocalStorage)
        Store.addBooks(book);
        // Clear fields after pressing submit button
        UI.clearFields();
    }
});

// Event: Removing book from UI
document.querySelector("#book-list").addEventListener("click", (e) => {
    UI.deleteBook(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Deleted message
    UI.showAlerts('Book deleted', 'success');
})