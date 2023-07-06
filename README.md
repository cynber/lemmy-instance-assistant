# What is this?

This is a browser extension that simplifies the process when jumping from one Lemmy/Kbin instance to another. 

Say that you have an account on "https://**lemmy.ca**". After looking for a community on Google, you may end up on an instance that is different from your own (ex. "https://**lemmy.ml**/c/technology"). If you want to subscribe to the community, you need to copy a code, open your home instance, open the search page, and then run a search using the code.

This extension will create a button on any foreign instance, which will redirect you to the page on your home instance, allowing you to subscribe and participate immediately. The extension popup also has similar controls, so that you can jump even if the button doesn't show up.

# Get the Extension

<a href="https://addons.mozilla.org/addon/lemmy-instance-assistant"><img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/1f7ad6e6-2c57-4000-9b96-287d1c7b68d1" width="25%" alt="Get Instance Assistant for Lemmy & Kbin on Firefox"></a>

If the buttons above don't work, here are direct links
* **Firefox:** <a href="https://addons.mozilla.org/addon/lemmy-instance-assistant">https://addons.mozilla.org/addon/lemmy-instance-assistant</a>
* **Chrome:** Coming soon! The previous version had issues so I waited to finish the new updates before submitting. It's currently waiting for approval. 
* **Edge**/**Opera**/**Safari**/**Other**: I will try to get the extension onto the other browsers as soon as I can. The extension should be compatible , it's just a matter of setting up accounts and paying fees.


# Instructions

## SETUP

Set your home instance:
1. Click on the extension icon on your toolbar (top right)
2. Click "Change my home instance" and type in the URL of your home instance (ex. "https://lemmy.ca"). To make things easier, you can click on the buttons to quickly copy the URL of some common home instances.   

**RECOMMENDED** - Allow access to all sites:
1. Right click on the extension icon
2. Click on "Manage Extension"
3. On the new page that opens, go to "Permissions"
4. Click the toggle on "Access your data for all websites"

> EXPLANATION: In order to see a button on the community you are using, you will need to allow the extension to access that site. However, since a lemmy / kbin instance can have any URL, you will need to keep doing this for any new instance you come across. If you "Allow access to all sites", it will let you skip this annoyance. The extension is not collecting any data and everything is running locally so there shouldn't be a risk from enabling this. However if you don't want to enable this, you can also use the button in the extension itself (option 2 below) as it does not require permissions.

## Usage
Once your home instance is set, you can redirect to it using one of two methods:
* Button in popup: Click on the extension, and then click "Open this community in my instance". This is the recommended method.
* Button on site: If the extension has access to an instance, it should load a button directly in the sidebar. You may need to reload the page in order to see it.
  * To give the extension access, either use the setup method above, or right click on the extension and click "Always allow on ____"

## FAQ / Help Articles:
* [Why can't I redirect a post to my home instance?](https://github.com/cynber/lemmy-instance-assistant/wiki/Why-can't-I-jump-to-the-same-post-on-my-home-instance%3F)


# Demo:
https://github.com/cynber/lemmy-instance-assistant/assets/26402139/d3a12821-9fa6-47a8-8c87-fc3d94bd3efb

# Credits
* Icon from <a href="https://www.flaticon.com/free-icons/lemming" title="lemming icons">Lemming icons created by Freepik - Flaticon</a>
* Copy icon from <a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by Radhe Icon - Flaticon</a>
