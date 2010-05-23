/*
 * This is the javascript specific to the minimal4e DST
 * In this example, we're using some javascript to update the ability modifiers when someone changes their
 * level or their ability score.
 *
 * The key is to use the callback functions to catch the right events.
 * Read the top comments in characters.js to get a better idea of how the callbacks work.
 *
 * Copy and paste this directly into the javascript textarea on obsidianportal.com
 */


function minimal4e_dataPreLoad(options) {
  // Called just before the data is loaded.
  // alert("dataPreLoad");
}

function minimal4e_dataPostLoad(options) {
  // Called just after the data is loaded.
  // alert("dataPostLoad");
}

function minimal4e_dataChange(options) {
  // Called immediately after a data value is changed.
  // alert("dataChange. " + options['fieldName'] + " = " + options['fieldValue']);
  
  // Here, we use it to help with calculating the ability modifiers if the level or
  // base ability score changes.
  var field = options['fieldName'];
  var val = options['fieldValue'];
  
  // If level changes, we recalculate everything
  if(field == 'level') {
    minimal4e_recalculateAllAbilityBonuses();
  }
  
  // Otherwise, if it's one of the base scores, we just update its modifiers
  for(var i = 0; i < minimal4e_abilities.length; i++) {
    if(field == minimal4e_abilities[i]) {
      minimal4e_recalculateAbilityBonus(field);
    }
  }
}

function minimal4e_dataPreSave(options) {
  // Called just before the data is saved to the server.
  // alert("dataPreSave");
}

// You can define your own variables...just make sure to namespace them!
var minimal4e_abilities = [
  "str",
  "dex"
];

function minimal4e_recalculateAllAbilityBonuses() {
  for(var i = 0; i < minimal4e_abilities.length; i++) {
    minimal4e_recalculateAbilityBonus(minimal4e_abilities[i]);
  }
}

function minimal4e_recalculateAbilityBonus(ability) {
  var score = jQuery('.dsf_' + ability).html();
  
  var mod = minimal4e_abilityMod(score);
  jQuery('.dsf_' + ability + '_modifier').html(mod);
  
  var modPlusHalf = minimal4e_modPlusHalfLevel(mod);
  jQuery('.dsf_' + ability + '_modifier_plus_half_level').html(modPlusHalf);
}

function minimal4e_abilityMod(score) {
  return Math.floor((parseInt(score) - 10) / 2.0);
}

function minimal4e_modPlusHalfLevel(mod) {
  var level = parseInt(jQuery('.dsf_level').html());
  return mod + Math.floor(level / 2.0);
}