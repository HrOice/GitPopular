import {
    AsyncStorage,
} from 'react-native';
export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}

import Trending from "GitHubTrending";

export default class DataRepository {
  constructor(flag) {
    this.flag = flag;
    if(flag===FLAG_STORAGE.flag_trending)this.trending=new Trending();
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
      if (this.flag === FLAG_STORAGE.flag_popular) {
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
      } else {
          this.trending.fetchTrending(url).then((items) => {
            if (!items) {
              reject(new Error('responseData is null'));    
              return;
            } else {
              resolve(items);
              this.saveRepository(url, items);
            }
          })
      }
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

