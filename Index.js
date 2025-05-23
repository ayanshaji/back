/*const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

require('./Connection');
const userModel = require('./Model/User');
const bookModel = require('./Model/book');

// initialize
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Predefined admin credentials
const admins = [
  { username: 'allenjoshy', password: 'allenjoshy@14' },
  { username: 'anvarshas', password: 'anvarshas@24' },
  { username: 'arjunpsuresh', password: 'arjunpsuresh@26' },
  { username: 'ayanshaji', password: 'ayanshaji@32' }
];

// 🧾 Register API (Sign-in)
app.post('/sign', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();

    res.send({ message: 'User registered successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error during registration' });
  }
});

// 🔐 Login API
app.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (role === 'admin') {
      const admin = admins.find(
        (admin) => admin.username === username && admin.password === password
      );
      if (admin) {
        return res.send({ message: 'Admin login successful', username });
      } else {
        return res.status(400).send({ message: 'Invalid admin credentials' });
      }
    }

    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid password' });
    }

    res.send({ message: 'Login successful', username: user.username });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error during login' });
  }
});

// 📚 Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await bookModel.find();
    res.json(books);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching books' });
  }
});

// 📌 Reserve a book
app.post('/reserve', async (req, res) => {
  try {
    const { bookId, name, email, returnDate } = req.body;
    console.log('Incoming reservation request:', req.body);

    if (!bookId || !name || !email || !returnDate) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }

    if (book.reserved) {
      return res.status(400).send({ message: 'Book is already reserved' });
    }

    book.reserved = true;
    book.reservedBy = `${name} (${email})`;
    book.returnDate = returnDate;

    await book.save();
    console.log('Book reserved successfully:', book._id);

    res.send({ message: 'Book reserved successfully' });

  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
});

// 📚 Delete a book by ID (for ViewBooks)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await bookModel.findByIdAndDelete(req.params.id);

    if (!book) return res.status(404).send('Book not found');
    res.send({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// ✅ Health Check
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
app.listen(3004, () => {
  console.log('Server is running on http://localhost:3004');
});*/
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

require('./Connection');
const userModel = require('./Model/User');
const bookModel = require('./Model/book');

// Initialize
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust for frontend port

// Predefined admin credentials
const admins = [
  { username: 'allenjoshy', password: 'allenjoshy@14' },
  { username: 'anvarshas', password: 'anvarshas@24' },
  { username: 'arjunpsuresh', password: 'arjunpsuresh@26' },
  { username: 'ayanshaji', password: 'ayanshaji@32' }
];

// 🧾 Register API (Sign-in)
app.post('/api/sign', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password are required' });
    }

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();

    res.send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ message: 'Server error during registration', error: error.message });
  }
});

// 🔐 Login API
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      console.log('Login failed: Missing fields', { username, role });
      return res.status(400).send({ message: 'Username, password, and role are required' });
    }

    console.log('Login attempt:', { username, role });

    if (role === 'admin') {
      const admin = admins.find(
        (admin) => admin.username.toLowerCase() === username.toLowerCase() && admin.password === password
      );
      if (admin) {
        console.log('Admin login successful:', username);
        return res.send({ message: 'Admin login successful', username, role: 'admin' });
      } else {
        console.log('Admin login failed: Invalid credentials');
        return res.status(400).send({ message: 'Invalid admin credentials' });
      }
    }

    const user = await userModel.findOne({ username });
    if (!user) {
      console.log('User login failed: User not found');
      return res.status(400).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('User login failed: Invalid password');
      return res.status(400).send({ message: 'Invalid password' });
    }

    console.log('User login successful:', username);
    res.send({ message: 'Login successful', username, role: 'user' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'Server error during login', error: error.message });
  }
});

// 📚 Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await bookModel.find();
    // Map _id to id for frontend consistency
    const formattedBooks = books.map(book => ({
      ...book.toObject(),
      id: book._id.toString()
    }));
    res.json(formattedBooks);
  } catch (err) {
    console.error('Fetch books error:', err);
    res.status(500).send({ message: 'Error fetching books', error: err.message });
  }
});

// 📚 Get a single book by ID (for EditBook)
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
    // Map _id to id for frontend consistency
    res.json({ ...book.toObject(), id: book._id.toString() });
  } catch (err) {
    console.error('Fetch book error:', err);
    res.status(400).send({ message: 'Invalid book ID', error: err.message });
  }
});

// 📚 Update a book by ID (for EditBook)
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, published, reserved, reservedBy, borrowed, borrowedBy, borrowDate, returnDate } = req.body;

    if (!title || !author || !genre || !published) {
      return res.status(400).send({ message: 'All fields (title, author, genre, published) are required' });
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
      id,
      { title, author, genre, published, reserved, reservedBy, borrowed, borrowedBy, borrowDate, returnDate },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).send({ message: 'Book not found' });
    }

    // Map _id to id for response
    res.json({ message: 'Book updated successfully', book: { ...updatedBook.toObject(), id: updatedBook._id.toString() } });
  } catch (err) {
    console.error('Update book error:', err);
    res.status(400).send({ message: 'Invalid book ID', error: err.message });
  }
});

// 📚 Delete a book by ID (for ViewBooks)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.status(400).send({ message: 'Invalid book ID' });
    }
    const book = await bookModel.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }
    console.log('Book deleted successfully:', id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Delete book error:', err);
    res.status(400).send({ message: 'Invalid book ID', error: err.message });
  }
});

// 📌 Reserve a book
app.post('/api/reserve', async (req, res) => {
  try {
    const { bookId, name, email, returnDate } = req.body;
    console.log('Incoming reservation request:', req.body);

    if (!bookId || !name || !email || !returnDate) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: 'Book not found' });
    }

    if (book.reserved) {
      return res.status(400).send({ message: 'Book is already reserved' });
    }

    book.reserved = true;
    book.reservedBy = `${name} (${email})`;
    book.returnDate = returnDate;

    await book.save();
    console.log('Book reserved successfully:', book._id);
    res.send({ message: 'Book reserved successfully' });
  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).send({ message: 'Server error', error: err.message });
  }
});

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

