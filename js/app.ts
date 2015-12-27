﻿
var _toDo: TODO;
var _search: Search;

window.onscroll = () => {
    if (window.pageYOffset >= 170) {
        _search.deattachSearchline();
    } else {
        _search.attachSearchline();
    }
}
window.onload = () => {
    
    let elem = document.getElementById("main");
     
    let root = document.getElementById("content");
    _toDo = new TODO(root, root);

    document.getElementById("assistLine").appendChild(document.createElement("br"));
    _search = new Search(document.getElementById("assistLine"), _toDo); 
    _toDo.setOnChangeListener(_search);
    try {
        _toDo.load();
        _toDo.display();
    } catch (e) { }
};

window.onbeforeunload  = () => {
    _toDo.save();
    _search.restore();
}

window.addEventListener("focus", () => {
    try {
        _toDo.load();
        _toDo.display();
        _search.restore();
    } catch (e) { }
});

window.addEventListener("blur", () => {
    try {
        _toDo.save();
    } catch (e) { }
});

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