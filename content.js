const targetElement = document.querySelector('.card-body');
const communityName = targetElement.querySelector('.overflow-wrap-anywhere').textContent;

if (communityName.includes('!') && !communityName.includes('@')) {

    const goButton = document.createElement('button');
    // const setButton = document.createElement('button');
    const message = document.createElement('p');

    goButton.setAttribute('type', 'button');
    goButton.textContent = 'Open this community in my instance';
    goButton.style.cssText = `
        padding: .375rem .75rem;
        margin: .5rem 0rem .5rem 0rem;
        width: 100%;
        border: none;
        border-radius: 5px;
        font-weight: 400;
        text-align: center;
        color: white;
    `;
    goButton.style.backgroundColor = '#151347';
    goButton.addEventListener('click', async () => {
        const { selectedInstance } = await browser.storage.local.get('selectedInstance');
        const currentUrl = window.location.href;
        const currentHost = new URL(currentUrl).hostname;
        const redirectURL = selectedInstance + '/c/' + communityName.slice(1) + '@' + currentHost;
        window.location.href = redirectURL;
    });

    // setButton.textContent = 'Change my selected instance';
    // setButton.setAttribute('type', 'button');
    // setButton.style.cssText = `
    //     font-weight: 400;
    //     text-align: center;
    //     padding: .375rem .75rem;
    //     color: white;
    //     border: none;
    //     border-radius: 5px;
    //     margin: .5rem 0rem .5rem 0rem;
    //     width: 100%;
    // `;
    // setButton.style.backgroundColor = '#501919';
    // setButton.addEventListener('click', () => {
    //     const inputInstance = prompt('Enter your instance URL:');
    //     if (inputInstance) {
    //         browser.storage.local.set({
    //             selectedInstance: inputInstance.trim()
    //         });
    //     }
    // });

    message.style.cssText = `
        font-size: 0.8rem;
        color: #666;
    `;
    message.textContent = 'To change your selected instance, click on the extension icon in the top right corner of your browser.';

    targetElement.appendChild(goButton);
    // targetElement.appendChild(setButton);
    targetElement.appendChild(message);

}