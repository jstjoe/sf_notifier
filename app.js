(function() {

  return {
    // Local vars
    retryCount: 0,
    curRetryId: undefined,

    defaultState: 'loading',

    requests: {
      lookupById: function(requesterId, ticketId) { return { url: encodeURI(helpers.fmt("/api/v2/users/%@/crm_data.json?ticket_id=%@", requesterId, ticketId)) }; },
      statusById: function(requesterId, ticketId) { return { url: encodeURI(helpers.fmt("/api/v2/users/%@/crm_data/status.json?ticket_id=%@", requesterId, ticketId)) }; }
    },

    events: {
      'click .records .records_toggle': 'toggleShowMore',

      /** App callbacks **/
      'app.activated':                'resetApp',
      'ticket.requester.id.changed':  'dataLookup',
      'click .try_again':             'resetApp',

      /** Ajax callbacks **/
      'lookupById.done': 'handleLookupResult',
      'lookupById.fail': 'handleFailedRequest',
      'statusById.done': 'handleLookupResult',
      'statusById.fail': 'handleFailedRequest'
    },

    dataLookup: function() {
      this.curRetryId = undefined;

      // TODO: Remove if-statement once app.activated truly fires on data ready
      if (typeof(this.ticket()) == "undefined" || typeof(this.ticket().requester())  == "undefined") {
        setTimeout( _.bind(this.resetApp, this), 500 );
      } else {
        this.ajax('lookupById',
          this.ticket().requester().id(),
          this.ticket().id()
        );
      }
    },

    checkLater: function() {
      var minRetryThreshold = 3,
          maxRetryThreshold = 6,
          retryDelay        = 3000,
          self              = this;

      if (typeof self.curRetryId === 'undefined' && self.retryCount <= maxRetryThreshold) {
        self.curRetryId = setTimeout(function() {
          self.curRetryId = undefined;
          self.ajax('statusById',
            self.ticket().requester().id(),
            self.ticket().id()
          );
        }, retryDelay);
        self.retryCount++;

        if (self.retryCount >= minRetryThreshold) {
          self.$('.working p').text(self.I18n.t('sync.taking_longer'));
        }

      } else if (self.retryCount > maxRetryThreshold) {
        self.showError(self.I18n.t('sync.error'));
        self.retryCount = 0;
      }
    },

    handleLookupResult: function(data, textStatus, response) {
      var records = data.crm_data.records || [],
          status  = data.crm_data.status;

      if (status == 'pending') {
        this.checkLater();
      } else {
        this.renderRecords(records);
        this.retryCount = 0;
        //Add checking for certain values here
        this.checkForFlags(records);
        
      }
    },

    toggleShowMore: function() {
      var self = this;

      this.$(".records .sub_records").slideToggle("fast", function() {
        self.$(".records_toggle").toggle();

        if (self.$(".sub_records").is(":hidden")) {
          self.store('autoExpand', false);
        } else {
          self.store('autoExpand', true);
        }
      });
    },

    renderRecords: function(records) {
      var additionalRecords = records.slice(1),
          autoExpand        = this.store('autoExpand') || false;

      this.switchTo('records', {
        mainRecord: records[0],
        showExpanded: autoExpand,
        showMore: additionalRecords.length,
        subRecords: additionalRecords
      });
    },

    resetApp: function() {
      this.switchTo('loading');
      this.dataLookup();
    },
    
    // TODO: DRY up the flag settings storage
    checkForFlags: function(records) {
      var flag1label = this.setting('Flag 1 Label'),
      flag1 = this.setting('Flag 1 Value'),
      flag1message = this.setting('Flag 1 Message'),
      flag2label = this.setting('Flag 2 Label'),
      flag2 = this.setting('Flag 2 Value'),
      flag2message = this.setting('Flag 2 Message'),
      flag3label = this.setting('Flag 3 Label'),
      flag3 = this.setting('Flag 3 Value'),
      flag3message = this.setting('Flag 3 Message'),
      i = 0,
      l = 0;
      while (records[i]) {
        while (records[i].fields[l]){
          var label = records[i].fields[l].label,
          value = records[i].fields[l].value;
          console.log(label);
          console.log(value);
          switch (label) {
            case flag1label:
              if (value == flag1){
                //pop a banner w specific instructions
                //use flag1message as the string
                services.notify(flag1message);
              }
            break;
            case flag2label:
              if (value == flag2){
                //pop a banner w specific instructions
                //use flag2message as the string
                services.notify(flag2message);
              }
            break;
            case flag3label:
              if (value == flag3){
                //pop a banner w specific instructions
                //use flag3message as the string
                services.notify(flag3message);
              }
            break;
          }
          l++;
        }
        i++;
      }
    },
    

    /** Helpers **/

    handleFailedRequest: function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 403) {
        this.switchTo('setup');
      } else {
        this.showError( this.I18n.t('problem', { error: errorThrown.toString() }) );
      }
    },

    showError: function(msg) {
      this.switchTo('error', { message: msg });
    }
  };

}());
