import axios from 'axios';

let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
  baseUrl = '/apis';
}

export default async (url = '', data = {}, type = 'GET') => {
  type = type.toUpperCase();
  url = baseUrl + url;
  return new Promise((resolve, reject) => {
    axios({
      url,
      data,
      method: type
    })
      .then(response => {
        let result = response.data;
        if (typeof result !== 'object') {
          result = JSON.parse(result);
        }
        resolve(result);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};
