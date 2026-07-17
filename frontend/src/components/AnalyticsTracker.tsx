import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "../services/analyticsService";

export default function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(
            location.pathname + location.search
        );
    }, [location]);

    return null;
}