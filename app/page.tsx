'use client'

import { useState, useMemo } from 'react'

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  status: 'available' | 'borrowed'
  borrower?: string
  dueDate?: string
}

const initialBooks: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', status: 'available' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'Fiction', status: 'borrowed', borrower: 'John Doe', dueDate: '2025-11-01' },
  { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Fiction', status: 'available' },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', category: 'Fiction', status: 'available' },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769174', category: 'Fiction', status: 'available' },
  { id: 6, title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', status: 'available' },
  { id: 7, title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', status: 'borrowed', borrower: 'Jane Smith', dueDate: '2025-11-05' },
  { id: 8, title: 'Educated', author: 'Tara Westover', isbn: '978-0399590504', category: 'Biography', status: 'available' },
]

export default function LibraryApp() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: 'Fiction' })

  const categories = useMemo(() => {
    const cats = new Set(books.map(b => b.category))
    return ['all', ...Array.from(cats)]
  }, [books])

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      
      const matchesCategory = filterCategory === 'all' || book.category === filterCategory
      const matchesStatus = filterStatus === 'all' || book.status === filterStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [books, searchTerm, filterCategory, filterStatus])

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBook.title && newBook.author && newBook.isbn) {
      const book: Book = {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        ...newBook,
        status: 'available'
      }
      setBooks([...books, book])
      setNewBook({ title: '', author: '', isbn: '', category: 'Fiction' })
      setShowAddForm(false)
    }
  }

  const handleBorrow = (id: number) => {
    const borrower = prompt('Enter borrower name:')
    if (borrower) {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)
      setBooks(books.map(book => 
        book.id === id 
          ? { ...book, status: 'borrowed' as const, borrower, dueDate: dueDate.toISOString().split('T')[0] }
          : book
      ))
    }
  }

  const handleReturn = (id: number) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { ...book, status: 'available' as const, borrower: undefined, dueDate: undefined }
        : book
    ))
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id))
    }
  }

  const stats = useMemo(() => ({
    total: books.length,
    available: books.filter(b => b.status === 'available').length,
    borrowed: books.filter(b => b.status === 'borrowed').length
  }), [books])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Library Management System</h1>
          <p className="text-gray-600">Manage your book collection efficiently</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600">Total Books</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.available}</div>
            <div className="text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">{stats.borrowed}</div>
            <div className="text-gray-600">Borrowed</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add New Book'}
          </button>
        </div>

        {/* Add Book Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Book Title"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="ISBN"
                value={newBook.isbn}
                onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={newBook.category}
                onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="submit"
                className="md:col-span-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Book
              </button>
            </form>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  book.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {book.status === 'available' ? '✓ Available' : '⏱ Borrowed'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {book.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-1">by {book.author}</p>
              <p className="text-gray-500 text-sm mb-4">ISBN: {book.isbn}</p>
              
              {book.status === 'borrowed' && book.borrower && (
                <div className="bg-orange-50 p-3 rounded mb-4 text-sm">
                  <p className="text-gray-700"><strong>Borrower:</strong> {book.borrower}</p>
                  <p className="text-gray-700"><strong>Due:</strong> {book.dueDate}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                {book.status === 'available' ? (
                  <button
                    onClick={() => handleBorrow(book.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Borrow
                  </button>
                ) : (
                  <button
                    onClick={() => handleReturn(book.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Return
                  </button>
                )}
                <button
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-xl">No books found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
