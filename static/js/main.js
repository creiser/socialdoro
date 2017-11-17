/**
 * Created by tvaisanen on 9/28/17.
 */


define(function (require) {

    var $ = require('app/lib/jquery');
    var nav = require('js/navigation');
    var menuItems = require('js/components/menuItems');

    console.info('loaded: main.js');

    // init application gui
    nav.init({
        containerSelector: '#aside',
        items: menuItems.get()
    });

});