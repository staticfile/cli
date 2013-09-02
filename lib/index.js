var request = require('request')
  , colors = require('colors')
  , url = "http://api.staticfile.org/v1/search?count=10&q=";

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

    data.libs.forEach(function (lib) {
      if (lib.name.toLowerCase() == keyword.toLowerCase()) matched_lib = lib;
    });

    return cb(null, matched_lib);
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
      return '<link type="text/css" href="' + file + '"/>';
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

  return (ssl ? '//dn-staticfile.qbox.me' : 'http://cdn.staticfile.org') + path;
};