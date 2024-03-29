// Student name: Gene Lee
// Student ID: 11216720

function BST(compareFunction)
{
    this.m_root = null;
    this.m_first = null;
    this.m_last = null;

    this.forEach = function (callback, useInsertionOrder) {
    	if (callback !== undefined) 
    	{
    		if (useInsertionOrder !== undefined && useInsertionOrder) // true insertion order
    		{ 
    			var node = this.m_first;
    			while (node != null)
    			{
    				callback(node.value, this.m_root);
    				node = node.next;
    			}
    		}
    		else
    		{
    			var thisBSTClass = this; // need to do this since inOrder() doesn't know this
    			var inOrder = function (callback2, node) {
					if (node === undefined || node === null) { return; }
					inOrder(node.left);
					callback2(node.value, thisBSTClass.m_root)
					inOrder(node.right);
				};

				inOrder(callback, this.m_root);
    		}
    	}
    }

    if (compareFunction === undefined || compareFunction == null)
    {
        this.m_compare = function(a,b)
        {
            if (a < b) { return -1; }
            else if (a > b) { return 1; }
            return 0;
        };
    }
    else
    {
        this.m_compare = compareFunction;
    }
    Object.seal(this);
}

// Function that takes a single parameter for a value to add to the tree. 
// Do not allow duplicates. Return true if the value is successfully added into the tree, false otherwise. 
// Use the standard BST insertion rules. Do not balance the tree in any way.
BST.prototype.add = function (valueToAdd) 
{
	if (this.m_root == null)
	{
		this.m_root = { left: null, right: null, value: valueToAdd, previous: null, next: null };
		this.m_first = this.m_root;
		return true;
	}

	var thisBSTClass = this; // need to do this since addLL() doesn't know this

	var addLL = function (node) {
		var prev = thisBSTClass.m_first;
        var curr = thisBSTClass.m_first.next;

        while (curr !== null) {
            prev = curr;
            curr = curr.next;
        }

        // at the end
        prev.next = node;
        node.previous = prev;
        thisBSTClass.m_last = node;
	}
	
	var node = this.m_root;
	
	while (true)
	{
		if (this.m_compare(node.value, valueToAdd) > 0)
		{
			if (node.left == null)
			{
				node.left = { left: null, right: null, value: valueToAdd, previous: null, next: null };
				addLL(node.left);
				return true;
			}
			node = node.left;
		}
		else if (this.m_compare(node.value, valueToAdd) == -1)
		{
			if (node.right == null)
			{
				node.right = { left: null, right: null, value: valueToAdd, previous: null, next: null };
				addLL(node.right);
				return true;
			}
			node = node.right;
		}
		else { return false; }
	}
}

// Function that is callable with no parameters that returns the number of values in the tree. 
// Returns 0 if the tree is empty.
BST.prototype.count = function ()
{
	var count = 0;;

	if (this.m_root === undefined || this.m_root === null) { return count; }

	var inOrderCount = function (node)
	{
		if (node === undefined || node === null) { return; }
		inOrderCount(node.left);
		count++;
		inOrderCount(node.right);
	};

	inOrderCount(this.m_root); 
	return count;
}

// Function that takes a single parameter for a value to search for in the tree. 
// If the value is found, the level index of the node containing the value is returned. 
// This is a zero-based index, so the root is on level 0, its children on level 1, and so on. 
// If the value is not in the tree, then return -1.
BST.prototype.getLevel = function (valueToSearch)
{
	if (this.m_root === undefined || this.m_root === null) { return undefined; }

	var node = this.m_root;
	var level = 0;
	
	while (node)
	{
		if (node.value == valueToSearch)
		{
			return level;
		}

		if (this.m_compare(node.value, valueToSearch) > 0) // less than move to the left
		{
			node = node.left;
		}
		else if (this.m_compare(node.value, valueToSearch) == -1)
		{
			node = node.right;
		}
		level++;
	}
	return level;
}

// Function that is callable with no parameters that returns the maximum value in the tree. 
// Return undefined if the tree is empty.
BST.prototype.getMax = function ()
{
	if (this.m_root === undefined || this.m_root === null) { return undefined; }

	var getMaxHelper = function(node) {
		if (node === undefined || node === null)
		{
			return undefined;
		}
		if (node.right)
		{
			return getMaxHelper(node.right);
		}
		return node.value;
	};

	return getMaxHelper(this.m_root);
}

// Function that is callable with no parameters that returns the minimum value in the tree. 
// Return undefined if the tree is empty.
BST.prototype.getMin = function ()
{
	if (this.m_root === undefined || this.m_root === null) { return undefined; }

	var getMinHelper = function(node) {
		if (node === undefined || node === null)
		{
			return undefined;
		}
		if (node.left)
		{
			return getMinHelper(node.left);
		}
		return node.value;
	};

	return getMinHelper(this.m_root);
}

// Function that takes a single parameter for a value. 
// Returns true if the value is in the tree, false if it is not.
BST.prototype.has = function (hasValue)
{
	var node = this.m_root;
	
	while (node)
	{
		if (node.value == hasValue)
		{
			return true;
		}

		if (this.m_compare(node.value, hasValue) > 0) // less than move to the left
		{
			node = node.left;
		}
		else if (this.m_compare(node.value, hasValue) == -1)
		{
			node = node.right;
		}
	}
	return false;
}

// Function that takes a single value to remove from the tree. 
// Use the removal rules discussed in class (which are the standard removal rules). 
// Opt for the max value in the left subtree when you need to do a swap for a removal of a node with 2 children. 
// Return true if the value is found and removed, false otherwise.
BST.prototype.remove = function (valueToRemove)
{
	if (this.m_root === undefined || this.m_root === null) { return false; }

	var thisBSTClass = this; // need to do this since removeHelper() doesn't know this

	var getMaxHelper = function(node) {
		if (node === undefined || node === null)
		{
			return undefined;
		}
		if (node.right)
		{
			return getMaxHelper(node.right);
		}
		return node;
	};

	var removeHelper = function (node, valueRemove) {
		if (node === undefined || node === null)
		{
			return null;
		}
		if (node.value == valueRemove)
		{
			//removeLL(node);

			if ((node.left == undefined || node.left === null) && (node.right == undefined || node.right === null))
			{
				return null;
			}
			if (node.left == undefined || node.left === null)
			{
				return node.right;
			}
			if (node.right == undefined || node.right === null)
			{
				return node.left;
			}

			// has 2 children
			var maxOfLeftSubtree = getMaxHelper(node.left); // get the max of left subtree
			
			var right = node.right;				// remeber the right subtree
			
			maxOfLeftSubtree.left = removeHelper(node.left, maxOfLeftSubtree.value);	// refactor left subtree
			
			node = maxOfLeftSubtree;			// replace the node to remove with the max of left subtree
			node.right = right;					// replace the found max node's right with the original right subtree
			
			return node;
		}
		else if (thisBSTClass.m_compare(node.value, valueRemove) > 0) // less than move to the left)
		{
			node.left = removeHelper(node.left, valueRemove);
			return node;
		}
		else 
		{
			node.right = removeHelper(node.right, valueRemove);
			return node;
		}
	};

	var removeLL = function () {
	    // m_root is the value to be removed
	    if (thisBSTClass.m_first.value == valueToRemove) {
	        thisBSTClass.m_first = thisBSTClass.m_first.next;
	    }
	    else
		{
		    var node = thisBSTClass.m_first.next;
		    while (node !== null && node.value != valueToRemove) {
		        node = node.next;
		    }

		    // valueToRemove was not found in ll
		    if (node === null) { 
		        return;
		    }

		    node.previous.next = node.next;
		    if (node.next !== null) {   // if not the last node
		        node.next.previous = node.previous;
		    }
		}

	    if (thisBSTClass.m_first !== null) // set the previous of m_first to null
		{
			thisBSTClass.m_first.previous = null;
		}
	};

	this.m_root = removeHelper(this.m_root, valueToRemove);
	removeLL();
}

// Function that has a single, optional parameter for a delimiter string. 
// If null or undefined, this delimiter defaults to a single space.
// Produces a string representation of the tree contents. 
// The contents are in sorted order and separated by the delimiter string. 
// he delimiter is space by default but can be replaced with any arbitrary string. 
// Important: The delimiter is NOT included after the last element.
BST.prototype.toString = function (delimiterString) 
{
	var delimiter = " ";
	if (delimiterString !== undefined && delimiterString !== null) { delimiter = delimiterString; }

	var BSTstr = "";

	if (this.m_root === undefined || this.m_root === null) { return BSTstr; }

	var inOrder = function (node)
	{
		if (node === undefined || node === null) { return; }
		inOrder(node.left);
		BSTstr += node.value + delimiter;
		inOrder(node.right);
	};

	inOrder(this.m_root); 
	return BSTstr.substring(0, BSTstr.lastIndexOf(delimiter));
}