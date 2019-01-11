[![Build Status](https://travis-ci.org/hcodes/entity2utf8.png?branch=master)](https://travis-ci.org/hcodes/entity2utf8)
[![Coverage Status](https://img.shields.io/coveralls/hcodes/entity2utf8.svg?branch=master)](https://coveralls.io/r/hcodes/entity2utf8)
[![NPM Version](http://img.shields.io/npm/v/entity2utf8.svg?style=flat)](https://www.npmjs.org/package/entity2utf8)
[![NPM Downloads](https://img.shields.io/npm/dm/entity2utf8.svg?style=flat)](https://www.npmjs.org/package/entity2utf8)

entity2utf8
======
Find and replace HTML entities to UTF-8 symbols.

Ignore entities:
+ `&lt;`
+ `&gt;`
+ `&amp;`
+ `&quot;`
+ `&apos;`

## CLI
`npm install entity2utf8 -g`

`entity2utf8 mytext.txt`

`entity2utf8 mytext1.txt mytext2.txt mytext3.txt`

`entity2utf8 --ignore "&nbsp;,&raquo;" mytext1.txt`

`entity2utf8 --ignore "&nbsp;,&raquo;" --exts ".html,.htm" .`

`entity2utf8 --replace --ignore "&nbsp;,&raquo;" --exts ".html,.htm" .`

## License
MIT License
