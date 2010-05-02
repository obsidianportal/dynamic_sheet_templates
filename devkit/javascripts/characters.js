var dst_devkit = {};

(function($) {
  var me = dst_devkit;
  
  $.extend(me, {
    // Parses the id out of an "xxx-yyy-zzz-id" HTML element id
    parseId : function(elementId) {
      var re = /.*-(.+)$/;
      var matches = re.exec(elementId);
      if(matches) {
        return matches[1];
      }
      else {
        return null;
      }
    },
    
    loadDynamicSheet : function() {
      // Did we even define the dynamic sheet attributes?
      if(typeof dynamic_sheet_attrs == "undefined") {
        return;
      }
      
      // Load up the values
      $.each(dynamic_sheet_attrs, function(name, val) {
        $('#ds_' + name).html(val);
      });
    },
    
    bindDynamicAttributes : function() {
      $('.dsf').editable(function(value, setting) {
        return value;
      },
      {
        submit : 'Ok',
        callback : function(value, settings) {
          $(this).trigger({
            type : 'valchange',
            val : value
          });
        }
      });
    }
  });
  
  $(document).ready(function() {
    me.loadDynamicSheet();
    me.bindDynamicAttributes();
  });
})(jQuery);