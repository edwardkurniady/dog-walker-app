module.exports.phoneNumber = (pn = '') => {
  return pn.slice(0, 3).replace(/^0|[+]?62/, '+62') + pn.slice(3);
};
