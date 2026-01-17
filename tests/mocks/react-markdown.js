/**
 * Mock for react-markdown
 * Used in jest tests to avoid importing the real react-markdown library
 */

const React = require('react');

// Mock ReactMarkdown to render children as-is
const ReactMarkdown = ({ children }) => {
    return React.createElement('div', { className: 'markdown-content' }, children);
};

module.exports = ReactMarkdown;


