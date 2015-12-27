var LinkedList = (function () {
    function LinkedList() {
        this.length = 0;
    }
    LinkedList.prototype.add = function (item, index) {
        if (index < 0 || index > this.length) {
            return false;
        }
        var newNode = this.createNode(item);
        if (this.length === 0) {
            this.lastNode = newNode;
            this.firstNode = newNode;
        }
        else if (index === 0) {
            this.firstNode.prev = newNode;
            newNode.next = this.firstNode;
            this.firstNode = newNode;
        }
        else if (index === this.length || isNaN(index)) {
            this.lastNode.next = newNode;
            newNode.prev = this.lastNode;
            this.lastNode = newNode;
        }
        else {
            var prev = this.nodeIndex(index - 1);
            newNode.prev = prev;
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.length++;
        return true;
    };
    LinkedList.prototype.nodeIndex = function (index) {
        if (index < 0 || index >= this.length) {
            return null;
        }
        if (index === (this.length - 1)) {
            return this.lastNode;
        }
        var node = this.firstNode;
        if (index > (this.length) / 2) {
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
        }
        else {
            node = this.lastNode;
            for (var i = this.length - 1; i > index; i--) {
                node = node.prev;
            }
        }
        return node;
    };
    LinkedList.prototype.toArray = function () {
        var arr = [];
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            arr.push(currentNode.element);
            currentNode = currentNode.next;
        }
        return arr;
    };
    LinkedList.prototype.remove = function (index) {
        if (index < 0 || index >= this.length) {
            return undefined;
        }
        var element;
        if (this.length === 1) {
            element = this.firstNode.element;
            this.firstNode = null;
            this.lastNode = null;
        }
        else {
            if (isNaN(index)) {
                element = this.lastNode.element;
                this.lastNode = this.lastNode.prev;
                this.lastNode.next = null;
            }
            else {
                var prev = this.nodeIndex(index - 1);
                if (prev === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                    this.firstNode.prev = null;
                }
                else if (prev.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = prev;
                    prev.next = null;
                }
                else if (prev !== null) {
                    element = prev.next.element;
                    prev.next = prev.next.next;
                    prev.next.prev = prev;
                }
            }
        }
        this.length--;
        return element;
    };
    LinkedList.prototype.clear = function () {
        this.firstNode = null;
        this.lastNode = null;
        this.length = 0;
    };
    LinkedList.prototype.size = function () {
        return this.length;
    };
    LinkedList.prototype.forEach = function (callback) {
        var currentNode = this.firstNode;
        var i = 0;
        while (currentNode !== null) {
            if (callback(currentNode.element, i) === false) {
                break;
            }
            currentNode = currentNode.next;
            i++;
        }
    };
    LinkedList.prototype.createNode = function (el) {
        return {
            element: el,
            next: null,
            prev: null
        };
    };
    return LinkedList;
})();
