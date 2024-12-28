/* Text Tools
 *
 */

/*
 * @params:
 *    <node:object>, single JSON node object
 *    <prefix:string>, a string containing each lines indent content
 * @returns: <string>, string of formatted note text with original indents &
 *           newlines plus a newline at the start.
 */
const indentLines = (content, prefix) => {
  let output = "";
  let trimmedContent = content.trim();
  let lines = trimmedContent.split('\n');
  let prefixedLines = []
  lines.forEach(l => {
    prefixedLines.push(prefix + l);
  });
  output = '\n' + prefixedLines.join(`\n`);
  return output;
}

const tagInText = (tag, str) => {
  if (tag === '') {
    return false
  } else {
    return (str ?? '').includes(tag);
  }
}

const stripTag = (tag, str) => {
  return (str ?? '').replace(tag, '');
}

const toPageLink = (str) => {
  if (str === '' || str.trim().length === 0) {
    return `[[ Orphans ]]` 
  } else {
    let trimmed = str.trim();
    return `[[ ${trimmed} ]]` 
  }
}

const makeBlockNamePrefix = (indentSize, indentLvl) => {
  return " ".repeat(indentSize * indentLvl) + "- ";
}

const makeBlockNotePrefix = (indentSize, indentLvl) => {
  return " ".repeat(indentSize * indentLvl) + "  ";
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
  indentLines,
  tagInText,
  stripTag,
  toPageLink,
  makeBlockNamePrefix,
  makeBlockNotePrefix
};
