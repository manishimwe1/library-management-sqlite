const modal = document.getElementById("modal");
const addBookBtn = document.getElementById("add-book-btn");
const closeBtn = document.getElementById("close-modal");
const submitForm = document.getElementById("submit-form");
const saveBookBtn = document.getElementById("add-book");
const tableBody = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");
const booksTable = document.getElementById("booksTable");

const API_BASE = "http://localhost:3000/api";

// Fetch and display all books
async function loadBooks() {
  try {
    const response = await fetch(`${API_BASE}/books`);
    if (!response.ok) throw new Error("Failed to fetch books");
    
    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error("Error loading books:", error);
    showEmptyState();
  }
}

// Display books in table
function displayBooks(books) {
  tableBody.innerHTML = "";
  
  if (books.length === 0) {
    showEmptyState();
    return;
  }
  
  hideEmptyState();
  
  books.forEach((book,index) => {
    const row = createTableRow(book,index);
    tableBody.appendChild(row);
  });
}

// Create table row element
function createTableRow(book,index) {
  const row = document.createElement("tr");
  
  const imageHtml = book.imageSrc 
    ? `<img src="${book.imageSrc}" alt="${book.name}" class="table-image" />` 
    : "<span style='color: #999;'>No image</span>";
  
  row.innerHTML = `
    <td ><strong>${index + 1}</strong></td>
    <td class="truncate"><strong>${book.name}</strong></td>
    <td class="truncate">${book.author}</td>
    <td class="truncate">${book.description}</td>
    <td><strong>$${parseFloat(book.price).toFixed(2)}</strong></td>
    <td>${imageHtml}</td>
    <td>
      <div class="actions-cell">
        <button class="btn-action btn-view" onclick="viewBook(${book.id})">View</button>
        <button class="btn-action btn-edit" onclick="editBook(${book.id})">Edit</button>
        <button class="btn-action btn-delete" onclick="deleteBook(${book.id})">Delete</button>
      </div>
    </td>
  `;
  
  return row;
}

// Show empty state
function showEmptyState() {
  emptyState.classList.add("show");
  booksTable.style.display = "none";
}

// Hide empty state
function hideEmptyState() {
  emptyState.classList.remove("show");
  booksTable.style.display = "table";
}

// View book details
function viewBook(bookId) {
  alert(`View book ${bookId}`);
  // TODO: Implement view modal
}

// Edit book
function editBook(bookId) {
  alert(`Edit book ${bookId}`);
  // TODO: Implement edit functionality
}

// Delete book
async function deleteBook(bookId) {
  if (!confirm("Are you sure you want to delete this book?")) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/books/${bookId}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      alert("Book deleted successfully");
      loadBooks(); // Reload table
    } else {
      alert("Failed to delete book");
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    alert("Error deleting book");
  }
}

// Submit books
async function handleBookSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById("name").value;
  const descInput = document.getElementById("description").value;
  const authorInput = document.getElementById("author").value;
  const priceInput = document.getElementById("price").value;
  const image = document.getElementById("image").value;

  if (!nameInput || !descInput || !authorInput || !priceInput) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/books`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput,
        description: descInput,
        author: authorInput,
        price: priceInput,
        imageSrc: image,
      }),
      method: "POST",
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert("Book added successfully");
      
      // Clear form
      submitForm.reset();
      
      // Close modal
      modal.style.display = "none";
      
      // Reload books table
      loadBooks();
    } else {
      alert("Error adding book");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error adding book");
  }
}

// Display modal
addBookBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  submitForm.reset();
});

// Handle form submission
saveBookBtn.addEventListener("click", handleBookSubmit);

// Load books on page load
document.addEventListener("DOMContentLoaded", loadBooks);
