(function() {

  return {
    // Local vars
    retryCount: 0,
    curRetryId: undefined,

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
        // this.renderRecords(records);
        this.retryCount = 0;
        //Add checking for certain values here
        this.checkForFlags(records);
        
      }
    },

    // toggleShowMore: function() {
    //   var self = this;

    //   this.$(".records .sub_records").slideToggle("fast", function() {
    //     self.$(".records_toggle").toggle();

    //     if (self.$(".sub_records").is(":hidden")) {
    //       self.store('autoExpand', false);
    //     } else {
    //       self.store('autoExpand', true);
    //     }
    //   });
    // },

    // renderRecords: function(records) {
    //   var additionalRecords = records.slice(1),
    //       autoExpand        = this.store('autoExpand') || false;

    //   this.switchTo('records', {
    //     mainRecord: records[0],
    //     showExpanded: autoExpand,
    //     showMore: additionalRecords.length,
    //     subRecords: additionalRecords
    //   });
    // },

    resetApp: function() {
      // this.switchTo('loading');
      this.dataLookup();
    },
    
    // TODO: DRY up the flag settings storage
    checkForFlags: function(records) {
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

      while (records[i]) {
        console.log(records[i]);
        var rec = records[i];
        if(rec.record_type == flag1.type) {
          this.scanFields(records[i], flag1);
        }
        if(rec.record_type == flag2.type) {
          this.scanFields(records[i], flag2);
        }
        if(rec.record_type == flag3.type) {
          this.scanFields(records[i], flag3);
        }
        if(rec.record_type == flag4.type) {
          this.scanFields(records[i], flag4);
        }
        if(rec.record_type == flag5.type) {
          this.scanFields(records[i], flag5);
        }
        if(rec.record_type == flag6.type) {
          this.scanFields(records[i], flag6);
        }
        if(rec.record_type == flag7.type) {
          this.scanFields(records[i], flag7);
        }
        if(rec.record_type == flag8.type) {
          this.scanFields(records[i], flag8);
        }
        if(rec.record_type == flag9.type) {
          this.scanFields(records[i], flag9);
        }
        if(rec.record_type == flag10.type) {
          this.scanFields(records[i], flag10);
        }
        
        i++;
      }
    },
    

    /** Helpers **/
    scanFields: function(record, flag) {
      var l = 0;
      while (record.fields[l]){
        var label = record.fields[l].label,
        value = record.fields[l].value;
        console.log(label);
        console.log(value);
        if (label == flag.label) {
          if (value == flag.value){
              // pop a banner w specific instructions
              services.notify(helpers.fmt('<a href="%@">%@</a>', record.fields[l].url, flag.message), 'alert');
            } else if (!flag.value && value) {
              // if there is no specified flag value, but there is a field value... e.g. Support Level = x level should be true
              services.notify(helpers.fmt("<a href='%@'>%@: %@</a>", record.fields[l].url, flag.message, value), 'alert');
            }
        }

        // switch (label) {
        //   case flag.label:
        //     if (value == flag.value){
        //       //pop a banner w specific instructions
        //       services.notify(flag.message, 'notice');
        //     } else if (!flag.value && value) {
        //       // if there is no specified flag value, but there is a field value... e.g. Support Level = x level should be true
        //       services.notify(flag.message + value);
        //     }
        //   break;
        //   case flag.label:
        //     if (value == flag.value){
        //       //pop a banner w specific instructions
        //       services.notify(flag.message);
        //     }
        //   break;
        //   case flag.label:
        //     if (value == flag.value){
        //       //pop a banner w specific instructions
        //       services.notify(flag.message);
        //     }
        //   break;
        // }
        l++;
      }
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
