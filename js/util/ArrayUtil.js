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
}