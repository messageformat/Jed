# translate.js - translates text to different languages, simple as cake
<img src = "https://github.com/Marak/translate.js/raw/master/logo.png" border = "0"/>

## v0.6.0

# USAGE

### node.js - 

        var sys = require('sys');
        var colors = require('colors'); // colors are fun!
        var translate = require('./lib/translate');

        // note: the translator is  English=>Spanish by default
        translate.text('I want tacos please.', function(err, text){

          sys.puts('I want tacos please.'.red + ' => '.cyan + text.yellow);
          var input = 'Spanish', output = "Japanese";
          translate.text({input:input,output:output}, text, function(err, text2){

            var input = 'Japanese', output = "English";
            sys.puts(text.yellow + ' => '.cyan + text2.blue);
            translate.text({input:input,output:output}, text, function(err, text3){

               sys.puts(text2.blue + ' => '.cyan + text3.red);
               sys.puts('English'.red+'=>'+'Spanish'.yellow+'=>'+'Japanese'.blue+'=>'+'English'.red  +'\ntaco request has been normalized. ^_^'.green);
            });
          }); 
        });

### browser - 

          <!-- main translate.js library -->
          <script type="text/javascript" src="./lib/translate.js"></script>

          <!-- load up the languages definition file -->
          <script type="text/javascript" src="./lib/languages.js"></script>

          <!-- jquery not required, just used in the demo page -->
          <script type="text/javascript" src="./vendor/jquery.js"></script>

          <script type="text/javascript">
            var languages;

            $(document).ready(function(){

              languages = getLangs();

              // populate the select box
              for(var lang in languages){
                $('#langInput').append('<option value = "'+lang+'">' + lang + '</option>');
              }

              for(var lang in languages){
                $('#langOutput').append('<option value = "'+lang+'">' + lang + '</option>');
              }

              /***** NAMED EVENTS *****/

                $(document).bind('##TRANSLATE_TEXT##', function(e){

                  $('#run').attr('disabled','disabled');
                  $('#run').val('translating...');     
                  var input = $('#langInput').val(), output = $('#langOutput').val();

                  translate.text({input:input,output:output}, $('#theCode').val(), function(result){
                    $('#run').attr('disabled','');
                    $('#run').val('<== translate ==>');
                    $('#output').val( result );
                  });
                });

              /**** END NAMED EVENTS ****/

              /**** BIND UI EVENTS ****/

                // select box change
                $('#langSelector').change(function(){
                  $(document).trigger('##CHANGE_LANGUAGE##', {"fontName":$(this).val()})
                });

                $('#run').click(function(e){
                  $(document).trigger('##TRANSLATE_TEXT##');
                });

              /**** END UI BIND EVENTS ****/

              // little bit of a onReady hack. i'll fix the API a bit so this can be done better
              $(document).trigger('##CHANGE_LANGUAGE##', {"fontName":'Doh'});
              $('#langInput').val('English');
              $('#langOutput').val('Spanish');

            });
          </script>


## languages

<table><tbody><tr><td style="white-space: nowrap;">Afrikaans<br>Albanian<br>Arabic<br>Armenian<br>Azerbaijani<br>Basque<br>Belarusian<br>Bulgarian<br>Catalan<br>Chinese</td><td style="white-space: nowrap;">Croatian<br>Czech<br>Danish<br>Dutch<br>English<br>Estonian<br>Filipino<br>Finnish<br>French<br>Galician</td><td style="white-space: nowrap;">Georgian<br>German<br>Greek<br>Haitian Creole<br>Hebrew<br>Hindi<br>Hungarian<br>Icelandic<br>Indonesian<br>Irish</td><td style="white-space: nowrap;">Italian<br>Japanese<br>Korean<br>Latvian<br>Lithuanian<br>Macedonian<br>Malay<br>Maltese<br>Norwegian<br>Persian</td><td style="white-space: nowrap;">Polish<br>Portuguese<br>Romanian<br>Russian<br>Serbian<br>Slovak<br>Slovenian<br>Spanish<br>Swahili<br>Swedish</td><td style="white-space: nowrap;">Thai<br>Turkish<br>Ukrainian<br>Urdu<br>Vietnamese<br>Welsh<br>Yiddish</td></tr></tbody></table>

### fun facts

translate.js uses the google api and requires an internet connection<br/>
if you want to actually hear the translated text as audio you could use <a href = "http://github.com/marak/say.js/">say.js</a><br/>

## Authors
#### Andrew Lunny (alunny), Marak Squires, Google 
               