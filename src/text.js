/** Text tools **/

const tagInText = (tag, str) => {
  return (str ?? '').includes(tag);
}

const stripTag = (tag, str) => {
  return (str ?? '').replace(tag, '');
}

const toPageLink = (str) => {
  return `[[ ${(str ?? 'Orphans')} ]]` 
}

const makeBlockPrefix = (indentSize, indentLvl) => {
  if (indentLvl < 0) {
    return ""
  } else {
    return " ".repeat(indentSize * indentLvl) + "- ";
  }
}

const makeNotePrefix = (indentSize, indentLvl) => {
  if (indentLvl < 0) {
    return ""
  } else {
    return " ".repeat(indentSize * indentLvl) + "  ";
  }
}

/**
 * This function takes a string as input, removes tags and unused symbols, 
 * and returns a cleaner version of the string.
 *
 * @param {string} inputStr - The input string to be cleaned.
 * @returns {string} The cleaned string.
 */
// const cleanString = (inputStr) => {
    // let cleanedStr = inputStr.replace(/\([^)]*\)/g, '');
    // cleanedStr = cleanedStr.split('·')[0];
    // cleanedStr = cleanedStr.trim();
    // return cleanedStr;
// }

export {
  tagInText,
  stripTag,
  toPageLink,
  makeBlockPrefix,
  makeNotePrefix
};
