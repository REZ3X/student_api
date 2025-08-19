'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

interface Student {
  _id: string;
  name: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
      setError('');
    } catch (err) {
      setError('Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: parseInt(formData.age),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const newStudent = await response.json();
      setStudents([...students, newStudent]);
      setFormData({ name: '', age: '' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to create student');
      console.error('Error creating student:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-8 mb-12">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold text-center">Student Management System</h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400">
            Manage your student database with this simple CRUD interface
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            {showForm ? 'Cancel' : 'Add New Student'}
          </button>
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Enter student age"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {submitting ? 'Adding...' : 'Add Student'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold">Students ({students.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-2">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No students found</p>
              <p className="text-sm mt-2">Add your first student using the button above</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <div key={student._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">Age: {student.age}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Added: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      ID: {student._id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/students</code> - Fetch all students</p>
            <p><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/students</code> - Create a new student</p>
          </div>
        </div>
      </main>
    </div>
  );
}