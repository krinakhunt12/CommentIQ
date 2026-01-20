export interface CommentAnalysis {
    text: string;
    line_number: number;
    comment_type: string;
    quality_score: number;
    consistency_score: number;
    issues: string[];
    suggestions: string[];
}

export interface AnalysisResult {
    file_name: string;
    total_lines: number;
    code_lines: number;
    comment_lines: number;
    comment_ratio: number;
    overall_score: number;
    comments: CommentAnalysis[];
    summary: {
        total_comments: number;
        high_quality: number;
        medium_quality: number;
        low_quality: number;
        avg_comment_score: number;
        avg_consistency_score: number;
    };
}

export interface ProjectAnalysisResult {
    project_name: string;
    overall_score: number;
    files: AnalysisResult[];
    total_files: number;
}
