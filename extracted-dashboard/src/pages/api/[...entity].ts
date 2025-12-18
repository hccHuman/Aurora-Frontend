import type { APIRoute } from 'astro';
import * as operations from '../../services/index.js';

export const endpointsToOperations = {
  products: operations.getProducts,
  users: operations.getUsers,
  sales: operations.getSales,
};

function parseTypeParam(endpoint: string | undefined) {
  if (!endpoint || !(endpoint in endpointsToOperations)) return undefined;
  return endpoint as keyof typeof endpointsToOperations;
}

export const get: APIRoute = ({ params }) => {
  const operationName = parseTypeParam(params.entity);
  if (!operationName) return new Response('404', { status: 404 });
  const body = endpointsToOperations[operationName]();
  return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export function getStaticPaths() {
  return Object.keys(endpointsToOperations).map((endpoint) => ({ params: { entity: endpoint } }));
}
