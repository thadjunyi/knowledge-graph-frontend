import { handleAPIRequest } from './BaseService';

export async function getGraph(search) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/getAll', params:{ 'search':search }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "getGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findNeighbors(search) {
  search = search.toString();
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

export async function findGraph(search, degree, blacklist) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findGraph', params:{ 'search':search, 'degree':degree, 'blacklist':blacklist }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

// export async function createCategory({ category, rules }) {
//   const { data, error } = await handleApiRequest({ url: `/category/${category}/rules`, method: 'POST', data: { rules }});
//   if (error) {
//     if (data && !data.ok) {
//       return { error: { failedRules: data.failed }};
//     }
//     return { error };
//   }
//   return {};
// }

// export async function addCategoryRules({ category, rules }) {
//   const { data, error } = await handleApiRequest({ url: `/category/${category}/rules`, method: 'POST', data: { rules }});
//   if (error) {
//     if (data && !data.ok) {
//       return { error: { failedRules: data.failed }};
//     }
//     return { error };
//   }
//   return {};
// }

// export async function deleteCategoryRules({ category, rules }) {
//   const { data, error } = await handleApiRequest({ url: `/category/${category}/rules`, method: 'DELETE', data: { rules }});
//   if (error) {
//     if (data && data.failed && data.failed.length) {
//       return { error: { failedRules: data.failed }};
//     }
//     return { error };
//   }
//   return {};
// }
