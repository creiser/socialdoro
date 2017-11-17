/**
 * Created by tvaisanen on 9/28/17.
 */


define(function(){

    console.info('nav.js');

    function menuList(args){
        console.log(args.items);
        var menuList = $("<ul></ul>").addClass("menu");
        args.items.forEach(function(menuItem){
            menuList.append(renderListItem(menuItem));
        });
        return menuList;
    }

    function createLink(item){
        var link = $("<span/>", {
            name : "link",
            href : item.file,
            text : item.title,
            click: function () {
                console.log("do the nav to %s", item.file);
            }
        }).addClass("menu-item");
        return link;
    }

    function renderListItem(item){
        var li = $("<li/>").append(createLink(item));
        return li;
    }

    function render(args){
        var aside = $(args.containerSelector);
        var menu = $("<div></div>");
        aside.append(menu);
        menu.append(menuList({items: args.items}));
    }

    return {
        init: function(args){
            console.log('init nav!');
            render(args);
        }
    }
});
