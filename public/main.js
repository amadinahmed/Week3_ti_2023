const bookTableBody = document.getElementById('bookTableBody');
const createBookButton = document.getElementById('createBookButton');

// Function to generate a unique ID for a book
const generateId = () => {
  // Logic to generate a unique ID (e.g., using a counter or UUID library)
  // For simplicity, we'll use a random number between 1 and 10000
  return Math.floor(Math.random() * 10000) + 1;
};

// Function to add a new book
const addBook = () => {
  const id = generateId();
  const title = prompt('Enter the title of the book:');
  const author = prompt('Enter the author of the book:');

  // Send a POST request to the server
  fetch('/bookadd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, title, author }),
  })
  .then(response => response.json())
  .then(book => {
    // Add the new book to the table
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    const titleCell = document.createElement('td');
    const authorCell = document.createElement('td');
    const actionCell = document.createElement('td');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    idCell.textContent = book.id;
    titleCell.textContent = book.title;
    authorCell.textContent = book.author;
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Delete';

    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(actionCell);

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    bookTableBody.appendChild(row);

    // Event listener for the edit button
    editButton.addEventListener('click', () => editBook(book.id));

    // Event listener for the delete button
    deleteButton.addEventListener('click', () => deleteBook(book.id));
  })
  .catch(error => console.error('Error:', error));
};

// Function to edit a book
const editBook = (bookId) => {
  const title = prompt('Enter the new title of the book:');
  const author = prompt('Enter the new author of the book:');

  // Send a PUT request to the server
  fetch('/bookedit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: bookId, title, author }),
  })
  .then(response => response.json())
  .then(updatedBook => {
    // Find the table row corresponding to the book and update its data
    const rows = bookTableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
      const idCell = rows[i].getElementsByTagName('td')[0];

      if (parseInt(idCell.textContent) === updatedBook.id) {
        const titleCell = rows[i].getElementsByTagName('td')[1];
        const authorCell = rows[i].getElementsByTagName('td')[2];

        titleCell.textContent = updatedBook.title;
        authorCell.textContent = updatedBook.author;

        break;
      }
    }
  })
  .catch(error => console.error('Error:', error));
};

// Function to delete a book
const deleteBook = (bookId) => {
  // Send a DELETE request to the server
  fetch('/bookdelete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: bookId }),
  })
  .then(response => {
    if (response.status === 204) {
      // Remove the corresponding table row
      const rows = bookTableBody.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
        const idCell = rows[i].getElementsByTagName('td')[0];
        if (parseInt(idCell.textContent) === bookId) {
          rows[i].remove();
          break;
        }
      }
    } else {
      console.error('Error:', response.status);
    }
  })
  .catch(error => console.error('Error:', error));
};

// Event listener for the create book button
createBookButton.addEventListener('click', addBook);

// Fetch book list from the server
fetch('/booklist')
  .then(response => response.json())
  .then(data => {
    // Loop through the book list and create table rows
    data.forEach(book => {
      const row = document.createElement('tr');
      const idCell = document.createElement('td');
      const titleCell = document.createElement('td');
      const authorCell = document.createElement('td');
      const actionCell = document.createElement('td');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');

      idCell.textContent = book.id;
      titleCell.textContent = book.title;
      authorCell.textContent = book.author;
      editButton.textContent = 'Edit';
      deleteButton.textContent = 'Delete';

      row.appendChild(idCell);
      row.appendChild(titleCell);
      row.appendChild(authorCell);
      row.appendChild(actionCell);

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);

      bookTableBody.appendChild(row);

      // Event listener for the edit button
      editButton.addEventListener('click', () => editBook(book.id));

      // Event listener for the delete button
      deleteButton.addEventListener('click', () => deleteBook(book.id));
    });
  })
  .catch(error => console.error('Error:', error));