import {API_ROOT} from '../variables';

export const getBakedUrl = ({ url }) => url;


export const getLocalUrl = (filename) => {
  const url = `http://localhost:5000/${filename}`;
  console.log(url);
  return url;
};

export const getExamplesList = () => {
  const url = `${API_ROOT}data/example/?ordering=-id`;
  return fetch(url)
    .then(data => data.json())
    .then(data => data);
};

export const getAnnotation = (url) => {
  return fetch(url)
    .then(data => data.json());
};

export const putAnnotation = (id, value) => {
  const url = `${API_ROOT}${id}`;
  const data = JSON.stringify(value);
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: data
  })
    .then(response => response.json())
};
