// This is the javascript specific to the minimal4e DST
// It will all be enclosed in a function (like below).  If you don't know how to do that, that's ok. We'll do it for you
// when we receive the file.
//
// In this example, we're using some javascript to update the ability modifiers when someone changes their
// level or their ability score.
//
// The key is to bind to the (fake) "valchange" event on the span that you want to watch. In this example, we bind
// to the valchange event for the #ds_level element, and recalculate the ability mod + 1/2 level scores.

(function($) {
  
  var abilities = [
    "str",
    "dex"
  ];
  
  function recalculateAbilityBonuses() {
    for(var i = 0; i < abilities.length; i++) {
      var score = $('#ds_' + abilities[i]).html();
      
      var mod = abilityMod(score);
      $('#ds_' + abilities[i] + '_modifier').html(mod);
      
      var modPlusHalf = modPlusHalfLevel(mod);
      $('#ds_' + abilities[i] + '_modifier_plus_half_level').html(modPlusHalf);
    }
  }
  
  function abilityMod(score) {
    return Math.floor((parseInt(score) - 10) / 2.0);
  }
  
  function modPlusHalfLevel(mod) {
    var level = parseInt($('#ds_level').html());
    return mod + Math.floor(level / 2.0);
  }
  
  function bindAbilEvent(ability) {
    $('#ds_' + ability).bind('valchange', function(e) {
      var bonus = abilityMod(e.val);
      $('#ds_'+ ability + '_modifier').html(bonus);
      
      var modPlusHalf = modPlusHalfLevel(bonus);
      $('#ds_' + ability + '_modifier_plus_half_level').html(modPlusHalf);
    });
  }
  
  $(document).ready(function() {
    for(var i = 0; i < abilities.length; i++) {
      bindAbilEvent(abilities[i]);
    }
    
    $('#ds_level').bind('valchange', function(e) {
      recalculateAbilityBonuses(e.val);
    });
  });
})(jQuery);