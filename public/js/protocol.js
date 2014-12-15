var Protocol = {
  message: {}
};

(function() {

Protocol.create = function(name, fields) {
  Protocol[name] = { fields: {} };

  Object.keys(fields).forEach(function(k) {
    // Check type
    if(!Protocol[name].fields.hasOwnProperty(k)) {
      Protocol[name].fields[k] = fields[k];
    }
  });

  Protocol[name].toString = function() {
    return JSON.stringify(Protocol[name].fields);
  }
};

})();

