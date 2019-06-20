const path = require('path')
const through = require('through2')
const output = 'checkout.sh';
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;
const xml2js = require('xml2js');
const metadata = require ('../lib/utils/describe-metadata');

module.exports = (gulp, plugins,options) => {
  const branch = process.argv[process.argv.length-1];
  return cb => {
    let status = null;
    gulp.src(options.src+'/package.xml')
    .pipe(checkout(branch))
    .pipe(plugins.rename(output))
    .pipe(gulp.dest(options.repo))
    .on('end', cb);
  };
};

// TODO meta-xml

checkout = (branch) => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }

    const commandLines = new Set();
    commandLines.add('#!/bin/bash');
    parseStringAsync(file.contents.toString())
    .then(package=>{
      package.Package.types.forEach(type=>{
        type.members.forEach(member=>{
          commandLines.add(`git checkout ${branch} -- src/${metadata[type.name].directoryName}/${member.split('.')[0]}.${metadata[type.name].suffix}`)
          if(metadata[type.name].metaFile === true) {
            commandLines.add(`git checkout ${branch} -- src/${metadata[type.name].directoryName}/${member.split('.')[0]}.${metadata[type.name].suffix}-meta.xml`)
          }
        })
      })
      file.contents =  Buffer.from([...commandLines].join('\n'), 'utf8');
    })
    .then(()=>callback(null, file));
  });
};

const parseStringAsync = (xmlContent) => {
  const promise = new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(xmlContent.replace('\ufeff', ''), (err, result) => err && reject(err) || resolve(result));
  });
  return promise;
};