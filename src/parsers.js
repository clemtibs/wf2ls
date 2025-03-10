/* JSON Parsers
 *
 * These prep JSON of various formats for conversion to LogSeq compliant markdown
 * using convertToMd()
 * 
 * convertToMd() requires JSON objects of the same structure as the source,
 * with minor formatting cleanup and the following properties per node:
 *
 *   <name:string>, required, cannot be empty
 *   <id:string>, required, must be a valid UUID
 *   <metadata:object>, required, ok if empty, is empty by default
 *   [<note:string>], optional
 *   [<completed:string>], optional
 *   [<children:array>], optional, cannot be empty, contains n...
 *                        JSON objects of same structure and parameters
 *
 *   All strings must be trimmed for whitespaces and newlines at start and end,
 *   but may contain newlines within the text.
 *
 *   The root level of every JSON data object passed from parseWfData() through
 *   to convertToMd() needs to be an array.
 *
 *   As much as possible, make any structural modifications (adding/deleting
 *   items, especially sibling nodes) at this stage when writing to newData.
 *   convertToMd() modifies children before recursing, which is safe, but
 *   needing to add sibling nodes (like for templates buttons), or delete empty
 *   or blank nodes should happen here.
 */

import { 
  makeNode,
  nodeIsBacklink, 
  nodeIsMirror,
  nodeIsTemplate,
  nodeIsTemplateButton
} from './node.js';
import {
  stripTag
} from './text.js';

/* Workflowy backup file format and structure.
 *
 * @params: 
 *   <state:object>, instance of AppState object
 *   <data:array>, raw JSON data loaded from Workflowy .backup file. Load with 
 *           readJsonFile(). Top level JSON structure is an array.
 * @returns: <JSON array>
 */
const parseWfData = (state, data) => {
  let newData = [];
  for (let node of data) {
    if (node.nm !== "" || nodeIsMirror(node)) {
      let newNode = { metadata: {}};
      let templateButtonNode;
      state.addJob()
      state.registerPageRef(node);
      newNode.id = node.id;
      newNode.name = node.nm.trim();
      if (node.hasOwnProperty('ct')) newNode.created = node.ct;
      if (node.hasOwnProperty('lm')) newNode.modified = node.lm;
      if (node.hasOwnProperty('no')) newNode.note = node.no.trim();
      if (node.hasOwnProperty('cp')) newNode.completed = node.cp;
      if (node.metadata.hasOwnProperty('layoutMode')) newNode.metadata.layoutMode = node.metadata.layoutMode;
      if (node.metadata.hasOwnProperty('mirror')) newNode.metadata.mirror = node.metadata.mirror;
      if (nodeIsTemplate(newNode)) {
        state.registerTemplateName(newNode);
        // Make a new node for the template button
        templateButtonNode = makeNode({
          name: `${stripTag('#template', newNode.name)} #use-template:${newNode.id.split("-")[4]}` 
        })
      }
      if (node.hasOwnProperty('ch')) {
        // If children nodes are backlinks, then we need to have this node show
        // it's ID so that others can reference them. This is only for internal
        // workflowy links. Mirrors are handled seperately and contain the
        // targets in thier metadata already.
        if (nodeIsBacklink(node.ch[0])) newNode.metadata.isReferencesRoot = true;
        if (!(node.ch.length === 1 && nodeIsBacklink(node.ch[0])) &&
            !(node.ch.length === 1 && nodeIsTemplateButton(newNode))) {
          newNode.children = parseWfData(state, node.ch); 
        }
      }

      newData.push(newNode)

      // Insert template button after the template definition node
      if (templateButtonNode) {
        state.addJob()
        newData.push(templateButtonNode)
      }
    } else {
      continue;
    }
  };
  return newData;
}

export { parseWfData };
