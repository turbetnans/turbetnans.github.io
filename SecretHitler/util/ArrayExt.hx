package util;

class ArrayExt {
    static public function last<T>(a:Array<T>):T {
        return a[a.length-1];
    }

    static public function shuffle<T>(a:Array<T>) {
        var index:Int = a.length;
        while(index!=0) {
            var rand:Int = Std.random(index--);
            var temp:T = a[index];
            a[index] = a[rand];
            a[rand] = temp;
        }
    }

    static public function random<T>(a:Array<T>):T {
        return a[Std.random(a.length)];
    }
}