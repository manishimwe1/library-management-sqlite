const modal = document.getElementById("modal");
const addBookBtn = document.getElementById("add-book-btn");
const closeBtn = document.getElementById("close-modal");
const submitForm = document.getElementById("submit-form");
const saveBookBtn = document.getElementById("add-book");
const bookTable = document.getElementById("book-table");
const tableBody = document.getElementById("table-body");

const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const authorInput = document.getElementById("author");
const priceInput = document.getElementById("price");
const image = document.getElementById("image");

const API_BASE = "http://localhost:3000/api";
let currentBookId = null;
let currentImageSrc = null;

// Function to read file as data URL
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}


//empty state
const emptyState = document.getElementById("empty-state");
function showEmptyState() {
  emptyState.style.display = "block";
  bookTable.style.display = "none";
}
// hide empty state
function hideEmptyState() {
  emptyState.style.display = "none";
  bookTable.style.display = "table";
}

//edit book function

// Submit books
async function handleBookSubmit(e) {
  e.preventDefault();
  submitForm.disabled = true;

  const name = nameInput.value;
  const desc = descInput.value;
  const author = authorInput.value;
  const price = priceInput.value;
  const file = image.files[0];

  if (!name || !desc || !author || !price) {
    alert("Please fill in all fields");
    submitForm.disabled = false;
    return;
  }

  let imageSrc;
  if (file) {
    try {
      imageSrc = await readFileAsDataURL(file);
    } catch (error) {
      alert("Error reading image file");
      submitForm.disabled = false;
      return;
    }
  } else if (currentBookId) {
    // for update, if no new file, use existing
    imageSrc = currentImageSrc;
  } else {
    alert("Please select an image");
    submitForm.disabled = false;
    return;
  }

  const bookData = {
    name,
    description: desc,
    author,
    price,
    imageSrc
  };

  try {
    const isUpdate = Boolean(currentBookId);
    let response;
    if (isUpdate) {
      response = await fetch(`${API_BASE}/books/${currentBookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    } else {
      response = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    }

    if (response.ok) {
      modal.style.display = "none";
      submitForm.reset();
      currentBookId = null;
      currentImageSrc = null;
      loadBooks();
      alert(isUpdate ? "Book updated successfully" : "Book added successfully");
    } else {
      alert("Error saving book");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  } finally {
    submitForm.disabled = false;
  }
}

// load books
const loadBooks = async () => {
  try {
    const response = await fetch(`${API_BASE}/books`);
    if (!response.ok) {
      console.log("error in getting data");
      return;
    }

    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.log(error);
    showEmptyState();
  }
};

const displayBooks = (books) => {
  tableBody.innerHTML = "";

  if (!books || books.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();
  books.forEach((book, index) => {
    const row = createHtmlRow(book, index);
    tableBody.appendChild(row);
  });
};

const createHtmlRow = (book, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><strong>${index + 1}</strong></td>
    <td><strong>${book.name}</strong></td>
    <td class='truncate'>${book.author}</td>
    <td class='truncate'>${book.description}</td>
    <td class='truncate'>
      <img class='table-image' src="${book.imageSrc || ''}" alt="${book.name || 'Book image'}" />
    </td>
    <td class='truncate'>${book.price}</td>
    <td>
      <div class='action-cell'>
        <button class='btn-action'>View</button>
        <button class='btn-action' onclick='editBook(${book.id})'>Edit</button>
        <button class='btn-action ' onclick='deleteBook(${book.id})'>Delete</button>
      </div>
    </td>
  `;

  return row;
};

// Display modal
addBookBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  currentBookId = null;
  currentImageSrc = null;
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  submitForm.reset();
  currentBookId = null;
  currentImageSrc = null;
});

// Handle form submission
submitForm.addEventListener("submit", handleBookSubmit);

document.addEventListener("DOMContentLoaded", loadBooks);

// delete book
async function deleteBook(id) {
  if (!id) {
    return console.log("missing bookId");
  }
  try {
    const response = await fetch(`${API_BASE}/books/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log("error in deleting book");
    } else {
      alert("book deleted successfully");
      loadBooks();
    }
  } catch (error) {
    console.log(error);
    alert("something went wrong in deleting book");
  }
}
//edit book function

async function editBook(id) {
  try {
    const response = await fetch(`${API_BASE}/books/${id}`);
    if (response.ok) {
      const book = await response.json();
      nameInput.value = book.name;
      descInput.value = book.description;
      authorInput.value = book.author;
      priceInput.value = book.price;
      // can't set file input, so leave it, and use currentImageSrc
      currentImageSrc = book.imageSrc;
      currentBookId = id;
      modal.style.display = "flex";
    } else {
      alert("Error loading book");
    }
  } catch (error) {
    console.log(error);
  }
}
