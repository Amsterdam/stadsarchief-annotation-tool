export default (array) =>
  array.reduce((obj, item) => {
    obj[item.key] = item.value;
    return obj
  }, {});
