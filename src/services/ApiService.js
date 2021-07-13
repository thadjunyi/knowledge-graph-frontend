import { handleAPIRequest } from './BaseService';

export async function getGraph(search, filter) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/getAll', params:{ 'search':search, 'filter':filter }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "getGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findNeighbors(search, filter) {
  search = search.toString();
  const { response, error } = await handleAPIRequest(
    { url: '/search/findNeighbors', params:{ 'search':search, 'filter':filter }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findNeighbors": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findGraph(search, degree, filter) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findGraph', params:{ 'search':search, 'degree':degree, 'filter':filter }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}