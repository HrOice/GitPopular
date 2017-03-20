import {
    AsyncStorage,
} from 'react-native';
export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}


export default class DataRepository {
  constructor(flag) {
    this.flag = flag;
  }

  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      this.fetchLocalRepository(url).then((wrapData) => {
        if (wrapData) {
          resolve(wrapData);
        } else {
          this.fetchNetRepository(url).then((wrapData) => {
              resolve(wrapData);
          }).catch((error) => {
              reject(error);
          })
        }
      }).catch((error) => {
        console.error(error);
        this.fetchNetRepository(url).then((wrapData) => {
            resolve(wrapData);
        }).catch((error) => {
            reject(error);
        })
      })
    })
  }

  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
          .then((response) => response.json())
          .catch((error) => {
            reject(error);
          })
          .then((responseData) => {
            if (!responseData || !responseData.items) {
              reject(new Error('response data is null'));
              return;
            }
            resolve(responseData.items);
            this.saveRepository(url, responseData.items);
          })
          .done();
    })
  }

  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        try {
          resolve(JSON.parse(result));
        } catch(e) {
          reject(e);
          console.error(e);
        }
      })
    })
  }

  saveRepository(url, items, cb) {
    if (!url || !items) return;
    let wrapData = {items: items, date: new Date().getTime()}
    AsyncStorage.setItem(url, JSON.stringify(wrapData), cb);
  }
}

