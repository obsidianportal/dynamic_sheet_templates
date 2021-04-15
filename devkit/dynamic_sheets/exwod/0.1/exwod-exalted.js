const ATTRIBUTES_PHYSICAL = ['Strength','Dexterity','Stamina'];
const ATTRIBUTES_SOCIAL = ['Charisma','Manipulation','Appearance'];
const ATTRIBUTE_MENTAL = ['Perception','Intelligence','Wits'];
const ABILITIES_TALENTS = ['Alertness','Athletics','Awareness','Brawl','Empathy','Expression','Intimidation','Leadership','Streetwise','Suberfuge'];
const ABILITIES_SKILLS = ['Animal Ken','Crafts','Drive','Etiquette','Firearms','Larceny','Melee','Performance','Stealth','Survival'];
const ABILITIES_KNOWLEDGES = ['Academics','Computer','Finance','Investigation','Law','Medicine','Occult','Politics','Science','Technology'];
/** Number constants */
const FIVE_DOTS = 5;
const TEN_DOTS = 10;
/** String constants */
const TRAIT_ATTRIBUTE = 'attribute';
const TRAIT_ABILITY = 'ability';
const TRAIT_BACKGROUND = 'background';
/** Class name constants */
const CLASSNAME_DSF = 'dsf'
const CLASSNAME_EXWOD_DOT = 'exwod_dot'
const CLASSNAME_EXWOD_NAMESPACE = 'exwod';
const CLASSNAME_EXWOD_DOTGROUPING = 'exwod_dotgrouping';
const CLASSNAME_FIVE_DOT = 'five_dot_rating';
const CLASSNAME_TEN_DOT = 'ten_dot_rating';
const CLASSNAME_TRAIT_RATING = 'trait_rating';
const CLASSNAME_MINIMUM_ONE = 'minimum_one'
const CLASSNAME_ATTRIBUTES_PHYSICAL = 'attributes_physical';
const CLASSNAME_ATTRIBUTES_SOCIAL = 'attributes_social';
const CLASSNAME_ATTRIBUTES_MENTAL = 'attributes_mental';
const CLASSNAME_ABILITIES_TALENTS = 'abilities_talents';
const CLASSNAME_ABILITIES_SKILLS = 'abilities_skills';
const CLASSNAME_ABILITIES_KNOWLEDGES = 'abilities_knowledges';
const CLASSNAME_VALUE_STORAGE = 'value_storage';
/** Attribute name constants */
const HTMLATTRIBUTE_DATA_TRAITRATING = 'data-traitrating';
const HTMLATTRIBUTE_DATA_VALUE = 'data-value';

window.onload = function () {
    var ratingElement = document.getElementsByClassName(exwod_getClassList(CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_ATTRIBUTES_PHYSICAL))[0];
    ratingElement.innerHTML = exwod_createRatingEntryHTML(TRAIT_ATTRIBUTE, ATTRIBUTES_PHYSICAL,FIVE_DOTS);
    ratingElement = document.getElementsByClassName(exwod_getClassList(CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_ATTRIBUTES_SOCIAL))[0];
    ratingElement.innerHTML = exwod_createRatingEntryHTML(TRAIT_ATTRIBUTE, ATTRIBUTES_SOCIAL,FIVE_DOTS);
    ratingElement = document.getElementsByClassName(exwod_getClassList(CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_ATTRIBUTES_MENTAL))[0];
    ratingElement.innerHTML = exwod_createRatingEntryHTML(TRAIT_ATTRIBUTE, ATTRIBUTE_MENTAL, FIVE_DOTS);
    ratingElement = document.getElementsByClassName(exwod_getClassList(CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_ABILITIES_TALENTS))[0];
    ratingElement.innerHTML = exwod_createRatingEntryHTML(TRAIT_ABILITY, ABILITIES_TALENTS, FIVE_DOTS);
    ratingElement = document.getElementsByClassName(exwod_getClassList(CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_ABILITIES_SKILLS))[0];
    ratingElement.innerHTML = exwod_createRatingEntryHTML(TRAIT_ABILITY, ABILITIES_SKILLS, FIVE_DOTS);
    ratingElement = document.getElementsByClassName(exwod_getClassList(CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_ABILITIES_KNOWLEDGES))[0];
    ratingElement.innerHTML = exwod_createRatingEntryHTML(TRAIT_ABILITY, ABILITIES_KNOWLEDGES, FIVE_DOTS);
}

/**
 * 
 * @param {String} traitType 
 * @param {Array<String>} ratingNameList 
 * @param {Number} capacity 
 * @returns HTML string representing a rating
 */
function exwod_createRatingEntryHTML(traitType,ratingNameList,capacity){
    var htmlResult = "";
    var len = ratingNameList.length;
    //debugger;
    for (var i=0; i < len; i++){
        var ratingDiv = document.createElement('div');
        ratingDiv.classList.add(CLASSNAME_DSF, CLASSNAME_EXWOD_NAMESPACE, CLASSNAME_TRAIT_RATING);
        if (traitType == TRAIT_ATTRIBUTE){
            ratingDiv.classList.add(CLASSNAME_MINIMUM_ONE);
        }
        if (capacity == FIVE_DOTS){            
            ratingDiv.classList.add(CLASSNAME_FIVE_DOT);
        } else if (capacity == TEN_DOTS){
            ratingDiv.classList.add(CLASSNAME_TEN_DOT);
        } else {
            ratingDiv.classList.add('misc_rating');
        }
        var safeName = ratingNameList[i].toLowerCase().replace(' ','_');
        ratingDiv.setAttribute('name', safeName);
        ratingDiv.setAttribute('display','flex-grow');
        ratingDiv.innerHTML = exwod_createMultiDotTraitControlElement(traitType,ratingNameList[i],capacity);
        htmlResult += ratingDiv.outerHTML;        
    }
    return htmlResult
}

/**
 * Creates the html for a custom multi-dot trait control of the specified type and name
 * Use 5 for things like attributes, abilities, backgrounds, etc
 * Use 10 for things like willpower, rage, etc
 * @param {String} traitType the type of the trait (attribute, ability, etc)
 * @param {String} traitName name of the trait (Strength, Willpower, etc)
 * @param {Number} traitCapacity desired number of dots in the control
 * @returns html for a 10- or 5-dot trait of the specified name
 */
 function exwod_createMultiDotTraitControlElement(traitType, traitName,capacity){
    var lowerTraitName = traitName.toLowerCase().replace(' ','_');
    var lowerTraitType = traitType.toLowerCase();
    var traitLabel = lowerTraitType + "_" + lowerTraitName;

    var valueStorageSpan = document.createElement('span');
    valueStorageSpan.classList.add(CLASSNAME_DSF);
    valueStorageSpan.classList.add('dsf_'+traitLabel);
    valueStorageSpan.classList.add('value_storage');
    valueStorageSpan.style.display='none';

    var casteFavoredCheckbox = document.createElement('input');
    casteFavoredCheckbox.type='checkbox';
    casteFavoredCheckbox.classList.add('dsf_castefavored_'+traitLabel);

    var casteFavoredLabel = document.createElement('label');
    casteFavoredLabel.classList.add(CLASSNAME_DSF);
    casteFavoredLabel.classList.add('dsf_castefavored_'+traitLabel);
    casteFavoredLabel.display='none';
    casteFavoredLabel.appendChild(casteFavoredCheckbox);

    var specialtySpan = document.createElement('span');
    specialtySpan.classList.add(CLASSNAME_DSF);
    specialtySpan.classList.add('dsf_specialty_'+traitLabel);

    var traitDiv = document.createElement('div');
    traitDiv.classList.add('specialty');
    traitDiv.classList.add('specialty_' +traitLabel);
    traitDiv.setAttribute('cursor','pointer');
    var tSpan = document.createElement('span');
    tSpan.innerText=traitName + ':';
    traitDiv.appendChild(tSpan);
    traitDiv.appendChild(specialtySpan);

    var groupingDiv = document.createElement('div');
    groupingDiv.className = CLASSNAME_EXWOD_DOTGROUPING;
    groupingDiv.innerHTML = exwod_createMultipleDotContainers(traitLabel, capacity);

    var traitHtml = '<!--begin ' + capacity + '-dot control -->' +
                    valueStorageSpan.outerHTML +
                    casteFavoredLabel.outerHTML +
                    traitDiv.outerHTML +
                    groupingDiv.outerHTML +
                    '<!-- end '+capacity+'-dot control -->';
    return traitHtml;
}



/**
 * Generates an html string with the specified number of dot container elements
 * @param {String} traitLabel the label for the value of the trait for storage
 * @param {Number} capacity number of dots containers to generate
 * @returns html representing a number of dot containers equal to the capacity parameter
 */
function exwod_createMultipleDotContainers(traitLabel, capacity){
    var output = '';
    /** Note that this loop is 1-based, not 0-based */
    for(var i = 1; i <= capacity; i++){
        output += exwod_createDotContainer(traitLabel, i);
    }
    return output;
}

/**
 * Creates a custom dot container html element
 * @param {String} dsfTraitLabel the label for the value of the trait for storage
 * @param {Number} idx the number value to populate the data-value attribute of the resulting control
 * @returns html string for a custom dot input
 */
function exwod_createDotContainer(dsfTraitLabel, idx){
    var valueClass = CLASSNAME_DSF + "_" + dsfTraitLabel + '_' + idx;
    var output = '<label class="exwod_dot_container">' +
        '<input class="exwod hidden_input '+ valueClass + '" type="radio" name="dot_value">' +
        '<span class="exwod exwod_dot" data-value="' + idx + '" onclick="exwod_doDotFill(this)"></span>' +
        '</label>';
    return output;
}


/**
 * This method is attached to the <span> element of class exwod_dot which must
 * be a child of a <label> element of class exwod_dot_container. It will also navigate
 * up the DOM tree to update the data-traitrating attribute of the container
 * @param {HTMLSpanElement} element the span to fill
 */
function exwod_doDotFill(element){
    //Get data value
    var val = element.getAttribute(HTMLATTRIBUTE_DATA_VALUE);
    //debugger;
    var ratingDiv = exwod_getAncestorOfClassName(element,CLASSNAME_TRAIT_RATING);
    var valueDiv = ratingDiv.getElementsByClassName(CLASSNAME_VALUE_STORAGE)[0];
    
    //check if this is a one-dot trait that can be cleared
    if (val == 1 && 
        valueDiv.innerHTML == 1 &&
        !ratingDiv.classList.contains(CLASSNAME_MINIMUM_ONE)){
        //if we have clicked on 1 and  we already have a 1 value, clear it
        val = 0;
    }
    valueDiv.innerHTML = val;
    var numDots;
    if (ratingDiv.classList.contains(CLASSNAME_FIVE_DOT)){
        numDots = FIVE_DOTS;
    } else if (ratingDiv.classList.contans(CLASSNAME_TEN_DOT)){
        numDots = TEN_DOTS;
    } else {
        numDots = 1;
    }

	//Get containers from span parent
	var containers = exwod_getSiblingsOfSameClass(element.parentNode);
    
    /** Note that this loop is 1-based, not 0-based */
    for (var i = 1; i <= numDots; i++){
        var idx = i-1;
    	if (i<=val){
        	containers[idx].getElementsByClassName(CLASSNAME_EXWOD_DOT)[0].style.backgroundColor="black";
        }
        else{
        	containers[idx].getElementsByClassName(CLASSNAME_EXWOD_DOT)[0].style.backgroundColor="white";
        }
    }
    
}

/**
 * Gets an array of the sibiling elements of the same class as
 * the parameter element
 * @param {HTMLElement} element the HTMLElement to find siblings for
 * @returns {!Array<HTMLElement>} array of siblings of the same class
 */
 function exwod_getSiblingsOfSameClass(element){
	var parent = element.parentNode;
    var sibs = [];
    if (!parent) { return sibs; }
    return parent.getElementsByClassName(element.className);
}

/**
 * Navigates up the DOM to find an HTML element with the class
 * @param {HTMLElement} element starting element
 * @param {String} classname name of a class to search for
 * @returns ancestor element with a class name that contains the search term, or null
 */
function exwod_getAncestorOfClassName(element,classname){
    var pNode = element.parentNode;
    //debugger;
    while(pNode){
        if (pNode.classList.contains(classname)){
            return pNode;
        }
        pNode = pNode.parentNode;
    }
    return null;
}


/**
 * Takes a series of class name strings and returns a string appropriate as a parameter 
 * for the HTMLElement.setClassName() method
 * @param  {...String} classNames List of class names to create a string for
 * @returns string containing a space-separated list of class names
 */
function exwod_getClassList(...classNames){
    var stringList = classNames[0];
    for (var i = 1; i< classNames.length; i++){
        stringList += " " + classNames[i];
    }
    return stringList;
}

function exwod_dataChange(options) {
    console.log("dataChange. " + options['fieldName'] + " = " + options['fieldValue']);
}