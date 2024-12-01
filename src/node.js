/*
 * Node testing and processing
 */

/*
 * @params: {JSON} single JSON node object
 * @returns: <string>, string of formatted note text with indents & newlines
 */
const processNote = (node, indentTxt) => {
  let note = "";
  if (node.note) {
    let lines = node.note.split('\n');
    let prefixedLines = []
    lines.forEach(l => {
      prefixedLines.push(indentTxt + l);
    });
    note = '\n' + prefixedLines.join(`\n`);
  }

  return note;
}

module.exports = {
  processNote,
}
