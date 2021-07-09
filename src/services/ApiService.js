import { handleAPIRequest } from './BaseService';

export async function getGraph() {
  const { response, error } = await handleAPIRequest(
    { url: '/search/getAll', method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "getGraph": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findNeighbors(name) {
  const { response, error } = await handleAPIRequest(
    { url: '/search/findNeighbors', params:{ 'search':name }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findNeighbors": ` + error.message)
    return { error };
  }
  const data = response.data;
  return { data };
}

export async function findGraphHistory(searchHistory, degree) {
  console.log(searchHistory);
  console.log(degree);

  const { response, error } = await handleAPIRequest(
    { url: '/search/findGraphHistory', params:{ 'search':searchHistory, 'degree':degree }, method: 'GET' }
  );
  if (error) {
    console.log(`Error while executing API "findGraphHistory": ` + error.message)
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
