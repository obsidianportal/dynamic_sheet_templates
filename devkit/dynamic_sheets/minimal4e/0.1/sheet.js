// This is the javascript specific to the minimal4e DST
// It will all be enclosed in a function (like below).  If you don't know how to do that, that's ok. We'll do it for you
// when we receive the file.
//
// In this example, we're using some javascript to update the ability modifiers when someone changes their
// level or their ability score.
//
// The key is to bind to the (fake) "valchange" event on the span that you want to watch. In this example, we bind
// to the valchange event for the #ds_level element, and recalculate the ability mod + 1/2 level scores.
  
  
// You can define your own variables...just make sure to namespace them!
var minimal4e_abilities = [
  "str",
  "dex"
];

// You can use the callbacks to receive important events in the character sheet
function minimal4e_dataPreLoad(options) {
  // Called just before the data is loaded.
  // alert("dataPreLoad");
}

function minimal4e_dataPostLoad(options) {
  // Called just after the data is loaded.
  // alert("dataPostLoad");
}

function minimal4e_dataPreSave(options) {
  // Called just before the data is saved to the server.
  // alert("dataPreSave");
}

function minimal4e_recalculateAbilityBonuses() {
  for(var i = 0; i < minimal4e_abilities.length; i++) {
    var score = $('#ds_' + minimal4e_abilities[i]).html();
    
    var mod = minimal4e_abilityMod(score);
    $('#ds_' + minimal4e_abilities[i] + '_modifier').html(mod);
    
    var modPlusHalf = minimal4e_modPlusHalfLevel(mod);
    $('#ds_' + minimal4e_abilities[i] + '_modifier_plus_half_level').html(modPlusHalf);
  }
}

function minimal4e_abilityMod(score) {
  return Math.floor((parseInt(score) - 10) / 2.0);
}

function minimal4e_modPlusHalfLevel(mod) {
  var level = parseInt($('#ds_level').html());
  return mod + Math.floor(level / 2.0);
}

function minimal4e_bindAbilEvent(ability) {
  $('#ds_' + ability).bind('valchange', function(e) {
    var bonus = minimal4e_abilityMod(e.val);
    $('#ds_'+ ability + '_modifier').html(bonus);
    
    var modPlusHalf = minimal4e_modPlusHalfLevel(bonus);
    $('#ds_' + ability + '_modifier_plus_half_level').html(modPlusHalf);
  });
}
  
$(document).ready(function() {
  for(var i = 0; i < minimal4e_abilities.length; i++) {
    minimal4e_bindAbilEvent(minimal4e_abilities[i]);
  }
  
  $('#ds_level').bind('valchange', function(e) {
    minimal4e_recalculateAbilityBonuses(e.val);
  });
});