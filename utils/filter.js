module.exports = (payload) => {
  Object.keys(payload).forEach(p => {
    const value = payload[p];
    const isValueValid = 'numberboolean'.indexOf(typeof value) > -1;
    if (isValueValid || value) return;
    delete payload[p];
  });
};
