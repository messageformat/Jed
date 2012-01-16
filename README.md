# jed.js

*A gettext compatible i18n library for modern JavaScript Applications*

Jed offers the entire applicable GNU gettext spec'd set of functions in JavaScript. The api for gettext was written for a language ( C ) with no great support for function overloading, so Jed hopes to add some api love before it goes 1.0.

Many thanks to Joshua I. Miller - <unrtst@cpan.org> - who wrote `gettext.js` back in 2008. I was able to vet a lot of my ideas against his. Also most of the original test suite was ported from the test suite from his project -- jsgettext.berlios.de

## Why gettext?

Internationalization is hard. Sun and later GNU created gettext as a way to make things a little easier.

Many apps that try to internationalize start out with simple key replacements.

```html
<h1>{{i18n_helper "some_key"}}</h1>

en_us:
  some_key : "This is a title."
en_ca:
  some_key : "This is a title, eh."
```

That works for a little while, until you get into a situation where pluralization changes the structure of the sentence.

Consider: "I have a toaster" vs. "I have 3 toasters"

Some people choose to solve this with pre/postfix data:

``"I have the following amount of toasters: " + num_toasters`

This is not ideal from a UX standpoint, and it doesn't work in every language.

So some people try to do this logic themselves:

```javascript
if ( num_toasters === 1) {
  return i18n('single_toaster_key');
}
else {
  return i18n('plural_toaster_key');
}
```

That seems to be a good solution until you consider languages like Polish and Russian that have _much_ more complex rulesets for pluralization than `if not 1`. Splitting the logic on each language hardly makes it sane or decoupled, so that method is a bust.

**Gettext + a sprintf-like tool  solve these problems.**

`alert( sprintf( ngettext('I have one toaster.', 'I have %1$d toasters.', num_toasters), num_toasters ) )`

This would look up the translation for the 'I have one toaster' string, evaluate, the `num_toasters` value against it's `plural_forms` rule, choose the appropriate sprintf-able string to return, then the sprintf will sub in the correct data, and output a happy translated string. Since sprintf can handle argument reordering words can be mixed around based on languages own rules.

### Bonus

You should use gettext because it works, but also, most major translation support the delivery of `.po` files which are the input to gettext based apps. Different languages vary in their implementations, slightly, but for the most part, these `.po` files can be converted and used nearly untouched.

### References

Mozilla has a good write up on gettext here: https://developer.mozilla.org/en/gettext
The GNU spec is pretty big, but here: http://www.gnu.org/savannah-checkouts/gnu/gettext/manual/html_node/gettext.html

## Current Version

`0.5.0beta`

## Installation

### Node

`npm install jed`

Then in your app:

`var Jed = require('jed');`

### Webpage ( global ):

```html
<script src="jed.js"></script>
<script>
var i18n = new Jed({
  // Generally output by a .po file conversion
  locale_data : {
    "messages" : {
      "" : {
        "domain" : "messages",
        "lang"   : "en",
        "plural_forms" : ""
      },
      "some key" : [ null, "some value"]
    }
  },
  "domain" : "messages"
});

alert( i18n.gettext( "some key" ) ); // alerts "some value"
</script>
```

### AMD Module

```javascript
require(['jed'], function ( Jed ) {
  var i18n = new Jed({
    // Generally output by a .po file conversion
    locale_data : {
      "messages" : {
        "" : {
          "domain" : "messages",
          "lang"   : "en",
          "plural_forms" : ""
        },
        "some key" : [ null, "some value"]
      }
    },
    "domain" : "messages"
  });

  alert( i18n.gettext( "some key" ) ); // alerts "some value"
  });
});
```

## How to use it

The gnu gettext stuff defines 4 modifiers for gettext

* d **Domain** - maps to the domain property in the translation files
* c **Category** - ignored in Jed
* n **Plurals** - handles translations based on pluralization rules for specific languages
* p **Context** - used as translation key prefixes, usually for quick modifiers of the same translation

Note :: I took the same path as `gettext.js` and just ignore any 'Category' information. The methods are exposed but the information is ignored. I'd recommend not using them at all, but I figured I'd be as API compatible with gettext.js as possible.

These map to the properties in the translation files.

----

At its base, Jed exposes (nearly) every combination of these four letters as functions:

```javascript
gettext = function ( key )
dgettext = function ( domain, key )
dcgettext = function ( domain, key, category )
ngettext = function ( singular_key, plural_key, value )
dngettext = function ( domain, singular_ley, plural_key, value )
dcngettext = function ( domain, singular_key, plural_key, value, category )
pgettext = function ( context, key )
dpgettext = function ( domain, context, key )
npgettext = function ( context, singular_key, plural_key, value )
dnpgettext = function ( domain, context, singular_key, plural_key, value )
dcnpgettext = function ( domain, context, singular_key, plural_key, value, category )
```

In the code, every function ends up calling `dcnpgettext` since it's the most specific. It just handles the missing values in the correct manner.

`Jed` uses much of the api from gettext.js in order to offer a step up, and will hopefully offer new sugar after the core is vetted.

That means in order instantiate an object to call these functions, you need to create a new `Jed` instance:

```javascript
var i18n = new Jed( options );
```

Then you'll have the methods available to you. e.g. : `i18n.gettext( 'key' );`

The `options` object generally contains 1 or 2 keys: `domain` and `locale_data`

The `domain` setting is which group inside of `locale_data` that the keys will be looked up in.

The `locale_data` is the output from your po2json converter. The tests have a few good examples of what these can look like if you are in need of more examples. Here's on to boot:

```javascript
var locale_data_multi = {
  "messages_3": {
    "": {
      "domain": "messages_3",
      "lang": "en",
      "plural-forms": "nplurals=2; plural=(n != 1);"
    },
    "test": [null, "XXtestXX"],
    "test singular": ["test plural", "XXtestXX singular", "XXtestXX plural"],
    "context\u0004test": [null, "XXtestXX context"],
    "context\u0004test singular": ["test context plural", "XXtestXX context singular", "XXtestXX context plural"]
  },
  "messages_4": {
    "": {
      "domain": "messages_4",
      "lang": "en",
      "plural-forms": "nplurals=2; plural=(n != 1);"
    },
    "test": [null, "22test22"],
    "test singular": ["test plural", "22test22 singular", "22test22 plural"],
    "context\u0004test": [null, "22test22 context"],
    "context\u0004test singular": ["test context plural", "22test22 context singular", "22test22 context plural"]
  }
};

```

There are some other functions exposed as well:

### sprintf

This is the `sprintf` found at http://www.diveintojavascript.com/projects/javascript-sprintf

Courtesy of Alexandru Marasteanu.

It lives as both a 'static' method on the `Jed` function and on an individual instance. It is used for variable replacement after a translation happens.

The english translation returns:

```javascript
"There are %1$d %2$s crayons."
```

Then with sprintf, we can do:

```javascript
alert( Jed.sprintf( "I like your %1$s %2$s.", 'red', 'shirt' ) );
// This alerts "I like your red shirt."
```

But in spanish it would look more like this:

```javascript
alert( Jed.sprintf( "Me gusta tu %2$s %1$s.", 'roja', 'camisa' ) );
// This alerts "Me gusta tu camisa roja."
```

## Translation files (as json)

There are quite a few available .po to .json converters out there. Gettext .po files are standard output from most decent translation companies, as it's an old standard.

I currently use: http://jsgettext.berlios.de/doc/html/po2json.html

However, I'd like to add this functionality to a separate Jed module in a future version.

## License

You may use this software under the WTFPL.

You may contribute to this software under the Dojo CLA - <http://dojofoundation.org/about/cla>

## Tests

Mocha and expect.js are used and included.

```sh
cd /Path/To/jed.js
python -m SimpleHTTPServer 8000
```

Then visit <http://127.0.0.1:8000/test> in the browser of your choice.

## Contributors

* Alex Sexton

Many tests and some API copied from

* Joshua I. Miller

The sprintf capabilities from

* Alexandru Marasteanu <alexaholic [at) gmail (dot] com>

## The name

The name jed.js is an homage to Jed Schmidt - the JavaScript community member who is a japanese translator by day, and a "hobbyist" JavaScript programmer by night. Give your kids three character names and they'll probably get software named after them too.

Not coincidentally, his project "locale" ( <https://github.com/jed/locale> ) could be a good plug into jed.js.
