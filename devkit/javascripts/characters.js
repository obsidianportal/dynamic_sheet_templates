/*
 * Obsidian Portal Dynamic Character Sheet Templates
 * http://www.obsidianportal.com
 *
 * This javascript controls the saving, loading, and populating of the Dynamic
 * Character Sheets.
 *
 * ==== Namespacing =======
 * All your variables and functions MUST BE NAMESPACED!!! This is done to prevent colissions
 * between DSTs and the Obsidian Portal core javascript.
 *
 * To namespace your javascript, simply prepend your DST's slug to each function and variable
 * name.  Examples using the minimal4e DST
 * var foo; becomes var minimal4e_foo;
 * function bar(a,b,c) {} becomes function minimal4e_bar(a,b,c) {}
 *
 * ==== Public/Private Interface =======
 * You should NOT be calling functions in this file or using variables defined here
 * unless they are explicity defined as part of the public interface. This is because
 * only the public interface is guaranteed to remain stable. The underlying
 * implementation may change and the function you're calling may be modified, renamed,
 * or removed.
 *
 * ==== Callbacks =======
 * There are several callbacks that can be used to in order
 * to be notified of events occurring in the character sheet.
 * In order to receive the callback, you will need to create a function
 * with a specific name. If a function by that name is found, it will
 * be called at the appropriate time.
 *
 * For all the callbacks, the first part is always the slug of your DST. For example,
 * the dataPreSave function for the minimal4e DST would be named "minimal4e_dataPreSave"
 *
 * The callbacks are as follows:
 * <slug>_dataPreLoad(opts) - Called immediately before the data values
 *   are loaded into the HTML template. "opts" is a javascript object containing:
 *    * containerId - string - The HTML id of the container div surrounding the HTML template
 *    * slug - string - The slug of the current DST.
 *    * isEditable - boolean - True if the DST is in edit mode, false otherwise
 *
 * <slug>_dataPostLoad(opts) - Called immediately after the data values
 *   have been loaded into the HTML template. "opts" is a javascript object containing:
 *    * containerId - string - The HTML id of the container div surrounding the HTML template
 *    * slug - string - The slug of the current DST.
 *    * isEditable - boolean - True if the DST is in edit mode, false otherwise
 *
 * <slug>_dataChange(opts) - Called immediately after a field value has been changed. This is
 *  useful if you want to do auto-calculations or validation. "opts" is a javascript object containing:
 *    * containerId - string - The HTML id of the container div surrounding the HTML template
 *    * fieldName - string - The name of the field changed. It will not include the "ds_" prefix.
 *    * fieldValue - string - The value of the field.
 *
 * <slug>_dataPreSave(opts) - Called immediately before the data values
 *   are retrieved from the HTML template and sent to the server to save. "opts" is a
 *   javascript object containing:
 *    * containerId - string - The HTML id of the container div surrounding the HTML template
 *    * slug - string - The slug of the current DST.
 *    * isEditable - boolean - True if the DST is in edit mode, false otherwise
 * 
 * ==== External Javascript =======
 * Loading external javascript files is strictly forbidden. It would be a huge security violation
 * to load a javascript file from an external server. Therefore, all your javascript must be part
 * of your DST's sheet.js file.
 *
 * Copyright (c) 2010 AisleTen, LLC
 * Licensed under the MIT License
 *
 */

 // Set up the namespace
if (typeof aisleten.characters == "undefined") {
	aisleten.characters = {};	
}

(function($) {
  var me = aisleten.characters;
  
  var reserved = [
    "name",
    "bio",
    "player",
    "campaign"
  ];
  
  var jeditableTooltip = "Click to edit";
  
  $.extend(me, {
    loadDynamicSheetValues : function(containerId, slug, isEditable) {
      // Call the preload callback
      me.dstCallback(slug + "_dataPreLoad",
        {
          'containerId' : containerId,
          'slug' : slug,
          'isEditable' : isEditable
        }
      );
      
      // Did we even define the dynamic sheet attributes?
      if(typeof dynamic_sheet_attrs == "undefined") {
        return;
      }
      
      // Load up the values
      $.each(dynamic_sheet_attrs, function(name, val) {
        $('#ds_' + name).html(val);
      });
      
      // Call the postload callback
      me.dstCallback(slug + "_dataPostLoad",
        {
          'containerId' : containerId,
          'slug' : slug,
          'isEditable' : isEditable
        }
      );
    },
    
    bindDynamicAttributes : function(containerId, slug) {
      var reservedIds = [];
      $.each(reserved, function(i, val) {
        reservedIds.push("#ds_" + val);
      });
      
      // Certain fields are reserved and not editable
      $('.editable .dsf').not(reservedIds.join(",")).editable(function(value, setting) {
        return value;
      },
      {
        submit : 'Ok',
        tooltip : jeditableTooltip,
        callback : function(value, settings) {
          // Strip off the "ds_"
          var fieldName = $(this).attr("id").substr(3);
          
          me.dstCallback(slug + "_dataChange", {
            'containerId' : containerId,
            'fieldName' : fieldName,
            'fieldValue' : value
          });
        }
      });
    },
    
    buildDynamicSheetHash : function() {
      var dynamicSheet = {};
      $('.dsf').each(function() {
        var value = $(this).html();
        
        // Extract the field name
        var fieldName = null;
        var elementId = $(this).attr('id');
        var re = /ds_(.+)$/;
        var matches = re.exec(elementId);
        if(matches) {
          fieldName = matches[1];
        }
        
        // Save all the fields, except those showing the edit tooltip and the reserved words
        if(fieldName && value != jeditableTooltip && ($.inArray(fieldName, reserved) == -1)) {
          dynamicSheet[fieldName] = value;
        }
      });
      return dynamicSheet;
    },
    
    // Creates a set of hidden inputs to hold the dynamic sheet values
    prepareForSave : function() {
      // Call the callback in the DST javascript
      var sheet = $('.dynamic_sheet');
      var divId = sheet.attr('id');
      var slug = $('.dst_slug', sheet).html();
      var isEditable = sheet.hasClass('editable');
      me.dstCallback(slug + "_dataPreSave",
        {
          'containerId' : divId,
          'slug' : slug,
          'isEditable' : isEditable
        }
      );
      
      var sheetVals = me.buildDynamicSheetHash();
      var container = $('#dynamic_sheet_values');
      
      // Clear out anything
      container.empty();
      
      // Add the inputs with the correct values
      $.each(sheetVals, function(fieldName, value) {
        var input = $('<input />');
        input.attr({
          "name" : "game_content[dynamic_sheet][" + fieldName + "]",
          "type" : "hidden",
          "value" : value
        });
        input.appendTo(container);
      });
    },
    
    bindSaveButton : function() {
      $('#character-save-button').click(function(e) {
        // Set up the input values
        me.prepareForSave();
        
        // Continue with form submission
        return true;
      })
    },
    
    bindDstSelect : function() {
      $('#dst_select').change(function(e) {
        e.preventDefault();
        
        var dstId = $(this).val();
        if(!dstId) {
          return;
        }
        
        // See if we're editing a character, and if so, extract the ID
        var characterId = null;
        var divId = $('div.edit-game-character').attr('id');
        if(divId) {
          characterId = aisleten.parseId(divId);
        }
        
        $('div.dynamic_sheet').hide('fast');
        $('#dynamic-sheet-spinner').show();
        
        var url = "/dynamic_sheet_templates/" + dstId + "/with_character";
        var params = {'format' : 'json'};
        if(characterId) {
          params['game_content_id'] = characterId;
        }
        $.getJSON(
          url,
          params,
          function(data, textStatus) {
            if(data.success) {
              me.loadNewDynamicSheet(data.dst_slug, data.dst_html, data.css_path, data.js_path);
              $('#dynamic-sheet-spinner').hide();
              $('div.dynamic_sheet').show('fast');
            }
          }
        );
      });
    },
    
    loadNewDynamicSheet : function(dst_slug, dst_html, css_path, js_path) {
      // Remove any current DST stylesheets
      $('.dst-stylesheet-link').remove();
      
      // Pull in the new stylesheet
      var css_link = "<link href='" + css_path + "' media='screen' rel='stylesheet' type='text/css' class='dst-stylesheet-link' />";
      $(css_link).appendTo('head');
      
      // Write in the updated HTML
      var container = $('div.dynamic_sheet_container');
      container.html(dst_html);
      
      // Extract the id
      var sheet = $('div.dynamic_sheet', container);
      var divId = sheet.attr('id');
      var isEditable = sheet.hasClass('editable');
      
      // Pull in the new javascript
      $.getScript(js_path,
        function(data, textStatus) {
          // Load the values
          me.loadDynamicSheetValues(divId, dst_slug, isEditable);

          // Bind the editing
          me.bindDynamicAttributes(divId, dst_slug);
        }
      );
    },
    
    dstCallback : function(callbackName, opts) {
      // Call the preload callback
      if(eval('typeof ' + callbackName) == 'function') {
        var f = eval(callbackName);
        try {
          f(opts);
        } catch(err) {
          // What can we do here?
        }
      }
    }
  });
  
  $(document).ready(function() {
    $('div.dynamic_sheet').each(function(i) {
      var dynamicSheet = $(this);
      var slug = $('span.dst_slug', dynamicSheet).html();
      var containerId = dynamicSheet.attr('id');
      var isEditable = dynamicSheet.hasClass('editable');
      
      me.loadDynamicSheetValues(containerId, slug, isEditable);
      me.bindDynamicAttributes(containerId, slug);
    });
    
    me.bindSaveButton();
    me.bindDstSelect();
  });
})(jQuery);