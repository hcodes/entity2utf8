'use strict';

const fs = require('fs');
const pth = require('path');

module.exports = {
    /**
     * Is directory?
     *
     * @param {string} path
     * @return {boolean}
     */
    isDir: function(path) {
        return fs.statSync(path).isDirectory();
    },
    /**
     * Find files to search for typos.
     *
     * @param {Object[]} dir - Array of typos.
     * @param {string[]} fileExtensions
     * @return {Object[]}
     */
    findFiles: function(dir, fileExtensions) {
        const result = [];
        const find = function(path) {
                fs.readdirSync(path).forEach(function(el) {
                    var file = pth.resolve(path, el);
                    if(this.isDir(file)) {
                        find(file);
                    } else if(this.isReqFileExtension(file, fileExtensions)) {
                        result.push(file);
                    }
                }, this);
            }.bind(this);

        if(this.isDir(dir)) {
            find(dir);
        } else {
            result.push(dir);
        }

        return result;
    },
    /**
     * Is required file extension?
     *
     * @param {string} file
     * @param {string[]} fileExtensions
     *
     * @return {boolean}
     */
    isReqFileExtension: function(file, fileExtensions) {
        const ext = pth.extname(file);
        return !fileExtensions.length ||
            (fileExtensions.length === 1 && !fileExtensions[0]) ||
            fileExtensions.indexOf(ext) !== -1;
    }
};
