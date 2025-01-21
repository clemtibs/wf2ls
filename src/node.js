/* Node Testing and Processing
 *
 */
import { default as _ } from 'lodash';

import { 
  mdLinkInText,
  stripMdLink,
  tagInText
} from './text.js';

import { convertHtmlToMd } from './md.js'

/*
 * @params: 
 *    [empty]
 *    OR
 *    {props}, object defining any of:
 *      <id:string>, default: randomUUID()
 *      <name:string>, default: ''
 *      <note:string>, default: nonexistent
 *      <completed:string>, default: nonexistent
 *      <children:array>, default: nonexistent,
 *          can include an array of recursive makeNode() functions
 * @returns: {node}, node object compatible with convertToMd()
 */
const makeNode = (props) => {
  props = (props ?? {});
  let newNode = { metadata: {}};

  // must always have id
  props.id ? newNode.id = props.id : newNode.id = crypto.randomUUID();
  // must always have name if not specfically using 'nm'.
  if (props.hasOwnProperty('nm')) {
    props.nm ? newNode.nm = props.nm : newNode.nm = '';
  } else {
    props.name ? newNode.name = props.name : newNode.name = '';
  }
  if (props.note) newNode.note = props.note;
  if (props.no) newNode.no = props.no;
  if (props.completed) newNode.completed = props.completed;
  if (props.cp) newNode.cp = props.cp;
  if (props.children) newNode.children = props.children;
  if (props.ch) newNode.ch = props.ch;

  return newNode;
}

const nodeHasNote = (node) => {
  if (node.note) {
    return true;
  } else {
    return false;
  }
}

const nodeIsBacklink = (node) => {
  if (node.metadata.isReferencesRoot) {
    return true;
  } else {
    return false;
  }
}

// This needs a config to give convertHtmlToMd access to the turndown rules.
// At this stage in convertToMd(), children nodes haven't been converted yet,
// so we must do so in order to test for them as MD. I decided to do this
// rather than some one-off regex to make sure that conversion and detection is
// consistent.
const nodeIsChildBookmark = (config, node) => {
  if (node.children?.length === 1) { // has one child
    const child = node.children[0];
    if (!mdLinkInText(node.name) && // no link in name
        !mdLinkInText(node.note) && // no link in note
        mdLinkInText(convertHtmlToMd(config, child.name)) && // has link in child name
        (!child.hasOwnProperty('note') || (child.note?.trim() ?? '') === '') && // no child note content
        !child.hasOwnProperty('children') && // child has no children
        stripMdLink(convertHtmlToMd(config, child.name)).trim() === '') { // if child name has just the link
      return true;
    }
  }
  return false;
}

const nodeIsNoteBookmark = (node) => {
  if (!mdLinkInText(node.name) && mdLinkInText(node.note)) {
    if (stripMdLink(node.note).trim() === '') {
      return true;
    }
  }
  return false;
}

const nodeIsBoard = (node) => {
  if (node.metadata.layoutMode === 'board') {
    return true;
  } else {
    return false;
  }
}

const nodeIsBullet = (node) => {
  if (_.isEmpty(node.metadata)) {
    return true;
  } else {
    return false;
  }
}

const nodeIsCodeBlock = (node) => {
  if (node.metadata.layoutMode === 'code-block') {
    return true;
  } else {
    return false;
  }
}

const nodeIsH1 = (node) => {
  if (node.metadata.layoutMode === 'h1') {
    return true;
  } else {
    return false;
  }
}

const nodeIsH2 = (node) => {
  if (node.metadata.layoutMode === 'h2') {
    return true;
  } else {
    return false;
  }
}

const nodeIsMirror = (node) => {
  if (node.metadata.hasOwnProperty('mirror')) {
    return true;
  } else {
    return false;
  }
}

const nodeIsMirrorRoot = (node) => {
  if (node.metadata?.mirror?.hasOwnProperty('mirrorRootIds')) {
    return true;
  } else {
    return false;
  }
}

const nodeIsMirrorVirtualRoot = (node) => {
  if (node.metadata?.mirror?.hasOwnProperty('originalId')) {
    return true;
  } else {
    return false;
  }
}

const nodeIsParagraph = (node) => {
  if (node.metadata.layoutMode === 'p') {
    return true;
  } else {
    return false;
  }
}

const nodeIsQuoteBlock = (node) => {
  if (node.metadata.layoutMode === 'quote-block') {
    return true;
  } else {
    return false;
  }
}

const nodeIsTemplate = (node) => {
  if (tagInText('#template', node.name)) {
    return true;
  } else {
    return false;
  }
}

const nodeIsTemplateButton = (node) => {
  if (tagInText('#use-template:', node.name)) {
    return true;
  } else {
    return false;
  }
}

const nodeIsTodo = (node) => {
  if (node.metadata.layoutMode === 'todo') {
    return true;
  } else {
    return false;
  }
}

export {
  makeNode,
  nodeHasNote,
  nodeIsBacklink,
  nodeIsChildBookmark,
  nodeIsNoteBookmark,
  nodeIsBullet,
  nodeIsBoard,
  nodeIsCodeBlock,
  nodeIsH1,
  nodeIsH2,
  nodeIsMirror,
  nodeIsMirrorRoot,
  nodeIsMirrorVirtualRoot,
  nodeIsParagraph,
  nodeIsQuoteBlock,
  nodeIsTemplate,
  nodeIsTemplateButton,
  nodeIsTodo
}
