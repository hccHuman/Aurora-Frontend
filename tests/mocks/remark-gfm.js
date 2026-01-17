/**
 * Mock for remark-gfm
 * Used in jest tests to avoid importing the real remark-gfm plugin
 */

const remarkGfm = () => {
    return (tree) => tree;
};

module.exports = remarkGfm;

