const dbPromise = idb.open('posts-store', 1, db => {
  console.log('masuk sini', db)
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', {keyPath: 'id'})
  }
})

function writeData (store, data) {
  return dbPromise.then (db => {
    let tx = db.transaction(store, 'readwrite')
    let st = tx.objectStore(store)
    st.put(data)
    return tx.complete
  })
}

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}