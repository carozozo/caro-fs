module.exports = function (grunt) {
    'use strict';
    var pkgName = '<%= pkg.name %>';
    var pkgFile = pkgName + '.js';
    var coffeeDir = 'coffee/';
    var jsDir = 'js/';
    var testDir = 'test/';
    var nodeDir = 'node_modules/';
    var banner = '/*! ' + pkgName + ' - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\r\n';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            oneByOne: {
                options: {
                    bare: true
                },
                files: [{
                    expand: true,
                    cwd: coffeeDir,
                    src: ['{,*/}*.coffee'],
                    dest: jsDir,
                    rename: function (dest, src) {
                        return dest + '/' + src.replace(/\.coffee$/, '.js');
                    }
                }]
            },
            merge: {
                options: {
                    bare: true
                },
                files: {
                    '<%= pkg.name %>.js': [coffeeDir + pkgName + '.coffee', coffeeDir + 'lib/*.coffee']
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: [
                        nodeDir + 'coffee-script/register',
                        function () {
                            var cf = require('./caro-fs.js');
                        },
                        function () {
                            var chai = require('chai');
                            should = chai.should();
                        }
                    ]
                },
                src: [testDir + '*.coffee']
            }
        }
    });

    // coffee-script 轉 js
    grunt.loadNpmTasks('grunt-contrib-coffee');
    // unit test
    grunt.loadNpmTasks('grunt-mocha-test');

    // 套裝任務
    grunt.registerTask('default', ['coffee', 'test']);
    grunt.registerTask('test', ['mochaTest']);
};