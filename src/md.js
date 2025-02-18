/* MD Converter
 *
 * The main loop that works over the data prepared by the parsers to do the
 * actual conversions and translations.
 *
 */
import { default as TurndownService } from 'turndown';

import { 
  formatDate,
  localSecondsToCustomDateObj,
  wfSecondsToPstSeconds
} from './date.js';
import { 
  makeNode,
  nodeIsBacklink, 
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
  nodeIsTemplate,
  nodeIsTemplateButton,
  nodeIsTodo
} from './node.js';
import {
  extractUrlFromMd,
  indentLines,
  linkifyAmpersatTags,
  linkTextToUrl,
  tagInText,
  replacePageRefWithUuid,
  stripTag,
  toPageLink,
  makeBlockNamePrefix,
  makeBlockNotePrefix
} from './text.js';


// "mention" tags have empty or whitespace content, so needed to handle them
// here rather than a custom rule. Use of blankReplacement courtesy of:
// https://github.com/mixmark-io/turndown/issues/293#issuecomment-588984202
const blankReplacement = (content, node) => {
  switch (node.nodeName) {
    case 'MENTION':
      const id = node.getAttribute('id');
      if (id === '0') {
        return `[[@/everyone]] `;
      } else {
        return `[[@/${id}]] `;
      }
      break;
    default:
      // I think I want everything to make it through. 
      return node.outerHTML;
  }
}

// defined here, loaded in config.js, accessed via config object
const turndownDefaultConfig = {
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '_',
  strongDelimmiter: '**',
  linkStyle: 'inlined',
  blankReplacement: blankReplacement
}

// defined here, loaded dynamically in config.js based on value of 'textColorMarkupMode'
const turndownSpanPluginRules = {
  spanTextColorPlugin: {
    filter: function (node, options) {
      return (
        node.nodeName === 'SPAN' &&
        node.getAttribute('class')?.split(" ")[1]?.split("-")[0] === 'c'
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
        node.getAttribute('class')?.split(" ")[1]?.split("-")[0] === 'bc'
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
        node.getAttribute('class')?.split(" ")[1]?.split("-")[0] === 'c'
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
        node.getAttribute('class')?.split(" ")[1]?.split("-")[0] === 'bc'
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
  },
  internalWfLinks: {
    filter: function (node, options) {
      return (
        node.nodeName === 'A' &&
        node.getAttribute('href').includes('https://workflowy.com/#/')
      )
    },
    replacement: function (content, node, options) {
      // I can't get an AppState object in here, so I can't finish the
      // conversion.  Instead, I'll just doing everything but the lookup, then
      // I'll just replace the 12 digit page ref with the full UUID later in
      // convertToMd() with replacePageRefWithUuid(). The last 12 digits of a
      // UUID is unique enough to not cause too many false positives I would
      // imagine.
      const internalWfLinkRegex = /workflowy.com\/#\/([0-9a-fA-F]{12})/;
      const href = node.getAttribute('href');
      const match = href.match(internalWfLinkRegex);

      if (match) {
        if (node.innerHTML === '' ) {
          return `((${match[1]})) `;
        } else {
          if (node.innerHTML === href) {
            return `((${match[1]}))`;
          }
          return `[${content}](${match[1]})`;
        }
      }
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
    try {
      state.incrementJobProgress();
      n.name = n.name.trim();
      n.note = n.note ?? "";
      let id = "";
      let completed = "";
      let collapsed = "";
      let marker = "";
      let template = "";

      // Convert any website references in plain text to proper html
      n.name = linkTextToUrl(n.name);
      n.note = linkTextToUrl(n.note);

      // Convert html into markdown
      n.name = convertHtmlToMd(conf, n.name);
      n.note = convertHtmlToMd(conf, n.note);

      // Replace any page references with the full UUID of that node
      n.name = replacePageRefWithUuid(state, n.name);
      n.note = replacePageRefWithUuid(state, n.note);

      // Convert any ampersat tags, ("@everyone") as text to page refs, ([[@/everyone]])
      n.name = linkifyAmpersatTags(n.name);
      n.note = linkifyAmpersatTags(n.note);

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
            let completedDate = 
              formatDate(
                localSecondsToCustomDateObj(
                  wfSecondsToPstSeconds(n.completed)),
              conf.get("dateFormat"));
            completed = `\n${makeBlockNotePrefix(indentSpaces, indentLvl)}completed-on:: ${toPageLink(completedDate)}`;
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
          // For some reason, every codeblock example I exported from Workflowy
          // always had a backlink child in the data. Not only did I never
          // manually reference it (with internal workflowy links), but it never
          // showed up in the app itself either. I'm making note of it here that
          // it will trigger nodeIsBacklink() below and reveal the id for that
          // node. It's harmless, but annoying. I don't feel it's worth deleting
          // and risk deleting children with actual content.
          break;
        case nodeIsChildBookmark(conf, n):
          if (conf.get('compressBookmarks')) {
            let childUrlInfo = extractUrlFromMd(convertHtmlToMd(conf, n.children[0].name));
            n.name = `[${n.name}](${childUrlInfo.url})`;
            delete n.children;
            state.incrementJobProgress();
          }
          break;
        case nodeIsNoteBookmark(n):
          if (conf.get('compressBookmarks')) {
            let nodeUrlInfo = extractUrlFromMd(n.note);
            n.name = `[${n.name}](${nodeUrlInfo.url})`;
            n.note = '';
          }
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
        case nodeIsTemplate(n):
          n.name = stripTag("#template", n.name).trim()
          template = [
            '',
            `${makeBlockNotePrefix(indentSpaces, indentLvl)}template:: ${n.name}`,
            `${makeBlockNotePrefix(indentSpaces, indentLvl)}template-including-parent:: true`
          ].join("\n");
          break;
        case nodeIsTemplateButton(n):
          const [ tDesc, tName ] = state.getTemplateButtonName(n);
          n.name = "{{renderer :template-button, " + tName + ', :title " + ' + `${tDesc}` + '", :action append}}';
          break;
        case nodeIsBacklink(n):
          id = `\n${makeBlockNotePrefix(indentSpaces, indentLvl)}id:: ${n.id}`
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
        + template
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
    } catch ({ name, message }) {
      const fullError = 
        `\n${name}` + 
        `\n${message}` + 
        `\nNode involved had name content of: ${n.name}`;
      console.error(fullError);
    }
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
