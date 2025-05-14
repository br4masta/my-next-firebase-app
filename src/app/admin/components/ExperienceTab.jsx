'use client';

import React, { useState, useEffect } from 'react';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/firebase-service';

export default function ExperienceTab() {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    tahun: '',
    description: '',
    type: 'work' // Add status field with default value
  });
  
  // State for experiences list
  const [experiences, setExperiences] = useState({
    work: [],
    education: []
  });
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Load experiences on component mount
  useEffect(() => {
    loadExperiences();
  }, []);
  
  // Function to load experiences from Firestore
  const loadExperiences = async () => {
    try {
      const data = await getExperiences();
      // Group experiences by status
      const grouped = {
        work: data.filter(exp => exp.type === 'work'),
        education: data.filter(exp => exp.type === 'education')
      };
      setExperiences(grouped);
    } catch (error) {
      console.error('Error loading experiences:', error);
      alert('Failed to load experiences');
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        // Update existing experience
        await updateExperience(currentId, formData);
        alert('Experience updated successfully!');
      } else {
        // Add new experience
        await addExperience(formData);
        alert('Experience added successfully!');
      }
      
      // Reset form and reload experiences
      resetForm();
      loadExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    }
  };
  
  // Handle edit button click
  const handleEdit = (experience) => {
    setFormData({
      name: experience.name,
      tahun: experience.tahun,
      description: experience.description,
      type: experience.type
    });
    setEditMode(true);
    setCurrentId(experience.id);
  };
  
  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id);
        alert('Experience deleted successfully!');
        loadExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Failed to delete experience');
      }
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      tahun: '',
      description: '',
      status: 'work'
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const renderExperienceTable = (statusExperiences, statusTitle) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{statusTitle}</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Tahun</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {statusExperiences.length > 0 ? (
            statusExperiences.map(experience => (
              <tr key={experience.id}>
                <td className="border border-gray-300 p-2">{experience.name}</td>
                <td className="border border-gray-300 p-2">{experience.tahun}</td>
                <td className="border border-gray-300 p-2">{experience.description}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 p-2 text-center">
                No {statusTitle.toLowerCase()} experiences found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Experiences</h2>
      
      {/* Form */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Tahun</label>
            <input
              type="text"
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1">type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            {editMode ? 'Update' : 'Simpan'}
          </button>
        </form>
      </div>
      
      {/* Show Data */}
      <div>
        <h3 className="text-lg font-medium mb-2">Show Data</h3>
        {renderExperienceTable(experiences.work, 'Work')}
        {renderExperienceTable(experiences.education, 'Education')}
      </div>
    </div>
  );
}