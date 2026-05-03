export const getHealthStatus = () => ({
  status: "ok",
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
});
