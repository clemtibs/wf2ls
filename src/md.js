/* MD Converter
 *
 * The main loop that works over the data prepared by the parsers to do the
 * actual conversions and translations.
 *
 */
import { default as TurndownService } from 'turndown';

import { 
  makeNode,
  nodeHasNote,
  nodeIsH1,
  nodeIsH2,
  nodeIsParagraph,
  nodeIsQuoteBlock,
  nodeIsCodeBlock,
  nodeIsTodo
} from './node.js';
import {
  indentLines,
  linkTextToUrl,
  tagInText,
  stripTag,
  toPageLink,
  makeBlockNamePrefix,
  makeBlockNotePrefix
} from './text.js';

const tdConfig = {
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '_',
  strongDelimmiter: '**',
  linkStyle: 'inlined'
}

const customTdRules = {
  strikethrough: {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
      return '~~' + content + '~~';
    }
  },
  emptyLinks: {
    filter: function (node, options) {
      return (
        node.nodeName === 'A' &&
        node.innerHTML === '' &&
        node.getAttribute('href')
      )
    },
    replacement: function (content, node, options) {
      return ` [${node.getAttribute('href')}](${node.getAttribute('href')})`;
    }
  }
}

const convertHtmlToMd = (content) => {
  const td = new TurndownService(tdConfig);
  td.keep(['u']);

  for (const [key, value] of Object.entries(customTdRules)) {
    td.addRule(key, value);
  }

  let lines = content.split('\n');
  let mdResult = []
  for (let l of lines) {
    if (l.includes('\n')) {
      mdResult.push(l);
    } else {
      mdResult.push(td.turndown(l));
    }
  }

  return mdResult.join('\n');
}

/*
 * @params:
 *   <state:object>, instance of AppState object
 *   <conf:object>, instance of mainConfig object
 *   <pageName:string>, name of current page being processed
 *   <nodes:array>, array of JSON node objects
 *   <nNodes:int>, total number of children nodes in [nodes]
 *   <indentLvl:int>, level of indenting for next set of children nodes
 * @returns: <null>, appends to pages map in <state>
 */
const convertToMd = (state, conf, pageName, nodes, nNodes, indentLvl) => {
  pageName ? pageName : pageName = "content";
  indentLvl ? indentLvl : indentLvl = 0;
  let pageBlocks = [];
  let newPageTag = conf.get("newPageTag");
  let indentSpaces = conf.get("indentSpaces");
  for (let n of nodes) {
    state.incrementJobProgress();
    if (n.name !== "") {
      let name = convertHtmlToMd(linkTextToUrl(n.name.trim()));
      let note = convertHtmlToMd(linkTextToUrl(n.note ?? ""));
      let completed = "";
      let marker = "";
      if (tagInText(newPageTag, name) || tagInText(newPageTag, note)) {
        let pageName = stripTag(newPageTag, name).trim();
        name = toPageLink(pageName);
        note = stripTag(newPageTag, note).trim();
        let childrenNodes = n.children;
        childrenNodes.unshift(
          makeNode({
            name: note.split('\n')[0],
            note: note.split('\n').slice(1).join('\n')
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
          0
        );
        nNodes--;
        continue;
      }

      switch (true) {
        case nodeIsTodo(n):
          marker = "TODO ";
          if (n.completed) {
            completed = "\n" + makeBlockNotePrefix(indentSpaces, indentLvl) + "completed-on:: " + toPageLink(n.completed);
            marker = "DONE ";
          }
          break;
        case nodeIsH1(n):
          name = "# " + name;
          break;
        case nodeIsH2(n):
          name = "## " + name;
          break;
        case nodeIsParagraph(n):
          // do nothing
          break;
        // case nodeIsBoard(n):
          // not implemented yet
          // break;
        case nodeIsQuoteBlock(n):
          name = "> " + name + "\n";
          break;
        case nodeIsCodeBlock(n):
          let nameContent = name;
          name = "```";
          note = nameContent + "\n```\n" + note;
          break;
      }
     
      if (note !== "") {
        note = indentLines(note, makeBlockNotePrefix(indentSpaces, indentLvl));
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
        ));
      }
    }
    nNodes--;
  };

  if (nNodes === 0 && indentLvl > 0) {
    return pageBlocks.join('\n');
  }

  state.addPage(pageName.trim(), pageBlocks.join('\n'));
}

export { 
  convertToMd,
  convertHtmlToMd
};
