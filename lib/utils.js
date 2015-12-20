
var utils = {};

// detect object type
utils.type = function(obj) {
  return Object.prototype.toString.call(obj).split(' ')[1].replace(']', '');
};

utils.each = function(stack, handler) {
  var len = stack.length;

  // Array
  if (len) {
    for(var i = 0; i < len; i++) {
      if (handler.call(stack[i], stack[i], i) === false) break;
    }
  }
  // Object
  else if (typeof len === 'undefined') {
    for(var name in stack) {
      if (handler.call(stack[name], stack[name], name) === false) break;
    }
  }
};

// shallow copy
// utils.extend(target, obj1, obj2, ...)
utils.extend = function(target) {
  utils.each(arguments, function(source, index) {
    if (index > 0) {
      utils.each(source, function(value, key) {
        if (typeof value !== 'undefined') {
          target[key] = value;
        }
      });
    }
  });
};

// setter
utils.setter = function(target, name, value) {
  var nameType = utils.type(name);

  // setter(name, value)
  if (nameType === 'String') {
    if (typeof target[name] === 'undefined') {
      throw new Error('Invalid configuration name.');
    }

    if (typeof value === 'undefined') {
      throw new Error('Lack of a value corresponding to the name');
    }

    if (utils.type(value) === 'Object' && utils.type(target[name]) === 'Object') {
      utils.extend(target[name], value);
    } else {
      target[name] = value;
    }
  }
  // setter({...})
  else if (nameType === 'Object') {
    value = name;
    utils.extend(target, value);
  }
  // otherwise throws
  else {
    throw new Error('Invalid arguments');
  }
};

utils.sortAndUnique = function(lines) {
  var result = [];
  var lineHash = {};

  utils.each(lines, function (line) {
    if (!lineHash[line]) {
      result.push(line);
      lineHash[line] = true;
    }
  });

  return result.sort(function (a, b) {
    return a - b > 0
  });
};

// get file format
utils.getFileFormat = function(str) {
  var format = str.substr(str.lastIndexOf('.') + 1, str.length);
  return format;
};

module.exports = utils;