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
 */

import date from './date.js';
import { nodeIsBacklink } from './node.js';

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
    if (node.nm !== "") {
      let newNode = { metadata: {}};
      state.addJob()
      newNode.id = node.id;
      // if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, newNode);
      newNode.name = node.nm.trim();
      // if (node.ct) newNode.created = date.wfTimeToLocalTime(node.ct, date.WF_EPOCH_SECONDS_PST);
      if (node.no) newNode.note = node.no.trim();
      if (node.cp) newNode.completed = date.wfTimeToLocalTime(node.cp, date.WF_EPOCH_SECONDS_PST);
      if (node.metadata.layoutMode === "todo") newNode.metadata.layoutMode = "todo";
      // newNode.lastModified = date.wfTimeToLocalTime(node.lm, date.WF_EPOCH_SECONDS_PST);
      // node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
      if (node.ch) {
        if (!(node.ch.length === 1 && nodeIsBacklink(node.ch[0]))) {
          newNode.children = parseWfData(state, node.ch); 
        }
      }
      newData.push(newNode)
    } else {
      continue;
    }
  };
  return newData;
}

export { parseWfData };
