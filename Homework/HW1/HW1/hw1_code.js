// Student name: Gene Lee
// Student ID: 11216720

// Do not modify this constructor function. Even if you are going for that 3rd
// "challenge point", you will only need to modify "add" and "remove".
function SortedLL489(optionalCompare)
{
    this.m_root = null;
    if (optionalCompare === undefined || optionalCompare == null)
    {
        this.m_compare = function(a,b)
        {
            if (a > b) { return 1; }
            return (a == b) ? 0 : -1;
        };
    }
    else
    {
        this.m_compare = optionalCompare;
    }
    Object.seal(this);
}

SortedLL489.prototype.add = function(valueToAdd)
{
    var node = {
        value: valueToAdd,
        next: null,
        previous: null,
    }

    // TODO: Your code here (2 cases: this.m_root is null or non-null)
    if (this.m_root === null) {
        this.m_root = node;
    }
    else {
        // case where new valueToAdd is smaller than m_root.value
        if (this.m_compare(this.m_root.value, node.value) >= 0) {
            node.next = this.m_root;
            this.m_root.previous = node;
            this.m_root = node;
            return;
        }

        // case for rest of ll
        var prev = this.m_root;
        var curr = this.m_root.next;

        while (curr !== null) {
            if (this.m_compare(curr.value, node.value) >= 0) {
                prev.next = node;
                node.previous = prev;
                node.next = curr;
                curr.previous = node;
                return;
            }
            prev = curr;
            curr = curr.next;
        }

        prev.next = node;
        node.previous = prev;
    }
}

// Implement this function so that it removes the specified value from the list
// If the value is not in the list, then the list is not modified
SortedLL489.prototype.remove = function(valueToRemove)
{
    // TODO: Your code here

    // base: ll is empty
    if (this.m_root === null || this.m_root === undefined) {
        return;
    }

    // m_root is the value to be removed
    if (this.m_root.value == valueToRemove) {
        this.m_root = this.m_root.next;
        return;
    }

    var curr = this.m_root.next;
    while (curr !== null && curr.value != valueToRemove) {
        curr = curr.next;
    }

    if (curr === null) { // valueToRemove was not found in ll
        return;
    }

    curr.previous.next = curr.next;
    if (curr.next !== null) {
        curr.next.previous = curr.prev;
    }
}

// This function is implemented for you
// You must not alter it in any way
SortedLL489.prototype.toString = function()
{
    var node = this.m_root;
    var str = "";
    while (node !== undefined && node !== null)
    {
        // Append to string
        str += node.value.toString();
        
        // Check the 'next' member
        if (node.next === undefined)
        {
            str += "(node missing 'next' member)";
            return str;
        }
        else if (node.next !== null)
        {
            str += ",";
        }
        
        // Advance to the next node
        node = node.next;
    }
    return str;
}

