## Workflowy to LogSeq Converter Utility

[![status - alpha](https://img.shields.io/badge/status-alpha-orange)](https://) [![GitHub tag](https://img.shields.io/github/tag/brianclements/wf2ls?include_prereleases=&sort=semver&color=blue)](https://github.com/brianclements/wf2ls/releases/) [![License](https://img.shields.io/badge/License-MIT-blue)](#license)

This tool attempts to take Workflowy backup files (the Dropbox sync files with
*.backup suffixes), and convert them into LogSeq friendly markdown files.

Workflowy and LogSeq have some fundamentally different approaches to storing
what is essentially pages of lists. Workflowy is one page with everything else
as a list underneath, and pages are virtually constructed via zoom level,
and LogSeq utilizeds multiple pages with smaller lists contained
therein; amongst many other things.

So a lot of the conversions require opinionated translations. I've done
my best to make some core features here configurable, but I understand that not
everything can be accounted for.

Here is a list of design/philosophy discrepancies and my solutions to them.

### Complete/Visible/Incomplete/Hidden status of bullets and blocks

In Workflowy, any bullet can be marked as complete (hidden) or incomplete
(visible), while in LogSeq, only Todo's can. I used Workflowy for many years
before they even introduced the specific "todo" type for a bullet, so not all of 
my completed/hidden items are todos, and not all of my todos are of the correct
"todo" type.

My solution here is to introduce 3 levels of conversion:

- **strict**: Only WF tasks of type "todo", complete or incomplete, get
    converted to LS TODO tasks. Completed information is recorded by adding a
    "completed-on::" parameter.
- **permissive***: Any WF task marked as a "todo" type and any task marked as
    completed, will get converted.
- **heuristic***: Any WF taks marked as "todo" type (same as strict) as well as
    any tasks that happen to fall under bullets with "todo" or "tasks" in the
    name, regardless of complete/incomplete status.

* not implemented yet

## License

Released under [MIT](/LICENSE) by [@brianclements](https://github.com/brianclements).
