var i18n = new Jed( locale_data );

i18n.translate('I have a ticket.')
      .onDomain('messages')
      .withContext('male')
      .ifPlural(5, 'I have %d$1 tickets.')
      .fetch( sprintf_array );

      // "I have 5 tickets."
