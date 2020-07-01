//jshint esversion:8

(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for (; i < length; i++) {
            if (classes[i] === className) {
                classes.splice(i, 1);
                break;
            }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    function toggleAll(e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    }

    function handleEvent(e) {
        if (menuLink && e.target.id === menuLink.id) {
            return toggleAll(e);
        }

        if (menu && menu.className.indexOf('active') !== -1) {
            return toggleAll(e);
        }
    }

    document.addEventListener('click', handleEvent);

}(this, this.document));

window.addEventListener('offline',function(){
  alert('You Are Offline');
});
