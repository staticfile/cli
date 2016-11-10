var request = require('request')
  , colors = require('colors')
  , url = "https://api.staticfile.org/v1/search?count=10&q="
  , show_url = "https://api.staticfile.org/v1/packages/";

exports.search = function (keyword, cb) {
  request.get({url: url + encodeURIComponent(keyword), json: true}, function (err, response, data) {
    return cb(err, data);
  });
};

exports.get = function (keyword, cb) {
  request.get({url: url + encodeURIComponent(keyword), json: true}, function (err, response, data) {
    if (err) return cb(err);

    if (!data.libs) return cb(null, false);

    var matched_lib = false;
    var suggest = [];

    data.libs.forEach(function (lib) {
      if (lib.name.toLowerCase() == keyword.toLowerCase()) matched_lib = lib;
      suggest.push(lib.name);
    });

    return cb(null, matched_lib, suggest);
  });
};

exports.info = function (keyword, cb) {
  request.get({url: show_url + encodeURIComponent(keyword), json: true}, function (err, response, data) {
    if (err) return cb(err);

    if (data.hasOwnProperty('success') && !data.success) return cb(new Error("Package '" + keyword + "' not exist"));

    return cb(null, data);
  });
};

exports.error = function (e) {
  console.log("错误".redBG + " " + (e instanceof Object ? e.message : e));
};

exports.loading = function () {
  console.log("加载中...".grey);
};

exports.html = function (file) {
  var ext = exports.ext(file);
  switch (ext) {
    case "js":
      return '<script type="text/javascript" src="' + file + '"></script>';
      break;
    case 'css':
      return '<link type="text/css" rel="stylesheet" href="' + file + '"/>';
      break;
    default:
      return false;
  }
};

exports.jade = function (file) {
  var ext = exports.ext(file);
  switch (ext) {
    case "js":
      return 'script(type="text/javascript" src="' + file + '")';
      break;
    case 'css':
      return 'link(type="text/css" rel="stylesheet" href="' + file + '")';
      break;
    default:
      return false;
  }
};

exports.ext = function (filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i + 1);
};

exports.url = function (path, ssl) {
  ssl = ssl || false;

  return (ssl ? '//cdn.staticfile.org' : 'http://cdn.staticfile.org') + path;
};
