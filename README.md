[![Build Status](https://secure.travis-ci.org/SlexAxton/Jed.png)](http://travis-ci.org/SlexAxton/Jed)

# Jed

*Gettext Style i18n for Modern JavaScript Apps*

For more info, please visit the docs site at <http://slexaxton.github.com/Jed>.

## You sure you don't want something more modern?

Jed is feature complete in my opinion. I am happy to fix bugs, but generally am not interested in adding more to the library.

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

Jed is a member project of the [JavaScript Foundation](https://js.foundation/)

You may use this software under the MIT License.

## Contributor License Agreement

We require all contributions to be covered under the JS Foundation's [Contributor License Agreement](https://js.foundation/CLA/). This can be done electronically and essentially ensures that you are making it clear that your contributions are your contributions, you have the legal right to contribute and you are transferring the copyright of your works to the Dojo Foundation.

If you are an unfamiliar contributor to the committer assessing your pull request, it is best to make it clear how you are covered by a CLA in the notes of the pull request. The committer will verify your status.

If your GitHub user id you are submitting your pull request from differs from the e-mail address which you have signed your CLA under, you should specifically note what you have your CLA filed under (and for CCLA that you are listed under your company's authorised contributors).


## Author

* Alex Sexton - @slexaxton - <https://alexsexton.com/>


## Credits

A good chunk of sanity checking was done against the gettext.js tests. That was written by:

* Joshua I. Miller

The sprintf implementation is from:

* Alexandru Marasteanu <alexaholic [at) gmail (dot] com>


## The name

The name jed.js is an homage to Jed Schmidt (<https://github.com/jed>) the JavaScript community member who is a japanese translator by day, and a "hobbyist" JavaScript programmer by night. Give your kids three character names and they'll probably get software named after them too.
