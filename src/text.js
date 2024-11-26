/** Text tools **/
const { config } = require('./config.js');

const tagInText = (tag, str) => {
  return (str ?? '').includes(tag);
}

const stripTag = (tag, str) => {
  return (str ?? '').replace(tag, '');
}

const toPageLink = (str) => {
  return `[[ ${(str ?? 'Orphans')} ]]` 
}

const makeBlockPrefix = (indentLvl) => {
  if (indentLvl < 0) {
    return ""
  } else {
    return " ".repeat(config.indentSpaces * indentLvl) + "- ";
  }
}

const makeNotePrefix = (indentLvl) => {
  if (indentLvl < 0) {
    return ""
  } else {
    return " ".repeat(config.indentSpaces * indentLvl) + "  ";
  }
}

/**
 * This function takes a string as input, removes tags and unused symbols, 
 * and returns a cl*eaner version of the string.
 *
 * @param {string} inputStr - The input string to be cleaned.
 * @returns {string} The cleaned string.
 */
const cleanString = (inputStr) => {
    let cleanedStr = inputStr.replace(/\([^)]*\)/g, '');
    cleanedStr = cleanedStr.split('·')[0];
    cleanedStr = cleanedStr.trim();
    return cleanedStr;
}

module.exports = {
  tagInText,
  stripTag,
  toPageLink,
  makeBlockPrefix,
  makeNotePrefix
}
