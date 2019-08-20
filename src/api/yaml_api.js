import {API_ROOT} from '../variables';

export const getBakedUrl = ({ url }) => url;

export const getLocalUrl = ({reference: filename}) => {
  const url = `http://localhost:5000/${filename}`;
  return url;
};

export const getExamplesId = () => {
  const url = API_ROOT;
  return fetch(url)
    .then(data => data.json())
    .then(data => data.ids);
};

export const getAnnotation = (index) => {
  const url = `${API_ROOT}${index}`;
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
