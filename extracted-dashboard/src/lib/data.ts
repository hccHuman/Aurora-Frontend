import type { Endpoint, EndpointsToOperations } from '../types/entities';
import { API_URL } from '../constants';

export async function fetchData<Selected extends Endpoint>(endpoint: Selected) {
  const apiEndpoint = `${API_URL}${endpoint}`;
  const r = await fetch(apiEndpoint);
  if (!r.ok) throw new Error('Failed to fetch');
  return r.json() as Promise<any>;
}

export function url(path = '') {
  return `${import.meta.env.SITE || ''}${path}`;
}
