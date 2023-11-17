// Import necessary React and Tailwind CSS dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// Define the ManagePage component
const ManagePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white text-center">
        <h1 className="text-2xl font-bold">Manage</h1>
      </header>

      {/* Main content */}
      <main className="p-4">
        {/* General Manage */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-2">General Manage</h2>
          {/* List of general Manage */}
          <ul className="grid grid-cols-1 gap-2">
            <li className="bg-white p-2 rounded-md shadow-md">
              <span className="text-gray-700">Language</span>
              {/* Dropdown for language selection */}
              <select className="block w-full mt-1">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </li>

            {/* Add more general Manage here */}
          </ul>
        </section>

        {/* Account Manage */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Cutomers Manager</h2>
          {/* List of account Manage */}
          <ul className="grid grid-cols-1 gap-2">
            <li className="bg-white p-2 rounded-md shadow-md">
                <Link to="customers">Customers</Link>
            </li>
            <li className="bg-white p-2 rounded-md shadow-md">
                <Link to="customers">Add New</Link>
            </li>
            <li className="bg-white p-2 rounded-md shadow-md">
                <Link to="customers">Deactivate</Link>
            </li>

          </ul>
        </section>

        {/* Theme Manage */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Theme Manage</h2>
          {/* List of theme Manage */}
          <ul className="grid grid-cols-1 gap-2">
            <li className="bg-white p-2 rounded-md shadow-md">
              <span className="text-gray-700">Dark Mode</span>
              {/* Toggle switch for dark mode */}
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </li>

            {/* Add more theme Manage here */}
          </ul>
        </section>
      </main>
    </div>  
  );
};

export default ManagePage;
