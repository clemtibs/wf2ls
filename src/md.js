/* MD Converter
 *
 * The main loop that works over the data prepared by the parsers to do the
 * actual conversions and translations.
 *
 */
import { default as TurndownService } from 'turndown';

import { formatDate } from './date.js';
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

// defined here, loaded in config.js, accessed via config object
const turndownDefaultConfig = {
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '_',
  strongDelimmiter: '**',
  linkStyle: 'inlined'
}

// defined here, loaded dynamically in config.js based on value of 'textColorMarkupMode'
const turndownSpanPluginRules = {
  spanTextColorPlugin: {
    filter: function (node, options) {
      return (
        node.nodeName === 'SPAN' &&
        node.getAttribute('class').split(" ")[1].split("-")[0] === 'c'
      )
    },
    replacement: function (content, node, options) {
      let color = node.getAttribute('class').split(" ")[1].split("-")[1];
      return `<span class="${color}">${content}</span>`;
    }
  },
  spanHighlightPlugin: {
    filter: function (node, options) {
      return (
        node.nodeName === 'SPAN' &&
        node.getAttribute('class').split(" ")[1].split("-")[0] === 'bc'
      )
    },
    replacement: function (content, node, options) {
      let color = node.getAttribute('class').split(" ")[1].split("-")[1];

      return `<mark class="${color}">${content}</mark>`;
    }
  }
}

// defined here, loaded dynamically in config.js based on value of 'textColorMarkupMode'
const turndownSpanDefaultRules = {
  spanTextColorDefault: {
    filter: function (node, options) {
      return (
        node.nodeName === 'SPAN' &&
        node.getAttribute('class').split(" ")[1].split("-")[0] === 'c'
      )
    },
    replacement: function (content, node, options) {
      let color = node.getAttribute('class').split(" ")[1].split("-")[1];
      let makeColorSpan = (color) => {
        return `[[$${color}]]==${content}==`;
      }
      let result;

      switch (color) {
        case 'orange':
          result = makeColorSpan('red');
          break;
        case 'yellow':
          result = makeColorSpan('red');
          break;
        case 'teal':
          result = makeColorSpan('green');
          break;
        case 'sky':
          result = makeColorSpan('blue');
          break;
        case 'purple':
          result = makeColorSpan('red');
          break;
        case 'pink':
          result = makeColorSpan('red');
          break;
        case 'gray':
          result = makeColorSpan('blue');
          break;
        default:
          result = makeColorSpan(color);
      }

      return result;
    }
  },
  spanHighlightDefault: {
    filter: function (node, options) {
      return (
        node.nodeName === 'SPAN' &&
        node.getAttribute('class').split(" ")[1].split("-")[0] === 'bc'
      )
    },
    replacement: function (content, node, options) {
      let color = node.getAttribute('class').split(" ")[1].split("-")[1];
      let defaultHl = (color) => {
        return `[[#${color}]]==${content}==`;
      }
      let yellowHl = `==${content}==`;
      let result;

      switch (color) {
        case 'orange':
          result = yellowHl;
          break;
        case 'yellow':
          result = yellowHl;
          break;
        case 'teal':
          result = defaultHl('green');
          break;
        case 'sky':
          result = defaultHl('blue');
          break;
        case 'purple':
          result = defaultHl('red');
          break;
        case 'pink':
          result = defaultHl('red');
          break;
        case 'gray':
          result = yellowHl;
          break;
        default:
          result = defaultHl(color);
      }

      return result;
    }
  }
}

// defined here, loaded in config.js, accessed via config object
const turndownDefaultCustomRules = {
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
  },
  spanTextColor: turndownSpanDefaultRules.spanTextColorDefault,
  spanHighlight: turndownSpanDefaultRules.spanHighlightDefault,
  dates: {
    filter: function (node, options) {
      return (
        node.nodeName === 'TIME'
      )
    },
    replacement: function (content, node, options, dFormat) {
      const d = {
        startYear: node.getAttribute('startYear'),
        endYear: node.getAttribute('endYear'),
        startMonth: node.getAttribute('startMonth'),
        endMonth: node.getAttribute('endMonth'),
        startDay: node.getAttribute('startDay'),
        endDay: node.getAttribute('endDay'),
        startHour: node.getAttribute('startHour'),
        endHour: node.getAttribute('endHour'),
        startMinute: node.getAttribute('startMinute'),
        endMinute: node.getAttribute('endMinute'),
      }
      
      return `[[ ${formatDate(d, dFormat)} ]]`
    }
  }
}

const convertHtmlToMd = (config, content) => {
  const td = new TurndownService(config.get('turndownConfig'));
  td.keep(['u']);

  for (const [key, value] of Object.entries(config.get('turndownCustomRules'))) {
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
      let name = convertHtmlToMd(conf, linkTextToUrl(n.name.trim()));
      let note = convertHtmlToMd(conf, linkTextToUrl(n.note ?? ""));
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
  convertHtmlToMd,
  turndownDefaultConfig,
  turndownDefaultCustomRules,
  turndownSpanPluginRules,
  turndownSpanDefaultRules
};
