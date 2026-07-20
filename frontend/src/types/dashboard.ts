export interface DashboardRecentContent {
    id: number;
    title: string;
    category: string;
    status: string;
    updatedAt: string;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

export interface MonthlyView {
    month: string;
    views: number;
}

export interface PopularContent {
    title: string;
    pagePath: string;
    views: number;
}

export interface TrafficSource {
    source: string;
    sessions: number;
}

export interface DashboardSummary {
    // CMS statistics
    totalCount: number;
    publishedCount: number;
    draftCount: number;
    softDeletedCount: number;

    // CMS data
    recentContents: DashboardRecentContent[];
    categoryDistribution: CategoryDistribution[];

    // Google Analytics
    totalReaders: number;
    totalViews: number;
    monthlyViews: MonthlyView[];
    popularContents: PopularContent[];
    trafficSources: TrafficSource[];

    // Metadata
    lastUpdated: string;
    dataSource: string;
}