// Time Helpers
// This file is a collection of date/time computing and formatting tools.
//
// Much effort was used to figure out how WF computed it's created and modified
// times. It seems to be an epoch, in seconds, since 10/16/2012, 11:11:53 AM
// PST. Whether this timestamp accounts for Daylight Saving is hard to say.
// Only thing I'm pretty sure of is that it doesn't seem to be UTC, which is
// annoying.
const WF_EPOCH_SECONDS_PST = 1350385936;

const dateUtcToSecondsUtc = (dateStr) => {
  const date = new Date(dateStr);
  const dateSeconds = Math.floor(date.getTime() / 1000);
  return dateSeconds;
}

const getNowSecondsUTC = () => {
  const now = new Date();
  const nowSeconds = Math.floor(now.getTime() / 1000)
  return nowSeconds;
}

const getWfEpoch = (wfTime, dateUtc) => {
  // from sample data, these dates mapped to this number
  // 2024-09-16T22:30:00 PDT (-7)--> 376165087 UTC
  // 2024-09-17T05:30:00 UTC --> 376165087 UTC
  // 2024-11-07T15:53:00 PST (-8)--> 380637644 UTC
  // 2024-11-07T23:53:00 UTC --> 380637644 UTC
  // Upon investigation, the it appears that Workflowy's timestamp is either in
  // the users local time, OR in US-West coast time for all (taking into
  // account Daylight Saving). Since I'm in Los Angeles, I can't tell which one
  // it is.
  // 
  // Annoyingly, the computed times for each of these samples is 23 seconds off.
  //
  // let wfDatePdt = 376165087; //sample date from real data
  // let epochPdt = getWfEpoch(wfDatePdt, "2024-09-16T22:30:00"); // pdt
  // console.log(epochPdt); // 1350385913 aka, workflowy epoch in seconds

  // let wfDatePst = 380637644;
  // let epochPst = getWfEpoch(wfDatePst, "2024-11-07T15:53:00"); // pst
  // console.log(epochPst); // 1350385936

  const date = dateUtcToSecondsUtc(dateUtc);
  const wfEpochSecondsUtc = date - wfTime;
  return wfEpochSecondsUtc;
}

const convertTz = (date, tzString) => {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

const secondsUtcToLocalDate = (seconds) => {
  const date = new Date(seconds * 1000);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // second: 'numeric',
    timeZone: 'America/Los_Angeles',
    // timeZone: 'UTC',
    // timeZoneName: 'short'
  };
  return date.toLocaleDateString("en-US", options);
  // return date.toLocaleDateString("en-CA", options);
}

// TODO: add ability to pass format/timezone object
// source: https://stackoverflow.com/a/66234640
const wfTimeToLocalTime = (wfSeconds, wfEpochSeconds) => {
  const timestamp = wfSeconds + wfEpochSeconds;
  return secondsUtcToLocalDate(timestamp);
}

export default {
  WF_EPOCH_SECONDS_PST,
  wfTimeToLocalTime
};
