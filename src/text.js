/* Text Tools
 *
 */
import * as linkify from 'linkifyjs';
import linkifyHtml from 'linkify-html';

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

const linkifyAmpersatTags = (content) => {
  const ampRegex = /@([a-zA-z]+)/g;
  let modContent = content;

  let matches = content.matchAll(ampRegex);
  if (matches) {
    for (const m of matches) {
      modContent = modContent.replace(`@${m[1]}`, `[[@/${m[1]}]]`)
    }
  }

  return modContent;
}

const linkTextToUrl = (text) => {
  const linkifyOptions = {
    defaultProtocol: 'https'
  };
  return linkifyHtml(text, linkifyOptions);
}

const mdLinkInText = (str) => {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  if (mdLinkRegex.test(str)) {
    return true;
  } else {
    return false;
  }
}

const stripMdLink = (str) => {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  return str.replace(mdLinkRegex, () => { return '' })
}

const extractUrlFromMd = (str) => {
  /* Courtesy of: https://davidwells.io/snippets/regex-match-markdown-links
  *
  /* Match only links that are fully qualified with https */
  // const fullLinkOnlyRegex = /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/
  /* Match full links and relative paths */
  // const regex = /^\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+)\)$/
  const regex = /\[([^\]]+)\]\(([^)]+)\)/;
  const match = str.match(regex) ?? [];
  let result = {
    full: match[0],
    text: match[1],
    url: match[2]
  }
  return result;
}

const replacePageRefWithUuid = (state, str) => {
  // Can't figure out how to combine these into one go...don't care.
  const pageRefRegex = /\(\(([0-9a-fA-F]{12})\)\)/g;
  const pageRefMdRegex = /\[([^\]]+)\]\(([0-9a-fA-F]{12})\)/g;
  let modStr = str;

  let refMatches = str.matchAll(pageRefRegex);
  if (refMatches) {
    for (const m of refMatches) {
      modStr = modStr.replace(`((${m[1]}))`, `((${state.getNodeIdByPageRef(m[1])}))`);
    }
  }

  let mdMatches = str.matchAll(pageRefMdRegex);
  if (mdMatches) {
    for (const m of mdMatches) {
      modStr = modStr.replace(`[${m[1]}](${m[2]})`, `[${m[1]}](${state.getNodeIdByPageRef(m[2])})`);
    }
  }

  return modStr
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
  extractUrlFromMd,
  indentLines,
  linkifyAmpersatTags,
  linkTextToUrl,
  tagInText,
  replacePageRefWithUuid,
  stripMdLink,
  stripTag,
  toPageLink,
  mdLinkInText,
  makeBlockNamePrefix,
  makeBlockNotePrefix
};
