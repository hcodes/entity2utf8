'use strict';

const entity2utf8 = require('../lib/entity2utf8');
const assert = require('chai').assert;

describe('find()', function() {
    it('should find entities as name', function() {
        let res = entity2utf8.find('&nbsp;Hello&nbsp;world!&nbsp;');
        assert.equal(res.length, 1);
        assert.equal(res[0].count, 3);

        res = entity2utf8.find('&nsbp;Hello&nbsp;world!&nbsp;');
        assert.equal(res.length, 1);
        assert.equal(res[0].count, 2);
    });

    it('should find entities as digit', function() {
        const res = entity2utf8.find('&#160;Hello&#8212;world!&#171;');
        assert.equal(res.length, 3);
        assert.equal(res[0].count, 1);
        assert.equal(res[0].original, '&#160;');
        assert.equal(res[1].count, 1);
        assert.equal(res[1].original, '&#171;');
        assert.equal(res[2].count, 1);
        assert.equal(res[2].original, '&#8212;');
    });

    it('should find entities as hex digit', function() {
        const res = entity2utf8.find('&#x00A0;Hello&#x00A0;');
        assert.equal(res.length, 1);
        assert.equal(res[0].count, 2);
        assert.equal(res[0].original, '&#x00A0;');
    });

    it('should not find predefined entities', function() {
        const res = entity2utf8.find('&lt;Hello&gt;&nbsp;');
        assert.equal(res.length, 1);
        assert.equal(res[0].count, 1);
        assert.equal(res[0].original, '&nbsp;');
    });

    it('should ignore entities', function() {
        const res = entity2utf8.find('&lt;Hello&gt;&nbsp;&nbsp;', ['&nbsp;']);
        assert.equal(res.length, 0);
    });

    it('should return empty result', function() {
        const res = entity2utf8.find('');
        assert.equal(res.length, 0);
    });
});

describe('replace()', function() {
    it('should replace entities as name', function() {
        const res = entity2utf8.replace('&nbsp;Hello&nbsp;world!&nbsp;');
        assert.equal(res, '\u00A0Hello\u00A0world!\u00A0');
    });

    it('should replace entities as digit', function() {
        const res = entity2utf8.replace('&#160;Hello&#8212;world!&#171;');
        assert.equal(res, '\u00A0Hello\u2014world!\u00AB');
    });

    it('should replace entities as hex digit', function() {
        const res = entity2utf8.replace('&#x00A0;Hello&#x00A0;');
        assert.equal(res, '\u00A0Hello\u00A0');
    });

    it('should replace entities as name with predefined entities', function() {
        const res = entity2utf8.replace('&lt;&nbsp;Hello&nbsp;world!&nbsp;&gt;');
        assert.equal(res, '&lt;\u00A0Hello\u00A0world!\u00A0&gt;');
    });

    it('should replace entities as digit with ignored entities', function() {
        const res = entity2utf8.replace('&#160;Hello&#8212;world!&#171;', ['&#160;']);
        assert.equal(res, '&#160;Hello\u2014world!\u00AB');
    });

    it('should replace entities as hex digit with ignored entities', function() {
        const res = entity2utf8.replace('&#x00A0;Hello&#x00AB;', ['&#x00A0;']);
        assert.equal(res, '&#x00A0;Hello\u00AB');
    });

    it('should return empty result', function() {
        assert.equal(entity2utf8.replace(''), '');
    });
});
