'use client';

import React, { useState, useEffect } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/lib/firebase-service';

export default function SkillsTab() {
  // State for form data
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    status: 'current' // Default status
  });
  
  // State for skills lists by status
  const [skills, setSkills] = useState({
    current: [],
    ai: [],
    learning: []
  });
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Load skills on component mount
  useEffect(() => {
    loadSkills();
  }, []);
  
  // Function to load skills from Firestore
  const loadSkills = async () => {
    try {
      const allSkills = await getSkills();
      
      // Group skills by status
      const grouped = {
        current: allSkills.filter(skill => skill.status === 'current'),
        ai: allSkills.filter(skill => skill.status === 'ai'),
        learning: allSkills.filter(skill => skill.status === 'learning')
      };
      
      setSkills(grouped);
    } catch (error) {
      console.error('Error loading skills:', error);
      alert('Failed to load skills');
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
        // Update existing skill
        await updateSkill(currentId, formData);
        alert('Skill updated successfully!');
      } else {
        // Add new skill
        await addSkill(formData);
        alert('Skill added successfully!');
      }
      
      // Reset form and reload skills
      resetForm();
      loadSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };
  
  // Handle edit button click
  const handleEdit = (skill) => {
    setFormData({
      image: skill.image,
      name: skill.name,
      status: skill.status
    });
    setEditMode(true);
    setCurrentId(skill.id);
  };
  
  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(id);
        alert('Skill deleted successfully!');
        loadSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill');
      }
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      image: '',
      name: '',
      status: 'current'
    });
    setEditMode(false);
    setCurrentId(null);
  };
  
  // Render a skills table for a specific status
  const renderSkillsTable = (statusSkills, statusTitle) => (
    <div className="mb-6">
      <h4 className="text-md font-medium mb-2">{statusTitle}</h4>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {statusSkills.length > 0 ? (
            statusSkills.map(skill => (
              <tr key={skill.id}>
                <td className="border border-gray-300 p-2">{skill.image}</td>
                <td className="border border-gray-300 p-2">{skill.name}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 p-2 text-center">
                No skills found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Skills</h2>
      
      {/* Form */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
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
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="current">Current</option>
              <option value="ai">AI</option>
              <option value="learning">Learning</option>
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
        {renderSkillsTable(skills.current, 'Current')}
        {renderSkillsTable(skills.ai, 'AI')}
        {renderSkillsTable(skills.learning, 'Learning')}
      </div>
    </div>
  );
}