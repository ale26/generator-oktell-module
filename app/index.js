'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var OktellModuleGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the magnificent OktellModule generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'moduleId',
      message: 'Enter module identifier (string)',
      validate: function(val) {
        if ( /^[a-z][a-z0-9-_]+$/i.test(val) ) {
          return true;
        } else {
          return "Module identifier should start with letter and can contain only digits, letters, '_' and '-'."
        }
      },
      filter: function(val) {
        return val.toLowerCase();
      }
    },
    {
      type: 'input',
      name: 'oktellHost',
      message: 'Enter your Oktell Server instance hostname (examples: 192.168.0.1, oktell.mydomain.com) ',
      validate: function(val) {
        return !!val;
      }
    }];

    this.prompt(prompts, function (props) {
      this.moduleId = props.moduleId;
      this.oktellHost = props.oktellHost;
      this.ctrlPrefix = this.moduleId.substr(0,1).toUpperCase() + this.moduleId.substr(1);

      done();
    }.bind(this));
  },

  writing: {

    gruntfile: function () {
      this.template('Gruntfile.js');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    git: function () {
      this.template('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    bowerJSON: function () {
      this.copy('bowerrc', '.bowerrc');
      this.template('_bower.json', 'bower.json');
    },

    module: function () {
      this.mkdir('module/www/images');
      this.directory('module');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = OktellModuleGenerator;
