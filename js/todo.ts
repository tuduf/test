
interface TODOChange {
    change(newText: string);
}

class TODOItem<T> {
    subject: T = null;
    isdone: boolean;
    constructor(subject: T) {
        this.subject = subject;
        this.isdone = false;
    }
}

class TODOListSaver {
    constructor() { }

    save(list: LinkedList<TODOItem<string>>) {
        try {
            localStorage.setItem("item", JSON.stringify(list.toArray()));
        } catch (e) {
            /* we are not able to save*/
        }
    }

    load(): LinkedList<TODOItem<string>> {
        try {
            var array = JSON.parse(localStorage['item']);
            var list: LinkedList<TODOItem<string>> = new LinkedList<TODOItem<string>>();
            for (var i: number = 0; i < array.length; ++i) {
                list.add((<TODOItem<string>>array[i]));
            }

            return list;
        } catch (e) {
            return new LinkedList<TODOItem<string>>();
        }
    }
}

class TODOItemList {

    private list: LinkedList<TODOItem<string>>;
    private saver: TODOListSaver;

    constructor() {
        this.list = new LinkedList<TODOItem<string>>();
        this.saver = new TODOListSaver();
    }


    forEach(callback: LoopFunction<TODOItem<string>>) {
        this.list.forEach(callback);
    }

    size(): number {
        return this.list.size();
    }

    add(item: string): void {
        var obj = new TODOItem<string>(item);
        this.list.add(obj);
    }

    remove(index: number): void {
        this.list.remove(index);
    }

    getItem(index: number): TODOItem<string> {
        return this.list.nodeIndex(index).element;
    }

    public save() {
        this.saver.save(this.list);
    }

    public load() {
        this.list = this.saver.load();
    }

}

class TODO {
    private mainElement: HTMLElement = null;
    private inputText: HTMLTextAreaElement = null;
    private helperElement: HTMLElement = null;
    private itemTODOList: TODOItemList = null;
    private table: HTMLElement = null;
    private title: HTMLElement = null;
    private listener: TODOChange = null;
    constructor(mainElement: HTMLElement, helperElement: HTMLElement) {
        this.mainElement = mainElement;
        this.helperElement = helperElement;
        this.itemTODOList = new TODOItemList();
        this.createAssistLine();
        this.createMainTable();
        this.display();
    }

    getItems(): TODOItemList {
        return this.itemTODOList;
    }

    getMainTable(): HTMLElement {
        return this.table;
    }

    public setOnChangeListener(listener: TODOChange): void {
        this.listener = listener;
    }

    public save() {
        this.itemTODOList.save();
    }

    public load() {
        this.itemTODOList.load();
    }

    private createMainTable() {
        this.table = document.createElement("table");

        this.table.id = "mainTable";

        this.mainElement.appendChild(this.table);
    }

    private createAssistLine(): void {
        var shell = document.createElement("div");
        var input = document.createElement("input");
        this.title = document.createElement("h1");
        this.title.id = "mainTitle";
        this.inputText = document.createElement("textarea");

        addClass(input, "btn");
        addClass(input, "btn-info");

        try {
            this.inputText.classList.add("form-control");

        } catch (e) {
            this.inputText.className += " form-control";
        }

        this.inputText.addEventListener("keyup", (ev: KeyboardEvent) => {

            if (ev.keyCode === 13) {
                this.addItem(this.inputText.value.trim());
            }
        });

        input.type = "button";
        input.value = "Добавить";
        shell.id = "assistLine";

        input.addEventListener("click", (ev: MouseEvent) => {
            this.addItem(this.inputText.value);
        });

        shell.appendChild(this.inputText);
        shell.appendChild(document.createElement("br"));
        shell.appendChild(input);

        this.helperElement.appendChild(shell);
        this.mainElement.appendChild(this.title);
    }

    public addItem(item: string): void {
        
        if (item !== "") {
            this.itemTODOList.add(escapeHtml(item));
            this.display();
        } else {
            this.inputText.value = "";
            return;
        }
        this.save();
        this.inputText.value = "";

        if (this.listener !== null) {
            this.listener.change(null);
        }
    }

    public display(refresh?: boolean): void {

        this.displayTODOList();
    }

    private displayTODOList(): void {
        this.table.innerHTML = "";

        let th1 = document.createElement("th");
        th1.textContent = "Выполнено";

        let th2 = document.createElement("th");
        th2.textContent = "Описание задачи";

        let tr = document.createElement("tr");
        tr.appendChild(th1);
        tr.appendChild(th2);

        this.table.appendChild(tr);

        if (this.itemTODOList.size() === 0) {
            this.title.textContent = "Нет заданий";

            addClass(this.table, "hidden");
        } else {
            removeClass(this.table, "hidden");

            this.title.textContent = "";
            this.itemTODOList.forEach((elem: TODOItem<string>, index: number) => {

                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
                td2.id = "t" + index;



                let checkbox = document.createElement("input");
                let span = document.createElement("span");
                span.id = "s" + index;
                span.innerHTML = elem.subject;
                addClass(span, "search");
                span.addEventListener("click", (ev: UIEvent) => {
                    if (this.listener !== null) {
                        this.listener.change(null);
                    }
                    var currentElem: HTMLElement = <HTMLElement>ev.currentTarget;
                    
                    var id: number = Number(currentElem.id.replace("s", ""));
                    var td: HTMLElement = document.getElementById("t" + id);
                    var ta: HTMLTextAreaElement = document.createElement("textarea");

                    var text: string = currentElem.innerHTML.replace(/<\/?[^>]+>/gi, '');

                    addClass(ta, "form-control");

                    ta.value = unescapeHtml(this.getItems().getItem(id).subject);
                    ta.id = "a" + id;
                    td.innerHTML = "";
                    ta.addEventListener("blur", (ev: FocusEvent) => {
                        let ta: HTMLTextAreaElement = <HTMLTextAreaElement>ev.currentTarget;

                        let id: number = Number(ta.id.replace("a", ""));
                        var item = this.itemTODOList.getItem(id);
                        if (ta.value !== "") {
                            item.subject = escapeHtml(ta.value);
                            
                        } else {
                            this.itemTODOList.remove(id);

                        }

                        this.save();
                        this.display();
                    });

                    td.appendChild(ta);
                    ta.focus();
                });

                checkbox.type = "checkbox";
                checkbox.id = "c" + index;

                if (elem.isdone) {
                    checkbox.checked = true;
                    addClass(span, "done");
                }
                checkbox.addEventListener("change", (ev: UIEvent) => {
                    let currentElem: HTMLInputElement = <HTMLInputElement>ev.currentTarget;
                    var id: number = Number(currentElem.id.replace("c", ""));
                    var span = document.getElementById("s" + id);

                    var elem = this.itemTODOList.getItem(id);
                    elem.isdone = !elem.isdone;

                    if (elem.isdone) {
                        addClass(span, "done");
                    } else {
                        removeClass(span, "done");
                    }

                    this.save();
                });

                td1.appendChild(checkbox);
                td2.appendChild(span);

                tr.appendChild(td1);
                tr.appendChild(td2);

                this.table.appendChild(tr);

            });
        }
    }
}