var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function onSaveButtonClick (event) {
  console.log('clicked !')
  if ('caches' in  window) {
    caches.open()
    .then(cache => {
      cache.add('https://httpbin.org/get')
      cache.add('/src/images/sf-boat.jpg')
    })
  }
}

function clearCard () {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url('+ data.image +')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';

  // var cardSaveButton = document.createElement('button')
  // cardSaveButton.textContent = 'Save'
  // cardSupportingText.appendChild(cardSaveButton)
  // cardSaveButton.addEventListener('click', onSaveButtonClick)

  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI (datas) {
  for (let data of datas) {
    createCard(data)
  }
}

const url = 'https://food-ninja-pwa-23296.firebaseio.com/posts.json'
let networkDataReceived = false

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log('From Web', data)
    networkDataReceived = true
    clearCard()

    let dataArray = []
    for (let key in data) {
      dataArray.push(data[key])
    }
    updateUI(dataArray);
  });

if ('caches' in window) {
  caches.match(url)
  .then(res => {
    if (res) {
      return res.json();
    }
  })
  .then(function(data) {
    if (!networkDataReceived) {
      console.log('From Caches', data)
      clearCard()

      let dataArray = []
      for (let key in data) {
        dataArray.push(data[key])
      }
      updateUI(dataArray);
    }
  });
}