package util;

class ArrayExt {
    static public function last<T>(a:Array<T>) {
        return a[a.length-1];
    }
}