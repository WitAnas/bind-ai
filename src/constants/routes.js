const ROUTES = {
  HOME: {
    path: "/home",
    private: false,
  },
  CHAT: {
    path: "/",
    private: false,
  },
  AI_STUDIO: {
    path: process.env.NEXT_PUBLIC_AI_STUDIO_LINK,
    private: false,
  },
  CONNECT_DATA: {
    path: process.env.NEXT_PUBLIC_OTHER_TABS_NAV_LINK,
    private: false,
  },
  PLUGINS: {
    path: process.env.NEXT_PUBLIC_OTHER_TABS_NAV_LINK,
    private: false,
  },
  TRY_PREMIUM: {
    path: process.env.NEXT_PUBLIC_OTHER_TABS_NAV_LINK,
    private: false,
  },
  SIGN_IN: {
    path: "/signin",
    private: true,
  },
};

export const getPrivateRoutes = (pvt = true) => {
  return Object.values(ROUTES)
    .filter((route) => (pvt ? route.private : !route.private))
    .map((pvtRoute) => pvtRoute.path);
};

export const getAllRoutes = () => {
  return Object.values(ROUTES).map((pvtRoute) => pvtRoute.path);
};

export default ROUTES;
