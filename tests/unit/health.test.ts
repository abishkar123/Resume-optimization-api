import { getHealthStatus } from "../../src/health";

describe("Health Endpoint", () => {
  it("returns container health without requiring downstream services", () => {
    const health = getHealthStatus();

    expect(health.status).toBe("ok");
    expect(typeof health.uptime).toBe("number");
    expect(new Date(health.timestamp).toString()).not.toBe("Invalid Date");
  });
});
