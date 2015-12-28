var _toDo;
var _search;
window.onscroll = function () {
    if (window.pageYOffset >= 170) {
        _search.deattachSearchline();
    }
    else {
        _search.attachSearchline();
    }
};
window.onload = function () {
    var elem = document.getElementById("main");
    var root = document.getElementById("content");
    _toDo = new TODO(root, root);
    document.getElementById("assistLine").appendChild(document.createElement("br"));
    _search = new Search(document.getElementById("assistLine"), _toDo);
    _toDo.setOnChangeListener(_search);
    try {
        _toDo.load();
        _toDo.display();
    }
    catch (e) { }
};
window.onbeforeunload = function () {
    _toDo.save();
    _search.restore();
};
window.addEventListener("focus", function () {
    try {
        _toDo.load();
        _toDo.display();
        _search.restore();
    }
    catch (e) { }
});
window.addEventListener("blur", function () {
    try {
        _toDo.save();
    }
    catch (e) { }
});
function addClass(element, className) {
    if (element !== null) {
        try {
            element.classList.add(className);
        }
        catch (e) {
            element.className += " " + className;
        }
    }
}
function removeClass(element, className) {
    if (element !== null) {
        try {
            element.classList.remove(className);
        }
        catch (e) {
            element.className = element.className.split(className).join("");
        }
    }
}
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
function unescapeHtml(text) {
    var map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        "&#039;": "'"
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function (m) { return map[m]; });
}
//# sourceMappingURL=app.js.map