/**
 * Created by tvaisanen on 9/28/17.
 */

define(function () {

    var items = [
        {title: "Home", file: "index.html"},
        {title: "Stuff", file: "stuff.html"},
        {title: "Other", file: "other.html"}
    ];

    return {
        get: function(){ return items; }
    }
});

