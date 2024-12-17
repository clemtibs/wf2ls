/*
 * Node testing and processing
 */

/*
 * @params: {JSON} single JSON node object
 * @returns: <string>, string of formatted note text with indents & newlines
 */
const indentNote = (node, prefix) => {
  let note = "";
  if (node.note) {
    let lines = node.note.split('\n');
    let prefixedLines = []
    lines.forEach(l => {
      prefixedLines.push(prefix + l);
    });
    note = '\n' + prefixedLines.join(`\n`);
  }

  return note;
}

const nodeIsBacklink = (node) => {
  if (node.metadata.isReferencesRoot) {
    return true;
  } else {
    return false;
  }
}

export {
  indentNote,
  nodeIsBacklink
};
