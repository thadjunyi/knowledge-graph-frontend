import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8080/v1";

export async function handleAPIRequest(requestCfg) {
//   console.log(requestCfg)
  const response = await axios.request(requestCfg)
      .then(response => {
          if (response) {
              // console.log(`Response status: [${response.status}] URL: [${requestCfg.url}]`)
              if (response.status < 400) {
                  return { response: response }
              }
              else if (response.status === 401 || response.status === 403) {
              } else {
                  return { error: response }
              }
          }
      });
      // console.log(response)
      return response;
}