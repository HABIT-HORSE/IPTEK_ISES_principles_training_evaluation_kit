IPTEK (ISES Principles Training Evaluation Kit)

NOTE: in this version, Steve's customised version of CowLog DOES NOT REQUIRE AN INTERNET CONNECTION and may be run entirely locally.

Author:  Steve North
Author URI:  http://www.cs.nott.ac.uk/~pszsn/
License: AGPLv3 or later
License URI: http://www.gnu.org/licenses/agpl-3.0.en.html
Can: Commercial Use, Modify, Distribute, Place Warranty
Can't: Sublicence, Hold Liable
Must: Include Copyright, Include License, State Changes, Disclose Source
Copyright (c) 2016, Steve North

This kit provides a template for observing videos of horse training systems and evaluating them relative to the ISES (International Society for Equitation Science) Principles of Equitation Science.

This kit is the distributable version of the ethnology-based evaluation methodology, described in:
Steve North, Ann Hemingway, Andrew McLean, Harriet Laurie and Caroline Ellis-Hill. 2016. Evaluating a natural horsemanship program in relation to the ISES first principles of horse training. In proceedings of The 12th International Society for Equitation Science Conference (ISES2016). June 23-25. IFCE (Institut Français du Cheval et de L’équitation), Saumur, France. DOI: 10.5281/zenodo.54733. http://dx.doi.org/10.5281/zenodo.54733

This version of IPTEK incorporates a modified copy of:
The web-based CowLog v2.0 available at: http://run.cowlog.org/
CowLog by Matti Pastell is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License.
As described in:
Laura Hänninen and Matti Pastell. 2009. Cowlog: Open-Source Software for Coding Behaviors from Digital Video. Behavior Research Methods, 41 (2009), 472-476. DOI:http://dx.doi.org/10.3758/BRM.41.2.472
Cowlog Website. http://cowlog.org/

Steve's modifications to CowLog in this version are:

In index.html, the ISES principles ethogram behaviour numbers are hard-coded and come up immediately, ready to use.
All paths to CSS, JavaScrip, images etc. are now relative.

This version of CowLog can be run locally on a device, and it does not require an Internet connection to save the output file. The local text file saving is achieved using FileSaver.js (see cowlog.js, see line 697):

A saveAs() FileSaver implementation.
1.2.2
By Eli Grey, http://eligrey.com
License: MIT
See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md

This expands the devices and browsers that should support local file saving in CowLog to:

| Browser        | Constructs as | Filenames    | Max Blob Size | Dependencies |
| -------------- | ------------- | ------------ | ------------- | ------------ |
| Firefox 20+    | Blob          | Yes          | 800 MiB       | None         |
| Firefox < 20   | data: URI     | No           | n/a           | [Blob.js](https://github.com/eligrey/Blob.js) |
| Chrome         | Blob          | Yes          | [500 MiB][3]  | None         |
| Chrome for Android | Blob      | Yes          | [500 MiB][3]  | None         |
| Edge           | Blob          | Yes          | ?             | None         |
| IE 10+         | Blob          | Yes          | 600 MiB       | None         |
| Opera 15+      | Blob          | Yes          | 500 MiB       | None         |
| Opera < 15     | data: URI     | No           | n/a           | [Blob.js](https://github.com/eligrey/Blob.js) |
| Safari 6.1+*   | Blob          | No           | ?             | None         |
| Safari < 6     | data: URI     | No           | n/a           | [Blob.js](https://github.com/eligrey/Blob.js) |

For usage of IPTEK, please see: instructions.pdf
