# Lemmy Instance Assistant

Say that you have an account on "https://lemmy.ca".

After looking for a community on Google, you may end up on an instance that is different from your own (https://lemmy.ml/c/technology). If you want to subscribe to the community, you need to copy the code (`!technology@lemmy.ml`), open your own instance, and then paste it into the search page.

This extension will redirect that link to the version on your instance (ex. "https://lemmy.ca/c/technology@lemmy.ml"), allowing you to subscribe and participate immediately.

# Instructions
1. Install the extension
2. Set up your instance
   a. Click on the extension icon
   b. Click "change my selected instance"
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
