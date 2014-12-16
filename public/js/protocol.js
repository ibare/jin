var Protocol = {
  message: {}
};

(function() {

Protocol.defineMessage = function(name, specification) {

  if(Protocol.hasOwnProperty(name)) {
    throw new Error(name+' 메세지는 이미 정의되었습니다.');
  }

  Protocol[name] = function() {
    var message = {};

    // 기본 값으로 초기화
    Object.keys(specification).forEach(function(k) {
      switch(specification[k]) {
      case String: message[k] = ''; break;
      case Number: message[k] = 0; break;
      // 배열(ENUM)인 경우 첫 번째 값으로 초기화, 그렇지 않으면 null
      default: message[k] = Array.isArray(specification[k]) ? specification[k][0] : null; break;
      }
    });

    message.toString = function() {
      return JSON.stringify(message);
    };

    return message;
  };

  Object.keys(specification).forEach(function(k) {
    if(Array.isArray(specification[k])) {
      Protocol[name].type = specification[k].join(',');
      specification[k].forEach(function(m) {
        Protocol[name][m] = m;
      });
    } else {
      Protocol[name].type = specification[k];
    }
  });
};

})();

