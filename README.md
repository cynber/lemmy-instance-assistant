# What is this?

Say that you have an account on "https://lemmy.ca".

After looking for a community on Google, you may end up on an instance that is different from your own (https://lemmy.ml/c/technology). If you want to subscribe to the community, you need to copy the code (`!technology@lemmy.ml`), open your home instance, and then paste it into the search page.

This extension will redirect that link to the version on your home instance (ex. "https://lemmy.ca/c/technology@lemmy.ml"), allowing you to subscribe and participate immediately.

# Get the Extension

<a href="https://addons.mozilla.org/addon/lemmy-instance-assistant"><img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/f1b923af-dfe5-48a9-a477-2f01945c28f6" width="25%" alt="Get Lemmy Instance Assistant for Firefox"></a>

If the buttons above don't work, here are direct links
* **Firefox:** <a href="https://addons.mozilla.org/addon/lemmy-instance-assistant">https://addons.mozilla.org/addon/lemmy-instance-assistant</a>
* **Chrome:** coming soon! I'm just waiting for it to be approved
* **Edge**/**Opera**/**Safari**/**Other**: I will try to get the extension onto the other browsers as soon as I can. The extension should be compatible with all of them, it's just a matter of setting up accounts and paying fees. If you would like a particular browser, let me know and I will get to that one sooner.


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

> EXPLANATION: In order to see a button on the community you are using, you will need to allow the extension to access that site. However, since a lemmy instance can have any URL, you will need to keep doing this for any new instance you come across. Flipping this toggle will let you skip this annoyance. The extension is not collecting any data and everything is running locally so there shouldn't be a risk from enabling this. However if you don't want to enable this, you can also use the button in the extension itself as it should always work regardless.

## Usage
Once your home instance is set, you can redirect to it using one of two methods:
* Button in popup: Click on the extension, and then click "Open this community in my instance". This is the recommended method.
* Button on site: If the extension has access to an instance, it should load a button directly in the sidebar. You may need to reload the page in order to see it.
  * To give the extension access, either use the setup method above, or right click on the extension and click "Always allow on ____"


# Demo:
https://github.com/cynber/lemmy-instance-assistant/assets/26402139/d3a12821-9fa6-47a8-8c87-fc3d94bd3efb

# Credits
* Icon from <a href="https://www.flaticon.com/free-icons/lemming" title="lemming icons">Lemming icons created by Freepik - Flaticon</a>
* Copy icon from <a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by Radhe Icon - Flaticon</a>
