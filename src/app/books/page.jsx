'use client';

import React, { useEffect, useState } from 'react';

import bgImage from '../../../public/images/background.jpg';
import useAuthStore from '../store/store';

const BooksTable = () => {
  const { books, fetchBooks, loading, error } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all'); // Default to search all fields
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on selected field and search query
  const filteredBooks = books.filter((book) => {
    const searchLower = searchQuery.toLowerCase();
    if (searchField === 'all') {
      // Search across all fields
      return (
        book.id.toString().includes(searchLower) ||
        book.name.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.publisher.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower) ||
        new Date(book.created_at)
          .toLocaleString()
          .toLowerCase()
          .includes(searchLower) ||
        new Date(book.updated_at)
          .toLocaleString()
          .toLowerCase()
          .includes(searchLower)
      );
    } else {
      // Search in the selected field
      switch (searchField) {
        case 'id':
          return book.id.toString().includes(searchLower);
        case 'name':
          return book.name.toLowerCase().includes(searchLower);
        case 'author':
          return book.author.toLowerCase().includes(searchLower);
        case 'publisher':
          return book.publisher.toLowerCase().includes(searchLower);
        case 'isbn':
          return book.isbn.toLowerCase().includes(searchLower);
        case 'category':
          return book.category.toLowerCase().includes(searchLower);
        case 'created_at':
          return new Date(book.created_at)
            .toLocaleString()
            .toLowerCase()
            .includes(searchLower);
        case 'updated_at':
          return new Date(book.updated_at)
            .toLocaleString()
            .toLowerCase()
            .includes(searchLower);
        default:
          return true;
      }
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading)
    return (
      <p className="text-center text-lg font-semibold mt-5 text-white">
        Loading books...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-5">{error}</p>
    );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-8 text-center">
        📚 Books List
      </h2>

      {/* Search Bar with Dropdown */}
      <div className="w-full max-w-6xl mb-6 flex space-x-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="p-3 rounded-lg bg-opacity-70 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
        >
          <option
            value="all"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            All Fields
          </option>
          <option
            value="id"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            ID
          </option>
          <option
            value="name"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            Name
          </option>
          <option
            value="author"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            Author
          </option>
          <option
            value="publisher"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            Publisher
          </option>
          <option
            value="isbn"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            ISBN
          </option>
          <option
            value="category"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            Category
          </option>
          <option
            value="created_at"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            Created At
          </option>
          <option
            value="updated_at"
            className="bg-gray-800 bg-opacity-20 backdrop-blur-md text-white"
          >
            Updated At
          </option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchField === 'all' ? 'all fields' : searchField}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg  bg-opacity-20 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 bg-opacity-70">
            <tr>
              <th className="p-4 text-left text-white font-semibold">ID</th>
              <th className="p-4 text-left text-white font-semibold">Name</th>
              <th className="p-4 text-left text-white font-semibold">Author</th>
              <th className="p-4 text-left text-white font-semibold">
                Publisher
              </th>
              <th className="p-4 text-left text-white font-semibold">ISBN</th>
              <th className="p-4 text-left text-white font-semibold">
                Category
              </th>
              <th className="p-4 text-left text-white font-semibold">
                Created At
              </th>
              <th className="p-4 text-left text-white font-semibold">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody className="bg-opacity-20">
            {paginatedBooks.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-gray-700 hover:bg-opacity-20 transition-colors"
              >
                <td className="p-4 text-white border-t border-gray-700">
                  {book.id}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {book.name}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {book.author}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {book.publisher}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {book.isbn}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {book.category}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {new Date(book.created_at).toLocaleString()}
                </td>
                <td className="p-4 text-white border-t border-gray-700">
                  {new Date(book.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BooksTable;
