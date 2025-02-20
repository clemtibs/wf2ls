// Time Helpers
// This file is a collection of date/time computing and formatting tools.
//
// Much effort was used to figure out how WF computed it's created and modified
// times. It seems to be an epoch, in seconds, since 10/16/2012, 11:11:53 AM
// PST. Whether this timestamp accounts for Daylight Saving is hard to say.
// Only thing I'm pretty sure of is that it doesn't seem to be UTC, which is
// annoying.
const WF_EPOCH_SECONDS_PST = 1350385936;

// Date formatting templates

const month = {
  'MMMM': (d) => { return new Intl.DateTimeFormat("en-US", {month: 'long', timeZone: 'America/Los_Angeles'}).format(d)},
  'MMM': (d) => { return new Intl.DateTimeFormat("en-US", {month: 'short', timeZone: 'America/Los_Angeles'}).format(d)},
  'MM': (d) => { return new Intl.DateTimeFormat("en-US", {month: '2-digit', timeZone: 'America/Los_Angeles'}).format(d)},
}

const day = {
  'do': (d) => { return addDaySuffix(new Intl.DateTimeFormat("en-US", { day: 'numeric', timeZone: 'America/Los_Angeles' }).format(d))},
  'dd': (d) => { return new Intl.DateTimeFormat("en-US", { day: '2-digit', timeZone: 'America/Los_Angeles' }).format(d)}
}

const weekday = {
  'E': (d) => { return new Intl.DateTimeFormat("en-US", { weekday: 'short', timeZone: 'America/Los_Angeles' }).format(d)},
  'EEE': (d) => { return new Intl.DateTimeFormat("en-US", { weekday: 'short', timeZone: 'America/Los_Angeles' }).format(d)},
  'EEEE': (d) => { return new Intl.DateTimeFormat("en-US", { weekday: 'long', timeZone: 'America/Los_Angeles' }).format(d)},
}

const year = (d) => { return d.getFullYear()}

const dateFormats = {
  'E, MM/dd/yyyy': (d) => {
    return `${weekday['E'](d)}, ${month['MM'](d)}/${day['dd'](d)}/${year(d)}`
  },
  'E, MM-dd-yyyy': (d) => {
    return `${weekday['E'](d)}, ${month['MM'](d)}-${day['dd'](d)}-${year(d)}`
  },
  'E, MM.dd.yyyy': (d) => {
    return `${weekday['E'](d)}, ${month['MM'](d)}.${day['dd'](d)}.${year(d)}`
  },
  'E, yyyy/MM/dd': (d) => {
    return `${weekday['E'](d)}, ${year(d)}/${month['MM'](d)}/${day['dd'](d)}`
  },
  'EEE, MM/dd/yyyy': (d) => {
    return `${weekday['EEE'](d)}, ${month['MM'](d)}/${day['dd'](d)}/${year(d)}`
  },
  'EEE, MM-dd-yyyy': (d) => {
    return `${weekday['EEE'](d)}, ${month['MM'](d)}-${day['dd'](d)}-${year(d)}`
  },
  'EEE, MM.dd.yyyy': (d) => {
    return `${weekday['EEE'](d)}, ${month['MM'](d)}.${day['dd'](d)}.${year(d)}`
  },
  'EEE, yyyy/MM/dd': (d) => {
    return `${weekday['EEE'](d)}, ${year(d)}/${month['MM'](d)}/${day['dd'](d)}`
  },
  'EEEE, MM/dd/yyyy': (d) => {
    return `${weekday['EEEE'](d)}, ${month['MM'](d)}/${day['dd'](d)}/${year(d)}`
  },
  'EEEE, MM-dd-yyyy': (d) => {
    return `${weekday['EEEE'](d)}, ${month['MM'](d)}-${day['dd'](d)}-${year(d)}`
  },
  'EEEE, MM.dd.yyyy': (d) => {
    return `${weekday['EEEE'](d)}, ${month['MM'](d)}.${day['dd'](d)}.${year(d)}`
  },
  'EEEE, yyyy/MM/dd': (d) => {
    return `${weekday['EEEE'](d)}, ${year(d)}/${month['MM'](d)}/${day['dd'](d)}`
  },
  'MM-dd-yyyy': (d) => {
    return `${month['MM'](d)}-${day['dd'](d)}-${year(d)}`
  },
  'MM/dd/yyyy': (d) => {
    return `${month['MM'](d)}/${day['dd'](d)}/${year(d)}`
  },
  'MMM do, yyyy': (d) => {
    return `${month['MMM'](d)} ${day['do'](d)}, ${year(d)}`
  },
  'MMMM do, yyyy': (d) => {
    return `${month['MMMM'](d)} ${day['do'](d)}, ${year(d)}`
  },
  'MM_dd_yyyy': (d) => {
    return `${month['MM'](d)}_${day['dd'](d)}_${year(d)}`
  },
  'dd-MM-yyyy': (d) => {
    return `${day['dd'](d)}-${month['MM'](d)}-${year(d)}`
  },
  'do MMM yyyy': (d) => {
    return `${day['do'](d)} ${month['MMM'](d)} ${year(d)}`
  },
  'do MMMM yyyy': (d) => {
    return `${day['do'](d)} ${month['MMMM'](d)} ${year(d)}`
  },
  'yyyy-MM-dd': (d) => {
    return `${year(d)}-${month['MM'](d)}-${day['dd'](d)}`
  },
  'yyyy-MM-dd EEEE': (d) => {
    return `${year(d)}-${month['MM'](d)}-${day['dd'](d)} ${weekday['EEEE'](d)}`
  },
  'yyyy/MM/dd': (d) => {
    return `${year(d)}/${month['MM'](d)}/${day['dd'](d)}`
  },
  'yyyyMMdd': (d) => {
    return `${year(d)}${month['MM'](d)}${day['dd'](d)}`
  },
  'yyyy_MM_dd': (d) => {
    return `${year(d)}_${month['MM'](d)}_${day['dd'](d)}`
  },
  'yyyy年MM月dd日': (d) => {
    return `${year(d)}年${month['MM'](d)}月${day['dd'](d)}日`
  },
}

// Date Functions & Tooling
const addDaySuffix = (day) => {
  if ([11, 12, 13].includes(day)) {
    return `${day}th`;
  } else {
    let ld = Number(day.toString().slice(-1));
    switch (ld) {
      case 1:
        return `${day}st`;
        break;
      case 2:
        return `${day}nd`;
        break;
      case 3:
        return `${day}rd`;
        break;
      default:
        return `${day}th`;
    }
  }
}

const dateUtcToSecondsUtc = (dateStr) => {
  const date = new Date(dateStr);
  const dateSeconds = Math.floor(date.getTime() / 1000);
  return dateSeconds;
}

const convertTz = (date, tzString) => {
  // return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
  let newTz;
  if (typeof date === "string") {
    newTz = new Date(date);
  } else {
    newTz = date;
  }
  return new Date(newTz.toLocaleString("en-US", {timeZone: tzString}))
}

const formatDate = (date, dFormat) => {
  const startDate = new Date(
    date.startYear,
    date.startMonth - 1,
    date.startDay,
    date.startHour,
    date.startMinute
  )

  // const endDate = new Date(
    // date.endYear,
    // date.endMonth - 1,
    // date.endDay,
    // date.endHour,
    // date.endMinute
  // )

  return dateFormats[dFormat](startDate);
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

const localSecondsToCustomDateObj = (seconds) => {
  const date = new Date(seconds * 1000);
  return {
    startYear: date.getFullYear(),
    startMonth: date.getMonth() + 1,
    startDay: date.getDate(),
    startHour: date.getHours(),
    startMinute: date.getMinutes(),
  }
}

// const utcSecondsToLocalSeconds = (seconds) => {
  // const date = new Date(seconds * 1000);
  // const options = {
    // // year: 'numeric',
    // // month: 'long',
    // // day: 'numeric',
    // // hour: 'numeric',
    // // minute: 'numeric',
    // // second: 'numeric',
    // // hour12: false,
    // timeZone: 'America/Los_Angeles',
    // // timeZone: 'UTC',
    // // timeZoneName: 'short'
  // };
  // let localDate = new Date(date.toLocaleDateString("en-CA", options));
  // return Math.floor(localDate.getTime() / 1000);
// }

const wfSecondsToPstSeconds = (wfSeconds) => {
  return wfSeconds + WF_EPOCH_SECONDS_PST;
}

const pstSecondsToUnixTimestampMs = (pstSeconds) => {
  return pstSeconds * 1000
}

export {
  addDaySuffix,
  formatDate,
  localSecondsToCustomDateObj,
  pstSecondsToUnixTimestampMs,
  wfSecondsToPstSeconds
};
