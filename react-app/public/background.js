// need timer
// need to store a record of how manny days the extension was used
// chrome.storage.local

// document.getElementById('myButton').addEventListener('click', function() {
//     chrome.storage.local.get('bottonClickCount', function(data) {
//         let count = data.buttonClickCount || 0;
//         count++;

//     })
// })

chrome.runtime.onIntalled.addListener(() => {
    chrome.storage.local.get(['lastUsageDate', 'usageCount'], (result) => {
        if(!result.lastUsageDate) {
            chrome.storage.local.set({lastUsageDate: new Date().toDateString, usageCount: 0});
        }
    })
})

function trackDailyUsage() {
    const today = new Date().toDateString();

    chrome.storage.local.get(['lastUsageDate', 'usageCount'], (result)=> {
        let lastUsageDate = result.lastUsageDate;
        let usageCount = result.usageCount || 0;

        if (lastUsageDate !== today) {
            usageCount++;
            chrome.storage.local.set({ lastUsageDate: today, usageCount: usageCount});
            console.log(`Extension used for ${usageCount} days`);

        } else {
            console.log("Extension already used today.");
        }
    })
}