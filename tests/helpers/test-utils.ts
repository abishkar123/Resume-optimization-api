export const createMockRequest = (overrides = {}) => ({
  headers: {},
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockFile = (overrides = {}) => ({
  fieldname: "resume",
  originalname: "resume.pdf",
  encoding: "7bit",
  mimetype: "application/pdf",
  size: 1024,
  buffer: Buffer.from("mock file"),
  ...overrides,
});
