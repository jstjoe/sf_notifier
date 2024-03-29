(function() {

  return {
    // Local vars
    retryCount: 0,
    curRetryId: undefined,
    defaultState: 'notifications',
    // defaultState: 'loading',

    requests: {
      lookupById: function(requesterId, ticketId) { return { url: encodeURI(helpers.fmt("/api/v2/users/%@/crm_data.json?ticket_id=%@", requesterId, ticketId)) }; },
      statusById: function(requesterId, ticketId) {
        return {
          url: encodeURI(helpers.fmt("/api/v2/users/%@/crm_data/status.json?ticket_id=%@", requesterId, ticketId)) };
        }
    },

    events: {
      'click .records .records_toggle': 'toggleShowMore',

      /** App callbacks **/
      'app.created':                'resetApp',
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
        // this.renderRecords(records);
        this.retryCount = 0;

        // this is where we check for a severity tag
        var shouldAlert = this.checkForAlertTag();
        //Add checking for certain values here
        this.checkForFlags(records, shouldAlert);

        
      }
    },

    resetApp: function() {
      // this.switchTo('loading');
      this.dataLookup();
    },
    checkForAlertTag: function(){
      // does the current ticket contain the alert tag?
      var tags = this.ticket().tags(),
        alertTag = this.setting('Alert tag'),
        shouldAlert = _.contains(tags, alertTag);
      if(shouldAlert) {
        this.alertUser();
      }
      return shouldAlert;
    },
    
    // TODO: DRY up the flag settings storage
    checkForFlags: function(records, shouldAlert) {
      var flag1 = {
        type: this.setting('Flag 1 Record Type'),
        label: this.setting('Flag 1 Label'),
        value: this.setting('Flag 1 Value'),
        message: this.setting('Flag 1 Message')
      },
        flag2 = {
          type: this.setting('Flag 2 Record Type'),
          label: this.setting('Flag 2 Label'),
          value: this.setting('Flag 2 Value'),
          message: this.setting('Flag 2 Message'),
        },
        flag3 = {
          type: this.setting('Flag 3 Record Type'),
          label: this.setting('Flag 3 Label'),
          value: this.setting('Flag 3 Value'),
          message: this.setting('Flag 3 Message')
        },
        flag4 = {
          type: this.setting('Flag 4 Record Type'),
          label: this.setting('Flag 4 Label'),
          value: this.setting('Flag 4 Value'),
          message: this.setting('Flag 4 Message')
        },
        flag5 = {
          type: this.setting('Flag 5 Record Type'),
          label: this.setting('Flag 5 Label'),
          value: this.setting('Flag 5 Value'),
          message: this.setting('Flag 5 Message')
        },
        flag6 = {
          type: this.setting('Flag 6 Record Type'),
          label: this.setting('Flag 6 Label'),
          value: this.setting('Flag 6 Value'),
          message: this.setting('Flag 6 Message')
        },
        flag7 = {
          type: this.setting('Flag 7 Record Type'),
          label: this.setting('Flag 7 Label'),
          value: this.setting('Flag 7 Value'),
          message: this.setting('Flag 7 Message')
        },
        flag8 = {
          type: this.setting('Flag 8 Record Type'),
          label: this.setting('Flag 8 Label'),
          value: this.setting('Flag 8 Value'),
          message: this.setting('Flag 8 Message')
        },
        flag9 = {
          type: this.setting('Flag 9 Record Type'),
          label: this.setting('Flag 9 Label'),
          value: this.setting('Flag 9 Value'),
          message: this.setting('Flag 9 Message')
        },
        flag10 = {
          type: this.setting('Flag 10 Record Type'),
          label: this.setting('Flag 10 Label'),
          value: this.setting('Flag 10 Value'),
          message: this.setting('Flag 10 Message')
        },
        
        i = 0;
      
      
      // remove duplicates
      records = _.uniq(records);
      //check the records
      var last = records[records.length - 1];
      while (records[i]) {
        
        var rec = records[i];
        if(rec.record_type == flag1.type) {
          this.scanFields(records[i], flag1, shouldAlert);
        }
        if(rec.record_type == flag2.type) {
          this.scanFields(records[i], flag2, shouldAlert);
        }
        if(rec.record_type == flag3.type) {
          this.scanFields(records[i], flag3, shouldAlert);
        }
        if(rec.record_type == flag4.type) {
          this.scanFields(records[i], flag4, shouldAlert);
        }
        if(rec.record_type == flag5.type) {
          this.scanFields(records[i], flag5, shouldAlert);
        }
        if(rec.record_type == flag6.type) {
          this.scanFields(records[i], flag6, shouldAlert);
        }
        if(rec.record_type == flag7.type) {
          this.scanFields(records[i], flag7, shouldAlert);
        }
        if(rec.record_type == flag8.type) {
          this.scanFields(records[i], flag8, shouldAlert);
        }
        if(rec.record_type == flag9.type) {
          this.scanFields(records[i], flag9, shouldAlert);
        }
        if(rec.record_type == flag10.type) {
          this.scanFields(records[i], flag10, shouldAlert);
        }
        if(rec == last) {
          this.$('span.loading').hide();
        }


        i++;
      }
    },
    

    /** Helpers **/
    scanFields: function(record, flag, shouldAlert) {
      var l = 0;
      while (record.fields[l]){
        var label = record.fields[l].label,
        value = record.fields[l].value;
        
        if (label == flag.label) {
          if (value == flag.value){
            this.notifyUser(record.url, flag.message, shouldAlert);
          } else if (!flag.value && value) {
            // if there is no specified flag value, but there is a field value... e.g. Support Level = x level should be true
            this.notifyUser(record.url, flag.message, value, shouldAlert);
          }


        }
        l++;
        //TODO: render some indication of completion on last iteration
      }
    },
    notifyUser: function(url, message, value, shouldAlert) {
      var tray = services.appsTray();
      tray.show();
      var note = this.renderTemplate('note', {
        message: message,
        value: value,
        url: url
      });
      var alertTerms = 'Custom Support Terms';
      if(message != alertTerms) { // don't special terms to the sidebar (modal only)
        this.$('span.loading').hide();
        this.$('div.notifications').append(note).show();
      }
      

      // fill alert modal?
      var relevant = _.contains(['Support Level', 'SEV1', 'Royalty Terms'], message); // make this a setting (splice a string to an array)
      if(shouldAlert && relevant) {
        var alert = this.renderTemplate('alert', {
          message: message,
          value: value,
          url: url
        });

        this.$('span.loading_modal').hide();
        this.$('div.notifications_modal').append(alert).show();

      }
    },
    alertUser: function() {

      this.$('#alert_modal').modal('show');
    },

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
