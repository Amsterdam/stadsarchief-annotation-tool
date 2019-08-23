import {API_ROOT} from '../variables';

export const getBakedUrl = ({ url }) => url;


export const getLocalUrl = (filename) => {
  const url = `http://localhost:5000/${filename}`;
  return url;
};

export const getExamplesList = (filters={}) => {
  const params = new URLSearchParams();
  params.set('page_size', 50);
  // params.set('ordering', '-id');
  for (const [key, value] of Object.entries(filters)) {

    if (key === 'annotator') {
      // specialized filter
      if (value === 'both') {
        params.set('tags__key', 'confidence');
        params.set('annotations__author__username', 'ruurd');
      } else {
        params.set('annotations__author__username', value);
      }
    } else {
      // standard tag filter
      if (key == 'stadsdeel') {
        params.set('tags__key', 'stadsdeel_code');
      } else {
        params.set('tags__key', key);
      }
      params.set('tags__value', value);
    }
  }
  const url = `${API_ROOT}data/example/?${params.toString()}`;
  return fetch(url)
    .then(data => data.json());
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
