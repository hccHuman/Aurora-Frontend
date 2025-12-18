import * as picocolors from 'picocolors';

// Export default as full namespace to support default imports from modules
const defaultExport = picocolors && picocolors.default ? picocolors.default : picocolors;
export default defaultExport;
// Also re-export named exports to preserve compatibility
export * from 'picocolors';
