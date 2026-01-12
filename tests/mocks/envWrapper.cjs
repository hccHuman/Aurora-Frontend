/**
 * Mock Env Wrapper for Jest
 */
module.exports = {
    getEnv: (name) => process.env[name],
    PUBLIC_API_URL: process.env.PUBLIC_API_URL || "http://localhost:3000",
};
