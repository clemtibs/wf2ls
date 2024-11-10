const wfEpochSecondsPst = 1350385936;
let argv = require('minimist')(process.argv.slice(2));
let config = {
  sourceFile: "",
  destDir: ""
};
let data = {};
let resultIdMap = new Map();
let mirrors = new Map();

const loadArgsToConfig = (args) => {
  config.sourceFile = args.i;
  config.destDir = args.d;
}

const loadSrcFile = (fPath) => {
  const fs = require('fs');
  const rawData = fs.readFileSync(fPath);
  data = JSON.parse(rawData);
}

// time helpers
const wfTimeToTime = (wfSeconds, wfEpochSeconds) => {
  const timestamp = wfSeconds + wfEpochSeconds;
  return secondsUtcToLocalDate(timestamp);
}

const getNowSecondsUTC = () => {
  const now = new Date();
  const nowSeconds = Math.floor(now.getTime() / 1000)
  return nowSeconds;
}

// const convertTZ = (date, tzString) => {
    // return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
// }

const secondsUtcToLocalDate = (seconds) => {
  const date = new Date(seconds * 1000);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/Los_Angeles',
    // timeZone: 'UTC',
    timeZoneName: 'short'
  };
  return date.toLocaleDateString("en-US", options);
}

const dateUtcToSecondsUtc = (dateStr) => {
  const date = new Date(dateStr);
  const dateSeconds = Math.floor(date.getTime() / 1000);
  return dateSeconds;
}

const getWfEpoch = (wfTime, dateUtc) => {
  // from sample data, these dates mapped to this number
  // 2024-09-16T22:30:00 PDT (-7)--> 376165087 UTC
  // 2024-09-17T05:30:00 UTC --> 376165087 UTC
  // 2024-11-07T15:53:00 PST (-8)--> 380637644 UTC
  // 2024-11-07T23:53:00 UTC --> 380637644 UTC
  // upon investigation, the it appears that Workflowy's timestamp is either in
  // the users local time, OR in Us-West coast time for all (taking into
  // account Daylight Saving). Since I'm in Los Angeles, I can't tell which one
  // it is.
  // 
  // Annoyingly, the computed times for each of these samples is 23 seconds off.
  //
  // let wfDatePdt = 376165087;
  // let epochPdt = getWfEpoch(wfDatePdt, "2024-09-16T22:30:00"); //pdt
  // console.log(epochPdt); // 1350385913

  // let wfDatePst = 380637644;
  // let epochPst = getWfEpoch(wfDatePst, "2024-11-07T15:53:00"); //pst
  // console.log(epochPst); // 1350385936

  const date = dateUtcToSecondsUtc(dateUtc);
  const wfEpochSecondsUtc = date - wfTime;
  return wfEpochSecondsUtc;
}


const processNode = (node) => {
  let result = {};
  if (!resultIdMap.get(node.id)) resultIdMap.set(node.id, result);
  result.name = node.nm;
  result.id = node.id;
  if (node.no) result.note = node.no;
  if (node.cp) result.completed = node.completed;
  if (node.ct) result.created = wfTimeToTime(node.ct, wfEpochSecondsPst);
  result.lastModified = node.lastModified;
  node.mirrorRootItems?.forEach(item => mirrors.set(item.id, node.id));
  if (node.children) result.children = node.children?.map(child => processNode(child));
  return result;
}

const main = () => {
  loadArgsToConfig(argv);
  loadSrcFile(config.sourceFile);
	let results = processNode(data[0]);
	console.log(results)
  // console.log(resultIdMap);
  // console.log(mirrors);

}

main();
