<p align="center"><img width="128" height="128" src="https://github-production-user-asset-6210df.s3.amazonaws.com/26402139/255387066-9d6c510c-1498-4ad5-9dec-6a5aa3bc08ff.png"></p>

<h1 align="center">Instance Assistant</h1>

# Downloads

<table>
  <tr>
    <th>Firefox                      </th>
    <th>Google Chrome                </th>
    <th>Microsoft Edge               </th>
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
  </tr>
  <tr>
  </tr>
</table>

**Safari:** No immediate plans. While I can port the extension to Safari, I can't sign and publish it without a recent MacOS device.

**Other browsers:** No immediate plans. For most other browsers, you should be able to download from either the Chrome or Firefox stores.

If you have thoughts or want to contribute, you can join the discussion here: https://lemmy.ca/c/instance_assistant

<br/>




# Features

**Support** for Lemmy and Kbin instances + custom frontends such as Alexandrite and Photon

**Post to Lemmy/Kbin:** 
  * Instance Assistant can generate a draft post with autofilled title/link/body
  * For most news sites, videos, and other webpages, you can use the popup menu
  * For images, you can right-click on the image itself

**Search for posts:** 
  * Find and open all posts that have a link to the site you are on. Use it to find posts about news articles, videos, and more

**Search for communities and content without leaving the page:** 
  * You can use the popup menu or sidebar to search for communities (powered by [lemmyverse.net](https://lemmyverse.net/communities)), and for content (powered by [search-lemmy.com](https://search-lemmy.com))

**Redirect to your home instance:** 
  * When you are on a foreign instance, buttons will be available in the sidebar to open the **community** or **post** in your home instance, allowing you to participate immediately

**Open links in home instance:** 
  * If you come across a Lemmy/Kbin link anywhere on the web, you can right click to open it in your home instance

**Upgraded Pages:** 
  * 'Community not found' pages now have better information and buttons to trigger a fetch, open the community in the source instance, and more. This also supports alternative front-ends. [See it in action here](https://lemmy.ca/c/fakecommunity@example.com)
  * `/communities` pages will have the non-functional 'subscribe' buttons replaced, to make it easier when browsing other instances.

**Customizable:** 
  * Customizable list of instances in popup/sidebar to let you quickly switch home instances. This is great for if you have multiple accounts on different instances
  * You can change the behaviour of the extension and customize the actual Lemmy/Kbin site interface, making your browsing experience your own.

<br/>

### I'm new to Lemmy/Kbin, what is this?

Lemmy and Kbin are a part of the Fediverse, a network of interconnected social media platforms that work similar to Reddit. This extension is designed to make it easier to use these platforms and make the most of decentralized social media while mimizing the difficulties that may come with it.

Say, for example, you may make an account on `lemmy.ca`. You may google a community or topic and come across a page on a different instance (ex. `lemmy.ml/c/technology`). If you want to subscribe to the community, you will need to copy the code (`!technology@lemmy.ml`), open your home instance, and then paste it into the search page. If you want to comment on a post, you would then try to track it down by scrolling through the community.

This extension will let you jump to the version on your home instance, allowing you to subscribe and participate immediately.

There are many other features as well, and hopefully many more to come! :)

<br/> 

# Contributing

You can contribute to this project in a number of ways:
* 🐛 **Report bugs & suggest features:** 
  - If you find a bug or want a new feature, you can discuss in the [Support Community](https://lemmy.ca/c/instance_assistant) or open an issue on GitHub.
* 💻 **Contribute code:** 
  - You can find guidance [on the wiki](https://github.com/cynber/lemmy-instance-assistant/wiki/Development-Process)
* 🌐 **Translate:** 
  - If you want to help translate the extension, you will soon be able to do so. I will update this section once it is ready.
* 💛 **Donate:**
  - If you want to support the project financially, you can do so by clicking the sponsor button on this page, or through https://ko-fi.com/cynber



<br/>

# Other Links

* [Recent Updates](https://github.com/cynber/lemmy-instance-assistant/wiki#recent-updates)
* [Open Issues](https://github.com/cynber/lemmy-instance-assistant/issues)
* [What is being worked on?](https://github.com/users/cynber/projects/1)
* [Credits](https://github.com/cynber/lemmy-instance-assistant/wiki#credits)

<br/> 

# Screenshots

This is not a complete list of features, but it should give you an idea of what the extension can do. I will update these screenshots every now and then, so the UI may have changed since these were taken.

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
  <td>Redirect button for Photon Frontend</td>
  <td>Redirect button for Alexandrite Frontend</td>
 </tr>
 <tr>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/8ea651df-9b6f-4c87-bc65-05841df69fae"> </td>
  <td> <img width="960" alt="firefox-sc-0" src="https://github.com/cynber/lemmy-instance-assistant/assets/26402139/940be022-5ace-402f-aae2-bb5df91b5f06"> </td>
 </tr>
 </table>
 
 <table>
 <tr>
  <td> Improved '/communities' page on foreign instances</td>
  <td> Persistent sidebar version of popup menu </td>
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
 



