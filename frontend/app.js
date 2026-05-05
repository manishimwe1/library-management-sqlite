
const bookContainer = document.getElementById('book-container');
const navLink = document.getElementById('navLink');

const navLinks = [
    {
        label:'Home',
        active: true,
        link:'/'

    },
    {
        label:'Dashboard',
        active: false,
        link:'/frontend/dashboard/dashboard.html'

    },
    {
        label:'Books',
        active: false,
        link:'/frontend/books'

    },
    {
        label:'Add books',
        active: false,
        link:'/books'

    }
]


async function displayBooks(){
    try {
        const response = await fetch('http://localhost:3000/api/books');
        if (!response.ok) {
            console.error('Failed to fetch books');
            return;
        }

        const books = await response.json();
        bookContainer.innerHTML = '';

        books.forEach((book) => {
            const bookElement = document.createElement('div');
            const bookCard = document.createElement('div');

            const bookImage = document.createElement('img');
            const bookName = document.createElement('h2');
            const bookAuthor = document.createElement('p');
            const bookDescription = document.createElement('p');
            const bookPrice = document.createElement('p');
            const bookSpan = document.createElement('span');

            bookImage.src = book.imageSrc || '';
            bookName.textContent = book.name || 'Untitled';
            bookAuthor.textContent = `Author: ${book.author || 'Unknown'}`;
            bookDescription.textContent = book.description || '';
            bookPrice.textContent = 'Price: ';
            const priceValue = typeof book.price === 'number' ? book.price : Number(book.price);
            bookSpan.textContent = isFinite(priceValue) ? `$${priceValue.toFixed(2)}` : 'N/A';

            bookElement.className = 'book-element';
            bookName.className = 'book-title';
            bookAuthor.className = 'book-author';
            bookDescription.className = 'book-desc';
            bookPrice.className = 'book-price';
            bookImage.className = 'bookImage';
            bookCard.className = 'book-card';
            bookSpan.className = 'book-span-price';

            bookElement.appendChild(bookImage);
            bookCard.appendChild(bookName);
            bookCard.appendChild(bookAuthor);
            bookCard.appendChild(bookDescription);
            bookCard.appendChild(bookPrice);
            bookPrice.appendChild(bookSpan);
            bookElement.appendChild(bookCard);
            bookContainer.appendChild(bookElement);
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

function displayNavLinks(){
    navLinks.forEach((link) => {
        const navLinkElement = document.createElement('li');
        const navLinkHref = document.createElement('a');

        navLinkHref.innerText = link.label;
        navLinkHref.href = link.link;
        navLinkElement.className = 'nav-link';
        navLinkElement.appendChild(navLinkHref);
        navLink.appendChild(navLinkElement);
    });
}

displayBooks();

displayNavLinks();