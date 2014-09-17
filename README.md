[![Build Status](https://secure.travis-ci.org/SlexAxton/Jed.png)](http://travis-ci.org/SlexAxton/Jed)

# Jed

*Gettext Style i18n for Modern JavaScript Apps*

For more info, please visit the docs site at <http://slexaxton.github.com/Jed>.

## You sure you don't want something more modern?

I also maintain [messageformat.js](https://github.com/SlexAxton/messageformat.js). If you don't specifically need a gettext implementation, I might suggest using MessageFormat instead, as it has better support for plurals/gender and has built-in locale data.


## Parsing Gettext Files

Jed doesn't include a Gettext file parser, but several third-party parsers exist that can have their output adapted for Jed.

#### Node

Just search the npm repository, there are several PO and MO file parsers available.

#### Browser

[Jed Gettext Parser](https://github.com/WrinklyNinja/jed-gettext-parser) is the only known browser MO file parser, and it also works in Node, and outputs Jed-compatible data directly.

[gettext.js](https://code.google.com/p/gettext-js) and [Pomo.js](https://github.com/cfv1984/pomo) both include browser-compatible PO file parsers.

## Todo

* Build time generation of plural form functions
* Web interface for building translation sets
* Code introspection for default values

## License

You may use this software under the WTFPL.

You may contribute to this software under the Dojo CLA - <http://dojofoundation.org/about/cla>


## Author

* Alex Sexton - @slexaxton - <http://alexsexton.com/>


## Credits

A good chunk of sanity checking was done against the gettext.js tests. That was written by:

* Joshua I. Miller

The sprintf implementation is from:

* Alexandru Marasteanu <alexaholic [at) gmail (dot] com>


## The name

The name jed.js is an homage to Jed Schmidt (<https://github.com/jed>) the JavaScript community member who is a japanese translator by day, and a "hobbyist" JavaScript programmer by night. Give your kids three character names and they'll probably get software named after them too.
