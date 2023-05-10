import sh.client.Client;

import react.ReactMacro.jsx;
import react.ReactDOM;
import js.Browser;

@:expose
class Main {
    #if js
    static public function main() {
        ReactDOM.render(jsx(
            <Client/>
        ), Browser.document.getElementById("root"));
    }
    #end
}
