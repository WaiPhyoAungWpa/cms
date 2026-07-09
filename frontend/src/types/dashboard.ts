export interface DashboardRecentContent {
  id: number;
  title: string;
  category: string;
  status: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  softDeletedCount: number;
  recentContents: DashboardRecentContent[];
}