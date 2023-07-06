# What is this?

Say that you have an account on "https://lemmy.ca".

After looking for a community on Google, you may end up on a Lemmy or Kbin instance that is different from your own (https://lemmy.ml/c/technology). If you want to subscribe to the community, you need to copy the code (`!technology@lemmy.ml`), open your home instance, and then paste it into the search page.

This extension will redirect that link to the version on your home instance (ex. "https://lemmy.ca/c/technology@lemmy.ml"), allowing you to subscribe and participate immediately.

<br/> 


| Firefox | Chrome | Safari / Edge / Opera / Other |
|---------|--------|-------|
|<a href="https://addons.mozilla.org/addon/lemmy-instance-assistant"><img src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/251341913-3a74bafc-0ff6-4bff-83c1-532a7307e1f4.png" alt="Get 'Instance Assistant for Lemmy & Kbin' on Firefox"></a>|<a href="https://chrome.google.com/webstore/detail/instance-assistant-for-le/mbblbalkjcikhpladidpimlfiapdffdh/related"><img src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/251502726-24f9ef83-e061-4408-be03-d0b48b3bd9af.png" alt="Get 'Instance Assistant for Lemmy & Kbin' on Chrome"></a>|<img src="https://user-images.githubusercontent.com/26402139/251330411-db0406c9-6f21-4b7d-a9b8-1d267f39de2c.png" alt="Get 'Instance Assistant for Lemmy & Kbin' - Other Browsers">|
|Direct Link: <br/> <a href="https://addons.mozilla.org/addon/lemmy-instance-assistant">https://addons.mozilla.org/addon/lemmy-instance-assistant</a> |Direct Link: <br/> <a href="https://chrome.google.com/webstore/detail/instance-assistant-for-le/mbblbalkjcikhpladidpimlfiapdffdh/related">https://chrome.google.com/webstore/detail/instance-assistant-for-le/mbblbalkjcikhpladidpimlfiapdffdh/related</a>|Being worked on and tested|

When will it be on **Edge**/**Opera**/**Safari**/**Other**?: I will try to get the extension onto the other browsers as soon as I can. The extension should be compatible with all of them, it's just a matter of setting up accounts and paying fees. If you would like a particular browser, let me know and I will get to that one sooner.

<br/> 

# SETUP

Set your home instance:
1. Click on the extension icon on your toolbar (top right)
2. Click "Change my home instance" and type in the URL of your home instance (ex. "https://lemmy.ca"). To make things easier, you can click on the buttons to quickly copy the URL of some common home instances.   

**RECOMMENDED** - Allow access to all sites:
1. Right click on the extension icon
2. Click on "Manage Extension"
3. On the new page that opens, go to "Permissions"
4. Click the toggle on "Access your data for all websites"

> EXPLANATION: In order to see a button on the community you are using, you will need to allow the extension to access that site. However, since a lemmy instance can have any URL, you will need to keep doing this for any new instance you come across. Flipping this toggle will let you skip this annoyance. The extension is not collecting any data and everything is running locally so there shouldn't be a risk from enabling this. However if you don't want to enable this, you can also use the button in the extension itself as it should always work regardless.

<br/> 

# Usage
Once your home instance is set, you can redirect to it using one of two methods:
* Button in popup: Click on the extension, and then click "Open this community in my instance". This is the recommended method.
* Button on site: If the extension has access to an instance, it should load a button directly in the sidebar. You may need to reload the page in order to see it.
  * To give the extension access, either use the setup method above, or right click on the extension and click "Always allow on ____"

| Sidebar Button | Popup Button |
|----------------|------------------|
|<img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/c80b1342-49eb-4b76-9258-c2cd1db22897" alt="Sidebar Button">|<img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/b67e5b11-09b3-4248-9d74-8b2dc878969e" alt="Popup Button">|

<br/> 

# <a href="https://github.com/cynber/lemmy-instance-assistant/wiki/Latest-Updates-&-Future-Plans">Latest Updates & Future Plans</a>

<br/> 

# FAQ

* [Why can't I jump to a POST on my home instance?](https://github.com/cynber/lemmy-instance-assistant/wiki/Why-can't-I-jump-to-the-same-post-on-my-home-instance%3F)

* [The sidebar button is not working right](https://github.com/cynber/lemmy-instance-assistant/wiki/Removing-sidebar-button-and-keeping-popup-option-only)

<br/> 

# Demo:
This demo is out of date, new demo will be uploaded later on.
https://github.com/cynber/lemmy-instance-assistant/assets/26402139/d3a12821-9fa6-47a8-8c87-fc3d94bd3efb

<br/> 

# Credits
* Icon from <a href="https://www.flaticon.com/free-icons/lemming" title="lemming icons">Lemming icons created by Freepik - Flaticon</a>
* Copy icon from <a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by Radhe Icon - Flaticon</a>
