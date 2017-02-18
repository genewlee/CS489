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
	var node = BST.prototype.addNode.call(this, valueToAdd);
	
	if (node == false) {return false; }
	
	node.color = "red";
	this.balance(node);
	
	return true;
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
		var temp = P;		// need to switch P and N since we did rotation
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

Set489.prototype.search = function(value, node)
{
	if (node === undefined) { node = this.m_root; }

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

Set489.prototype.remove = function(valueToRemove, node)
{
	var thisBSTClass = this; // need to do this since removeHelper() doesn't know this
	var found = true;

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

	var node = this.search(valueToRemove, node);
	if (node === undefined) { return false; }

	var max;
	if (node.left !== null && node.right !== null)
	{
		if (node.value == 66) {
			var foo = 0;
		}
		var max = getMaxHelper(node.left);
		node = max;
		this.remove(max.value, node.left);
	}
	if (node.color == "red") //((node.left === null && node.right !== null) || (node.right === null && node.left !== null))
	{
		return BST.prototype.remove.call(this, valueToRemove);
	}
	else if (node.color == "black") // / node is black
	{
		this.prepareForRemove(node);
		return BST.prototype.remove.call(this, valueToRemove);
	}
}

Set489.prototype.prepareForRemove = function (node)
{
	// case 1. node is the new root
	if (node.parent === null) { return; }

	var sibling = this.sibling(node);
	var parent = node.parent;

	// case 2. sibling is red
	if (sibling.color == "red") // implies parent is black
	{
		sibling.color = "black";
		parent.color = "red";
		if (node == parent.left) 
		{
			this.rotateLeft(parent);
			var temp = parent;		// need to switch P and N since we did rotation
			parent = node;
			node = temp;
		}
		else if (node == parent.right)
		{
			this.rotateRight(parent);
			var temp = parent;
			parent = node;
			node = temp;
		}
	}

	// case 3. P, S, and S's children are black. In this case, we simply repaint S red
	if (parent.color == "black" && sibling.color == "black" && 
		((sibling.left === null || sibling.left.color == "black") && (sibling.right === null || sibling.right.color == "black")))
	{
		sibling.color = "red";
		this.prepareForRemove(parent);
	}

	// case 4. S and S's children are black, but P is red. In this case, we simply exchange the colors of S and P
	if (parent.color == "red" && sibling.color == "black" && 
		((sibling.left === null || sibling.left.color == "black") && (sibling.right === null || sibling.right.color == "black")))
	{
		parent.color = "black";
		sibling.color = "red";
		return;
	}

	// case 5. S is black, S's left child is red, S's right child is black, and N is the left child of its parent. 
	// In this case we rotate right at S, so that S's left child becomes S's parent and N's new sibling. 
	// We then exchange the colors of S and its new parent
	if (sibling.color == "black")
	{
		if (node == parent.left && (sibling.right === null || sibling.right.color == "black") 
			&& sibling.left.color == "red")
		{
			sibling.color = "red";
			sibling.left.color = "red";
			this.rotateRight(sibling);
		}
		else if (node == parent.right && (sibling.left === null || sibling.left.color == "black") 
			&& sibling.right.color == "red")
		{
			sibling.color = "black";
			if (sibling.right !== null) { sibling.right.color = "black"; }
			this.rotateLeft(sibling);
		}
	}

	// case 6. S is black, S's right child is red, and N is the left child of its parent P. 
	// In this case we rotate left at P, so that S becomes the parent of P and S's right child. 
	// We then exchange the colors of P and S, and make S's right child black
	sibling.color = parent.color;
	parent.color = "black";

	if (node == parent.left)
	{
		if (sibling.right !== null) { sibling.right.color = "black"; }
		this.rotateLeft(parent);
	}
	else {
		if (sibling.left !== null) { sibling.left.color = "black"; }
		this.rotateRight(parent);
	}
}















