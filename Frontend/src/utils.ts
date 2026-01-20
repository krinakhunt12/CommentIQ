import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProjectAnalysisResult, AnalysisResult } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
};

export const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Standard';
    return 'Critical Review';
};

export const getScoreBackground = (score: number): string => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.1)';
    if (score >= 50) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
};

/**
 * Generates and downloads a Markdown audit report
 */
export const downloadAuditReport = (project: ProjectAnalysisResult | AnalysisResult) => {
    let content = "";

    if ('project_name' in project) {
        // Project-wide report
        content += `# CommentIQ Audit Report: ${project.project_name}\n\n`;
        content += `## Overall Health Score: ${project.overall_score.toFixed(1)}%\n`;
        content += `Total Files Analyzed: ${project.total_files}\n\n`;
        content += `--- \n\n`;

        project.files.forEach(file => {
            content += renderFileSection(file);
        });
    } else {
        // Single file report
        content += `# CommentIQ Audit Report: ${project.file_name}\n\n`;
        content += renderFileSection(project);
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-report-${new Date().getTime()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const renderFileSection = (file: AnalysisResult) => {
    let section = `## File: ${file.file_name}\n`;
    section += `**Quality Score:** ${file.overall_score.toFixed(1)}%\n`;
    section += `- Total Lines: ${file.total_lines}\n`;
    section += `- Code Lines: ${file.code_lines}\n`;
    section += `- Comment Lines: ${file.comment_lines}\n`;
    section += `- Comment Ratio: ${file.comment_ratio.toFixed(2)}%\n\n`;

    if (file.comments.length > 0) {
        section += `### Identified Issues & Suggestions\n\n`;
        file.comments.forEach(comment => {
            if (comment.issues.length > 0) {
                section += `#### Line ${comment.line_number}: ${comment.comment_type}\n`;
                section += `**Issue:** ${comment.issues.join(', ')}\n`;
                if (comment.suggestions.length > 0) {
                    section += `**Suggestion:** ${comment.suggestions[0]}\n`;
                }
                section += `\n`;
            }
        });
    } else {
        section += `*No significant issues found in this module.*\n\n`;
    }

    section += `--- \n\n`;
    return section;
};
