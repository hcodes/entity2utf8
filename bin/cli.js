#!/usr/bin/env node

'use strict';

const fs = require('fs');
const isutf8 = require('isutf8');
const program = require('commander');

const entity2utf8 = require('../lib/entity2utf8');
const log = require('../lib/log');
const util = require('../lib/utils');

let files = [];

function comma(value) {
    return value.split(',').map(function(item) { return item.trim(); });
}

program
    .version(require('../package.json').version)
    .usage('[options] <file...>')
    .option('--exts <file extensions>',
        'List of file extensions separated with commas. Example: ".txt,.html"', comma, [])
    .option('--ignore <entities>',
        'List of entities separated with commas. Example: "&nbsp;,&raquo;,&shy;"', comma, [])
    .option('--replace', 'Replace entities to UTF-8 symbols in files')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}

program.args.forEach(function(arg) {
    if (fs.existsSync(arg)) {
        files = files.concat(util.findFiles(arg, program.exts));
    } else {
        log.error(arg + ': is not exists');
    }
});

files.forEach(function(file) {
    let content = fs.readFileSync(file);
    if(!isutf8(content)) {
        log.error(file + ' not UTF-8.');
        return;
    }

    content = content.toString('utf8');

    let result = entity2utf8.find(content, program.ignore);
    if (result.length) {
        if (program.replace) {
            result = entity2utf8.replace(content, program.ignore);
            fs.writeFileSync(file, result);
        } else {
            log.errorNewLine(file);
            log.error('Need replace:');

            result.forEach(function(item) {
                log.error(item.original + ' → "' + item.replace + '"' +
                    (item.count > 1 ? ', count: ' + item.count : ''));
            });
        }
    }
});

if (!log.hasErrors() && !program.replace) {
    log.log('No errors.');
}

process.exit(log.hasErrors() ? 1 : 0);
