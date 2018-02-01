# tab-cabinet

A note from the programmer:

Tab Cabinet was a personal, self-educational project to provide me with experience in web development and problem solving. This was my very first attempt at using javascript as well as APIs, so I pretty much just learned as I went, and as my debugging skills in a new programming environment were limitted, I had to come up withsome pretty ugly workarounds to some of the problems that I encountered. ANY FEEDBACK IS MUCH APPRECIATED.


The problem/motivation:

Having way too many uneccessary tabs in my browser (a situation I find myself in often) certainly slows down my browsing productivity, and can even lead to high CPU usage from the browser. As a student, I often found myself switching between different tasks and assignments, each of which typicaly using multiple tabs; maybe I'm working on a paper and have a bunch of sources open, or scheduling my classes for next semester and I have a page open for each class along with pages for professor reviews, or maybe I'm just shopping for a new laptop case and I want to have all of my different options open so I can compare them easily. I wouldn't want to close these groups of tabs because I know I'm going to be returning to them in the near future, but it would take more time than I'd like to make a new folder and then go to each tab individually to bookmark it. Furthermore, in most cases I know that I only need these groups temporarily. My solution: an easily accessable tool that allows me to quickly save and clear groups of tabs at a time, and quickly reopen and/or delete these groups.


This is what Tab Cabinet does, as of now:

When opened, the extension shows a list of all of the tabs in the current window, and allows the user to easily select a group of those tabs to be saved together a single folder. The user has the option to give the group a name, or leave it untitled, in which case a date/time stamp is added to the name. The user then has the option to either save the group only, save the group and clear all the saved tabs from the current window, or save the group and clear all open tabs in the current window, which is then replaced with a new window. 

Once a user has saved one or more groups of tabs, clicking on "My Saved Groups" opens a drop down menu with all of the groups, and by clicking on a group, the user can open all of the tabs in the group, either in the current window or in a new window, or delete the group. 

Tab Cabinet saves and accesses the folders for saved groups in a folder named "Tab Cabinet", located in the users Other Bookarks folder. If Tab Cabinate is unable to find the folder there (either because it's the user's first time using the extension, or because the folder has been moved/modified) it creates a new Tab Cabinate folder at the top of the users Other Bookmarks folder.


Improvements to be made:

While Tab Cabinet certainly offers a useful function (one which I myself, and some of my friends, still use), this function alone is not quite enough to solve my problem. I realized that alot of my open tabs are ones that I either forgot to close or thought I might need again but no longer do. Tab Cabinet would be significantly more useful if it offered a method of quickly deleting groups or individual tabs without saving them, as this would provide the convenience of being able to close tabs from a more comfortable interface, as opposed to the clutter of tab slivers that display only a couple letters (which can happen easily when using split windows). Other minor improvements to the interface 

Furthermore, as this was also my first time using HTML, it was immediately clear that the extension UI could use significant aesthetical improvements. After publishing the first version of the extension, I started a new HTML file and did some much needed revamping; while the new extension is not fully operational, a screenshot of it is available in the project folder (along with a screenshot of the working version).

Thank you for reading!





