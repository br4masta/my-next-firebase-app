'use client';

import React, { useState, useEffect } from 'react';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/firebase-service';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableTableRow component
const SortableTableRow = ({ experience, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="border border-gray-300 p-2">{experience.name}</td>
      <td className="border border-gray-300 p-2">{experience.tahun}</td>
      <td className="border border-gray-300 p-2">{experience.description}</td>
      <td className="border border-gray-300 p-2">
        <button
          onClick={() => onEdit(experience)}
          className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(experience.id)}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </td>
      <td className="border border-gray-300 p-2">
        <button {...attributes} {...listeners} className="cursor-move px-2">
          ⋮⋮
        </button>
      </td>
    </tr>
  );
};

export default function ExperienceTab() {
  const [formData, setFormData] = useState({
    name: '',
    tahun: '',
    description: '',
    type: 'work',
    position: 0
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
      // Group experiences by type and sort by position
      const grouped = {
        work: data.filter(exp => exp.type === 'work').sort((a, b) => a.position - b.position),
        education: data.filter(exp => exp.type === 'education').sort((a, b) => a.position - b.position)
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
      const position = experiences[formData.type].length; // New items go to the end
      const dataToSave = { ...formData, position };
      
      if (editMode) {
        await updateExperience(currentId, dataToSave);
        alert('Experience updated successfully!');
      } else {
        await addExperience(dataToSave);
        alert('Experience added successfully!');
      }
      
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
      type: experience.type,
      position: experience.position
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
      type: 'work',
      position: 0
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event, type) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = experiences[type].findIndex(exp => exp.id === active.id);
      const newIndex = experiences[type].findIndex(exp => exp.id === over.id);
      
      const newExperiences = {
        ...experiences,
        [type]: arrayMove(experiences[type], oldIndex, newIndex)
      };
      
      // Update positions in the database
      const updatedExperiences = newExperiences[type].map((exp, index) => ({
        ...exp,
        position: index
      }));
      
      // Update state
      setExperiences(newExperiences);
      
      // Update positions in database
      for (const exp of updatedExperiences) {
        await updateExperience(exp.id, { ...exp });
      }
    }
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
            <th className="border border-gray-300 p-2">Drag</th>
          </tr>
        </thead>
        <tbody>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, statusTitle.toLowerCase())}
          >
            <SortableContext
              items={statusExperiences.map(exp => exp.id)}
              strategy={verticalListSortingStrategy}
            >
              {statusExperiences.length > 0 ? (
                statusExperiences.map(experience => (
                  <SortableTableRow
                    key={experience.id}
                    experience={experience}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border border-gray-300 p-2 text-center">
                    No {statusTitle.toLowerCase()} experiences found
                  </td>
                </tr>
              )}
            </SortableContext>
          </DndContext>
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