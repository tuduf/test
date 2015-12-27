var Search = (function () {
    function Search(root, todo) {
        var _this = this;
        this.todo = null;
        this.content = null;
        this.root = null;
        this.button = null;
        this.inputSearch = null;
        this.lastSearchText = "";
        this.label = null;
        this.helperShell = null;
        this.shell = null;
        this.searchItems = null;
        this.todo = todo;
        this.content = todo.getItems();
        this.root = root;
        this.currentIndex = 0;
        this.length = 0;
        this.shell = document.createElement("div");
        this.inputSearch = document.createElement("input");
        this.inputSearch.placeholder = "Поиск по задачам";
        try {
            this.inputSearch.classList.add("form-control");
        }
        catch (e) {
            this.inputSearch.className += " form-control";
        }
        this.shell.id = "searchLine";
        this.inputSearch.addEventListener("keyup", function (ev) {
            if (ev.keyCode === 13) {
                _this.search();
            }
        });
        this.shell.appendChild(this.inputSearch);
        this.shell.appendChild(this.createAssistLine());
        this.hideHelperShell();
        this.root.appendChild(this.shell);
    }
    Search.prototype.search = function () {
        var _this = this;
        var text = escapeHtml(this.inputSearch.value);
        if (text == "") {
            return;
        }
        if (this.lastSearchText === text) {
            this.down();
            return;
        }
        else {
            this.clear();
        }
        this.displayHelperShell();
        this.lastSearchText = this.inputSearch.value;
        var i = 0;
        var searches = this.todo.getMainTable().getElementsByClassName("search");
        for (var index = 0; index < searches.length; ++index) {
            searches[index].innerHTML = searches[index].innerHTML.replace(new RegExp('(' + text + ')', 'gim'), function (replacer, args) {
                var classSpan = "wrap";
                if (_this.currentIndex == i) {
                    classSpan = "wrap";
                }
                _this.length++;
                i++;
                return "<span class='" + classSpan + "'>" + replacer + "</span>";
            });
        }
        if (this.length > 0) {
            this.searchItems = document.getElementsByClassName("wrap");
            this.goToIndex(0);
        }
        else {
            this.displayLabel();
        }
    };
    Search.prototype.attachSearchline = function () {
        try {
            this.shell.classList.remove("deattach");
        }
        catch (e) {
            this.shell.className = "";
        }
    };
    Search.prototype.deattachSearchline = function () {
        try {
            this.shell.classList.add("deattach");
        }
        catch (e) {
            this.shell.className = " deattach";
        }
    };
    Search.prototype.createCloseButton = function () {
        var _this = this;
        var close = document.createElement("input");
        close.type = "button";
        close.value = "Закрыть";
        close.addEventListener("click", function (ev) {
            _this.hardClear();
        });
        try {
            close.classList.add("btn");
            close.classList.add("btn-primary");
        }
        catch (e) {
            close.className += " btn btn-primary";
        }
        return close;
    };
    Search.prototype.hardClear = function () {
        this.clear();
        this.hideHelperShell();
        this.lastSearchText = "";
        this.inputSearch.value = "";
        this.inputSearch.blur();
        this.searchItems = null;
    };
    Search.prototype.createAssistLine = function () {
        var _this = this;
        this.helperShell = document.createElement("div");
        var up = document.createElement("input");
        up.type = "button";
        up.value = "/\\";
        up.addEventListener("click", function (ev) {
            _this.up();
        });
        try {
            up.classList.add("btn");
        }
        catch (e) {
            up.className += " btn";
        }
        var down = document.createElement("input");
        down.type = "button";
        down.value = "\\/";
        down.addEventListener("click", function (ev) {
            _this.down();
        });
        try {
            down.classList.add("btn");
        }
        catch (e) {
            down.className += " btn";
        }
        this.label = document.createElement("div");
        try {
            this.label.classList.add("labelSearch");
        }
        catch (e) {
            this.label.className += " labelSearch";
        }
        this.displayLabel();
        this.helperShell.appendChild(up);
        this.helperShell.appendChild(down);
        this.helperShell.appendChild(this.label);
        this.helperShell.appendChild(this.createCloseButton());
        this.helperShell.id = "helperSearch";
        return this.helperShell;
    };
    Search.prototype.displayLabel = function () {
        this.label.textContent = (this.length === 0 ? "0" : (this.currentIndex + 1)) + " из " + this.length;
    };
    Search.prototype.displayHelperShell = function () {
        try {
            this.helperShell.classList.remove("hidden");
        }
        catch (e) {
            this.helperShell.className = "";
        }
    };
    Search.prototype.hideHelperShell = function () {
        try {
            this.helperShell.classList.add("hidden");
        }
        catch (e) {
            this.helperShell.className += " hidden";
        }
    };
    Search.prototype.restore = function () {
        if (this.length > 0) {
            var tmpIndex = this.currentIndex;
            this.lastSearchText = "";
            this.search();
            try {
                this.searchItems[this.currentIndex].classList.remove("currentWrap");
            }
            catch (e) {
                this.searchItems[this.currentIndex].className = " wrap";
            }
            this.currentIndex = tmpIndex;
            this.goToIndex(this.currentIndex);
        }
    };
    Search.prototype.scrollToCurrent = function () {
        window.scroll(0, this.findPos(this.searchItems[this.currentIndex]) - 200);
    };
    Search.prototype.up = function () {
        this.goToIndex(this.currentIndex - 1);
    };
    Search.prototype.down = function () {
        this.goToIndex(this.currentIndex + 1);
    };
    Search.prototype.goToIndex = function (index) {
        if (this.length > 0) {
            try {
                try {
                    this.searchItems[this.currentIndex].classList.remove("currentWrap");
                }
                catch (e) {
                    this.searchItems[this.currentIndex].className = " wrap";
                }
                if (index >= this.length) {
                    this.currentIndex = 0;
                }
                else if (index < 0) {
                    this.currentIndex = this.length - 1;
                }
                else {
                    this.currentIndex = index;
                }
                try {
                    this.searchItems[this.currentIndex].classList.add("currentWrap");
                }
                catch (e) {
                    this.searchItems[this.currentIndex].className = " wrap currentWrap";
                }
                this.displayLabel();
                this.scrollToCurrent();
            }
            catch (e) {
                this.hardClear();
            }
        }
    };
    Search.prototype.clear = function () {
        this.length = 0;
        this.currentIndex = 0;
        this.todo.display();
    };
    Search.prototype.findPos = function (obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return curtop;
        }
    };
    Search.prototype.change = function (newText) {
        this.todo.display();
        this.hideHelperShell();
        this.length = 0;
        this.currentIndex = 0;
        this.hideHelperShell();
        this.lastSearchText = "";
        this.inputSearch.blur();
        this.searchItems = null;
    };
    return Search;
})();
