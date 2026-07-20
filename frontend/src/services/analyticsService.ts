import ReactGA from "react-ga4";

const measurementId =
    import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initializeAnalytics() {
    if (!measurementId) {
        if (import.meta.env.DEV) {
            console.warn(
                "Google Analytics Measurement ID is missing."
            );
        }
        return;
    }

    ReactGA.initialize(measurementId);
}

export function trackPageView(path: string) {
    if (!measurementId) {
        return;
    }

    ReactGA.send({
        hitType: "pageview",
        page: path,
    });
}