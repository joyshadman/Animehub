const config = {
  // Production / deployed API URL (Render)
  serverUrl:
    import.meta.env.VITE_APP_SERVERURL ||
    "https://anime-api-itt4.onrender.com/api/v1",
  // Local development API URL
  localUrl: import.meta.env.VITE_APP_LOCALURL || "http://localhost:3030/api/v1",
  proxyUrl: import.meta.env.VITE_APP_PROXYURL,
};

export default config;
