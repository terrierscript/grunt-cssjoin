/*
 * grunt-cssjoin
 * http://gruntjs.com/
 *
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var cssjoin = require('cssjoin');
module.exports = function(grunt) {

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('cssjoin', 'Merge css @import', function() {
    // TODO: ditch this when grunt v0.4 is released
    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = this.options(this, {
    });

    var done = this.async();
    console.log(this.files);
    this.files.forEach(function(file){
      var srcFiles = grunt.file.expandFiles(file.src);
      //this.file.dest = path.normalize(this.file.dest);
      grunt.util.async.forEachSeries(srcFiles, function(srcFile, next) {
        var newFileDest = file.dest;
        if (helpers.isIndividualDest(file.dest)) {
          var basePath = helpers.findBasePath(srcFiles, options.basePath);
          newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath, options.flatten);
        }
        cssjoin(srcFile, options, function(e,joinedCss){
          if(e) {
            done();
          }
          grunt.log.writeln('File ' + newFileDest.cyan + ' created.');
          grunt.file.write(newFileDest,joinedCss || '');
          next();
        }, function(err){
          done();
        });
        //console.log(joinedCss);
      }, function(){
        done();
      });
    });
  });
};