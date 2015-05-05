#!/usr/bin/env node

var entity2utf8 = require('../lib/entity2utf8'),
    log = require('../lib/log'),
    program = require('commander'),
    isutf8 = require('isutf8'),
    Q = require('q'),
    FS = require('q-io/fs');

program
    .version(require('../package.json').version)
    .usage('[options] <file...>')
    .option(
        '--ignore <entities>',
        'List of entities separated with commas. Example: "&nbsp;,&raquo;,&shy;"',
        function(value) {
            return value.split(',').map(function(item) { return item.trim(); });
        }, [])
    .parse(process.argv);

if(!program.args.length) {
    program.help();
}

Q.allSettled(program.args.map(function(file) {
    return FS.read(file, 'b')
        .then(function(content) {
            if(!isutf8(content)) {
                log.error(file + ' not UTF-8.');
                return;
            }

            var result = entity2utf8.find(content.toString('utf8'), program.ignore);
            if(result.length) {
                log.errorNewLine(file);
                log.error('Need replace:');

                result.forEach(function(item) {
                    log.error(item.original + ' → "' + item.replace + '"' +
                        (item.count > 1 ? ', count: ' + item.count : ''));
                });
            }
        }, function() {
            log.errorNewLine(file + ': No such file');
        });
})).then(function() {
    log.hasErrors() && log.log('No errors');
    process.exit(log.hasErrors() ? 1 : 0);
});
