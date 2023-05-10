package util;

class StringExt {
    static public function startsWith(str:String,start:String):Bool {
        return str.indexOf(start)==0;
    }
}