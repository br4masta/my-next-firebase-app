'use client';

import React, { useState, useEffect } from 'react';
import { 
  getExperiences, addExperience, updateExperience, deleteExperience,
  getSkills, addSkill, updateSkill, deleteSkill,
  getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  uploadImage, uploadMultipleImages
} from '@/lib/firebase-service';

export default function AdminPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button 
          className={`px-6 py-2 ${activeTab === 'experience' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('experience')}
        >
          experience
        </button>
        <button 
          className={`px-6 py-2 ${activeTab === 'skills' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('skills')}
        >
          skills
        </button>
        <button 
          className={`px-6 py-2 ${activeTab === 'portfolio' ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
          onClick={() => setActiveTab('portfolio')}
        >
          portfolio
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'experience' && <ExperienceTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
      </div>
    </div>
  );
}

// Experience Tab Component
function ExperienceTab() {
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
      status: experience.status
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

// Skills Tab Component
function SkillsTab() {
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

// Portfolio Tab Component
function PortfolioTab() {
  // State for form data
  const [formData, setFormData] = useState({
    sourceGambar: '',
    judul: '',
    category: '',
    href: '',
    linkDetail: '',
    modalContent: {
      images: [],
      role: '',
      description: '',
      skills: []
    }
  });
  
  // State for portfolio items
  const [portfolioItems, setPortfolioItems] = useState([]);
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State for expanded rows (for showing details)
  const [expandedRows, setExpandedRows] = useState({});
  
  // State for additional skills input
  const [newSkill, setNewSkill] = useState('');
  
  // State for new image URL
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // State for file uploads
  const [sourceFile, setSourceFile] = useState(null);
  const [contentFiles, setContentFiles] = useState([]);
  
  // Load portfolio items on component mount
  useEffect(() => {
    loadPortfolioItems();
  }, []);
  
  // Function to load portfolio items from Firestore
  const loadPortfolioItems = async () => {
    try {
      const data = await getPortfolioItems();
      setPortfolioItems(data);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
      alert('Failed to load portfolio items');
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested modalContent fields
    if (name.startsWith('modalContent.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        modalContent: {
          ...prev.modalContent,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'sourceGambar') {
      setSourceFile(files[0]);
    } else if (name === 'contentImages') {
      setContentFiles(files);
    }
  };
  
  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        modalContent: {
          ...prev.modalContent,
          skills: [...prev.modalContent.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      modalContent: {
        ...prev.modalContent,
        skills: prev.modalContent.skills.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updatedData = { ...formData };
      
      // Upload source image if provided
      if (sourceFile) {
        const sourceImageUrl = await uploadImage(
          sourceFile, 
          `portfolio/${Date.now()}_${sourceFile.name}`
        );
        updatedData.sourceGambar = sourceImageUrl;
      }
      
      // Upload content images if provided
      if (contentFiles.length > 0) {
        const contentImageUrls = await uploadMultipleImages(
          contentFiles,
          `portfolio/content/${Date.now()}`
        );
        updatedData.modalContent.images = contentImageUrls;
      }
      
      if (editMode) {
        // Update existing portfolio item
        await updatePortfolioItem(currentId, updatedData);
        alert('Portfolio item updated successfully!');
      } else {
        // Add new portfolio item
        await addPortfolioItem(updatedData);
        alert('Portfolio item added successfully!');
      }
      
      // Reset form and reload portfolio items
      resetForm();
      loadPortfolioItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      alert('Failed to save portfolio item');
    }
  };
  
  // Handle edit button click
  const handleEdit = (item) => {
    setFormData({
      sourceGambar: item.sourceGambar || '',
      judul: item.judul || '',
      category: item.category || '',
      href: item.href || '',
      linkDetail: item.linkDetail || '',
      modalContent: {
        images: item.modalContent?.images || [],
        role: item.modalContent?.role || '',
        description: item.modalContent?.description || '',
        skills: item.modalContent?.skills || []
      }
    });
    setEditMode(true);
    setCurrentId(item.id);
  };
  
  // Handle delete button click
  const handleDelete = async (id, imagePaths) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        // Collect all image paths to delete
        const allImagePaths = [
          imagePaths.sourceGambar,
          ...(imagePaths.modalContent?.images || [])
        ].filter(Boolean);
        
        await deletePortfolioItem(id, allImagePaths);
        alert('Portfolio item deleted successfully!');
        loadPortfolioItems();
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
        alert('Failed to delete portfolio item');
      }
    }
  };
  
  // Toggle expanded row for showing details
  const toggleExpandedRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      sourceGambar: '',
      judul: '',
      category: '',
      href: '',
      linkDetail: '',
      modalContent: {
        images: [],
        role: '',
        description: '',
        skills: []
      }
    });
    setEditMode(false);
    setCurrentId(null);
    setSourceFile(null);
    setContentFiles([]);
    setNewSkill('');
  };

  // Handle adding a new image URL
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        modalContent: {
          ...prev.modalContent,
          images: [...prev.modalContent.images, newImageUrl.trim()]
        }
      }));
      setNewImageUrl('');
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      modalContent: {
        ...prev.modalContent,
        images: prev.modalContent.images.filter((_, i) => i !== index)
      }
    }));
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Portfolio</h2>
      
      {/* Form */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Source Gambar</label>
            <input
              type="text"
              name="sourceGambar"
              value={formData.sourceGambar}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter image URL"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Judul</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Href</label>
            <input
              type="text"
              name="href"
              value={formData.href}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Link Detail</label>
            <input
              type="text"
              name="linkDetail"
              value={formData.linkDetail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Content Images</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Image
              </button>
            </div>
            {formData.modalContent.images.length > 0 && (
              <div className="space-y-2">
                {formData.modalContent.images.map((image, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={image}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 rounded bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Role</label>
            <input
              type="text"
              name="modalContent.role"
              value={formData.modalContent.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="modalContent.description"
              value={formData.modalContent.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Skills</label>
            <div className="flex">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded-r"
              >
                Add Skill
              </button>
            </div>
            
            {formData.modalContent.skills.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Current skills:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.modalContent.skills.map((skill, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Source Gambar</th>
              <th className="border border-gray-300 p-2">Judul</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Href</th>
              <th className="border border-gray-300 p-2">Link Detail</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {portfolioItems.length > 0 ? (
              portfolioItems.map(item => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td className="border border-gray-300 p-2">
                      {item.sourceGambar && (
                        <span className="text-sm">{item.sourceGambar.substring(0, 30)}...</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">{item.judul}</td>
                    <td className="border border-gray-300 p-2">{item.category}</td>
                    <td className="border border-gray-300 p-2">
                      {item.href && (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          Link
                        </a>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.linkDetail && (
                        <a href={item.linkDetail} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          Detail
                        </a>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.modalContent?.description && (
                        <span className="text-sm">{item.modalContent.description.substring(0, 50)}...</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => toggleExpandedRow(item.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                      >
                        {expandedRows[item.id] ? 'Hide Details' : 'Show Details'}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, {
                          sourceGambar: item.sourceGambar,
                          modalContent: item.modalContent
                        })}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded row for details */}
                  {expandedRows[item.id] && (
                    <tr>
                      <td colSpan="7" className="border border-gray-300 p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Images */}
                          <div>
                            <h5 className="font-medium mb-2">Images:</h5>
                            {item.modalContent?.images && item.modalContent.images.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {item.modalContent.images.map((img, idx) => (
                                  <li key={idx} className="mb-1">
                                    <a href={img} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                      Image {idx + 1}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No images available</p>
                            )}
                          </div>
                          
                          {/* Other details */}
                          <div>
                            <div className="mb-3">
                              <h5 className="font-medium">Role:</h5>
                              <p>{item.modalContent?.role || 'N/A'}</p>
                            </div>
                            
                            <div className="mb-3">
                              <h5 className="font-medium">Description:</h5>
                              <p>{item.modalContent?.description || 'N/A'}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-1">Skills:</h5>
                              {item.modalContent?.skills && item.modalContent.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {item.modalContent.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p>No skills listed</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border border-gray-300 p-2 text-center">
                  No portfolio items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

  
