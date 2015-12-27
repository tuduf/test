var TODOItem = (function () {
    function TODOItem(subject) {
        this.subject = null;
        this.subject = subject;
        this.isdone = false;
    }
    return TODOItem;
})();
var TODOListSaver = (function () {
    function TODOListSaver() {
    }
    TODOListSaver.prototype.save = function (list) {
        try {
            localStorage.setItem("item", JSON.stringify(list.toArray()));
        }
        catch (e) {
        }
    };
    TODOListSaver.prototype.load = function () {
        try {
            var array = JSON.parse(localStorage['item']);
            var list = new LinkedList();
            for (var i = 0; i < array.length; ++i) {
                list.add(array[i]);
            }
            return list;
        }
        catch (e) {
            return new LinkedList();
        }
    };
    return TODOListSaver;
})();
var TODOItemList = (function () {
    function TODOItemList() {
        this.list = new LinkedList();
        this.saver = new TODOListSaver();
    }
    TODOItemList.prototype.forEach = function (callback) {
        this.list.forEach(callback);
    };
    TODOItemList.prototype.size = function () {
        return this.list.size();
    };
    TODOItemList.prototype.add = function (item) {
        var obj = new TODOItem(item);
        this.list.add(obj);
    };
    TODOItemList.prototype.remove = function (index) {
        this.list.remove(index);
    };
    TODOItemList.prototype.getItem = function (index) {
        return this.list.nodeIndex(index).element;
    };
    TODOItemList.prototype.save = function () {
        this.saver.save(this.list);
    };
    TODOItemList.prototype.load = function () {
        this.list = this.saver.load();
    };
    return TODOItemList;
})();
var TODO = (function () {
    function TODO(mainElement, helperElement) {
        this.mainElement = null;
        this.inputText = null;
        this.helperElement = null;
        this.itemTODOList = null;
        this.table = null;
        this.title = null;
        this.listener = null;
        this.mainElement = mainElement;
        this.helperElement = helperElement;
        this.itemTODOList = new TODOItemList();
        this.createAssistLine();
        this.createMainTable();
        this.display();
    }
    TODO.prototype.getItems = function () {
        return this.itemTODOList;
    };
    TODO.prototype.getMainTable = function () {
        return this.table;
    };
    TODO.prototype.setOnChangeListener = function (listener) {
        this.listener = listener;
    };
    TODO.prototype.save = function () {
        this.itemTODOList.save();
    };
    TODO.prototype.load = function () {
        this.itemTODOList.load();
    };
    TODO.prototype.createMainTable = function () {
        this.table = document.createElement("table");
        this.table.id = "mainTable";
        this.mainElement.appendChild(this.table);
    };
    TODO.prototype.createAssistLine = function () {
        var _this = this;
        var shell = document.createElement("div");
        var input = document.createElement("input");
        this.title = document.createElement("h1");
        this.title.id = "mainTitle";
        this.inputText = document.createElement("textarea");
        try {
            input.classList.add("btn");
            input.classList.add("btn-info");
        }
        catch (e) {
            input.className += " btn btn-info";
        }
        try {
            this.inputText.classList.add("form-control");
        }
        catch (e) {
            this.inputText.className += " form-control";
        }
        this.inputText.addEventListener("keyup", function (ev) {
            if (ev.keyCode === 13) {
                _this.addItem(_this.inputText.value.trim());
            }
        });
        input.type = "button";
        input.value = "Добавить";
        shell.id = "assistLine";
        input.addEventListener("click", function (ev) {
            _this.addItem(_this.inputText.value);
        });
        shell.appendChild(this.inputText);
        shell.appendChild(document.createElement("br"));
        shell.appendChild(input);
        this.helperElement.appendChild(shell);
        this.mainElement.appendChild(this.title);
    };
    TODO.prototype.addItem = function (item) {
        if (item !== "") {
            this.itemTODOList.add(escapeHtml(item));
            this.display();
        }
        else {
            this.inputText.value = "";
            return;
        }
        this.save();
        this.inputText.value = "";
        if (this.listener !== null) {
            this.listener.change(null);
        }
    };
    TODO.prototype.display = function (refresh) {
        this.displayTODOList();
    };
    TODO.prototype.displayTODOList = function () {
        var _this = this;
        this.table.innerHTML = "";
        var th1 = document.createElement("th");
        th1.textContent = "Выполнено";
        var th2 = document.createElement("th");
        th2.textContent = "Описание задачи";
        var tr = document.createElement("tr");
        tr.appendChild(th1);
        tr.appendChild(th2);
        this.table.appendChild(tr);
        if (this.itemTODOList.size() === 0) {
            this.title.textContent = "Нет заданий";
            try {
                this.table.classList.add("hidden");
            }
            catch (e) {
                this.table.className += " hidden";
            }
        }
        else {
            try {
                this.table.classList.remove("hidden");
            }
            catch (e) {
                this.table.className = "";
            }
            this.title.textContent = "";
            this.itemTODOList.forEach(function (elem, index) {
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                td2.id = "t" + index;
                var checkbox = document.createElement("input");
                var span = document.createElement("span");
                span.id = "s" + index;
                span.innerHTML = elem.subject;
                try {
                    span.classList.add("search");
                }
                catch (e) {
                    span.className += " search";
                }
                span.addEventListener("click", function (ev) {
                    if (_this.listener !== null) {
                        _this.listener.change(null);
                    }
                    var currentElem = ev.currentTarget;
                    var id = Number(currentElem.id.replace("s", ""));
                    var td = document.getElementById("t" + id);
                    var ta = document.createElement("textarea");
                    var text = currentElem.innerHTML.replace(/<\/?[^>]+>/gi, '');
                    try {
                        ta.classList.add("form-control");
                    }
                    catch (e) {
                        ta.className += " form-control";
                    }
                    ta.value = unescapeHtml(text);
                    ta.id = "a" + id;
                    td.innerHTML = "";
                    ta.addEventListener("blur", function (ev) {
                        var ta = ev.currentTarget;
                        var id = Number(ta.id.replace("a", ""));
                        var item = _this.itemTODOList.getItem(id);
                        if (ta.value !== "") {
                            item.subject = escapeHtml(ta.value);
                        }
                        else {
                            _this.itemTODOList.remove(id);
                        }
                        _this.save();
                        _this.display();
                    });
                    td.appendChild(ta);
                    ta.focus();
                });
                checkbox.type = "checkbox";
                checkbox.id = "c" + index;
                if (elem.isdone) {
                    checkbox.checked = true;
                    try {
                        span.classList.add("done");
                    }
                    catch (e) {
                        span.className += " done";
                    }
                }
                checkbox.addEventListener("change", function (ev) {
                    var currentElem = ev.currentTarget;
                    var id = Number(currentElem.id.replace("c", ""));
                    var span = document.getElementById("s" + id);
                    var elem = _this.itemTODOList.getItem(id);
                    elem.isdone = !elem.isdone;
                    if (elem.isdone) {
                        try {
                            span.classList.add("done");
                        }
                        catch (e) {
                            span.className += " done";
                        }
                    }
                    else {
                        try {
                            span.classList.add("done");
                        }
                        catch (e) {
                            span.className = "";
                        }
                    }
                    _this.save();
                });
                td1.appendChild(checkbox);
                td2.appendChild(span);
                tr.appendChild(td1);
                tr.appendChild(td2);
                _this.table.appendChild(tr);
            });
        }
    };
    return TODO;
})();
