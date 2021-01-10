import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID)
};

export const logPageView = (page: string) => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};