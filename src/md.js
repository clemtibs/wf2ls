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
  nodeIsChildBookmark,
  nodeIsMirrorRoot,
  nodeIsMirrorVirtualRoot,
  nodeIsNoteBookmark,
  nodeIsParagraph,
  nodeIsQuoteBlock,
  nodeIsCodeBlock,
  nodeIsTodo
} from './node.js';
import {
  extractUrlFromMd,
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
    n.name = convertHtmlToMd(conf, linkTextToUrl(n.name.trim()));
    n.note = convertHtmlToMd(conf, linkTextToUrl(n.note ?? ""));
    let id = "";
    let completed = "";
    let collapsed = "";
    let marker = "";

    // Splitting off new pages.
    if (tagInText(newPageTag, n.name) || tagInText(newPageTag, n.note)) {
      let newPageName = stripTag(newPageTag, n.name).trim();
      let linkToNewPage = toPageLink(newPageName);
      let newPageTopNodeContent = stripTag(newPageTag, n.note).trim();
      let newPageChildren = n.children;
      // Insert this nodes content as a new first child on the new page
      newPageChildren.unshift(
        makeNode({
          name: newPageTopNodeContent.split('\n')[0],
          note: newPageTopNodeContent.split('\n').slice(1).join('\n')
        })
      );
      state.addJob();
      // Push the page link on the source page
      pageBlocks.push(makeBlockNamePrefix(indentSpaces, indentLvl) + linkToNewPage);
      // Recurse into the new page path
      convertToMd(
        state,
        conf,
        newPageName.trim(),
        newPageChildren,
        newPageChildren.length,
        0
      );
      nNodes--;
      continue;
    }
    
    // Special node types
    switch (true) {
      case nodeIsTodo(n):
        marker = "TODO ";
        if (n.hasOwnProperty('completed')) {
          completed = `\n${makeBlockNotePrefix(indentSpaces, indentLvl)}completed-on:: ${toPageLink(n.completed)}`;
          marker = "DONE ";
        }
        break;
      case nodeIsH1(n):
        n.name = "# " + n.name;
        break;
      case nodeIsH2(n):
        n.name = "## " + n.name;
        break;
      case nodeIsParagraph(n):
        // do nothing
        break;
      // case nodeIsBoard(n):
        // not implemented yet
        // break;
      // TODO: multi-line quotes and codeblocks? This needs some revisiting.
      //       Splitting the content between name and note is fragile when adding
      //       properties.
      case nodeIsQuoteBlock(n):
        n.name = "> " + n.name + "\n";
        break;
      case nodeIsCodeBlock(n):
        let nameContent = n.name;
        n.name = "```";
        n.note = nameContent + "\n```\n" + n.note;
        break;
      case nodeIsChildBookmark(conf, n):
        let childUrlInfo = extractUrlFromMd(convertHtmlToMd(conf, n.children[0].name));
        n.name = `[${n.name}](${childUrlInfo.url})`;
        delete n.children;
        state.incrementJobProgress();
        break;
      case nodeIsNoteBookmark(n):
        let nodeUrlInfo = extractUrlFromMd(n.note);
        n.name = `[${n.name}](${nodeUrlInfo.url})`;
        n.note = '';
        break;
      case nodeIsMirrorRoot(n):
        id = `\n${makeBlockNotePrefix(indentSpaces, indentLvl)}id:: ${n.id}`
        break;
      case nodeIsMirrorVirtualRoot(n):
        if (conf.get('mirrorStyle') === 'reference') {
          n.name = `((${n.metadata.mirror.originalId}))`;
        } else {
          n.name = `{{embed ((${n.metadata.mirror.originalId}))}}`;
        }
        break;
    }
    
    if (n.note !== "") {
      n.note = indentLines(n.note, makeBlockNotePrefix(indentSpaces, indentLvl));
    }
    
    // Node collapsing.
    // TODO: including nodes with no children but have notes would be nice.
    //       Needs careful implementation though as it will break quote and code
    //       block formatting.
    if (n.hasOwnProperty('children')) {
      const collapsedText = `\n${makeBlockNotePrefix(indentSpaces, indentLvl)}collapsed:: true`;
      switch (conf.get("collapseMode")) {
        case ('top'):
          if (indentLvl === 0) {
            collapsed = collapsedText;
          }
          break;
        case ('none'):
          // do nothing
          break;
        case ('all'):
          collapsed = collapsedText;
          break;
        case ('shallow'):
          const collapseLvl = conf.get("collapseDepth");
          if (indentLvl <= collapseLvl - 1) collapsed = collapsedText;
          break;
      }
    }
   
    // Other than the name field, each single line of the block needs to
    // arrive here with it's newlines and indenting. If they don't apply to
    // this block, they will be empty. All could be empty except name.
    pageBlocks.push(
      makeBlockNamePrefix(indentSpaces, indentLvl) + marker + n.name
      + id
      + completed
      + collapsed
      + n.note);
    
    // Recurse into children nodes
    if (n.hasOwnProperty('children')) {
      pageBlocks.push(convertToMd(
        state,
        conf,
        pageName.trim(),
        n.children,
        n.children.length,
        indentLvl + 1,
      ));
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
