import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import SkillCard from '../components/SkillCard';
import EmptyState from '../components/EmptyState';
import { PREDEFINED_CATEGORIES } from '../data/sampleData';
import { calculateSkillProgress } from '../utils/calculations';

/**
 * Skills Management page.
 * Demonstrates Dynamic Lists, Props, Controlled Inputs, Search & Filter pipelines, and State.
 */
export default function Skills({
  skills = [],
  customCategories = [],
  onOpenAddSkill,
  onOpenEditSkill,
  onDeleteSkill,
  onManageTasks
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [progressFilter, setProgressFilter] = useState('All'); // 'All' | 'Not Started' | 'In Progress' | 'Completed'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name-asc' | 'progress-desc' | 'progress-asc'

  const allCategories = ['All', ...PREDEFINED_CATEGORIES, ...customCategories];

  // Pipeline for searching, filtering, and sorting skills
  const filteredSkills = useMemo(() => {
    return skills
      .filter((skill) => {
        // Search by name or description
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = skill.name?.toLowerCase().includes(query);
          const matchDesc = skill.description?.toLowerCase().includes(query);
          if (!matchName && !matchDesc) return false;
        }

        // Filter by category
        if (selectedCategory !== 'All' && skill.category !== selectedCategory) {
          return false;
        }

        // Filter by calculated progress
        const stats = calculateSkillProgress(skill);
        if (progressFilter === 'Completed' && stats.percentage !== 100) return false;
        if (progressFilter === 'In Progress' && (stats.percentage === 0 || stats.percentage === 100)) return false;
        if (progressFilter === 'Not Started' && stats.percentage !== 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'progress-desc') {
          return calculateSkillProgress(b).percentage - calculateSkillProgress(a).percentage;
        }
        if (sortBy === 'progress-asc') {
          return calculateSkillProgress(a).percentage - calculateSkillProgress(b).percentage;
        }
        // Default: most recently updated/created
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
  }, [skills, searchQuery, selectedCategory, progressFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedCategory !== 'All' || progressFilter !== 'All' || sortBy !== 'recent';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setProgressFilter('All');
    setSortBy('recent');
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="font-editorial" style={{ fontSize: '1.9rem' }}>
            Skills & Task Engine
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Manage skills, define granular learning tasks, and view live percentage calculations.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddSkill}>
          <Plus size={16} /> Add New Skill
        </button>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="filter-toolbar">
        <div className="search-and-controls">
          {/* Search Input */}
          <div className="search-input-box">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              className="input-control"
              placeholder="Search skills by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Progress Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              className="input-control"
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="All">All Progress</option>
              <option value="Not Started">Not Started (0%)</option>
              <option value="In Progress">In Progress (1-99%)</option>
              <option value="Completed">Completed (100%)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} color="var(--text-muted)" />
            <select
              className="input-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="recent">Recently Updated</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="progress-desc">Progress (Highest)</option>
              <option value="progress-asc">Progress (Lowest)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilters}
              title="Reset search and filters"
            >
              <RotateCcw size={13} /> Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills Strip */}
        <div className="category-pill-list">
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={hasActiveFilters ? Filter : Layers}
          title={hasActiveFilters ? 'No matching skills found' : 'No skills in your portfolio yet'}
          description={
            hasActiveFilters
              ? 'Try relaxing your search terms or clearing your category and progress filters.'
              : 'Add your first learning skill with actionable tasks to start tracking your development.'
          }
          actionLabel={hasActiveFilters ? 'Clear Filters' : '+ Create Your First Skill'}
          onAction={hasActiveFilters ? handleClearFilters : onOpenAddSkill}
        />
      ) : (
        <div className="grid-3">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onManageTasks={onManageTasks}
              onEditSkill={onOpenEditSkill}
              onDeleteSkill={onDeleteSkill}
            />
          ))}
        </div>
      )}
    </div>
  );
}

