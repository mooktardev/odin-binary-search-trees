const Node = (value = null, leftNode = null, rightNode = null) => {
    return { value, leftNode, rightNode };
};


class BinaryTree {
    constructor(array) {
        const sortedArray = [...new Set(array)].sort((a, b) => a - b);
        this.root = this.build(sortedArray);
    }

    build(sortedArray) {
        if (sortedArray.length === 0) return null;

        const midpoint = Math.floor(sortedArray.length / 2);
        const newNode = Node(sortedArray[midpoint]);
        newNode.leftNode = this.build(sortedArray.slice(0, midpoint));
        newNode.rightNode = this.build(sortedArray.slice(midpoint + 1));
        return newNode;
    }

    insert(value, currentNode = this.root) {
        if (currentNode === null) return Node(value);
        if (currentNode.value === value) return;

        if (currentNode.value < value) {
            currentNode.rightNode = this.insert(value, currentNode.rightNode);
        } else {
            currentNode.leftNode = this.insert(value, currentNode.leftNode);
        }
        return currentNode;
    }

    remove(value, currentNode = this.root) {
        if (currentNode === null) return currentNode;

        if (currentNode.value === value) {
            currentNode = this.#removeNodeHelper(currentNode);
        } else if (currentNode.value > value) {
            currentNode.leftNode = this.remove(value, currentNode.leftNode);
        } else {
            currentNode.rightNode = this.remove(value, currentNode.rightNode);
        }
        return currentNode;
    }

    find(value, node = this.root) {
        if (node === null || node.value === value) return node;

        if (node.value < value) {
            return this.find(value, node.rightNode);
        } else {
            return this.find(value, node.leftNode);
        }
    }

    levelOrder(callbackFn) {
        const queue = [this.root];
        const levelOrderList = [];
        while (queue.length > 0) {
            const currentNode = queue.shift();
            callbackFn
                ? callbackFn(currentNode)
                : levelOrderList.push(currentNode.value);

            const enqueueList = [
                currentNode?.leftNode,
                currentNode?.rightNode,
            ].filter((value) => value);
            queue.push(...enqueueList);
        }
        if (levelOrderList.length > 0) return levelOrderList;
    }

    inorder(callbackFn, node = this.root, inorderList = []) {
        if (node === null) return;

        this.inorder(callbackFn, node.leftNode, inorderList);
        callbackFn ? callbackFn(node) : inorderList.push(node.value);
        this.inorder(callbackFn, node.rightNode, inorderList);

        if (inorderList.length > 0) return inorderList;
    }

    preorder(callbackFn, node = this.root, preorderList = []) {
        if (node === null) return;

        callbackFn ? callbackFn(node) : preorderList.push(node.value);
        this.preorder(callbackFn, node.leftNode, preorderList);
        this.preorder(callbackFn, node.rightNode, preorderList);

        if (preorderList.length > 0) return preorderList;
    }

    postorder(callbackFn, node = this.root, postorderList = []) {
        if (node === null) return;

        this.postorder(callbackFn, node.leftNode, postorderList);
        this.postorder(callbackFn, node.rightNode, postorderList);
        callbackFn ? callbackFn(node) : postorderList.push(node.value);

        if (postorderList.length > 0) return postorderList;
    }

    height(node = this.root) {
        if (node === null) return 0;

        const leftHeight = this.height(node.leftNode);
        const rightHeight = this.height(node.rightNode);

        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(nodeVal, node = this.root, edgeCount = 0) {
        if (node === null) return;
        if (node.value === nodeVal) return edgeCount;

        if (node.value < nodeVal) {
            return this.depth(nodeVal, node.rightNode, edgeCount + 1);
        } else {
            return this.depth(nodeVal, node.leftNode, edgeCount + 1);
        }
    }

    isBalanced() {
        return this.#testBalance(this.root) !== -1;
    }

    rebalance() {
        const inorderList = this.inorder();
        this.root = this.build(inorderList);
    }

    prettyPrint(node = this.root, prefix = "", isLeft = true) {
        if (node.rightNode) {
            this.prettyPrint(
                node.rightNode,
                `${prefix}${isLeft ? "|   " : "    "}`,
                false
            );
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.leftNode) {
            this.prettyPrint(
                node.leftNode,
                `${prefix}${isLeft ? "    " : "|   "}`,
                true
            );
        }
    }

    // private methods
    #testBalance(node) {
        if (node === null) return 0;

        const leftBalance = this.#testBalance(node.leftNode);
        const rightBalance = this.#testBalance(node.rightNode);
        const diff = Math.abs(leftBalance - rightBalance);

        if (leftBalance === -1 || rightBalance === -1 || diff > 1) {
            return -1;
        } else {
            return Math.max(leftBalance, rightBalance) + 1;
        }
    }

    #inorderSuccessorFor(node) {
        let currentNode = node;
        while (currentNode.leftNode) {
            currentNode = currentNode.leftNode;
        }
        return currentNode;
    }

    #removeNodeHelper(node) {
        if (node.leftNode && node.rightNode) {
            const successorNode = this.#inorderSuccessorFor(node.rightNode);
            node.value = successorNode.value;
            node.rightNode = this.remove(successorNode.value, node.rightNode);
            return node;
        } else {
            const replacementNode = node.rightNode || node.leftNode;
            node = null;
            return replacementNode;
        }
    }
}


const randomArray = (size) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}


const tree = new BinaryTree(randomArray(40));


console.log(tree.isBalanced());

console.log(tree.levelOrder());
console.log(tree.inorder());
console.log(tree.preorder());
console.log(tree.postorder());

tree.insert(300);
tree.insert(400);
tree.insert(500);

console.log(tree.isBalanced());
tree.rebalance();
console.log(tree.isBalanced());

console.log(tree.levelOrder());
console.log(tree.inorder());
console.log(tree.preorder());
console.log(tree.postorder());

tree.prettyPrint();