'use strict';

const entities = require('./entities');
const regExpNames = new RegExp('(' + Object.keys(entities).join('|') + ')', 'g');
const predefinedEntities = ['&lt;', '&gt;', '&amp;', '&quot;', '&apos;'];

function getSymbol(type, entity) {
    if (type === 'name') {
        return entities[entity].characters;
    } else if (type === 'digit') {
        return String.fromCharCode(parseInt(entity.replace(/[&#;]/g, ''), 10));
    } else {
        return String.fromCharCode(parseInt(entity.replace(/[&#x;]/gi, ''), 16));
    }
}

module.exports = {
    /**
     * Find entities in text.
     *
     * @param {string} text
     * @param {Array} [ignore]
     *
     * @return {Array}
    */
    find: function(text, ignore) {
        const counters = {};
        const ignoredEntities = ignore || [];
        const result = [];

        function addCounter(type, $) {
            if(!counters[$]) {
                counters[$] = {count: 0, type: type};
            }

            counters[$].count++;
        }

        if (!text) {
            return result;
        }

        // entities as names
        text.replace(regExpNames, addCounter.bind(this, 'name'));

        // entities as digits
        text.replace(/&#(\d{1,6});/gi, addCounter.bind(this, 'digit'));

        // entities as hex
        text.replace(/&#x([\da-f]{1,6});/gi, addCounter.bind(this, 'hex'));

        Object.keys(counters).forEach(function(key) {
            if (predefinedEntities.indexOf(key) === -1 && ignoredEntities.indexOf(key) === -1) {
                result.push({
                    count: counters[key].count,
                    original: key,
                    replace: getSymbol(counters[key].type, key)
                });
            }
        });

        result.sort(function(a, b) {
            return a.original > b.original ? 1 : -1;
        });

        return result;
    },
    /**
     * Replace html entities on utf-8 symblos in text.
     *
     * @param {string} text
     * @param {Array} [ignore]
     *
     * @return {Array}
    */
    replace: function(text, ignore) {
        const ignoredEntities = ignore || [];

        if (!text) {
            return text;
        }

        // entities as names
        text = text.replace(regExpNames, function(entity) {
            if (predefinedEntities.indexOf(entity) === -1 && ignoredEntities.indexOf(entity) === -1) {
                return entities[entity].characters;
            }

            return entity;
        });

        // entities as digits
        text = text.replace(/&#(\d{1,6});/gi, function(entity) {
            if (predefinedEntities.indexOf(entity) === -1 && ignoredEntities.indexOf(entity) === -1) {
                return String.fromCharCode(parseInt(entity.replace(/[&#;]/g, ''), 10));
            }

            return entity;
        });

        // entities as hex
        text = text.replace(/&#x([\da-f]{1,6});/gi, function(entity) {
            if (predefinedEntities.indexOf(entity) === -1 && ignoredEntities.indexOf(entity) === -1) {
                return String.fromCharCode(parseInt(entity.replace(/[&#x;]/gi, ''), 16));
            }

            return entity;
        });

        return text;
    }
};
