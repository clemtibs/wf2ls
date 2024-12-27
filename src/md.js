/* MD Converter
 *
 * The main loop that works over the data prepared by the parsers to do the
 * actual conversions and translations.
 *
 */
import { 
  indentNote,
  makeNode,
  nodeIsTodo
} from './node.js';
import {
  tagInText,
  stripTag,
  toPageLink,
  makeBlockNamePrefix,
  makeBlockNotePrefix
} from './text.js';

/*
 * @params:
 *   <state:object>, instance of AppState object
 *   <conf:object>, instance of mainConfig object
 *   <pageName:string>, name of current page being processed
 *   <nodes:array>, array of JSON node objects
 *   <nNodes:int>, total number of children nodes in [nodes]
 *   <indentLvl:int>, level of indenting for next set of children nodes
 *   <isNewPage:bool>, tell new recursive branch that it's starting a new page
 * @returns: <null>, appends to pages map in <state>
 */
const convertToMd = (state, conf, pageName, nodes, nNodes, indentLvl, isNewPage) => {
  pageName ? pageName : pageName = "content";
  indentLvl ? indentLvl : indentLvl = 0;
  isNewPage ? isNewPage : isNewPage = false;
  let pageBlocks = [];
  let newPageTag = conf.get("newPageTag");
  let indentSpaces = conf.get("indentSpaces");
  for (let n of nodes) {
    state.incrementJobProgress();
    if (n.name !== "") {
      let name = n.name.trim();
      let note = "";
      let completed = "";
      let marker = "";
      if (tagInText(newPageTag, n.name) ||
          tagInText(newPageTag, n.note) &&
          !isNewPage) {
            let pageName = stripTag(newPageTag, name).trim();
            name = toPageLink(pageName);
            note = stripTag(newPageTag, n.note).trim();
            let childrenNodes = n.children;
            childrenNodes.unshift(
              makeNode({
                name: indentNote(
                  {note: note},
                  makeBlockNotePrefix(indentSpaces, 0)
                ),
              })
            );
            state.addJob();
            pageBlocks.push(makeBlockNamePrefix(indentSpaces, indentLvl) + name);
            convertToMd(
              state,
              conf,
              pageName.trim(),
              childrenNodes,
              childrenNodes.length,
              0,
              true
            );
            nNodes--;
            continue;
      }

      note = indentNote(n, makeBlockNotePrefix(indentSpaces, indentLvl));

      if (nodeIsTodo(n)) {
        marker = "TODO ";
        if (n.completed) {
          completed = "\n" + makeBlockNotePrefix(indentSpaces, indentLvl) + "completed-on:: " + toPageLink(n.completed);
          marker = "DONE ";
        }
      }

      pageBlocks.push(
        makeBlockNamePrefix(indentSpaces, indentLvl) + marker + name
        + completed
        + note);

      if (n.children) {
        pageBlocks.push(convertToMd(
          state,
          conf,
          pageName.trim(),
          n.children,
          n.children.length,
          indentLvl + 1,
          false));
      }
    }
    nNodes--;
  };

  if (nNodes === 0 && indentLvl > 0) {
    return pageBlocks.join('\n');
  }

  state.addPage(pageName.trim(), pageBlocks.join('\n'));
}

export { convertToMd };
