## Workflowy to LogSeq Converter Utility

![version](https://img.shields.io/badge/version-0.8.0-yellowgreen) [![status - alpha](https://img.shields.io/badge/status-alpha-orange)](https://) [![GitHub tag](https://img.shields.io/github/tag/brianclements/wf2ls?include_prereleases=&sort=semver&color=blue)](https://github.com/brianclements/wf2ls/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

This tool attempts to take Workflowy backup files (the Dropbox sync files with
*.backup suffixes), and convert them into LogSeq friendly markdown files.

Workflowy and LogSeq have some fundamentally different approaches to storing
what is essentially pages of lists. Workflowy is one page with everything else
as a list underneath, and pages are virtually constructed via zoom level. While
LogSeq utilizes multiple pages with smaller lists contained therein; amongst
many other things.

So a lot of the conversions require opinionated translations. I've done
my best to make some core features here configurable, but I understand that not
everything can be accounted for.

Here is a list of design and philosophy discrepancies and my solutions to them;
this is also a bit of a roadmap for myself. 

**Anything suffixed with a __*__ indicates that the option/feature is not
implemented yet.**

### Complete/Incomplete and Visible/Hidden status of bullets and blocks

In Workflowy, any bullet can be marked as complete (hidden) or incomplete
(visible), while in LogSeq, only TODOs can. I used Workflowy for many years
before they even introduced the specific "todo" type for a bullet, so not all of 
my completed/hidden items are todos, and not all of my todos are of the correct
"todo" type.

My solution here is to introduce 3 levels of conversion:

- **strict** ( _default_ ): Only WF tasks of type "todo", complete or
    incomplete, get converted to LS TODO tasks. If completed, that information
    is recorded by adding a `completed-on::` parameter.
- __permissive*__: Any WF task marked as a "todo" type and any task marked as
    completed, will get converted.
- __heuristic*__: Any WF taks marked as "todo" type (same as strict) as well as
    any tasks that are direct children to bullets with "todo", "tasks", "today",
    "scheduled", "recurring", or "unscheduled "in the name, regardless of
    complete/incomplete status.

I'll admit that "heuristic" is my solution to my own mess, but eventually that
list can be modified and appended to help others in a similar situation if
needed.

### Splitting off new pages

For significantly large Workflowy maps, it's unfeasible to leave every bullet on
one single page. LogSeq also caps each file at 1000 lines anyway (configurable,
yes, but we should take the hint).

So when you have a major section that should be split off into it's own page,
and all of it's children blocks taken with it, then you can add a tag anywhere
in the Workflowy bullet or note, `#LS-Page` by default, to tell the script to
make that block the root level of a new page. The content of that block name
will become the page name, and a link to the new page will be left in it's
place. The notes for said block will be moved to the first block of the new page.
This seemed natural as most of my notes in Workflowy tended to be filled with
metadata-like tags and information anyway and it'll be easier later on to simply
convert these to LogSeq properties for the new page.

### Handling of "@" tags *

At some point, when Workflowy started adding the comments functionality, these
tags stopped being simple text and started looking like: `<mention id="0"
by="286081" ts="78190234"> </mention>`. I don't see any way yet to extract the
actual content of these custom tags from the backup files. Perhaps in the
future, I'll be able to make this tool work in the browser on top of a logged-in
instance of the webapp, but that is not my focus right now as I did not really
use the tags or any multi-user features.

This script will handle these by inserting the `by` information with the `@`
tag. This the above example, this would be `@286081`. This way, one can at least
figure out via context who was referenced and then via find/replace text tools,
convert all the instances.

## License

Released under [MIT](/LICENSE) by [@brianclements](https://github.com/brianclements).
