/*
   @22.12.2015
   @реализация примитивного двустороннего связанного списка.
   @Степанов Николай
*/

interface LinkedListNode<T> extends Base<T> {
    element: T;
    next: LinkedListNode<T>;
    prev: LinkedListNode<T>;
}



class LinkedList<T> implements Collection<T> {
    public firstNode: LinkedListNode<T>;
    public lastNode: LinkedListNode<T>;
    private length: number = 0;

    constructor() { }

    public add(item: T, index?: number): boolean {
        if (index < 0 || index > this.length) {
            return false;
        }

        var newNode = this.createNode(item);

        if (this.length === 0) {
            this.lastNode = newNode;
            this.firstNode = newNode;
        } else if (index === 0) {
            this.firstNode.prev = newNode;
            newNode.next = this.firstNode;
            this.firstNode = newNode;
        } else if (index === this.length || isNaN(index)) {
            this.lastNode.next = newNode;
            newNode.prev = this.lastNode;
            this.lastNode = newNode;
        } else {
            var prev = this.nodeIndex(index - 1);
            newNode.prev = prev;
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.length++;
        return true;
    }


    public nodeIndex(index: number): LinkedListNode<T> {

        if (index < 0 || index >= this.length) {
            return null;
        }
        if (index === (this.length - 1)) {
            return this.lastNode;
        }


        var node = this.firstNode;
        for (var i = 0; i < index; i++) {
            node = node.next;
        }
        return node;
    }


    public toArray(): T[] {
        var arr: T[] = [];
        var currentNode: LinkedListNode<T> = this.firstNode;
        while (currentNode !== null) {
            arr.push(currentNode.element);
            currentNode = currentNode.next;
        }
        return arr;
    }

    public remove(index?: number): T {
        if (index < 0 || index >= this.length) {
            return undefined;
        }

        var element: T;
        if (this.length === 1) {
            element = this.firstNode.element;
            this.firstNode = null;
            this.lastNode = null;
        } else {

            if (isNaN(index)) {
                element = this.lastNode.element;
                this.lastNode = this.lastNode.prev;
                this.lastNode.next = null;
            } else {

                const prev = this.nodeIndex(index - 1);
                if (prev === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                    this.firstNode.prev = null;
                } else if (prev.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = prev;
                    prev.next = null;
                } else if (prev !== null) {
                    element = prev.next.element;
                    prev.next = prev.next.next;
                    prev.next.prev = prev;
                }

            }
        }

        this.length--;
        return element;
    }


    public clear(): void {
        this.firstNode = null;
        this.lastNode = null;
        this.length = 0;
    }


    public size(): number {
        return this.length;
    }


     public forEach(callback: LoopFunction<T>): void {
        var currentNode = this.firstNode;
        var i = 0;
        while (currentNode !== null) {
            if (callback(currentNode.element, i) === false) {
                break;
            }
            currentNode = currentNode.next;
            i++;
        }
    }

    private createNode(el: T): LinkedListNode<T> {
        return {
            element: el,
            next: null,
            prev: null
        };
    }
}