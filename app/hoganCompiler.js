// Dependencies
var hogan = require('hogan');
var fs = require('fs');
var async = require('async');
require('sugar');

// Constants
var templateDir = __dirname + '/../templates';

// Utility functions
var compileAllTemplates = function(callback) {
  var results = "T={};";

  fs.readdir(templateDir, function(err, files) {
    if(err) return callback(err);

    var compileFile = function(file, done) {
      fs.readFile(templateDir + '/' + file, function(err, contents) {
        if(err) return done(err);

        var compiled = hogan.compile(contents.toString(), {asString : true});
        var name = file.split('.').first();
        results = results + "\nT['" + name + "']=" + compiled;
        done();
      });
    };

    async.forEach(files, compileFile, function(err) {
      if(err) return callback(err);
      callback(null, results);
    });
  });
};

// Exports
exports.getAll = function(req, res, next) {
  compileAllTemplates(function(err, compiledTemplates) {
    if(err) return next(err);

    res.contentType('text/javascript');
    res.send(compiledTemplates);
  });
};