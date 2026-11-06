import { jsPDF } from 'jspdf';
import { calculateSkillProgress, formatDate } from './calculations';

/**
 * Generate a clean, elegant PDF portfolio document using jsPDF.
 */
export function exportPortfolioToPDF(profile, skills = [], goals = []) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    let y = 18;

    // Helper to check page break
    const ensureSpace = (neededHeight) => {
      if (y + neededHeight > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }
    };

    // --- Header Background Accent Bar ---
    doc.setFillColor(112, 83, 184); // Skillora Lavender-Purple (#7053b8)
    doc.rect(margin, y, pageWidth - margin * 2, 2.5, 'F');
    y += 8;

    // --- Brand Title ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(38, 35, 48); // Charcoal (#262330)
    doc.text('SKILLORA', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 100, 130);
    doc.text('A Smart Skill Progress Portfolio', margin + 48, y - 1);
    y += 10;

    // --- User Profile Section ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(38, 35, 48);
    doc.text(profile.name || 'Student Portfolio', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 85, 105);

    if (profile.education) {
      doc.text(`${profile.education} • ${profile.institution || 'University'}`, margin, y);
      y += 5;
    }
    if (profile.email) {
      doc.text(`Email: ${profile.email}`, margin, y);
      y += 5;
    }

    // Social Links
    const links = [];
    if (profile.linkedin) links.push(`LinkedIn: ${profile.linkedin}`);
    if (profile.github) links.push(`GitHub: ${profile.github}`);
    if (profile.portfolioUrl) links.push(`Web: ${profile.portfolioUrl}`);
    if (links.length > 0) {
      doc.setFontSize(8.5);
      doc.setTextColor(112, 83, 184);
      doc.text(links.join('   |   '), margin, y);
      y += 6;
    }

    // Bio
    if (profile.bio) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(70, 65, 80);
      const splitBio = doc.splitTextToSize(`"${profile.bio}"`, pageWidth - margin * 2);
      doc.text(splitBio, margin, y);
      y += splitBio.length * 4.8 + 4;
    }

    // Divider line
    doc.setDrawColor(220, 215, 230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // --- Skills Section ---
    ensureSpace(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(75, 47, 128); // Deep muted purple
    doc.text('VERIFIED SKILLS & LEARNING PROGRESS', margin, y);
    y += 7;

    const visibleSkillIds = profile.visibility?.selectedSkillIds || [];
    const skillsToPrint = skills.filter((s) => visibleSkillIds.length === 0 || visibleSkillIds.includes(s.id));

    if (skillsToPrint.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No public skills currently selected.', margin, y);
      y += 8;
    } else {
      skillsToPrint.forEach((skill, index) => {
        const stats = calculateSkillProgress(skill);
        ensureSpace(22);

        // Skill Card Background Box
        doc.setFillColor(250, 248, 252);
        doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 17, 2, 2, 'F');
        doc.setDrawColor(230, 225, 240);
        doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 17, 2, 2, 'S');

        // Skill Name & Category
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(38, 35, 48);
        doc.text(`${index + 1}. ${skill.name}`, margin + 3, y + 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(112, 83, 184);
        doc.text(`[${skill.category || 'General'}]`, margin + 85, y + 2);

        // Progress text and status
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(stats.percentage === 100 ? 46 : 90, stats.percentage === 100 ? 125 : 70, stats.percentage === 100 ? 50 : 140);
        doc.text(`${stats.percentage}% (${stats.completedTasks}/${stats.totalTasks} Tasks)`, pageWidth - margin - 42, y + 2);

        // Draw visual progress bar
        const barX = margin + 3;
        const barY = y + 6;
        const barWidth = pageWidth - margin * 2 - 6;
        const barHeight = 2.5;

        // Background bar
        doc.setFillColor(232, 225, 245);
        doc.roundedRect(barX, barY, barWidth, barHeight, 1, 1, 'F');

        // Filled bar
        if (stats.percentage > 0) {
          const filledWidth = (barWidth * stats.percentage) / 100;
          doc.setFillColor(112, 83, 184);
          doc.roundedRect(barX, barY, filledWidth, barHeight, 1, 1, 'F');
        }

        y += 20;
      });
    }

    y += 4;

    // --- Learning Goals Section ---
    ensureSpace(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(75, 47, 128);
    doc.text('STRATEGIC LEARNING GOALS', margin, y);
    y += 7;

    const visibleGoals = goals.slice(0, 4); // Top 4 goals
    if (visibleGoals.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text('No active learning goals specified.', margin, y);
      y += 8;
    } else {
      visibleGoals.forEach((goal) => {
        ensureSpace(14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(40, 35, 50);
        const statusMark = goal.status === 'Completed' ? '[✓ Completed]' : '[• Active]';
        doc.text(`${statusMark} ${goal.title}`, margin, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(110, 105, 125);
        doc.text(`Priority: ${goal.priority}  |  Target: ${formatDate(goal.targetDate)}`, margin + 6, y + 4.5);

        y += 11;
      });
    }

    // --- Footer Note ---
    ensureSpace(15);
    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 145, 160);
    doc.text(`Generated by Skillora Academic Portfolio Platform • Verified client-side export on ${todayStr}`, margin, pageHeight - 10);

    // Save and download PDF
    const safeName = (profile.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Skillora_Portfolio_${safeName}.pdf`);
    return true;
  } catch (error) {
    console.error('[Skillora] Failed to export PDF:', error);
    alert('Failed to generate PDF. Please check your browser console for details.');
    return false;
  }
}

