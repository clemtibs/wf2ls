/*
 * Node testing and processing
 */
import { default as _ } from 'lodash';

/*
 * @params: {JSON} single JSON node object
 * @returns: <string>, string of formatted note text with indents & newlines
 */
const indentNote = (node, prefix) => {
  let note = "";
  if (node.note) {
    let trimmedNote = node.note.trim();
    let lines = trimmedNote.split('\n');
    let prefixedLines = []
    lines.forEach(l => {
      prefixedLines.push(prefix + l);
    });
    note = '\n' + prefixedLines.join(`\n`);
  }

  return note;
}

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
  let newNode = {};

  props.id ? newNode.id = props.id : newNode.id = crypto.randomUUID();
  props.name ? newNode.name = props.name : newNode.name = '';
  if (props.note) newNode.note = props.note;
  if (props.completed) newNode.completed = props.completed;
  if (props.children) newNode.children = props.children;

  return newNode;
}

const nodeIsBacklink = (node) => {
  if (node.metadata.isReferencesRoot) {
    return true;
  } else {
    return false;
  }
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

const nodeIsTodo = (node) => {
  if (node.metadata.layoutMode === 'todo') {
    return true;
  } else {
    return false;
  }
}

export {
  indentNote,
  makeNode,
  nodeIsBacklink,
  nodeIsBullet,
  nodeIsBoard,
  nodeIsCodeBlock,
  nodeIsH1,
  nodeIsH2,
  nodeIsParagraph,
  nodeIsQuoteBlock,
  nodeIsTodo
}
