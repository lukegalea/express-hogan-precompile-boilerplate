// Dependencies
var im = require('imagemagick');
require('sugar');

// Utility Functions
var getImage = function(uri, callback) {
    request({
      encoding: 'binary',
      uri: uri,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, body);
        } else {
            callback(error, null);
        }
    });
};

// Exports
exports.loadOriginalFilter = function(req, res, next) {
  var original = req.param('src');
  getImage(original, function(err, img) {
    if (err)  return next(err);
    if (!img) return next('No original image');

    req.originalImage = img;
    next();
  });
  
};

exports.cropResize = function(req, res, next) {
  var width = req.param('width');
  var height = req.param('height');

  im.resize({
    srcData: req.originalImage,
    strip: false,
    width: width,
    height: height,
    customArgs: [
      "-gravity", "center",
      "-extent", width + "x" + height,
    ]
  });
};