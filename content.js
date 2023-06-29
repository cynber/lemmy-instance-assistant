browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {

    const currentUrl = window.location.href;
    const currentHost = new URL(currentUrl).hostname;
    const currentPath = new URL(currentUrl).pathname;

    const communityName = currentPath.match(/\/[cm]\/([^/@]+)/)[1];
    const sourceInstance = currentPath.includes("@") ?
        currentPath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : currentHost;

    const selectedInstanceHostname = new URL(selectedInstance).hostname;

    const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

    if (selectedInstanceHostname != currentHost) { // run if not on home instance

        const targetElement = document.querySelector('.card-body');

        const goButton = document.createElement('button');
        const message = document.createElement('p');

        goButton.setAttribute('type', 'button');
        goButton.textContent = 'Open community in my home instance';
        goButton.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem .5rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
      `;
        goButton.style.backgroundColor = '#151347';

        if (selectedInstance && urlPattern.test(selectedInstance)) {

            goButton.addEventListener('click', () => {
                browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                    const redirectURL = selectedInstance + '/c/' + communityName + '@' + sourceInstance;
                    window.location.href = redirectURL;
                });
            });


        } else {
            goButton.addEventListener('click', () => {
                //popup a message telling user that they did not select an instance
                alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.');
            });
        }

        message.style.cssText = `
                font-size: 0.8rem;
                color: #666;
            `;
        message.textContent = 'To change your home instance, click on the extension icon in the top right corner of your browser.';



        targetElement.appendChild(goButton);
        targetElement.appendChild(message);
    }
});