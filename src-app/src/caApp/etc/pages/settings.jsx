// Import necessary React and Tailwind CSS dependencies
import React from 'react';

// Define the SettingsPage component
const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white text-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      {/* Main content */}
      <main className="p-4">
        {/* General Settings */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-2">General Settings</h2>
          {/* List of general settings */}
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

            {/* Add more general settings here */}
          </ul>
        </section>

        {/* Account Settings */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
          {/* List of account settings */}
          <ul className="grid grid-cols-1 gap-2">
            <li className="bg-white p-2 rounded-md shadow-md">
              <span className="text-gray-700">Change Password</span>
              {/* Input for new password */}
              <input
                type="password"
                className="block w-full mt-1"
                placeholder="Enter new password"
              />
            </li>

            {/* Add more account settings here */}
          </ul>
        </section>

        {/* Theme Settings */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Theme Settings</h2>
          {/* List of theme settings */}
          <ul className="grid grid-cols-1 gap-2">
            <li className="bg-white p-2 rounded-md shadow-md">
              <span className="text-gray-700">Dark Mode</span>
              {/* Toggle switch for dark mode */}
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </li>

            {/* Add more theme settings here */}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
