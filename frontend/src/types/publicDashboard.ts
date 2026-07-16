export interface MonthlyView {
    month: string;
    views: number;
}

export interface CommunityStats {
    totalReaders: number;
    totalViews: number;
    publishedContent: number;
    categories: number;
}

export interface PublicDashboard {
    stats: CommunityStats;
    monthlyViews: MonthlyView[];

    lastUpdated: string;
    dataSource: string;
}