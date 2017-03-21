export default class ArrayUtil {
    static add(array, item) {
        if (!array) return;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) return;
        }
        array.push(item);
    }

    static remove(array, item) {
        if (!array) return;
        for (var i = 0; i < array.length; i++ ) {
            if (array[i] === item) array.splice(i,1);
        }
    }

    static update(array, item) {
        for (var i = 0; i < array.length; i++ ) {
            if (array[i] === item) {
                array.splice(i, 1);
                return;
            }
        }
        array.push(item);
    }

    static clone(from) {
        if (!from) return [];
        let newArray = []
        for (var i=0; i < from.length;i++) {
            newArray.push(from[i])
        }
        return newArray;
    }

    static isEquals(arr1, arr2) {
        if (!(arr1&&arr2)) return false;
        if (arr1.length != arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) return false;
        }
        return true;
    }
}