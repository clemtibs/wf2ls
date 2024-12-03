import utils from './utils.js';
import { processNote } from './node.js';
import {
  tagInText,
  stripTag,
  toPageLink,
  makeBlockPrefix,
  makeNotePrefix
} from './text.js';

/*
 * @params:
 *   {AppState}, application state object
 *   {mainConfig}, application config object
 *   <pageName:string>, name of current page being processed
 *   {node:JSON}, current JSON node object
 *   <nNodes:int>, total number of children nodes in {node}
 *   <nNodes:int>, level of indenting for next set of children nodes
 *   <isNewPage:bool>, tell new recursive branch that it's starting a new page
 * @returns: <null>, appends to pages map in {AppState}
 */
const parse2md = (state, conf, pageName, node, nNodes, indentLvl, isNewPage) => {
  pageName ? pageName : pageName = "content";
  indentLvl ? indentLvl : indentLvl = 0;
  isNewPage ? isNewPage : isNewPage = false;
  let pageBlocks = [];
  for (let n of node) {
    state.incrementJobProgress();
    if (n.name !== "") {
      let name = n.name.trim();
      let note = "";
      let completed = "";
      let marker = "";
      if (tagInText(conf.newPageTag, n.name) ||
          tagInText(conf.newPageTag, n.note) &&
          !isNewPage) {
            let pName = stripTag(conf.newPageTag, name).trim();
            n.name = toPageLink(pName);
            name = n.name;
            n.note = stripTag(conf.newPageTag, n.note).trim();
            let newNode = n.children;
            newNode.unshift(utils.makeNode(
              processNote( {note: n.note}, makeNotePrefix(conf.indentSpaces, 0)),
              ''));
            state.addJob();
            pageBlocks.push(makeBlockPrefix(conf.indentSpaces, indentLvl) + name);
            parse2md(
              state,
              conf,
              pName.trim(),
              newNode,
              newNode.length,
              0,
              true
            );
            nNodes--;
            continue;
      }

      note = processNote(n, makeNotePrefix(conf.indentSpaces, indentLvl));

      if (n.layoutMode === "todo") {
        marker = "TODO ";
        if (n.completed) {
          completed = "\n" + makeNotePrefix(conf.indentSpaces, indentLvl) + "completed-on:: " + n.completed;
          marker = "COMPLETED ";
        }
      }

      pageBlocks.push(makeBlockPrefix(conf.indentSpaces, indentLvl) + marker + name + completed + note);

      if (n.children) {
        pageBlocks.push(parse2md(
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

export { parse2md };
