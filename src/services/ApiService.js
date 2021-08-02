import { handleAPIRequest } from './BaseService';

export async function getAll() {
  const { response, error } = await handleAPIRequest(
    { url: '/search/getAll', method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "getAll": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function getAllRecommended() {
  const { response, error } = await handleAPIRequest(
    { url: '/search/getAllRecommended', method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "getAllRecommended": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findNeighbors(search) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findNeighbors', params:{ 'search':search }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findNeighbors": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findSearchGraph(search, degree) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findSearchGraph', params:{ 'search':search, 'degree':degree }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findSearchGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findRecommendGraph(search, degree) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findPageRankGraph', params:{ 'search':search, 'degree':degree }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findPageRankGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findLinkageGraph(search) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findLinkageGraph', params:{ 'search':search }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findLinkageGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findFocusGraph(search, typeFilter, nodesNum) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findFocusGraph', params:{ 'search':search, 'typeFilter':typeFilter, 'nodesNum':nodesNum }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findFocusGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}