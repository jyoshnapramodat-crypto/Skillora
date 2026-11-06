import { calculateSkillProgress, formatDate } from './calculations';

/**
 * Escapes a cell value for standard CSV compatibility (RFC 4180).
 * Handles commas, double-quotes, and newlines safely.
 */
function escapeCSVValue(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If string contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers download of Skillora skills as a cleanly formatted CSV file.
 */
export function exportSkillsToCSV(skills = []) {
  if (!skills || skills.length === 0) {
    alert('No skills available to export.');
    return false;
  }

  const headers = [
    'Skill Name',
    'Category',
    'Description',
    'Completed Tasks',
    'Total Tasks',
    'Progress Percentage',
    'Status',
    'Start Date',
    'Last Updated'
  ];

  const rows = skills.map((skill) => {
    const stats = calculateSkillProgress(skill);
    return [
      escapeCSVValue(skill.name || 'Untitled Skill'),
      escapeCSVValue(skill.category || 'General'),
      escapeCSVValue(skill.description || ''),
      escapeCSVValue(stats.completedTasks),
      escapeCSVValue(stats.totalTasks),
      escapeCSVValue(`${stats.percentage}%`),
      escapeCSVValue(stats.status),
      escapeCSVValue(skill.startDate ? formatDate(skill.startDate) : 'N/A'),
      escapeCSVValue(skill.updatedAt ? formatDate(skill.updatedAt) : 'N/A')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Skillora_Skills_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

