// Student name: Gene Lee
// Student ID: 11216720

// Don't forget to include the .js file for the base class along with
// this one when submitting to Blackboard!

document.writeln("<script type='text/javascript' src='hw2_code.js'></script>");

function Set489(compareFunction)
{
    // your code here
    BST.call(this, compareFunction);
}

Set489.prototype = Object.create(BST.prototype);

Set489.prototype.add = function (valueToAdd) 
{
	if (this.m_root == null)
	{
		this.m_root = { left: null, right: null, value: valueToAdd, previous: null, next: null, parent: null, color: "black" };
		this.m_first = this.m_root;
		return true;
	}

	var thisSet489Class = this; // need to do this since addLL() doesn't know this

	var addLL = function (node) {
		var prev = thisSet489Class.m_first;
        var curr = thisSet489Class.m_first.next;

        while (curr !== null) {
            prev = curr;
            curr = curr.next;
        }

        // at the end
        prev.next = node;
        node.previous = prev;
        thisSet489Class.m_last = node;
	}
	
	var node = this.m_root;
	
	while (true)
	{
		if (this.m_compare(node.value, valueToAdd) > 0)
		{
			if (node.left == null)
			{
				node.left = { left: null, right: null, value: valueToAdd, previous: null, next: null, parent: node, color: "red" };
				addLL(node.left);
				this.balance(node.left);
				return true;
			}
			node = node.left;
		}
		else if (this.m_compare(node.value, valueToAdd) == -1)
		{
			if (node.right == null)
			{
				node.right = { left: null, right: null, value: valueToAdd, previous: null, next: null, parent: node, color: "red" };
				addLL(node.right);
				this.balance(node.right);
				return true;
			}
			node = node.right;
		}
		else { return false; }
	}

	// var parent;
	// var node = this.m_root;
	// while (node && node !== null) {
	// 	parent = node;
	// 	var compare = this.m_compare(valueToAdd, parent.value);
	// 	if (compare === 0) {
	// 	  return false;
	// 	}
	// 	if (compare < 0) {
	// 	  node = parent.left;
	// 	} else {
	// 	  node = parent.right;
	// 	}
	// }
	// if (parent !== null) {
	// 	node = { left: null, right: null, value: valueToAdd, previous: null, next: null, parent: node, color: "red" };
	// 	this.m_root = node;
	// } else {
	// 	node.parent = parent;
	// 	node.value = valueToAdd;
	// }
	// node.color = 'red';
	// this.balance(node);
	// return true;
}

Set489.prototype.grandparent = function (N)
{
	if ((N !== null) && (N.parent !== null)) { return N.parent.parent; }
	return null;
}

Set489.prototype.uncle = function(N)
{
	var G = N.parent.parent;
	if (G === null) { return null; }
	if (N.parent == G.left) { return G.right; }
	else { return G.left; }
}

Set489.prototype.sibling = function (N)
{
	if (N === null || N.parent === null) { return null; }
	if (N == N.parent.left) { return N.parent.right; }
	else { return N.parent.left; }
}

Set489.prototype.balance = function(N)
{
	// case 1. node is root -> paint node black, return true
	if (N == this.m_root) 
	{
		N.color = "black";
		return true;
	}
	// case 2. node parent is black -> return true
	if (N.parent.color == "black") { return true; }

	// Remaining cases need P (parent), U (uncle), G (grandparent)
	var P = N.parent;
	var U = this.uncle(N);
	var G = this.grandparent(N);
	
	// case 3. P and U are red
	if ((U !== null) && (P.color == "red" && U.color == "red"))
	{
		P.color = U.color = "black";
		G.color = "red";
		return this.balance(G);
	}

	// case 4. zig-zag
	if ((N == P.right) && (P == G.left)) 
	{
		this.rotateLeft(P);
		var temp = P;
		P = N;
		N = temp;
	}
	else if ((N == P.left) && (P == G.right))
	{
		this.rotateRight(P);
		var temp = P;
		P = N;
		N = temp;
	}

	// case 5. (N left of P left of G) || (N right of P right of G)
	P.color = "black";
	G.color = "red";

	if (N == P.left && P == G.left)
	{
		this.rotateRight(G);
	}
	else if (N == P.right && P == G.right)
	{
		this.rotateLeft(G);
	}

	return true;
}

Set489.prototype.rotateLeft = function (N)
{
	var right = N.right;
	N.right = right.left;

	if (right.left !== null)
	{
		right.left.parent = N;
	}
	right.parent = N.parent;
	if (N.parent === null)
	{
		this.m_root = right;
	}
	else
	{
		if (N == N.parent.left)
		{
			N.parent.left = right;
		}
		else
		{
			N.parent.right = right;
		}
	}
	right.left = N;
	N.parent = right;
}

Set489.prototype.rotateRight = function (N)
{
	var left = N.left;
	N.left = left.right;

	if (left.right !== null)
	{
		left.right.parent = N;
	}
	left.parent = N.parent;
	if (N.parent === null)
	{
		this.m_root = left;
	}
	else
	{
		if (N == N.parent.left)
		{
			N.parent.left = left;
		}
		else
		{
			N.parent.right = left;
		}
	}
	left.right = N;
	N.parent = left;
}

Set489.prototype.search = function(value)
{
	var node = this.m_root;

	while (true)
	{
		if (node === undefined || node === null) { return undefined; }
		if (node.value == value) { return node; }
		if (this.m_compare(node.value, value) > 0)
		{
			node = node.left;
		}
		else
		{
			node = node.right;
		}
	}
}

Set489.prototype.remove = function(valueToRemove)
{
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

	var thisSet489Class = this; // need to do this since removeHelper() doesn't know this
	var removeHelper = function (node, valueRemove) {
		if (node === undefined || node === null)
		{
			return null;
		}
		if (node.value == valueRemove)
		{
			if ((node.left == undefined || node.left === null) && (node.right == undefined || node.right === null))
			{
				return null;
			}
			if (node.left == undefined || node.left === null)
			{
				node.right.parent = node.parent;
				return node.right;
			}
			if (node.right == undefined || node.right === null)
			{
				node.left.parent = node.parent;
				return node.left;
			}

			// has 2 children
			var maxOfLeftSubtree = getMaxHelper(node.left); // get the max of left subtree
			
			var parent = node.parent;
			var right = node.right;				// remeber the right subtree
			
			maxOfLeftSubtree.left = removeHelper(node.left, maxOfLeftSubtree.value);	// refactor left subtree
			
			node = maxOfLeftSubtree;			// replace the node to remove with the max of left subtree
			node.right = right;					// replace the found max node's right with the original right subtree
			node.parent = parent;
			node.right.parent = node;
			
			return node;
		}
		else if (thisSet489Class.m_compare(node.value, valueRemove) > 0) // less than move to the left)
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

	var node = this.search(valueToRemove);
	if (node === undefined) { return false; }

	if (node.left !== null && node.right !== null)
	{
		this.m_root = removeHelper(node, valueToRemove);
		return true;
	}
	else if (node.color == "red") //((node.left === null && node.right !== null) || (node.right === null && node.left !== null))
	{
		return BST.prototype.remove.call(this, valueToRemove);
	}

	//this.prepareForRemove(node);
	return BST.prototype.remove.call(this, node.value);
	
}

Set489.prototype.prepareForRemove = function (node)
{
	while (node !== this.m_root && node.color === 'black') 
	{
	    var w;
	    if (node === node.parent.left) 
	    {
			w = node.parent.right;
			if (w.color === 'red') 
			{
				w.color = 'black';
				node.parent.color = 'red';
				this.rotateLeft(node.parent);
			}
			if (w.left.color === 'black' && w.right.color === 'black') 
			{
				w.color = 'red';
				node = node.parent;
			} 
			else 
			{
				if (w.right.color === 'black') 
				{
					w.left.color = 'black';
					w.color = 'red';
					this.rotateRight(w);
					w = node.parent.right;
				}
				w.color = node.parent.color;
				node.parent.color = 'black';
				w.right.color = 'black';
				this.rotateLeft(node.parent);
				node = this.m_root;
			}
	    } 
	    else 
	    {
			w = node.parent.left;
			if (w.color === 'red') 
			{
				w.color = 'black';
				node.parent.color = 'red';
				this.rotateRight(node.parent);
			}
			if (w.right.color === 'black' && w.left.color === 'black') 
			{
				w.color = 'red';
				node = node.parent;
			} 
			else 
			{
				if (w.left.color === 'black') 
				{
					w.right.color = 'black';
					w.color = 'red';
					this.rotateLeft(w);
					w = node.parent.left;
				}
				w.color = node.parent.color;
				node.parent.color = 'black';
				w.left.color = 'black';
				this.rotateRight(node.parent);
				node = this.m_root;
			}
	    }
	}
  	node.color = 'black';
}















