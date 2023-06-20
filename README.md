# Lemmy Instance Assistant

Say that you have an account on "https://lemmy.ca".

After looking for a community on Google, you may end up on an instance that is different from your own (https://lemmy.ml/c/technology). If you want to subscribe to the community, you need to copy the code (`!technology@lemmy.ml`), open your own instance, and then paste it into the search page.

This extension will redirect that link to the version on your instance (ex. "https://lemmy.ca/c/technology@lemmy.ml"), allowing you to subscribe and participate immediately.

# Get the Extension

<a href="https://addons.mozilla.org/addon/lemmy-instance-assistant"><img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/f1b923af-dfe5-48a9-a477-2f01945c28f6" width="25%" alt="Get Lemmy Instance Assistant for Firefox"></a>

If the buttons above don't work, here are direct links
* **Firefox:** https://addons.mozilla.org/addon/lemmy-instance-assistant
* **Chrome:** coming soon! I'm just waiting for it to be approved
* **Edge**/**Opera**/**Safari**/**Other**: I will try to get the extension onto the other browsers as soon as I can. The extension should be compatible with all of them, it's just a matter of setting up accounts and paying fees. If you would like a particular browser, let me know and I will get to that one sooner.


# Instructions
1. Install the extension
2. Click on the extension icon on your toolbar
3. Click "change my selected instance" and type in the URL of your home instance (ex. "https://lemmy.ca"). To make things easier, you can click on the buttons to quickly copy the URL of some common home instances.   
4. Enjoy

If the button doesn't show up, you may need to refresh the page. If it still doesn't show up, please let me know!

# Demo:
https://github.com/cynber/lemmy-instance-assistant/assets/26402139/d3a12821-9fa6-47a8-8c87-fc3d94bd3efb

# Planned Changes
* Improve colors and readability
* Improve specificity of which pages the button will appear on
    * Right now it does not appear if you are already viewing a community in a different instance, even if that is not YOUR instance
    * I want to ensure the button will appear on any Lemmy page, but not any random page. As Lemmy sites can have any domain, the extension may need to check for meta tags or other identifiers unique to Lemmy sites. 
* Look into case where button doesn't appear unless page is refreshed

# Credits
* Icon from <a href="https://www.flaticon.com/free-icons/lemming" title="lemming icons">Lemming icons created by Freepik - Flaticon</a>
* Copy icon from <a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by Radhe Icon - Flaticon</a>
