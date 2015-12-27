class Search implements TODOChange{
    private todo: TODO = null;
    private content: TODOItemList = null;
    private root: HTMLElement = null;
    private button: HTMLInputElement = null;
    private inputSearch: HTMLInputElement = null;
    private lastSearchText: string = "";
    private length: number;
    private currentIndex: number;
    private label: HTMLElement = null;
    private helperShell: HTMLElement = null;
    private shell: HTMLElement = null;
    private searchItems: NodeListOf<HTMLElement> = null;
    constructor(root: HTMLElement, todo: TODO) {
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
        } catch (e) {
            this.inputSearch.className += " form-control";
        }

        this.shell.id = "searchLine";

        this.inputSearch.addEventListener("keyup", (ev: KeyboardEvent) => {
            if (ev.keyCode === 13) {
                this.search();
            }
        });

        this.shell.appendChild(this.inputSearch);
        this.shell.appendChild(this.createAssistLine());
        
        this.hideHelperShell();
        this.root.appendChild(this.shell);
    }

    private search() {
        
        //is.content.forEach();
        var text = escapeHtml(this.inputSearch.value);
        if (text == "") {
            

            return;
        }

        if (this.lastSearchText === text) {
            this.down();
            return;
        } else {
            this.clear();
        }

        this.displayHelperShell();

        this.lastSearchText = this.inputSearch.value;

        var i = 0;

        var searches: NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>this.todo.getMainTable().getElementsByClassName("search");

        for (var index = 0; index < searches.length; ++index) {
            searches[index].innerHTML = searches[index].innerHTML.replace(new RegExp('(' + text + ')', 'gim'), (replacer: string, args): string => {
                var classSpan: string = "wrap";
                if (this.currentIndex == i) {
                    classSpan = "wrap";
                }
                this.length++;
                i++;
                return "<span class='" + classSpan + "'>" + replacer + "</span>";
            });
        }

        if (this.length > 0) {
            this.searchItems = <NodeListOf<HTMLElement>>document.getElementsByClassName("wrap");
            this.goToIndex(0);
        } else {
            this.displayLabel();
        }

        
    }

    public attachSearchline(): void {
        try {
            this.shell.classList.remove("deattach");
        } catch (e) {
            this.shell.className = "";
        }
    }

    public deattachSearchline(): void {
        try {
            this.shell.classList.add("deattach");
        } catch (e) {
            this.shell.className = " deattach";
        }
    }

    private createCloseButton(): HTMLElement {
        var close = document.createElement("input");
        close.type = "button";
        close.value = "Закрыть";

        close.addEventListener("click", (ev: MouseEvent) => {
            this.hardClear();
        });

        try {
            close.classList.add("btn");
            close.classList.add("btn-primary");
        } catch (e) {
            close.className += " btn btn-primary";
        }

        return close;
    }

    private hardClear() {
        this.clear();
        this.hideHelperShell();
        this.lastSearchText = "";
        this.inputSearch.value = "";
        this.inputSearch.blur();
        this.searchItems = null;
    }

    private createAssistLine(): HTMLElement {
        this.helperShell = document.createElement("div");
        var up = document.createElement("input");
        up.type = "button";
        up.value = "/\\";

        up.addEventListener("click", (ev: MouseEvent) => {
            this.up();
        });

        try {
            up.classList.add("btn");
        } catch (e) {
            up.className += " btn";
        }

        var down = document.createElement("input");
        down.type = "button";
        down.value = "\\/";

        down.addEventListener("click", (ev: MouseEvent) => {
            this.down();
        });

        try {
            down.classList.add("btn");
        } catch (e) {
            down.className += " btn";
        }

        this.label = document.createElement("div");

        try {
            this.label.classList.add("labelSearch");
        } catch (e) {
            this.label.className += " labelSearch";
        }

        this.displayLabel();

        this.helperShell.appendChild(up);
        this.helperShell.appendChild(down);
        this.helperShell.appendChild(this.label);
        this.helperShell.appendChild(this.createCloseButton());

        this.helperShell.id = "helperSearch";

        return this.helperShell;
    }

    displayLabel(): void {
        this.label.textContent = (this.length === 0 ? "0" : (this.currentIndex + 1)) + " из " + this.length;
    }

    displayHelperShell(): void {
        try {
            this.helperShell.classList.remove("hidden");
        } catch (e) {
            this.helperShell.className = "";
        }
    }

    hideHelperShell(): void {
        try {
            this.helperShell.classList.add("hidden");
        } catch (e) {
            this.helperShell.className += " hidden";
        }
    }

    public restore() {

        if (this.length > 0) {


            var tmpIndex = this.currentIndex;
            this.lastSearchText = "";
            this.search();

            try {
                this.searchItems[this.currentIndex].classList.remove("currentWrap");
            } catch (e) {
                this.searchItems[this.currentIndex].className = " wrap";
            }

            this.currentIndex = tmpIndex;
            this.goToIndex(this.currentIndex);
        }
    }

    private scrollToCurrent(): void {
        window.scroll(0, this.findPos(this.searchItems[this.currentIndex]) - 200);
    }

    private up(): void {
        this.goToIndex(this.currentIndex - 1);
    }

    private down(): void {
        this.goToIndex(this.currentIndex + 1);
    }

    private goToIndex(index: number): void{
        if (this.length > 0) {
            try {
                try {
                    this.searchItems[this.currentIndex].classList.remove("currentWrap");
                } catch (e) {
                    this.searchItems[this.currentIndex].className = " wrap";
                }

                if (index >= this.length) {
                    this.currentIndex = 0;
                } else if (index < 0) {
                    this.currentIndex = this.length - 1;
                } else {
                    this.currentIndex = index;
                }

                try {
                    this.searchItems[this.currentIndex].classList.add("currentWrap");
                } catch (e) {
                    this.searchItems[this.currentIndex].className = " wrap currentWrap";
                }

                this.displayLabel();
                this.scrollToCurrent();
            } catch (e) {
                this.hardClear();
            }
        }

    }

    public clear() {
        this.length = 0;
        this.currentIndex = 0;
        this.todo.display();
    }

    private findPos(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return curtop;
        }
    }
    
    public change(newText: string) {
        this.todo.display();
        this.hideHelperShell();
        this.length = 0;
        this.currentIndex = 0;
        this.hideHelperShell();
        this.lastSearchText = "";
        
        this.inputSearch.blur();
        this.searchItems = null;
    }
}

