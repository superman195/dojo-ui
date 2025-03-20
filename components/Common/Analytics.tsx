import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export const initGA = (measurementId: string) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return;
  // }
  ReactGA.initialize(measurementId);
};

export const logPageView = () => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return;
  // }
  ReactGA.send({
    hitType: 'pageview',
    page: window.location.pathname + window.location.search,
  });
};

export const logEvent = (category: string, action: string, label?: string) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return;
  // }
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

const Analytics = () => {
  const router = useRouter();

  useEffect(() => {
    let GA_ID = 'G_XXX';
    if (process.env.NODE_ENV === 'production') {
      GA_ID = process.env.NEXT_PUBLIC_GA_TAG!;
    }
    initGA(GA_ID);

    // Log the initial page view
    logPageView();

    // Log page views on route changes
    const handleRouteChange = () => logPageView();
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
};

export default Analytics;
