<p align="center"><img width="128" height="128" src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/255387066-9d6c510c-1498-4ad5-9dec-6a5aa3bc08ff.png"></p>

<h1 align="center">Instance Assistant</h1>

# Features

* **Redirect to your home instance:** 
  * Buttons will be added to the sidebar of any Lemmy or Kbin community you visit, which will let you open the same community on your home instance.
* **Open links in home instance:** 
  * Right click context menu will allow you to open any links in your home instance
* **Improved Error Pages:** 
  * 'Community not found' pages now have better information, a button to trigger a fetch, a button to open a community in the source instance, and more.
* **Customizable popup & sidebar menus:** 
  * Customizable list of instances to let you quickly switch home instances. This is great for if you have multiple accounts on different instances.
  * There are also buttons for helpful tools that let you search for communities (with lemmyverse.net), and search across Lemmy sites (with search-lemmy.com).
* **Settings:** You can change the default behaviour of the extension, customize the popup & sidebar menus, and turn off features you don't want to use.

</br>

# Downloads

<table>
  <tr>
    <th>Firefox                      </th>
    <th>Google Chrome                </th>
    <th>Microsoft Edge               </th>
    <th>Opera                        </th>
  </tr>
  <tr>
    <td>
      <a href="https://addons.mozilla.org/addon/lemmy-instance-assistant">
        <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/251341913-3a74bafc-0ff6-4bff-83c1-532a7307e1f4.png" alt="Get 'Instance Assistant for Lemmy & Kbin' on Firefox">
      </a>
    </td>
    <td>
      <a href="https://chrome.google.com/webstore/detail/instance-assistant-for-le/mbblbalkjcikhpladidpimlfiapdffdh">
        <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/251502726-24f9ef83-e061-4408-be03-d0b48b3bd9af.png" alt="Get 'Instance Assistant for Lemmy & Kbin' on Chrome">
      </a>
    </td>
    <td>
      <a href="https://microsoftedge.microsoft.com/addons/detail/instance-assistant-for-le/hnlndgeokcaocdklkbfjbfjplfnedehb" onclick="return false;">
        <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/252613780-21b8d61e-831b-459a-b45b-50190afb9cd2.png" alt="Get 'Instance Assistant for Lemmy & Kbin' - Edge">
      </a>
    </td>
    <td>
      <p>Coming soon...</p>
      <a href="#" onclick="return false;">
        <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/252613528-85a804d6-0dd0-4fd9-bc0e-26da3a436fbe.png" alt="Get 'Instance Assistant for Lemmy & Kbin' - Opera">
      </a>
    </td>
  </tr>
  <tr>
  </tr>
</table>

#### Other browsers:
* **Opera:** Waiting for approval by Opera team. In the meantime, you can download the extension from the Chrome store and install it manually.
* **Safari:** No immediate plans. While there are tools available to port the extension over to Safari, I don't have a new MacOS device which is required to sign the extension. I'm still looking in to this, but if you would like to contribute you can join the discussion here: https://lemmy.ca/c/instance_assistant
* **Other browsers:** Currently there aren't any plans to add it to any other browsers as you should be able to download from either the Chrome or Firefox stores. If you would like to see this extension on another browser, you can join the discussion here: https://lemmy.ca/c/instance_assistant

<br/> 

# Note on Permissions

The current versions request “Access to all sites”. This is because the extension needs access to any page that contains “/c/”, “/m/”, or “/post/” in order to create the sidebar buttons. While the extension only looks for those pages, it will show up as “Access to all sites” when installing. Once I have a proper welcome message and settings page, I plan on making this permission optional so you can just use the popup menu if you would like.

<br/> 

# Basic Usage

Once your home instance is set, you can redirect to it using one of two methods:
* Button in popup: Click on the extension, and then click "Open this community in my instance". This is the recommended method.
* Button on site: If the extension has access to an instance, it should load a button directly in the sidebar. You may need to reload the page in order to see it.
  * To give the extension access, either use the setup method above, or right click on the extension and click "Always allow on ____"

| Sidebar Button | Popup Button |
|----------------|------------------|
|<img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/c80b1342-49eb-4b76-9258-c2cd1db22897" alt="Sidebar Button">|<img src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/b67e5b11-09b3-4248-9d74-8b2dc878969e" alt="Popup Button">|

<br/>

# Contributing

You can contribute to this project in a number of ways:
* **Report bugs & suggest features:** If you find a bug or want a new feature, you can discuss in the support community (https://lemmy.ca/c/instance_assistant) or open an issue on GitHub.
* **Contribute code:** If you want to contribute code, you can open a pull request on GitHub. You can find instructions on how to set up the project here: https://github.com/cynber/lemmy-instance-assistant/wiki/Development-Process
* **Translate:** If you want to help translate the extension, you will soon be able to do so. I will update this section once it is ready.
* **Donate:** If you want to support the project financially, you can do so by clicking the sponsor button on this page, or through https://ko-fi.com/cynber



<br/>

# Other Links
<h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#recent-updates">Recent Updates</a></h3>
<h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#future-plans">Future Plans</a></h3>
<h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#faq">FAQ</a></h3>
<h3><a href="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/d3a12821-9fa6-47a8-8c87-fc3d94bd3efb">Demo Video (out of date, new one is planned)</a></h3>
<h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#credits">Credits</a></h3>