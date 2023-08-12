<p align="center"><img width="128" height="128" src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/255387066-9d6c510c-1498-4ad5-9dec-6a5aa3bc08ff.png"></p>

<h1 align="center">Instance Assistant</h1>

# Features

* **Support** for Lemmy and Kbin instances, as well as Alexandrite & Photon frontends.
* **Redirect to your home instance:** 
  * Buttons will be added to the sidebar of any Lemmy or Kbin community you visit, which will let you open the same community on your home instance.
* **Search for communities and posts:** 
  * Popup and sidebar include search fields powered by lemmyverse.net and search-lemmy.com
* **Open links in home instance:** 
  * Right click context menu will allow you to open any links in your home instance
* **Upgraded Pages:** 
  * 'Community not found' pages now have better information, a button to trigger a fetch, a button to open a community in the source instance, and more. See it [in action here](https://lemmy.ca/c/fakecommunity@example.com)
  * '/communities' pages had the non-functional 'subscribe' buttons replaced, to make it easier when browsing other instances.
* **Customizable:** 
  * Customizable list of instances to let you quickly switch home instances. This is great for if you have multiple accounts on different instances.
  * Hide parts of the site you don't want to see, such as the default Lemmy sidebar
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

# Contributing

You can contribute to this project in a number of ways:
* **Report bugs & suggest features:** If you find a bug or want a new feature, you can discuss in the Support Community (https://lemmy.ca/c/instance_assistant) or open an issue on GitHub.
* **Contribute code:** If you want to contribute code, you can open a pull request on GitHub. You can find guidance here: https://github.com/cynber/lemmy-instance-assistant/wiki/Development-Process
* **Translate:** If you want to help translate the extension, you will soon be able to do so. I will update this section once it is ready.
* **Donate:** If you want to support the project financially, you can do so by clicking the sponsor button on this page, or through https://ko-fi.com/cynber



<br/>

# Other Links
<table>
  <tr>
    <td> <h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#recent-updates">Recent Updates</a></h3> </td>
    <td><h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#future-plans">Future Plans</a></h3></td>
  </tr>
  <tr>
    <td> <h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#faq">FAQ</a></h3> </td>
    <td><h3><a href="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/d3a12821-9fa6-47a8-8c87-fc3d94bd3efb">Demo Video (out of date, new one is planned)</a></h3> </td>
  </tr>
  <tr>
    <td> <h3><a href="https://github.com/cynber/lemmy-instance-assistant/wiki#credits">Credits</a></h3></td>
    <td></td>
  </tr>
</table>

<br/> 

# Screenshots

 <table>
 <tr>
  <td>Popup Menu with redirect, community search, and more</td>
  <td>Improved 'community not found' page, with button to triger a fetch and more</td>
 </tr>
 <tr>
  <td> <img width="960" alt="firefox-sc-3" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/047a982f-7c1b-496a-8569-66cdc58fd1ea"> </td>
  <td> <img width="960" alt="firefox-sc-4" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/4a1fdc0c-307e-4b29-a183-51348a5b8b5a"> </td>
 </tr>
 </table>

 <table>
  <tr>
  <td>Redirect button in sidebar of foreign Lemmy instance</td>
  <td>Redirect button in sidebar of foreign Kbin instance</td>
 </tr>
  <tr>
    <td> <img width="960" alt="firefox-sc-1" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/40b187b6-200d-4cec-aea4-2672671db7de"> </td>
    <td><img width="960" alt="firefox-sc-2" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/a3a95acb-905f-4499-b37d-aa6c95424ea6"></td>
  </tr>
 </table>
 
 <table>
 <tr>
  <td>Redirect button for instances using a Photon Frontend</td>
  <td>Redirect button for instances using an Alexandrite Frontend</td>
 </tr>
 <tr>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/8ea651df-9b6f-4c87-bc65-05841df69fae"> </td>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/940be022-5ace-402f-aae2-bb5df91b5f06"> </td>
 </tr>
 </table>
 
 <table>
 <tr>
  <td> Improved '/communities' page on foreign instances</td>
  <td> Persistent sidebar, as an alternative to the popup menu </td>
 </tr>
 <tr>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/723f26b9-b561-4979-81ae-961a01ec9110"> </td>
  <td><img width="960" alt="firefox-sc-5" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/2e0c26a4-225f-4fbc-9310-f6b104a62bcb"></td>
 </tr>
</table>

 <table>
 <tr>
  <td> Right click context menu to open any links in your home instance </td>
  <td> Change display settings, such as hiding the default sidebar</td>
 </tr>
 <tr>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/a88c3697-6f09-463c-9147-d1e19196da3b"> </td>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/21b407cf-0984-41dd-9811-ed72d8618cbc"> </td>
 </tr>
</table>
 



