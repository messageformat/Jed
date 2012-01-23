(function (Jed){

  describe("Property Checks", function () {
    it("should exist", function () {
      expect( Jed ).to.be.ok();
    });

    it("should have a context delimiter as per the gettext spec", function () {
      expect( Jed.context_delimiter ).to.be( "\u0004" );
      expect( Jed.context_delimiter ).to.be( String.fromCharCode( 4 ) );
    });
  });

  // Group tests that need similar data
  (function () {
    var locale_data = {
      "messages" : {
        "" : { 
          "domain"        : "messages",
          "lang"          : "en",
          "plural-forms"  : "nplurals=2; plural=(n != 1);"
        },
        "test" : [null, "test_translation_output"]
      }
    };

    var locale_data2 = {
      "some_domain" : {
        "" : { 
          "domain"        : "some_domain",
          "lang"          : "en",
          "plural-forms"  : "nplurals=2; plural=(n != 1);"
        },
        "test" : [null, "test_translation_output2"],
        "zero length translation" : [ null, "" ]
      }
    };

    var i18n = new Jed({
      "domain" : "messages",
      "locale_data" : locale_data
    });

    var i18n_2 = new Jed({
      "domain" : "some_domain",
      "locale_data" : locale_data2
    });

    // Standard shorthand function
    function _(msgid) {
      return i18n_2.gettext(msgid);
    }

    // Actual tests
    describe("Instantiation", function () {
      it("should exist", function () {
        expect( i18n ).to.be.ok();
        expect( i18n_2 ).to.be.ok();
        expect( _ ).to.be.ok();
      });
    });

    describe("Basic", function () {
      it("should translate a key that exists in the translation", function () {
        expect( i18n.gettext('test') ).to.be( 'test_translation_output' );
      });

      it("should just pass through strings that aren't translatable", function () {
        expect( i18n.gettext('missing') ).to.be( 'missing' );
      });

      it("should allow you to wrap it as a shorthand function", function () {
        expect( _('test') ).to.be( 'test_translation_output2' );
        expect( _('missing') ).to.be( 'missing' );
      });

      it("should have identical output for wrapped and non-wrapped instances", function () {
        expect( _('test') ).to.be( i18n_2.gettext('test') );
        expect( _('missing') ).to.be( i18n_2.gettext('missing') );
      });

      it("should not allow you to use domains that don't exist", function () {
        function badCreate() {
          var x = new Jed({
            "domain" : "missing_domain",
            "locale_data" : locale_data
          });
          return x;
        }
        expect( badCreate ).to.throwException();
      });

      it("should just pass through translations that are empty strings", function () {
        expect( _('zero length translation') ).to.be('zero length translation' );
      });
    });
  })();

  (function () {
    var locale_data = {
      "messages_1": {
        "": {
          "domain": "messages_1",
          "lang": "en",
          "plural-forms": "nplurals=2; plural=(n != 1);"
        },
        "test": [null, "XXtestXX"],
        "test singular": ["test plural", "XXtestXX singular", "XXtestXX plural"],
        "context\u0004test": [null, "XXtestXX context"],
        "context\u0004test singular": ["test context plural", "XXtestXX context singular", "XXtestXX context plural"]
      },
      "messages_2": {
        "": {
          "domain": "messages_2",
          "lang": "en",
          "plural-forms": "nplurals=2; plural=(n != 1);"
        },
        "test": [null, "22test22"],
        "test singular": ["test plural", "22test22 singular", "22test22 plural"],
        "context\u0004test": [null, "22test22 context"],
        "context\u0004test singular": ["test context plural", "22test22 context singular", "22test22 context plural"]
      }
    };

    describe("Domain", function () {
      var i18n1 = new Jed({
        domain : "messages_1",
        locale_data : locale_data
      });

      var i18n_2 = new Jed({
        domain : "messages_2",
        locale_data : locale_data
      });

      // No default domain
      var i18n_3 = new Jed({
        locale_data : locale_data
      });

      it("should use the correct domain when there are multiple", function () {
        expect( i18n1.gettext('test') ).to.be('XXtestXX');
        expect( i18n_2.gettext('test') ).to.be('22test22');
      });

      it("should still pass through non-existent keys", function () {
        expect( i18n1.gettext('nope') ).to.be('nope');
        expect( i18n_2.gettext('nope again') ).to.be('nope again');
      });

      it("should reveal the current domain on any instance", function () {
        expect( i18n1.textdomain() ).to.be( 'messages_1' );
        expect( i18n_2.textdomain() ).to.be( 'messages_2' );
      });

      it("should use `messages` as the default domain if none given", function () {
        expect( i18n_3.textdomain() ).to.be('messages');
      });

      it("should allow on the fly domain switching", function () {
        // Switch these up
        i18n1.textdomain('messages_2');
        i18n_2.textdomain('messages_1');

        expect( i18n1.gettext('test') ).to.be('22test22');
        expect( i18n_2.gettext('test') ).to.be('XXtestXX');
        expect( i18n1.textdomain() ).to.be( 'messages_2' );
        expect( i18n_2.textdomain() ).to.be( 'messages_1' );
      });

      describe("#dgettext", function () {
        it("should have the dgettext function", function () {
          expect( i18n_3.dgettext ).to.be.ok();
        });

        it("should allow you to call the domain on the fly", function () {
          expect( i18n_3.dgettext('messages_1', 'test') ).to.be('XXtestXX');
          expect( i18n_3.dgettext('messages_2', 'test') ).to.be('22test22');
        });

        it("should pass through non-existent keys", function () {
          expect( i18n_3.dgettext('messages_1', 'nope') ).to.be('nope');
          expect( i18n_3.dgettext('messages_2', 'nope again') ).to.be('nope again');
        });
      });

      describe("#dcgettext", function () {
        var i18n_4 = new Jed({
          locale_data : locale_data
        });

        it("should have the dcgettext function", function () {
          expect( i18n_4.dcgettext ).to.be.ok();
        });

        it("should ignore categories altogether", function () {
          expect( i18n_4.dcgettext('messages_1', 'test', 'A_CATEGORY') ).to.be('XXtestXX');
        });
      });
    });

    describe("Pluralization", function () {
      var locale_data1 = {
        "plural_test": {
          "": {
            "domain": "plural_test",
            "lang": "en",
            "plural-forms": "nplurals=2; plural=(n != 1);"
          },
          "test singular": [null, "XXtestXX"],
          "test plural %n": ["test plural %n", "XXtestXXs %n", "XXtestXXp %n"],
          "context\u0004test context": [null, "XXtestXXcontext"],
          "test2": [null, "XXtest2XX"],
          "zero length translation": [null, ""],
          "context\u0004test2": [null, "XXtest2XXcontext"],
          "Not translated plural": [null, "asdf", "asdf"], // this should never hit, since it's msgid2
          "context\u0004context plural %n": ["plural %n", "XXcpXX singular %n", "XXcpXX plural %n"]
        }
      };

      var locale_data2 = {
        "plural_test2": {
          "": {
            "domain": "plural_test2",
            "lang": "sl",
            // actual Slovenian pluralization rules
            "plural_forms": "nplurals=4; plural=(n==1 ? 0 : n%10==2 ? 1 : n%10==3 || n%10==4 ? 2 : 3);"
          },
          "Singular" : [ "Plural",  "Numerus 0", "Numerus 1", "Numerus 2", "Numerus 3" ]
        }
      };

      var i18n = new Jed({
        domain: "plural_test",
        locale_data: locale_data1
      });

      var i18n_2 = new Jed({
        domain: "plural_test2",
        locale_data: locale_data2
      });

      describe("#ngettext", function () {

        it("should have a ngettext function", function () {
          expect( i18n.ngettext ).to.be.ok();
        });

        it("should choose the correct pluralization translation", function () {
          expect( i18n.ngettext('test plural %n', 'test plural %n', 1) ).to.be( 'XXtestXXs %n' );
          expect( i18n.ngettext('test plural %n', 'test plural %n', 2) ).to.be( 'XXtestXXp %n' );
          expect( i18n.ngettext('test plural %n', 'test plural %n ZZ', 0) ).to.be( 'XXtestXXp %n' );
        });

        it("should still pass through on plurals", function () {
          expect(i18n.ngettext('Not translated', 'Not translated plural', 1) ).to.be( 'Not translated' );
          expect(i18n.ngettext('Not translated', 'Not translated plural', 2) ).to.be( 'Not translated plural' );
          expect(i18n.ngettext('Not translated', 'Not translated plural', 0) ).to.be( 'Not translated plural' ); 
        });

        it("should be able to parse complex pluralization rules", function () {
          var strings = ['Singular', 'Plural'];
          for (var i=0; i<=40; i++) {
            var translation = i18n_2.ngettext(strings[0], strings[1], i);
            var plural = ((i == 1) ? 0 :
                          (i % 10 == 2) ? 1 :
                            (i % 10 == 3 || i % 10 == 4) ? 2 : 3);

            expect(translation).to.be( 'Numerus ' + plural );
          }
        });
      });

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

      describe("#dngettext", function () {
        var i18n = new Jed({
          locale_data : locale_data_multi
        });

        it("should have a dngettext function", function () {
          expect( i18n.dngettext).to.be.ok();
        });

        it("should pluralize correctly, based on domain rules", function () {
          expect(i18n.dngettext('messages_3', 'test singular', 'test plural', 1)).to.be('XXtestXX singular');
          expect(i18n.dngettext('messages_3', 'test singular', 'test plural', 2)).to.be('XXtestXX plural');
          expect(i18n.dngettext('messages_3', 'test singular', 'test plural', 0)).to.be('XXtestXX plural');

          expect(i18n.dngettext('messages_4', 'test singular', 'test plural', 1)).to.be('22test22 singular');
          expect(i18n.dngettext('messages_4', 'test singular', 'test plural', 2)).to.be('22test22 plural');
          expect(i18n.dngettext('messages_4', 'test singular', 'test plural', 0)).to.be('22test22 plural');
        });

        it("should passthrough non-found keys regardless of pluralization addition", function (){
          expect(i18n.dngettext('messages_3', 'Not translated', 'Not translated plural', 1)).to.be('Not translated');
          expect(i18n.dngettext('messages_3', 'Not translated', 'Not translated plural', 2)).to.be('Not translated plural');
          expect(i18n.dngettext('messages_3', 'Not translated', 'Not translated plural', 0)).to.be('Not translated plural');

          expect(i18n.dngettext('messages_4', 'Not translated', 'Not translated plural', 1)).to.be('Not translated');
          expect(i18n.dngettext('messages_4', 'Not translated', 'Not translated plural', 2)).to.be('Not translated plural');
          expect(i18n.dngettext('messages_4', 'Not translated', 'Not translated plural', 0)).to.be('Not translated plural');
        });
      });

      describe("#dcngettext", function () {
        var i18n = new Jed({
          locale_data : locale_data_multi
        });

        it("should more or less ignore the category", function () {
          expect(i18n.dcngettext('messages_3', 'test singular', 'test plural', 1, 'LC_MESSAGES')).to.be('XXtestXX singular');
          expect(i18n.dcngettext('messages_3', 'test singular', 'test plural', 2, 'LC_MESSAGES')).to.be('XXtestXX plural');
          expect(i18n.dcngettext('messages_3', 'test singular', 'test plural', 0, 'LC_MESSAGES')).to.be('XXtestXX plural');

          expect(i18n.dcngettext('messages_4', 'test singular', 'test plural', 1, 'LC_MESSAGES')).to.be('22test22 singular');
          expect(i18n.dcngettext('messages_4', 'test singular', 'test plural', 2, 'LC_MESSAGES')).to.be('22test22 plural');
          expect(i18n.dcngettext('messages_4', 'test singular', 'test plural', 0, 'LC_MESSAGES')).to.be('22test22 plural');

          expect(i18n.dcngettext('messages_3', 'Not translated', 'Not translated plural', 1, 'LC_MESSAGES')).to.be('Not translated');
          expect(i18n.dcngettext('messages_3', 'Not translated', 'Not translated plural', 2, 'LC_MESSAGES')).to.be('Not translated plural');
          expect(i18n.dcngettext('messages_3', 'Not translated', 'Not translated plural', 0, 'LC_MESSAGES')).to.be('Not translated plural');

          expect(i18n.dcngettext('messages_4', 'Not translated', 'Not translated plural', 1, 'LC_MESSAGES')).to.be('Not translated');
          expect(i18n.dcngettext('messages_4', 'Not translated', 'Not translated plural', 2, 'LC_MESSAGES')).to.be('Not translated plural');
          expect(i18n.dcngettext('messages_4', 'Not translated', 'Not translated plural', 0, 'LC_MESSAGES')).to.be('Not translated plural');
        });
      });

      describe("#pgettext", function () {
        var locale_data_w_context = {
          "context_test": {
            "": {
              "domain": "context_test",
              "lang": "en",
              "plural-forms": "nplurals=2; plural=(n != 1);"
            },
            "test singular": [null, "XXtestXX"],
            "test plural %n": ["test plural %n", "XXtestXXs %n", "XXtestXXp %n"],
            "context\u0004test context": [null, "XXtestXXcontext"],
            "test2": [null, "XXtest2XX"],
            "zero length translation": [null, ""],
            "context\u0004test2": [null, "XXtest2XXcontext"],
            "context\u0004context plural %n": ["plural %n", "XXcpXX singular %n", "XXcpXX plural %n"]
          }
        };

        var i18n = new Jed({
          domain : "context_test",
          locale_data : locale_data_w_context
        });

        it("should expose the pgettext function", function () {
          expect( i18n.pgettext ).to.be.ok();
        });

        it("should accept a context and look up a new key using the context_glue", function () {
          expect( i18n.pgettext('context', 'test context') ).to.be( 'XXtestXXcontext' );
        });

        it("should still pass through missing keys", function () {
          expect( i18n.pgettext('context', 'Not translated') ).to.be( 'Not translated' );
        });

        it("should make sure same msgid returns diff results w/ context when appropriate", function () {
          expect(i18n.gettext('test2')).to.be('XXtest2XX');
          expect(i18n.pgettext('context', 'test2')).to.be( 'XXtest2XXcontext' );
        });
      });

      describe("#dpgettext", function () {
        var i18n = new Jed({
          locale_data : locale_data_multi
        });

        it("should have a dpgettext function", function () {
          expect( i18n.dpgettext ).to.be.ok();
        });

        it("should use the domain and the context simultaneously", function () {
          expect(i18n.dpgettext('messages_3', 'context', 'test')).to.be('XXtestXX context');
          expect(i18n.dpgettext('messages_4', 'context', 'test')).to.be('22test22 context');
        });

        it("should pass through if either the domain, the key or the context isn't found", function () {
          expect(i18n.dpgettext('messages_3', 'context', 'Not translated')).to.be('Not translated');
          expect(i18n.dpgettext('messages_4', 'context', 'Not translated')).to.be('Not translated');
        });

      });

      describe("#dcpgettext", function () {
        var i18n = new Jed({
          locale_data : locale_data_multi
        });

        it("should have a dcpgettext function", function () {
          expect( i18n.dcpgettext ).to.be.ok();
        });

        it("should use the domain and the context simultaneously - ignore the category", function () {
          expect(i18n.dcpgettext('messages_3', 'context', 'test', 'LC_MESSAGES')).to.be('XXtestXX context');
          expect(i18n.dcpgettext('messages_4', 'context', 'test', 'LC_MESSAGES')).to.be('22test22 context');
        });

        it("should pass through if either the domain, the key or the context isn't found", function () {
          expect(i18n.dcpgettext('messages_3', 'context', 'Not translated', 'LC_MESSAGES')).to.be('Not translated');
          expect(i18n.dcpgettext('messages_4', 'context', 'Not translated', 'LC_MESSAGES')).to.be('Not translated');
        });

      });

      describe("#npgettext", function () {
        var locale_data_w_context = {
          "context_plural_test": {
            "": {
              "domain": "context_plural_test",
              "lang": "en",
              "plural-forms": "nplurals=2; plural=(n != 1);"
            },
            "test singular": [null, "XXtestXX"],
            "test plural %n": ["test plural %n", "XXtestXXs %n", "XXtestXXp %n"],
            "context\u0004test context": [null, "XXtestXXcontext"],
            "test2": [null, "XXtest2XX"],
            "zero length translation": [null, ""],
            "context\u0004test2": [null, "XXtest2XXcontext"],
            "context\u0004context plural %n": ["plural %n", "XXcpXX singular %n", "XXcpXX plural %n"]
          }
        };

        var i18n = new Jed({
          domain : "context_plural_test",
          locale_data : locale_data_w_context
        });

        it("should have a dcpgettext function", function () {
          expect( i18n.dcpgettext ).to.be.ok();
        });

        it("should handle plurals at the same time as contexts", function () {
          expect(i18n.npgettext('context', 'context plural %n', 'plural %n', 1)).to.be('XXcpXX singular %n');
          expect(i18n.npgettext('context', 'context plural %n', 'plural %n', 2)).to.be('XXcpXX plural %n');
          expect(i18n.npgettext('context', 'context plural %n', 'plural %n', 0)).to.be('XXcpXX plural %n');
        });

        it("should just pass through on not-found cases", function () {
          expect(i18n.npgettext('context', 'Not translated', 'Not translated plural', 1)).to.be('Not translated');
          expect(i18n.npgettext('context', 'Not translated', 'Not translated plural', 2)).to.be('Not translated plural');
          expect(i18n.npgettext('context', 'Not translated', 'Not translated plural', 0)).to.be('Not translated plural');
        });
      });

      describe("#dnpgettext", function () {
        var i18n = new Jed({
          locale_data : locale_data_multi
        });

        it("should have a dnpgettext function", function () {
          expect( i18n.dnpgettext ).to.be.ok();
        });

        it("should be able to do a domain, context, and pluralization lookup all at once", function () {
          expect(i18n.dnpgettext('messages_3', 'context', 'test singular', 'test plural', 1)).to.be('XXtestXX context singular');
          expect(i18n.dnpgettext('messages_3', 'context', 'test singular', 'test plural', 2)).to.be('XXtestXX context plural');
          expect(i18n.dnpgettext('messages_3', 'context', 'test singular', 'test plural', 0)).to.be('XXtestXX context plural');

          expect(i18n.dnpgettext('messages_4', 'context', 'test singular', 'test plural', 1)).to.be('22test22 context singular');
          expect(i18n.dnpgettext('messages_4', 'context', 'test singular', 'test plural', 2)).to.be('22test22 context plural');
          expect(i18n.dnpgettext('messages_4', 'context', 'test singular', 'test plural', 0)).to.be('22test22 context plural');
        });

        it("should pass through if everything doesn't point towards a key", function () {
          expect(i18n.dnpgettext('messages_3', 'context', 'Not translated', 'Not translated plural', 1)).to.be('Not translated');
          expect(i18n.dnpgettext('messages_3', 'context', 'Not translated', 'Not translated plural', 2)).to.be('Not translated plural');
          expect(i18n.dnpgettext('messages_3', 'context', 'Not translated', 'Not translated plural', 0)).to.be('Not translated plural');

          expect(i18n.dnpgettext('messages_4', 'context', 'Not translated', 'Not translated plural', 1)).to.be('Not translated');
          expect(i18n.dnpgettext('messages_4', 'context', 'Not translated', 'Not translated plural', 2)).to.be('Not translated plural');
          expect(i18n.dnpgettext('messages_4', 'context', 'Not translated', 'Not translated plural', 0)).to.be('Not translated plural');
        });
      });

      describe("#dcnpgettext", function () {
        var i18n = new Jed({
          locale_data : locale_data_multi
        });

        it("should have a dcnpgettext function", function () {
          expect( i18n.dcnpgettext ).to.be.ok();
        });

        it("should be able to do a domain, context, and pluralization lookup all at once - ignore category", function () {
          expect(i18n.dcnpgettext('messages_3', 'context', 'test singular', 'test plural', 1, "LC_MESSAGES")).to.be('XXtestXX context singular');
          expect(i18n.dcnpgettext('messages_3', 'context', 'test singular', 'test plural', 2, "LC_MESSAGES")).to.be('XXtestXX context plural');
          expect(i18n.dcnpgettext('messages_3', 'context', 'test singular', 'test plural', 0, "LC_MESSAGES")).to.be('XXtestXX context plural');

          expect(i18n.dcnpgettext('messages_4', 'context', 'test singular', 'test plural', 1, "LC_MESSAGES")).to.be('22test22 context singular');
          expect(i18n.dcnpgettext('messages_4', 'context', 'test singular', 'test plural', 2, "LC_MESSAGES")).to.be('22test22 context plural');
          expect(i18n.dcnpgettext('messages_4', 'context', 'test singular', 'test plural', 0, "LC_MESSAGES")).to.be('22test22 context plural');
        });

        it("should pass through if everything doesn't point towards a key", function () {
          expect(i18n.dcnpgettext('messages_3', 'context', 'Not translated', 'Not translated plural', 1, "LC_MESSAGES")).to.be('Not translated');
          expect(i18n.dcnpgettext('messages_3', 'context', 'Not translated', 'Not translated plural', 2, "LC_MESSAGES")).to.be('Not translated plural');
          expect(i18n.dcnpgettext('messages_3', 'context', 'Not translated', 'Not translated plural', 0, "LC_MESSAGES")).to.be('Not translated plural');

          expect(i18n.dcnpgettext('messages_4', 'context', 'Not translated', 'Not translated plural', 1, "LC_MESSAGES")).to.be('Not translated');
          expect(i18n.dcnpgettext('messages_4', 'context', 'Not translated', 'Not translated plural', 2, "LC_MESSAGES")).to.be('Not translated plural');
          expect(i18n.dcnpgettext('messages_4', 'context', 'Not translated', 'Not translated plural', 0, "LC_MESSAGES")).to.be('Not translated plural');
        });
      });
    });

    describe("Plural Forms Parsing", function (){
      // This is the method from the original gettext.js that uses new Function
      function evalParse( plural_forms ) {
        var pf_re = new RegExp('^(\\s*nplurals\\s*=\\s*[0-9]+\\s*;\\s*plural\\s*=\\s*(?:\\s|[-\\?\\|&=!<>+*/%:;a-zA-Z0-9_\(\)])+)', 'm');
        if (pf_re.test(plural_forms)) {
          var pf = plural_forms;
          if (! /;\s*$/.test(pf)) pf = pf.concat(';');

          var code = 'var plural; var nplurals; '+pf+' return { "nplural" : nplurals, "plural" : (plural === true ? 1 : plural ? plural : 0) };';
          return (new Function("n", code));
        } else {
          throw new Error("Syntax error in language file. Plural-Forms header is invalid ["+plural_forms+"]");
        }
      }

      // http://translate.sourceforge.net/wiki/l10n/pluralforms
      it("should have the same result as doing an eval on the expression for all known plural-forms.", function (){
        var pfs = ["nplurals=2; plural=(n > 1)","nplurals=2; plural=(n != 1)","nplurals=6; plural= n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;","nplurals=1; plural=0","nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)","nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2","nplurals=3; plural=n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2","nplurals=4; plural= (n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3","nplurals=2; plural=n > 1","nplurals=5; plural=n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4","nplurals=4; plural=(n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3","nplurals=2; plural= (n > 1)","nplurals=2; plural=(n%10!=1 || n%100==11)","nplurals=2; plural=n!=0","nplurals=2; plural=(n!=1)","nplurals=2; plural=(n!= 1)","nplurals=4; plural= (n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3","nplurals=2; plural=n>1;","nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2)","nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2)","nplurals=2; plural= n==1 || n%10==1 ? 0 : 1","nplurals=3; plural=(n==0 ? 0 : n==1 ? 1 : 2)","nplurals=4; plural=(n==1 ? 0 : n==0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3)","nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)","nplurals=2; plural=(n!=1);","nplurals=3; plural=(n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2);","nplurals=4; plural=(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0)","nplurals=2; plural=n != 1","nplurals=2; plural=(n>1)","nplurals=1; plural=0;"],
            pf, pfi, i;
        for ( pfi = 0; pfi < pfs.length; pfi++ ) {
          pf = ""+pfs[ pfi ];
          for( i = 0; i < 206; i++ ){
            expect( Jed.PF.compile( ""+pf )( i ) ).to.be( evalParse( ""+pf )( i ).plural );
          }
        }
      });

    });

    describe("Sprintf", function () {
      var locale_data_w_context = {
        "context_stargs_test": {
          "": {
            "domain": "context_stargs_test",
            "lang": "en",
            "plural-forms": "nplurals=2; plural=(n != 1);"
          },
          "test singular": [null, "XXtestXX"],
          "test plural %n": ["test plural %n", "XXtestXXs %n", "XXtestXXp %n"],
          "context\u0004test context": [null, "XXtestXXcontext"],
          "test2": [null, "XXtest2XX"],
          "zero length translation": [null, ""],
          "context\u0004test2": [null, "XXtest2XXcontext"],
          "context\u0004context plural %n": ["plural %n", "XXcpXX singular %n", "XXcpXX plural %n"]
        }
      };

      var i18n = new Jed({
        "locale_data" : locale_data_w_context,
        "domain": "context_stargs_test"
      });


      it("should take multiple types of arrays as input", function () {
        var strings = {
          "blah" : "blah",
          "thing%1$sbob" : "thing[one]bob",
          "thing%1$s%2$sbob" : "thing[one][two]bob",
          "thing%1$sasdf%2$sasdf" : "thing[one]asdf[two]asdf",
          "%1$s%2$s%3$s" : "[one][two]",
          "tom%1$saDick" : "tom[one]aDick"
        };
        var args = ["[one]", "[two]"];

        for (var i in strings) {
          // test using new Array
          expect(Jed.sprintf(i, ["[one]","[two]"])).to.be(strings[i]);
          expect(i18n.sprintf(i, ["[one]","[two]"])).to.be(strings[i]);
          // test using predefined array
          expect(Jed.sprintf(i, args)).to.be(strings[i]);
          expect(i18n.sprintf(i, args)).to.be(strings[i]);
        }
      });



      it("should accept a single string instead of an array", function () {
        // test using scalar rather than array
        var strings = {
          "blah" : "blah",
          "" : "",
          "%%" : "%",
          "tom%%dick" : "tom%dick",
          "thing%1$sbob" : "thing[one]bob",
          "thing%1$s%2$sbob" : "thing[one]bob",
          "thing%1$sasdf%2$sasdf" : "thing[one]asdfasdf",
          "%1$s%2$s%3$s" : "[one]"
        };
        var arg = "[one]";

        for (var i in strings) {
          expect(Jed.sprintf(i, arg)).to.be(strings[i]);
          expect(i18n.sprintf(i, arg)).to.be(strings[i]);
        }
      });
    });
  })();

})( Jed );
