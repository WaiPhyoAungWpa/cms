import { PublicDashboard } from "../types/publicDashboard";

export async function getPublicDashboard(): Promise<PublicDashboard> {
  // TODO:
  // Replace with API call once backend is implemented.

    return {
        stats: {
            totalReaders: 18452,
            totalViews: 64931,
            publishedContent: 42,
            categories: 3,
        },

        monthlyViews: [
            { month: "Jan", views: 12850 },
            { month: "Feb", views: 15620 },
            { month: "Mar", views: 17380 },
            { month: "Apr", views: 21490 },
            { month: "May", views: 25710 },
            { month: "Jun", views: 28940 },
        ],

        lastUpdated: "16 Jul 2026",
        dataSource: "Frontend Sample Data",
    };
}