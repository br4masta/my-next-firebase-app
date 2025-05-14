'use client';

import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import ExperienceTab from './components/ExperienceTab';
import SkillsTab from './components/SkillsTab';
import PortfolioTab from './components/PortfolioTab';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('experience');

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 justify-center">
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

  
