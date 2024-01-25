export const setTypes = (type) => {
  return [`${type}_REQUEST`, `${type}_SUCCESS`, `${type}_FAILED`];
};

export const appendRequest = (type) => {
  return `${type}_REQUEST`;
};

export const appendSuccess = (type) => {
  return `${type}_SUCCESS`;
};

export const appendFailed = (type) => {
  return `${type}_FAILED`;
};

export const LOGIN = 'LOGIN';