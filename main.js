(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.i.Y === region.g.Y)
	{
		return 'on line ' + region.i.Y;
	}
	return 'on lines ' + region.i.Y + ' through ' + region.g.Y;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cC,
		impl.c_,
		impl.cX,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		E: func(record.E),
		aZ: record.aZ,
		aU: record.aU
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.E;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.aZ;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aU) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cC,
		impl.c_,
		impl.cX,
		function(sendToApp, initialModel) {
			var view = impl.c$;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cC,
		impl.c_,
		impl.cX,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.aX && impl.aX(sendToApp)
			var view = impl.c$;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aC);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.b7) && (_VirtualDom_doc.title = title = doc.b7);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.cJ;
	var onUrlRequest = impl.cK;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		aX: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bQ === next.bQ
							&& curr.bv === next.bv
							&& curr.bM.a === next.bM.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		cC: function(flags)
		{
			return A3(impl.cC, flags, _Browser_getUrl(), key);
		},
		c$: impl.c$,
		c_: impl.c_,
		cX: impl.cX
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { cA: 'hidden', cj: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { cA: 'mozHidden', cj: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { cA: 'msHidden', cj: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { cA: 'webkitHidden', cj: 'webkitvisibilitychange' }
		: { cA: 'hidden', cj: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cU: _Browser_getScene(),
		c0: {
			c3: _Browser_window.pageXOffset,
			c4: _Browser_window.pageYOffset,
			ca: _Browser_doc.documentElement.clientWidth,
			bt: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ca: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		bt: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cU: {
				ca: node.scrollWidth,
				bt: node.scrollHeight
			},
			c0: {
				c3: node.scrollLeft,
				c4: node.scrollTop,
				ca: node.clientWidth,
				bt: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cU: _Browser_getScene(),
			c0: {
				c3: x,
				c4: y,
				ca: _Browser_doc.documentElement.clientWidth,
				bt: _Browser_doc.documentElement.clientHeight
			},
			cr: {
				c3: x + rect.left,
				c4: y + rect.top,
				ca: rect.width,
				bt: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.cG) { flags += 'm'; }
	if (options.ci) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.l) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.n),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.n);
		} else {
			var treeLen = builder.l * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.p) : builder.p;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.l);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.n) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.n);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{p: nodeList, l: (len / $elm$core$Array$branchFactor) | 0, n: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {br: fragment, bv: host, cP: path, bM: port_, bQ: protocol, bR: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Type$FormatTxt = 0;
var $author$project$Type$H3 = 2;
var $author$project$Type$Light = 0;
var $author$project$Type$Medium = 1;
var $author$project$Type$NormalSidebar = 0;
var $author$project$Type$ShelfListTab = 0;
var $author$project$Type$ShelfListView = {$: 1};
var $author$project$Type$Standard = 0;
var $author$project$Type$ViewMode = 0;
var $author$project$Type$Wide = 2;
var $author$project$Type$Book = F3(
	function (id, title, pages) {
		return {D: id, R: pages, b7: title};
	});
var $author$project$Type$Page = F3(
	function (id, title, content) {
		return {bi: content, D: id, b7: title};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$JsonConverter$decodePage = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Type$Page,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'title', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$JsonConverter$decodeBook = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Type$Book,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'title', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'pages',
		$elm$json$Json$Decode$list($author$project$JsonConverter$decodePage)));
var $author$project$Type$Shelf = F3(
	function (id, name, books) {
		return {V: books, D: id, cH: name};
	});
var $author$project$JsonConverter$decodeShelf = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Type$Shelf,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'books',
		$elm$json$Json$Decode$list($author$project$JsonConverter$decodeBook)));
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$JsonConverter$decodeAppState = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$map,
			function (books) {
				return {
					W: $elm$core$Maybe$Nothing,
					bj: _List_Nil,
					an: 0,
					ao: 'default-shelf',
					A: _List_fromArray(
						[
							{V: books, D: 'default-shelf', cH: 'Default Shelf'}
						])
				};
			},
			$elm$json$Json$Decode$list($author$project$JsonConverter$decodeBook)),
			A6(
			$elm$json$Json$Decode$map5,
			F5(
				function (shelves, shelfId, bookId, pageIdx, maybeHeadings) {
					return {
						W: bookId,
						bj: A2($elm$core$Maybe$withDefault, _List_Nil, maybeHeadings),
						an: pageIdx,
						ao: shelfId,
						A: shelves
					};
				}),
			A2(
				$elm$json$Json$Decode$field,
				'shelves',
				$elm$json$Json$Decode$list($author$project$JsonConverter$decodeShelf)),
			A2($elm$json$Json$Decode$field, 'currentShelfId', $elm$json$Json$Decode$string),
			A2(
				$elm$json$Json$Decode$field,
				'currentBookId',
				$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
			A2($elm$json$Json$Decode$field, 'currentPageIndex', $elm$json$Json$Decode$int),
			$elm$json$Json$Decode$maybe(
				A2(
					$elm$json$Json$Decode$field,
					'currentHeading',
					$elm$json$Json$Decode$list($elm$json$Json$Decode$string))))
		]));
var $author$project$Type$Model = function (past) {
	return function (present) {
		return function (future) {
			return function (seed) {
				return function (mainViewMode) {
					return function (mode) {
						return function (sidebarTab) {
							return function (sidebarMode) {
								return function (searchText) {
									return function (editing) {
										return function (fontSize) {
											return function (colorTheme) {
												return function (renderStyle) {
													return function (scrollRatio) {
														return function (headingPositions) {
															return function (draggingState) {
																return function (pageCreationBuffer) {
																	return function (pageCreationTitle) {
																		return function (visibleHeadingLevel) {
																			return function (contentWidth) {
																				return function (isSidebarOverlaid) {
																					return function (exportFormat) {
																						return function (openExportMenuId) {
																							return {bh: colorTheme, cm: contentWidth, cq: draggingState, H: editing, cs: exportFormat, cw: fontSize, cy: future, cz: headingPositions, aM: isSidebarOverlaid, J: mainViewMode, bC: mode, ar: openExportMenuId, as: pageCreationBuffer, cO: pageCreationTitle, bK: past, x: present, cR: renderStyle, cV: scrollRatio, bY: searchText, av: seed, ab: sidebarMode, ac: sidebarTab, c1: visibleHeadingLevel};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Type$Normal = 1;
var $author$project$Type$PageView = {$: 0};
var $author$project$Type$TocTab = 2;
var $author$project$JsonConverter$andMap = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $author$project$Type$Dark = 1;
var $author$project$Type$Magical = 2;
var $author$project$JsonConverter$decodeColorTheme = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Dark':
				return $elm$json$Json$Decode$succeed(1);
			case 'Light':
				return $elm$json$Json$Decode$succeed(0);
			default:
				return $elm$json$Json$Decode$succeed(2);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Type$Narrow = 0;
var $author$project$JsonConverter$decodeContentWidth = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Narrow':
				return $elm$json$Json$Decode$succeed(0);
			case 'Wide':
				return $elm$json$Json$Decode$succeed(2);
			default:
				return $elm$json$Json$Decode$succeed(1);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Type$FormatMd = 1;
var $author$project$JsonConverter$stringToExportFormat = function (str) {
	if (str === 'md') {
		return 1;
	} else {
		return 0;
	}
};
var $author$project$JsonConverter$decodeExportFormat = A2($elm$json$Json$Decode$map, $author$project$JsonConverter$stringToExportFormat, $elm$json$Json$Decode$string);
var $author$project$Type$Large = 2;
var $author$project$Type$Small = 0;
var $author$project$JsonConverter$decodeFontSize = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Small':
				return $elm$json$Json$Decode$succeed(0);
			case 'Large':
				return $elm$json$Json$Decode$succeed(2);
			default:
				return $elm$json$Json$Decode$succeed(1);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Type$H1 = 0;
var $author$project$Type$H2 = 1;
var $author$project$JsonConverter$decodeHeadingLevel = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'H1':
				return $elm$json$Json$Decode$succeed(0);
			case 'H2':
				return $elm$json$Json$Decode$succeed(1);
			case 'H3':
				return $elm$json$Json$Decode$succeed(2);
			default:
				return $elm$json$Json$Decode$succeed(0);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Type$Academic = 2;
var $author$project$Type$Minimal = 1;
var $author$project$Type$Mystical = 3;
var $author$project$JsonConverter$decodeRenderStyle = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Minimal':
				return $elm$json$Json$Decode$succeed(1);
			case 'Academic':
				return $elm$json$Json$Decode$succeed(2);
			case 'Mystical':
				return $elm$json$Json$Decode$succeed(3);
			default:
				return $elm$json$Json$Decode$succeed(0);
		}
	},
	$elm$json$Json$Decode$string);
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $author$project$JsonConverter$decodeModel = A2(
	$author$project$JsonConverter$andMap,
	$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
	A2(
		$author$project$JsonConverter$andMap,
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2($elm$json$Json$Decode$field, 'exportFormat', $author$project$JsonConverter$decodeExportFormat),
					$elm$json$Json$Decode$succeed(0)
				])),
		A2(
			$author$project$JsonConverter$andMap,
			$elm$json$Json$Decode$succeed(false),
			A2(
				$author$project$JsonConverter$andMap,
				$elm$json$Json$Decode$oneOf(
					_List_fromArray(
						[
							A2($elm$json$Json$Decode$field, 'contentWidth', $author$project$JsonConverter$decodeContentWidth),
							$elm$json$Json$Decode$succeed(1)
						])),
				A2(
					$author$project$JsonConverter$andMap,
					$elm$json$Json$Decode$oneOf(
						_List_fromArray(
							[
								A2($elm$json$Json$Decode$field, 'visibleHeadingLevel', $author$project$JsonConverter$decodeHeadingLevel),
								$elm$json$Json$Decode$succeed(2)
							])),
					A2(
						$author$project$JsonConverter$andMap,
						$elm$json$Json$Decode$succeed(''),
						A2(
							$author$project$JsonConverter$andMap,
							$elm$json$Json$Decode$succeed(_List_Nil),
							A2(
								$author$project$JsonConverter$andMap,
								$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
								A2(
									$author$project$JsonConverter$andMap,
									$elm$json$Json$Decode$succeed(_List_Nil),
									A2(
										$author$project$JsonConverter$andMap,
										$elm$json$Json$Decode$succeed(0),
										A2(
											$author$project$JsonConverter$andMap,
											A2($elm$json$Json$Decode$field, 'renderStyle', $author$project$JsonConverter$decodeRenderStyle),
											A2(
												$author$project$JsonConverter$andMap,
												A2($elm$json$Json$Decode$field, 'colorTheme', $author$project$JsonConverter$decodeColorTheme),
												A2(
													$author$project$JsonConverter$andMap,
													A2($elm$json$Json$Decode$field, 'fontSize', $author$project$JsonConverter$decodeFontSize),
													A2(
														$author$project$JsonConverter$andMap,
														$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing),
														A2(
															$author$project$JsonConverter$andMap,
															$elm$json$Json$Decode$succeed(''),
															A2(
																$author$project$JsonConverter$andMap,
																$elm$json$Json$Decode$succeed(0),
																A2(
																	$author$project$JsonConverter$andMap,
																	$elm$json$Json$Decode$succeed(2),
																	A2(
																		$author$project$JsonConverter$andMap,
																		$elm$json$Json$Decode$succeed(0),
																		A2(
																			$author$project$JsonConverter$andMap,
																			$elm$json$Json$Decode$succeed($author$project$Type$PageView),
																			A2(
																				$author$project$JsonConverter$andMap,
																				$elm$json$Json$Decode$succeed(
																					$elm$random$Random$initialSeed(0)),
																				A2(
																					$author$project$JsonConverter$andMap,
																					$elm$json$Json$Decode$succeed(_List_Nil),
																					A2(
																						$author$project$JsonConverter$andMap,
																						A2($elm$json$Json$Decode$field, 'present', $author$project$JsonConverter$decodeAppState),
																						A2(
																							$author$project$JsonConverter$andMap,
																							$elm$json$Json$Decode$succeed(_List_Nil),
																							$elm$json$Json$Decode$succeed($author$project$Type$Model))))))))))))))))))))))));
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$init = function (flags) {
	var initialSeed = $elm$random$Random$initialSeed(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$head(flags.av)));
	var defaultAppState = {
		W: $elm$core$Maybe$Nothing,
		bj: _List_Nil,
		an: 0,
		ao: 'default-shelf',
		A: _List_fromArray(
			[
				{V: _List_Nil, D: 'default-shelf', cH: 'New Shelf'}
			])
	};
	var initialModel = function () {
		var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$JsonConverter$decodeModel, flags.aw);
		if (!_v0.$) {
			var model = _v0.a;
			return model;
		} else {
			var appState = A2(
				$elm$core$Maybe$withDefault,
				A2(
					$elm$core$Result$withDefault,
					defaultAppState,
					A2($elm$json$Json$Decode$decodeValue, $author$project$JsonConverter$decodeAppState, flags.aw)),
				$elm$core$Result$toMaybe(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'present', $author$project$JsonConverter$decodeAppState),
						flags.aw)));
			return {
				bh: 0,
				cm: 2,
				cq: $elm$core$Maybe$Nothing,
				H: $elm$core$Maybe$Nothing,
				cs: 0,
				cw: 1,
				cy: _List_Nil,
				cz: _List_Nil,
				aM: false,
				J: $author$project$Type$ShelfListView,
				bC: 0,
				ar: $elm$core$Maybe$Nothing,
				as: _List_Nil,
				cO: '',
				bK: _List_Nil,
				x: appState,
				cR: 0,
				cV: 0,
				bY: '',
				av: $elm$random$Random$initialSeed(0),
				ab: 0,
				ac: 0,
				c1: 2
			};
		}
	}();
	return _Utils_Tuple2(
		_Utils_update(
			initialModel,
			{av: initialSeed}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Type$FileDropped = function (a) {
	return {$: 34, a: a};
};
var $author$project$Type$ImportData = function (a) {
	return {$: 30, a: a};
};
var $author$project$Type$PageFileSelected = function (a) {
	return {$: 27, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Type$ImportBook = F2(
	function (a, b) {
		return {$: 28, a: a, b: b};
	});
var $author$project$Type$ImportShelf = F2(
	function (a, b) {
		return {$: 29, a: a, b: b};
	});
var $author$project$Type$NoOp = {$: 56};
var $author$project$Type$ReorderPages = F2(
	function (a, b) {
		return {$: 24, a: a, b: b};
	});
var $author$project$Type$UpdateContent = function (a) {
	return {$: 18, a: a};
};
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Domain$Helper$decodeIncomingMsg = function (value) {
	var tagDecoder = A2($elm$json$Json$Decode$field, 'tag', $elm$json$Json$Decode$string);
	var _v0 = A2($elm$json$Json$Decode$decodeValue, tagDecoder, value);
	_v0$5:
	while (true) {
		if (!_v0.$) {
			switch (_v0.a) {
				case 'ReorderPages':
					var reorderDecoder = A3(
						$elm$json$Json$Decode$map2,
						$author$project$Type$ReorderPages,
						A2($elm$json$Json$Decode$field, 'from', $elm$json$Json$Decode$int),
						A2($elm$json$Json$Decode$field, 'to', $elm$json$Json$Decode$int));
					var _v1 = A2($elm$json$Json$Decode$decodeValue, reorderDecoder, value);
					if (!_v1.$) {
						var msg = _v1.a;
						return msg;
					} else {
						return $author$project$Type$NoOp;
					}
				case 'EDITOR_CHANGED':
					var _v2 = A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'payload', $elm$json$Json$Decode$string),
						value);
					if (!_v2.$) {
						var content = _v2.a;
						return $author$project$Type$UpdateContent(content);
					} else {
						return $author$project$Type$NoOp;
					}
				case 'SCROLL_CHANGED':
					var _v3 = A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'payload', $elm$json$Json$Decode$float),
						value);
					if (!_v3.$) {
						return $author$project$Type$NoOp;
					} else {
						return $author$project$Type$NoOp;
					}
				case 'ImportBook':
					var _v4 = _Utils_Tuple2(
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
							value),
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'payload', $author$project$JsonConverter$decodeBook),
							value));
					if ((!_v4.a.$) && (!_v4.b.$)) {
						var id = _v4.a.a;
						var book = _v4.b.a;
						return A2($author$project$Type$ImportBook, id, book);
					} else {
						return $author$project$Type$NoOp;
					}
				case 'ImportShelf':
					var _v5 = _Utils_Tuple2(
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
							value),
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'payload', $author$project$JsonConverter$decodeShelf),
							value));
					if ((!_v5.a.$) && (!_v5.b.$)) {
						var id = _v5.a.a;
						var shelf = _v5.b.a;
						return A2($author$project$Type$ImportShelf, id, shelf);
					} else {
						return $author$project$Type$NoOp;
					}
				default:
					break _v0$5;
			}
		} else {
			break _v0$5;
		}
	}
	return $author$project$Type$NoOp;
};
var $author$project$Ports$fileContentReceiver = _Platform_incomingPort('fileContentReceiver', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Ports$fileDropped = _Platform_incomingPort('fileDropped', $elm$json$Json$Decode$value);
var $author$project$Ports$incomingMsg = _Platform_incomingPort('incomingMsg', $elm$json$Json$Decode$value);
var $author$project$Type$NextPage = {$: 13};
var $author$project$Type$PrevPage = {$: 14};
var $author$project$Type$Redo = {$: 1};
var $author$project$Type$Undo = {$: 0};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Domain$Helper$keyDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (key, ctrl) {
			var _v0 = _Utils_Tuple2(key, ctrl);
			_v0$4:
			while (true) {
				switch (_v0.a) {
					case 'z':
						if (_v0.b) {
							return $author$project$Type$Undo;
						} else {
							break _v0$4;
						}
					case 'y':
						if (_v0.b) {
							return $author$project$Type$Redo;
						} else {
							break _v0$4;
						}
					case 'ArrowRight':
						return $author$project$Type$NextPage;
					case 'ArrowLeft':
						return $author$project$Type$PrevPage;
					default:
						break _v0$4;
				}
			}
			return $author$project$Type$NoOp;
		}),
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool));
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {bL: pids, b5: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {bn: event, bA: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.bL,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.bA;
		var event = _v0.bn;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.b5);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$Ports$pageFileSelected = _Platform_incomingPort('pageFileSelected', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$Domain$Helper$keyDecoder),
				$author$project$Ports$fileDropped($author$project$Type$FileDropped),
				$author$project$Ports$incomingMsg($author$project$Domain$Helper$decodeIncomingMsg),
				$author$project$Ports$fileContentReceiver($author$project$Type$ImportData),
				$author$project$Ports$pageFileSelected($author$project$Type$PageFileSelected)
			]));
};
var $author$project$Type$BookTitle = 1;
var $author$project$Type$EditMode = 1;
var $author$project$Type$LeftSidebar = 2;
var $author$project$Type$OverlaySidebar = 1;
var $author$project$Type$ShelfTitle = 0;
var $author$project$Domain$Helper$updateCurrentShelf = F2(
	function (transform, state) {
		var newShelves = A2(
			$elm$core$List$map,
			function (shelf) {
				return _Utils_eq(shelf.D, state.ao) ? transform(shelf) : shelf;
			},
			state.A);
		return _Utils_update(
			state,
			{A: newShelves});
	});
var $author$project$Domain$Helper$addBookToCurrentShelf = F2(
	function (newId, state) {
		var newBook = {D: newId, R: _List_Nil, b7: 'New Book'};
		return A2(
			$author$project$Domain$Helper$updateCurrentShelf,
			function (shelf) {
				return _Utils_update(
					shelf,
					{
						V: _Utils_ap(
							shelf.V,
							_List_fromArray(
								[newBook]))
					});
			},
			state);
	});
var $author$project$Domain$Helper$appendBook = F2(
	function (newId, state) {
		return function (s) {
			return _Utils_update(
				s,
				{
					W: $elm$core$Maybe$Just(newId)
				});
		}(
			A2($author$project$Domain$Helper$addBookToCurrentShelf, newId, state));
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$String$lines = _String_lines;
var $elm$core$String$trim = _String_trim;
var $author$project$Domain$Helper$extractTitleFromContent = F2(
	function (index, content) {
		var firstLine = A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(
				$elm$core$String$lines(content)));
		return A2($elm$core$String$startsWith, '# ', firstLine) ? $elm$core$String$trim(
			A2($elm$core$String$dropLeft, 2, firstLine)) : ('Page ' + $elm$core$String$fromInt(index + 1));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Domain$AddItem$addPageToCurrentBook = F4(
	function (newId, insertIndex, content, state) {
		var contents = (content === '') ? '# NewPage' : content;
		var insertPage = function (pages) {
			var index = A3(
				$elm$core$Basics$clamp,
				0,
				$elm$core$List$length(pages),
				insertIndex);
			var targetPage = {
				bi: contents,
				D: newId,
				b7: A2($author$project$Domain$Helper$extractTitleFromContent, index, content)
			};
			return _Utils_ap(
				A2($elm$core$List$take, index, pages),
				_Utils_ap(
					_List_fromArray(
						[targetPage]),
					A2($elm$core$List$drop, index, pages)));
		};
		var updateBooks = function (books) {
			return A2(
				$elm$core$List$map,
				function (book) {
					return _Utils_eq(
						$elm$core$Maybe$Just(book.D),
						state.W) ? _Utils_update(
						book,
						{
							R: insertPage(book.R)
						}) : book;
				},
				books);
		};
		var updateShelves = function (shelves) {
			return A2(
				$elm$core$List$map,
				function (shelf) {
					return _Utils_eq(shelf.D, state.ao) ? _Utils_update(
						shelf,
						{
							V: updateBooks(shelf.V)
						}) : shelf;
				},
				shelves);
		};
		return _Utils_update(
			state,
			{
				A: updateShelves(state.A)
			});
	});
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $danyx23$elm_uuid$Uuid$Barebones$hexGenerator = A2($elm$random$Random$int, 0, 15);
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Bitwise$or = _Bitwise_or;
var $danyx23$elm_uuid$Uuid$Barebones$limitDigitRange8ToB = function (digit) {
	return (digit & 3) | 8;
};
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{p: nodeList, l: nodeListSize, n: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $danyx23$elm_uuid$Uuid$Barebones$hexDigits = function () {
	var mapChars = F2(
		function (offset, digit) {
			return $elm$core$Char$fromCode(digit + offset);
		});
	return $elm$core$Array$fromList(
		_Utils_ap(
			A2(
				$elm$core$List$map,
				mapChars(48),
				A2($elm$core$List$range, 0, 9)),
			A2(
				$elm$core$List$map,
				mapChars(97),
				A2($elm$core$List$range, 0, 5))));
}();
var $danyx23$elm_uuid$Uuid$Barebones$mapToHex = function (index) {
	var maybeResult = A2($elm$core$Array$get, index, $danyx23$elm_uuid$Uuid$Barebones$hexDigits);
	if (maybeResult.$ === 1) {
		return 'x';
	} else {
		var result = maybeResult.a;
		return result;
	}
};
var $danyx23$elm_uuid$Uuid$Barebones$toUuidString = function (thirtyOneHexDigits) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$elm$core$String$fromList(
				A2(
					$elm$core$List$map,
					$danyx23$elm_uuid$Uuid$Barebones$mapToHex,
					A2($elm$core$List$take, 8, thirtyOneHexDigits))),
				'-',
				$elm$core$String$fromList(
				A2(
					$elm$core$List$map,
					$danyx23$elm_uuid$Uuid$Barebones$mapToHex,
					A2(
						$elm$core$List$take,
						4,
						A2($elm$core$List$drop, 8, thirtyOneHexDigits)))),
				'-',
				'4',
				$elm$core$String$fromList(
				A2(
					$elm$core$List$map,
					$danyx23$elm_uuid$Uuid$Barebones$mapToHex,
					A2(
						$elm$core$List$take,
						3,
						A2($elm$core$List$drop, 12, thirtyOneHexDigits)))),
				'-',
				$elm$core$String$fromList(
				A2(
					$elm$core$List$map,
					$danyx23$elm_uuid$Uuid$Barebones$mapToHex,
					A2(
						$elm$core$List$map,
						$danyx23$elm_uuid$Uuid$Barebones$limitDigitRange8ToB,
						A2(
							$elm$core$List$take,
							1,
							A2($elm$core$List$drop, 15, thirtyOneHexDigits))))),
				$elm$core$String$fromList(
				A2(
					$elm$core$List$map,
					$danyx23$elm_uuid$Uuid$Barebones$mapToHex,
					A2(
						$elm$core$List$take,
						3,
						A2($elm$core$List$drop, 16, thirtyOneHexDigits)))),
				'-',
				$elm$core$String$fromList(
				A2(
					$elm$core$List$map,
					$danyx23$elm_uuid$Uuid$Barebones$mapToHex,
					A2(
						$elm$core$List$take,
						12,
						A2($elm$core$List$drop, 19, thirtyOneHexDigits))))
			]));
};
var $danyx23$elm_uuid$Uuid$Barebones$uuidStringGenerator = A2(
	$elm$random$Random$map,
	$danyx23$elm_uuid$Uuid$Barebones$toUuidString,
	A2($elm$random$Random$list, 31, $danyx23$elm_uuid$Uuid$Barebones$hexGenerator));
var $author$project$Domain$AddItem$buildPage = F2(
	function (insertIndex, model) {
		var content = A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(model.as));
		var _v0 = A2($elm$random$Random$step, $danyx23$elm_uuid$Uuid$Barebones$uuidStringGenerator, model.av);
		var newId = _v0.a;
		var nextSeed = _v0.b;
		var stepped = _Utils_update(
			model,
			{
				as: A2($elm$core$List$drop, 1, model.as),
				av: nextSeed
			});
		return _Utils_update(
			stepped,
			{
				x: A4($author$project$Domain$AddItem$addPageToCurrentBook, newId, insertIndex, content, stepped.x)
			});
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$JsonConverter$encodeMaybe = F2(
	function (encoder, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return encoder(value);
		} else {
			return $elm$json$Json$Encode$null;
		}
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$JsonConverter$encodePage = function (page) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(page.D)),
				_Utils_Tuple2(
				'title',
				$elm$json$Json$Encode$string(page.b7)),
				_Utils_Tuple2(
				'content',
				$elm$json$Json$Encode$string(page.bi))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$JsonConverter$encodeBook = function (book) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(book.D)),
				_Utils_Tuple2(
				'title',
				$elm$json$Json$Encode$string(book.b7)),
				_Utils_Tuple2(
				'pages',
				A2($elm$json$Json$Encode$list, $author$project$JsonConverter$encodePage, book.R))
			]));
};
var $author$project$JsonConverter$encodeShelf = function (shelf) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(shelf.D)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(shelf.cH)),
				_Utils_Tuple2(
				'books',
				A2($elm$json$Json$Encode$list, $author$project$JsonConverter$encodeBook, shelf.V))
			]));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$JsonConverter$encodeAppState = function (state) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'shelves',
				A2($elm$json$Json$Encode$list, $author$project$JsonConverter$encodeShelf, state.A)),
				_Utils_Tuple2(
				'currentShelfId',
				$elm$json$Json$Encode$string(state.ao)),
				_Utils_Tuple2(
				'currentBookId',
				A2($author$project$JsonConverter$encodeMaybe, $elm$json$Json$Encode$string, state.W)),
				_Utils_Tuple2(
				'currentPageIndex',
				$elm$json$Json$Encode$int(state.an)),
				_Utils_Tuple2(
				'currentHeading',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, state.bj))
			]));
};
var $author$project$JsonConverter$encodeColorTheme = function (theme) {
	switch (theme) {
		case 0:
			return $elm$json$Json$Encode$string('Light');
		case 1:
			return $elm$json$Json$Encode$string('Dark');
		default:
			return $elm$json$Json$Encode$string('Magical');
	}
};
var $author$project$JsonConverter$encodeContentWidth = function (width) {
	switch (width) {
		case 0:
			return $elm$json$Json$Encode$string('Narrow');
		case 1:
			return $elm$json$Json$Encode$string('Normal');
		default:
			return $elm$json$Json$Encode$string('Wide');
	}
};
var $author$project$JsonConverter$encodeExportFormat = function (format) {
	if (!format) {
		return $elm$json$Json$Encode$string('txt');
	} else {
		return $elm$json$Json$Encode$string('md');
	}
};
var $author$project$JsonConverter$encodeFontSize = function (size) {
	switch (size) {
		case 0:
			return $elm$json$Json$Encode$string('Small');
		case 1:
			return $elm$json$Json$Encode$string('Medium');
		default:
			return $elm$json$Json$Encode$string('Large');
	}
};
var $author$project$JsonConverter$encodeHeadingLevel = function (level) {
	switch (level) {
		case 0:
			return $elm$json$Json$Encode$string('H1');
		case 1:
			return $elm$json$Json$Encode$string('H2');
		default:
			return $elm$json$Json$Encode$string('H3');
	}
};
var $author$project$JsonConverter$encodeRenderStyle = function (style) {
	switch (style) {
		case 0:
			return $elm$json$Json$Encode$string('Standard');
		case 1:
			return $elm$json$Json$Encode$string('Minimal');
		case 2:
			return $elm$json$Json$Encode$string('Academic');
		default:
			return $elm$json$Json$Encode$string('Mystical');
	}
};
var $author$project$JsonConverter$encodeModel = function (model) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'present',
					$author$project$JsonConverter$encodeAppState(model.x)),
					_Utils_Tuple2(
					'fontSize',
					$author$project$JsonConverter$encodeFontSize(model.cw)),
					_Utils_Tuple2(
					'colorTheme',
					$author$project$JsonConverter$encodeColorTheme(model.bh)),
					_Utils_Tuple2(
					'renderStyle',
					$author$project$JsonConverter$encodeRenderStyle(model.cR)),
					_Utils_Tuple2(
					'visibleHeadingLevel',
					$author$project$JsonConverter$encodeHeadingLevel(model.c1)),
					_Utils_Tuple2(
					'contentWidth',
					$author$project$JsonConverter$encodeContentWidth(model.cm)),
					_Utils_Tuple2(
					'exportFormat',
					$author$project$JsonConverter$encodeExportFormat(model.cs))
				])));
};
var $author$project$Ports$saveToStorage = _Platform_outgoingPort('saveToStorage', $elm$json$Json$Encode$string);
var $author$project$Domain$Helper$notifyAndSave = function (newModel) {
	return _Utils_Tuple2(
		newModel,
		$author$project$Ports$saveToStorage(
			$author$project$JsonConverter$encodeModel(newModel)));
};
var $author$project$Domain$AddItem$recordHistory = function (model) {
	return _Utils_update(
		model,
		{
			cy: _List_Nil,
			bK: A2(
				$elm$core$List$take,
				100,
				A2($elm$core$List$cons, model.x, model.bK))
		});
};
var $author$project$Domain$AddItem$appendBookAndSave = F2(
	function (newId, model) {
		return $author$project$Domain$Helper$notifyAndSave(
			A2(
				$author$project$Domain$AddItem$buildPage,
				0,
				function (m) {
					return _Utils_update(
						m,
						{
							bC: 1,
							x: A2($author$project$Domain$Helper$appendBook, newId, m.x)
						});
				}(
					$author$project$Domain$AddItem$recordHistory(model))));
	});
var $author$project$Domain$AddItem$appendBookData = F2(
	function (newBook, state) {
		var updateShelves = A2(
			$elm$core$List$map,
			function (shelf) {
				return _Utils_eq(shelf.D, state.ao) ? _Utils_update(
					shelf,
					{
						V: _Utils_ap(
							shelf.V,
							_List_fromArray(
								[newBook]))
					}) : shelf;
			},
			state.A);
		return _Utils_update(
			state,
			{
				W: $elm$core$Maybe$Just(newBook.D),
				an: 0,
				A: updateShelves
			});
	});
var $author$project$Domain$AddItem$registerShelf = function (model) {
	var present = model.x;
	var _v0 = A2($elm$random$Random$step, $danyx23$elm_uuid$Uuid$Barebones$uuidStringGenerator, model.av);
	var shelfId = _v0.a;
	var seed1 = _v0.b;
	var _v1 = A2($elm$random$Random$step, $danyx23$elm_uuid$Uuid$Barebones$uuidStringGenerator, seed1);
	var bookId = _v1.a;
	var seed2 = _v1.b;
	var newShelf = {V: _List_Nil, D: shelfId, cH: 'New Shelf'};
	var newPresent = _Utils_update(
		present,
		{
			A: _Utils_ap(
				present.A,
				_List_fromArray(
					[newShelf]))
		});
	var newModel = _Utils_update(
		model,
		{x: newPresent, av: seed2});
	var finalPresent = function (state) {
		return _Utils_update(
			state,
			{
				W: $elm$core$Maybe$Just(bookId)
			});
	}(
		A2(
			$author$project$Domain$Helper$addBookToCurrentShelf,
			bookId,
			function (state) {
				return _Utils_update(
					state,
					{ao: shelfId});
			}(newModel.x)));
	return _Utils_update(
		newModel,
		{x: finalPresent});
};
var $author$project$Domain$AddItem$appendShelfAndSave = function (model) {
	return $author$project$Domain$Helper$notifyAndSave(
		A2(
			$author$project$Domain$AddItem$buildPage,
			0,
			$author$project$Domain$AddItem$registerShelf(
				$author$project$Domain$AddItem$recordHistory(model))));
};
var $author$project$Domain$AddItem$appendShelfData = F2(
	function (newShelf, state) {
		return _Utils_update(
			state,
			{
				W: $elm$core$Maybe$Nothing,
				an: 0,
				ao: newShelf.D,
				A: _Utils_ap(
					state.A,
					_List_fromArray(
						[newShelf]))
			});
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Domain$Helper$extractHeadings = F2(
	function (pageIdx, content) {
		var parseLines = F3(
			function (lines, inCodeBlock, acc) {
				parseLines:
				while (true) {
					if (!lines.b) {
						return $elm$core$List$reverse(acc);
					} else {
						var line = lines.a;
						var rest = lines.b;
						var trimmed = $elm$core$String$trim(line);
						if (A2($elm$core$String$startsWith, '```', trimmed)) {
							var $temp$lines = rest,
								$temp$inCodeBlock = !inCodeBlock,
								$temp$acc = acc;
							lines = $temp$lines;
							inCodeBlock = $temp$inCodeBlock;
							acc = $temp$acc;
							continue parseLines;
						} else {
							if (inCodeBlock) {
								var $temp$lines = rest,
									$temp$inCodeBlock = true,
									$temp$acc = acc;
								lines = $temp$lines;
								inCodeBlock = $temp$inCodeBlock;
								acc = $temp$acc;
								continue parseLines;
							} else {
								var maybeHeading = A2($elm$core$String$startsWith, '### ', line) ? $elm$core$Maybe$Just(
									{
										X: 3,
										_: pageIdx,
										M: $elm$core$String$trim(
											A2($elm$core$String$dropLeft, 4, line))
									}) : (A2($elm$core$String$startsWith, '## ', line) ? $elm$core$Maybe$Just(
									{
										X: 2,
										_: pageIdx,
										M: $elm$core$String$trim(
											A2($elm$core$String$dropLeft, 3, line))
									}) : (A2($elm$core$String$startsWith, '# ', line) ? $elm$core$Maybe$Just(
									{
										X: 1,
										_: pageIdx,
										M: $elm$core$String$trim(
											A2($elm$core$String$dropLeft, 2, line))
									}) : $elm$core$Maybe$Nothing));
								if (!maybeHeading.$) {
									var h = maybeHeading.a;
									var $temp$lines = rest,
										$temp$inCodeBlock = false,
										$temp$acc = A2($elm$core$List$cons, h, acc);
									lines = $temp$lines;
									inCodeBlock = $temp$inCodeBlock;
									acc = $temp$acc;
									continue parseLines;
								} else {
									var $temp$lines = rest,
										$temp$inCodeBlock = false,
										$temp$acc = acc;
									lines = $temp$lines;
									inCodeBlock = $temp$inCodeBlock;
									acc = $temp$acc;
									continue parseLines;
								}
							}
						}
					}
				}
			});
		var raw = A3(
			parseLines,
			$elm$core$String$lines(content),
			false,
			_List_Nil);
		return $elm$core$List$isEmpty(raw) ? _List_fromArray(
			[
				{
				X: 1,
				_: pageIdx,
				M: 'Page ' + $elm$core$String$fromInt(pageIdx + 1)
			}
			]) : raw;
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Domain$Helper$findBookById = F2(
	function (targetId, shelves) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (b) {
					return _Utils_eq(b.D, targetId);
				},
				A2(
					$elm$core$List$concatMap,
					function ($) {
						return $.V;
					},
					shelves)));
	});
var $author$project$Domain$Helper$getCurrentBook = function (state) {
	return A2(
		$elm$core$Maybe$andThen,
		function (id) {
			return A2($author$project$Domain$Helper$findBookById, id, state.A);
		},
		state.W);
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Domain$Helper$applyPageChange = F2(
	function (index, present) {
		var cleared = _Utils_update(
			present,
			{bj: _List_Nil});
		var maybeBook = $author$project$Domain$Helper$getCurrentBook(cleared);
		var pageContent = function () {
			if (!maybeBook.$) {
				var book = maybeBook.a;
				return A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.bi;
						},
						$elm$core$List$head(
							A2($elm$core$List$drop, index, book.R))));
			} else {
				return '';
			}
		}();
		var newHeadings = A2($author$project$Domain$Helper$extractHeadings, index, pageContent);
		return _Utils_update(
			present,
			{
				bj: A2(
					$elm$core$List$map,
					function ($) {
						return $.M;
					},
					newHeadings),
				an: index
			});
	});
var $author$project$Main$applyBookSelection = F2(
	function (bookId, model) {
		var present = model.x;
		var basePresent = _Utils_update(
			present,
			{
				W: $elm$core$Maybe$Just(bookId),
				an: 0
			});
		var newPresent = A2($author$project$Domain$Helper$applyPageChange, 0, basePresent);
		return _Utils_update(
			model,
			{J: $author$project$Type$PageView, bC: 0, x: newPresent, cV: 0, ac: 2});
	});
var $author$project$Domain$Selector$applyColorTheme = F2(
	function (themeStr, model) {
		var newTheme = function () {
			switch (themeStr) {
				case 'Light':
					return 0;
				case 'Dark':
					return 1;
				case 'Magical':
					return 2;
				default:
					return model.bh;
			}
		}();
		return _Utils_update(
			model,
			{bh: newTheme});
	});
var $author$project$Domain$Helper$updateAppState = F2(
	function (newPresent, model) {
		return _Utils_update(
			model,
			{
				cy: _List_Nil,
				bK: A2(
					$elm$core$List$take,
					100,
					A2($elm$core$List$cons, model.x, model.bK)),
				x: newPresent
			});
	});
var $author$project$Main$updateBookTitle = F3(
	function (bookId, newTitle, state) {
		var updateBookInList = function (book) {
			return _Utils_eq(book.D, bookId) ? _Utils_update(
				book,
				{b7: newTitle}) : book;
		};
		var updateShelf = function (shelf) {
			return _Utils_update(
				shelf,
				{
					V: A2($elm$core$List$map, updateBookInList, shelf.V)
				});
		};
		return _Utils_update(
			state,
			{
				A: A2($elm$core$List$map, updateShelf, state.A)
			});
	});
var $author$project$Main$updateShelfTitle = F3(
	function (shelfId, newTitle, state) {
		var updateFn = function (shelf) {
			return _Utils_eq(shelf.D, shelfId) ? _Utils_update(
				shelf,
				{cH: newTitle}) : shelf;
		};
		return _Utils_update(
			state,
			{
				A: A2($elm$core$List$map, updateFn, state.A)
			});
	});
var $author$project$Main$applyEdit = F2(
	function (buffer, model) {
		var updatedState = function () {
			var _v1 = buffer.ae;
			if (!_v1) {
				return A3($author$project$Main$updateShelfTitle, buffer.D, buffer.N, model.x);
			} else {
				return A3($author$project$Main$updateBookTitle, buffer.D, buffer.N, model.x);
			}
		}();
		var _v0 = $author$project$Domain$Helper$notifyAndSave(
			function (m) {
				return _Utils_update(
					m,
					{H: $elm$core$Maybe$Nothing});
			}(
				function (state) {
					return A2($author$project$Domain$Helper$updateAppState, state, model);
				}(updatedState)));
		var finalModel = _v0.a;
		var saveCmd = _v0.b;
		return _Utils_Tuple2(finalModel, saveCmd);
	});
var $author$project$Ports$exportFile = _Platform_outgoingPort(
	'exportFile',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'content',
					$elm$json$Json$Encode$string($.bi)),
					_Utils_Tuple2(
					'fileName',
					$elm$json$Json$Encode$string($.cu))
				]));
	});
var $author$project$Domain$Helper$getCurrentPage = function (state) {
	return A2(
		$elm$core$Maybe$andThen,
		function (book) {
			return $elm$core$List$head(
				A2($elm$core$List$drop, state.an, book.R));
		},
		$author$project$Domain$Helper$getCurrentBook(state));
};
var $author$project$Main$applyExportPage = F2(
	function (extension, state) {
		var _v0 = $author$project$Domain$Helper$getCurrentPage(state);
		if (!_v0.$) {
			var page = _v0.a;
			var fileName = page.b7 + ('.' + extension);
			return $author$project$Ports$exportFile(
				{bi: page.bi, cu: fileName});
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Domain$Selector$applyFontSize = F2(
	function (sizeStr, model) {
		var newSize = function () {
			switch (sizeStr) {
				case 'Small':
					return 0;
				case 'Large':
					return 2;
				default:
					return 1;
			}
		}();
		return _Utils_update(
			model,
			{cw: newSize});
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Ports$syncScroll = _Platform_outgoingPort(
	'syncScroll',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'ratio',
					$elm$json$Json$Encode$float($.aV)),
					_Utils_Tuple2(
					'targetId',
					$elm$json$Json$Encode$string($.a5))
				]));
	});
var $author$project$Main$applyModeChange = F2(
	function (newMode, model) {
		var syncCmd = function () {
			switch (newMode) {
				case 1:
					return $author$project$Ports$syncScroll(
						{aV: model.cV, a5: 'editor-area'});
				case 0:
					return $author$project$Ports$syncScroll(
						{aV: model.cV, a5: 'page-view-area'});
				default:
					return $elm$core$Platform$Cmd$none;
			}
		}();
		var newModel = _Utils_update(
			model,
			{bC: newMode});
		return _Utils_Tuple2(newModel, syncCmd);
	});
var $author$project$Domain$Helper$applyPageSelection = F2(
	function (index, model) {
		var newPresent = A2($author$project$Domain$Helper$applyPageChange, index, model.x);
		return _Utils_update(
			model,
			{x: newPresent, cV: 0});
	});
var $author$project$Domain$Helper$notifyAndSaveWithCmd = F2(
	function (additionalCmd, newModel) {
		return _Utils_Tuple2(
			newModel,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Ports$saveToStorage(
						$author$project$JsonConverter$encodeModel(newModel)),
						additionalCmd
					])));
	});
var $author$project$Ports$scrollToTop = _Platform_outgoingPort(
	'scrollToTop',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$applyNextPage = function (model) {
	var present = model.x;
	var _v0 = $author$project$Domain$Helper$getCurrentBook(present);
	if (!_v0.$) {
		var book = _v0.a;
		if (_Utils_cmp(
			present.an,
			$elm$core$List$length(book.R) - 1) < 0) {
			var nextIndex = present.an + 1;
			return A2(
				$author$project$Domain$Helper$notifyAndSaveWithCmd,
				$author$project$Ports$scrollToTop(0),
				A2($author$project$Domain$Helper$applyPageSelection, nextIndex, model));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Main$applyPrevPage = function (model) {
	var present = model.x;
	if (present.an > 0) {
		var prevIndex = present.an - 1;
		return A2(
			$author$project$Domain$Helper$notifyAndSaveWithCmd,
			$author$project$Ports$scrollToTop(0),
			A2($author$project$Domain$Helper$applyPageSelection, prevIndex, model));
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Main$applyRedo = function (model) {
	var _v0 = model.cy;
	if (_v0.b) {
		var next = _v0.a;
		var rest = _v0.b;
		return _Utils_update(
			model,
			{
				cy: rest,
				bK: A2(
					$elm$core$List$take,
					100,
					A2($elm$core$List$cons, model.x, model.bK)),
				x: next
			});
	} else {
		return model;
	}
};
var $author$project$Domain$Selector$applyRenderStyle = F2(
	function (styleStr, model) {
		var newStyle = function () {
			switch (styleStr) {
				case 'Minimal':
					return 1;
				case 'Academic':
					return 2;
				case 'Mystical':
					return 3;
				default:
					return 0;
			}
		}();
		return _Utils_update(
			model,
			{cR: newStyle});
	});
var $author$project$Domain$Helper$reorderList = F3(
	function (fromIndex, toIndex, list) {
		var element = $elm$core$List$head(
			A2($elm$core$List$drop, fromIndex, list));
		if (!element.$) {
			var item = element.a;
			var remaining = _Utils_ap(
				A2($elm$core$List$take, fromIndex, list),
				A2($elm$core$List$drop, fromIndex + 1, list));
			return _Utils_ap(
				A2($elm$core$List$take, toIndex, remaining),
				A2(
					$elm$core$List$cons,
					item,
					A2($elm$core$List$drop, toIndex, remaining)));
		} else {
			return list;
		}
	});
var $author$project$Domain$Helper$reorderBooksInShelf = F3(
	function (from, to, state) {
		return A2(
			$author$project$Domain$Helper$updateCurrentShelf,
			function (shelf) {
				return _Utils_update(
					shelf,
					{
						V: A3($author$project$Domain$Helper$reorderList, from, to, shelf.V)
					});
			},
			state);
	});
var $author$project$Domain$Helper$updateBookInShelves = F3(
	function (bookId, updater, shelves) {
		return A2(
			$elm$core$List$map,
			function (shelf) {
				return _Utils_update(
					shelf,
					{
						V: A2(
							$elm$core$List$map,
							function (book) {
								return _Utils_eq(book.D, bookId) ? updater(book) : book;
							},
							shelf.V)
					});
			},
			shelves);
	});
var $author$project$Domain$Helper$reorderPagesInBook = F3(
	function (from, to, state) {
		var _v0 = state.W;
		if (!_v0.$) {
			var bookId = _v0.a;
			return _Utils_update(
				state,
				{
					A: A3(
						$author$project$Domain$Helper$updateBookInShelves,
						bookId,
						function (book) {
							return _Utils_update(
								book,
								{
									R: A3($author$project$Domain$Helper$reorderList, from, to, book.R)
								});
						},
						state.A)
				});
		} else {
			return state;
		}
	});
var $author$project$Domain$Helper$reorderShelves = F3(
	function (from, to, state) {
		return _Utils_update(
			state,
			{
				A: A3($author$project$Domain$Helper$reorderList, from, to, state.A)
			});
	});
var $author$project$Domain$Helper$applyReorder = F4(
	function (target, from, to, model) {
		var oldState = model.x;
		var newState = function () {
			switch (target) {
				case 0:
					return A3($author$project$Domain$Helper$reorderShelves, from, to, oldState);
				case 1:
					return A3($author$project$Domain$Helper$reorderBooksInShelf, from, to, oldState);
				default:
					return A3($author$project$Domain$Helper$reorderPagesInBook, from, to, oldState);
			}
		}();
		return _Utils_update(
			model,
			{cq: $elm$core$Maybe$Nothing, x: newState});
	});
var $author$project$Type$BookListTab = 1;
var $author$project$Type$ShelfDetailView = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$applyShelfSelection = F2(
	function (shelfId, model) {
		var oldPresent = model.x;
		return _Utils_update(
			model,
			{
				J: $author$project$Type$ShelfDetailView(shelfId),
				x: _Utils_update(
					oldPresent,
					{ao: shelfId}),
				ac: 1
			});
	});
var $author$project$Main$applyUndo = function (model) {
	var _v0 = model.bK;
	if (_v0.b) {
		var prev = _v0.a;
		var rest = _v0.b;
		return _Utils_update(
			model,
			{
				cy: A2($elm$core$List$cons, model.x, model.cy),
				bK: rest,
				x: prev
			});
	} else {
		return model;
	}
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $author$project$Main$calculateScroll = F3(
	function (_v0, vp, model) {
		var maxScroll = vp.cU.bt - vp.c0.bt;
		var newRatio = (maxScroll <= 0) ? 0 : (vp.c0.c4 / maxScroll);
		return _Utils_update(
			model,
			{cV: newRatio});
	});
var $author$project$Domain$AddItem$createPage = F2(
	function (insertIndex, model) {
		return A2(
			$author$project$Domain$AddItem$buildPage,
			insertIndex,
			$author$project$Domain$AddItem$recordHistory(model));
	});
var $author$project$JsonConverter$encodeExportBook = function (book) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('book')),
					_Utils_Tuple2(
					'payload',
					$author$project$JsonConverter$encodeBook(book))
				])));
};
var $author$project$JsonConverter$encodeExportShelf = function (shelf) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('shelf')),
					_Utils_Tuple2(
					'payload',
					$author$project$JsonConverter$encodeShelf(shelf))
				])));
};
var $author$project$Main$ensureSidebarTabOnEmpty = function (model) {
	return $elm$core$List$isEmpty(model.x.A) ? _Utils_update(
		model,
		{ac: 0}) : model;
};
var $author$project$Domain$Helper$combinePath = F2(
	function (parent, child) {
		return $elm$core$String$isEmpty(parent) ? child : (parent + ('/' + child));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$core$String$map = _String_map;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Domain$Helper$sanitizePath = function (name) {
	var forbidden = _List_fromArray(
		['/', '\\', ':', '*', '?', '\"', '<', '>', '|']);
	return A2(
		$elm$core$String$map,
		function (c) {
			return A2($elm$core$List$member, c, forbidden) ? '-' : c;
		},
		name);
};
var $author$project$Domain$Helper$pageToFileEntry = F4(
	function (extension, folderPath, index, page) {
		var prefix = A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(index + 1));
		var extractedTitle = A2($author$project$Domain$Helper$extractTitleFromContent, index, page.bi);
		var fileName = function (name) {
			return name + ('.' + extension);
		}(
			$author$project$Domain$Helper$sanitizePath(prefix + ('_' + extractedTitle)));
		return {
			bi: page.bi,
			cP: A2($author$project$Domain$Helper$combinePath, folderPath, fileName)
		};
	});
var $author$project$Domain$Helper$bookToAllEntries = F2(
	function (parentPath, book) {
		var bookFolder = A2(
			$author$project$Domain$Helper$combinePath,
			parentPath,
			$author$project$Domain$Helper$sanitizePath(book.b7));
		var mdPath = A2($author$project$Domain$Helper$combinePath, bookFolder, 'markdown_files');
		var mdEntries = A2(
			$elm$core$List$indexedMap,
			A2($author$project$Domain$Helper$pageToFileEntry, 'md', mdPath),
			book.R);
		var txtPath = A2($author$project$Domain$Helper$combinePath, bookFolder, 'text_files');
		var txtEntries = A2(
			$elm$core$List$indexedMap,
			A2($author$project$Domain$Helper$pageToFileEntry, 'txt', txtPath),
			book.R);
		return _Utils_ap(txtEntries, mdEntries);
	});
var $author$project$Domain$Helper$bookZipPayload = function (book) {
	return {
		aF: A2($author$project$Domain$Helper$bookToAllEntries, '', book),
		a8: book.b7
	};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Ports$exportZip = _Platform_outgoingPort(
	'exportZip',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'entries',
					$elm$json$Json$Encode$list(
						function ($) {
							return $elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'content',
										$elm$json$Json$Encode$string($.bi)),
										_Utils_Tuple2(
										'path',
										$elm$json$Json$Encode$string($.cP))
									]));
						})($.aF)),
					_Utils_Tuple2(
					'zipName',
					$elm$json$Json$Encode$string($.a8))
				]));
	});
var $author$project$Main$exportBookById = F2(
	function (bookId, state) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Platform$Cmd$none,
			A2(
				$elm$core$Maybe$map,
				A2($elm$core$Basics$composeR, $author$project$Domain$Helper$bookZipPayload, $author$project$Ports$exportZip),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (b) {
							return _Utils_eq(b.D, bookId);
						},
						A2(
							$elm$core$List$concatMap,
							function ($) {
								return $.V;
							},
							state.A)))));
	});
var $author$project$Domain$Helper$toZipEntries = function (shelves) {
	return A2(
		$elm$core$List$concatMap,
		function (shelf) {
			var pathPrefix = $author$project$Domain$Helper$sanitizePath(shelf.cH);
			return A2(
				$elm$core$List$concatMap,
				$author$project$Domain$Helper$bookToAllEntries(pathPrefix),
				shelf.V);
		},
		shelves);
};
var $author$project$Domain$Helper$shelfZipPayload = function (shelf) {
	return {
		aF: $author$project$Domain$Helper$toZipEntries(
			_List_fromArray(
				[shelf])),
		a8: shelf.cH
	};
};
var $author$project$Main$exportShelfById = F2(
	function (shelfId, shelves) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Platform$Cmd$none,
			A2(
				$elm$core$Maybe$map,
				A2($elm$core$Basics$composeR, $author$project$Domain$Helper$shelfZipPayload, $author$project$Ports$exportZip),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (s) {
							return _Utils_eq(s.D, shelfId);
						},
						shelves))));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Domain$Helper$focusEditor = A2(
	$elm$core$Task$attempt,
	function (_v0) {
		return $author$project$Type$NoOp;
	},
	$elm$browser$Browser$Dom$focus('editor-area'));
var $author$project$Domain$Helper$fullLibraryPayload = function (shelves) {
	return {
		aF: $author$project$Domain$Helper$toZipEntries(shelves),
		a8: 'Full_Library_Backup'
	};
};
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $author$project$Domain$AddItem$isEditorArea = function (value) {
	var idDecoder = $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['target', 'id']),
				$elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'targetId', $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string)
			]));
	return _Utils_eq(
		A2($elm$json$Json$Decode$decodeValue, idDecoder, value),
		$elm$core$Result$Ok('editor-area'));
};
var $author$project$Type$CreatePage = function (a) {
	return {$: 9, a: a};
};
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Domain$AddItem$decodeDropPayload = function (value) {
	var decoder = A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string));
	return A2($elm$json$Json$Decode$decodeValue, decoder, value);
};
var $author$project$Domain$Helper$nextMsg = function (msg) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$identity,
		$elm$core$Task$succeed(msg));
};
var $author$project$Domain$AddItem$processFileDrop = F2(
	function (value, model) {
		var _v0 = $author$project$Domain$AddItem$decodeDropPayload(value);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var fileName = _v1.a;
			var fullContent = _v1.b;
			var updateModel = _Utils_update(
				model,
				{
					as: _List_fromArray(
						[fullContent]),
					cO: fileName
				});
			var nextIndex = model.x.an + 1;
			var newModel = A2($author$project$Domain$Helper$applyPageSelection, nextIndex, updateModel);
			var insertIndex = A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.R;
						},
						$elm$core$List$length),
					$author$project$Domain$Helper$getCurrentBook(model.x)));
			return _Utils_Tuple2(
				newModel,
				$author$project$Domain$Helper$nextMsg(
					$author$project$Type$CreatePage(insertIndex)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Domain$AddItem$handleFileDropped = F2(
	function (value, model) {
		return ((model.bC === 1) && $author$project$Domain$AddItem$isEditorArea(value)) ? _Utils_Tuple2(
			$author$project$Domain$AddItem$recordHistory(model),
			$elm$core$Platform$Cmd$none) : A2($author$project$Domain$AddItem$processFileDrop, value, model);
	});
var $author$project$Domain$AddItem$importTargetToString = function (target) {
	switch (target) {
		case 0:
			return 'shelf';
		case 1:
			return 'book';
		default:
			return 'all';
	}
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$Main$pushToHistory = function (model) {
	return A2($author$project$Domain$Helper$updateAppState, model.x, model);
};
var $author$project$Main$applyImportedModel = F2(
	function (prevModel, importedModel) {
		var historyModel = $author$project$Main$pushToHistory(prevModel);
		return _Utils_update(
			importedModel,
			{cy: _List_Nil, bK: historyModel.bK, x: importedModel.x});
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Main$processImportedString = F2(
	function (jsonString, currentModel) {
		return A2(
			$elm$core$Result$map,
			$author$project$Main$applyImportedModel(currentModel),
			A2($elm$json$Json$Decode$decodeString, $author$project$JsonConverter$decodeModel, jsonString));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Domain$Helper$deleteBookFromShelves = F2(
	function (bookId, shelves) {
		return A2(
			$elm$core$List$map,
			function (shelf) {
				return _Utils_update(
					shelf,
					{
						V: A2(
							$elm$core$List$filter,
							function (b) {
								return !_Utils_eq(b.D, bookId);
							},
							shelf.V)
					});
			},
			shelves);
	});
var $author$project$Domain$Helper$removeBookFromState = F2(
	function (bookId, state) {
		var newShelves = A2($author$project$Domain$Helper$deleteBookFromShelves, bookId, state.A);
		var newCurrentBookId = _Utils_eq(
			state.W,
			$elm$core$Maybe$Just(bookId)) ? $elm$core$Maybe$Nothing : state.W;
		return _Utils_update(
			state,
			{W: newCurrentBookId, A: newShelves});
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Domain$Helper$removeCurrentPage = F2(
	function (pageId, state) {
		var _v0 = $author$project$Domain$Helper$getCurrentBook(state);
		if (!_v0.$) {
			var book = _v0.a;
			var newPages = A2(
				$elm$core$List$filter,
				function (p) {
					return !_Utils_eq(p.D, pageId);
				},
				book.R);
			var newShelves = A3(
				$author$project$Domain$Helper$updateBookInShelves,
				book.D,
				function (b) {
					return _Utils_update(
						b,
						{R: newPages});
				},
				state.A);
			var newPageIndex = $elm$core$List$isEmpty(newPages) ? 0 : A2(
				$elm$core$Basics$min,
				state.an,
				$elm$core$List$length(newPages) - 1);
			return _Utils_update(
				state,
				{an: newPageIndex, A: newShelves});
		} else {
			return state;
		}
	});
var $author$project$Domain$Helper$removeShelf = F2(
	function (shelfId, state) {
		var newShelves = A2(
			$elm$core$List$filter,
			function (s) {
				return !_Utils_eq(s.D, shelfId);
			},
			state.A);
		var nextShelfId = _Utils_eq(state.ao, shelfId) ? A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.D;
				},
				$elm$core$List$head(newShelves))) : state.ao;
		return _Utils_update(
			state,
			{ao: nextShelfId, A: newShelves});
	});
var $author$project$Main$renameShelfInState = F3(
	function (shelfId, newName, model) {
		var oldPresent = model.x;
		var newShelves = A2(
			$elm$core$List$map,
			function (shelf) {
				return _Utils_eq(shelf.D, shelfId) ? _Utils_update(
					shelf,
					{cH: newName}) : shelf;
			},
			oldPresent.A);
		var newPresent = _Utils_update(
			oldPresent,
			{A: newShelves});
		return _Utils_update(
			model,
			{x: newPresent});
	});
var $author$project$Domain$Helper$reorderPagesInCurrentBook = F3(
	function (oldIdx, newIdx, state) {
		var _v0 = $author$project$Domain$Helper$getCurrentBook(state);
		if (!_v0.$) {
			var book = _v0.a;
			var newPages = A3($author$project$Domain$Helper$reorderList, oldIdx, newIdx, book.R);
			var newShelves = A3(
				$author$project$Domain$Helper$updateBookInShelves,
				book.D,
				function (b) {
					return _Utils_update(
						b,
						{R: newPages});
				},
				state.A);
			return _Utils_update(
				state,
				{an: newIdx, A: newShelves});
		} else {
			return state;
		}
	});
var $author$project$Ports$requestFileImport = _Platform_outgoingPort('requestFileImport', $elm$json$Json$Encode$string);
var $author$project$Ports$requestPageImport = _Platform_outgoingPort(
	'requestPageImport',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Ports$scrollToIndex = _Platform_outgoingPort('scrollToIndex', $elm$json$Json$Encode$string);
var $author$project$Ports$scrollToTocHeading = _Platform_outgoingPort(
	'scrollToTocHeading',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $author$project$Ports$triggerDownload = _Platform_outgoingPort('triggerDownload', $elm$json$Json$Encode$string);
var $author$project$Domain$Helper$updateCurrentPageContent = F2(
	function (newContent, state) {
		var _v0 = $author$project$Domain$Helper$getCurrentBook(state);
		if (!_v0.$) {
			var book = _v0.a;
			var newTitle = A2($author$project$Domain$Helper$extractTitleFromContent, state.an, newContent);
			var updatePage = F2(
				function (pIdx, page) {
					return _Utils_eq(pIdx, state.an) ? _Utils_update(
						page,
						{bi: newContent, b7: newTitle}) : page;
				});
			var newPages = A2($elm$core$List$indexedMap, updatePage, book.R);
			var newShelves = A3(
				$author$project$Domain$Helper$updateBookInShelves,
				book.D,
				function (b) {
					return _Utils_update(
						b,
						{R: newPages});
				},
				state.A);
			return _Utils_update(
				state,
				{A: newShelves});
		} else {
			return state;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return $author$project$Domain$Helper$notifyAndSave(
					$author$project$Main$applyUndo(model));
			case 1:
				return $author$project$Domain$Helper$notifyAndSave(
					$author$project$Main$applyRedo(model));
			case 2:
				var viewMode = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{J: viewMode}),
					$elm$core$Platform$Cmd$none);
			case 3:
				return $author$project$Domain$AddItem$appendShelfAndSave(model);
			case 4:
				var shelfId = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					$author$project$Main$ensureSidebarTabOnEmpty(
						function (state) {
							return A2($author$project$Domain$Helper$updateAppState, state, model);
						}(
							A2($author$project$Domain$Helper$removeShelf, shelfId, model.x))));
			case 5:
				var shelfId = msg.a;
				return function (m) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				}(
					A2($author$project$Main$applyShelfSelection, shelfId, model));
			case 6:
				var _v1 = A2($elm$random$Random$step, $danyx23$elm_uuid$Uuid$Barebones$uuidStringGenerator, model.av);
				var newId = _v1.a;
				var nextSeed = _v1.b;
				var newModel = _Utils_update(
					model,
					{av: nextSeed});
				return A2($author$project$Domain$AddItem$appendBookAndSave, newId, newModel);
			case 7:
				var bookId = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					function (state) {
						return A2($author$project$Domain$Helper$updateAppState, state, model);
					}(
						A2($author$project$Domain$Helper$removeBookFromState, bookId, model.x)));
			case 8:
				var bookId = msg.a;
				return A2(
					$author$project$Domain$Helper$notifyAndSaveWithCmd,
					$author$project$Ports$scrollToTop(0),
					A2($author$project$Main$applyBookSelection, bookId, model));
			case 9:
				var page = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					A2($author$project$Domain$AddItem$createPage, page, model));
			case 10:
				var page = msg.a;
				var recordedModel = $author$project$Domain$AddItem$recordHistory(model);
				var builtModel = A2($author$project$Domain$AddItem$buildPage, page, recordedModel);
				var newPresent = builtModel.x;
				return $author$project$Domain$Helper$notifyAndSave(
					_Utils_update(
						builtModel,
						{
							bC: 1,
							x: _Utils_update(
								newPresent,
								{an: page})
						}));
			case 11:
				var pageId = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					function (state) {
						return A2($author$project$Domain$Helper$updateAppState, state, model);
					}(
						A2($author$project$Domain$Helper$removeCurrentPage, pageId, model.x)));
			case 12:
				var index = msg.a;
				return A2(
					$author$project$Domain$Helper$notifyAndSaveWithCmd,
					$author$project$Ports$scrollToTop(0),
					function (m) {
						return _Utils_update(
							m,
							{cV: 0});
					}(
						A2($author$project$Domain$Helper$applyPageSelection, index, model)));
			case 13:
				return A2(
					$elm$core$Tuple$mapSecond,
					function (cmd) {
						return $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmd,
									$author$project$Ports$scrollToTocHeading(0)
								]));
					},
					$author$project$Main$applyNextPage(model));
			case 14:
				return A2(
					$elm$core$Tuple$mapSecond,
					function (cmd) {
						return $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmd,
									$author$project$Ports$scrollToTocHeading(0)
								]));
					},
					$author$project$Main$applyPrevPage(model));
			case 15:
				var newMode = msg.a;
				var _v2 = A2($author$project$Main$applyModeChange, newMode, model);
				var nextModel = _v2.a;
				var nextCmd = _v2.b;
				var syncCmd = function () {
					switch (newMode) {
						case 1:
							return $author$project$Ports$syncScroll(
								{aV: nextModel.cV, a5: 'editor-area'});
						case 0:
							return A2(
								$elm$core$Task$attempt,
								function (_v4) {
									return $author$project$Type$NoOp;
								},
								A2(
									$elm$core$Task$andThen,
									function (vp) {
										var maxScroll = vp.cU.bt - vp.c0.bt;
										return A3($elm$browser$Browser$Dom$setViewportOf, 'page-view-area', 0, nextModel.cV * maxScroll);
									},
									$elm$browser$Browser$Dom$getViewportOf('page-view-area')));
						default:
							return $elm$core$Platform$Cmd$none;
					}
				}();
				return _Utils_Tuple2(
					nextModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								nextCmd,
								syncCmd,
								(newMode === 1) ? $author$project$Domain$Helper$focusEditor : $elm$core$Platform$Cmd$none
							])));
			case 16:
				var tab = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ac: tab}),
					$elm$core$Platform$Cmd$none);
			case 17:
				var shelfId = msg.a;
				var newName = msg.b;
				return function (m) {
					return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
				}(
					A3($author$project$Main$renameShelfInState, shelfId, newName, model));
			case 18:
				var content = msg.a;
				var _v5 = $author$project$Domain$Helper$notifyAndSave(
					function (state) {
						return A2($author$project$Domain$Helper$updateAppState, state, model);
					}(
						A2($author$project$Domain$Helper$updateCurrentPageContent, content, model.x)));
				var newModel = _v5.a;
				var cmd = _v5.b;
				return _Utils_Tuple2(
					newModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[cmd])));
			case 19:
				var text = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: text}),
					$elm$core$Platform$Cmd$none);
			case 20:
				var theme = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					A2($author$project$Domain$Selector$applyColorTheme, theme, model));
			case 21:
				var styleStr = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					A2($author$project$Domain$Selector$applyRenderStyle, styleStr, model));
			case 22:
				var index = msg.a;
				var anchor = msg.b;
				return A2(
					$author$project$Domain$Helper$notifyAndSaveWithCmd,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Ports$scrollToIndex(anchor)
							])),
					function (m) {
						return _Utils_update(
							m,
							{J: $author$project$Type$PageView, bC: 0});
					}(
						A2($author$project$Domain$Helper$applyPageSelection, index, model)));
			case 23:
				var target = msg.a;
				var from = msg.b;
				var to = msg.c;
				return _Utils_Tuple2(
					A4($author$project$Domain$Helper$applyReorder, target, from, to, model),
					$elm$core$Platform$Cmd$none);
			case 24:
				var oldIndex = msg.a;
				var newIndex = msg.b;
				return $author$project$Domain$Helper$notifyAndSave(
					function (state) {
						return A2($author$project$Domain$Helper$updateAppState, state, model);
					}(
						A3($author$project$Domain$Helper$reorderPagesInCurrentBook, oldIndex, newIndex, model.x)));
			case 25:
				var target = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Ports$requestFileImport(
						$author$project$Domain$AddItem$importTargetToString(target)));
			case 26:
				return _Utils_Tuple2(
					model,
					$author$project$Ports$requestPageImport(0));
			case 27:
				var value = msg.a;
				return A2($author$project$Domain$AddItem$processFileDrop, value, model);
			case 28:
				var newId = msg.a;
				var importedBook = msg.b;
				var _v6 = model.J;
				if (_v6.$ === 2) {
					var newBook = _Utils_update(
						importedBook,
						{D: newId});
					var _v7 = $author$project$Domain$Helper$notifyAndSave(
						function (state) {
							return A2($author$project$Domain$Helper$updateAppState, state, model);
						}(
							A2($author$project$Domain$AddItem$appendBookData, newBook, model.x)));
					var newModel = _v7.a;
					var saveCmd = _v7.b;
					return _Utils_Tuple2(newModel, saveCmd);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 29:
				var newId = msg.a;
				var importedShelf = msg.b;
				var _v8 = model.J;
				if (_v8.$ === 1) {
					var newShelf = _Utils_update(
						importedShelf,
						{D: newId});
					var _v9 = $author$project$Domain$Helper$notifyAndSave(
						function (state) {
							return A2($author$project$Domain$Helper$updateAppState, state, model);
						}(
							A2($author$project$Domain$AddItem$appendShelfData, newShelf, model.x)));
					var newModel = _v9.a;
					var saveCmd = _v9.b;
					return _Utils_Tuple2(newModel, saveCmd);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 30:
				var jsonString = msg.a;
				return A2(
					$elm$core$Result$withDefault,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					A2(
						$elm$core$Result$map,
						$author$project$Domain$Helper$notifyAndSave,
						A2($author$project$Main$processImportedString, jsonString, model)));
			case 31:
				return _Utils_Tuple2(
					model,
					$author$project$Ports$triggerDownload(
						$author$project$JsonConverter$encodeModel(model)));
			case 32:
				var formatStr = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cs: $author$project$JsonConverter$stringToExportFormat(formatStr)
						}),
					$elm$core$Platform$Cmd$none);
			case 33:
				var extension = msg.a;
				return _Utils_Tuple2(
					model,
					A2($author$project$Main$applyExportPage, extension, model.x));
			case 34:
				var value = msg.a;
				return A2($author$project$Domain$AddItem$handleFileDropped, value, model);
			case 35:
				var sizeStr = msg.a;
				return $author$project$Domain$Helper$notifyAndSave(
					A2($author$project$Domain$Selector$applyFontSize, sizeStr, model));
			case 36:
				var id = msg.a;
				var vp = msg.b;
				return (id === 'editor-area') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{cV: vp.c0.c4}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					A3($author$project$Main$calculateScroll, id, vp, model),
					$elm$core$Platform$Cmd$none);
			case 37:
				var target = msg.a;
				var index = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cq: $elm$core$Maybe$Just(
								{cx: index, bF: index, ae: target})
						}),
					$elm$core$Platform$Cmd$none);
			case 38:
				var index = msg.a;
				var nextState = A2(
					$elm$core$Maybe$map,
					function (s) {
						return _Utils_update(
							s,
							{bF: index});
					},
					model.cq);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cq: nextState}),
					$elm$core$Platform$Cmd$none);
			case 39:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cq: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 40:
				var bookId = msg.a;
				return _Utils_Tuple2(
					model,
					A2($author$project$Main$exportBookById, bookId, model.x));
			case 41:
				var book = msg.a;
				var jsonString = $author$project$JsonConverter$encodeExportBook(book);
				return _Utils_Tuple2(
					model,
					$author$project$Ports$triggerDownload(jsonString));
			case 42:
				var shelfId = msg.a;
				return _Utils_Tuple2(
					model,
					A2($author$project$Main$exportShelfById, shelfId, model.x.A));
			case 43:
				var shelf = msg.a;
				var jsonString = $author$project$JsonConverter$encodeExportShelf(shelf);
				return _Utils_Tuple2(
					model,
					$author$project$Ports$triggerDownload(jsonString));
			case 44:
				return _Utils_Tuple2(
					model,
					$author$project$Ports$exportZip(
						$author$project$Domain$Helper$fullLibraryPayload(model.x.A)));
			case 45:
				var target = msg.a;
				var id = msg.b;
				var initialValue = msg.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							H: $elm$core$Maybe$Just(
								{D: id, ae: target, N: initialValue})
						}),
					$elm$core$Platform$Cmd$none);
			case 46:
				var newValue = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							H: A2(
								$elm$core$Maybe$map,
								function (e) {
									return _Utils_update(
										e,
										{N: newValue});
								},
								model.H)
						}),
					$elm$core$Platform$Cmd$none);
			case 47:
				var _v10 = model.H;
				if (!_v10.$) {
					var buffer = _v10.a;
					var trimmedValue = $elm$core$String$trim(buffer.N);
					var finalValue = ((buffer.ae === 1) && $elm$core$String$isEmpty(trimmedValue)) ? '無題の本' : (((!buffer.ae) && $elm$core$String$isEmpty(trimmedValue)) ? '無題の本棚' : buffer.N);
					var updatedBuffer = _Utils_update(
						buffer,
						{N: finalValue});
					return A2($author$project$Main$applyEdit, updatedBuffer, model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 48:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{H: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 49:
				var level = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{c1: level}),
					$elm$core$Platform$Cmd$none);
			case 50:
				var newWidth = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cm: newWidth}),
					$elm$core$Platform$Cmd$none);
			case 51:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aM: !model.aM}),
					$elm$core$Platform$Cmd$none);
			case 52:
				var menuId = msg.a;
				var nextId = _Utils_eq(
					model.ar,
					$elm$core$Maybe$Just(menuId)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(menuId);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ar: nextId}),
					$elm$core$Platform$Cmd$none);
			case 53:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ar: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 54:
				var nextMode = (!model.ab) ? 1 : 0;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ab: nextMode}),
					$elm$core$Platform$Cmd$none);
			case 55:
				var nextMode = (model.ab === 2) ? 1 : 2;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ab: nextMode}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$View$Style$basecolors = function (theme) {
	switch (theme) {
		case 0:
			return {cc: 'text-[#C86D51]', cf: 'bg-[#FBF8F5]', cg: 'border-[#F5F4F0]', aj: 'border-[#c6c3be]', bd: 'border-[#C86D51]', aD: 'border-[#C86D51]', ch: 'bg-[#DCD4C9]', bl: 'text-white', aG: '\'DM Sans\', sans-serif', cv: '\'DM Mono\', monospace', bN: 'bg-[#C86D51]', aW: 'rounded-lg', cW: '#C86D51', aa: '#FAFAF8', bZ: 'bg-[#C86D51]', a0: 'bg-[#E9E3DB]', M: 'text-[#2D2A26]', cZ: 'text-[#7A7870]'};
		case 1:
			return {cc: 'text-[#BBB9B0]', cf: 'bg-[#0F0F0E]', cg: 'border-[#171716]', aj: 'border-[#505050]', bd: 'border-[#C9A84C]', aD: 'border-[#333]', ch: 'bg-[#303030]', bl: 'text-[#333]', aG: '\'DM Sans\', sans-serif', cv: '\'DM Mono\', monospace', bN: 'bg-[#C8A74B]', aW: 'rounded', cW: '#969696', aa: '#0F0F0E', bZ: 'bg-yellow-200', a0: 'bg-[#171716]', M: 'text-[#CCC]', cZ: 'text-[#8B8980]'};
		default:
			return {cc: 'text-[#D9A74A]', cf: 'bg-[#0F0F1A]', cg: 'border-[#8B7355]', aj: 'border-[#8B7355]', bd: 'border-[#D9A74A]', aD: 'border-[#8B7355]', ch: 'bg-[#1A1A2E]', bl: 'text-amber-100', aG: '\'Cormorant Garamond\', serif', cv: '\'JetBrains Mono\', monospace', bN: 'bg-[#8B7355]', aW: '', cW: '#A07D42', aa: '#0F0F1A', bZ: 'bg-[#c8a74b]/70', a0: 'bg-[#1A1A2E]', M: 'text-[#E0D5C0]', cZ: 'text-[#A07D42]'};
	}
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$View$Style$tw = function (classes) {
	return A2($elm$core$String$join, ' ', classes);
};
var $author$project$View$Contents$layoutContainer = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'w-screen',
				'h-screen',
				'overflow-hidden',
				$author$project$View$Style$basecolors(theme).cf
			]));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$View$MainArea$mainAreaWrapper = $author$project$View$Style$tw(
	_List_fromArray(
		['flex-1', 'min-w-0', 'h-full', 'relative']));
var $author$project$Type$OnScroll = F2(
	function (a, b) {
		return {$: 36, a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Domain$Helper$scrollDecoder = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target']),
	A5(
		$elm$json$Json$Decode$map4,
		F4(
			function (y, height, sceneHeight, sceneWidth) {
				return {
					cU: {bt: sceneHeight, ca: sceneWidth},
					c0: {bt: height, ca: 0, c3: 0, c4: y}
				};
			}),
		A2($elm$json$Json$Decode$field, 'scrollTop', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'clientHeight', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'scrollHeight', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'scrollWidth', $elm$json$Json$Decode$float)));
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$View$Style$scrollbarStyle = function (theme) {
	var track = $author$project$View$Style$basecolors(theme).aa;
	var thumb = $author$project$View$Style$basecolors(theme).cW;
	return _List_fromArray(
		[
			$elm$html$Html$Attributes$class(' [&::-webkit-scrollbar]:w-2' + (' [&::-webkit-scrollbar-thumb]:bg-[' + (thumb + (']' + (' [&::-webkit-scrollbar-track]:bg-[' + (track + ']')))))),
			A2($elm$html$Html$Attributes$style, 'scrollbar-width', 'thin'),
			A2($elm$html$Html$Attributes$style, 'scrollbar-color', thumb + (' ' + track))
		]);
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Domain$Selector$colorThemeToString = function (theme) {
	switch (theme) {
		case 0:
			return 'Light';
		case 1:
			return 'Dark';
		default:
			return 'Magical';
	}
};
var $author$project$Domain$Selector$fontSizeToNumber = function (size) {
	switch (size) {
		case 0:
			return 14;
		case 1:
			return 18;
		default:
			return 24;
	}
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $author$project$View$MainArea$viewEditor = F2(
	function (model, currentPage) {
		var scrollDecoder = A2(
			$elm$json$Json$Decode$map,
			function (ratio) {
				return A2(
					$author$project$Type$OnScroll,
					'editor-area',
					{
						cU: {bt: 1, ca: 0},
						c0: {bt: 1, ca: 0, c3: 0, c4: ratio}
					});
			},
			A2(
				$elm$json$Json$Decode$field,
				'detail',
				A2($elm$json$Json$Decode$field, 'ratio', $elm$json$Json$Decode$float)));
		var content = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.bi;
				},
				currentPage));
		return A3(
			$elm$html$Html$node,
			'codemirror-editor',
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('editor-area'),
					A2(
					$elm$html$Html$Attributes$property,
					'content',
					$elm$json$Json$Encode$string(content)),
					A2(
					$elm$html$Html$Attributes$property,
					'theme',
					$elm$json$Json$Encode$string(
						$author$project$Domain$Selector$colorThemeToString(model.bh))),
					A2(
					$elm$html$Html$Attributes$property,
					'fontSize',
					$elm$json$Json$Encode$int(
						$author$project$Domain$Selector$fontSizeToNumber(model.cw))),
					A2($elm$html$Html$Events$on, 'editor-scroll', scrollDecoder),
					A2(
					$elm$html$Html$Events$on,
					'editor-change',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Type$UpdateContent,
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['detail']),
							$elm$json$Json$Decode$string))),
					A2(
					$elm$html$Html$Events$stopPropagationOn,
					'keydown',
					$elm$json$Json$Decode$succeed(
						_Utils_Tuple2($author$project$Type$NoOp, true)))
				]),
			_List_Nil);
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$View$MarkdownStyles$tw = function (classes) {
	return A2($elm$core$String$join, ' ', classes);
};
var $author$project$View$MarkdownStyles$codeBlockStyle = function (theme) {
	var common = 'my-4 overflow-x-auto border block font-mono min-h-[3rem]';
	var colors = function () {
		switch (theme) {
			case 0:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['bg-[#f4efe6]', 'text-[#3c4043]', 'rounded-lg', 'border-[#dadce0]', '[&_code]:text-[#3c4043]']));
			case 1:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['bg-[#171716]', 'text-[#E8E6E0]', 'rounded-lg', 'border-[#3A3A36]', '[&_code]:text-[#E8E6E0]']));
			default:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['bg-[#1a1a2e]', 'text-[#a07d42]', 'border-[#8b7355]/40', '[&_code]:text-[#a07d42]']));
		}
	}();
	return $elm$html$Html$Attributes$class(common + (' ' + colors));
};
var $author$project$View$MarkdownStyles$codeSpanStyle = F2(
	function (theme, _v0) {
		var common = 'px-1.5 py-0.5 mx-0.5 border font-mono';
		var colors = function () {
			switch (theme) {
				case 0:
					return 'bg-[#f4efe6] text-[#24292e] border-gray-300 rounded';
				case 1:
					return 'bg-[#171716] text-[#d2691e] border-[#3A3A36] [&_code]:text-[#54cfe8] rounded';
				default:
					return 'bg-[#1a1a2e] text-[#a07d42] border-[#8b7355]/40 [&_code]:text-[#a07d42]';
			}
		}();
		return $elm$html$Html$Attributes$class(common + (' ' + colors));
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$align = $elm$html$Html$Attributes$stringProperty('align');
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$blockquote = _VirtualDom_node('blockquote');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$html$Html$del = _VirtualDom_node('del');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$em = _VirtualDom_node('em');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer = $elm$core$Basics$identity;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Html$resultOr = F2(
	function (ra, rb) {
		if (ra.$ === 1) {
			var singleError = ra.a;
			if (!rb.$) {
				var okValue = rb.a;
				return $elm$core$Result$Ok(okValue);
			} else {
				var errorsSoFar = rb.a;
				return $elm$core$Result$Err(
					A2($elm$core$List$cons, singleError, errorsSoFar));
			}
		} else {
			var okValue = ra.a;
			return $elm$core$Result$Ok(okValue);
		}
	});
var $dillonkearns$elm_markdown$Markdown$Html$attributesToString = function (attributes) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var name = _v0.cH;
				var value = _v0.N;
				return name + ('=\"' + (value + '\"'));
			},
			attributes));
};
var $dillonkearns$elm_markdown$Markdown$Html$tagToString = F2(
	function (tagName, attributes) {
		return $elm$core$List$isEmpty(attributes) ? ('<' + (tagName + '>')) : ('<' + (tagName + (' ' + ($dillonkearns$elm_markdown$Markdown$Html$attributesToString(attributes) + '>'))));
	});
var $dillonkearns$elm_markdown$Markdown$Html$oneOf = function (decoders) {
	var unwrappedDecoders = A2(
		$elm$core$List$map,
		function (_v4) {
			var rawDecoder = _v4;
			return rawDecoder;
		},
		decoders);
	return function (rawDecoder) {
		return F3(
			function (tagName, attributes, innerBlocks) {
				return A2(
					$elm$core$Result$mapError,
					function (errors) {
						if (!errors.b) {
							return 'Ran into a oneOf with no possibilities!';
						} else {
							if (!errors.b.b) {
								var singleError = errors.a;
								return 'Problem with the given value:\n\n' + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ('\n\n' + (singleError + '\n')));
							} else {
								return 'oneOf failed parsing this value:\n    ' + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ('\n\nParsing failed in the following 2 ways:\n\n\n' + (A2(
									$elm$core$String$join,
									'\n\n',
									A2(
										$elm$core$List$indexedMap,
										F2(
											function (index, error) {
												return '(' + ($elm$core$String$fromInt(index + 1) + (') ' + error));
											}),
										errors)) + '\n')));
							}
						}
					},
					A3(rawDecoder, tagName, attributes, innerBlocks));
			});
	}(
		A3(
			$elm$core$List$foldl,
			F2(
				function (decoder, soFar) {
					return F3(
						function (tagName, attributes, children) {
							return A2(
								$dillonkearns$elm_markdown$Markdown$Html$resultOr,
								A3(decoder, tagName, attributes, children),
								A3(soFar, tagName, attributes, children));
						});
				}),
			F3(
				function (_v0, _v1, _v2) {
					return $elm$core$Result$Err(_List_Nil);
				}),
			unwrappedDecoders));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$start = function (n) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'start',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$core$String$words = _String_words;
var $dillonkearns$elm_markdown$Markdown$Renderer$defaultHtmlRenderer = {
	aB: $elm$html$Html$blockquote(_List_Nil),
	ck: function (_v0) {
		var body = _v0.aC;
		var language = _v0.aN;
		var classes = function () {
			var _v1 = A2($elm$core$Maybe$map, $elm$core$String$words, language);
			if ((!_v1.$) && _v1.a.b) {
				var _v2 = _v1.a;
				var actualLanguage = _v2.a;
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$class('language-' + actualLanguage)
					]);
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$pre,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$code,
					classes,
					_List_fromArray(
						[
							$elm$html$Html$text(body)
						]))
				]));
	},
	cl: function (content) {
		return A2(
			$elm$html$Html$code,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text(content)
				]));
	},
	aE: function (children) {
		return A2($elm$html$Html$em, _List_Nil, children);
	},
	aH: A2($elm$html$Html$br, _List_Nil, _List_Nil),
	bs: function (_v3) {
		var level = _v3.X;
		var children = _v3.bf;
		switch (level) {
			case 0:
				return A2($elm$html$Html$h1, _List_Nil, children);
			case 1:
				return A2($elm$html$Html$h2, _List_Nil, children);
			case 2:
				return A2($elm$html$Html$h3, _List_Nil, children);
			case 3:
				return A2($elm$html$Html$h4, _List_Nil, children);
			case 4:
				return A2($elm$html$Html$h5, _List_Nil, children);
			default:
				return A2($elm$html$Html$h6, _List_Nil, children);
		}
	},
	aJ: $dillonkearns$elm_markdown$Markdown$Html$oneOf(_List_Nil),
	aK: function (imageInfo) {
		var _v5 = imageInfo.b7;
		if (!_v5.$) {
			var title = _v5.a;
			return A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(imageInfo.aY),
						$elm$html$Html$Attributes$alt(imageInfo.aA),
						$elm$html$Html$Attributes$title(title)
					]),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(imageInfo.aY),
						$elm$html$Html$Attributes$alt(imageInfo.aA)
					]),
				_List_Nil);
		}
	},
	aP: F2(
		function (link, content) {
			var _v6 = link.b7;
			if (!_v6.$) {
				var title = _v6.a;
				return A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(link.co),
							$elm$html$Html$Attributes$title(title)
						]),
					content);
			} else {
				return A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(link.co)
						]),
					content);
			}
		}),
	aS: F2(
		function (startingIndex, items) {
			return A2(
				$elm$html$Html$ol,
				function () {
					if (startingIndex === 1) {
						return _List_fromArray(
							[
								$elm$html$Html$Attributes$start(startingIndex)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				A2(
					$elm$core$List$map,
					function (itemBlocks) {
						return A2($elm$html$Html$li, _List_Nil, itemBlocks);
					},
					items));
		}),
	aT: $elm$html$Html$p(_List_Nil),
	a_: function (children) {
		return A2($elm$html$Html$del, _List_Nil, children);
	},
	a$: function (children) {
		return A2($elm$html$Html$strong, _List_Nil, children);
	},
	cY: $elm$html$Html$table(_List_Nil),
	a1: $elm$html$Html$tbody(_List_Nil),
	a2: function (maybeAlignment) {
		var attrs = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$html$Html$Attributes$align,
					A2(
						$elm$core$Maybe$map,
						function (alignment) {
							switch (alignment) {
								case 0:
									return 'left';
								case 2:
									return 'center';
								default:
									return 'right';
							}
						},
						maybeAlignment))));
		return $elm$html$Html$td(attrs);
	},
	a3: $elm$html$Html$thead(_List_Nil),
	a4: function (maybeAlignment) {
		var attrs = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$html$Html$Attributes$align,
					A2(
						$elm$core$Maybe$map,
						function (alignment) {
							switch (alignment) {
								case 0:
									return 'left';
								case 2:
									return 'center';
								default:
									return 'right';
							}
						},
						maybeAlignment))));
		return $elm$html$Html$th(attrs);
	},
	ax: $elm$html$Html$tr(_List_Nil),
	M: $elm$html$Html$text,
	a6: A2($elm$html$Html$hr, _List_Nil, _List_Nil),
	a7: function (items) {
		return A2(
			$elm$html$Html$ul,
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (item) {
					var task = item.a;
					var children = item.b;
					var checkbox = function () {
						switch (task) {
							case 0:
								return $elm$html$Html$text('');
							case 1:
								return A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(true),
											$elm$html$Html$Attributes$checked(false),
											$elm$html$Html$Attributes$type_('checkbox')
										]),
									_List_Nil);
							default:
								return A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(true),
											$elm$html$Html$Attributes$checked(true),
											$elm$html$Html$Attributes$type_('checkbox')
										]),
									_List_Nil);
						}
					}();
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						A2($elm$core$List$cons, checkbox, children));
				},
				items));
	}
};
var $elm$core$String$indices = _String_indexes;
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$core$String$toLower = _String_toLower;
var $author$project$View$MarkdownStyles$highlightText = F2(
	function (query, txt) {
		if ($elm$core$String$isEmpty(query)) {
			return _List_fromArray(
				[
					$elm$html$Html$text(txt)
				]);
		} else {
			var lowerTxt = $elm$core$String$toLower(txt);
			var lowerQuery = $elm$core$String$toLower(query);
			var _v0 = $elm$core$List$head(
				A2($elm$core$String$indices, lowerQuery, lowerTxt));
			if (_v0.$ === 1) {
				return _List_fromArray(
					[
						$elm$html$Html$text(txt)
					]);
			} else {
				var idx = _v0.a;
				var matched = A3(
					$elm$core$String$slice,
					idx,
					idx + $elm$core$String$length(query),
					txt);
				var before = A2($elm$core$String$left, idx, txt);
				var after = A2(
					$elm$core$String$dropLeft,
					idx + $elm$core$String$length(query),
					txt);
				return A2(
					$elm$core$List$cons,
					$elm$html$Html$text(before),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(matched)
								])),
						A2($author$project$View$MarkdownStyles$highlightText, query, after)));
			}
		}
	});
var $author$project$View$MarkdownStyles$mathBlockStyle = function (theme) {
	var colors = function () {
		switch (theme) {
			case 0:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['text-gray-900']));
			case 1:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['text-gray-100']));
			default:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['text-[#d9a74a]']));
		}
	}();
	return $elm$html$Html$Attributes$class(
		$author$project$View$MarkdownStyles$tw(
			_List_fromArray(
				['not-prose', 'my-6', 'block', 'overflow-x-auto', colors])));
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$View$Markdown$customRenderer = F3(
	function (theme, renderStyle, searchText) {
		var _default = $dillonkearns$elm_markdown$Markdown$Renderer$defaultHtmlRenderer;
		var headingRenderer = function (_v2) {
			var level = _v2.X;
			var rawText = _v2.bT;
			var children = _v2.bf;
			var slug = A3(
				$elm$core$String$replace,
				'\\',
				'-',
				A3(
					$elm$core$String$replace,
					'/',
					'-',
					A3(
						$elm$core$String$replace,
						'#',
						'',
						A3(
							$elm$core$String$replace,
							' ',
							'-',
							$elm$core$String$toLower(rawText)))));
			switch (level) {
				case 0:
					return A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(slug)
							]),
						children);
				case 1:
					return A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(slug)
							]),
						children);
				case 2:
					return A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id(slug)
							]),
						children);
				default:
					return _default.bs(
						{bf: children, X: level, bT: rawText});
			}
		};
		return _Utils_update(
			_default,
			{
				ck: function (block) {
					var lang = A2(
						$elm$core$Maybe$map,
						A2($elm$core$Basics$composeR, $elm$core$String$trim, $elm$core$String$toLower),
						block.aN);
					if ((!lang.$) && (lang.a === 'math')) {
						return A3(
							$elm$html$Html$node,
							'katex-display',
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'formula', block.aC),
									A2($elm$html$Html$Attributes$attribute, 'display-mode', 'true'),
									$author$project$View$MarkdownStyles$mathBlockStyle(theme)
								]),
							_List_Nil);
					} else {
						var combinedKey = A2($elm$core$Maybe$withDefault, 'none', block.aN) + ('_' + block.aC);
						return A3(
							$elm$html$Html$node,
							'highlight-code',
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'code', block.aC),
									A2(
									$elm$html$Html$Attributes$attribute,
									'lang',
									A2($elm$core$Maybe$withDefault, '', block.aN)),
									A2(
									$elm$html$Html$Attributes$attribute,
									'theme',
									$author$project$Domain$Selector$colorThemeToString(theme)),
									A2($elm$html$Html$Attributes$attribute, 'update-key', combinedKey),
									A2($elm$html$Html$Attributes$attribute, 'search-text', searchText),
									$elm$html$Html$Attributes$class('not-prose'),
									$author$project$View$MarkdownStyles$codeBlockStyle(theme),
									$elm$html$Html$Attributes$class(' [&::-webkit-scrollbar]:w-2'),
									A2($elm$html$Html$Attributes$style, 'scrollbar-width', 'thin')
								]),
							_List_Nil);
					}
				},
				cl: function (content) {
					if (A2($elm$core$String$startsWith, 'math ', content)) {
						var formula = A2($elm$core$String$dropLeft, 5, content);
						return A3(
							$elm$html$Html$node,
							'katex-inline',
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'formula', formula)
								]),
							_List_Nil);
					} else {
						return A3(
							$elm$html$Html$node,
							'highlight-code-span',
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'content', content),
									A2($elm$html$Html$Attributes$attribute, 'search-text', searchText),
									A2($author$project$View$MarkdownStyles$codeSpanStyle, theme, renderStyle),
									$elm$html$Html$Attributes$class('not-prose')
								]),
							_List_Nil);
					}
				},
				bs: headingRenderer,
				cY: function (children) {
					return A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('not-prose border-collapse w-full my-4'),
								$elm$html$Html$Attributes$class('[&_th]:border [&_td]:border [&_th]:p-2 [&_td]:p-2')
							]),
						children);
				},
				M: function (str) {
					return A2(
						$elm$html$Html$span,
						_List_Nil,
						A2($author$project$View$MarkdownStyles$highlightText, searchText, str));
				}
			});
	});
var $author$project$View$MarkdownStyles$applyAccessibilityWeight = F2(
	function (style, size) {
		var _v0 = _Utils_Tuple2(style, size);
		_v0$3:
		while (true) {
			if (!_v0.b) {
				switch (_v0.a) {
					case 2:
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return 'font-bold antialiased tracking-wide';
					case 1:
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						return 'font-bold antialiased tracking-tight';
					case 3:
						var _v5 = _v0.a;
						var _v6 = _v0.b;
						return 'font-bold antialiased not-italic tracking-wider';
					default:
						break _v0$3;
				}
			} else {
				break _v0$3;
			}
		}
		return '';
	});
var $author$project$View$MarkdownStyles$fontSizeClass = function (size) {
	switch (size) {
		case 0:
			return 'text-sm prose-sm';
		case 1:
			return 'text-lg prose-lg';
		default:
			return 'text-2xl prose-2xl';
	}
};
var $author$project$View$MarkdownStyles$renderStyleClasses = F2(
	function (style, fontSize) {
		var headSizeClass = function () {
			switch (fontSize) {
				case 0:
					return 'prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base prose-h4:text-base prose-h5:text-base prose-h6:text-base';
				case 1:
					return 'prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-base prose-h6:text-base';
				default:
					return 'prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base';
			}
		}();
		switch (style) {
			case 0:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['font-sans leading-relaxed', 'prose-h1:pb-2 prose-h1:border-b-0', headSizeClass, 'prose-ul:list-disc prose-ol:list-decimal']));
			case 1:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['font-sans font-light tracking-tight', 'prose-p:leading-snug prose-p:mb-3', 'prose-h1:font-normal prose-h1:mb-4 prose-h1:border-b-0', 'prose-h2:font-normal', 'prose-h3:font-normal', headSizeClass, 'prose-ul:list-none prose-ul:pl-0']));
			case 2:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['font-serif leading-normal', 'prose-h1:text-center prose-h1:not-italic prose-h1:mb-8 prose-h1:border-b-0 prose-h1:pb-3', headSizeClass, 'prose-p:text-justify prose-p:indent-4', 'prose-ul:list-square']));
			default:
				return $author$project$View$MarkdownStyles$tw(
					_List_fromArray(
						['font-serif italic leading-loose tracking-wide', 'prose-h1:not-italic prose-h1:font-bold prose-h1:tracking-widest prose-h1:text-center prose-h1:border-b prose-h1:pb-3 prose-h1:mb-8', 'prose-h2:not-italic prose-h2:font-semibold prose-h2:tracking-wider', 'prose-h3:not-italic prose-h3:font-medium', headSizeClass, 'prose-p:leading-loose prose-p:mb-6', 'prose-strong:not-italic prose-strong:font-bold', 'prose-ul:list-none prose-ul:pl-0', 'prose-ol:list-decimal prose-ol:pl-6', 'prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:not-italic']));
		}
	});
var $author$project$View$MarkdownStyles$themeColors = F2(
	function (theme, style) {
		switch (theme) {
			case 0:
				var elements = _List_fromArray(
					['[&_h1]:text-[#c86d51] [&_h1]:border-b-0', '[&_h2]:text-[#c86d51] [&_h2]:border-b-0', '[&_h3]:text-[#c86d51]', '[&_h4]:text-[#c86d51]', '[&_h5]:text-[#c86d51]', '[&_h6]:text-[#c86d51]', '[&_strong]:text-[#38332c] [&_strong]:font-bold', '[&_a]:text-[#b85d41] [&_a]:underline-offset-4 [&_a]:decoration-[#b85d41]/30 hover:[&_a]:decoration-[#b85d41]', '[&_blockquote]:border-l-[#b85d41] [&_blockquote]:text-[#7a7267] [&_blockquote]:italic', '[&_hr]:border-[rgba(74,69,62,0.12)]', '[&_th]:text-[#38332c] [&_th]:bg-[#f3efe6] [&_th]:border-[rgba(74,69,62,0.12)]', '[&_td]:border-[rgba(74,69,62,0.12)]']);
				var common = 'bg-[#fbf8f5] text-[#4a453e] border-[rgba(74,69,62,0.12)]';
				return A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$cons, common, elements));
			case 1:
				var elements = _List_fromArray(
					['[&_h1]:text-[#C9A84C] [&_h1]:border-b-0', '[&_h2]:text-[#C9A84C] [&_h2]:border-b-0', '[&_h3]:text-[#C9A84C]', '[&_h4]:text-[#C9A84C]', '[&_h5]:text-[#C9A84C]', '[&_h6]:text-[#C9A84C]', '[&_strong]:text-white [&_strong]:font-bold', '[&_a]:text-[#C9A84C] [&_a]:no-underline hover:[&_a]:text-[#E8E6E0]', '[&_blockquote]:border-l-[#C9A84C] [&_blockquote]:text-[#6B6960] [&_blockquote]:italic', '[&_hr]:border-[#2A2A27]', '[&_th]:text-[#C9A84C] [&_th]:bg-[#171716] [&_th]:border-[#444]', '[&_td]:border-[#2A2A27]']);
				var common = 'bg-[#0F0F0E] text-[#D3D3D3] border-[#2A2A27]';
				return A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$cons, common, elements));
			default:
				var h1Decoration = function () {
					switch (style) {
						case 2:
							return _List_fromArray(
								['[&_h1]:border-b-[#d9a74a]/30', '[&_h1]:bg-gradient-to-r [&_h1]:from-transparent [&_h1]:via-[#d9a74a]/80 [&_h1]:to-transparent', '[&_h1]:bg-[length:100%_1px] [&_h1]:bg-bottom [&_h1]:bg-no-repeat']);
						case 3:
							return _List_fromArray(
								['[&_h1]:border-b-[#d9a74a]/30', '[&_h1]:bg-gradient-to-r [&_h1]:from-transparent [&_h1]:via-[#d9a74a]/80 [&_h1]:to-transparent', '[&_h1]:bg-[length:100%_1px] [&_h1]:bg-bottom [&_h1]:bg-no-repeat']);
						default:
							return _List_fromArray(
								['[&_h1]:border-b-0']);
					}
				}();
				var elements = _Utils_ap(
					h1Decoration,
					_List_fromArray(
						['[&_h1]:text-[#d9a74a]', '[&_h1]:opacity-80', '[&_h2]:text-[#d9a74a] [&_h2]:border-b-[#d9a74a]/20 [&_h2]:opacity-80', '[&_h3]:text-[#d9a74a] [&_h3]:opacity-80', '[&_h4]:text-[#d9a74a] [&_h4]:opacity-80', '[&_h5]:text-[#d9a74a] [&_h5]:opacity-80', '[&_h6]:text-[#d9a74a] [&_h6]:opacity-80', '[&_strong]:text-[#e0d5c0]', '[&_strong]:font-bold', '[&_a]:text-[#d9a74a] [&_a]:no-underline hover:[&_a]:underline', '[&_blockquote]:border-l-[#d9a74a] [&_blockquote]:text-[#8b7355] [&_blockquote]:italic', '[&_hr]:border-[#8b7355]/30', '[&_th]:text-[#d9a74a] [&_th]:border-[#8b7355]/40', '[&_td]:border-[#8b7355]/20']));
				var common = 'bg-[#0f0f1a] text-[#e0d5c0]/90 border-[#8b7355]/30';
				return A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$cons, common, elements));
		}
	});
var $author$project$View$MarkdownStyles$markdownContainer = F3(
	function (theme, style, size) {
		return _List_fromArray(
			[
				$elm$html$Html$Attributes$class('prose max-w-none'),
				$elm$html$Html$Attributes$class(
				A2($author$project$View$MarkdownStyles$themeColors, theme, style)),
				$elm$html$Html$Attributes$class(
				A2($author$project$View$MarkdownStyles$renderStyleClasses, style, size)),
				$elm$html$Html$Attributes$class(
				$author$project$View$MarkdownStyles$fontSizeClass(size)),
				$elm$html$Html$Attributes$class(
				A2($author$project$View$MarkdownStyles$applyAccessibilityWeight, style, size)),
				$elm$html$Html$Attributes$class('animate-[fadeIn_0.1s_ease-out]')
			]);
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine = {$: 10};
var $dillonkearns$elm_markdown$Markdown$Block$BlockQuote = function (a) {
	return {$: 3, a: a};
};
var $dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote = function (a) {
	return {$: 11, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Cdata = function (a) {
	return {$: 4, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$CodeBlock = function (a) {
	return {$: 7, a: a};
};
var $dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock = function (a) {
	return {$: 5, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$CodeSpan = function (a) {
	return {$: 6, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$CompletedTask = 2;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Emphasis = function (a) {
	return {$: 3, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$Emphasis = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock = {$: 0};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HardLineBreak = {$: 8};
var $dillonkearns$elm_markdown$Markdown$Block$Heading = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$Heading = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$Html = function (a) {
	return {$: 2, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock = function (a) {
	return {$: 0, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HtmlComment = function (a) {
	return {$: 1, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$HtmlElement = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Block$HtmlInline = function (a) {
	return {$: 0, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Image = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Block$IncompleteTask = 1;
var $dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock = function (a) {
	return {$: 6, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem = function (a) {
	return {$: 2, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Link = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Block$ListItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$NoTask = 0;
var $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph = function (a) {
	return {$: 1, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$OrderedList = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock = F6(
	function (a, b, c, d, e, f) {
		return {$: 4, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $dillonkearns$elm_markdown$Markdown$Block$Paragraph = function (a) {
	return {$: 5, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock = function (a) {
	return {$: 1, a: a};
};
var $dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction = function (a) {
	return {$: 2, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Strikethrough = function (a) {
	return {$: 5, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Strong = function (a) {
	return {$: 4, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Table = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$Table = function (a) {
	return {$: 8, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Table$Table = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$Text = function (a) {
	return {$: 7, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$ThematicBreak = {$: 8};
var $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak = {$: 7};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$UnorderedList = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines = $elm$core$Basics$identity;
var $dillonkearns$elm_markdown$Markdown$Parser$addReference = F2(
	function (state, linkRef) {
		return {
			a: A2($elm$core$List$cons, linkRef, state.a),
			b: state.b
		};
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.aY);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.d, offset) < 0,
					0,
					{bg: col, f: s0.f, h: s0.h, d: offset, cT: row, aY: s0.aY});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.d, s.cT, s.bg, s);
	};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $dillonkearns$elm_markdown$Whitespace$isSpaceOrTab = function (_char) {
	switch (_char) {
		case ' ':
			return true;
		case '\t':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Parser$Token$carriageReturn = A2(
	$elm$parser$Parser$Advanced$Token,
	'\u000D',
	$elm$parser$Parser$Expecting('a carriage return'));
var $dillonkearns$elm_markdown$Parser$Token$newline = A2(
	$elm$parser$Parser$Advanced$Token,
	'\n',
	$elm$parser$Parser$Expecting('a newline'));
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {bg: col, cn: contextStack, cQ: problem, cT: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.cT, s.bg, x, s.f));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.d, s.cT, s.bg, s.aY);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{bg: newCol, f: s.f, h: s.h, d: newOffset, cT: newRow, aY: s.aY});
	};
};
var $dillonkearns$elm_markdown$Whitespace$lineEnd = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$newline),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$carriageReturn),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$newline),
						$elm$parser$Parser$Advanced$succeed(0)
					])))
		]));
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $dillonkearns$elm_markdown$Markdown$Parser$blankLine = A2(
	$elm$parser$Parser$Advanced$map,
	function (_v0) {
		return $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine;
	},
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$backtrackable(
			$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
		$dillonkearns$elm_markdown$Whitespace$lineEnd));
var $dillonkearns$elm_markdown$Parser$Token$space = A2(
	$elm$parser$Parser$Advanced$Token,
	' ',
	$elm$parser$Parser$Expecting('a space'));
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $dillonkearns$elm_markdown$Markdown$Parser$blockQuoteStarts = _List_fromArray(
	[
		$elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			'>',
			$elm$parser$Parser$Expecting('>'))),
		A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$backtrackable(
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'>',
						$elm$parser$Parser$Expecting(' >'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						' >',
						$elm$parser$Parser$Expecting('  >'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'  >',
						$elm$parser$Parser$Expecting('   >')))
				])))
	]);
var $dillonkearns$elm_markdown$Whitespace$isLineEnd = function (_char) {
	switch (_char) {
		case '\n':
			return true;
		case '\u000D':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd = $elm$parser$Parser$Advanced$chompWhile(
	A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isLineEnd));
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.d, s1.d, s0.aY),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.aY),
			s.d) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $dillonkearns$elm_markdown$Helpers$endOfFile = $elm$parser$Parser$Advanced$end(
	$elm$parser$Parser$Expecting('the end of the input'));
var $dillonkearns$elm_markdown$Helpers$lineEndOrEnd = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[$dillonkearns$elm_markdown$Whitespace$lineEnd, $dillonkearns$elm_markdown$Helpers$endOfFile]));
var $dillonkearns$elm_markdown$Markdown$Parser$blockQuote = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote),
			$elm$parser$Parser$Advanced$oneOf($dillonkearns$elm_markdown$Markdown$Parser$blockQuoteStarts)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space),
					$elm$parser$Parser$Advanced$succeed(0)
				]))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$Parser$problemToString = function (problem) {
	switch (problem.$) {
		case 0:
			var string = problem.a;
			return 'Expecting ' + string;
		case 1:
			return 'Expecting int';
		case 2:
			return 'Expecting hex';
		case 3:
			return 'Expecting octal';
		case 4:
			return 'Expecting binary';
		case 5:
			return 'Expecting float';
		case 6:
			return 'Expecting number';
		case 7:
			return 'Expecting variable';
		case 8:
			var string = problem.a;
			return 'Expecting symbol ' + string;
		case 9:
			var string = problem.a;
			return 'Expecting keyword ' + string;
		case 10:
			return 'Expecting keyword end';
		case 11:
			return 'Unexpected char';
		case 12:
			var problemDescription = problem.a;
			return problemDescription;
		default:
			return 'Bad repeat';
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString = function (deadEnd) {
	return 'Problem at row ' + ($elm$core$String$fromInt(deadEnd.cT) + ('\n' + $dillonkearns$elm_markdown$Markdown$Parser$problemToString(deadEnd.cQ)));
};
var $dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString = function (deadEnds) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, deadEnds));
};
var $elm$core$String$endsWith = _String_endsWith;
var $dillonkearns$elm_markdown$Markdown$Parser$endWithOpenBlockOrParagraph = function (block) {
	endWithOpenBlockOrParagraph:
	while (true) {
		switch (block.$) {
			case 1:
				var str = block.a;
				return !A2($elm$core$String$endsWith, str, '\n');
			case 12:
				var blocks = block.a;
				if (blocks.b) {
					var last = blocks.a;
					var $temp$block = last;
					block = $temp$block;
					continue endWithOpenBlockOrParagraph;
				} else {
					return false;
				}
			case 4:
				var blockslist = block.e;
				if (blockslist.b) {
					var blocks = blockslist.a;
					if (blocks.b) {
						var last = blocks.a;
						var $temp$block = last;
						block = $temp$block;
						continue endWithOpenBlockOrParagraph;
					} else {
						return false;
					}
				} else {
					return false;
				}
			case 0:
				return true;
			default:
				return false;
		}
	}
};
var $dillonkearns$elm_markdown$HtmlParser$Cdata = function (a) {
	return {$: 3, a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$Element = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$HtmlParser$Text = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.d, s.aY);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bg: 1, f: s.f, h: s.h, d: s.d + 1, cT: s.cT + 1, aY: s.aY}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bg: s.bg + 1, f: s.f, h: s.h, d: newOffset, cT: s.cT, aY: s.aY}));
		};
	});
var $dillonkearns$elm_markdown$HtmlParser$expectTagNameCharacter = $elm$parser$Parser$Expecting('at least 1 tag name character');
var $dillonkearns$elm_markdown$HtmlParser$tagNameCharacter = function (c) {
	switch (c) {
		case ' ':
			return false;
		case '\u000D':
			return false;
		case '\n':
			return false;
		case '\t':
			return false;
		case '/':
			return false;
		case '<':
			return false;
		case '>':
			return false;
		case '\"':
			return false;
		case '\'':
			return false;
		case '=':
			return false;
		default:
			return true;
	}
};
var $dillonkearns$elm_markdown$HtmlParser$tagName = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (name, _v0) {
			return $elm$core$String$toLower(name);
		}),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2($elm$parser$Parser$Advanced$chompIf, $dillonkearns$elm_markdown$HtmlParser$tagNameCharacter, $dillonkearns$elm_markdown$HtmlParser$expectTagNameCharacter),
		$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$tagNameCharacter)));
var $dillonkearns$elm_markdown$HtmlParser$attributeName = $dillonkearns$elm_markdown$HtmlParser$tagName;
var $dillonkearns$elm_markdown$HtmlParser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$token(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $dillonkearns$elm_markdown$HtmlParser$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('amp', '&'),
			_Utils_Tuple2('lt', '<'),
			_Utils_Tuple2('gt', '>'),
			_Utils_Tuple2('apos', '\''),
			_Utils_Tuple2('quot', '\"')
		]));
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$HtmlParser$decodeEscape = function (s) {
	return A2($elm$core$String$startsWith, '#x', s) ? A2(
		$elm$core$Result$mapError,
		$elm$parser$Parser$Problem,
		A2(
			$elm$core$Result$map,
			$elm$core$Char$fromCode,
			$rtfeldman$elm_hex$Hex$fromString(
				A2($elm$core$String$dropLeft, 2, s)))) : (A2($elm$core$String$startsWith, '#', s) ? A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('Invalid escaped character: ' + s),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Char$fromCode,
			$elm$core$String$toInt(
				A2($elm$core$String$dropLeft, 1, s)))) : A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('No entity named \"&' + (s + ';\" found.')),
		A2($elm$core$Dict$get, s, $dillonkearns$elm_markdown$HtmlParser$entities)));
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $dillonkearns$elm_markdown$HtmlParser$escapedChar = function (end_) {
	var process = function (entityStr) {
		var _v0 = $dillonkearns$elm_markdown$HtmlParser$decodeEscape(entityStr);
		if (!_v0.$) {
			var c = _v0.a;
			return $elm$parser$Parser$Advanced$succeed(c);
		} else {
			var e = _v0.a;
			return $elm$parser$Parser$Advanced$problem(e);
		}
	};
	var isEntityChar = function (c) {
		return (!_Utils_eq(c, end_)) && (c !== ';');
	};
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$dillonkearns$elm_markdown$HtmlParser$symbol('&')),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$andThen,
				process,
				$elm$parser$Parser$Advanced$getChompedString(
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$chompIf,
							isEntityChar,
							$elm$parser$Parser$Expecting('an entity character')),
						$elm$parser$Parser$Advanced$chompWhile(isEntityChar)))),
			$dillonkearns$elm_markdown$HtmlParser$symbol(';')));
};
var $dillonkearns$elm_markdown$HtmlParser$textStringStep = F3(
	function (closingChar, predicate, accum) {
		return A2(
			$elm$parser$Parser$Advanced$andThen,
			function (soFar) {
				return $elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$Advanced$map,
							function (escaped) {
								return $elm$parser$Parser$Advanced$Loop(
									_Utils_ap(
										accum,
										_Utils_ap(
											soFar,
											$elm$core$String$fromChar(escaped))));
							},
							$dillonkearns$elm_markdown$HtmlParser$escapedChar(closingChar)),
							$elm$parser$Parser$Advanced$succeed(
							$elm$parser$Parser$Advanced$Done(
								_Utils_ap(accum, soFar)))
						]));
			},
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompWhile(predicate)));
	});
var $dillonkearns$elm_markdown$HtmlParser$textString = function (closingChar) {
	var predicate = function (c) {
		return (!_Utils_eq(c, closingChar)) && (c !== '&');
	};
	return A2(
		$elm$parser$Parser$Advanced$loop,
		'',
		A2($dillonkearns$elm_markdown$HtmlParser$textStringStep, closingChar, predicate));
};
var $dillonkearns$elm_markdown$HtmlParser$attributeValue = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\"')),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$HtmlParser$textString('\"'),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\"'))),
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\'')),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$HtmlParser$textString('\''),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\'')))
		]));
var $dillonkearns$elm_markdown$HtmlParser$keepOldest = F2(
	function (_new, mValue) {
		if (!mValue.$) {
			var v = mValue.a;
			return $elm$core$Maybe$Just(v);
		} else {
			return $elm$core$Maybe$Just(_new);
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $dillonkearns$elm_markdown$HtmlParser$isWhitespace = function (c) {
	switch (c) {
		case ' ':
			return true;
		case '\u000D':
			return true;
		case '\n':
			return true;
		case '\t':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$HtmlParser$whiteSpace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isWhitespace);
var $dillonkearns$elm_markdown$HtmlParser$attributesStep = function (attrs) {
	var process = F2(
		function (name, value) {
			return $elm$parser$Parser$Advanced$Loop(
				A3(
					$elm$core$Dict$update,
					$elm$core$String$toLower(name),
					$dillonkearns$elm_markdown$HtmlParser$keepOldest(value),
					attrs));
		});
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(process),
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributeName, $dillonkearns$elm_markdown$HtmlParser$whiteSpace),
							$dillonkearns$elm_markdown$HtmlParser$symbol('=')),
						$dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
				A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributeValue, $dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
				$elm$parser$Parser$Advanced$succeed(
				$elm$parser$Parser$Advanced$Done(attrs))
			]));
};
var $dillonkearns$elm_markdown$HtmlParser$attributes = A2(
	$elm$parser$Parser$Advanced$map,
	A2(
		$elm$core$Dict$foldl,
		F3(
			function (key, value, accum) {
				return A2(
					$elm$core$List$cons,
					{cH: key, N: value},
					accum);
			}),
		_List_Nil),
	A2($elm$parser$Parser$Advanced$loop, $elm$core$Dict$empty, $dillonkearns$elm_markdown$HtmlParser$attributesStep));
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return function (s) {
		var _v0 = A5(_Parser_findSubString, str, s.d, s.cT, s.bg, s.aY);
		var newOffset = _v0.a;
		var newRow = _v0.b;
		var newCol = _v0.c;
		var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.aY) : newOffset;
		return A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.d, adjustedOffset) < 0,
			0,
			{bg: newCol, f: s.f, h: s.h, d: adjustedOffset, cT: newRow, aY: s.aY});
	};
};
var $dillonkearns$elm_markdown$HtmlParser$cdata = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
		$dillonkearns$elm_markdown$HtmlParser$symbol('<![CDATA[')),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr(']]>')),
		$dillonkearns$elm_markdown$HtmlParser$symbol(']]>')));
var $dillonkearns$elm_markdown$HtmlParser$childrenStep = F2(
	function (options, accum) {
		return A2(
			$elm$parser$Parser$Advanced$map,
			function (f) {
				return f(accum);
			},
			$elm$parser$Parser$Advanced$oneOf(options));
	});
var $dillonkearns$elm_markdown$HtmlParser$fail = function (str) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(str));
};
var $dillonkearns$elm_markdown$HtmlParser$closingTag = function (startTagName) {
	var closingTagName = A2(
		$elm$parser$Parser$Advanced$andThen,
		function (endTagName) {
			return _Utils_eq(startTagName, endTagName) ? $elm$parser$Parser$Advanced$succeed(0) : $dillonkearns$elm_markdown$HtmlParser$fail('tag name mismatch: ' + (startTagName + (' and ' + endTagName)));
		},
		$dillonkearns$elm_markdown$HtmlParser$tagName);
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$HtmlParser$symbol('</'),
					$dillonkearns$elm_markdown$HtmlParser$whiteSpace),
				closingTagName),
			$dillonkearns$elm_markdown$HtmlParser$whiteSpace),
		$dillonkearns$elm_markdown$HtmlParser$symbol('>'));
};
var $dillonkearns$elm_markdown$HtmlParser$Comment = function (a) {
	return {$: 2, a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $dillonkearns$elm_markdown$HtmlParser$comment = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Comment),
		$elm$parser$Parser$Advanced$token(
			$dillonkearns$elm_markdown$HtmlParser$toToken('<!--'))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('-->')),
		$elm$parser$Parser$Advanced$token(
			$dillonkearns$elm_markdown$HtmlParser$toToken('-->'))));
var $dillonkearns$elm_markdown$HtmlParser$Declaration = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $dillonkearns$elm_markdown$HtmlParser$expectUppercaseCharacter = $elm$parser$Parser$Expecting('at least 1 uppercase character');
var $dillonkearns$elm_markdown$HtmlParser$allUppercase = $elm$parser$Parser$Advanced$getChompedString(
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2($elm$parser$Parser$Advanced$chompIf, $elm$core$Char$isUpper, $dillonkearns$elm_markdown$HtmlParser$expectUppercaseCharacter),
		$elm$parser$Parser$Advanced$chompWhile($elm$core$Char$isUpper)));
var $dillonkearns$elm_markdown$HtmlParser$oneOrMoreWhiteSpace = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$chompIf,
		$dillonkearns$elm_markdown$HtmlParser$isWhitespace,
		$elm$parser$Parser$Expecting('at least one whitespace')),
	$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isWhitespace));
var $dillonkearns$elm_markdown$HtmlParser$docType = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Declaration),
			$dillonkearns$elm_markdown$HtmlParser$symbol('<!')),
		A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$allUppercase, $dillonkearns$elm_markdown$HtmlParser$oneOrMoreWhiteSpace)),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('>')),
		$dillonkearns$elm_markdown$HtmlParser$symbol('>')));
var $dillonkearns$elm_markdown$HtmlParser$ProcessingInstruction = function (a) {
	return {$: 4, a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$processingInstruction = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$ProcessingInstruction),
		$dillonkearns$elm_markdown$HtmlParser$symbol('<?')),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('?>')),
		$dillonkearns$elm_markdown$HtmlParser$symbol('?>')));
var $dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar = function (c) {
	switch (c) {
		case '<':
			return false;
		case '&':
			return false;
		default:
			return true;
	}
};
var $dillonkearns$elm_markdown$HtmlParser$textNodeStringStepOptions = _List_fromArray(
	[
		A2(
		$elm$parser$Parser$Advanced$map,
		function (_v0) {
			return $elm$parser$Parser$Advanced$Loop(0);
		},
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$chompIf,
				$dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar,
				$elm$parser$Parser$Expecting('is not & or <')),
			$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar))),
		A2(
		$elm$parser$Parser$Advanced$map,
		function (_v1) {
			return $elm$parser$Parser$Advanced$Loop(0);
		},
		$dillonkearns$elm_markdown$HtmlParser$escapedChar('<')),
		$elm$parser$Parser$Advanced$succeed(
		$elm$parser$Parser$Advanced$Done(0))
	]);
var $dillonkearns$elm_markdown$HtmlParser$textNodeStringStep = function (_v0) {
	return $elm$parser$Parser$Advanced$oneOf($dillonkearns$elm_markdown$HtmlParser$textNodeStringStepOptions);
};
var $dillonkearns$elm_markdown$HtmlParser$textNodeString = $elm$parser$Parser$Advanced$getChompedString(
	A2($elm$parser$Parser$Advanced$loop, 0, $dillonkearns$elm_markdown$HtmlParser$textNodeStringStep));
var $dillonkearns$elm_markdown$HtmlParser$children = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$loop,
		_List_Nil,
		$dillonkearns$elm_markdown$HtmlParser$childrenStep(
			$dillonkearns$elm_markdown$HtmlParser$childrenStepOptions(startTagName)));
};
var $dillonkearns$elm_markdown$HtmlParser$childrenStepOptions = function (startTagName) {
	return _List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$map,
			F2(
				function (_v1, accum) {
					return $elm$parser$Parser$Advanced$Done(
						$elm$core$List$reverse(accum));
				}),
			$dillonkearns$elm_markdown$HtmlParser$closingTag(startTagName)),
			A2(
			$elm$parser$Parser$Advanced$andThen,
			function (text) {
				return $elm$core$String$isEmpty(text) ? A2(
					$elm$parser$Parser$Advanced$map,
					F2(
						function (_v2, accum) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(accum));
						}),
					$dillonkearns$elm_markdown$HtmlParser$closingTag(startTagName)) : $elm$parser$Parser$Advanced$succeed(
					function (accum) {
						return $elm$parser$Parser$Advanced$Loop(
							A2(
								$elm$core$List$cons,
								$dillonkearns$elm_markdown$HtmlParser$Text(text),
								accum));
					});
			},
			$dillonkearns$elm_markdown$HtmlParser$textNodeString),
			A2(
			$elm$parser$Parser$Advanced$map,
			F2(
				function (_new, accum) {
					return $elm$parser$Parser$Advanced$Loop(
						A2($elm$core$List$cons, _new, accum));
				}),
			$dillonkearns$elm_markdown$HtmlParser$cyclic$html())
		]);
};
var $dillonkearns$elm_markdown$HtmlParser$elementContinuation = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$dillonkearns$elm_markdown$HtmlParser$Element(startTagName)),
				$dillonkearns$elm_markdown$HtmlParser$whiteSpace),
			A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributes, $dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					$dillonkearns$elm_markdown$HtmlParser$symbol('/>')),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						$dillonkearns$elm_markdown$HtmlParser$symbol('>')),
					$dillonkearns$elm_markdown$HtmlParser$children(startTagName))
				])));
};
function $dillonkearns$elm_markdown$HtmlParser$cyclic$html() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$HtmlParser$Cdata, $dillonkearns$elm_markdown$HtmlParser$cdata),
				$dillonkearns$elm_markdown$HtmlParser$processingInstruction,
				$dillonkearns$elm_markdown$HtmlParser$comment,
				$dillonkearns$elm_markdown$HtmlParser$docType,
				$dillonkearns$elm_markdown$HtmlParser$cyclic$element()
			]));
}
function $dillonkearns$elm_markdown$HtmlParser$cyclic$element() {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$dillonkearns$elm_markdown$HtmlParser$symbol('<')),
		A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$HtmlParser$elementContinuation, $dillonkearns$elm_markdown$HtmlParser$tagName));
}
var $dillonkearns$elm_markdown$HtmlParser$html = $dillonkearns$elm_markdown$HtmlParser$cyclic$html();
$dillonkearns$elm_markdown$HtmlParser$cyclic$html = function () {
	return $dillonkearns$elm_markdown$HtmlParser$html;
};
var $dillonkearns$elm_markdown$HtmlParser$element = $dillonkearns$elm_markdown$HtmlParser$cyclic$element();
$dillonkearns$elm_markdown$HtmlParser$cyclic$element = function () {
	return $dillonkearns$elm_markdown$HtmlParser$element;
};
var $dillonkearns$elm_markdown$Parser$Token$tab = A2(
	$elm$parser$Parser$Advanced$Token,
	'\t',
	$elm$parser$Parser$Expecting('a tab'));
var $dillonkearns$elm_markdown$Markdown$Parser$exactlyFourSpaces = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$tab),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$backtrackable(
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space)),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'   ',
							$elm$parser$Parser$ExpectingSymbol('Indentation'))),
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							' \t',
							$elm$parser$Parser$ExpectingSymbol('Indentation'))),
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'  \t',
							$elm$parser$Parser$ExpectingSymbol('Indentation')))
					])))
		]));
var $dillonkearns$elm_markdown$Markdown$Parser$indentedCodeBlock = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock),
		$dillonkearns$elm_markdown$Markdown$Parser$exactlyFourSpaces),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $elm$core$Basics$modBy = _Basics_modBy;
var $dillonkearns$elm_markdown$Markdown$Helpers$isEven = function (_int) {
	return !A2($elm$core$Basics$modBy, 2, _int);
};
var $dillonkearns$elm_markdown$Markdown$Block$Loose = 0;
var $dillonkearns$elm_markdown$Markdown$Block$Tight = 1;
var $dillonkearns$elm_markdown$Markdown$Parser$isTightBoolToListDisplay = function (isTight) {
	return isTight ? 1 : 0;
};
var $dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith = F3(
	function (joinWith, string1, string2) {
		var _v0 = _Utils_Tuple2(string1, string2);
		if (_v0.a === '') {
			return string2;
		} else {
			if (_v0.b === '') {
				return string1;
			} else {
				return _Utils_ap(
					string1,
					_Utils_ap(joinWith, string2));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll = F2(
	function (string1, string2) {
		return string1 + ('\n' + string2);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$innerParagraphParser = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (rawLine, _v0) {
			return $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(rawLine);
		}),
	$dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd);
var $dillonkearns$elm_markdown$Markdown$Parser$openBlockOrParagraphParser = A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$Parser$innerParagraphParser, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
var $dillonkearns$elm_markdown$Markdown$OrderedList$ListItem = F4(
	function (order, intended, marker, body) {
		return {aC: body, cD: intended, cF: marker, cM: order};
	});
var $elm$parser$Parser$Advanced$getCol = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.bg, s);
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListEmptyItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (bodyStartPos) {
			return _Utils_Tuple2(bodyStartPos, '');
		}),
	A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getCol, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore = function (condition) {
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$chompIf,
			condition,
			$elm$parser$Parser$Problem('Expected one or more character')),
		$elm$parser$Parser$Advanced$chompWhile(condition));
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListItemBodyParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (bodyStartPos, item) {
						return _Utils_Tuple2(bodyStartPos, item);
					})),
			$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
		$elm$parser$Parser$Advanced$getCol),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$OrderedList$Dot = 0;
var $dillonkearns$elm_markdown$Markdown$OrderedList$Paren = 1;
var $dillonkearns$elm_markdown$Parser$Token$closingParen = A2(
	$elm$parser$Parser$Advanced$Token,
	')',
	$elm$parser$Parser$Expecting('a `)`'));
var $dillonkearns$elm_markdown$Parser$Token$dot = A2(
	$elm$parser$Parser$Advanced$Token,
	'.',
	$elm$parser$Parser$Expecting('a `.`'));
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListMarkerParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(0),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$dot)),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$closingParen))
		]));
var $dillonkearns$elm_markdown$Parser$Extra$positiveInteger = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($elm$core$Char$isDigit));
var $dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (parsed) {
		return (parsed <= 999999999) ? $elm$parser$Parser$Advanced$succeed(parsed) : $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Starting numbers must be nine digits or less.'));
	},
	$dillonkearns$elm_markdown$Parser$Extra$positiveInteger);
var $dillonkearns$elm_markdown$Whitespace$space = $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$space);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $dillonkearns$elm_markdown$Parser$Extra$upTo = F2(
	function (n, parser) {
		var _v0 = A2($elm$core$List$repeat, n, parser);
		if (!_v0.b) {
			return $elm$parser$Parser$Advanced$succeed(0);
		} else {
			var firstParser = _v0.a;
			var remainingParsers = _v0.b;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (p, parsers) {
						return $elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									A2($elm$parser$Parser$Advanced$ignorer, p, parsers),
									$elm$parser$Parser$Advanced$succeed(0)
								]));
					}),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							firstParser,
							$elm$parser$Parser$Advanced$succeed(0)
						])),
				remainingParsers);
		}
	});
var $dillonkearns$elm_markdown$Markdown$OrderedList$validateStartsWith1 = function (parsed) {
	if (parsed === 1) {
		return $elm$parser$Parser$Advanced$succeed(parsed);
	} else {
		return $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Lists inside a paragraph or after a paragraph without a blank line must start with 1'));
	}
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListOrderParser = function (previousWasBody) {
	return previousWasBody ? A2(
		$elm$parser$Parser$Advanced$andThen,
		$dillonkearns$elm_markdown$Markdown$OrderedList$validateStartsWith1,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				A2($dillonkearns$elm_markdown$Parser$Extra$upTo, 3, $dillonkearns$elm_markdown$Whitespace$space)),
			$dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits)) : A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			A2($dillonkearns$elm_markdown$Parser$Extra$upTo, 3, $dillonkearns$elm_markdown$Whitespace$space)),
		$dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits);
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$parser = function (previousWasBody) {
	var parseSubsequentItem = F5(
		function (start, order, marker, mid, _v0) {
			var end = _v0.a;
			var body = _v0.b;
			return ((end - mid) <= 4) ? A4($dillonkearns$elm_markdown$Markdown$OrderedList$ListItem, order, end - start, marker, body) : A4(
				$dillonkearns$elm_markdown$Markdown$OrderedList$ListItem,
				order,
				(mid - start) + 1,
				marker,
				_Utils_ap(
					A2($elm$core$String$repeat, (end - mid) - 1, ' '),
					body));
		});
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(parseSubsequentItem),
						$elm$parser$Parser$Advanced$getCol),
					$elm$parser$Parser$Advanced$backtrackable(
						$dillonkearns$elm_markdown$Markdown$OrderedList$orderedListOrderParser(previousWasBody))),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$OrderedList$orderedListMarkerParser)),
			$elm$parser$Parser$Advanced$getCol),
		previousWasBody ? $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListItemBodyParser : $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[$dillonkearns$elm_markdown$Markdown$OrderedList$orderedListEmptyItemParser, $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListItemBodyParser])));
};
var $dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock = function (previousWasBody) {
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (item) {
			return A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, true, item.cD, item.cF, item.cM, _List_Nil, item.aC);
		},
		$dillonkearns$elm_markdown$Markdown$OrderedList$parser(previousWasBody));
};
var $dillonkearns$elm_markdown$Markdown$Inline$CodeInline = function (a) {
	return {$: 2, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$HardLineBreak = {$: 1};
var $dillonkearns$elm_markdown$Markdown$Inline$HtmlInline = function (a) {
	return {$: 5, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$Image = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Inline$Link = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Inline$Strikethrough = function (a) {
	return {$: 7, a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$Text = function (a) {
	return {$: 0, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$matchToInline = function (_v0) {
	var match = _v0;
	var _v1 = match.j;
	switch (_v1.$) {
		case 0:
			return $dillonkearns$elm_markdown$Markdown$Inline$Text(match.M);
		case 1:
			return $dillonkearns$elm_markdown$Markdown$Inline$HardLineBreak;
		case 2:
			return $dillonkearns$elm_markdown$Markdown$Inline$CodeInline(match.M);
		case 3:
			var _v2 = _v1.a;
			var text = _v2.a;
			var url = _v2.b;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Inline$Link,
				url,
				$elm$core$Maybe$Nothing,
				_List_fromArray(
					[
						$dillonkearns$elm_markdown$Markdown$Inline$Text(text)
					]));
		case 4:
			var _v3 = _v1.a;
			var url = _v3.a;
			var maybeTitle = _v3.b;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Inline$Link,
				url,
				maybeTitle,
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.o));
		case 5:
			var _v4 = _v1.a;
			var url = _v4.a;
			var maybeTitle = _v4.b;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Inline$Image,
				url,
				maybeTitle,
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.o));
		case 6:
			var model = _v1.a;
			return $dillonkearns$elm_markdown$Markdown$Inline$HtmlInline(model);
		case 7:
			var length = _v1.a;
			return A2(
				$dillonkearns$elm_markdown$Markdown$Inline$Emphasis,
				length,
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.o));
		default:
			return $dillonkearns$elm_markdown$Markdown$Inline$Strikethrough(
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.o));
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines = function (matches) {
	return A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$InlineParser$matchToInline, matches);
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$Match = $elm$core$Basics$identity;
var $dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch = F2(
	function (parentMatch, childMatch) {
		return {g: childMatch.g - parentMatch.q, o: childMatch.o, i: childMatch.i - parentMatch.q, M: childMatch.M, t: childMatch.t - parentMatch.q, q: childMatch.q - parentMatch.q, j: childMatch.j};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$addChild = F2(
	function (parentMatch, childMatch) {
		return {
			g: parentMatch.g,
			o: A2(
				$elm$core$List$cons,
				A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch, parentMatch, childMatch),
				parentMatch.o),
			i: parentMatch.i,
			M: parentMatch.M,
			t: parentMatch.t,
			q: parentMatch.q,
			j: parentMatch.j
		};
	});
var $elm$core$List$sortBy = _List_sortBy;
var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren = function (_v4) {
	var match = _v4;
	return {
		g: match.g,
		o: $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches(match.o),
		i: match.i,
		M: match.M,
		t: match.t,
		q: match.q,
		j: match.j
	};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches = function (matches) {
	var _v2 = A2(
		$elm$core$List$sortBy,
		function (_v3) {
			var match = _v3;
			return match.i;
		},
		matches);
	if (!_v2.b) {
		return _List_Nil;
	} else {
		var first = _v2.a;
		var rest = _v2.b;
		return A3($dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatchesHelp, rest, first, _List_Nil);
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatchesHelp = F3(
	function (remaining, _v0, matchesTail) {
		organizeMatchesHelp:
		while (true) {
			var prevMatch = _v0;
			if (!remaining.b) {
				return A2(
					$elm$core$List$cons,
					$dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren(prevMatch),
					matchesTail);
			} else {
				var match = remaining.a;
				var rest = remaining.b;
				if (_Utils_cmp(prevMatch.g, match.i) < 1) {
					var $temp$remaining = rest,
						$temp$_v0 = match,
						$temp$matchesTail = A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren(prevMatch),
						matchesTail);
					remaining = $temp$remaining;
					_v0 = $temp$_v0;
					matchesTail = $temp$matchesTail;
					continue organizeMatchesHelp;
				} else {
					if ((_Utils_cmp(prevMatch.i, match.i) < 0) && (_Utils_cmp(prevMatch.g, match.g) > 0)) {
						var $temp$remaining = rest,
							$temp$_v0 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$addChild, prevMatch, match),
							$temp$matchesTail = matchesTail;
						remaining = $temp$remaining;
						_v0 = $temp$_v0;
						matchesTail = $temp$matchesTail;
						continue organizeMatchesHelp;
					} else {
						var $temp$remaining = rest,
							$temp$_v0 = prevMatch,
							$temp$matchesTail = matchesTail;
						remaining = $temp$remaining;
						_v0 = $temp$_v0;
						matchesTail = $temp$matchesTail;
						continue organizeMatchesHelp;
					}
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$NormalType = {$: 0};
var $dillonkearns$elm_markdown$Markdown$Helpers$containsAmpersand = function (string) {
	return A2($elm$core$String$contains, '&', string);
};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {c: index, bB: match, cI: number, b4: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{ci: false, cG: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $dillonkearns$elm_markdown$Markdown$Entity$decimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#([0-9]{1,8});'));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $dillonkearns$elm_markdown$Markdown$Entity$isBadEndUnicode = function (_int) {
	var remain_ = A2($elm$core$Basics$modBy, 16, _int);
	var remain = A2($elm$core$Basics$modBy, 131070, _int);
	return (_int >= 131070) && ((((0 <= remain) && (remain <= 15)) || ((65536 <= remain) && (remain <= 65551))) && ((remain_ === 14) || (remain_ === 15)));
};
var $dillonkearns$elm_markdown$Markdown$Entity$isValidUnicode = function (_int) {
	return (_int === 9) || ((_int === 10) || ((_int === 13) || ((_int === 133) || (((32 <= _int) && (_int <= 126)) || (((160 <= _int) && (_int <= 55295)) || (((57344 <= _int) && (_int <= 64975)) || (((65008 <= _int) && (_int <= 65533)) || ((65536 <= _int) && (_int <= 1114109)))))))));
};
var $dillonkearns$elm_markdown$Markdown$Entity$validUnicode = function (_int) {
	return ($dillonkearns$elm_markdown$Markdown$Entity$isValidUnicode(_int) && (!$dillonkearns$elm_markdown$Markdown$Entity$isBadEndUnicode(_int))) ? $elm$core$String$fromChar(
		$elm$core$Char$fromCode(_int)) : $elm$core$String$fromChar(
		$elm$core$Char$fromCode(65533));
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimal = function (match) {
	var _v0 = match.b4;
	if (_v0.b && (!_v0.a.$)) {
		var first = _v0.a.a;
		var _v1 = $elm$core$String$toInt(first);
		if (!_v1.$) {
			var v = _v1.a;
			return $dillonkearns$elm_markdown$Markdown$Entity$validUnicode(v);
		} else {
			return match.bB;
		}
	} else {
		return match.bB;
	}
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimals = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$decimalRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimal);
var $dillonkearns$elm_markdown$Markdown$Entity$entitiesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&([0-9a-zA-Z]+);'));
var $dillonkearns$elm_markdown$Markdown$Entity$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('quot', 34),
			_Utils_Tuple2('amp', 38),
			_Utils_Tuple2('apos', 39),
			_Utils_Tuple2('lt', 60),
			_Utils_Tuple2('gt', 62),
			_Utils_Tuple2('nbsp', 160),
			_Utils_Tuple2('iexcl', 161),
			_Utils_Tuple2('cent', 162),
			_Utils_Tuple2('pound', 163),
			_Utils_Tuple2('curren', 164),
			_Utils_Tuple2('yen', 165),
			_Utils_Tuple2('brvbar', 166),
			_Utils_Tuple2('sect', 167),
			_Utils_Tuple2('uml', 168),
			_Utils_Tuple2('copy', 169),
			_Utils_Tuple2('ordf', 170),
			_Utils_Tuple2('laquo', 171),
			_Utils_Tuple2('not', 172),
			_Utils_Tuple2('shy', 173),
			_Utils_Tuple2('reg', 174),
			_Utils_Tuple2('macr', 175),
			_Utils_Tuple2('deg', 176),
			_Utils_Tuple2('plusmn', 177),
			_Utils_Tuple2('sup2', 178),
			_Utils_Tuple2('sup3', 179),
			_Utils_Tuple2('acute', 180),
			_Utils_Tuple2('micro', 181),
			_Utils_Tuple2('para', 182),
			_Utils_Tuple2('middot', 183),
			_Utils_Tuple2('cedil', 184),
			_Utils_Tuple2('sup1', 185),
			_Utils_Tuple2('ordm', 186),
			_Utils_Tuple2('raquo', 187),
			_Utils_Tuple2('frac14', 188),
			_Utils_Tuple2('frac12', 189),
			_Utils_Tuple2('frac34', 190),
			_Utils_Tuple2('iquest', 191),
			_Utils_Tuple2('Agrave', 192),
			_Utils_Tuple2('Aacute', 193),
			_Utils_Tuple2('Acirc', 194),
			_Utils_Tuple2('Atilde', 195),
			_Utils_Tuple2('Auml', 196),
			_Utils_Tuple2('Aring', 197),
			_Utils_Tuple2('AElig', 198),
			_Utils_Tuple2('Ccedil', 199),
			_Utils_Tuple2('Egrave', 200),
			_Utils_Tuple2('Eacute', 201),
			_Utils_Tuple2('Ecirc', 202),
			_Utils_Tuple2('Euml', 203),
			_Utils_Tuple2('Igrave', 204),
			_Utils_Tuple2('Iacute', 205),
			_Utils_Tuple2('Icirc', 206),
			_Utils_Tuple2('Iuml', 207),
			_Utils_Tuple2('ETH', 208),
			_Utils_Tuple2('Ntilde', 209),
			_Utils_Tuple2('Ograve', 210),
			_Utils_Tuple2('Oacute', 211),
			_Utils_Tuple2('Ocirc', 212),
			_Utils_Tuple2('Otilde', 213),
			_Utils_Tuple2('Ouml', 214),
			_Utils_Tuple2('times', 215),
			_Utils_Tuple2('Oslash', 216),
			_Utils_Tuple2('Ugrave', 217),
			_Utils_Tuple2('Uacute', 218),
			_Utils_Tuple2('Ucirc', 219),
			_Utils_Tuple2('Uuml', 220),
			_Utils_Tuple2('Yacute', 221),
			_Utils_Tuple2('THORN', 222),
			_Utils_Tuple2('szlig', 223),
			_Utils_Tuple2('agrave', 224),
			_Utils_Tuple2('aacute', 225),
			_Utils_Tuple2('acirc', 226),
			_Utils_Tuple2('atilde', 227),
			_Utils_Tuple2('auml', 228),
			_Utils_Tuple2('aring', 229),
			_Utils_Tuple2('aelig', 230),
			_Utils_Tuple2('ccedil', 231),
			_Utils_Tuple2('egrave', 232),
			_Utils_Tuple2('eacute', 233),
			_Utils_Tuple2('ecirc', 234),
			_Utils_Tuple2('euml', 235),
			_Utils_Tuple2('igrave', 236),
			_Utils_Tuple2('iacute', 237),
			_Utils_Tuple2('icirc', 238),
			_Utils_Tuple2('iuml', 239),
			_Utils_Tuple2('eth', 240),
			_Utils_Tuple2('ntilde', 241),
			_Utils_Tuple2('ograve', 242),
			_Utils_Tuple2('oacute', 243),
			_Utils_Tuple2('ocirc', 244),
			_Utils_Tuple2('otilde', 245),
			_Utils_Tuple2('ouml', 246),
			_Utils_Tuple2('divide', 247),
			_Utils_Tuple2('oslash', 248),
			_Utils_Tuple2('ugrave', 249),
			_Utils_Tuple2('uacute', 250),
			_Utils_Tuple2('ucirc', 251),
			_Utils_Tuple2('uuml', 252),
			_Utils_Tuple2('yacute', 253),
			_Utils_Tuple2('thorn', 254),
			_Utils_Tuple2('yuml', 255),
			_Utils_Tuple2('OElig', 338),
			_Utils_Tuple2('oelig', 339),
			_Utils_Tuple2('Scaron', 352),
			_Utils_Tuple2('scaron', 353),
			_Utils_Tuple2('Yuml', 376),
			_Utils_Tuple2('fnof', 402),
			_Utils_Tuple2('circ', 710),
			_Utils_Tuple2('tilde', 732),
			_Utils_Tuple2('Alpha', 913),
			_Utils_Tuple2('Beta', 914),
			_Utils_Tuple2('Gamma', 915),
			_Utils_Tuple2('Delta', 916),
			_Utils_Tuple2('Epsilon', 917),
			_Utils_Tuple2('Zeta', 918),
			_Utils_Tuple2('Eta', 919),
			_Utils_Tuple2('Theta', 920),
			_Utils_Tuple2('Iota', 921),
			_Utils_Tuple2('Kappa', 922),
			_Utils_Tuple2('Lambda', 923),
			_Utils_Tuple2('Mu', 924),
			_Utils_Tuple2('Nu', 925),
			_Utils_Tuple2('Xi', 926),
			_Utils_Tuple2('Omicron', 927),
			_Utils_Tuple2('Pi', 928),
			_Utils_Tuple2('Rho', 929),
			_Utils_Tuple2('Sigma', 931),
			_Utils_Tuple2('Tau', 932),
			_Utils_Tuple2('Upsilon', 933),
			_Utils_Tuple2('Phi', 934),
			_Utils_Tuple2('Chi', 935),
			_Utils_Tuple2('Psi', 936),
			_Utils_Tuple2('Omega', 937),
			_Utils_Tuple2('alpha', 945),
			_Utils_Tuple2('beta', 946),
			_Utils_Tuple2('gamma', 947),
			_Utils_Tuple2('delta', 948),
			_Utils_Tuple2('epsilon', 949),
			_Utils_Tuple2('zeta', 950),
			_Utils_Tuple2('eta', 951),
			_Utils_Tuple2('theta', 952),
			_Utils_Tuple2('iota', 953),
			_Utils_Tuple2('kappa', 954),
			_Utils_Tuple2('lambda', 955),
			_Utils_Tuple2('mu', 956),
			_Utils_Tuple2('nu', 957),
			_Utils_Tuple2('xi', 958),
			_Utils_Tuple2('omicron', 959),
			_Utils_Tuple2('pi', 960),
			_Utils_Tuple2('rho', 961),
			_Utils_Tuple2('sigmaf', 962),
			_Utils_Tuple2('sigma', 963),
			_Utils_Tuple2('tau', 964),
			_Utils_Tuple2('upsilon', 965),
			_Utils_Tuple2('phi', 966),
			_Utils_Tuple2('chi', 967),
			_Utils_Tuple2('psi', 968),
			_Utils_Tuple2('omega', 969),
			_Utils_Tuple2('thetasym', 977),
			_Utils_Tuple2('upsih', 978),
			_Utils_Tuple2('piv', 982),
			_Utils_Tuple2('ensp', 8194),
			_Utils_Tuple2('emsp', 8195),
			_Utils_Tuple2('thinsp', 8201),
			_Utils_Tuple2('zwnj', 8204),
			_Utils_Tuple2('zwj', 8205),
			_Utils_Tuple2('lrm', 8206),
			_Utils_Tuple2('rlm', 8207),
			_Utils_Tuple2('ndash', 8211),
			_Utils_Tuple2('mdash', 8212),
			_Utils_Tuple2('lsquo', 8216),
			_Utils_Tuple2('rsquo', 8217),
			_Utils_Tuple2('sbquo', 8218),
			_Utils_Tuple2('ldquo', 8220),
			_Utils_Tuple2('rdquo', 8221),
			_Utils_Tuple2('bdquo', 8222),
			_Utils_Tuple2('dagger', 8224),
			_Utils_Tuple2('Dagger', 8225),
			_Utils_Tuple2('bull', 8226),
			_Utils_Tuple2('hellip', 8230),
			_Utils_Tuple2('permil', 8240),
			_Utils_Tuple2('prime', 8242),
			_Utils_Tuple2('Prime', 8243),
			_Utils_Tuple2('lsaquo', 8249),
			_Utils_Tuple2('rsaquo', 8250),
			_Utils_Tuple2('oline', 8254),
			_Utils_Tuple2('frasl', 8260),
			_Utils_Tuple2('euro', 8364),
			_Utils_Tuple2('image', 8465),
			_Utils_Tuple2('weierp', 8472),
			_Utils_Tuple2('real', 8476),
			_Utils_Tuple2('trade', 8482),
			_Utils_Tuple2('alefsym', 8501),
			_Utils_Tuple2('larr', 8592),
			_Utils_Tuple2('uarr', 8593),
			_Utils_Tuple2('rarr', 8594),
			_Utils_Tuple2('darr', 8595),
			_Utils_Tuple2('harr', 8596),
			_Utils_Tuple2('crarr', 8629),
			_Utils_Tuple2('lArr', 8656),
			_Utils_Tuple2('uArr', 8657),
			_Utils_Tuple2('rArr', 8658),
			_Utils_Tuple2('dArr', 8659),
			_Utils_Tuple2('hArr', 8660),
			_Utils_Tuple2('forall', 8704),
			_Utils_Tuple2('part', 8706),
			_Utils_Tuple2('exist', 8707),
			_Utils_Tuple2('empty', 8709),
			_Utils_Tuple2('nabla', 8711),
			_Utils_Tuple2('isin', 8712),
			_Utils_Tuple2('notin', 8713),
			_Utils_Tuple2('ni', 8715),
			_Utils_Tuple2('prod', 8719),
			_Utils_Tuple2('sum', 8721),
			_Utils_Tuple2('minus', 8722),
			_Utils_Tuple2('lowast', 8727),
			_Utils_Tuple2('radic', 8730),
			_Utils_Tuple2('prop', 8733),
			_Utils_Tuple2('infin', 8734),
			_Utils_Tuple2('ang', 8736),
			_Utils_Tuple2('and', 8743),
			_Utils_Tuple2('or', 8744),
			_Utils_Tuple2('cap', 8745),
			_Utils_Tuple2('cup', 8746),
			_Utils_Tuple2('int', 8747),
			_Utils_Tuple2('there4', 8756),
			_Utils_Tuple2('sim', 8764),
			_Utils_Tuple2('cong', 8773),
			_Utils_Tuple2('asymp', 8776),
			_Utils_Tuple2('ne', 8800),
			_Utils_Tuple2('equiv', 8801),
			_Utils_Tuple2('le', 8804),
			_Utils_Tuple2('ge', 8805),
			_Utils_Tuple2('sub', 8834),
			_Utils_Tuple2('sup', 8835),
			_Utils_Tuple2('nsub', 8836),
			_Utils_Tuple2('sube', 8838),
			_Utils_Tuple2('supe', 8839),
			_Utils_Tuple2('oplus', 8853),
			_Utils_Tuple2('otimes', 8855),
			_Utils_Tuple2('perp', 8869),
			_Utils_Tuple2('sdot', 8901),
			_Utils_Tuple2('lceil', 8968),
			_Utils_Tuple2('rceil', 8969),
			_Utils_Tuple2('lfloor', 8970),
			_Utils_Tuple2('rfloor', 8971),
			_Utils_Tuple2('lang', 9001),
			_Utils_Tuple2('rang', 9002),
			_Utils_Tuple2('loz', 9674),
			_Utils_Tuple2('spades', 9824),
			_Utils_Tuple2('clubs', 9827),
			_Utils_Tuple2('hearts', 9829),
			_Utils_Tuple2('diams', 9830)
		]));
var $dillonkearns$elm_markdown$Markdown$Entity$replaceEntity = function (match) {
	var _v0 = match.b4;
	if (_v0.b && (!_v0.a.$)) {
		var first = _v0.a.a;
		var _v1 = A2($elm$core$Dict$get, first, $dillonkearns$elm_markdown$Markdown$Entity$entities);
		if (!_v1.$) {
			var code = _v1.a;
			return $elm$core$String$fromChar(
				$elm$core$Char$fromCode(code));
		} else {
			return match.bB;
		}
	} else {
		return match.bB;
	}
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceEntities = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$entitiesRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceEntity);
var $dillonkearns$elm_markdown$Markdown$Helpers$escapableRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\+)([!\"#$%&\\\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-])'));
var $dillonkearns$elm_markdown$Markdown$Helpers$replaceEscapable = A2(
	$elm$regex$Regex$replace,
	$dillonkearns$elm_markdown$Markdown$Helpers$escapableRegex,
	function (regexMatch) {
		var _v0 = regexMatch.b4;
		if (((_v0.b && (!_v0.a.$)) && _v0.b.b) && (!_v0.b.a.$)) {
			var backslashes = _v0.a.a;
			var _v1 = _v0.b;
			var escapedStr = _v1.a.a;
			return _Utils_ap(
				A2(
					$elm$core$String$repeat,
					($elm$core$String$length(backslashes) / 2) | 0,
					'\\'),
				escapedStr);
		} else {
			return regexMatch.bB;
		}
	});
var $dillonkearns$elm_markdown$Markdown$Entity$hexadecimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#[Xx]([0-9a-fA-F]{1,8});'));
var $elm$core$String$foldl = _String_foldl;
var $dillonkearns$elm_markdown$Markdown$Entity$hexToInt = function (string) {
	var folder = F2(
		function (hexDigit, _int) {
			return ((_int * 16) + A2(
				$elm$core$Basics$modBy,
				39,
				$elm$core$Char$toCode(hexDigit))) - 9;
		});
	return A3(
		$elm$core$String$foldl,
		folder,
		0,
		$elm$core$String$toLower(string));
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimal = function (match) {
	var _v0 = match.b4;
	if (_v0.b && (!_v0.a.$)) {
		var first = _v0.a.a;
		return $dillonkearns$elm_markdown$Markdown$Entity$validUnicode(
			$dillonkearns$elm_markdown$Markdown$Entity$hexToInt(first));
	} else {
		return match.bB;
	}
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimals = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$hexadecimalRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimal);
var $dillonkearns$elm_markdown$Markdown$Helpers$formatStr = function (str) {
	var withEscapes = $dillonkearns$elm_markdown$Markdown$Helpers$replaceEscapable(str);
	return $dillonkearns$elm_markdown$Markdown$Helpers$containsAmpersand(withEscapes) ? $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimals(
		$dillonkearns$elm_markdown$Markdown$Entity$replaceDecimals(
			$dillonkearns$elm_markdown$Markdown$Entity$replaceEntities(withEscapes))) : withEscapes;
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch = function (text) {
	return {
		g: 0,
		o: _List_Nil,
		i: 0,
		M: $dillonkearns$elm_markdown$Markdown$Helpers$formatStr(text),
		t: 0,
		q: 0,
		j: $dillonkearns$elm_markdown$Markdown$InlineParser$NormalType
	};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatch = F3(
	function (rawText, _v2, parsedMatches) {
		var matchModel = _v2;
		var updtMatch = {
			g: matchModel.g,
			o: A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches, matchModel.M, _List_Nil, matchModel.o),
			i: matchModel.i,
			M: matchModel.M,
			t: matchModel.t,
			q: matchModel.q,
			j: matchModel.j
		};
		if (!parsedMatches.b) {
			var finalStr = A2($elm$core$String$dropLeft, matchModel.g, rawText);
			return $elm$core$String$isEmpty(finalStr) ? _List_fromArray(
				[updtMatch]) : _List_fromArray(
				[
					updtMatch,
					$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(finalStr)
				]);
		} else {
			var matchHead = parsedMatches.a;
			var _v4 = matchHead.j;
			if (!_v4.$) {
				return A2($elm$core$List$cons, updtMatch, parsedMatches);
			} else {
				return _Utils_eq(matchModel.g, matchHead.i) ? A2($elm$core$List$cons, updtMatch, parsedMatches) : ((_Utils_cmp(matchModel.g, matchHead.i) < 0) ? A2(
					$elm$core$List$cons,
					updtMatch,
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(
							A3($elm$core$String$slice, matchModel.g, matchHead.i, rawText)),
						parsedMatches)) : parsedMatches);
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches = F3(
	function (rawText, parsedMatches, matches) {
		parseTextMatches:
		while (true) {
			if (!matches.b) {
				if (!parsedMatches.b) {
					return $elm$core$String$isEmpty(rawText) ? _List_Nil : _List_fromArray(
						[
							$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(rawText)
						]);
				} else {
					var matchModel = parsedMatches.a;
					return (matchModel.i > 0) ? A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(
							A2($elm$core$String$left, matchModel.i, rawText)),
						parsedMatches) : parsedMatches;
				}
			} else {
				var match = matches.a;
				var matchesTail = matches.b;
				var $temp$rawText = rawText,
					$temp$parsedMatches = A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatch, rawText, match, parsedMatches),
					$temp$matches = matchesTail;
				rawText = $temp$rawText;
				parsedMatches = $temp$parsedMatches;
				matches = $temp$matches;
				continue parseTextMatches;
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$cleanAngleBracketTokens = F3(
	function (tokensL, tokensR, countL) {
		cleanAngleBracketTokens:
		while (true) {
			if (!tokensR.b) {
				return _List_Nil;
			} else {
				var hd1 = tokensR.a;
				var rest1 = tokensR.b;
				if (!tokensL.b) {
					if (countL > 1) {
						var $temp$tokensL = tokensL,
							$temp$tokensR = rest1,
							$temp$countL = countL - 1;
						tokensL = $temp$tokensL;
						tokensR = $temp$tokensR;
						countL = $temp$countL;
						continue cleanAngleBracketTokens;
					} else {
						if (countL === 1) {
							return A2(
								$elm$core$List$cons,
								hd1,
								A3($dillonkearns$elm_markdown$Markdown$InlineParser$cleanAngleBracketTokens, tokensL, rest1, countL - 1));
						} else {
							var $temp$tokensL = tokensL,
								$temp$tokensR = rest1,
								$temp$countL = 0;
							tokensL = $temp$tokensL;
							tokensR = $temp$tokensR;
							countL = $temp$countL;
							continue cleanAngleBracketTokens;
						}
					}
				} else {
					var hd = tokensL.a;
					var rest = tokensL.b;
					if (_Utils_cmp(hd.c, hd1.c) < 0) {
						if (!countL) {
							return A2(
								$elm$core$List$cons,
								hd,
								A3($dillonkearns$elm_markdown$Markdown$InlineParser$cleanAngleBracketTokens, rest, tokensR, countL + 1));
						} else {
							var $temp$tokensL = rest,
								$temp$tokensR = tokensR,
								$temp$countL = countL + 1;
							tokensL = $temp$tokensL;
							tokensR = $temp$tokensR;
							countL = $temp$countL;
							continue cleanAngleBracketTokens;
						}
					} else {
						if (countL > 1) {
							var $temp$tokensL = tokensL,
								$temp$tokensR = rest1,
								$temp$countL = countL - 1;
							tokensL = $temp$tokensL;
							tokensR = $temp$tokensR;
							countL = $temp$countL;
							continue cleanAngleBracketTokens;
						} else {
							if (countL === 1) {
								return A2(
									$elm$core$List$cons,
									hd1,
									A3($dillonkearns$elm_markdown$Markdown$InlineParser$cleanAngleBracketTokens, tokensL, rest1, countL - 1));
							} else {
								var $temp$tokensL = tokensL,
									$temp$tokensR = rest1,
									$temp$countL = 0;
								tokensL = $temp$tokensL;
								tokensR = $temp$tokensR;
								countL = $temp$countL;
								continue cleanAngleBracketTokens;
							}
						}
					}
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\<)'));
var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketOpen = {$: 4};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken = function (regMatch) {
	var _v0 = regMatch.b4;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{c: regMatch.c + backslashesLength, aO: 1, e: $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketOpen}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\>)'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose = function (a) {
	return {$: 5, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$Escaped = 0;
var $dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped = 1;
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken = function (regMatch) {
	var _v0 = regMatch.b4;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				c: regMatch.c + backslashesLength,
				aO: 1,
				e: $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose(1) : $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose(0)
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^*])?(\\*+)([^*])?'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisToken = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isPunctuation = function (c) {
	switch (c) {
		case '!':
			return true;
		case '\"':
			return true;
		case '#':
			return true;
		case '%':
			return true;
		case '&':
			return true;
		case '\'':
			return true;
		case '(':
			return true;
		case ')':
			return true;
		case '*':
			return true;
		case ',':
			return true;
		case '-':
			return true;
		case '.':
			return true;
		case '/':
			return true;
		case ':':
			return true;
		case ';':
			return true;
		case '?':
			return true;
		case '@':
			return true;
		case '[':
			return true;
		case ']':
			return true;
		case '_':
			return true;
		case '{':
			return true;
		case '}':
			return true;
		case '~':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$containPunctuation = A2(
	$elm$core$String$foldl,
	F2(
		function (c, accum) {
			return accum || $dillonkearns$elm_markdown$Markdown$InlineParser$isPunctuation(c);
		}),
	false);
var $dillonkearns$elm_markdown$Markdown$InlineParser$isWhitespace = function (c) {
	switch (c) {
		case ' ':
			return true;
		case '\u000C':
			return true;
		case '\n':
			return true;
		case '\u000D':
			return true;
		case '\t':
			return true;
		case '\u000B':
			return true;
		case '\u00A0':
			return true;
		case '\u2028':
			return true;
		case '\u2029':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$containSpace = A2(
	$elm$core$String$foldl,
	F2(
		function (c, accum) {
			return accum || $dillonkearns$elm_markdown$Markdown$InlineParser$isWhitespace(c);
		}),
	false);
var $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank = function (mstring) {
	if (!mstring.$) {
		var string = mstring.a;
		return ($elm$core$String$isEmpty(string) || $dillonkearns$elm_markdown$Markdown$InlineParser$containSpace(string)) ? 0 : ($dillonkearns$elm_markdown$Markdown$InlineParser$containPunctuation(string) ? 1 : 2);
	} else {
		return 0;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken = F3(
	function (_char, rawText, regMatch) {
		var _v0 = regMatch.b4;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.a.$)) && _v0.b.b.b.b) {
			var maybeBackslashes = _v0.a;
			var _v1 = _v0.b;
			var maybeLeftFringe = _v1.a;
			var _v2 = _v1.b;
			var delimiter = _v2.a.a;
			var _v3 = _v2.b;
			var maybeRightFringe = _v3.a;
			var rFringeRank = $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank(maybeRightFringe);
			var leftFringeLength = function () {
				if (!maybeLeftFringe.$) {
					var left = maybeLeftFringe.a;
					return $elm$core$String$length(left);
				} else {
					return 0;
				}
			}();
			var mLeftFringe = ((!(!regMatch.c)) && (!leftFringeLength)) ? $elm$core$Maybe$Just(
				A3($elm$core$String$slice, regMatch.c - 1, regMatch.c, rawText)) : maybeLeftFringe;
			var backslashesLength = function () {
				if (!maybeBackslashes.$) {
					var backslashes = maybeBackslashes.a;
					return $elm$core$String$length(backslashes);
				} else {
					return 0;
				}
			}();
			var isEscaped = ((!$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength)) && (!leftFringeLength)) || function () {
				if ((!mLeftFringe.$) && (mLeftFringe.a === '\\')) {
					return true;
				} else {
					return false;
				}
			}();
			var delimiterLength = isEscaped ? ($elm$core$String$length(delimiter) - 1) : $elm$core$String$length(delimiter);
			var lFringeRank = isEscaped ? 1 : $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank(mLeftFringe);
			if ((delimiterLength <= 0) || ((_char === '_') && ((lFringeRank === 2) && (rFringeRank === 2)))) {
				return $elm$core$Maybe$Nothing;
			} else {
				var index = ((regMatch.c + backslashesLength) + leftFringeLength) + (isEscaped ? 1 : 0);
				return $elm$core$Maybe$Just(
					{
						c: index,
						aO: delimiterLength,
						e: A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisToken,
							_char,
							{aq: lFringeRank, au: rFringeRank})
					});
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2($dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken, '*', str),
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$codeTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\`+)'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken = function (a) {
	return {$: 0, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToCodeToken = function (regMatch) {
	var _v0 = regMatch.b4;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backtick = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				c: regMatch.c + backslashesLength,
				aO: $elm$core$String$length(backtick),
				e: $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken(1) : $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken(0)
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findCodeTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToCodeToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$codeTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( {2,}))\\n'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken = {$: 8};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken = function (regMatch) {
	var _v0 = regMatch.b4;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (!_v0.a.$) {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return (!$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength)) ? $elm$core$Maybe$Just(
					{c: (regMatch.c + backslashesLength) - 1, aO: 2, e: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Nothing;
			} else {
				if (_v0.b.b && (!_v0.b.a.$)) {
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(
						{
							c: regMatch.c,
							aO: $elm$core$String$length(regMatch.bB),
							e: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken = function (regMatch) {
	var _v0 = regMatch.b4;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (!_v0.a.$) {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
					{c: regMatch.c + backslashesLength, aO: 1, e: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Just(
					{c: (regMatch.c + backslashesLength) - 1, aO: 2, e: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken});
			} else {
				if (_v0.b.b) {
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(
						{
							c: regMatch.c,
							aO: $elm$core$String$length(regMatch.bB),
							e: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreak = false;
var $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( *))\\n'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$findHardBreakTokens = function (str) {
	return $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreak ? A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex, str)) : A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\])'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$SquareBracketClose = {$: 3};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken = function (regMatch) {
	var _v0 = regMatch.b4;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{c: regMatch.c + backslashesLength, aO: 1, e: $dillonkearns$elm_markdown$Markdown$InlineParser$SquareBracketClose}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\!)?(\\[)'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$Active = 0;
var $dillonkearns$elm_markdown$Markdown$InlineParser$ImageOpenToken = {$: 2};
var $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken = function (a) {
	return {$: 1, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken = function (regMatch) {
	var _v0 = regMatch.b4;
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var maybeImageOpen = _v1.a;
		var _v2 = _v1.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var isEscaped = !$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength);
		var index = isEscaped ? ((regMatch.c + backslashesLength) + 1) : (regMatch.c + backslashesLength);
		if (isEscaped) {
			if (!maybeImageOpen.$) {
				return $elm$core$Maybe$Just(
					{
						c: index,
						aO: 1,
						e: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken(0)
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			if (!maybeImageOpen.$) {
				return $elm$core$Maybe$Just(
					{c: index, aO: 2, e: $dillonkearns$elm_markdown$Markdown$InlineParser$ImageOpenToken});
			} else {
				return $elm$core$Maybe$Just(
					{
						c: index,
						aO: 1,
						e: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken(0)
					});
			}
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken = function (a) {
	return {$: 9, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToStrikethroughToken = function (regMatch) {
	var _v0 = regMatch.b4;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var tilde = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var _v2 = $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? _Utils_Tuple2(
			$elm$core$String$length(tilde),
			$dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken(1)) : _Utils_Tuple2(
			$elm$core$String$length(tilde),
			$dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken(0));
		var length = _v2.a;
		var meaning = _v2.b;
		return $elm$core$Maybe$Just(
			{c: regMatch.c + backslashesLength, aO: length, e: meaning});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(~{2,})([^~])?'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$findStrikethroughTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToStrikethroughToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^_])?(\\_+)([^_])?'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2($dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken, '_', str),
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex = F2(
	function (left, right) {
		if (left.b) {
			var lfirst = left.a;
			var lrest = left.b;
			if (right.b) {
				var rfirst = right.a;
				var rrest = right.b;
				return (_Utils_cmp(lfirst.c, rfirst.c) < 0) ? A2(
					$elm$core$List$cons,
					lfirst,
					A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, lrest, right)) : A2(
					$elm$core$List$cons,
					rfirst,
					A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, left, rrest));
			} else {
				return left;
			}
		} else {
			return right;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenize = function (rawText) {
	return A2(
		$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
		A3(
			$dillonkearns$elm_markdown$Markdown$InlineParser$cleanAngleBracketTokens,
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.c;
				},
				$dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens(rawText)),
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.c;
				},
				$dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens(rawText)),
			0),
		A2(
			$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
			$dillonkearns$elm_markdown$Markdown$InlineParser$findHardBreakTokens(rawText),
			A2(
				$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
				$dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens(rawText),
				A2(
					$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
					$dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens(rawText),
					A2(
						$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
						$dillonkearns$elm_markdown$Markdown$InlineParser$findStrikethroughTokens(rawText),
						A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
							$dillonkearns$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens(rawText),
							A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
								$dillonkearns$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens(rawText),
								$dillonkearns$elm_markdown$Markdown$InlineParser$findCodeTokens(rawText))))))));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType = {$: 2};
var $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisType = function (a) {
	return {$: 7, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType = function (a) {
	return {$: 6, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType = function (a) {
	return {$: 5, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$Inactive = 1;
var $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType = function (a) {
	return {$: 4, a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughType = {$: 8};
var $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType = function (a) {
	return {$: 3, a: a};
};
var $elm$regex$Regex$contains = _Regex_contains;
var $dillonkearns$elm_markdown$Markdown$InlineParser$decodeUrlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('%(?:3B|2C|2F|3F|3A|40|26|3D|2B|24|23|25)'));
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl = A2(
	$elm$core$Basics$composeR,
	$elm$url$Url$percentEncode,
	A2(
		$elm$regex$Regex$replace,
		$dillonkearns$elm_markdown$Markdown$InlineParser$decodeUrlRegex,
		function (match) {
			return A2(
				$elm$core$Maybe$withDefault,
				match.bB,
				$elm$url$Url$percentDecode(match.bB));
		}));
var $dillonkearns$elm_markdown$Markdown$InlineParser$urlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([A-Za-z][A-Za-z0-9.+\\-]{1,31}:[^<>\\x00-\\x20]*)$'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$autolinkToMatch = function (_v0) {
	var match = _v0;
	return A2($elm$regex$Regex$contains, $dillonkearns$elm_markdown$Markdown$InlineParser$urlRegex, match.M) ? $elm$core$Result$Ok(
		_Utils_update(
			match,
			{
				j: $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType(
					_Utils_Tuple2(
						match.M,
						$dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(match.M)))
			})) : $elm$core$Result$Err(match);
};
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $dillonkearns$elm_markdown$Markdown$Helpers$insideSquareBracketRegex = '[^\\[\\]\\\\]*(?:\\\\.[^\\[\\]\\\\]*)*';
var $dillonkearns$elm_markdown$Markdown$InlineParser$refLabelRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\[\\s*(' + ($dillonkearns$elm_markdown$Markdown$Helpers$insideSquareBracketRegex + ')\\s*\\]')));
var $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces = function (original) {
	return original;
};
var $dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel = A2($elm$core$Basics$composeR, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $elm$core$String$toLower);
var $dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle = F2(
	function (rawUrl, maybeTitle) {
		return _Utils_Tuple2(
			$dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(
				$dillonkearns$elm_markdown$Markdown$Helpers$formatStr(rawUrl)),
			A2($elm$core$Maybe$map, $dillonkearns$elm_markdown$Markdown$Helpers$formatStr, maybeTitle));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$refRegexToMatch = F3(
	function (matchModel, references, maybeRegexMatch) {
		var refLabel = function (str) {
			return $elm$core$String$isEmpty(str) ? matchModel.M : str;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				matchModel.M,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					A2(
						$elm$core$Maybe$andThen,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.b4;
							},
							$elm$core$List$head),
						maybeRegexMatch))));
		var _v0 = A2(
			$elm$core$Dict$get,
			$dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel(refLabel),
			references);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var rawUrl = _v1.a;
			var maybeTitle = _v1.b;
			var type_ = function () {
				var _v3 = matchModel.j;
				if (_v3.$ === 5) {
					return $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType(
						A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
				} else {
					return $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType(
						A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
				}
			}();
			var regexMatchLength = function () {
				if (!maybeRegexMatch.$) {
					var match = maybeRegexMatch.a.bB;
					return $elm$core$String$length(match);
				} else {
					return 0;
				}
			}();
			return $elm$core$Maybe$Just(
				_Utils_update(
					matchModel,
					{g: matchModel.g + regexMatchLength, j: type_}));
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences = F3(
	function (remainText, _v0, references) {
		var tempMatch = _v0;
		var matches = A3($elm$regex$Regex$findAtMost, 1, $dillonkearns$elm_markdown$Markdown$InlineParser$refLabelRegex, remainText);
		return A3(
			$dillonkearns$elm_markdown$Markdown$InlineParser$refRegexToMatch,
			tempMatch,
			references,
			$elm$core$List$head(matches));
	});
var $dillonkearns$elm_markdown$Markdown$Helpers$lineEndChars = '\\f\\v\\r\\n';
var $dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars = ' \\t\\f\\v\\r\\n';
var $dillonkearns$elm_markdown$Markdown$InlineParser$hrefRegex = '(?:<([^<>' + ($dillonkearns$elm_markdown$Markdown$Helpers$lineEndChars + (']*)>|([^' + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + ('\\(\\)\\\\]*(?:\\\\.[^' + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + '\\(\\)\\\\]*)*))')))));
var $dillonkearns$elm_markdown$Markdown$Helpers$titleRegex = '(?:[' + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + (']+' + ('(?:\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'|' + ('\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|' + '\\(([^\\)\\\\]*(?:\\\\.[^\\)\\\\]*)*)\\)))?'))));
var $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\(\\s*' + ($dillonkearns$elm_markdown$Markdown$InlineParser$hrefRegex + ($dillonkearns$elm_markdown$Markdown$Helpers$titleRegex + '\\s*\\)'))));
var $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust = function (maybes) {
	var process = F2(
		function (a, maybeFound) {
			if (!maybeFound.$) {
				var found = maybeFound.a;
				return $elm$core$Maybe$Just(found);
			} else {
				return a;
			}
		});
	return A3($elm$core$List$foldl, process, $elm$core$Maybe$Nothing, maybes);
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch = F2(
	function (matchModel, regexMatch) {
		var _v0 = regexMatch.b4;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
			var maybeRawUrlAngleBrackets = _v0.a;
			var _v1 = _v0.b;
			var maybeRawUrlWithoutBrackets = _v1.a;
			var _v2 = _v1.b;
			var maybeTitleSingleQuotes = _v2.a;
			var _v3 = _v2.b;
			var maybeTitleDoubleQuotes = _v3.a;
			var _v4 = _v3.b;
			var maybeTitleParenthesis = _v4.a;
			var maybeTitle = $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeTitleSingleQuotes, maybeTitleDoubleQuotes, maybeTitleParenthesis]));
			var toMatch = function (rawUrl) {
				return _Utils_update(
					matchModel,
					{
						g: matchModel.g + $elm$core$String$length(regexMatch.bB),
						j: function () {
							var _v5 = matchModel.j;
							if (_v5.$ === 5) {
								return $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType;
							} else {
								return $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType;
							}
						}()(
							A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle))
					});
			};
			var maybeRawUrl = $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeRawUrlAngleBrackets, maybeRawUrlWithoutBrackets]));
			return $elm$core$Maybe$Just(
				toMatch(
					A2($elm$core$Maybe$withDefault, '', maybeRawUrl)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType = F3(
	function (remainText, _v0, refs) {
		var tempMatch = _v0;
		var _v1 = A3($elm$regex$Regex$findAtMost, 1, $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex, remainText);
		if (_v1.b) {
			var first = _v1.a;
			var _v2 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch, tempMatch, first);
			if (!_v2.$) {
				var match = _v2.a;
				return $elm$core$Maybe$Just(match);
			} else {
				return A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences, remainText, tempMatch, refs);
			}
		} else {
			return A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences, remainText, tempMatch, refs);
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping = F2(
	function (_v0, remainMatches) {
		var match = _v0;
		var overlappingMatches = $elm$core$List$filter(
			function (_v1) {
				var testMatch = _v1;
				return (_Utils_cmp(match.g, testMatch.i) > 0) && (_Utils_cmp(match.g, testMatch.g) < 0);
			});
		return ($elm$core$List$isEmpty(remainMatches) || $elm$core$List$isEmpty(
			overlappingMatches(remainMatches))) ? $elm$core$Maybe$Just(
			A2($elm$core$List$cons, match, remainMatches)) : $elm$core$Maybe$Nothing;
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$emailRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*)$'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch = function (_v0) {
	var match = _v0;
	return A2($elm$regex$Regex$contains, $dillonkearns$elm_markdown$Markdown$InlineParser$emailRegex, match.M) ? $elm$core$Result$Ok(
		_Utils_update(
			match,
			{
				j: $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType(
					_Utils_Tuple2(
						match.M,
						'mailto:' + $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(match.M)))
			})) : $elm$core$Result$Err(match);
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findTokenHelp = F3(
	function (innerTokens, isToken, tokens) {
		findTokenHelp:
		while (true) {
			if (!tokens.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var nextToken = tokens.a;
				var remainingTokens = tokens.b;
				if (isToken(nextToken)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple3(
							nextToken,
							$elm$core$List$reverse(innerTokens),
							remainingTokens));
				} else {
					var $temp$innerTokens = A2($elm$core$List$cons, nextToken, innerTokens),
						$temp$isToken = isToken,
						$temp$tokens = remainingTokens;
					innerTokens = $temp$innerTokens;
					isToken = $temp$isToken;
					tokens = $temp$tokens;
					continue findTokenHelp;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$findToken = F2(
	function (isToken, tokens) {
		return A3($dillonkearns$elm_markdown$Markdown$InlineParser$findTokenHelp, _List_Nil, isToken, tokens);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlToken = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$NotOpening = 0;
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.d, s);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{bg: 1, f: _List_Nil, h: 1, d: 0, cT: 1, aY: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$htmlToToken = F2(
	function (rawText, _v0) {
		var match = _v0;
		var consumedCharacters = A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(
						F3(
							function (startOffset, htmlTag, endOffset) {
								return {bw: htmlTag, aO: endOffset - startOffset};
							})),
					$elm$parser$Parser$Advanced$getOffset),
				$dillonkearns$elm_markdown$HtmlParser$html),
			$elm$parser$Parser$Advanced$getOffset);
		var parsed = A2(
			$elm$parser$Parser$Advanced$run,
			consumedCharacters,
			A2($elm$core$String$dropLeft, match.i, rawText));
		if (!parsed.$) {
			var htmlTag = parsed.a.bw;
			var length = parsed.a.aO;
			var htmlToken = A2($dillonkearns$elm_markdown$Markdown$InlineParser$HtmlToken, 0, htmlTag);
			return $elm$core$Maybe$Just(
				{c: match.i, aO: length, e: htmlToken});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$Helpers$ifError = F2(
	function (_function, result) {
		if (!result.$) {
			return result;
		} else {
			var err = result.a;
			return _function(err);
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isCodeTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.e;
		if (!_v0.$) {
			if (!_v0.a) {
				var _v1 = _v0.a;
				return _Utils_eq(openToken.aO - 1, closeToken.aO);
			} else {
				var _v2 = _v0.a;
				return _Utils_eq(openToken.aO, closeToken.aO);
			}
		} else {
			return false;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken = function (token) {
	var _v0 = token.e;
	switch (_v0.$) {
		case 1:
			return true;
		case 2:
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.e;
		if (_v0.$ === 7) {
			var openChar = _v0.a;
			var open = _v0.b;
			var _v1 = closeToken.e;
			if (_v1.$ === 7) {
				var closeChar = _v1.a;
				var close = _v1.b;
				return _Utils_eq(openChar, closeChar) ? ((_Utils_eq(open.aq, open.au) || _Utils_eq(close.aq, close.au)) ? ((!(!A2($elm$core$Basics$modBy, 3, closeToken.aO + openToken.aO))) || ((!A2($elm$core$Basics$modBy, 3, closeToken.aO)) && (!A2($elm$core$Basics$modBy, 3, openToken.aO)))) : true) : false;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isStrikethroughTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = function () {
			var _v1 = openToken.e;
			if (_v1.$ === 9) {
				if (!_v1.a) {
					var _v2 = _v1.a;
					return _Utils_Tuple2(true, openToken.aO - 1);
				} else {
					var _v3 = _v1.a;
					return _Utils_Tuple2(true, openToken.aO);
				}
			} else {
				return _Utils_Tuple2(false, 0);
			}
		}();
		var openTokenIsStrikethrough = _v0.a;
		var openTokenLength = _v0.b;
		var _v4 = function () {
			var _v5 = closeToken.e;
			if (_v5.$ === 9) {
				if (!_v5.a) {
					var _v6 = _v5.a;
					return _Utils_Tuple2(true, closeToken.aO - 1);
				} else {
					var _v7 = _v5.a;
					return _Utils_Tuple2(true, closeToken.aO);
				}
			} else {
				return _Utils_Tuple2(false, 0);
			}
		}();
		var closeTokenIsStrikethrough = _v4.a;
		var closeTokenLength = _v4.b;
		return closeTokenIsStrikethrough && (openTokenIsStrikethrough && _Utils_eq(closeTokenLength, openTokenLength));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakType = {$: 1};
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch = F2(
	function (token, type_) {
		return {g: token.c + token.aO, o: _List_Nil, i: token.c, M: '', t: 0, q: 0, j: type_};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$lineBreakTTM = F2(
	function (remaining, matches) {
		lineBreakTTM:
		while (true) {
			if (!remaining.b) {
				return matches;
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v1 = token.e;
				if (_v1.$ === 8) {
					var $temp$remaining = tokensTail,
						$temp$matches = A2(
						$elm$core$List$cons,
						A2($dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch, token, $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakType),
						matches);
					remaining = $temp$remaining;
					matches = $temp$matches;
					continue lineBreakTTM;
				} else {
					var $temp$remaining = tokensTail,
						$temp$matches = matches;
					remaining = $temp$remaining;
					matches = $temp$matches;
					continue lineBreakTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens = F2(
	function (_v0, tokensTail) {
		var match = _v0;
		return A2(
			$elm$core$List$filter,
			function (token) {
				return _Utils_cmp(token.c, match.g) > -1;
			},
			tokensTail);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketsToMatch = F6(
	function (closeToken, escaped, matches, references, rawText, _v44) {
		var openToken = _v44.a;
		var remainTokens = _v44.c;
		var result = A2(
			$dillonkearns$elm_markdown$Markdown$Helpers$ifError,
			$dillonkearns$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch,
			$dillonkearns$elm_markdown$Markdown$InlineParser$autolinkToMatch(
				A7(
					$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
					references,
					rawText,
					function (s) {
						return s;
					},
					$dillonkearns$elm_markdown$Markdown$InlineParser$CodeType,
					openToken,
					closeToken,
					_List_Nil)));
		if (result.$ === 1) {
			var tempMatch = result.a;
			if (escaped === 1) {
				var _v47 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$htmlToToken, rawText, tempMatch);
				if (!_v47.$) {
					var newToken = _v47.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2($elm$core$List$cons, newToken, remainTokens),
							matches));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			var newMatch = result.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(
					remainTokens,
					A2($elm$core$List$cons, newMatch, matches)));
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		codeAutolinkTypeHtmlTagTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$htmlElementTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v36 = token.e;
				switch (_v36.$) {
					case 0:
						var _v37 = A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
							$dillonkearns$elm_markdown$Markdown$InlineParser$isCodeTokenPair(token),
							tokens);
						if (!_v37.$) {
							var code = _v37.a;
							var _v38 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$codeToMatch, token, matches, references, rawText, code);
							var newTokens = _v38.a;
							var newMatches = _v38.b;
							var $temp$remaining = tokensTail,
								$temp$tokens = newTokens,
								$temp$matches = newMatches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2($elm$core$List$cons, token, tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						}
					case 5:
						var isEscaped = _v36.a;
						var isAngleBracketOpen = function (_v43) {
							var meaning = _v43.e;
							if (meaning.$ === 4) {
								return true;
							} else {
								return false;
							}
						};
						var _v39 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, isAngleBracketOpen, tokens);
						if (!_v39.$) {
							var found = _v39.a;
							var _v40 = A6($dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketsToMatch, token, isEscaped, matches, references, rawText, found);
							if (!_v40.$) {
								var _v41 = _v40.a;
								var newTokens = _v41.a;
								var newMatches = _v41.b;
								var $temp$remaining = tokensTail,
									$temp$tokens = A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
									newTokens),
									$temp$matches = newMatches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue codeAutolinkTypeHtmlTagTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
									tokens),
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue codeAutolinkTypeHtmlTagTTM;
							}
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2(
								$elm$core$List$filter,
								A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
								tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						}
					default:
						var $temp$remaining = tokensTail,
							$temp$tokens = A2($elm$core$List$cons, token, tokens),
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue codeAutolinkTypeHtmlTagTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$codeToMatch = F5(
	function (closeToken, matches, references, rawText, _v32) {
		var openToken = _v32.a;
		var remainTokens = _v32.c;
		var updatedOpenToken = function () {
			var _v33 = openToken.e;
			if ((!_v33.$) && (!_v33.a)) {
				var _v34 = _v33.a;
				return _Utils_update(
					openToken,
					{c: openToken.c + 1, aO: openToken.aO - 1});
			} else {
				return openToken;
			}
		}();
		var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType, updatedOpenToken, closeToken, _List_Nil);
		return _Utils_Tuple2(
			remainTokens,
			A2($elm$core$List$cons, match, matches));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$emphasisTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		emphasisTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v27 = token.e;
				if (_v27.$ === 7) {
					var _char = _v27.a;
					var leftFringeRank = _v27.b.aq;
					var rightFringeRank = _v27.b.au;
					if (_Utils_eq(leftFringeRank, rightFringeRank)) {
						if ((!(!rightFringeRank)) && ((_char !== '_') || (rightFringeRank === 1))) {
							var _v28 = A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
								$dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token),
								tokens);
							if (!_v28.$) {
								var found = _v28.a;
								var _v29 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
								var newRemaining = _v29.a;
								var match = _v29.b;
								var newTokens = _v29.c;
								var $temp$remaining = newRemaining,
									$temp$tokens = newTokens,
									$temp$matches = A2($elm$core$List$cons, match, matches),
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = A2($elm$core$List$cons, token, tokens),
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							}
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue emphasisTTM;
						}
					} else {
						if (_Utils_cmp(leftFringeRank, rightFringeRank) < 0) {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2($elm$core$List$cons, token, tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue emphasisTTM;
						} else {
							var _v30 = A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
								$dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token),
								tokens);
							if (!_v30.$) {
								var found = _v30.a;
								var _v31 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
								var newRemaining = _v31.a;
								var match = _v31.b;
								var newTokens = _v31.c;
								var $temp$remaining = newRemaining,
									$temp$tokens = newTokens,
									$temp$matches = A2($elm$core$List$cons, match, matches),
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = tokens,
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							}
						}
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue emphasisTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch = F5(
	function (references, rawText, closeToken, tokensTail, _v25) {
		var openToken = _v25.a;
		var innerTokens = _v25.b;
		var remainTokens = _v25.c;
		var remainLength = openToken.aO - closeToken.aO;
		var updt = (!remainLength) ? {am: closeToken, Z: openToken, at: remainTokens, az: tokensTail} : ((remainLength > 0) ? {
			am: closeToken,
			Z: _Utils_update(
				openToken,
				{c: openToken.c + remainLength, aO: closeToken.aO}),
			at: A2(
				$elm$core$List$cons,
				_Utils_update(
					openToken,
					{aO: remainLength}),
				remainTokens),
			az: tokensTail
		} : {
			am: _Utils_update(
				closeToken,
				{aO: openToken.aO}),
			Z: openToken,
			at: remainTokens,
			az: A2(
				$elm$core$List$cons,
				_Utils_update(
					closeToken,
					{c: closeToken.c + openToken.aO, aO: -remainLength}),
				tokensTail)
		});
		var match = A7(
			$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
			references,
			rawText,
			function (s) {
				return s;
			},
			$dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisType(updt.Z.aO),
			updt.Z,
			updt.am,
			$elm$core$List$reverse(innerTokens));
		return _Utils_Tuple3(updt.az, match, updt.at);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$htmlElementTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		htmlElementTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$linkImageTypeTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v23 = token.e;
				if (_v23.$ === 6) {
					var isOpen = _v23.a;
					var htmlModel = _v23.b;
					var $temp$remaining = tokensTail,
						$temp$tokens = tokens,
						$temp$matches = A2(
						$elm$core$List$cons,
						A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch,
							token,
							$dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel)),
						matches),
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue htmlElementTTM;
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue htmlElementTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageTypeTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		linkImageTypeTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$emphasisTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v18 = token.e;
				if (_v18.$ === 3) {
					var _v19 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken, tokens);
					if (!_v19.$) {
						var found = _v19.a;
						var _v20 = A6($dillonkearns$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch, token, tokensTail, matches, references, rawText, found);
						if (!_v20.$) {
							var _v21 = _v20.a;
							var x = _v21.a;
							var newMatches = _v21.b;
							var newTokens = _v21.c;
							var $temp$remaining = x,
								$temp$tokens = newTokens,
								$temp$matches = newMatches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue linkImageTypeTTM;
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue linkImageTypeTTM;
						}
					} else {
						var $temp$remaining = tokensTail,
							$temp$tokens = tokens,
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue linkImageTypeTTM;
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue linkImageTypeTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch = F6(
	function (closeToken, tokensTail, oldMatches, references, rawText, _v8) {
		var openToken = _v8.a;
		var innerTokens = _v8.b;
		var remainTokens = _v8.c;
		var removeOpenToken = _Utils_Tuple3(
			tokensTail,
			oldMatches,
			_Utils_ap(innerTokens, remainTokens));
		var remainText = A2($elm$core$String$dropLeft, closeToken.c + 1, rawText);
		var inactivateLinkOpenToken = function (token) {
			var _v16 = token.e;
			if (_v16.$ === 1) {
				return _Utils_update(
					token,
					{
						e: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken(1)
					});
			} else {
				return token;
			}
		};
		var findTempMatch = function (isLinkType) {
			return A7(
				$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
				references,
				rawText,
				function (s) {
					return s;
				},
				isLinkType ? $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)) : $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)),
				openToken,
				closeToken,
				$elm$core$List$reverse(innerTokens));
		};
		var _v9 = openToken.e;
		switch (_v9.$) {
			case 2:
				var tempMatch = findTempMatch(false);
				var _v10 = A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
				if (_v10.$ === 1) {
					return $elm$core$Maybe$Just(removeOpenToken);
				} else {
					var match = _v10.a;
					var _v11 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
					if (!_v11.$) {
						var matches = _v11.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple3(
								A2($dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail),
								matches,
								remainTokens));
					} else {
						return $elm$core$Maybe$Just(removeOpenToken);
					}
				}
			case 1:
				if (!_v9.a) {
					var _v12 = _v9.a;
					var tempMatch = findTempMatch(true);
					var _v13 = A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
					if (_v13.$ === 1) {
						return $elm$core$Maybe$Just(removeOpenToken);
					} else {
						var match = _v13.a;
						var _v14 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
						if (!_v14.$) {
							var matches = _v14.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple3(
									A2($dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail),
									matches,
									A2($elm$core$List$map, inactivateLinkOpenToken, remainTokens)));
						} else {
							return $elm$core$Maybe$Just(removeOpenToken);
						}
					}
				} else {
					var _v15 = _v9.a;
					return $elm$core$Maybe$Just(removeOpenToken);
				}
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		strikethroughTTM:
		while (true) {
			if (!remaining.b) {
				return A2(
					$dillonkearns$elm_markdown$Markdown$InlineParser$lineBreakTTM,
					$elm$core$List$reverse(tokens),
					matches);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v5 = token.e;
				if (_v5.$ === 9) {
					var _v6 = A2(
						$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
						$dillonkearns$elm_markdown$Markdown$InlineParser$isStrikethroughTokenPair(token),
						tokens);
					if (!_v6.$) {
						var content = _v6.a;
						var _v7 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughToMatch, token, matches, references, rawText, content);
						var newTokens = _v7.a;
						var newMatches = _v7.b;
						var $temp$remaining = tokensTail,
							$temp$tokens = newTokens,
							$temp$matches = newMatches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue strikethroughTTM;
					} else {
						var $temp$remaining = tokensTail,
							$temp$tokens = A2($elm$core$List$cons, token, tokens),
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue strikethroughTTM;
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue strikethroughTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughToMatch = F5(
	function (closeToken, matches, references, rawText, _v1) {
		var openToken = _v1.a;
		var remainTokens = _v1.c;
		var updatedOpenToken = function () {
			var _v2 = openToken.e;
			if ((_v2.$ === 9) && (!_v2.a)) {
				var _v3 = _v2.a;
				return _Utils_update(
					openToken,
					{c: openToken.c + 1, aO: openToken.aO - 1});
			} else {
				return openToken;
			}
		}();
		var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughType, updatedOpenToken, closeToken, _List_Nil);
		return _Utils_Tuple2(
			remainTokens,
			A2($elm$core$List$cons, match, matches));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch = F7(
	function (references, rawText, processText, type_, openToken, closeToken, innerTokens) {
		var textStart = openToken.c + openToken.aO;
		var textEnd = closeToken.c;
		var text = processText(
			A3($elm$core$String$slice, textStart, textEnd, rawText));
		var start = openToken.c;
		var end = closeToken.c + closeToken.aO;
		var match = {g: end, o: _List_Nil, i: start, M: text, t: textEnd, q: textStart, j: type_};
		var matches = A2(
			$elm$core$List$map,
			function (_v0) {
				var matchModel = _v0;
				return A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch, match, matchModel);
			},
			A4($dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches, innerTokens, _List_Nil, references, rawText));
		return {g: end, o: matches, i: start, M: text, t: textEnd, q: textStart, j: type_};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches = F4(
	function (tokens, matches, references, rawText) {
		return A5($dillonkearns$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM, tokens, _List_Nil, matches, references, rawText);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$parse = F2(
	function (refs, rawText_) {
		var rawText = $elm$core$String$trim(rawText_);
		var tokens = $dillonkearns$elm_markdown$Markdown$InlineParser$tokenize(rawText);
		return $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(
			A3(
				$dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches,
				rawText,
				_List_Nil,
				$dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches(
					A4($dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches, tokens, _List_Nil, refs, rawText))));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				' ',
				$elm$parser$Parser$Expecting(' '))),
			$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				'>',
				$elm$parser$Parser$Expecting('>'))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$chompIf,
					$elm$core$Char$isAlpha,
					$elm$parser$Parser$Expecting('Alpha')),
				$elm$parser$Parser$Advanced$chompWhile(
					function (c) {
						return $elm$core$Char$isAlphaNum(c) || (c === '-');
					})),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							':',
							$elm$parser$Parser$Expecting(':'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'@',
							$elm$parser$Parser$Expecting('@'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'\\',
							$elm$parser$Parser$Expecting('\\'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'+',
							$elm$parser$Parser$Expecting('+'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'.',
							$elm$parser$Parser$Expecting('.')))
					])))
		]));
var $dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock = $elm$parser$Parser$Advanced$backtrackable(
	A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (rawLine, _v0) {
				return $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(rawLine);
			}),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'<',
							$elm$parser$Parser$Expecting('<'))),
					$dillonkearns$elm_markdown$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag),
				$dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
			$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
var $dillonkearns$elm_markdown$Markdown$Table$TableHeader = $elm$core$Basics$identity;
var $dillonkearns$elm_markdown$Parser$Token$parseString = function (str) {
	return $elm$parser$Parser$Advanced$token(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$Expecting(str)));
};
var $dillonkearns$elm_markdown$Markdown$TableParser$parseCellHelper = function (_v0) {
	var curr = _v0.a;
	var acc = _v0.b;
	var _return = A2(
		$elm$core$Maybe$withDefault,
		$elm$parser$Parser$Advanced$Done(acc),
		A2(
			$elm$core$Maybe$map,
			function (cell) {
				return $elm$parser$Parser$Advanced$Done(
					A2($elm$core$List$cons, cell, acc));
			},
			curr));
	var finishCell = A2(
		$elm$core$Maybe$withDefault,
		$elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple2($elm$core$Maybe$Nothing, acc)),
		A2(
			$elm$core$Maybe$map,
			function (cell) {
				return $elm$parser$Parser$Advanced$Loop(
					_Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A2($elm$core$List$cons, cell, acc)));
			},
			curr));
	var addToCurrent = function (c) {
		return _Utils_ap(
			A2($elm$core$Maybe$withDefault, '', curr),
			c);
	};
	var continueCell = function (c) {
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple2(
				$elm$core$Maybe$Just(
					addToCurrent(c)),
				acc));
	};
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return _return;
				},
				$dillonkearns$elm_markdown$Parser$Token$parseString('|\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return _return;
				},
				$dillonkearns$elm_markdown$Parser$Token$parseString('\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v3) {
					return _return;
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('end'))),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('|'))),
				$dillonkearns$elm_markdown$Parser$Token$parseString('\\\\|')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('\\'))),
				$dillonkearns$elm_markdown$Parser$Token$parseString('\\\\')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('|'))),
				$dillonkearns$elm_markdown$Parser$Token$parseString('\\|')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(finishCell)),
				$dillonkearns$elm_markdown$Parser$Token$parseString('|')),
				A2(
				$elm$parser$Parser$Advanced$mapChompedString,
				F2(
					function (_char, _v4) {
						return continueCell(_char);
					}),
				A2(
					$elm$parser$Parser$Advanced$chompIf,
					$elm$core$Basics$always(true),
					$elm$parser$Parser$Problem('No character found')))
			]));
};
var $dillonkearns$elm_markdown$Markdown$TableParser$parseCells = A2(
	$elm$parser$Parser$Advanced$map,
	A2(
		$elm$core$List$foldl,
		F2(
			function (cell, acc) {
				return A2(
					$elm$core$List$cons,
					$elm$core$String$trim(cell),
					acc);
			}),
		_List_Nil),
	A2(
		$elm$parser$Parser$Advanced$loop,
		_Utils_Tuple2($elm$core$Maybe$Nothing, _List_Nil),
		$dillonkearns$elm_markdown$Markdown$TableParser$parseCellHelper));
var $dillonkearns$elm_markdown$Markdown$TableParser$rowParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$dillonkearns$elm_markdown$Parser$Token$parseString('|'),
					$elm$parser$Parser$Advanced$succeed(0)
				]))),
	$dillonkearns$elm_markdown$Markdown$TableParser$parseCells);
var $dillonkearns$elm_markdown$Markdown$TableParser$parseHeader = F2(
	function (_v0, headersRow) {
		var columnAlignments = _v0.b;
		var headersWithAlignment = function (headers) {
			return A3(
				$elm$core$List$map2,
				F2(
					function (headerCell, alignment) {
						return {ai: alignment, Q: headerCell};
					}),
				headers,
				columnAlignments);
		};
		var combineHeaderAndDelimiter = function (headers) {
			return _Utils_eq(
				$elm$core$List$length(headers),
				$elm$core$List$length(columnAlignments)) ? $elm$core$Result$Ok(
				headersWithAlignment(headers)) : $elm$core$Result$Err(
				'Tables must have the same number of header columns (' + ($elm$core$String$fromInt(
					$elm$core$List$length(headers)) + (') as delimiter columns (' + ($elm$core$String$fromInt(
					$elm$core$List$length(columnAlignments)) + ')'))));
		};
		var _v1 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$TableParser$rowParser, headersRow);
		if (!_v1.$) {
			var headers = _v1.a;
			return combineHeaderAndDelimiter(headers);
		} else {
			return $elm$core$Result$Err('Unable to parse previous line as a table header');
		}
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$CodeBlock = F2(
	function (language, body) {
		return {aC: body, aN: language};
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$infoString = function (fenceCharacter) {
	var toInfoString = F2(
		function (str, _v2) {
			var _v1 = $elm$core$String$trim(str);
			if (_v1 === '') {
				return $elm$core$Maybe$Nothing;
			} else {
				var trimmed = _v1;
				return $elm$core$Maybe$Just(trimmed);
			}
		});
	var _v0 = fenceCharacter.ap;
	if (!_v0) {
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			toInfoString,
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return (c !== '`') && (!$dillonkearns$elm_markdown$Whitespace$isLineEnd(c));
				}));
	} else {
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			toInfoString,
			$elm$parser$Parser$Advanced$chompWhile(
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isLineEnd)));
	}
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$Backtick = 0;
var $dillonkearns$elm_markdown$Parser$Token$backtick = A2(
	$elm$parser$Parser$Advanced$Token,
	'`',
	$elm$parser$Parser$Expecting('a \'`\''));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$backtick = {ak: '`', ap: 0, ay: $dillonkearns$elm_markdown$Parser$Token$backtick};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$colToIndentation = function (_int) {
	switch (_int) {
		case 1:
			return $elm$parser$Parser$Advanced$succeed(0);
		case 2:
			return $elm$parser$Parser$Advanced$succeed(1);
		case 3:
			return $elm$parser$Parser$Advanced$succeed(2);
		case 4:
			return $elm$parser$Parser$Advanced$succeed(3);
		default:
			return $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Expecting('Fenced code blocks should be indented no more than 3 spaces'));
	}
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast = F2(
	function (minLength, fenceCharacter) {
		var builtTokens = A3(
			$elm$core$List$foldl,
			F2(
				function (t, p) {
					return A2($elm$parser$Parser$Advanced$ignorer, p, t);
				}),
			$elm$parser$Parser$Advanced$succeed(0),
			A2(
				$elm$core$List$repeat,
				minLength,
				$elm$parser$Parser$Advanced$token(fenceCharacter.ay)));
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			F2(
				function (str, _v0) {
					return _Utils_Tuple2(
						fenceCharacter,
						$elm$core$String$length(str));
				}),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				builtTokens,
				$elm$parser$Parser$Advanced$chompWhile(
					$elm$core$Basics$eq(fenceCharacter.ak))));
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$Tilde = 1;
var $dillonkearns$elm_markdown$Parser$Token$tilde = A2(
	$elm$parser$Parser$Advanced$Token,
	'~',
	$elm$parser$Parser$Expecting('a `~`'));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$tilde = {ak: '~', ap: 1, ay: $dillonkearns$elm_markdown$Parser$Token$tilde};
var $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$Whitespace$space,
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$dillonkearns$elm_markdown$Whitespace$space,
							$elm$parser$Parser$Advanced$succeed(0)
						]))),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$dillonkearns$elm_markdown$Whitespace$space,
						$elm$parser$Parser$Advanced$succeed(0)
					]))),
			$elm$parser$Parser$Advanced$succeed(0)
		]));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$openingFence = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (indent, _v0) {
						var character = _v0.a;
						var length = _v0.b;
						return {al: character, aL: indent, aO: length};
					})),
			$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
		A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$CodeBlock$colToIndentation, $elm$parser$Parser$Advanced$getCol)),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, 3, $dillonkearns$elm_markdown$Markdown$CodeBlock$backtick),
				A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, 3, $dillonkearns$elm_markdown$Markdown$CodeBlock$tilde)
			])));
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $dillonkearns$elm_markdown$Whitespace$isSpace = $elm$core$Basics$eq(' ');
var $dillonkearns$elm_markdown$Markdown$CodeBlock$closingFence = F2(
	function (minLength, fenceCharacter) {
		return A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(0),
						$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
					A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, minLength, fenceCharacter)),
				$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpace)),
			$dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$codeBlockLine = function (indented) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			A2($dillonkearns$elm_markdown$Parser$Extra$upTo, indented, $dillonkearns$elm_markdown$Whitespace$space)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getOffset, $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
			$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
};
var $elm$parser$Parser$Advanced$getSource = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.aY, s);
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlockHelp = function (_v0) {
	var fence = _v0.a;
	var body = _v0.b;
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$elm$parser$Parser$Advanced$Done(body)),
				$elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd)),
				A2(
				$elm$parser$Parser$Advanced$mapChompedString,
				F2(
					function (lineEnd, _v1) {
						return $elm$parser$Parser$Advanced$Loop(
							_Utils_Tuple2(
								fence,
								_Utils_ap(body, lineEnd)));
					}),
				$dillonkearns$elm_markdown$Whitespace$lineEnd),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						$elm$parser$Parser$Advanced$Done(body)),
					A2($dillonkearns$elm_markdown$Markdown$CodeBlock$closingFence, fence.aO, fence.al))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(
							F3(
								function (start, end, source) {
									return $elm$parser$Parser$Advanced$Loop(
										_Utils_Tuple2(
											fence,
											_Utils_ap(
												body,
												A3($elm$core$String$slice, start, end, source))));
								})),
						$dillonkearns$elm_markdown$Markdown$CodeBlock$codeBlockLine(fence.aL)),
					$elm$parser$Parser$Advanced$getOffset),
				$elm$parser$Parser$Advanced$getSource)
			]));
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlock = function (fence) {
	return A2(
		$elm$parser$Parser$Advanced$loop,
		_Utils_Tuple2(fence, ''),
		$dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlockHelp);
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$parser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (fence) {
		return A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$CodeBlock$CodeBlock),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$Markdown$CodeBlock$infoString(fence.al),
					$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)),
			$dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlock(fence));
	},
	$dillonkearns$elm_markdown$Markdown$CodeBlock$openingFence);
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes = function (headingString) {
	dropTrailingHashes:
	while (true) {
		if (A2($elm$core$String$endsWith, '#', headingString)) {
			var $temp$headingString = A2($elm$core$String$dropRight, 1, headingString);
			headingString = $temp$headingString;
			continue dropTrailingHashes;
		} else {
			return headingString;
		}
	}
};
var $elm$core$String$trimRight = _String_trimRight;
var $dillonkearns$elm_markdown$Markdown$Heading$dropClosingSequence = function (headingString) {
	var droppedTrailingHashesString = $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes(headingString);
	return (A2($elm$core$String$endsWith, ' ', droppedTrailingHashesString) || $elm$core$String$isEmpty(droppedTrailingHashesString)) ? $elm$core$String$trimRight(droppedTrailingHashesString) : headingString;
};
var $dillonkearns$elm_markdown$Parser$Token$hash = A2(
	$elm$parser$Parser$Advanced$Token,
	'#',
	$elm$parser$Parser$Expecting('a `#`'));
var $dillonkearns$elm_markdown$Markdown$Heading$isHash = function (c) {
	if ('#' === c) {
		return true;
	} else {
		return false;
	}
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var $dillonkearns$elm_markdown$Markdown$Heading$parser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Heading),
				A2(
					$elm$parser$Parser$Advanced$andThen,
					function (startingSpaces) {
						var startSpace = $elm$core$String$length(startingSpaces);
						return (startSpace >= 4) ? $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Expecting('heading with < 4 spaces in front')) : $elm$parser$Parser$Advanced$succeed(startSpace);
					},
					$elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$spaces))),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$hash)),
		A2(
			$elm$parser$Parser$Advanced$andThen,
			function (additionalHashes) {
				var level = $elm$core$String$length(additionalHashes) + 1;
				return (level >= 7) ? $elm$parser$Parser$Advanced$problem(
					$elm$parser$Parser$Expecting('heading with < 7 #\'s')) : $elm$parser$Parser$Advanced$succeed(level);
			},
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Markdown$Heading$isHash)))),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(''),
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$newline)),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space),
								$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$tab)
							]))),
				A2(
					$elm$parser$Parser$Advanced$mapChompedString,
					F2(
						function (headingText, _v0) {
							return $dillonkearns$elm_markdown$Markdown$Heading$dropClosingSequence(
								$elm$core$String$trim(headingText));
						}),
					$dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd))
			])));
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.d, s.cT, s.bg, s.aY);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.f)) : A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.d, newOffset) < 0,
			0,
			{bg: newCol, f: s.f, h: s.h, d: newOffset, cT: newRow, aY: s.aY});
	};
};
var $dillonkearns$elm_markdown$Parser$Token$greaterThan = A2(
	$elm$parser$Parser$Advanced$Token,
	'>',
	$elm$parser$Parser$Expecting('a `>`'));
var $elm$parser$Parser$Advanced$Located = F3(
	function (row, col, context) {
		return {bg: col, f: context, cT: row};
	});
var $elm$parser$Parser$Advanced$changeContext = F2(
	function (newContext, s) {
		return {bg: s.bg, f: newContext, h: s.h, d: s.d, cT: s.cT, aY: s.aY};
	});
var $elm$parser$Parser$Advanced$inContext = F2(
	function (context, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(
				A2(
					$elm$parser$Parser$Advanced$changeContext,
					A2(
						$elm$core$List$cons,
						A3($elm$parser$Parser$Advanced$Located, s0.cT, s0.bg, context),
						s0.f),
					s0));
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					a,
					A2($elm$parser$Parser$Advanced$changeContext, s0.f, s1));
			} else {
				var step = _v1;
				return step;
			}
		};
	});
var $dillonkearns$elm_markdown$Whitespace$isWhitespace = function (_char) {
	switch (_char) {
		case ' ':
			return true;
		case '\n':
			return true;
		case '\t':
			return true;
		case '\u000B':
			return true;
		case '\u000C':
			return true;
		case '\u000D':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Parser$Token$lessThan = A2(
	$elm$parser$Parser$Advanced$Token,
	'<',
	$elm$parser$Parser$Expecting('a `<`'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$destinationParser = A2(
	$elm$parser$Parser$Advanced$inContext,
	'link destination',
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$url$Url$percentEncode),
					$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$lessThan)),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$greaterThan)),
					$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$greaterThan))),
				$elm$parser$Parser$Advanced$getChompedString(
				$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore(
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isWhitespace)))
			])));
var $dillonkearns$elm_markdown$Parser$Token$closingSquareBracket = A2(
	$elm$parser$Parser$Advanced$Token,
	']',
	$elm$parser$Parser$Expecting('a `]`'));
var $dillonkearns$elm_markdown$Parser$Token$openingSquareBracket = A2(
	$elm$parser$Parser$Advanced$Token,
	'[',
	$elm$parser$Parser$Expecting('a `[`'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$labelParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel),
		$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$openingSquareBracket)),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$closingSquareBracket)),
		$elm$parser$Parser$Advanced$symbol(
			A2(
				$elm$parser$Parser$Advanced$Token,
				']:',
				$elm$parser$Parser$Expecting(']:')))));
var $dillonkearns$elm_markdown$Parser$Token$doubleQuote = A2(
	$elm$parser$Parser$Advanced$Token,
	'\"',
	$elm$parser$Parser$Expecting('a double quote'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine = function (str) {
	return A2($elm$core$String$contains, '\n\n', str) ? $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Expecting('no blank line')) : $elm$parser$Parser$Advanced$succeed(str);
};
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline = A2(
	$elm$parser$Parser$Advanced$ignorer,
	$elm$parser$Parser$Advanced$chompWhile(
		function (c) {
			return (!$dillonkearns$elm_markdown$Whitespace$isLineEnd(c)) && $dillonkearns$elm_markdown$Whitespace$isWhitespace(c);
		}),
	$dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
var $dillonkearns$elm_markdown$Whitespace$requiredWhitespace = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$chompIf,
		$dillonkearns$elm_markdown$Whitespace$isWhitespace,
		$elm$parser$Parser$Expecting('Required whitespace')),
	$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isWhitespace));
var $dillonkearns$elm_markdown$Parser$Token$singleQuote = A2(
	$elm$parser$Parser$Advanced$Token,
	'\'',
	$elm$parser$Parser$Expecting('a single quote'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$titleParser = function () {
	var inSingleQuotes = A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$singleQuote)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$singleQuote))),
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$singleQuote)),
			$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
	var inDoubleQuotes = A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$doubleQuote)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$doubleQuote))),
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$doubleQuote)),
			$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'title',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$backtrackable(
					A2(
						$elm$parser$Parser$Advanced$keeper,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
							$dillonkearns$elm_markdown$Whitespace$requiredWhitespace),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									inDoubleQuotes,
									inSingleQuotes,
									$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing)
								])))),
					A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing),
					$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline)
				])));
}();
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$parser = A2(
	$elm$parser$Parser$Advanced$inContext,
	'link reference definition',
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						F3(
							function (label, destination, title) {
								return _Utils_Tuple2(
									label,
									{co: destination, b7: title});
							})),
					$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$labelParser,
							$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									$dillonkearns$elm_markdown$Whitespace$lineEnd,
									$elm$parser$Parser$Advanced$succeed(0)
								]))),
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))),
			$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$destinationParser),
		$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$titleParser));
var $dillonkearns$elm_markdown$ThematicBreak$ThematicBreak = 0;
var $dillonkearns$elm_markdown$ThematicBreak$whitespace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab);
var $dillonkearns$elm_markdown$ThematicBreak$withChar = function (tchar) {
	var token = $dillonkearns$elm_markdown$Parser$Token$parseString(
		$elm$core$String$fromChar(tchar));
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								$elm$parser$Parser$Advanced$succeed(0),
								token),
							$dillonkearns$elm_markdown$ThematicBreak$whitespace),
						token),
					$dillonkearns$elm_markdown$ThematicBreak$whitespace),
				token),
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return _Utils_eq(c, tchar) || $dillonkearns$elm_markdown$Whitespace$isSpaceOrTab(c);
				})),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
};
var $dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$dillonkearns$elm_markdown$ThematicBreak$withChar('-'),
			$dillonkearns$elm_markdown$ThematicBreak$withChar('*'),
			$dillonkearns$elm_markdown$ThematicBreak$withChar('_')
		]));
var $dillonkearns$elm_markdown$ThematicBreak$parser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						$dillonkearns$elm_markdown$Whitespace$space),
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								$dillonkearns$elm_markdown$Whitespace$space,
								$elm$parser$Parser$Advanced$succeed(0)
							]))),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$dillonkearns$elm_markdown$Whitespace$space,
							$elm$parser$Parser$Advanced$succeed(0)
						]))),
			$dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak),
			$dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak
		]));
var $dillonkearns$elm_markdown$Markdown$RawBlock$LevelOne = 0;
var $dillonkearns$elm_markdown$Markdown$RawBlock$LevelTwo = 1;
var $dillonkearns$elm_markdown$Markdown$RawBlock$SetextLine = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Parser$Token$equals = A2(
	$elm$parser$Parser$Advanced$Token,
	'=',
	$elm$parser$Parser$Expecting('a `=`'));
var $dillonkearns$elm_markdown$Parser$Token$minus = A2(
	$elm$parser$Parser$Advanced$Token,
	'-',
	$elm$parser$Parser$Expecting('a `-`'));
var $dillonkearns$elm_markdown$Markdown$Parser$setextLineParser = function () {
	var setextLevel = F3(
		function (level, levelToken, levelChar) {
			return A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(level),
					$elm$parser$Parser$Advanced$token(levelToken)),
				$elm$parser$Parser$Advanced$chompWhile(
					$elm$core$Basics$eq(levelChar)));
		});
	return A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (raw, level) {
				return A2($dillonkearns$elm_markdown$Markdown$RawBlock$SetextLine, level, raw);
			}),
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								A3(setextLevel, 0, $dillonkearns$elm_markdown$Parser$Token$equals, '='),
								A3(setextLevel, 1, $dillonkearns$elm_markdown$Parser$Token$minus, '-')
							])),
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
				$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
}();
var $dillonkearns$elm_markdown$Markdown$RawBlock$TableDelimiter = function (a) {
	return {$: 9, a: a};
};
var $dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab);
var $dillonkearns$elm_markdown$Parser$Extra$maybeChomp = function (condition) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$chompIf,
				condition,
				$elm$parser$Parser$Problem('Character not found')),
				$elm$parser$Parser$Advanced$succeed(0)
			]));
};
var $dillonkearns$elm_markdown$Markdown$TableParser$requirePipeIfNotFirst = function (columns) {
	return $elm$core$List$isEmpty(columns) ? $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Parser$Token$parseString('|'),
				$elm$parser$Parser$Advanced$succeed(0)
			])) : $dillonkearns$elm_markdown$Parser$Token$parseString('|');
};
var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowHelp = function (revDelimiterColumns) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
					},
					$dillonkearns$elm_markdown$Parser$Token$parseString('|\n'))),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
				},
				$dillonkearns$elm_markdown$Parser$Token$parseString('\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('end'))),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							$elm$parser$Parser$Advanced$Done(revDelimiterColumns)),
						$dillonkearns$elm_markdown$Parser$Token$parseString('|')),
					$elm$parser$Parser$Advanced$end(
						$elm$parser$Parser$Expecting('end')))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							function (column) {
								return $elm$parser$Parser$Advanced$Loop(
									A2($elm$core$List$cons, column, revDelimiterColumns));
							}),
						$dillonkearns$elm_markdown$Markdown$TableParser$requirePipeIfNotFirst(revDelimiterColumns)),
					$dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$getChompedString(
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								A2(
									$elm$parser$Parser$Advanced$ignorer,
									$elm$parser$Parser$Advanced$succeed(0),
									$dillonkearns$elm_markdown$Parser$Extra$maybeChomp(
										function (c) {
											return c === ':';
										})),
								$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore(
									function (c) {
										return c === '-';
									})),
							$dillonkearns$elm_markdown$Parser$Extra$maybeChomp(
								function (c) {
									return c === ':';
								}))),
					$dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace))
			]));
};
var $dillonkearns$elm_markdown$Markdown$Block$AlignCenter = 2;
var $dillonkearns$elm_markdown$Markdown$Block$AlignLeft = 0;
var $dillonkearns$elm_markdown$Markdown$Block$AlignRight = 1;
var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterToAlignment = function (cell) {
	var _v0 = _Utils_Tuple2(
		A2($elm$core$String$startsWith, ':', cell),
		A2($elm$core$String$endsWith, ':', cell));
	if (_v0.a) {
		if (_v0.b) {
			return $elm$core$Maybe$Just(2);
		} else {
			return $elm$core$Maybe$Just(0);
		}
	} else {
		if (_v0.b) {
			return $elm$core$Maybe$Just(1);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowParser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (delimiterRow) {
		var trimmed = delimiterRow.a.b9;
		var headers = delimiterRow.b;
		return $elm$core$List$isEmpty(headers) ? $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Expecting('Must have at least one column in delimiter row.')) : ((($elm$core$List$length(headers) === 1) && (!(A2($elm$core$String$startsWith, '|', trimmed) && A2($elm$core$String$endsWith, '|', trimmed)))) ? $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Tables with a single column must have pipes at the start and end of the delimiter row to avoid ambiguity.')) : $elm$parser$Parser$Advanced$succeed(delimiterRow));
	},
	A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (delimiterText, revDelimiterColumns) {
				return A2(
					$dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow,
					{
						bS: delimiterText,
						b9: $elm$core$String$trim(delimiterText)
					},
					A2(
						$elm$core$List$map,
						$dillonkearns$elm_markdown$Markdown$TableParser$delimiterToAlignment,
						$elm$core$List$reverse(revDelimiterColumns)));
			}),
		A2($elm$parser$Parser$Advanced$loop, _List_Nil, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowHelp)));
var $dillonkearns$elm_markdown$Markdown$Parser$tableDelimiterInOpenParagraph = A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$Markdown$RawBlock$TableDelimiter, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowParser);
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $dillonkearns$elm_markdown$Markdown$TableParser$standardizeRowLength = F2(
	function (expectedLength, row) {
		var rowLength = $elm$core$List$length(row);
		var _v0 = A2($elm$core$Basics$compare, expectedLength, rowLength);
		switch (_v0) {
			case 0:
				return A2($elm$core$List$take, expectedLength, row);
			case 1:
				return row;
			default:
				return _Utils_ap(
					row,
					A2($elm$core$List$repeat, expectedLength - rowLength, ''));
		}
	});
var $dillonkearns$elm_markdown$Markdown$TableParser$bodyRowParser = function (expectedRowLength) {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		function (row) {
			return ($elm$core$List$isEmpty(row) || A2($elm$core$List$all, $elm$core$String$isEmpty, row)) ? $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Problem('A line must have at least one column')) : $elm$parser$Parser$Advanced$succeed(
				A2($dillonkearns$elm_markdown$Markdown$TableParser$standardizeRowLength, expectedRowLength, row));
		},
		$dillonkearns$elm_markdown$Markdown$TableParser$rowParser);
};
var $dillonkearns$elm_markdown$Markdown$Parser$tableRowIfTableStarted = function (_v0) {
	var headers = _v0.a;
	var body = _v0.b;
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (row) {
			return $dillonkearns$elm_markdown$Markdown$RawBlock$Table(
				A2(
					$dillonkearns$elm_markdown$Markdown$Table$Table,
					headers,
					_Utils_ap(
						body,
						_List_fromArray(
							[row]))));
		},
		$dillonkearns$elm_markdown$Markdown$TableParser$bodyRowParser(
			$elm$core$List$length(headers)));
};
var $dillonkearns$elm_markdown$Markdown$Block$H1 = 0;
var $dillonkearns$elm_markdown$Markdown$Block$H2 = 1;
var $dillonkearns$elm_markdown$Markdown$Block$H3 = 2;
var $dillonkearns$elm_markdown$Markdown$Block$H4 = 3;
var $dillonkearns$elm_markdown$Markdown$Block$H5 = 4;
var $dillonkearns$elm_markdown$Markdown$Block$H6 = 5;
var $dillonkearns$elm_markdown$Markdown$Parser$toHeading = function (level) {
	switch (level) {
		case 1:
			return $elm$core$Result$Ok(0);
		case 2:
			return $elm$core$Result$Ok(1);
		case 3:
			return $elm$core$Result$Ok(2);
		case 4:
			return $elm$core$Result$Ok(3);
		case 5:
			return $elm$core$Result$Ok(4);
		case 6:
			return $elm$core$Result$Ok(5);
		default:
			return $elm$core$Result$Err(
				$elm$parser$Parser$Expecting(
					'A heading with 1 to 6 #\'s, but found ' + $elm$core$String$fromInt(level)));
	}
};
var $dillonkearns$elm_markdown$Markdown$ListItem$EmptyItem = {$: 2};
var $dillonkearns$elm_markdown$Markdown$ListItem$PlainItem = function (a) {
	return {$: 1, a: a};
};
var $dillonkearns$elm_markdown$Markdown$ListItem$TaskItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$UnorderedList$getIntendedCodeItem = F4(
	function (markerStartPos, listMarker, markerEndPos, _v0) {
		var bodyStartPos = _v0.a;
		var item = _v0.b;
		var spaceNum = bodyStartPos - markerEndPos;
		if (spaceNum <= 4) {
			return _Utils_Tuple3(listMarker, bodyStartPos - markerStartPos, item);
		} else {
			var intendedCodeItem = function () {
				switch (item.$) {
					case 0:
						var completion = item.a;
						var string = item.b;
						return A2(
							$dillonkearns$elm_markdown$Markdown$ListItem$TaskItem,
							completion,
							_Utils_ap(
								A2($elm$core$String$repeat, spaceNum - 1, ' '),
								string));
					case 1:
						var string = item.a;
						return $dillonkearns$elm_markdown$Markdown$ListItem$PlainItem(
							_Utils_ap(
								A2($elm$core$String$repeat, spaceNum - 1, ' '),
								string));
					default:
						return $dillonkearns$elm_markdown$Markdown$ListItem$EmptyItem;
				}
			}();
			return _Utils_Tuple3(listMarker, (markerEndPos - markerStartPos) + 1, intendedCodeItem);
		}
	});
var $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListEmptyItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (bodyStartPos) {
			return _Utils_Tuple2(bodyStartPos, $dillonkearns$elm_markdown$Markdown$ListItem$EmptyItem);
		}),
	A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getCol, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$ListItem$Complete = 1;
var $dillonkearns$elm_markdown$Markdown$ListItem$Incomplete = 0;
var $dillonkearns$elm_markdown$Markdown$ListItem$taskItemParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[x] ',
					$elm$parser$Parser$ExpectingSymbol('[x] ')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[X] ',
					$elm$parser$Parser$ExpectingSymbol('[X] ')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(0),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[ ] ',
					$elm$parser$Parser$ExpectingSymbol('[ ] '))))
		]));
var $dillonkearns$elm_markdown$Markdown$ListItem$parser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$TaskItem),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$Markdown$ListItem$taskItemParser,
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))),
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$PlainItem)
			])),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListItemBodyParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (bodyStartPos, item) {
						return _Utils_Tuple2(bodyStartPos, item);
					})),
			$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
		$elm$parser$Parser$Advanced$getCol),
	$dillonkearns$elm_markdown$Markdown$ListItem$parser);
var $dillonkearns$elm_markdown$Markdown$UnorderedList$Asterisk = 2;
var $dillonkearns$elm_markdown$Markdown$UnorderedList$Minus = 0;
var $dillonkearns$elm_markdown$Markdown$UnorderedList$Plus = 1;
var $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListMarkerParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(0),
				A2($dillonkearns$elm_markdown$Parser$Extra$upTo, 3, $dillonkearns$elm_markdown$Whitespace$space)),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'-',
					$elm$parser$Parser$ExpectingSymbol('-')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'+',
					$elm$parser$Parser$ExpectingSymbol('+')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(2),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'*',
					$elm$parser$Parser$ExpectingSymbol('*'))))
		]));
var $dillonkearns$elm_markdown$Markdown$UnorderedList$parser = function (previousWasBody) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$UnorderedList$getIntendedCodeItem),
					$elm$parser$Parser$Advanced$getCol),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListMarkerParser)),
			$elm$parser$Parser$Advanced$getCol),
		previousWasBody ? $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListItemBodyParser : $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[$dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListEmptyItemParser, $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListItemBodyParser])));
};
var $dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock = function (previousWasBody) {
	var parseListItem = F2(
		function (listmarker, unparsedListItem) {
			switch (unparsedListItem.$) {
				case 0:
					var completion = unparsedListItem.a;
					var body = unparsedListItem.b;
					return {
						aC: body,
						cF: listmarker,
						k: $elm$core$Maybe$Just(
							function () {
								if (completion === 1) {
									return true;
								} else {
									return false;
								}
							}())
					};
				case 1:
					var body = unparsedListItem.a;
					return {aC: body, cF: listmarker, k: $elm$core$Maybe$Nothing};
				default:
					return {aC: '', cF: listmarker, k: $elm$core$Maybe$Nothing};
			}
		});
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (_v0) {
			var listmarker = _v0.a;
			var intended = _v0.b;
			var unparsedListItem = _v0.c;
			return A4(
				$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
				true,
				intended,
				_List_Nil,
				A2(parseListItem, listmarker, unparsedListItem));
		},
		$dillonkearns$elm_markdown$Markdown$UnorderedList$parser(previousWasBody));
};
var $dillonkearns$elm_markdown$Markdown$Parser$childToBlocks = F2(
	function (node, blocks) {
		switch (node.$) {
			case 0:
				var tag = node.a;
				var attributes = node.b;
				var children = node.c;
				var _v106 = $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks(children);
				if (!_v106.$) {
					var childrenAsBlocks = _v106.a;
					var block = $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
						A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, childrenAsBlocks));
					return $elm$core$Result$Ok(
						A2($elm$core$List$cons, block, blocks));
				} else {
					var err = _v106.a;
					return $elm$core$Result$Err(err);
				}
			case 1:
				var innerText = node.a;
				var _v107 = $dillonkearns$elm_markdown$Markdown$Parser$parse(innerText);
				if (!_v107.$) {
					var value = _v107.a;
					return $elm$core$Result$Ok(
						_Utils_ap(
							$elm$core$List$reverse(value),
							blocks));
				} else {
					var error = _v107.a;
					return $elm$core$Result$Err(
						$elm$parser$Parser$Expecting(
							A2(
								$elm$core$String$join,
								'\n',
								A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
				}
			case 2:
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string)),
						blocks));
			case 3:
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Block$Cdata(string)),
						blocks));
			case 4:
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string)),
						blocks));
			default:
				var declarationType = node.a;
				var content = node.b;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content)),
						blocks));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$completeBlocks = function (state) {
	var _v91 = state.b;
	_v91$5:
	while (true) {
		if (_v91.b) {
			switch (_v91.a.$) {
				case 11:
					var body2 = _v91.a.a;
					var rest = _v91.b;
					var _v92 = A2(
						$elm$parser$Parser$Advanced$run,
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
						body2);
					if (!_v92.$) {
						var value = _v92.a;
						return $elm$parser$Parser$Advanced$succeed(
							{
								a: _Utils_ap(state.a, value.a),
								b: A2(
									$elm$core$List$cons,
									$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value.b),
									rest)
							});
					} else {
						var error = _v92.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(error)));
					}
				case 3:
					var _v93 = _v91.a;
					var tight = _v93.a;
					var intended = _v93.b;
					var closeListItems = _v93.c;
					var openListItem = _v93.d;
					var rest = _v91.b;
					var _v94 = A2(
						$elm$parser$Parser$Advanced$run,
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
						openListItem.aC);
					if (!_v94.$) {
						var value = _v94.a;
						var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
						return $elm$parser$Parser$Advanced$succeed(
							{
								a: _Utils_ap(state.a, value.a),
								b: A2(
									$elm$core$List$cons,
									A4(
										$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
										tight2,
										intended,
										A2(
											$elm$core$List$cons,
											{aC: value.b, k: openListItem.k},
											closeListItems),
										openListItem),
									rest)
							});
					} else {
						var e = _v94.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
					}
				case 4:
					var _v99 = _v91.a;
					var tight = _v99.a;
					var intended = _v99.b;
					var marker = _v99.c;
					var order = _v99.d;
					var closeListItems = _v99.e;
					var openListItem = _v99.f;
					var rest = _v91.b;
					var _v100 = A2(
						$elm$parser$Parser$Advanced$run,
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
						openListItem);
					if (!_v100.$) {
						var value = _v100.a;
						var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
						return $elm$parser$Parser$Advanced$succeed(
							{
								a: _Utils_ap(state.a, value.a),
								b: A2(
									$elm$core$List$cons,
									A6(
										$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
										tight2,
										intended,
										marker,
										order,
										A2($elm$core$List$cons, value.b, closeListItems),
										openListItem),
									rest)
							});
					} else {
						var e = _v100.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
					}
				case 10:
					if (_v91.b.b) {
						switch (_v91.b.a.$) {
							case 3:
								var _v95 = _v91.a;
								var _v96 = _v91.b;
								var _v97 = _v96.a;
								var tight = _v97.a;
								var intended = _v97.b;
								var closeListItems = _v97.c;
								var openListItem = _v97.d;
								var rest = _v96.b;
								var _v98 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem.aC);
								if (!_v98.$) {
									var value = _v98.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												A4(
													$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
													tight2,
													intended,
													A2(
														$elm$core$List$cons,
														{aC: value.b, k: openListItem.k},
														closeListItems),
													openListItem),
												rest)
										});
								} else {
									var e = _v98.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
							case 4:
								var _v101 = _v91.a;
								var _v102 = _v91.b;
								var _v103 = _v102.a;
								var tight = _v103.a;
								var intended = _v103.b;
								var marker = _v103.c;
								var order = _v103.d;
								var closeListItems = _v103.e;
								var openListItem = _v103.f;
								var rest = _v102.b;
								var _v104 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem);
								if (!_v104.$) {
									var value = _v104.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												A6(
													$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
													tight2,
													intended,
													marker,
													order,
													A2($elm$core$List$cons, value.b, closeListItems),
													openListItem),
												rest)
										});
								} else {
									var e = _v104.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
							default:
								break _v91$5;
						}
					} else {
						break _v91$5;
					}
				default:
					break _v91$5;
			}
		} else {
			break _v91$5;
		}
	}
	return $elm$parser$Parser$Advanced$succeed(state);
};
var $dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks = F2(
	function (state, newRawBlock) {
		var _v41 = _Utils_Tuple2(newRawBlock, state.b);
		_v41$13:
		while (true) {
			if (_v41.b.b) {
				switch (_v41.b.a.$) {
					case 5:
						if (_v41.a.$ === 5) {
							var block1 = _v41.a.a;
							var _v42 = _v41.b;
							var block2 = _v42.a.a;
							var rest = _v42.b;
							return $elm$parser$Parser$Advanced$succeed(
								{
									a: state.a,
									b: A2(
										$elm$core$List$cons,
										$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock(
											{
												aC: A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block2.aC, block1.aC),
												aN: $elm$core$Maybe$Nothing
											}),
										rest)
								});
						} else {
							break _v41$13;
						}
					case 6:
						switch (_v41.a.$) {
							case 6:
								var block1 = _v41.a.a;
								var _v43 = _v41.b;
								var block2 = _v43.a.a;
								var rest = _v43.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock(
												A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block2, block1)),
											rest)
									});
							case 10:
								var _v44 = _v41.a;
								var _v45 = _v41.b;
								var block = _v45.a.a;
								var rest = _v45.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock(
												A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block, '\n')),
											rest)
									});
							default:
								break _v41$13;
						}
					case 11:
						var _v46 = _v41.b;
						var body2 = _v46.a.a;
						var rest = _v46.b;
						switch (newRawBlock.$) {
							case 11:
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(
												A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, body2, body1)),
											rest)
									});
							case 1:
								var body1 = newRawBlock.a;
								var _v48 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (!_v48.$) {
									var value = _v48.a;
									var _v49 = value.b;
									if (_v49.b) {
										var last = _v49.a;
										if ($dillonkearns$elm_markdown$Markdown$Parser$endWithOpenBlockOrParagraph(last) && (!A2($elm$core$String$endsWith, '\n', body2))) {
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: state.a,
													b: A2(
														$elm$core$List$cons,
														$dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(
															A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, body2, body1)),
														rest)
												});
										} else {
											var _v50 = A2(
												$elm$parser$Parser$Advanced$run,
												$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
												body2);
											if (!_v50.$) {
												var value1 = _v50.a;
												return $elm$parser$Parser$Advanced$succeed(
													{
														a: _Utils_ap(state.a, value.a),
														b: A2(
															$elm$core$List$cons,
															newRawBlock,
															A2(
																$elm$core$List$cons,
																$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value1.b),
																rest))
													});
											} else {
												var e1 = _v50.a;
												return $elm$parser$Parser$Advanced$problem(
													$elm$parser$Parser$Problem(
														$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e1)));
											}
										}
									} else {
										var _v51 = A2(
											$elm$parser$Parser$Advanced$run,
											$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
											body2);
										if (!_v51.$) {
											var value1 = _v51.a;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value1.b),
															rest))
												});
										} else {
											var e1 = _v51.a;
											return $elm$parser$Parser$Advanced$problem(
												$elm$parser$Parser$Problem(
													$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e1)));
										}
									}
								} else {
									var e = _v48.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
							case 6:
								var body1 = newRawBlock.a;
								var _v52 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (!_v52.$) {
									var value = _v52.a;
									var _v53 = value.b;
									if (_v53.b && (_v53.a.$ === 1)) {
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: state.a,
												b: A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(
														A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, ' ', body2, body1)),
													rest)
											});
									} else {
										var _v54 = A2(
											$elm$parser$Parser$Advanced$run,
											$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
											body2);
										if (!_v54.$) {
											var value1 = _v54.a;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value1.b),
															rest))
												});
										} else {
											var e1 = _v54.a;
											return $elm$parser$Parser$Advanced$problem(
												$elm$parser$Parser$Problem(
													$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e1)));
										}
									}
								} else {
									var e = _v52.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
							default:
								var _v55 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (!_v55.$) {
									var value = _v55.a;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value.b),
													rest))
										});
								} else {
									var e = _v55.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 3:
						var _v56 = _v41.b;
						var _v57 = _v56.a;
						var tight = _v57.a;
						var intended1 = _v57.b;
						var closeListItems2 = _v57.c;
						var openListItem2 = _v57.d;
						var rest = _v56.b;
						switch (newRawBlock.$) {
							case 3:
								var intended2 = newRawBlock.b;
								var openListItem1 = newRawBlock.d;
								if (_Utils_eq(openListItem2.cF, openListItem1.cF)) {
									var _v59 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.aC);
									if (!_v59.$) {
										var value = _v59.a;
										return A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														false,
														intended2,
														A2(
															$elm$core$List$cons,
															{aC: value.b, k: openListItem2.k},
															closeListItems2),
														openListItem1),
													rest)
											}) : $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														tight,
														intended2,
														A2(
															$elm$core$List$cons,
															{aC: value.b, k: openListItem2.k},
															closeListItems2),
														openListItem1),
													rest)
											});
									} else {
										var e = _v59.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								} else {
									var _v60 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.aC);
									if (!_v60.$) {
										var value = _v60.a;
										var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													newRawBlock,
													A2(
														$elm$core$List$cons,
														A4(
															$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
															tight2,
															intended1,
															A2(
																$elm$core$List$cons,
																{aC: value.b, k: openListItem2.k},
																closeListItems2),
															openListItem1),
														rest))
											});
									} else {
										var e = _v60.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								}
							case 1:
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											A4(
												$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
												tight,
												intended1,
												closeListItems2,
												_Utils_update(
													openListItem2,
													{
														aC: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', openListItem2.aC, body1)
													})),
											rest)
									});
							default:
								var _v61 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem2.aC);
								if (!_v61.$) {
									var value = _v61.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														tight2,
														intended1,
														A2(
															$elm$core$List$cons,
															{aC: value.b, k: openListItem2.k},
															closeListItems2),
														openListItem2),
													rest))
										});
								} else {
									var e = _v61.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 4:
						var _v62 = _v41.b;
						var _v63 = _v62.a;
						var tight = _v63.a;
						var intended1 = _v63.b;
						var marker = _v63.c;
						var order = _v63.d;
						var closeListItems2 = _v63.e;
						var openListItem2 = _v63.f;
						var rest = _v62.b;
						switch (newRawBlock.$) {
							case 4:
								var intended2 = newRawBlock.b;
								var marker2 = newRawBlock.c;
								var openListItem1 = newRawBlock.f;
								if (_Utils_eq(marker, marker2)) {
									var _v65 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (!_v65.$) {
										var value = _v65.a;
										var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													A6(
														$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
														tight2,
														intended2,
														marker,
														order,
														A2($elm$core$List$cons, value.b, closeListItems2),
														openListItem1),
													rest)
											});
									} else {
										var e = _v65.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								} else {
									var _v66 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (!_v66.$) {
										var value = _v66.a;
										var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													newRawBlock,
													A2(
														$elm$core$List$cons,
														A6(
															$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
															tight2,
															intended1,
															marker,
															order,
															A2($elm$core$List$cons, value.b, closeListItems2),
															openListItem2),
														rest))
											});
									} else {
										var e = _v66.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								}
							case 1:
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended1, marker, order, closeListItems2, openListItem2 + ('\n' + body1)),
											rest)
									});
							default:
								var _v67 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem2);
								if (!_v67.$) {
									var value = _v67.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													A6(
														$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
														tight2,
														intended1,
														marker,
														order,
														A2($elm$core$List$cons, value.b, closeListItems2),
														openListItem2),
													rest))
										});
								} else {
									var e = _v67.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 1:
						switch (_v41.a.$) {
							case 1:
								var body1 = _v41.a.a;
								var _v68 = _v41.b;
								var body2 = _v68.a.a;
								var rest = _v68.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
												A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', body2, body1)),
											rest)
									});
							case 13:
								if (!_v41.a.a) {
									var _v69 = _v41.a;
									var _v70 = _v69.a;
									var _v71 = _v41.b;
									var unparsedInlines = _v71.a.a;
									var rest = _v71.b;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												A2($dillonkearns$elm_markdown$Markdown$RawBlock$Heading, 1, unparsedInlines),
												rest)
										});
								} else {
									var _v72 = _v41.a;
									var _v73 = _v72.a;
									var _v74 = _v41.b;
									var unparsedInlines = _v74.a.a;
									var rest = _v74.b;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												A2($dillonkearns$elm_markdown$Markdown$RawBlock$Heading, 2, unparsedInlines),
												rest)
										});
								}
							case 9:
								var _v75 = _v41.a.a;
								var text = _v75.a;
								var alignments = _v75.b;
								var _v76 = _v41.b;
								var rawHeaders = _v76.a.a;
								var rest = _v76.b;
								var _v77 = A2(
									$dillonkearns$elm_markdown$Markdown$TableParser$parseHeader,
									A2($dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow, text, alignments),
									rawHeaders);
								if (!_v77.$) {
									var headers = _v77.a;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												$dillonkearns$elm_markdown$Markdown$RawBlock$Table(
													A2($dillonkearns$elm_markdown$Markdown$Table$Table, headers, _List_Nil)),
												rest)
										});
								} else {
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												$dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
													A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', rawHeaders, text.bS)),
												rest)
										});
								}
							default:
								break _v41$13;
						}
					case 8:
						if (_v41.a.$ === 8) {
							var updatedTable = _v41.a.a;
							var _v78 = _v41.b;
							var rest = _v78.b;
							return $elm$parser$Parser$Advanced$succeed(
								{
									a: state.a,
									b: A2(
										$elm$core$List$cons,
										$dillonkearns$elm_markdown$Markdown$RawBlock$Table(updatedTable),
										rest)
								});
						} else {
							break _v41$13;
						}
					case 10:
						if (_v41.b.b.b) {
							switch (_v41.b.b.a.$) {
								case 4:
									var _v79 = _v41.b;
									var _v80 = _v79.a;
									var _v81 = _v79.b;
									var _v82 = _v81.a;
									var tight = _v82.a;
									var intended1 = _v82.b;
									var marker = _v82.c;
									var order = _v82.d;
									var closeListItems2 = _v82.e;
									var openListItem2 = _v82.f;
									var rest = _v81.b;
									var _v83 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (!_v83.$) {
										var value = _v83.a;
										if (newRawBlock.$ === 4) {
											var intended2 = newRawBlock.b;
											var openListItem = newRawBlock.f;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														A6(
															$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
															false,
															intended2,
															marker,
															order,
															A2($elm$core$List$cons, value.b, closeListItems2),
															openListItem),
														rest)
												});
										} else {
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
															A2(
																$elm$core$List$cons,
																A6(
																	$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
																	tight,
																	intended1,
																	marker,
																	order,
																	A2($elm$core$List$cons, value.b, closeListItems2),
																	openListItem2),
																rest)))
												});
										}
									} else {
										var e = _v83.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								case 3:
									var _v85 = _v41.b;
									var _v86 = _v85.a;
									var _v87 = _v85.b;
									var _v88 = _v87.a;
									var tight = _v88.a;
									var intended1 = _v88.b;
									var closeListItems2 = _v88.c;
									var openListItem2 = _v88.d;
									var rest = _v87.b;
									var _v89 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.aC);
									if (!_v89.$) {
										var value = _v89.a;
										if (newRawBlock.$ === 3) {
											var openListItem = newRawBlock.d;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														A4(
															$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
															false,
															intended1,
															A2(
																$elm$core$List$cons,
																{aC: value.b, k: openListItem2.k},
																closeListItems2),
															openListItem),
														rest)
												});
										} else {
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
															A2(
																$elm$core$List$cons,
																A4(
																	$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
																	tight,
																	intended1,
																	A2(
																		$elm$core$List$cons,
																		{aC: value.b, k: openListItem2.k},
																		closeListItems2),
																	openListItem2),
																rest)))
												});
										}
									} else {
										var e = _v89.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								default:
									break _v41$13;
							}
						} else {
							break _v41$13;
						}
					default:
						break _v41$13;
				}
			} else {
				break _v41$13;
			}
		}
		return $elm$parser$Parser$Advanced$succeed(
			{
				a: state.a,
				b: A2($elm$core$List$cons, newRawBlock, state.b)
			});
	});
var $dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper = F2(
	function (referencesDict, _v36) {
		var unparsedInlines = _v36;
		var mappedReferencesDict = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond(
					function (_v37) {
						var destination = _v37.co;
						var title = _v37.b7;
						return _Utils_Tuple2(destination, title);
					}),
				referencesDict));
		return A2(
			$elm$core$List$map,
			$dillonkearns$elm_markdown$Markdown$Parser$mapInline,
			A2($dillonkearns$elm_markdown$Markdown$InlineParser$parse, mappedReferencesDict, unparsedInlines));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$mapInline = function (inline) {
	switch (inline.$) {
		case 0:
			var string = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$Text(string);
		case 1:
			return $dillonkearns$elm_markdown$Markdown$Block$HardLineBreak;
		case 2:
			var string = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$CodeSpan(string);
		case 3:
			var string = inline.a;
			var maybeString = inline.b;
			var inlines = inline.c;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Block$Link,
				string,
				maybeString,
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
		case 4:
			var string = inline.a;
			var maybeString = inline.b;
			var inlines = inline.c;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Block$Image,
				string,
				maybeString,
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
		case 5:
			var node = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$HtmlInline(
				$dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock(node));
		case 6:
			var level = inline.a;
			var inlines = inline.b;
			switch (level) {
				case 1:
					return $dillonkearns$elm_markdown$Markdown$Block$Emphasis(
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
				case 2:
					return $dillonkearns$elm_markdown$Markdown$Block$Strong(
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
				default:
					return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(level) ? $dillonkearns$elm_markdown$Markdown$Block$Strong(
						_List_fromArray(
							[
								$dillonkearns$elm_markdown$Markdown$Parser$mapInline(
								A2($dillonkearns$elm_markdown$Markdown$Inline$Emphasis, level - 2, inlines))
							])) : $dillonkearns$elm_markdown$Markdown$Block$Emphasis(
						_List_fromArray(
							[
								$dillonkearns$elm_markdown$Markdown$Parser$mapInline(
								A2($dillonkearns$elm_markdown$Markdown$Inline$Emphasis, level - 1, inlines))
							]));
			}
		default:
			var inlines = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$Strikethrough(
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock = function (node) {
	switch (node.$) {
		case 1:
			return $dillonkearns$elm_markdown$Markdown$Block$HtmlComment('TODO this never happens, but use types to drop this case.');
		case 0:
			var tag = node.a;
			var attributes = node.b;
			var children = node.c;
			var parseChild = function (child) {
				if (child.$ === 1) {
					var text = child.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$textNodeToBlocks(text);
				} else {
					return _List_fromArray(
						[
							$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock(child))
						]);
				}
			};
			return A3(
				$dillonkearns$elm_markdown$Markdown$Block$HtmlElement,
				tag,
				attributes,
				A2($elm$core$List$concatMap, parseChild, children));
		case 2:
			var string = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string);
		case 3:
			var string = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$Cdata(string);
		case 4:
			var string = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string);
		default:
			var declarationType = node.a;
			var content = node.b;
			return A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content);
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks = function (children) {
	return A2($dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksHelp, children, _List_Nil);
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksHelp = F2(
	function (remaining, soFar) {
		nodesToBlocksHelp:
		while (true) {
			if (remaining.b) {
				var node = remaining.a;
				var rest = remaining.b;
				var _v31 = A2($dillonkearns$elm_markdown$Markdown$Parser$childToBlocks, node, soFar);
				if (!_v31.$) {
					var newSoFar = _v31.a;
					var $temp$remaining = rest,
						$temp$soFar = newSoFar;
					remaining = $temp$remaining;
					soFar = $temp$soFar;
					continue nodesToBlocksHelp;
				} else {
					var e = _v31.a;
					return $elm$core$Result$Err(e);
				}
			} else {
				return $elm$core$Result$Ok(
					$elm$core$List$reverse(soFar));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parse = function (input) {
	var _v27 = A2(
		$elm$parser$Parser$Advanced$run,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
			$dillonkearns$elm_markdown$Helpers$endOfFile),
		input);
	if (_v27.$ === 1) {
		var e = _v27.a;
		return $elm$core$Result$Err(e);
	} else {
		var v = _v27.a;
		var _v28 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(v);
		if (_v28.$ === 1) {
			var e = _v28.a;
			return A2(
				$elm$parser$Parser$Advanced$run,
				$elm$parser$Parser$Advanced$problem(e),
				'');
		} else {
			var blocks = _v28.a;
			var isNotEmptyParagraph = function (block) {
				if ((block.$ === 5) && (!block.a.b)) {
					return false;
				} else {
					return true;
				}
			};
			return $elm$core$Result$Ok(
				A2($elm$core$List$filter, isNotEmptyParagraph, blocks));
		}
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines = function (state) {
	return A3($dillonkearns$elm_markdown$Markdown$Parser$parseAllInlinesHelp, state, state.b, _List_Nil);
};
var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlinesHelp = F3(
	function (state, rawBlocks, parsedBlocks) {
		parseAllInlinesHelp:
		while (true) {
			if (rawBlocks.b) {
				var rawBlock = rawBlocks.a;
				var rest = rawBlocks.b;
				var _v26 = A2($dillonkearns$elm_markdown$Markdown$Parser$parseInlines, state.a, rawBlock);
				switch (_v26.$) {
					case 1:
						var newParsedBlock = _v26.a;
						var $temp$state = state,
							$temp$rawBlocks = rest,
							$temp$parsedBlocks = A2($elm$core$List$cons, newParsedBlock, parsedBlocks);
						state = $temp$state;
						rawBlocks = $temp$rawBlocks;
						parsedBlocks = $temp$parsedBlocks;
						continue parseAllInlinesHelp;
					case 0:
						var $temp$state = state,
							$temp$rawBlocks = rest,
							$temp$parsedBlocks = parsedBlocks;
						state = $temp$state;
						rawBlocks = $temp$rawBlocks;
						parsedBlocks = $temp$parsedBlocks;
						continue parseAllInlinesHelp;
					default:
						var e = _v26.a;
						return $elm$core$Result$Err(e);
				}
			} else {
				return $elm$core$Result$Ok(parsedBlocks);
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseHeaderInlines = F2(
	function (linkReferences, header) {
		return A2(
			$elm$core$List$map,
			function (_v24) {
				var label = _v24.Q;
				var alignment = _v24.ai;
				return A3(
					$dillonkearns$elm_markdown$Markdown$Parser$parseRawInline,
					linkReferences,
					function (parsedHeaderLabel) {
						return {ai: alignment, Q: parsedHeaderLabel};
					},
					label);
			},
			header);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseInlines = F2(
	function (linkReferences, rawBlock) {
		switch (rawBlock.$) {
			case 0:
				var level = rawBlock.a;
				var unparsedInlines = rawBlock.b;
				var _v17 = $dillonkearns$elm_markdown$Markdown$Parser$toHeading(level);
				if (!_v17.$) {
					var parsedLevel = _v17.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
						A2(
							$dillonkearns$elm_markdown$Markdown$Block$Heading,
							parsedLevel,
							A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
				} else {
					var e = _v17.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem(e);
				}
			case 1:
				var unparsedInlines = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$Paragraph(
						A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
			case 2:
				var html = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(html));
			case 3:
				var tight = rawBlock.a;
				var unparsedItems = rawBlock.c;
				var parseItem = F2(
					function (rawBlockTask, rawBlocks) {
						var blocksTask = function () {
							if (!rawBlockTask.$) {
								if (!rawBlockTask.a) {
									return 1;
								} else {
									return 2;
								}
							} else {
								return 0;
							}
						}();
						var blocks = function () {
							var _v18 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(
								{a: linkReferences, b: rawBlocks});
							if (!_v18.$) {
								var parsedBlocks = _v18.a;
								return parsedBlocks;
							} else {
								return _List_Nil;
							}
						}();
						return A2($dillonkearns$elm_markdown$Markdown$Block$ListItem, blocksTask, blocks);
					});
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					A2(
						$dillonkearns$elm_markdown$Markdown$Block$UnorderedList,
						$dillonkearns$elm_markdown$Markdown$Parser$isTightBoolToListDisplay(tight),
						$elm$core$List$reverse(
							A2(
								$elm$core$List$map,
								function (item) {
									return A2(parseItem, item.k, item.aC);
								},
								unparsedItems))));
			case 4:
				var tight = rawBlock.a;
				var startingIndex = rawBlock.d;
				var unparsedItems = rawBlock.e;
				var parseItem = function (rawBlocks) {
					var _v20 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(
						{a: linkReferences, b: rawBlocks});
					if (!_v20.$) {
						var parsedBlocks = _v20.a;
						return parsedBlocks;
					} else {
						return _List_Nil;
					}
				};
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					A3(
						$dillonkearns$elm_markdown$Markdown$Block$OrderedList,
						$dillonkearns$elm_markdown$Markdown$Parser$isTightBoolToListDisplay(tight),
						startingIndex,
						$elm$core$List$reverse(
							A2($elm$core$List$map, parseItem, unparsedItems))));
			case 5:
				var codeBlock = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$CodeBlock(codeBlock));
			case 7:
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$ThematicBreak);
			case 10:
				return $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock;
			case 11:
				return $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock;
			case 12:
				var rawBlocks = rawBlock.a;
				var _v21 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(
					{a: linkReferences, b: rawBlocks});
				if (!_v21.$) {
					var parsedBlocks = _v21.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
						$dillonkearns$elm_markdown$Markdown$Block$BlockQuote(parsedBlocks));
				} else {
					var e = _v21.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem(e);
				}
			case 6:
				var codeBlockBody = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$CodeBlock(
						{aC: codeBlockBody, aN: $elm$core$Maybe$Nothing}));
			case 8:
				var _v22 = rawBlock.a;
				var header = _v22.a;
				var rows = _v22.b;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					A2(
						$dillonkearns$elm_markdown$Markdown$Block$Table,
						A2($dillonkearns$elm_markdown$Markdown$Parser$parseHeaderInlines, linkReferences, header),
						A2($dillonkearns$elm_markdown$Markdown$Parser$parseRowInlines, linkReferences, rows)));
			case 9:
				var _v23 = rawBlock.a;
				var text = _v23.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$Paragraph(
						A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, text.bS)));
			default:
				var raw = rawBlock.b;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$Paragraph(
						A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, raw)));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseRawInline = F3(
	function (linkReferences, wrap, unparsedInlines) {
		return wrap(
			A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseRowInlines = F2(
	function (linkReferences, rows) {
		return A2(
			$elm$core$List$map,
			function (row) {
				return A2(
					$elm$core$List$map,
					function (column) {
						return A3($dillonkearns$elm_markdown$Markdown$Parser$parseRawInline, linkReferences, $elm$core$Basics$identity, column);
					},
					row);
			},
			rows);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$stepRawBlock = function (revStmts) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return $elm$parser$Parser$Advanced$Done(revStmts);
				},
				$dillonkearns$elm_markdown$Helpers$endOfFile),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (reference) {
					return $elm$parser$Parser$Advanced$Loop(
						A2($dillonkearns$elm_markdown$Markdown$Parser$addReference, revStmts, reference));
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$parser)),
				function () {
				var _v3 = revStmts.b;
				_v3$6:
				while (true) {
					if (_v3.b) {
						switch (_v3.a.$) {
							case 1:
								return A2(
									$elm$parser$Parser$Advanced$map,
									function (block) {
										return $elm$parser$Parser$Advanced$Loop(block);
									},
									A2(
										$elm$parser$Parser$Advanced$andThen,
										$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser()));
							case 8:
								var table = _v3.a.a;
								return A2(
									$elm$parser$Parser$Advanced$map,
									function (block) {
										return $elm$parser$Parser$Advanced$Loop(block);
									},
									A2(
										$elm$parser$Parser$Advanced$andThen,
										$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
										$elm$parser$Parser$Advanced$oneOf(
											_List_fromArray(
												[
													$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser(),
													$dillonkearns$elm_markdown$Markdown$Parser$tableRowIfTableStarted(table)
												]))));
							case 3:
								var _v4 = _v3.a;
								var tight = _v4.a;
								var intended = _v4.b;
								var closeListItems = _v4.c;
								var openListItem = _v4.d;
								var rest = _v3.b;
								var completeOrMergeUnorderedListBlockBlankLine = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
													A2(
														$elm$core$List$cons,
														A4(
															$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
															tight,
															intended,
															closeListItems,
															_Utils_update(
																openListItem,
																{
																	aC: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '', openListItem.aC, newString)
																})),
														rest))
											});
									});
								var completeOrMergeUnorderedListBlock = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														tight,
														intended,
														closeListItems,
														_Utils_update(
															openListItem,
															{
																aC: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', openListItem.aC, newString)
															})),
													rest)
											});
									});
								return $elm$parser$Parser$Advanced$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												function (_v5) {
													return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
												},
												$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												completeOrMergeUnorderedListBlock(revStmts),
												A2(
													$elm$parser$Parser$Advanced$keeper,
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
														$elm$parser$Parser$Advanced$symbol(
															A2(
																$elm$parser$Parser$Advanced$Token,
																A2($elm$core$String$repeat, intended, ' '),
																$elm$parser$Parser$ExpectingSymbol('Indentation')))),
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
														$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$andThen,
												$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
												$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList()))
										]));
							case 4:
								var _v10 = _v3.a;
								var tight = _v10.a;
								var intended = _v10.b;
								var marker = _v10.c;
								var order = _v10.d;
								var closeListItems = _v10.e;
								var openListItem = _v10.f;
								var rest = _v3.b;
								var completeOrMergeUnorderedListBlockBlankLine = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
													A2(
														$elm$core$List$cons,
														A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
														rest))
											});
									});
								var completeOrMergeUnorderedListBlock = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
													rest)
											});
									});
								return $elm$parser$Parser$Advanced$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												function (_v11) {
													return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
												},
												$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												completeOrMergeUnorderedListBlock(revStmts),
												A2(
													$elm$parser$Parser$Advanced$keeper,
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
														$elm$parser$Parser$Advanced$symbol(
															A2(
																$elm$parser$Parser$Advanced$Token,
																A2($elm$core$String$repeat, intended, ' '),
																$elm$parser$Parser$ExpectingSymbol('Indentation')))),
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
														$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$andThen,
												$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
												$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList()))
										]));
							case 10:
								if (_v3.b.b) {
									switch (_v3.b.a.$) {
										case 3:
											var _v6 = _v3.a;
											var _v7 = _v3.b;
											var _v8 = _v7.a;
											var tight = _v8.a;
											var intended = _v8.b;
											var closeListItems = _v8.c;
											var openListItem = _v8.d;
											var rest = _v7.b;
											var completeOrMergeUnorderedListBlockBlankLine = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
																A2(
																	$elm$core$List$cons,
																	A4(
																		$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
																		tight,
																		intended,
																		closeListItems,
																		_Utils_update(
																			openListItem,
																			{
																				aC: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '', openListItem.aC, newString)
																			})),
																	rest))
														});
												});
											var completeOrMergeUnorderedListBlock = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																A4(
																	$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
																	tight,
																	intended,
																	closeListItems,
																	_Utils_update(
																		openListItem,
																		{
																			aC: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', openListItem.aC, newString)
																		})),
																rest)
														});
												});
											return ($elm$core$String$trim(openListItem.aC) === '') ? A2(
												$elm$parser$Parser$Advanced$map,
												function (block) {
													return $elm$parser$Parser$Advanced$Loop(block);
												},
												A2(
													$elm$parser$Parser$Advanced$andThen,
													$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
													$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser())) : $elm$parser$Parser$Advanced$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															function (_v9) {
																return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
															},
															$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															completeOrMergeUnorderedListBlock(revStmts),
															A2(
																$elm$parser$Parser$Advanced$keeper,
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
																	$elm$parser$Parser$Advanced$symbol(
																		A2(
																			$elm$parser$Parser$Advanced$Token,
																			A2($elm$core$String$repeat, intended, ' '),
																			$elm$parser$Parser$ExpectingSymbol('Indentation')))),
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
																	$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$andThen,
															$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
															$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()))
													]));
										case 4:
											var _v12 = _v3.a;
											var _v13 = _v3.b;
											var _v14 = _v13.a;
											var tight = _v14.a;
											var intended = _v14.b;
											var marker = _v14.c;
											var order = _v14.d;
											var closeListItems = _v14.e;
											var openListItem = _v14.f;
											var rest = _v13.b;
											var completeOrMergeUnorderedListBlockBlankLine = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
																A2(
																	$elm$core$List$cons,
																	A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
																	rest))
														});
												});
											var completeOrMergeUnorderedListBlock = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
																rest)
														});
												});
											return ($elm$core$String$trim(openListItem) === '') ? A2(
												$elm$parser$Parser$Advanced$map,
												function (block) {
													return $elm$parser$Parser$Advanced$Loop(block);
												},
												A2(
													$elm$parser$Parser$Advanced$andThen,
													$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
													$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser())) : $elm$parser$Parser$Advanced$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															function (_v15) {
																return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
															},
															$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															completeOrMergeUnorderedListBlock(revStmts),
															A2(
																$elm$parser$Parser$Advanced$keeper,
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
																	$elm$parser$Parser$Advanced$symbol(
																		A2(
																			$elm$parser$Parser$Advanced$Token,
																			A2($elm$core$String$repeat, intended, ' '),
																			$elm$parser$Parser$ExpectingSymbol('Indentation')))),
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
																	$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$andThen,
															$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
															$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()))
													]));
										default:
											break _v3$6;
									}
								} else {
									break _v3$6;
								}
							default:
								break _v3$6;
						}
					} else {
						break _v3$6;
					}
				}
				return A2(
					$elm$parser$Parser$Advanced$map,
					function (block) {
						return $elm$parser$Parser$Advanced$Loop(block);
					},
					A2(
						$elm$parser$Parser$Advanced$andThen,
						$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()));
			}(),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (block) {
					return $elm$parser$Parser$Advanced$Loop(block);
				},
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
					$dillonkearns$elm_markdown$Markdown$Parser$openBlockOrParagraphParser))
			]));
};
var $dillonkearns$elm_markdown$Markdown$Parser$textNodeToBlocks = function (textNodeValue) {
	return A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		$dillonkearns$elm_markdown$Markdown$Parser$parse(textNodeValue));
};
var $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode = function (xmlNode) {
	switch (xmlNode.$) {
		case 1:
			var innerText = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(innerText));
		case 0:
			var tag = xmlNode.a;
			var attributes = xmlNode.b;
			var children = xmlNode.c;
			var _v1 = $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks(children);
			if (!_v1.$) {
				var parsedChildren = _v1.a;
				return $elm$parser$Parser$Advanced$succeed(
					$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
						A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, parsedChildren)));
			} else {
				var err = _v1.a;
				return $elm$parser$Parser$Advanced$problem(err);
			}
		case 2:
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					$dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string)));
		case 3:
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					$dillonkearns$elm_markdown$Markdown$Block$Cdata(string)));
		case 4:
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					$dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string)));
		default:
			var declarationType = xmlNode.a;
			var content = xmlNode.b;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content)));
	}
};
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser() {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		$dillonkearns$elm_markdown$Markdown$Parser$completeBlocks,
		A2(
			$elm$parser$Parser$Advanced$loop,
			{a: _List_Nil, b: _List_Nil},
			$dillonkearns$elm_markdown$Markdown$Parser$stepRawBlock));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$dillonkearns$elm_markdown$Markdown$Parser$blankLine,
				$dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$indentedCodeBlock,
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v40) {
					return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock(false),
				$dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(false),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser()
			]));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$dillonkearns$elm_markdown$Markdown$Parser$blankLine,
				$dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Parser$setextLineParser),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v39) {
					return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock(true),
				$dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(true),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser(),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Parser$tableDelimiterInOpenParagraph)
			]));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$dillonkearns$elm_markdown$Markdown$Parser$blankLine,
				$dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v38) {
					return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock(false),
				$dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(false),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser()
			]));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser() {
	return A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode, $dillonkearns$elm_markdown$HtmlParser$html);
}
var $dillonkearns$elm_markdown$Markdown$Parser$rawBlockParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser();
$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser = function () {
	return $dillonkearns$elm_markdown$Markdown$Parser$rawBlockParser;
};
var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser();
$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser = function () {
	return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser;
};
var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser();
$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser = function () {
	return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser;
};
var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterList = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList();
$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList = function () {
	return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterList;
};
var $dillonkearns$elm_markdown$Markdown$Parser$htmlParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser();
$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser = function () {
	return $dillonkearns$elm_markdown$Markdown$Parser$htmlParser;
};
var $author$project$View$Markdown$replaceRegex = F3(
	function (pattern, replacer, target) {
		var _v0 = $elm$regex$Regex$fromString(pattern);
		if (!_v0.$) {
			var regex = _v0.a;
			return A3($elm$regex$Regex$replace, regex, replacer, target);
		} else {
			return target;
		}
	});
var $author$project$View$Markdown$preprocessMathForParser = function (input) {
	return A2(
		$elm$core$String$join,
		'```',
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, part) {
					return (A2($elm$core$Basics$modBy, 2, index) === 1) ? part : A3(
						$author$project$View$Markdown$replaceRegex,
						'(^|[^\\\\])\\$(?!\\s)(?!\\d+(?:\\.\\d+)?(?:\\s|〜|~|-|to))([^\\$\\n]+?)(?<!\\s)\\$(?!\\d)',
						function (m) {
							var _v1 = m.b4;
							if (((_v1.b && (!_v1.a.$)) && _v1.b.b) && (!_v1.b.a.$)) {
								var prefix = _v1.a.a;
								var _v2 = _v1.b;
								var formula = _v2.a.a;
								return prefix + ('`math ' + (formula + '`'));
							} else {
								return m.bB;
							}
						},
						A3(
							$author$project$View$Markdown$replaceRegex,
							'\\$\\$([\\s\\S]+?)\\$\\$',
							function (m) {
								var _v0 = m.b4;
								if (_v0.b && (!_v0.a.$)) {
									var formula = _v0.a.a;
									return '\n```math\n' + ($elm$core$String$trim(formula) + '\n```\n');
								} else {
									return m.bB;
								}
							},
							A3(
								$elm$core$String$replace,
								'\\)',
								'`',
								A3(
									$elm$core$String$replace,
									'\\(',
									'`math ',
									A3(
										$elm$core$String$replace,
										'\\\\)',
										'`',
										A3(
											$elm$core$String$replace,
											'\\\\(',
											'`math ',
											A3(
												$elm$core$String$replace,
												'\\]',
												'\n```\n',
												A3(
													$elm$core$String$replace,
													'\\[',
													'\n```math\n',
													A3(
														$elm$core$String$replace,
														'\\\\]',
														'\n```\n',
														A3($elm$core$String$replace, '\\\\[', '\n```math\n', part))))))))));
				}),
			A2($elm$core$String$split, '```', input)));
};
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 1) {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 1) {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$combineResults = A2(
	$elm$core$List$foldr,
	$elm$core$Result$map2($elm$core$List$cons),
	$elm$core$Result$Ok(_List_Nil));
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $dillonkearns$elm_markdown$Markdown$Block$foldl = F3(
	function (_function, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var block = list.a;
				var remainingBlocks = list.b;
				switch (block.$) {
					case 0:
						var html = block.a;
						if (!html.$) {
							var children = html.c;
							var $temp$function = _function,
								$temp$acc = A2(_function, block, acc),
								$temp$list = _Utils_ap(children, remainingBlocks);
							_function = $temp$function;
							acc = $temp$acc;
							list = $temp$list;
							continue foldl;
						} else {
							var $temp$function = _function,
								$temp$acc = A2(_function, block, acc),
								$temp$list = remainingBlocks;
							_function = $temp$function;
							acc = $temp$acc;
							list = $temp$list;
							continue foldl;
						}
					case 1:
						var blocks = block.b;
						var childBlocks = A2(
							$elm$core$List$concatMap,
							function (_v3) {
								var children = _v3.b;
								return children;
							},
							blocks);
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(childBlocks, remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 2:
						var blocks = block.c;
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(
							$elm$core$List$concat(blocks),
							remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 3:
						var blocks = block.a;
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(blocks, remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 4:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 5:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 6:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 7:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					default:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText = function (block) {
	switch (block.$) {
		case 5:
			var inlines = block.a;
			return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
		case 0:
			var html = block.a;
			if (!html.$) {
				var blocks = html.c;
				return A3(
					$dillonkearns$elm_markdown$Markdown$Block$foldl,
					F2(
						function (nestedBlock, soFar) {
							return _Utils_ap(
								soFar,
								$dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText(nestedBlock));
						}),
					'',
					blocks);
			} else {
				return '';
			}
		case 1:
			var items = block.b;
			return A2(
				$elm$core$String$join,
				'\n',
				A2(
					$elm$core$List$map,
					function (_v4) {
						var blocks = _v4.b;
						return A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
					},
					items));
		case 2:
			var items = block.c;
			return A2(
				$elm$core$String$join,
				'\n',
				A2(
					$elm$core$List$map,
					function (blocks) {
						return A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
					},
					items));
		case 3:
			var blocks = block.a;
			return A2(
				$elm$core$String$join,
				'\n',
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
		case 4:
			var inlines = block.b;
			return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
		case 6:
			var header = block.a;
			var rows = block.b;
			return A2(
				$elm$core$String$join,
				'\n',
				$elm$core$List$concat(
					_List_fromArray(
						[
							A2(
							$elm$core$List$map,
							$dillonkearns$elm_markdown$Markdown$Block$extractInlineText,
							A2(
								$elm$core$List$map,
								function ($) {
									return $.Q;
								},
								header)),
							$elm$core$List$concat(
							A2(
								$elm$core$List$map,
								$elm$core$List$map($dillonkearns$elm_markdown$Markdown$Block$extractInlineText),
								rows))
						])));
		case 7:
			var body = block.a.aC;
			return body;
		default:
			return '';
	}
};
var $dillonkearns$elm_markdown$Markdown$Block$extractInlineText = function (inlines) {
	return A3($elm$core$List$foldl, $dillonkearns$elm_markdown$Markdown$Block$extractTextHelp, '', inlines);
};
var $dillonkearns$elm_markdown$Markdown$Block$extractTextHelp = F2(
	function (inline, text) {
		switch (inline.$) {
			case 7:
				var str = inline.a;
				return _Utils_ap(text, str);
			case 8:
				return text + ' ';
			case 6:
				var str = inline.a;
				return _Utils_ap(text, str);
			case 1:
				var inlines = inline.c;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			case 2:
				var inlines = inline.c;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			case 0:
				var html = inline.a;
				if (!html.$) {
					var blocks = html.c;
					return A3(
						$dillonkearns$elm_markdown$Markdown$Block$foldl,
						F2(
							function (block, soFar) {
								return _Utils_ap(
									soFar,
									$dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText(block));
							}),
						text,
						blocks);
				} else {
					return text;
				}
			case 4:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			case 3:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			default:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHtml = F5(
	function (tagName, attributes, children, _v0, renderedChildren) {
		var htmlRenderer = _v0;
		return A2(
			$elm$core$Result$andThen,
			function (okChildren) {
				return A2(
					$elm$core$Result$map,
					function (myRenderer) {
						return myRenderer(okChildren);
					},
					A3(htmlRenderer, tagName, attributes, children));
			},
			$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(renderedChildren));
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$foldThing = F3(
	function (renderer, topLevelInline, soFar) {
		var _v12 = A2($dillonkearns$elm_markdown$Markdown$Renderer$renderSingleInline, renderer, topLevelInline);
		if (!_v12.$) {
			var inline = _v12.a;
			return A2($elm$core$List$cons, inline, soFar);
		} else {
			return soFar;
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHelper = F2(
	function (renderer, blocks) {
		return A2(
			$elm$core$List$filterMap,
			$dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle(renderer),
			blocks);
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle = function (renderer) {
	return function (block) {
		switch (block.$) {
			case 4:
				var level = block.a;
				var content = block.b;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (children) {
							return renderer.bs(
								{
									bf: children,
									X: level,
									bT: $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(content)
								});
						},
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content)));
			case 5:
				var content = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.aT,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content)));
			case 0:
				var html = block.a;
				if (!html.$) {
					var tag = html.a;
					var attributes = html.b;
					var children = html.c;
					return $elm$core$Maybe$Just(
						A4($dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			case 1:
				var tight = block.a;
				var items = block.b;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (listItems) {
							return renderer.a7(
								A2(
									$elm$core$List$map,
									function (_v7) {
										var task = _v7.a;
										var children = _v7.b;
										return A2(
											$dillonkearns$elm_markdown$Markdown$Block$ListItem,
											task,
											$elm$core$List$concat(children));
									},
									listItems));
						},
						$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
							A2(
								$elm$core$List$map,
								function (_v4) {
									var task = _v4.a;
									var children = _v4.b;
									return A2(
										$elm$core$Result$map,
										$dillonkearns$elm_markdown$Markdown$Block$ListItem(task),
										$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
											function (blocks) {
												return A2(
													$elm$core$List$filterMap,
													function (listItemBlock) {
														var _v5 = _Utils_Tuple2(tight, listItemBlock);
														if ((_v5.a === 1) && (_v5.b.$ === 5)) {
															var _v6 = _v5.a;
															var content = _v5.b.a;
															return $elm$core$Maybe$Just(
																A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content));
														} else {
															return A2(
																$elm$core$Maybe$map,
																$elm$core$Result$map($elm$core$List$singleton),
																A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle, renderer, listItemBlock));
														}
													},
													blocks);
											}(children)));
								},
								items))));
			case 2:
				var tight = block.a;
				var startingIndex = block.b;
				var items = block.c;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (listItems) {
							return A2(
								renderer.aS,
								startingIndex,
								A2(
									$elm$core$List$map,
									function (children) {
										return $elm$core$List$concat(children);
									},
									listItems));
						},
						$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
							A2(
								$elm$core$List$map,
								function (itemsblocks) {
									return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
										function (blocks) {
											return A2(
												$elm$core$List$filterMap,
												function (listItemBlock) {
													var _v8 = _Utils_Tuple2(tight, listItemBlock);
													if ((_v8.a === 1) && (_v8.b.$ === 5)) {
														var _v9 = _v8.a;
														var content = _v8.b.a;
														return $elm$core$Maybe$Just(
															A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content));
													} else {
														return A2(
															$elm$core$Maybe$map,
															$elm$core$Result$map($elm$core$List$singleton),
															A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle, renderer, listItemBlock));
													}
												},
												blocks);
										}(itemsblocks));
								},
								items))));
			case 7:
				var codeBlock = block.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.ck(codeBlock)));
			case 8:
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(renderer.a6));
			case 3:
				var nestedBlocks = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.aB,
						$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
							A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, nestedBlocks))));
			default:
				var header = block.a;
				var rows = block.b;
				var renderedHeaderCells = $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
					A2(
						$elm$core$List$map,
						function (_v11) {
							var label = _v11.Q;
							var alignment = _v11.ai;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(alignment),
								A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, label));
						},
						header));
				var renderedHeader = A2(
					$elm$core$Result$map,
					function (listListView) {
						return renderer.a3(
							$elm$core$List$singleton(
								renderer.ax(
									A2(
										$elm$core$List$map,
										function (_v10) {
											var maybeAlignment = _v10.a;
											var item = _v10.b;
											return A2(renderer.a4, maybeAlignment, item);
										},
										listListView))));
					},
					renderedHeaderCells);
				var renderedBody = function (r) {
					return $elm$core$List$isEmpty(r) ? _List_Nil : _List_fromArray(
						[
							renderer.a1(r)
						]);
				};
				var alignmentForColumn = function (columnIndex) {
					return A2(
						$elm$core$Maybe$andThen,
						function ($) {
							return $.ai;
						},
						$elm$core$List$head(
							A2($elm$core$List$drop, columnIndex, header)));
				};
				var renderRow = function (cells) {
					return A2(
						$elm$core$Result$map,
						renderer.ax,
						A2(
							$elm$core$Result$map,
							$elm$core$List$indexedMap(
								F2(
									function (index, cell) {
										return A2(
											renderer.a2,
											alignmentForColumn(index),
											cell);
									})),
							$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
								A2(
									$elm$core$List$map,
									$dillonkearns$elm_markdown$Markdown$Renderer$renderStyled(renderer),
									cells))));
				};
				var renderedRows = $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
					A2($elm$core$List$map, renderRow, rows));
				return $elm$core$Maybe$Just(
					A3(
						$elm$core$Result$map2,
						F2(
							function (h, r) {
								return renderer.cY(
									A2(
										$elm$core$List$cons,
										h,
										renderedBody(r)));
							}),
						renderedHeader,
						renderedRows));
		}
	};
};
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode = F4(
	function (renderer, tag, attributes, children) {
		return A5(
			$dillonkearns$elm_markdown$Markdown$Renderer$renderHtml,
			tag,
			attributes,
			children,
			renderer.aJ,
			A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, children));
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderSingleInline = F2(
	function (renderer, inline) {
		switch (inline.$) {
			case 4:
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.a$,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 3:
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.aE,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 5:
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.a_,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 2:
				var src = inline.a;
				var title = inline.b;
				var children = inline.c;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.aK(
							{
								aA: $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(children),
								aY: src,
								b7: title
							})));
			case 7:
				var string = inline.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.M(string)));
			case 6:
				var string = inline.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.cl(string)));
			case 1:
				var destination = inline.a;
				var title = inline.b;
				var inlines = inline.c;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$andThen,
						function (children) {
							return $elm$core$Result$Ok(
								A2(
									renderer.aP,
									{co: destination, b7: title},
									children));
						},
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, inlines)));
			case 8:
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(renderer.aH));
			default:
				var html = inline.a;
				if (!html.$) {
					var tag = html.a;
					var attributes = html.b;
					var children = html.c;
					return $elm$core$Maybe$Just(
						A4($dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderStyled = F2(
	function (renderer, styledStrings) {
		return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
			A3(
				$elm$core$List$foldr,
				$dillonkearns$elm_markdown$Markdown$Renderer$foldThing(renderer),
				_List_Nil,
				styledStrings));
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$render = F2(
	function (renderer, ast) {
		return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
			A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, ast));
	});
var $author$project$View$Markdown$viewPlainContent = F4(
	function (theme, style, size, raw) {
		return A2(
			$elm$html$Html$div,
			A3($author$project$View$MarkdownStyles$markdownContainer, theme, style, size),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-sm text-amber-700')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Markdownの解析に失敗しました。データが正しくない可能性があります。')
						])),
					A2(
					$elm$html$Html$pre,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(raw)
						]))
				]));
	});
var $author$project$View$Markdown$render = F5(
	function (theme, style, size, searchText, markdownRaw) {
		if ($elm$core$String$isEmpty(
			$elm$core$String$trim(markdownRaw))) {
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		} else {
			var topSpacer = A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('h-16 w-full')
					]),
				_List_Nil);
			var processedMarkdown = $author$project$View$Markdown$preprocessMathForParser(markdownRaw);
			var parsed = $dillonkearns$elm_markdown$Markdown$Parser$parse(processedMarkdown);
			var bottomSpacer = A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('h-32 w-full')
					]),
				_List_Nil);
			if (!parsed.$) {
				var blocks = parsed.a;
				var _v1 = A2(
					$dillonkearns$elm_markdown$Markdown$Renderer$render,
					A3($author$project$View$Markdown$customRenderer, theme, style, searchText),
					blocks);
				if (!_v1.$) {
					var renderedHtmls = _v1.a;
					return A2(
						$elm$html$Html$div,
						A3($author$project$View$MarkdownStyles$markdownContainer, theme, style, size),
						A2(
							$elm$core$List$cons,
							topSpacer,
							_Utils_ap(
								renderedHtmls,
								_List_fromArray(
									[bottomSpacer]))));
				} else {
					return A4($author$project$View$Markdown$viewPlainContent, theme, style, size, markdownRaw);
				}
			} else {
				return A4($author$project$View$Markdown$viewPlainContent, theme, style, size, markdownRaw);
			}
		}
	});
var $author$project$View$MainArea$viewMarkdownView = F2(
	function (model, page) {
		var paddingClass = function () {
			var _v0 = model.ab;
			switch (_v0) {
				case 0:
					var _v1 = model.cm;
					switch (_v1) {
						case 0:
							return 'px-32';
						case 1:
							return 'px-16';
						default:
							return 'px-4';
					}
				case 1:
					var _v2 = model.cm;
					switch (_v2) {
						case 0:
							return 'px-64';
						case 1:
							return 'px-32';
						default:
							return 'px-8';
					}
				default:
					var _v3 = model.cm;
					switch (_v3) {
						case 0:
							return 'px-64';
						case 1:
							return 'px-32';
						default:
							return 'px-8';
					}
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('markdown-container'),
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						_List_fromArray(
							['h-full', 'w-full', paddingClass])))
				]),
			_List_fromArray(
				[
					A5($author$project$View$Markdown$render, model.bh, model.cR, model.cw, model.bY, page.bi)
				]));
	});
var $author$project$Type$DragPage = 2;
var $author$project$View$Reorder$reorderStyle = {
	bG: F2(
		function (theme, isSelected) {
			var borderClass = function () {
				switch (theme) {
					case 0:
						return '';
					case 1:
						return '';
					default:
						return '';
				}
			}();
			var base = _List_fromArray(
				[
					'aspect-[3/4]',
					'flex',
					'flex-col',
					'border-2',
					'transition-all',
					'cursor-pointer',
					'overflow-hidden',
					'w-full',
					'text-left',
					'items-stretch',
					$author$project$View$Style$basecolors(theme).aj,
					$author$project$View$Style$basecolors(theme).aW
				]);
			var activeBorder = isSelected ? _List_fromArray(
				[
					'ring-2',
					'ring-blue-200',
					$author$project$View$Style$basecolors(theme).bd
				]) : _List_fromArray(
				[
					$author$project$View$Style$basecolors(theme).cg
				]);
			return $author$project$View$Style$tw(
				_Utils_ap(base, activeBorder));
		}),
	cN: $author$project$View$Style$tw(
		_List_fromArray(
			['absolute', 'inset-x-0', 'bottom-0', 'h-8', 'bg-gradient-to-t', 'from-white', 'to-transparent'])),
	bH: function (theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'px-2',
					'border-b',
					$author$project$View$Style$basecolors(theme).a0,
					$author$project$View$Style$basecolors(theme).cg,
					'flex',
					'justify-between',
					'items-center'
				]));
	},
	bI: function (theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'text-[12px]',
					'font-black',
					$author$project$View$Style$basecolors(theme).M
				]));
	},
	bJ: function (theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'absolute',
					'inset-0',
					'origin-top-left',
					'font-bold',
					'text-xs',
					'p-2',
					'pointer-events-none',
					'whitespace-normal',
					'break-words',
					$author$project$View$Style$basecolors(theme).cc,
					$author$project$View$Style$basecolors(theme).ch
				]));
	},
	bV: $author$project$View$Style$tw(
		_List_fromArray(
			['grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'xl:grid-cols-5', 'gap-8', 'py-24', 'px-8']))
};
var $author$project$Type$Create = {$: 1};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$View$Style$buttonBaseStyle = F2(
	function (theme, kind) {
		var kindStyles = function () {
			switch (kind.$) {
				case 0:
					return _List_fromArray(
						['text-red-500', 'p-1']);
				case 1:
					return _List_fromArray(
						[
							$author$project$View$Style$basecolors(theme).cf,
							$author$project$View$Style$basecolors(theme).M,
							$author$project$View$Style$basecolors(theme).cg,
							'hover:bg-white/25',
							'border-2',
							'rounded-lg',
							'p-4',
							'px-4',
							'py-2',
							'w-full',
							'aspect-[3/4]'
						]);
				case 2:
					return _List_fromArray(
						[
							'mt-8',
							'w-1/3',
							'p-4',
							'border-2',
							'border-solid',
							'text-sm',
							'font-bold',
							'hover:opacity-80',
							'shadow-sm',
							$author$project$View$Style$basecolors(theme).cg,
							$author$project$View$Style$basecolors(theme).aW,
							$author$project$View$Style$basecolors(theme).M
						]);
				case 3:
					var _v1 = kind.a;
					var top = _v1.a;
					var right = _v1.b;
					return _List_fromArray(
						[
							'absolute',
							'top-' + $elm$core$String$fromInt(top),
							'right-' + $elm$core$String$fromInt(right),
							$author$project$View$Style$basecolors(theme).M,
							'p-2',
							'hover:text-red-500'
						]);
				default:
					return _List_fromArray(
						[
							'px-1',
							'text-[12px]',
							'font-bold',
							'uppercase',
							'hover:bg-white/10',
							'transition-colors',
							$author$project$View$Style$basecolors(theme).cZ,
							'border',
							'rounded-sm',
							$author$project$View$Style$basecolors(theme).cg
						]);
			}
		}();
		var base = _List_fromArray(
			['transition-all', 'duration-200', 'active:scale-95', 'flex', 'items-center', 'justify-center']);
		return $author$project$View$Style$tw(
			_Utils_ap(base, kindStyles));
	});
var $author$project$View$ViewHelper$stopClickPropagation = function (msg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $author$project$View$ViewHelper$viewButton = F4(
	function (theme, kind, msg, content) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$View$Style$buttonBaseStyle, theme, kind)),
					$author$project$View$ViewHelper$stopClickPropagation(msg)
				]),
			_List_fromArray(
				[content]));
	});
var $author$project$View$Reorder$viewAddPageCard = function (model) {
	var page = A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.R;
				},
				$elm$core$List$length),
			$author$project$Domain$Helper$getCurrentBook(model.x)));
	return A4(
		$author$project$View$ViewHelper$viewButton,
		model.bh,
		$author$project$Type$Create,
		$author$project$Type$CreatePage(page),
		$elm$html$Html$text('+ PAGE'));
};
var $author$project$Type$ChangeMode = function (a) {
	return {$: 15, a: a};
};
var $author$project$Type$SelectPage = function (a) {
	return {$: 12, a: a};
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onDoubleClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'dblclick',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Type$Delete = {$: 0};
var $author$project$Type$DeletePage = function (a) {
	return {$: 11, a: a};
};
var $author$project$View$Reorder$viewPageCardHeader = F3(
	function (model, index, pageId) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Reorder$reorderStyle.bH(model.bh))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$Reorder$reorderStyle.bI(model.bh))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Page. ' + $elm$core$String$fromInt(index + 1))
						])),
					A4(
					$author$project$View$ViewHelper$viewButton,
					model.bh,
					$author$project$Type$Delete,
					$author$project$Type$DeletePage(pageId),
					$elm$html$Html$text('×'))
				]));
	});
var $author$project$View$Reorder$viewPageCardPreview = F3(
	function (model, index, content) {
		var previewText = function () {
			var trimmed = $elm$core$String$trim(content);
			return $elm$core$String$isEmpty(trimmed) ? ('Page ' + $elm$core$String$fromInt(index + 1)) : A2($elm$core$String$left, 200, trimmed);
		}();
		var allHeadings = A2($author$project$Domain$Helper$extractHeadings, index, content);
		var actualHeadings = function () {
			if (allHeadings.b && (!allHeadings.b.b)) {
				var h = allHeadings.a;
				return (_Utils_eq(
					h.M,
					'Page ' + $elm$core$String$fromInt(index + 1)) && (!A2($elm$core$String$contains, '#', content))) ? _List_Nil : allHeadings;
			} else {
				return allHeadings;
			}
		}();
		var h1List = A2(
			$elm$core$List$filter,
			function (h) {
				return h.X === 1;
			},
			actualHeadings);
		var h2List = A2(
			$elm$core$List$filter,
			function (h) {
				return h.X === 2;
			},
			actualHeadings);
		var h3List = A2(
			$elm$core$List$filter,
			function (h) {
				return h.X === 3;
			},
			actualHeadings);
		var items = (!$elm$core$List$isEmpty(h1List)) ? A2(
			$elm$core$List$map,
			function (h) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('truncate')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('# ' + h.M)
						]));
			},
			h1List) : ((!$elm$core$List$isEmpty(h2List)) ? A2(
			$elm$core$List$map,
			function (h) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('truncate opacity-90')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('## ' + h.M)
						]));
			},
			h2List) : ((!$elm$core$List$isEmpty(h3List)) ? A2(
			$elm$core$List$map,
			function (h) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('truncate opacity-80')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('### ' + h.M)
						]));
			},
			h3List) : _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-xs break-words whitespace-pre-wrap opacity-70')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(previewText)
					]))
			])));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex-1 p-2 overflow-hidden relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$Reorder$reorderStyle.bJ(model.bh))
						]),
					items)
				]));
	});
var $author$project$View$Reorder$viewPageCard = F5(
	function (model, present, index, page, pageId) {
		var isSelected = _Utils_eq(present.an, index);
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$View$Reorder$reorderStyle.bG, model.bh, isSelected)),
					$elm$html$Html$Events$onClick(
					$author$project$Type$SelectPage(index)),
					$elm$html$Html$Events$onDoubleClick(
					$author$project$Type$ChangeMode(1))
				]),
			_List_fromArray(
				[
					A3($author$project$View$Reorder$viewPageCardHeader, model, index, pageId),
					A3($author$project$View$Reorder$viewPageCardPreview, model, index, page.bi)
				]));
	});
var $author$project$Type$DragEnd = {$: 39};
var $author$project$Type$DragOver = function (a) {
	return {$: 38, a: a};
};
var $author$project$Type$DragStart = F2(
	function (a, b) {
		return {$: 37, a: a, b: b};
	});
var $author$project$Type$Reorder = F3(
	function (a, b, c) {
		return {$: 23, a: a, b: b, c: c};
	});
var $elm$html$Html$Attributes$draggable = _VirtualDom_attribute('draggable');
var $author$project$Domain$Helper$onDragEnd = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'dragend',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Domain$Helper$onDragOver = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'dragover',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $author$project$Domain$Helper$onDragStart = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'dragstart',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Domain$Helper$onDrop = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'drop',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, true)));
};
var $author$project$View$ViewHelper$viewSortableItem = F6(
	function (_v0, maybeDrag, target, index, isEditing, itemHtml) {
		var isOver = function () {
			if (!maybeDrag.$) {
				var d = maybeDrag.a;
				return _Utils_eq(d.ae, target) && _Utils_eq(d.bF, index);
			} else {
				return false;
			}
		}();
		var dragAttributes = isEditing ? _List_fromArray(
			[
				$elm$html$Html$Attributes$draggable('false')
			]) : _List_fromArray(
			[
				$elm$html$Html$Attributes$draggable('true'),
				$author$project$Domain$Helper$onDragStart(
				A2($author$project$Type$DragStart, target, index)),
				$author$project$Domain$Helper$onDragOver(
				$author$project$Type$DragOver(index)),
				$author$project$Domain$Helper$onDrop(
				function () {
					if (!maybeDrag.$) {
						var d = maybeDrag.a;
						return A3($author$project$Type$Reorder, d.ae, d.cx, index);
					} else {
						return $author$project$Type$DragEnd;
					}
				}()),
				$author$project$Domain$Helper$onDragEnd($author$project$Type$DragEnd)
			]);
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('flex items-center'),
				dragAttributes),
			_List_fromArray(
				[
					isOver ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-1 h-full mx-1 bg-blue-500 rounded-full transition-all')
						]),
					_List_Nil) : $elm$html$Html$text(''),
					itemHtml
				]));
	});
var $author$project$View$Reorder$viewReorder = F3(
	function (model, present, book) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($author$project$View$Reorder$reorderStyle.bV)
				]),
			_Utils_ap(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, page) {
							return A6(
								$author$project$View$ViewHelper$viewSortableItem,
								model.bh,
								model.cq,
								2,
								index,
								false,
								A5($author$project$View$Reorder$viewPageCard, model, present, index, page, page.D));
						}),
					book.R),
				_List_fromArray(
					[
						$author$project$View$Reorder$viewAddPageCard(model)
					])));
	});
var $author$project$View$MainArea$viewContentBody = F3(
	function (model, present, book) {
		var currentPage = $author$project$Domain$Helper$getCurrentPage(present);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full h-full')
				]),
			_List_fromArray(
				[
					function () {
					var _v0 = model.bC;
					switch (_v0) {
						case 0:
							return A2(
								$elm$core$Maybe$withDefault,
								$elm$html$Html$text(''),
								A2(
									$elm$core$Maybe$map,
									$author$project$View$MainArea$viewMarkdownView(model),
									currentPage));
						case 1:
							return A2($author$project$View$MainArea$viewEditor, model, currentPage);
						default:
							return A3($author$project$View$Reorder$viewReorder, model, present, book);
					}
				}()
				]));
	});
var $author$project$View$MainArea$centralArea = F3(
	function (model, present, book) {
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('page-view-area'),
						$elm$html$Html$Attributes$class('flex-1 flex h-full relative overflow-y-auto justify-center'),
						A2(
						$elm$html$Html$Events$on,
						'scroll',
						A2(
							$elm$json$Json$Decode$map,
							$author$project$Type$OnScroll('page-view-area'),
							$author$project$Domain$Helper$scrollDecoder))
					]),
				$author$project$View$Style$scrollbarStyle(model.bh)),
			_List_fromArray(
				[
					A3($author$project$View$MainArea$viewContentBody, model, present, book)
				]));
	});
var $author$project$View$MainArea$mainWrapperStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'relative',
				'flex',
				'flex-col',
				'min-h-screen',
				'w-full',
				'h-full',
				'overflow-hidden',
				$author$project$View$Style$basecolors(theme).cf
			]));
};
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $author$project$View$ViewHelper$emptyStateStyle = function (theme) {
	var themeBg = function () {
		switch (theme) {
			case 0:
				return 'bg-gray-50 text-gray-400';
			case 1:
				return 'bg-slate-900 text-slate-500';
			default:
				return 'bg-slate-900 text-slate-500';
		}
	}();
	var base = _List_fromArray(
		['flex-1', 'flex', 'flex-col', 'h-full', 'items-center', 'justify-center']);
	return $author$project$View$Style$tw(
		_Utils_ap(
			base,
			_List_fromArray(
				[themeBg])));
};
var $author$project$View$ViewHelper$viewEmptyState = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$ViewHelper$emptyStateStyle(model.bh))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-center italic text-lg')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Select or create a book')
					]))
			]));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $author$project$View$MainFooter$mainFooter = {
	bb: function (theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'font-bold',
					'tracking-tight',
					'min-w-0',
					'px-2',
					'py-0',
					'border',
					'focus:outline-none',
					'w-full',
					$author$project$View$Style$basecolors(theme).cZ,
					$author$project$View$Style$basecolors(theme).bd,
					$author$project$View$Style$basecolors(theme).aW,
					$author$project$View$Style$basecolors(theme).cf
				]));
	},
	bc: function (theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'tracking-tight',
					'min-w-0',
					'cursor-pointer',
					'hover:opacity-70',
					'truncate',
					$author$project$View$Style$basecolors(theme).M
				]));
	},
	bm: function (colorClass) {
		var borderBase = _List_fromArray(
			['border', 'rounded', 'truncate', 'flex-1', 'px-2', 'py-1', 'text-xs', colorClass, 'hover:bg-white/5', 'border-gray-500/20']);
		return $author$project$View$Style$tw(borderBase);
	},
	bq: function (theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'flex',
					'border-t',
					'px-6',
					'py-1',
					'items-center',
					'gap-10',
					$author$project$View$Style$basecolors(theme).a0,
					$author$project$View$Style$basecolors(theme).cg
				]));
	},
	b_: $author$project$View$Style$tw(
		_List_fromArray(
			['relative', 'w-full', 'max-w-4xl', 'h-5', 'flex', 'items-center', 'cursor-pointer'])),
	b$: function (total) {
		return _List_fromArray(
			[
				$elm$html$Html$Attributes$type_('range'),
				$elm$html$Html$Attributes$min('0'),
				$elm$html$Html$Attributes$max(
				$elm$core$String$fromInt(
					A2($elm$core$Basics$max, 0, total - 1))),
				$elm$html$Html$Attributes$step('1')
			]);
	},
	b0: F2(
		function (theme, percent) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'width',
					$elm$core$String$fromFloat(percent) + '%'),
					A2(
					$elm$html$Html$Attributes$style,
					'background-color',
					$author$project$View$Style$basecolors(theme).cW),
					$elm$html$Html$Attributes$class('h-full')
				]);
		}),
	b1: $author$project$View$Style$tw(
		_List_fromArray(
			['absolute', 'w-full', 'h-1', 'bg-gray-500/20', 'overflow-hidden']))
};
var $author$project$View$MainFooter$deletePageButton = function (pageId) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$MainFooter$mainFooter.bm('text-red-400')),
				$elm$html$Html$Events$onClick(
				$author$project$Type$DeletePage(pageId))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Delete This Page')
			]));
};
var $author$project$Type$EditBegin = F3(
	function (a, b, c) {
		return {$: 45, a: a, b: b, c: c};
	});
var $author$project$Type$EditSubmit = {$: 47};
var $author$project$Type$EditUpdate = function (a) {
	return {$: 46, a: a};
};
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Domain$Helper$onEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'keydown',
		A2(
			$elm$json$Json$Decode$andThen,
			function (key) {
				return (key === 'Enter') ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Not enter');
			},
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$MainFooter$viewBookTitle = F2(
	function (model, book) {
		var isEditing = function () {
			var _v0 = model.H;
			if (!_v0.$) {
				var buffer = _v0.a;
				return (buffer.ae === 1) && _Utils_eq(buffer.D, book.D);
			} else {
				return false;
			}
		}();
		return isEditing ? A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainFooter$mainFooter.bb(model.bh)),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(model.bh).aG),
					$elm$html$Html$Attributes$value(
					A2(
						$elm$core$Maybe$withDefault,
						book.b7,
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.N;
							},
							model.H))),
					$elm$html$Html$Events$onInput($author$project$Type$EditUpdate),
					$elm$html$Html$Events$onBlur($author$project$Type$EditSubmit),
					$author$project$Domain$Helper$onEnter($author$project$Type$EditSubmit),
					$elm$html$Html$Attributes$autofocus(true)
				]),
			_List_Nil) : A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainFooter$mainFooter.bc(model.bh)),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(model.bh).aG),
					$elm$html$Html$Events$onClick(
					A3($author$project$Type$EditBegin, 1, book.D, book.b7)),
					$elm$html$Html$Attributes$title(book.b7)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(book.b7)
				]));
	});
var $author$project$Domain$Helper$calcProgress = F2(
	function (current, total) {
		return (total > 1) ? ((current / (total - 1)) * 100) : 0;
	});
var $author$project$Domain$Helper$wheelDecoder = F2(
	function (upMsg, downMsg) {
		return A2(
			$elm$json$Json$Decode$map,
			function (delta) {
				return (delta < 0) ? upMsg : downMsg;
			},
			A2($elm$json$Json$Decode$field, 'deltaY', $elm$json$Json$Decode$float));
	});
var $author$project$View$MainFooter$viewSeekBar = F3(
	function (model, present, total) {
		var currentVal = present.an;
		var progress = A2($author$project$Domain$Helper$calcProgress, currentVal, total);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($author$project$View$MainFooter$mainFooter.b_),
					A2(
					$elm$html$Html$Events$on,
					'wheel',
					A2($author$project$Domain$Helper$wheelDecoder, $author$project$Type$PrevPage, $author$project$Type$NextPage))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($author$project$View$MainFooter$mainFooter.b1)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							A2($author$project$View$MainFooter$mainFooter.b0, model.bh, progress),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						$author$project$View$MainFooter$mainFooter.b$(total),
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$elm$core$String$fromInt(currentVal)),
								$elm$html$Html$Events$onInput(
								A2(
									$elm$core$Basics$composeR,
									$elm$core$String$toInt,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Maybe$withDefault(0),
										$author$project$Type$SelectPage))),
								$elm$html$Html$Attributes$class('absolute inset-0 w-full h-full opacity-0 cursor-pointer')
							])),
					_List_Nil)
				]));
	});
var $author$project$Type$SetContentWidth = function (a) {
	return {$: 50, a: a};
};
var $author$project$View$MainFooter$viewWidthSlider = F2(
	function (theme, currentWidth) {
		var toValue = function (width) {
			switch (width) {
				case 0:
					return '0';
				case 1:
					return '1';
				default:
					return '2';
			}
		};
		var progress = function () {
			switch (currentWidth) {
				case 0:
					return 0;
				case 1:
					return 50;
				default:
					return 100;
			}
		}();
		var fromValue = function (val) {
			switch (val) {
				case '0':
					return $author$project$Type$SetContentWidth(0);
				case '2':
					return $author$project$Type$SetContentWidth(2);
				default:
					return $author$project$Type$SetContentWidth(1);
			}
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						_List_fromArray(
							['flex', 'items-center', 'gap-2'])))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$Style$tw(
								_List_fromArray(
									[
										'text-[11px]',
										'opacity-70',
										$author$project$View$Style$basecolors(theme).M
									])))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Width')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$Style$tw(
								_List_fromArray(
									['relative', 'w-24', 'h-5', 'flex', 'items-center', 'cursor-pointer'])))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									$author$project$View$Style$tw(
										_List_fromArray(
											[
												'absolute',
												'w-full',
												'h-0.5',
												'overflow-hidden',
												$author$project$View$Style$basecolors(theme).bN
											])))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$Attributes$style,
									'left',
									'calc(' + ($elm$core$String$fromInt(progress) + '% - 1px)')),
									$elm$html$Html$Attributes$class(
									$author$project$View$Style$tw(
										_List_fromArray(
											[
												'absolute',
												'w-1.5',
												'h-3',
												$author$project$View$Style$basecolors(theme).bN
											])))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('range'),
									$elm$html$Html$Attributes$min('0'),
									$elm$html$Html$Attributes$max('2'),
									$elm$html$Html$Attributes$step('1'),
									$elm$html$Html$Attributes$value(
									toValue(currentWidth)),
									$elm$html$Html$Events$onInput(fromValue),
									$elm$html$Html$Attributes$class(
									$author$project$View$Style$tw(
										_List_fromArray(
											['absolute', 'inset-0', 'w-full', 'h-full', 'opacity-0', 'cursor-pointer'])))
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$View$MainFooter$viewFooter = F4(
	function (model, state, book, theme) {
		var total = $elm$core$List$length(book.R);
		var currentPageId = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.D;
				},
				$author$project$Domain$Helper$getCurrentPage(model.x)));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainFooter$mainFooter.bq(theme))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex-none w-[20%] min-w-0')
						]),
					_List_fromArray(
						[
							A2($author$project$View$MainFooter$viewBookTitle, model, book)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex-1 flex justify-center')
						]),
					_List_fromArray(
						[
							A3($author$project$View$MainFooter$viewSeekBar, model, state, total)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex-none w-[20%]')
						]),
					_List_fromArray(
						[
							(model.bC === 1) ? $author$project$View$MainFooter$deletePageButton(currentPageId) : A2($author$project$View$MainFooter$viewWidthSlider, theme, model.cm)
						]))
				]));
	});
var $author$project$View$MainArea$pageContentView = F2(
	function (model, present) {
		var _v0 = $author$project$Domain$Helper$getCurrentBook(present);
		if (_v0.$ === 1) {
			return $author$project$View$ViewHelper$viewEmptyState(model);
		} else {
			var book = _v0.a;
			return A2(
				$elm$html$Html$main_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$MainArea$mainWrapperStyle(model.bh)),
						A2(
						$elm$html$Html$Events$preventDefaultOn,
						'dragover',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Type$NoOp, true))),
						A2(
						$elm$html$Html$Events$preventDefaultOn,
						'drop',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Type$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex-1 overflow-y-auto')
							]),
						_List_fromArray(
							[
								A3($author$project$View$MainArea$centralArea, model, present, book)
							])),
						A4($author$project$View$MainFooter$viewFooter, model, present, book, model.bh)
					]));
		}
	});
var $author$project$Type$BookImport = 1;
var $author$project$Type$RequestImport = function (a) {
	return {$: 25, a: a};
};
var $author$project$View$MainArea$menuButtonStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'px-2.5',
				'py-1',
				'text-xs',
				'font-medium',
				'shadow-sm',
				'border',
				'transition-all duration-100',
				'hover:scale-105 hover:brightness-110 hover:shadow-md',
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).M,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).cf
			]));
};
var $author$project$View$MainArea$bookFileImport = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$MainArea$menuButtonStyle(theme)),
				$elm$html$Html$Events$onClick(
				$author$project$Type$RequestImport(1)),
				$elm$html$Html$Attributes$title('Import Book Only')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Import')
			]));
};
var $author$project$Type$CreateBook = {$: 6};
var $author$project$View$MainArea$makeNewBook = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$MainArea$menuButtonStyle(theme)),
				$elm$html$Html$Events$onClick($author$project$Type$CreateBook)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('New Book')
			]));
};
var $author$project$View$MainArea$shelfListMenuStyle = $author$project$View$Style$tw(
	_List_fromArray(
		['absolute', 'top-4', 'right-4', 'z-10', 'flex', 'flex-col', 'gap-1.5', 'p-1.5']));
var $author$project$View$MainArea$bookListMenu = F2(
	function (model, shelfId) {
		return _Utils_eq(
			model.J,
			$author$project$Type$ShelfDetailView(shelfId)) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($author$project$View$MainArea$shelfListMenuStyle)
				]),
			_List_fromArray(
				[
					$author$project$View$MainArea$bookFileImport(model.bh),
					$author$project$View$MainArea$makeNewBook(model.bh)
				])) : $elm$html$Html$text('');
	});
var $author$project$View$MainArea$shelfDetailTitle = F2(
	function (model, name) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('relative flex justify-center items-center opacity-70')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-3xl my-4 mx-4'),
							A2(
							$elm$html$Html$Attributes$style,
							'font-family',
							$author$project$View$Style$basecolors(model.bh).aG)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(name)
						]))
				]));
	});
var $author$project$View$MainArea$shelfDetailViewStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'p-8',
				'overflow-y-auto',
				'h-full',
				$author$project$View$Style$basecolors(theme).M,
				$author$project$View$Style$basecolors(theme).cf
			]));
};
var $author$project$Type$DragBook = 1;
var $author$project$View$MainArea$shelfBookGridStyle = $author$project$View$Style$tw(
	_List_fromArray(
		['grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-2', 'xl:grid-cols-3', 'gap-8', 'auto-rows-[250px]']));
var $author$project$Type$DeleteBook = function (a) {
	return {$: 7, a: a};
};
var $author$project$Type$DeleteButton = function (a) {
	return {$: 3, a: a};
};
var $author$project$Type$SelectBook = function (a) {
	return {$: 8, a: a};
};
var $author$project$View$MainArea$cardFooterStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'items-center',
				'justify-between',
				'w-full',
				'py-2',
				'mt-auto',
				'border-t',
				$author$project$View$Style$basecolors(theme).aD
			]));
};
var $author$project$View$MainArea$countLabelStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'text-xs',
				'font-medium',
				$author$project$View$Style$basecolors(theme).M,
				'mb-1',
				'opacity-70',
				'whitespace-nowrap'
			]));
};
var $author$project$View$MainArea$formatBookCountText = function (book) {
	return $elm$core$String$fromInt(
		$elm$core$List$length(book.R)) + ' Pages ';
};
var $author$project$View$MainArea$renderBookCountLabel = F2(
	function (theme, book) {
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$countLabelStyle(theme))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$View$MainArea$formatBookCountText(book))
				]));
	});
var $author$project$Type$Below = 1;
var $author$project$View$MainArea$exportContainerStyle = function (isOpen) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'relative',
				'mt-auto',
				'flex',
				'justify-end',
				isOpen ? 'z-30' : 'z-0'
			]));
};
var $author$project$Type$ExportBookJson = function (a) {
	return {$: 41, a: a};
};
var $author$project$Type$ExportBookZip = function (a) {
	return {$: 40, a: a};
};
var $author$project$View$MainArea$exportMenuItems = function (book) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'JSON',
			$author$project$Type$ExportBookJson(book)),
			_Utils_Tuple2(
			'ZIP',
			$author$project$Type$ExportBookZip(book.D))
		]);
};
var $author$project$View$ViewHelper$dropdownPositionStyle = function (direction) {
	if (!direction) {
		return 'absolute right-0 bottom-full mb-1';
	} else {
		return 'absolute right-0 top-full mt-1';
	}
};
var $author$project$View$ViewHelper$dropdownMenuStyle = F2(
	function (direction, theme) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					$author$project$View$ViewHelper$dropdownPositionStyle(direction),
					'z-20',
					'flex',
					'flex-col',
					'gap-1',
					'p-1',
					'border',
					'shadow-lg',
					$author$project$View$Style$basecolors(theme).ch,
					$author$project$View$Style$basecolors(theme).aj,
					$author$project$View$Style$basecolors(theme).aW
				]));
	});
var $author$project$View$ViewHelper$dropdownItemStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'px-3',
				'py-1',
				'text-left',
				'text-[12px]',
				'font-bold',
				'uppercase',
				'hover:bg-white/10',
				'transition-colors',
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$View$ViewHelper$renderMenuItem = F2(
	function (theme, _v0) {
		var label = _v0.a;
		var msg = _v0.b;
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$ViewHelper$dropdownItemStyle(theme)),
					$author$project$View$ViewHelper$stopClickPropagation(msg)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$View$ViewHelper$renderMenuList = F3(
	function (direction, theme, items) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$View$ViewHelper$dropdownMenuStyle, direction, theme))
				]),
			A2(
				$elm$core$List$map,
				$author$project$View$ViewHelper$renderMenuItem(theme),
				items));
	});
var $author$project$Type$CloseExportMenu = {$: 53};
var $author$project$View$ViewHelper$renderMenuOverlay = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('fixed inset-0 z-20 cursor-default'),
			$author$project$View$ViewHelper$stopClickPropagation($author$project$Type$CloseExportMenu)
		]),
	_List_Nil);
var $author$project$View$ViewHelper$renderDropdownMenu = F3(
	function (direction, theme, items) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$View$ViewHelper$renderMenuOverlay,
					A3($author$project$View$ViewHelper$renderMenuList, direction, theme, items)
				]));
	});
var $author$project$View$ViewHelper$openDropdown = F4(
	function (isOpen, direction, theme, items) {
		return isOpen ? A3($author$project$View$ViewHelper$renderDropdownMenu, direction, theme, items) : $elm$html$Html$text('');
	});
var $author$project$Type$ToggleExportMenu = function (a) {
	return {$: 52, a: a};
};
var $author$project$View$MainArea$miniButtonStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'px-1',
				'text-[12px]',
				'font-bold',
				'uppercase',
				'hover:bg-white/10',
				$author$project$View$Style$basecolors(theme).cZ,
				'border',
				'rounded-sm',
				$author$project$View$Style$basecolors(theme).aj
			]));
};
var $author$project$View$MainArea$renderTriggerButton = F2(
	function (theme, menuId) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$miniButtonStyle(theme)),
					$author$project$View$ViewHelper$stopClickPropagation(
					$author$project$Type$ToggleExportMenu(menuId))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Export ▾')
				]));
	});
var $author$project$View$MainArea$renderExportControls = F3(
	function (model, theme, book) {
		var menuId = 'book-export-' + book.D;
		var isOpen = _Utils_eq(
			model.ar,
			$elm$core$Maybe$Just(menuId));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$exportContainerStyle(isOpen))
				]),
			_List_fromArray(
				[
					A2($author$project$View$MainArea$renderTriggerButton, theme, menuId),
					A4(
					$author$project$View$ViewHelper$openDropdown,
					isOpen,
					1,
					theme,
					$author$project$View$MainArea$exportMenuItems(book))
				]));
	});
var $author$project$View$MainArea$bookCardFooter = F3(
	function (model, theme, book) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$cardFooterStyle(theme))
				]),
			_List_fromArray(
				[
					A2($author$project$View$MainArea$renderBookCountLabel, theme, book),
					A3($author$project$View$MainArea$renderExportControls, model, theme, book)
				]));
	});
var $author$project$View$MainArea$bookCardStyle = F3(
	function (theme, isActive, isOpen) {
		var stackOrder = isOpen ? 'z-30' : 'z-0';
		var corners = (theme === 2) ? $author$project$View$Style$basecolors(theme).aW : 'rounded-2xl';
		var activeBorder = isActive ? $author$project$View$Style$tw(
			_List_fromArray(
				[
					$author$project$View$Style$basecolors(theme).bd,
					'border-2'
				])) : $author$project$View$Style$basecolors(theme).aj;
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'flex',
					'flex-col',
					'relative',
					'w-full',
					'h-full',
					'pt-5',
					'px-5',
					'shadow-lg',
					'hover:shadow-xl',
					'border',
					'cursor-pointer',
					stackOrder,
					corners,
					$author$project$View$Style$basecolors(theme).a0,
					activeBorder
				]));
	});
var $author$project$View$MainArea$headingItemStyle = F2(
	function (theme, _v0) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'text-sm',
					'truncate',
					'mb-1',
					'mx-3',
					$author$project$View$Style$basecolors(theme).M + ' opacity-80'
				]));
	});
var $author$project$View$MainArea$bookHeadingItem = F3(
	function (theme, index, textContent) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$View$MainArea$headingItemStyle, theme, index))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(textContent)
				]));
	});
var $author$project$View$MainArea$getBookHeadingsForCard = function (book) {
	return A2(
		$elm$core$List$take,
		6,
		A2(
			$elm$core$List$filter,
			function (h) {
				return h.X === 1;
			},
			$elm$core$List$concat(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, p) {
							return A2($author$project$Domain$Helper$extractHeadings, i, p.bi);
						}),
					book.R))));
};
var $author$project$View$MainArea$bookHeadingList = F2(
	function (theme, book) {
		var headings = A2(
			$elm$core$List$indexedMap,
			$elm$core$Tuple$pair,
			$author$project$View$MainArea$getBookHeadingsForCard(book));
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var i = _v0.a;
					var h = _v0.b;
					return A3($author$project$View$MainArea$bookHeadingItem, theme, i, h.M);
				},
				headings));
	});
var $author$project$View$MainArea$bookTitleTextStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'text-lg',
				'font-bold',
				'ml-2',
				'mb-1',
				$author$project$View$Style$basecolors(theme).M,
				$author$project$View$Style$basecolors(theme).a0,
				'truncate'
			]));
};
var $author$project$View$MainArea$bookTitleText = F2(
	function (model, book) {
		return A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$bookTitleTextStyle(model.bh)),
					$elm$html$Html$Events$onDoubleClick(
					A3($author$project$Type$EditBegin, 1, book.D, book.b7)),
					$author$project$View$ViewHelper$stopClickPropagation($author$project$Type$NoOp)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(book.b7)
				]));
	});
var $author$project$View$MainArea$bookTitleRow = F2(
	function (model, book) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex items-center gap-2 mb-2'),
					$elm$html$Html$Attributes$title('Edit Title')
				]),
			_List_fromArray(
				[
					A2($author$project$View$MainArea$bookTitleText, model, book)
				]));
	});
var $author$project$Icon$cansel = _List_fromArray(
	['M512,52.535L459.467,0.002L256.002,203.462L52.538,0.002L0,52.535L203.47,256.005L0,459.475L52.533,511.998L256.002,308.527L459.467,511.998L512,459.475L308.536,256.005z']);
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$View$Style$icon = F2(
	function (pathList, classStr) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox('0 0 512 512'),
					$elm$svg$Svg$Attributes$fill('currentColor'),
					$elm$svg$Svg$Attributes$stroke('currentColor'),
					$elm$svg$Svg$Attributes$strokeWidth('20'),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round'),
					$elm$svg$Svg$Attributes$class(classStr + ' block shrink-0')
				]),
			A2(
				$elm$core$List$map,
				function (pathData) {
					return A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$d(pathData)
							]),
						_List_Nil);
				},
				pathList));
	});
var $author$project$View$MainArea$viewBookCard = F3(
	function (model, book, isEditing) {
		var theme = model.bh;
		var isOpen = _Utils_eq(
			model.ar,
			$elm$core$Maybe$Just('book-export-' + book.D));
		var isActive = _Utils_eq(
			model.x.W,
			$elm$core$Maybe$Just(book.D));
		var cardEventHandlers = isEditing ? _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$stopPropagationOn,
				'pointerdown',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Type$EditSubmit, true))),
				A2(
				$elm$html$Html$Events$stopPropagationOn,
				'click',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Type$NoOp, true)))
			]) : _List_fromArray(
			[
				$elm$html$Html$Events$onClick(
				$author$project$Type$SelectBook(book.D))
			]);
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class(
					A3($author$project$View$MainArea$bookCardStyle, theme, isActive, isOpen)),
				cardEventHandlers),
			_List_fromArray(
				[
					A4(
					$author$project$View$ViewHelper$viewButton,
					theme,
					$author$project$Type$DeleteButton(
						_Utils_Tuple2(1, 1)),
					$author$project$Type$DeleteBook(book.D),
					A2($author$project$View$Style$icon, $author$project$Icon$cansel, 'w-2 h-2')),
					A2($author$project$View$MainArea$bookTitleRow, model, book),
					A2($author$project$View$MainArea$bookHeadingList, theme, book),
					A3($author$project$View$MainArea$bookCardFooter, model, theme, book)
				]));
	});
var $author$project$View$MainArea$viewShelfBookGrid = F2(
	function (model, books) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($author$project$View$MainArea$shelfBookGridStyle)
				]),
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, b) {
						var isEditingThisBook = function () {
							var _v0 = model.H;
							if (!_v0.$) {
								var buffer = _v0.a;
								return (buffer.ae === 1) && _Utils_eq(buffer.D, b.D);
							} else {
								return false;
							}
						}();
						return A6(
							$author$project$View$ViewHelper$viewSortableItem,
							model.bh,
							model.cq,
							1,
							i,
							isEditingThisBook,
							A3($author$project$View$MainArea$viewBookCard, model, b, isEditingThisBook));
					}),
				books));
	});
var $author$project$View$MainArea$shelfDetailView = F2(
	function (model, shelfId) {
		var maybeShelf = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (s) {
					return _Utils_eq(s.D, shelfId);
				},
				model.x.A));
		if (!maybeShelf.$) {
			var shelf = maybeShelf.a;
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class(
						$author$project$View$MainArea$shelfDetailViewStyle(model.bh)),
					$author$project$View$Style$scrollbarStyle(model.bh)),
				_List_fromArray(
					[
						A2($author$project$View$MainArea$shelfDetailTitle, model, shelf.cH),
						A2($author$project$View$MainArea$viewShelfBookGrid, model, shelf.V),
						A2($author$project$View$MainArea$bookListMenu, model, shelfId)
					]));
		} else {
			return $author$project$View$ViewHelper$viewEmptyState(model);
		}
	});
var $author$project$View$MainArea$shelfGridStyle = $author$project$View$Style$tw(
	_List_fromArray(
		['grid', 'grid-cols-1', 'gap-8', 'auto-rows-[250px]', 'sm:grid-cols-2', 'lg:grid-cols-2', 'xl:grid-cols-3']));
var $author$project$Type$DragShelf = 0;
var $author$project$Type$DeleteShelf = function (a) {
	return {$: 4, a: a};
};
var $author$project$Type$SelectShelf = function (a) {
	return {$: 5, a: a};
};
var $author$project$View$MainArea$shelfCardStyle = F3(
	function (theme, isActive, isOpen) {
		var stackOrder = isOpen ? 'z-30' : 'z-0';
		var activeBorder = isActive ? $author$project$View$Style$tw(
			_List_fromArray(
				[
					$author$project$View$Style$basecolors(theme).bd,
					'border-2'
				])) : $author$project$View$Style$basecolors(theme).aj;
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'pt-6',
					'px-6',
					'w-full',
					'h-full',
					'relative',
					'transition-all duration-200',
					'flex',
					'flex-col',
					'border',
					stackOrder,
					'cursor-pointer',
					'hover:shadow-xl hover:-translate-y-1 hover:brightness-105',
					$author$project$View$Style$basecolors(theme).M,
					$author$project$View$Style$basecolors(theme).a0,
					$author$project$View$Style$basecolors(theme).aW,
					activeBorder
				]));
	});
var $author$project$View$MainArea$footerRowStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'items-center',
				'justify-between',
				'w-full',
				'py-2',
				'mt-auto',
				'border-t',
				$author$project$View$Style$basecolors(theme).aD
			]));
};
var $author$project$View$MainArea$formatShelfCountText = function (shelf) {
	return $elm$core$String$fromInt(
		$elm$core$List$length(shelf.V)) + ' Books';
};
var $author$project$View$MainArea$renderShelfCountLabel = F2(
	function (theme, shelf) {
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$countLabelStyle(theme))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$View$MainArea$formatShelfCountText(shelf))
				]));
	});
var $author$project$View$MainArea$renderShelfTriggerButton = F2(
	function (theme, menuId) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$miniButtonStyle(theme)),
					$author$project$View$ViewHelper$stopClickPropagation(
					$author$project$Type$ToggleExportMenu(menuId))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Export ▾')
				]));
	});
var $author$project$Type$ExportShelfJson = function (a) {
	return {$: 43, a: a};
};
var $author$project$Type$ExportShelfZip = function (a) {
	return {$: 42, a: a};
};
var $author$project$View$MainArea$shelfExportMenuItems = function (shelf) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'JSON',
			$author$project$Type$ExportShelfJson(shelf)),
			_Utils_Tuple2(
			'ZIP',
			$author$project$Type$ExportShelfZip(shelf.D))
		]);
};
var $author$project$View$MainArea$renderShelfExportControls = F3(
	function (model, theme, shelf) {
		var menuId = 'shelf-export-' + shelf.D;
		var isOpen = _Utils_eq(
			model.ar,
			$elm$core$Maybe$Just(menuId));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$exportContainerStyle(isOpen))
				]),
			_List_fromArray(
				[
					A2($author$project$View$MainArea$renderShelfTriggerButton, theme, menuId),
					A4(
					$author$project$View$ViewHelper$openDropdown,
					isOpen,
					1,
					theme,
					$author$project$View$MainArea$shelfExportMenuItems(shelf))
				]));
	});
var $author$project$View$MainArea$shelfCardfooter = F3(
	function (model, theme, shelf) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$footerRowStyle(theme))
				]),
			_List_fromArray(
				[
					A2($author$project$View$MainArea$renderShelfCountLabel, theme, shelf),
					A3($author$project$View$MainArea$renderShelfExportControls, model, theme, shelf)
				]));
	});
var $author$project$View$MainArea$renderPreviewTitle = function (title) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex text-sm truncate opacity-80 gap-2')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('・' + title)
			]));
};
var $author$project$View$MainArea$viewShelfCardPreview = function (shelf) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex-1 flex-col gap-1 overflow-hidden')
			]),
		A2(
			$elm$core$List$map,
			$author$project$View$MainArea$renderPreviewTitle,
			A2(
				$elm$core$List$take,
				7,
				A2(
					$elm$core$List$map,
					function ($) {
						return $.b7;
					},
					shelf.V))));
};
var $author$project$View$MainArea$titleRowStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'items-center',
				'gap-2',
				'mb-2',
				'border-b-1',
				$author$project$View$Style$basecolors(theme).cc,
				$author$project$View$Style$basecolors(theme).aD
			]));
};
var $author$project$View$MainArea$viewShelfTitle = F2(
	function (model, shelf) {
		return A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('text-lg font-bold truncate cursor-pointer'),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(model.bh).aG),
					$elm$html$Html$Events$onDoubleClick(
					A3($author$project$Type$EditBegin, 0, shelf.D, shelf.cH)),
					$author$project$View$ViewHelper$stopClickPropagation($author$project$Type$NoOp),
					$elm$html$Html$Attributes$title('Double click to edit')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(shelf.cH)
				]));
	});
var $author$project$View$MainArea$viewShelfCardTitleRow = F2(
	function (model, shelf) {
		var theme = model.bh;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$MainArea$titleRowStyle(theme))
				]),
			_List_fromArray(
				[
					A2($author$project$View$MainArea$viewShelfTitle, model, shelf)
				]));
	});
var $author$project$View$MainArea$viewShelfCard = F2(
	function (model, shelf) {
		var theme = model.bh;
		var isOpen = _Utils_eq(
			model.ar,
			$elm$core$Maybe$Just('shelf-export-' + shelf.D));
		var isActive = _Utils_eq(model.x.ao, shelf.D);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A3($author$project$View$MainArea$shelfCardStyle, theme, isActive, isOpen)),
					$elm$html$Html$Events$onClick(
					$author$project$Type$SelectShelf(shelf.D))
				]),
			_List_fromArray(
				[
					A4(
					$author$project$View$ViewHelper$viewButton,
					theme,
					$author$project$Type$DeleteButton(
						_Utils_Tuple2(1, 1)),
					$author$project$Type$DeleteShelf(shelf.D),
					A2($author$project$View$Style$icon, $author$project$Icon$cansel, 'w-2 h-2')),
					A2($author$project$View$MainArea$viewShelfCardTitleRow, model, shelf),
					$author$project$View$MainArea$viewShelfCardPreview(shelf),
					A3($author$project$View$MainArea$shelfCardfooter, model, theme, shelf)
				]));
	});
var $author$project$View$MainArea$viewSortableShelfCard = F3(
	function (model, index, shelf) {
		var isEditingThisShelf = function () {
			var _v0 = model.H;
			if (!_v0.$) {
				var buffer = _v0.a;
				return (!buffer.ae) && _Utils_eq(buffer.D, shelf.D);
			} else {
				return false;
			}
		}();
		return A6(
			$author$project$View$ViewHelper$viewSortableItem,
			model.bh,
			model.cq,
			0,
			index,
			isEditingThisShelf,
			A2($author$project$View$MainArea$viewShelfCard, model, shelf));
	});
var $author$project$View$MainArea$shelfGrid = F2(
	function (model, shelves) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($author$project$View$MainArea$shelfGridStyle)
				]),
			A2(
				$elm$core$List$indexedMap,
				$author$project$View$MainArea$viewSortableShelfCard(model),
				shelves));
	});
var $author$project$View$MainArea$shelfListContainerStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'px-8',
				'py-8',
				'h-full',
				'overflow-y-auto',
				$author$project$View$Style$basecolors(theme).cf
			]));
};
var $author$project$Type$CreateShelf = {$: 3};
var $author$project$View$MainArea$makeNewShelf = F2(
	function (theme, isGuiding) {
		var pulseClass = isGuiding ? $author$project$View$Style$tw(
			_List_fromArray(
				['animate-pulse', '[animation-duration:1s]', 'ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent'])) : '';
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						_List_fromArray(
							[
								$author$project$View$MainArea$menuButtonStyle(theme),
								pulseClass
							]))),
					$elm$html$Html$Events$onClick($author$project$Type$CreateShelf)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('New Shelf')
				]));
	});
var $author$project$Type$ShelfImport = 0;
var $author$project$View$MainArea$shelfFileImport = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$MainArea$menuButtonStyle(theme)),
				$elm$html$Html$Events$onClick(
				$author$project$Type$RequestImport(0)),
				$elm$html$Html$Attributes$title('Import Shelf Only')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Import')
			]));
};
var $author$project$View$MainArea$shelfListMenu = function (model) {
	if (_Utils_eq(model.J, $author$project$Type$ShelfListView)) {
		var isGuiding = $elm$core$List$length(model.x.A) <= 2;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($author$project$View$MainArea$shelfListMenuStyle)
				]),
			_List_fromArray(
				[
					$author$project$View$MainArea$shelfFileImport(model.bh),
					A2($author$project$View$MainArea$makeNewShelf, model.bh, isGuiding)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$View$MainArea$shelfListTitleStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'text-2xl',
				'font-bold',
				'ml-4',
				'mb-1',
				'py-1',
				'w-xs',
				'opacity-70',
				$author$project$View$Style$basecolors(theme).M
			]));
};
var $author$project$View$MainArea$shelfListTitle = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w-full h-20')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$MainArea$shelfListTitleStyle(model.bh)),
						A2(
						$elm$html$Html$Attributes$style,
						'font-family',
						$author$project$View$Style$basecolors(model.bh).aG)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Library')
					]))
			]));
};
var $author$project$View$MainArea$shelfListView = function (model) {
	return A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class(
				$author$project$View$MainArea$shelfListContainerStyle(model.bh)),
			$author$project$View$Style$scrollbarStyle(model.bh)),
		_List_fromArray(
			[
				$author$project$View$MainArea$shelfListTitle(model),
				A2($author$project$View$MainArea$shelfGrid, model, model.x.A),
				$author$project$View$MainArea$shelfListMenu(model)
			]));
};
var $author$project$View$TitleEditModal$modalContentStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-80',
				'p-5',
				'rounded-xl',
				'shadow-2xl',
				'border',
				$author$project$View$Style$basecolors(theme).a0,
				$author$project$View$Style$basecolors(theme).M,
				$author$project$View$Style$basecolors(theme).cg
			]));
};
var $author$project$Type$EditCancel = {$: 48};
var $author$project$View$TitleEditModal$modalBtnCancelStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'px-3',
				'py-1.5',
				'text-xs',
				'font-semibold',
				'rounded-md',
				'opacity-70',
				'hover:opacity-100',
				'transition-opacity',
				$author$project$View$Style$basecolors(theme).M
			]));
};
var $author$project$View$TitleEditModal$modalBtnSaveStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'px-3',
				'py-1.5',
				'text-xs',
				'font-semibold',
				'rounded-md',
				'transition-colors',
				$author$project$View$Style$basecolors(theme).bN,
				$author$project$View$Style$basecolors(theme).bl
			]));
};
var $author$project$View$TitleEditModal$renderModalFooter = function (theme) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex justify-end gap-2 mt-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$TitleEditModal$modalBtnCancelStyle(theme)),
						$elm$html$Html$Events$onClick($author$project$Type$EditCancel)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Cancel')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$TitleEditModal$modalBtnSaveStyle(theme)),
						$elm$html$Html$Events$onClick($author$project$Type$EditSubmit)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Save')
					]))
			]));
};
var $author$project$View$TitleEditModal$renderModalHeader = A2(
	$elm$html$Html$h3,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('text-base font-bold mb-3 opacity-90')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('Title Edit')
		]));
var $author$project$View$TitleEditModal$modalInputStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'px-3',
				'py-2',
				'text-sm',
				'rounded-md',
				'border',
				'outline-none',
				$author$project$View$Style$basecolors(theme).cf,
				$author$project$View$Style$basecolors(theme).M,
				$author$project$View$Style$basecolors(theme).cg
			]));
};
var $author$project$View$TitleEditModal$onEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'keydown',
		A2(
			$elm$json$Json$Decode$andThen,
			function (key) {
				return (key === 'Enter') ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('not enter');
			},
			A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
};
var $author$project$View$TitleEditModal$renderModalInput = F2(
	function (theme, buffer) {
		return A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(buffer.N),
					$elm$html$Html$Events$onInput($author$project$Type$EditUpdate),
					$author$project$View$TitleEditModal$onEnter($author$project$Type$EditSubmit),
					$elm$html$Html$Attributes$class(
					$author$project$View$TitleEditModal$modalInputStyle(theme)),
					$elm$html$Html$Attributes$autofocus(true)
				]),
			_List_Nil);
	});
var $author$project$View$TitleEditModal$viewTitleEditModal = function (model) {
	var _v0 = model.H;
	if (!_v0.$) {
		var buffer = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('fixed inset-0 z-50 flex items-center justify-center bg-black/50'),
					$elm$html$Html$Events$onClick($author$project$Type$EditSubmit)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$TitleEditModal$modalContentStyle(model.bh)),
							A2(
							$elm$html$Html$Events$stopPropagationOn,
							'click',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($author$project$Type$NoOp, true)))
						]),
					_List_fromArray(
						[
							$author$project$View$TitleEditModal$renderModalHeader,
							A2($author$project$View$TitleEditModal$renderModalInput, model.bh, buffer),
							$author$project$View$TitleEditModal$renderModalFooter(model.bh)
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$View$MainArea$mainContentArea = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('main-content-area'),
					$elm$html$Html$Attributes$class($author$project$View$MainArea$mainAreaWrapper)
				]),
			_List_fromArray(
				[
					function () {
					var _v0 = model.J;
					switch (_v0.$) {
						case 1:
							return $author$project$View$MainArea$shelfListView(model);
						case 2:
							var shelfId = _v0.a;
							return A2($author$project$View$MainArea$shelfDetailView, model, shelfId);
						default:
							return A2($author$project$View$MainArea$pageContentView, model, present);
					}
				}(),
					$author$project$View$TitleEditModal$viewTitleEditModal(model)
				]));
	});
var $author$project$View$RightSideBar$pageCounterStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'flex-col',
				'items-center',
				'gap-1',
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$Icon$rightpage = _List_fromArray(
	['M163.916,0L92.084,71.822L276.258,255.996L92.084,440.178L163.916,512L419.916,255.996z']);
var $author$project$View$RightSideBar$viewNextPageButton = A2(
	$elm$html$Html$button,
	_List_fromArray(
		[
			$elm$html$Html$Events$onClick($author$project$Type$NextPage),
			$elm$html$Html$Attributes$title('Next Page')
		]),
	_List_fromArray(
		[
			A2($author$project$View$Style$icon, $author$project$Icon$rightpage, 'w-5 h-5')
		]));
var $author$project$Icon$leftpage = _List_fromArray(
	['M419.916,71.821L348.084,0L92.084,256.005L348.084,512L419.916,440.178L235.742,256.005z']);
var $author$project$View$RightSideBar$viewPrevPageButton = A2(
	$elm$html$Html$button,
	_List_fromArray(
		[
			$elm$html$Html$Events$onClick($author$project$Type$PrevPage),
			$elm$html$Html$Attributes$title('Previous Page')
		]),
	_List_fromArray(
		[
			A2($author$project$View$Style$icon, $author$project$Icon$leftpage, 'w-5 h-5')
		]));
var $author$project$View$RightSideBar$viewPageChangeButtons = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('w-full flex pt-2 gap-6 mb-2 justify-center')
		]),
	_List_fromArray(
		[$author$project$View$RightSideBar$viewPrevPageButton, $author$project$View$RightSideBar$viewNextPageButton]));
var $author$project$View$RightSideBar$formatPageCounter = F2(
	function (state, book) {
		var total = $elm$core$List$length(book.R);
		var current = state.an + 1;
		return $elm$core$String$fromInt(current) + (' / ' + $elm$core$String$fromInt(total));
	});
var $author$project$View$RightSideBar$viewPageCounterValue = F2(
	function (state, book) {
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('font-mono text-lg font-medium')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					A2($author$project$View$RightSideBar$formatPageCounter, state, book))
				]));
	});
var $author$project$View$RightSideBar$viewPageLabel = A2(
	$elm$html$Html$p,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('font-mono text-xs')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('PAGE')
		]));
var $author$project$View$RightSideBar$pageCount = F3(
	function (theme, state, book) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$RightSideBar$pageCounterStyle(theme)),
					A2(
					$elm$html$Html$Events$on,
					'wheel',
					A2($author$project$Domain$Helper$wheelDecoder, $author$project$Type$PrevPage, $author$project$Type$NextPage))
				]),
			_List_fromArray(
				[
					$author$project$View$RightSideBar$viewPageChangeButtons,
					$author$project$View$RightSideBar$viewPageLabel,
					A2($author$project$View$RightSideBar$viewPageCounterValue, state, book)
				]));
	});
var $author$project$View$RightSideBar$bookPageCounter = F2(
	function (theme, present) {
		var _v0 = $author$project$Domain$Helper$getCurrentBook(present);
		if (_v0.$ === 1) {
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		} else {
			var book = _v0.a;
			return A3($author$project$View$RightSideBar$pageCount, theme, present, book);
		}
	});
var $author$project$View$RightSideBar$categoryBtn = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'h-8',
				'border',
				'px-2.5',
				'text-sm',
				'font-mono',
				'items-center',
				'justify-center',
				'hover:bg-white/25',
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$Type$ChangeMainView = function (a) {
	return {$: 2, a: a};
};
var $author$project$Domain$Helper$getCurrentShelf = function (state) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (shelf) {
				return _Utils_eq(shelf.D, state.ao);
			},
			state.A));
};
var $author$project$View$RightSideBar$isDetailView = function (mainViewMode) {
	if (mainViewMode.$ === 2) {
		return true;
	} else {
		return false;
	}
};
var $author$project$View$RightSideBar$getBooksButtonMsg = function (model) {
	if ($author$project$View$RightSideBar$isDetailView(model.J)) {
		return $author$project$Type$ChangeMainView($author$project$Type$PageView);
	} else {
		var _v0 = $author$project$Domain$Helper$getCurrentShelf(model.x);
		if (!_v0.$) {
			var shelf = _v0.a;
			return $author$project$Type$ChangeMainView(
				$author$project$Type$ShelfDetailView(shelf.D));
		} else {
			return $author$project$Type$ChangeMainView($author$project$Type$ShelfListView);
		}
	}
};
var $author$project$View$RightSideBar$viewBooksButton = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$RightSideBar$categoryBtn(model.bh)),
				$elm$html$Html$Events$onClick(
				$author$project$View$RightSideBar$getBooksButtonMsg(model)),
				$elm$html$Html$Attributes$title('本一覧')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Books')
			]));
};
var $author$project$View$RightSideBar$getCategoryButtonMsg = function (mainViewMode) {
	return _Utils_eq(mainViewMode, $author$project$Type$ShelfListView) ? $author$project$Type$ChangeMainView($author$project$Type$PageView) : $author$project$Type$ChangeMainView($author$project$Type$ShelfListView);
};
var $author$project$View$RightSideBar$viewCategoryButton = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$RightSideBar$categoryBtn(model.bh)),
				$elm$html$Html$Events$onClick(
				$author$project$View$RightSideBar$getCategoryButtonMsg(model.J)),
				$elm$html$Html$Attributes$title('本棚一覧')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Category')
			]));
};
var $author$project$View$RightSideBar$viewShelfBookIcon = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col gap-2 justify-center py-2 px-3')
			]),
		_List_fromArray(
			[
				$author$project$View$RightSideBar$viewCategoryButton(model),
				$author$project$View$RightSideBar$viewBooksButton(model)
			]));
};
var $author$project$View$RightSideBar$bottomStatusArea = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col gap-2 mt-auto')
				]),
			_List_fromArray(
				[
					$author$project$View$RightSideBar$viewShelfBookIcon(model),
					A2($author$project$View$RightSideBar$bookPageCounter, model.bh, present)
				]));
	});
var $author$project$Type$CreateNextPage = function (a) {
	return {$: 10, a: a};
};
var $author$project$View$RightSideBar$addPageBtnStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'py-2.5',
				'text-sm',
				'pr-2',
				'mt-6',
				'mb-3',
				'border',
				$author$project$View$Style$basecolors(theme).bd,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).cf,
				$author$project$View$Style$basecolors(theme).M,
				'hover:bg-white/5'
			]));
};
var $author$project$View$RightSideBar$viewAddPageButton = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$RightSideBar$addPageBtnStyle(model.bh)),
				$elm$html$Html$Events$onClick(
				$author$project$Type$CreateNextPage(model.x.an + 1))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('+ Next Page')
			]));
};
var $author$project$Type$ChangeFontSize = function (a) {
	return {$: 35, a: a};
};
var $author$project$Domain$Selector$fontSizeToString = function (size) {
	switch (size) {
		case 0:
			return 'Small';
		case 1:
			return 'Medium';
		default:
			return 'Large';
	}
};
var $author$project$Domain$Selector$getSiblingFontSize = function (current) {
	switch (current) {
		case 0:
			return _Utils_Tuple2(2, 1);
		case 1:
			return _Utils_Tuple2(0, 2);
		default:
			return _Utils_Tuple2(1, 0);
	}
};
var $author$project$View$RightSideBar$selectorStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'border',
				'px-3',
				'py-1',
				'mb-3',
				'text-sm',
				'outline-none',
				'h-10',
				$author$project$View$Style$basecolors(theme).ch,
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).M
			]));
};
var $author$project$View$RightSideBar$sizeSelectorText = function (model) {
	return (!model.ab) ? 'FONT SIZE' : '';
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$View$ViewHelper$viewBaseSelector = F6(
	function (toMsg, toString, getSiblings, attributes, current, options) {
		var _v0 = getSiblings(current);
		var prev = _v0.a;
		var next = _v0.b;
		var inlineWheelDecoder = A2(
			$elm$json$Json$Decode$map,
			function (delta) {
				return (delta < 0) ? toMsg(
					toString(prev)) : toMsg(
					toString(next));
			},
			A2($elm$json$Json$Decode$field, 'deltaY', $elm$json$Json$Decode$float));
		return A2(
			$elm$html$Html$select,
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						$elm$html$Html$Events$onInput(toMsg),
						$elm$html$Html$Attributes$value(
						toString(current)),
						A2($elm$html$Html$Events$on, 'wheel', inlineWheelDecoder)
					])),
			A2(
				$elm$core$List$map,
				function (opt) {
					return A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								toString(opt)),
								$elm$html$Html$Attributes$selected(
								_Utils_eq(
									toString(opt),
									toString(current)))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								toString(opt))
							]));
				},
				options));
	});
var $author$project$View$RightSideBar$viewFontSizeSelector = function (model) {
	var theme = model.bh;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-mono mb-1')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$View$RightSideBar$sizeSelectorText(model))
					])),
				A6(
				$author$project$View$ViewHelper$viewBaseSelector,
				$author$project$Type$ChangeFontSize,
				$author$project$Domain$Selector$fontSizeToString,
				$author$project$Domain$Selector$getSiblingFontSize,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$RightSideBar$selectorStyle(theme)),
						A2(
						$elm$html$Html$Attributes$style,
						'font-family',
						$author$project$View$Style$basecolors(theme).aG)
					]),
				model.cw,
				_List_fromArray(
					[0, 1, 2]))
			]));
};
var $author$project$View$RightSideBar$controlSectionMini = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('p-3 border-b text-xs border-gray-500/10')
			]),
		_List_fromArray(
			[
				$author$project$View$RightSideBar$viewFontSizeSelector(model),
				$author$project$View$RightSideBar$viewAddPageButton(model)
			]));
};
var $author$project$View$RightSideBar$rightSideWindowStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'flex-col',
				'w-32',
				'flex-shrink-0',
				'border',
				'h-auto',
				$author$project$View$Style$basecolors(theme).a0,
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$Type$ToggleLeftSidebar = {$: 55};
var $author$project$View$RightSideBar$sidebarBtnStyle = F2(
	function (theme, isActive) {
		var state = isActive ? _List_fromArray(
			[
				'border-transparent',
				$author$project$View$Style$basecolors(theme).bN,
				$author$project$View$Style$basecolors(theme).bl
			]) : _List_fromArray(
			[
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).M,
				'hover:bg-white/25',
				'bg-transparent'
			]);
		var base = _List_fromArray(
			[
				'w-full',
				'py-1',
				'text-sm',
				'font-semibold',
				'border',
				'opacity-90',
				$author$project$View$Style$basecolors(theme).aW
			]);
		return $author$project$View$Style$tw(
			_Utils_ap(base, state));
	});
var $author$project$View$RightSideBar$leftSidebarToggle = F2(
	function (theme, currentMode) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						_List_fromArray(
							[
								A2($author$project$View$RightSideBar$sidebarBtnStyle, theme, currentMode === 2),
								'border-l-8'
							]))),
					$elm$html$Html$Events$onClick($author$project$Type$ToggleLeftSidebar)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Left Menu')
				]));
	});
var $author$project$Type$ToggleNormalSidebar = {$: 54};
var $author$project$View$RightSideBar$sidebarToggleBtn = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$Style$tw(
					_List_fromArray(
						[
							A2($author$project$View$RightSideBar$sidebarBtnStyle, model.bh, false),
							'border-x-8'
						]))),
				$elm$html$Html$Events$onClick($author$project$Type$ToggleNormalSidebar),
				$elm$html$Html$Attributes$title('Show Sidebar')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Normal')
			]));
};
var $author$project$View$RightSideBar$sidebarModeSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col gap-2 mt-auto mx-3 font-bold')
			]),
		_List_fromArray(
			[
				A2($author$project$View$RightSideBar$leftSidebarToggle, model.bh, model.ab),
				$author$project$View$RightSideBar$sidebarToggleBtn(model)
			]));
};
var $author$project$Type$ReorderMode = 2;
var $author$project$View$RightSideBar$modeButtonStyle = F2(
	function (model, isActive) {
		var theme = model.bh;
		var state = isActive ? _List_fromArray(
			[
				'border-transparent',
				$author$project$View$Style$basecolors(theme).bN,
				$author$project$View$Style$basecolors(theme).bl
			]) : _List_fromArray(
			[
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).M,
				'hover:opacity-70',
				'bg-transparent'
			]);
		var base = ((model.ab === 1) || (model.ab === 2)) ? _List_fromArray(
			[
				'w-full',
				'py-1.5',
				'text-sm',
				'font-semibold',
				'border',
				'opacity-90',
				$author$project$View$Style$basecolors(theme).aW
			]) : _List_fromArray(
			[
				'w-full',
				'py-2.5',
				'text-sm',
				'font-semibold',
				'border',
				'opacity-90',
				$author$project$View$Style$basecolors(theme).aW
			]);
		return $author$project$View$Style$tw(
			_Utils_ap(base, state));
	});
var $author$project$View$RightSideBar$viewModeButton = F4(
	function (model, mode, label, isActive) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$View$RightSideBar$modeButtonStyle, model, isActive)),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(model.bh).aG),
					$elm$html$Html$Events$onClick(
					$author$project$Type$ChangeMode(mode))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$View$RightSideBar$viewModeButtonGroup = F2(
	function (model, currentMode) {
		var theme = model.bh;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('p-3 space-y-1')
				]),
			_List_fromArray(
				[
					A4($author$project$View$RightSideBar$viewModeButton, model, 0, 'VIEW', !currentMode),
					A4($author$project$View$RightSideBar$viewModeButton, model, 1, 'EDIT', currentMode === 1),
					A4($author$project$View$RightSideBar$viewModeButton, model, 2, 'PAGES', currentMode === 2)
				]));
	});
var $author$project$View$RightSideBar$rightSideWindow = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$RightSideBar$rightSideWindowStyle(model.bh))
				]),
			_List_fromArray(
				[
					A2($author$project$View$RightSideBar$viewModeButtonGroup, model, model.bC),
					$author$project$View$RightSideBar$sidebarModeSection(model),
					$author$project$View$RightSideBar$controlSectionMini(model),
					A2($author$project$View$RightSideBar$bottomStatusArea, model, present)
				]));
	});
var $author$project$View$Contents$overlaySidebarArea = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						_List_fromArray(
							['fixed', 'bottom-12', 'right-4', 'z-40', 'scale-[0.85]', 'origin-bottom-right', 'shadow-xl']))),
					A2(
					$elm$html$Html$Events$preventDefaultOn,
					'wheel',
					$elm$json$Json$Decode$succeed(
						_Utils_Tuple2($author$project$Type$NoOp, true)))
				]),
			_List_fromArray(
				[
					A2($author$project$View$RightSideBar$rightSideWindow, model, present)
				]));
	});
var $elm$html$Html$aside = _VirtualDom_node('aside');
var $author$project$Type$RequestPageImport = {$: 26};
var $author$project$View$RightSideBar$importPageStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'py-1.5',
				'text-sm',
				'pr-2',
				'mt-1',
				'mb-6',
				'border',
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).M,
				'hover:bg-white/5'
			]));
};
var $author$project$View$RightSideBar$importPageButton = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$RightSideBar$importPageStyle(model.bh)),
				$elm$html$Html$Events$onClick($author$project$Type$RequestPageImport)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('+ Import txt/md')
			]));
};
var $author$project$View$RightSideBar$sidebarToggle = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$Style$tw(
					_List_fromArray(
						[
							'mt-3',
							$author$project$View$RightSideBar$categoryBtn(model.bh)
						]))),
				$elm$html$Html$Events$onClick($author$project$Type$ToggleNormalSidebar)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Hide Sidebar')
			]));
};
var $author$project$Type$ExportPage = function (a) {
	return {$: 33, a: a};
};
var $author$project$View$RightSideBar$exportBtnStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex-1',
				'border',
				'px-3',
				'py-1',
				'my-2',
				'text-sm',
				'font-mono',
				'outline-none',
				'h-10',
				'flex',
				'items-center',
				'justify-center',
				'hover:bg-white/5',
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).ch
			]));
};
var $author$project$Domain$Selector$exportFormatToString = function (format) {
	if (!format) {
		return 'txt';
	} else {
		return 'md';
	}
};
var $author$project$View$RightSideBar$viewExportButton = F2(
	function (theme, format) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$RightSideBar$exportBtnStyle(theme)),
					$elm$html$Html$Events$onClick(
					$author$project$Type$ExportPage(
						$author$project$Domain$Selector$exportFormatToString(format)))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('EXPORT')
				]));
	});
var $author$project$Type$ChangeExportFormat = function (a) {
	return {$: 32, a: a};
};
var $author$project$View$RightSideBar$exportSelectorStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex-1',
				'border',
				'px-3',
				'py-1',
				'text-sm',
				'uppercase',
				'outline-none',
				'h-10',
				$author$project$View$Style$basecolors(theme).ch,
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).M
			]));
};
var $author$project$Domain$Helper$getSiblingExportFormat = function (format) {
	if (!format) {
		return _Utils_Tuple2(1, 1);
	} else {
		return _Utils_Tuple2(0, 0);
	}
};
var $author$project$View$RightSideBar$viewExportFormatSelector = F2(
	function (theme, currentFormat) {
		return A6(
			$author$project$View$ViewHelper$viewBaseSelector,
			$author$project$Type$ChangeExportFormat,
			$author$project$Domain$Selector$exportFormatToString,
			$author$project$Domain$Helper$getSiblingExportFormat,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$RightSideBar$exportSelectorStyle(theme)),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(theme).aG)
				]),
			currentFormat,
			_List_fromArray(
				[0, 1]));
	});
var $author$project$View$RightSideBar$viewExportControl = F2(
	function (theme, exportFormat) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex gap-2 pt-1 items-center')
				]),
			_List_fromArray(
				[
					A2($author$project$View$RightSideBar$viewExportFormatSelector, theme, exportFormat),
					A2($author$project$View$RightSideBar$viewExportButton, theme, exportFormat)
				]));
	});
var $author$project$Type$ChangeRenderStyle = function (a) {
	return {$: 21, a: a};
};
var $author$project$Domain$Selector$getSiblingRenderStyle = function (current) {
	switch (current) {
		case 0:
			return _Utils_Tuple2(3, 1);
		case 1:
			return _Utils_Tuple2(0, 2);
		case 2:
			return _Utils_Tuple2(1, 3);
		default:
			return _Utils_Tuple2(2, 0);
	}
};
var $author$project$Domain$Selector$renderStyleToString = function (style) {
	switch (style) {
		case 1:
			return 'Minimal';
		case 2:
			return 'Academic';
		case 0:
			return 'Standard';
		default:
			return 'Mystical';
	}
};
var $author$project$View$RightSideBar$viewRenderStyleSelector = F2(
	function (theme, current) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-mono mb-1')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('STYLE')
						])),
					A6(
					$author$project$View$ViewHelper$viewBaseSelector,
					$author$project$Type$ChangeRenderStyle,
					$author$project$Domain$Selector$renderStyleToString,
					$author$project$Domain$Selector$getSiblingRenderStyle,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$RightSideBar$selectorStyle(theme)),
							A2(
							$elm$html$Html$Attributes$style,
							'font-family',
							$author$project$View$Style$basecolors(theme).aG)
						]),
					current,
					_List_fromArray(
						[0, 1, 2, 3]))
				]));
	});
var $author$project$Type$ChangeColorTheme = function (a) {
	return {$: 20, a: a};
};
var $author$project$Domain$Selector$getSiblingTheme = function (current) {
	switch (current) {
		case 0:
			return _Utils_Tuple2(2, 1);
		case 1:
			return _Utils_Tuple2(0, 2);
		default:
			return _Utils_Tuple2(1, 0);
	}
};
var $author$project$View$RightSideBar$viewThemeSelector = function (theme) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-mono mb-1')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('THEME')
					])),
				A6(
				$author$project$View$ViewHelper$viewBaseSelector,
				$author$project$Type$ChangeColorTheme,
				$author$project$Domain$Selector$colorThemeToString,
				$author$project$Domain$Selector$getSiblingTheme,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$RightSideBar$selectorStyle(theme)),
						A2(
						$elm$html$Html$Attributes$style,
						'font-family',
						$author$project$View$Style$basecolors(theme).aG)
					]),
				theme,
				_List_fromArray(
					[0, 1, 2]))
			]));
};
var $author$project$View$RightSideBar$controlSection = function (model) {
	var theme = model.bh;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('p-3 border-b text-xs border-gray-500/10')
			]),
		_List_fromArray(
			[
				$author$project$View$RightSideBar$viewThemeSelector(theme),
				A2($author$project$View$RightSideBar$viewRenderStyleSelector, theme, model.cR),
				$author$project$View$RightSideBar$viewFontSizeSelector(model),
				$author$project$View$RightSideBar$viewAddPageButton(model),
				$author$project$View$RightSideBar$importPageButton(model),
				A2($author$project$View$RightSideBar$viewExportControl, theme, model.cs),
				$author$project$View$RightSideBar$sidebarToggle(model)
			]));
};
var $author$project$View$RightSideBar$rightSideStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'flex-col',
				'w-48',
				'flex-shrink-0',
				'border-l',
				'h-full',
				$author$project$View$Style$basecolors(theme).a0,
				$author$project$View$Style$basecolors(theme).cg,
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$View$RightSideBar$scrollableArea = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('flex-1 overflow-y-auto px-3 py-2'),
			A2(
			$elm$html$Html$Events$on,
			'wheel',
			A2($author$project$Domain$Helper$wheelDecoder, $author$project$Type$PrevPage, $author$project$Type$NextPage)),
			$elm$html$Html$Attributes$title('Scroll to change page')
		]),
	_List_Nil);
var $author$project$View$RightSideBar$rightSidebarArea = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$aside,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$RightSideBar$rightSideStyle(model.bh))
				]),
			_List_fromArray(
				[
					A2($author$project$View$RightSideBar$viewModeButtonGroup, model, model.bC),
					$author$project$View$RightSideBar$controlSection(model),
					$author$project$View$RightSideBar$scrollableArea,
					A2($author$project$View$RightSideBar$bottomStatusArea, model, present)
				]));
	});
var $author$project$View$Contents$rightsidebarWrapper = $author$project$View$Style$tw(
	_List_fromArray(
		['flex-shrink-0', 'h-full']));
var $author$project$View$SideBar$asideStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full h-full border-r flex flex-col',
				$author$project$View$Style$basecolors(theme).cg
			]));
};
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $author$project$View$SideBarContents$sidebarContentStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'block flex-1 overflow-y-auto',
				$author$project$View$Style$basecolors(theme).a0
			]));
};
var $author$project$View$SideBarContents$shelfBookName = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'truncate text-sm font-bold',
				'flex-1',
				'text-center',
				'border-b',
				'mx-1',
				'opacity-80',
				$author$project$View$Style$basecolors(theme).bd,
				$author$project$View$Style$basecolors(theme).cc
			]));
};
var $author$project$Domain$Helper$isHit = F2(
	function (searchText, target) {
		return $elm$core$String$isEmpty(searchText) ? false : A2(
			$elm$core$String$contains,
			$elm$core$String$toLower(searchText),
			$elm$core$String$toLower(target));
	});
var $author$project$Domain$Helper$hasHitInBook = F2(
	function (searchText, book) {
		return A2(
			$elm$core$List$any,
			function (page) {
				return A2($author$project$Domain$Helper$isHit, searchText, page.bi);
			},
			book.R);
	});
var $author$project$View$SideBookList$viewBookItemTheme = F3(
	function (theme, isSelected, isSearchHit) {
		var themeStyles = function () {
			if (isSearchHit) {
				if (isSelected) {
					switch (theme) {
						case 0:
							return _List_fromArray(
								[
									'border-l-2',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).bl,
									$author$project$View$Style$basecolors(theme).bZ
								]);
						case 1:
							return _List_fromArray(
								[
									'border-l-2',
									'text-slate-800',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).aW,
									$author$project$View$Style$basecolors(theme).bZ
								]);
						default:
							return _List_fromArray(
								[
									'border-l-2',
									'bg-[#8B7355]',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).cc,
									$author$project$View$Style$basecolors(theme).aW
								]);
					}
				} else {
					switch (theme) {
						case 0:
							return _List_fromArray(
								['text-[#2D2A26]/70', 'bg-[#C86D51]/20', 'hover:opacity-60']);
						case 1:
							return _List_fromArray(
								[
									'bg-yellow-200/60',
									'text-slate-900',
									$author$project$View$Style$basecolors(theme).aW,
									'hover:opacity-60'
								]);
						default:
							return _List_fromArray(
								[
									$author$project$View$Style$basecolors(theme).M,
									'bg-[#8B7355]/80',
									'hover:opacity-60'
								]);
					}
				}
			} else {
				if (isSelected) {
					switch (theme) {
						case 0:
							return _List_fromArray(
								[
									'border-l-2',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).cc,
									$author$project$View$Style$basecolors(theme).ch
								]);
						case 1:
							return _List_fromArray(
								[
									'border-l-2',
									'bg-white/10',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).cc
								]);
						default:
							return _List_fromArray(
								[
									'border-l-2',
									'bg-white/10',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).cc
								]);
					}
				} else {
					return _List_fromArray(
						[
							$author$project$View$Style$basecolors(theme).M,
							'opacity-80',
							'hover:opacity-60'
						]);
				}
			}
		}();
		var common = _List_fromArray(
			['py-1', 'px-2', 'mx-2', 'cursor-pointer', 'text-xs', 'flex', 'items-center']);
		return $author$project$View$Style$tw(
			_Utils_ap(common, themeStyles));
	});
var $author$project$View$SideBookList$viewBookItem = F3(
	function (model, present, book) {
		var isSelected = _Utils_eq(
			$elm$core$Maybe$Just(book.D),
			present.W);
		var isSearchHit = A2($author$project$Domain$Helper$hasHitInBook, model.bY, book);
		var themeClasses = A3($author$project$View$SideBookList$viewBookItemTheme, model.bh, isSelected, isSearchHit);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('group relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(themeClasses),
							$elm$html$Html$Events$onClick(
							$author$project$Type$SelectBook(book.D))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('font-bold text-sm')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(book.b7)
								]))
						]))
				]));
	});
var $author$project$View$SideBookList$viewBookList = F2(
	function (model, present) {
		var visibleBooks = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.V;
				},
				$author$project$Domain$Helper$getCurrentShelf(present)));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('space-y-1')
				]),
			A2(
				$elm$core$List$map,
				A2($author$project$View$SideBookList$viewBookItem, model, present),
				visibleBooks));
	});
var $author$project$View$SideBarContents$addBtnStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'uppercase',
				'border',
				'items-center',
				'justify-center',
				'w-1/2',
				'mx-auto',
				'py-1',
				'px-4',
				'text-xs',
				$author$project$View$Style$basecolors(theme).bN,
				$author$project$View$Style$basecolors(theme).bl,
				$author$project$View$Style$basecolors(theme).cg,
				$author$project$View$Style$basecolors(theme).aW
			]));
};
var $author$project$View$SideBarContents$viewSidebarActionButton = F2(
	function (model, isFullSize) {
		var sizeClass = isFullSize ? 'w-1/2 py-0.5 px-2 text-xs' : 'w-auto py-0.5 px-2 text-xs';
		var page = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.R;
					},
					$elm$core$List$length),
				$author$project$Domain$Helper$getCurrentBook(model.x)));
		var _v0 = function () {
			var _v1 = model.ac;
			switch (_v1) {
				case 0:
					return _Utils_Tuple2('+ New Shelf', $author$project$Type$CreateShelf);
				case 1:
					return _Utils_Tuple2('+ Book', $author$project$Type$CreateBook);
				default:
					return _Utils_Tuple2(
						'+ Page',
						$author$project$Type$CreatePage(page));
			}
		}();
		var label = _v0.a;
		var msg = _v0.b;
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$SideBarContents$addBtnStyle(model.bh)),
					$elm$html$Html$Attributes$class(sizeClass),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$View$SideBarContents$tabBookList = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center justify-between p-1 py-3')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									$author$project$View$SideBarContents$shelfBookName(model.bh)),
									A2(
									$elm$html$Html$Attributes$style,
									'font-family',
									$author$project$View$Style$basecolors(model.bh).aG)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2(
										$elm$core$Maybe$withDefault,
										'本棚未選択',
										A2(
											$elm$core$Maybe$map,
											function ($) {
												return $.cH;
											},
											$author$project$Domain$Helper$getCurrentShelf(present))))
								])),
							A2($author$project$View$SideBarContents$viewSidebarActionButton, model, false)
						])),
					A2($author$project$View$SideBookList$viewBookList, model, present)
				]));
	});
var $author$project$Domain$Helper$hasHitInShelf = F2(
	function (searchText, shelf) {
		return A2(
			$elm$core$List$any,
			function (book) {
				return A2($author$project$Domain$Helper$hasHitInBook, searchText, book);
			},
			shelf.V);
	});
var $author$project$View$SideShelfList$shelfItemBodyStyle = F3(
	function (theme, isSelected, isSearchHit) {
		var themeStyles = function () {
			if (isSearchHit) {
				if (isSelected) {
					switch (theme) {
						case 0:
							return _List_fromArray(
								[
									'border',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).bl,
									$author$project$View$Style$basecolors(theme).bZ
								]);
						case 1:
							return _List_fromArray(
								[
									'border',
									'border-2',
									$author$project$View$Style$basecolors(theme).cg,
									'text-slate-900',
									$author$project$View$Style$basecolors(theme).bN
								]);
						default:
							return _List_fromArray(
								[
									'border',
									'border-2',
									$author$project$View$Style$basecolors(theme).bd,
									$author$project$View$Style$basecolors(theme).cc,
									'bg-[#8B7355]/80'
								]);
					}
				} else {
					switch (theme) {
						case 0:
							return _List_fromArray(
								['hover:opacity-100', 'text-[#2D2A26]/70', 'bg-[#C86D51]/20']);
						case 1:
							return _List_fromArray(
								['hover:opacity-80', 'text-slate-800', 'bg-yellow-200/60']);
						default:
							return _List_fromArray(
								[
									'hover:opacity-100',
									$author$project$View$Style$basecolors(theme).M,
									'bg-[#8B7355]/80'
								]);
					}
				}
			} else {
				if (isSelected) {
					return _List_fromArray(
						[
							'border',
							'bg-white/10',
							'border-0',
							$author$project$View$Style$basecolors(theme).cc
						]);
				} else {
					return _List_fromArray(
						[
							'opacity-70',
							'hover:opacity-100',
							$author$project$View$Style$basecolors(theme).M
						]);
				}
			}
		}();
		var common = _List_fromArray(
			[
				'flex',
				'items-center',
				'px-3',
				'py-2',
				'cursor-pointer',
				'mx-2',
				'my-0.5',
				'text-sm',
				'group',
				'font-bold',
				$author$project$View$Style$basecolors(theme).aW
			]);
		return $author$project$View$Style$tw(
			_Utils_ap(common, themeStyles));
	});
var $author$project$View$SideShelfList$viewSidebarShelfItem = F3(
	function (model, present, shelf) {
		var theme = model.bh;
		var isSelected = _Utils_eq(shelf.D, present.ao);
		var isSearchHit = A2($author$project$Domain$Helper$hasHitInShelf, model.bY, shelf);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('group relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A3($author$project$View$SideShelfList$shelfItemBodyStyle, theme, isSelected, isSearchHit)),
							$elm$html$Html$Events$onClick(
							$author$project$Type$SelectShelf(shelf.D))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(shelf.cH)
						]))
				]));
	});
var $author$project$View$SideShelfList$viewSidebarShelfList = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('space-y-1')
				]),
			A2(
				$elm$core$List$map,
				A2($author$project$View$SideShelfList$viewSidebarShelfItem, model, present),
				present.A));
	});
var $author$project$View$SideBarContents$tabShelfList = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex justify-center mt-2')
						]),
					_List_fromArray(
						[
							A2($author$project$View$SideBarContents$viewSidebarActionButton, model, true)
						])),
					A2($author$project$View$SideShelfList$viewSidebarShelfList, model, present)
				]));
	});
var $author$project$Domain$Selector$getSiblingHeadingLevel = function (level) {
	switch (level) {
		case 0:
			return _Utils_Tuple2(2, 1);
		case 1:
			return _Utils_Tuple2(0, 2);
		default:
			return _Utils_Tuple2(1, 0);
	}
};
var $author$project$Domain$Selector$headingLevelToString = function (level) {
	switch (level) {
		case 0:
			return 'H1';
		case 1:
			return 'H2';
		default:
			return 'H3';
	}
};
var $author$project$View$SideBarContents$headingSelectorStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'border',
				'px-3',
				'py-1',
				'mb-1',
				'text-sm',
				'outline-none',
				'h-8',
				'w-18',
				$author$project$View$Style$basecolors(theme).ch,
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$View$SideBarContents$selectorLabel = function (theme) {
	var c = $author$project$View$Style$basecolors(theme);
	return $author$project$View$Style$tw(
		_List_fromArray(
			['text-xs', 'flex-1', 'font-semibold', 'uppercase', 'tracking-wide', 'text-right', 'h-8', 'flex', 'items-center', 'justify-end', c.cZ]));
};
var $author$project$View$SideBarContents$selectorwrapper = $author$project$View$Style$tw(
	_List_fromArray(
		['w-full', 'h-8', 'shrink-0', 'flex', 'items-center', 'gap-2', 'px-3', 'py-2']));
var $author$project$Type$SetVisibleHeadingLevel = function (a) {
	return {$: 49, a: a};
};
var $author$project$Domain$Selector$stringToHeadingLevel = function (str) {
	switch (str) {
		case 'H1':
			return 0;
		case 'H2':
			return 1;
		default:
			return 2;
	}
};
var $author$project$View$SideBarContents$setHeadingLevel = function (str) {
	return $author$project$Type$SetVisibleHeadingLevel(
		$author$project$Domain$Selector$stringToHeadingLevel(str));
};
var $author$project$View$SideBarContents$headingLevelSelector = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($author$project$View$SideBarContents$selectorwrapper),
				$elm$html$Html$Attributes$title('Heading Level Select')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$SideBarContents$selectorLabel(model.bh))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('HEADING LEVEL')
					])),
				A6(
				$author$project$View$ViewHelper$viewBaseSelector,
				$author$project$View$SideBarContents$setHeadingLevel,
				$author$project$Domain$Selector$headingLevelToString,
				$author$project$Domain$Selector$getSiblingHeadingLevel,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$SideBarContents$headingSelectorStyle(model.bh)),
						A2(
						$elm$html$Html$Attributes$style,
						'font-family',
						$author$project$View$Style$basecolors(model.bh).aG)
					]),
				model.c1,
				_List_fromArray(
					[0, 1, 2]))
			]));
};
var $author$project$Domain$Helper$headingLevelToInt = function (level) {
	switch (level) {
		case 0:
			return 1;
		case 1:
			return 2;
		default:
			return 3;
	}
};
var $author$project$Domain$Helper$filterHeadingsData = F2(
	function (level, data) {
		return _Utils_update(
			data,
			{
				aI: A2(
					$elm$core$List$filter,
					function (h) {
						return _Utils_cmp(
							h.X,
							$author$project$Domain$Helper$headingLevelToInt(level)) < 1;
					},
					data.aI)
			});
	});
var $author$project$Domain$Helper$extractSectionContent = F2(
	function (targetHeading, lines) {
		var isTargetHeading = function (line) {
			var trimmed = $elm$core$String$trim(line);
			return _Utils_eq(trimmed, '# ' + targetHeading) || (_Utils_eq(trimmed, '## ' + targetHeading) || _Utils_eq(trimmed, '### ' + targetHeading));
		};
		var isAnyHeading = function (line) {
			var trimmed = $elm$core$String$trim(line);
			return A2($elm$core$String$startsWith, '# ', trimmed) || (A2($elm$core$String$startsWith, '## ', trimmed) || A2($elm$core$String$startsWith, '### ', trimmed));
		};
		var collect = F2(
			function (linesAcc, searching) {
				collect:
				while (true) {
					if (!linesAcc.b) {
						return _List_Nil;
					} else {
						var line = linesAcc.a;
						var rest = linesAcc.b;
						if (searching) {
							if (isTargetHeading(line)) {
								var $temp$linesAcc = rest,
									$temp$searching = false;
								linesAcc = $temp$linesAcc;
								searching = $temp$searching;
								continue collect;
							} else {
								var $temp$linesAcc = rest,
									$temp$searching = true;
								linesAcc = $temp$linesAcc;
								searching = $temp$searching;
								continue collect;
							}
						} else {
							if (isAnyHeading(line)) {
								return _List_Nil;
							} else {
								return A2(
									$elm$core$List$cons,
									line,
									A2(collect, rest, false));
							}
						}
					}
				}
			});
		return A2(
			$elm$core$String$join,
			'\n',
			A2(collect, lines, true));
	});
var $author$project$Domain$Helper$checkSectionHit = F4(
	function (searchText, headingText, content, allHeadingTexts) {
		if ($elm$core$String$isEmpty(searchText)) {
			return false;
		} else {
			if (A2($author$project$Domain$Helper$isHit, searchText, headingText)) {
				return true;
			} else {
				var sectionText = A2(
					$author$project$Domain$Helper$extractSectionContent,
					headingText,
					$elm$core$String$lines(content));
				return A2($author$project$Domain$Helper$isHit, searchText, sectionText);
			}
		}
	});
var $author$project$Type$JumpToHeading = F2(
	function (a, b) {
		return {$: 22, a: a, b: b};
	});
var $author$project$View$SideTocList$headingHighlightStyle = F3(
	function (theme, isActive, isSectionHit) {
		if (isActive) {
			if (isSectionHit) {
				switch (theme) {
					case 0:
						return _List_fromArray(
							[
								'font-bold',
								'border-l-4',
								'hover:opacity-70',
								$author$project$View$Style$basecolors(theme).bl,
								$author$project$View$Style$basecolors(theme).bN,
								$author$project$View$Style$basecolors(theme).bZ
							]);
					case 1:
						return _List_fromArray(
							[
								'font-bold',
								'border-l-4',
								'hover:opacity-70',
								'text-slate-900',
								$author$project$View$Style$basecolors(theme).bN,
								$author$project$View$Style$basecolors(theme).bd
							]);
					default:
						return _List_fromArray(
							[
								'font-bold',
								'border-l-4',
								'hover:opacity-70',
								$author$project$View$Style$basecolors(theme).bl,
								$author$project$View$Style$basecolors(theme).bd,
								'bg-[#8B7355]/80'
							]);
				}
			} else {
				return _List_fromArray(
					[
						'font-bold',
						'border-l-4',
						'hover:opacity-70',
						$author$project$View$Style$basecolors(theme).cc,
						$author$project$View$Style$basecolors(theme).bd
					]);
			}
		} else {
			if (isSectionHit) {
				switch (theme) {
					case 0:
						return _List_fromArray(
							['font-bold', 'bg-[#C86D51]/30', 'text-slate-700', 'hover:bg-[#C86D51]', 'hover:text-white']);
					case 1:
						return _List_fromArray(
							[
								'font-bold',
								'text-slate-900',
								$author$project$View$Style$basecolors(theme).bN,
								'opacity-60',
								'hover:opacity-100'
							]);
					default:
						return _List_fromArray(
							[
								'font-bold',
								$author$project$View$Style$basecolors(theme).bl,
								'bg-[#8B7355]/80',
								'hover:opacity-80'
							]);
				}
			} else {
				switch (theme) {
					case 0:
						return _List_fromArray(
							[
								'font-bold',
								'hover:text-slate-700',
								$author$project$View$Style$basecolors(theme).cZ,
								$author$project$View$Style$basecolors(theme).bd
							]);
					case 1:
						return _List_fromArray(
							[
								'font-bold',
								'hover:text-slate-100',
								$author$project$View$Style$basecolors(theme).cZ,
								$author$project$View$Style$basecolors(theme).bd
							]);
					default:
						return _List_fromArray(
							[
								'font-bold',
								'hover:text-[#E0D5C0]',
								'text-[#E0D5C0]/70',
								$author$project$View$Style$basecolors(theme).bd
							]);
				}
			}
		}
	});
var $author$project$View$SideTocList$headingItemStyle = F2(
	function (theme, level) {
		var levelClass = (level === 1) ? _List_fromArray(
			[
				'font-bold',
				'border-b',
				$author$project$View$Style$basecolors(theme).bd,
				'ml-1',
				'mb-1',
				'pl-1'
			]) : ((level === 2) ? _List_fromArray(
			['pl-2', 'ml-1']) : _List_fromArray(
			['pl-3', 'ml-1', 'text-xs']));
		var base = _List_fromArray(
			['cursor-pointer', 'py-1', 'px-2', 'mr-3', 'text-sm']);
		return _Utils_ap(base, levelClass);
	});
var $author$project$Domain$Helper$stripEmphasis = function (input) {
	return A3($elm$core$String$replace, '**', '', input);
};
var $author$project$Domain$Helper$isCurrentHeading = F3(
	function (h, currentPageIndex, currentHeading) {
		return _Utils_eq(h._, currentPageIndex) && A2(
			$elm$core$List$member,
			$author$project$Domain$Helper$stripEmphasis(h.M),
			A2($elm$core$List$map, $author$project$Domain$Helper$stripEmphasis, currentHeading));
	});
var $author$project$View$SideTocList$buildHeadingItemClass = F5(
	function (theme, h, currentPageIndex, currentHeading, isSectionHit) {
		return _Utils_ap(
			A2($author$project$View$SideTocList$headingItemStyle, theme, h.X),
			A3(
				$author$project$View$SideTocList$headingHighlightStyle,
				theme,
				A3($author$project$Domain$Helper$isCurrentHeading, h, currentPageIndex, currentHeading),
				isSectionHit));
	});
var $author$project$View$SideTocList$viewHeadingItem = F5(
	function (theme, currentPageIndex, currentHeading, h, isSectionHit) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						A5($author$project$View$SideTocList$buildHeadingItemClass, theme, h, currentPageIndex, currentHeading, isSectionHit))),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(theme).cv),
					$elm$html$Html$Events$onClick(
					A2($author$project$Type$JumpToHeading, h._, h.M))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$Domain$Helper$stripEmphasis(h.M))
				]));
	});
var $author$project$View$SideTocList$renderHeadingItem = F7(
	function (theme, currentPageIndex, currentHeading, content, searchText, allHeadingTexts, h) {
		return A5(
			$author$project$View$SideTocList$viewHeadingItem,
			theme,
			currentPageIndex,
			currentHeading,
			h,
			A4($author$project$Domain$Helper$checkSectionHit, searchText, h.M, content, allHeadingTexts));
	});
var $author$project$View$SideTocList$renderHeadingList = F6(
	function (theme, currentPageIndex, currentHeading, content, searchText, data) {
		return $elm$core$List$isEmpty(data.aI) ? $elm$html$Html$text('') : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-col')
				]),
			A2(
				$elm$core$List$map,
				A6($author$project$View$SideTocList$renderHeadingItem, theme, currentPageIndex, currentHeading, content, searchText, data.cd),
				data.aI));
	});
var $author$project$Domain$Helper$toHeadingData = function (headings) {
	return {
		cd: A2(
			$elm$core$List$map,
			function ($) {
				return $.M;
			},
			headings),
		aI: headings
	};
};
var $author$project$View$SideTocList$viewHeadingList = F7(
	function (theme, currentPageIndex, pageIdx, content, currentHeading, searchText, visibleLevel) {
		return A6(
			$author$project$View$SideTocList$renderHeadingList,
			theme,
			currentPageIndex,
			currentHeading,
			content,
			searchText,
			A2(
				$author$project$Domain$Helper$filterHeadingsData,
				visibleLevel,
				$author$project$Domain$Helper$toHeadingData(
					A2($author$project$Domain$Helper$extractHeadings, pageIdx, content))));
	});
var $author$project$View$SideTocList$viewTocSection = F3(
	function (model, pageIdx, page) {
		return A7($author$project$View$SideTocList$viewHeadingList, model.bh, model.x.an, pageIdx, page.bi, model.x.bj, model.bY, model.c1);
	});
var $author$project$View$SideTocList$viewToc = F2(
	function (model, present) {
		var _v0 = $author$project$Domain$Helper$getCurrentBook(present);
		if (!_v0.$) {
			var book = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-y-1')
					]),
				A2(
					$elm$core$List$indexedMap,
					$author$project$View$SideTocList$viewTocSection(model),
					book.R));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('p-4 text-center text-xs text-gray-400')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Select a book')
					]));
		}
	});
var $author$project$View$SideBarContents$tabTocList = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Style$tw(
						_List_fromArray(
							['flex', 'flex-col', 'h-full', 'pt-2'])))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id('toc-area'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(
								$author$project$View$Style$tw(
									_List_fromArray(
										['flex-1', 'overflow-y-auto']))),
							$author$project$View$Style$scrollbarStyle(model.bh))),
					_List_fromArray(
						[
							A2($author$project$View$SideTocList$viewToc, model, present)
						])),
					A2($author$project$View$SideBarContents$viewSidebarActionButton, model, false),
					$author$project$View$SideBarContents$headingLevelSelector(model)
				]));
	});
var $author$project$View$SideBarContents$sidebarContent = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$nav,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class(
					$author$project$View$SideBarContents$sidebarContentStyle(model.bh)),
				$author$project$View$Style$scrollbarStyle(model.bh)),
			_List_fromArray(
				[
					function () {
					var _v0 = model.ac;
					switch (_v0) {
						case 0:
							return A2($author$project$View$SideBarContents$tabShelfList, model, present);
						case 1:
							return A2($author$project$View$SideBarContents$tabBookList, model, present);
						default:
							return A2($author$project$View$SideBarContents$tabTocList, model, present);
					}
				}()
				]));
	});
var $author$project$Type$ExportData = {$: 31};
var $author$project$Icon$disk = _List_fromArray(
	['M502.394,106.098L396.296,0h-15.162v121.49H130.866V0H60.27C26.987,0,0,26.987,0,60.271v391.458C0,485.013,26.987,512,60.27,512h391.459C485.014,512,512,485.013,512,451.729V129.286C512,120.591,508.542,112.256,502.394,106.098z M408.39,428.121H103.609V216.944H408.39V428.121z', 'M282.012,0h68.027v94.015H282.012z']);
var $author$project$View$SideBar$footerButton = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'flex-1',
				'h-full',
				'text-[12px]',
				'font-bold',
				'tracking-widest',
				'uppercase',
				'border',
				$author$project$View$Style$basecolors(theme).aW,
				$author$project$View$Style$basecolors(theme).cZ,
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).ch,
				'hover:bg-white/5',
				'active:scale-95',
				'items-center',
				'justify-center'
			]));
};
var $author$project$View$SideBar$exportButton = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$SideBar$footerButton(theme)),
				$elm$html$Html$Events$onClick($author$project$Type$ExportData),
				$elm$html$Html$Attributes$title('QUICK BACK UP')
			]),
		_List_fromArray(
			[
				A2($author$project$View$Style$icon, $author$project$Icon$disk, 'w-5 h-5')
			]));
};
var $author$project$Type$Above = 0;
var $author$project$Type$AllImport = 2;
var $author$project$Type$ExportAllZip = {$: 44};
var $author$project$View$SideBar$fileFunctionTrigger = function (model) {
	var menuId = 'file-functions';
	var isOpen = _Utils_eq(
		model.ar,
		$elm$core$Maybe$Just(menuId));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('relative flex flex-1 h-full')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						$author$project$View$SideBar$footerButton(model.bh)),
						$author$project$View$ViewHelper$stopClickPropagation(
						$author$project$Type$ToggleExportMenu(menuId))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('File ▾')
					])),
				A4(
				$author$project$View$ViewHelper$openDropdown,
				isOpen,
				0,
				model.bh,
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Import',
						$author$project$Type$RequestImport(2)),
						_Utils_Tuple2('Zip', $author$project$Type$ExportAllZip)
					]))
			]));
};
var $author$project$View$SideBar$functionButton = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$SideBar$footerButton(theme))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('etc')
			]));
};
var $author$project$View$SideBar$sideFooter = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'px-3',
				'py-1.5',
				'h-10',
				'border-t',
				'flex',
				'items-center',
				'w-full',
				'gap-2',
				$author$project$View$Style$basecolors(theme).a0,
				$author$project$View$Style$basecolors(theme).cg
			]));
};
var $author$project$View$SideBar$sidebarFooter = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$SideBar$sideFooter(model.bh))
			]),
		_List_fromArray(
			[
				$author$project$View$SideBar$fileFunctionTrigger(model),
				$author$project$View$SideBar$exportButton(model.bh),
				$author$project$View$SideBar$functionButton(model.bh)
			]));
};
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$View$SideBar$sideHeaderStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'flex',
				'flex-col',
				$author$project$View$Style$basecolors(theme).a0,
				$author$project$View$Style$basecolors(theme).cZ
			]));
};
var $author$project$View$SideBar$sidebarTitle = function (model) {
	return A2(
		$elm$html$Html$h1,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex-1 cursor-pointer select-none'),
				$elm$html$Html$Events$onClick(
				$author$project$Type$ChangeMainView($author$project$Type$ShelfListView))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-medium tracking-widest w-full flex justify-center'),
						A2(
						$elm$html$Html$Attributes$style,
						'font-family',
						$author$project$View$Style$basecolors(model.bh).aG)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Pumice')
					]))
			]));
};
var $author$project$Icon$right = _List_fromArray(
	['M501.66,235.774L228.764,38.771c-7.692-4.975-17.622-4.78-25.11,0.496c-7.478,5.277-11.022,14.546-8.928,23.465l22.53,96.466H32.441C14.537,159.189,0.01,173.715,0.01,191.63L0,320.372c0.01,17.925,14.537,32.442,32.441,32.442h184.823l-22.549,96.457c-2.084,8.908,1.45,18.197,8.938,23.464c7.488,5.267,17.418,5.472,25.11,0.507L501.66,276.228c6.494-4.693,10.34-12.219,10.34-20.232S508.155,240.457,501.66,235.774z']);
var $author$project$View$SideBar$undoButtonStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-8',
				'h-8',
				'flex',
				'border',
				'items-center',
				'justify-center',
				$author$project$View$Style$basecolors(theme).aj,
				$author$project$View$Style$basecolors(theme).aW,
				'hover:bg-white/25'
			]));
};
var $author$project$View$SideBar$viewRedoButton = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$SideBar$undoButtonStyle(theme)),
				$elm$html$Html$Events$onClick($author$project$Type$Redo),
				$elm$html$Html$Attributes$title('Redo')
			]),
		_List_fromArray(
			[
				A2($author$project$View$Style$icon, $author$project$Icon$right, 'w-5 h-5')
			]));
};
var $author$project$Icon$left = _List_fromArray(
	['M479.568,159.192H294.751l22.54-96.459c2.094-8.92-1.451-18.198-8.937-23.475c-7.488-5.268-17.419-5.463-25.111-0.496L10.34,235.768C3.846,240.461,0,247.987,0,256.001c0,8.013,3.846,15.539,10.34,20.232L283.243,473.24c7.692,4.965,17.623,4.771,25.111-0.506c7.486-5.267,11.021-14.546,8.937-23.465l-22.54-96.459h184.817c17.905,0,32.432-14.518,32.432-32.433V191.623C512,173.708,497.474,159.192,479.568,159.192z']);
var $author$project$View$SideBar$viewUndoButton = function (theme) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$SideBar$undoButtonStyle(theme)),
				$elm$html$Html$Events$onClick($author$project$Type$Undo),
				$elm$html$Html$Attributes$title('元に戻す')
			]),
		_List_fromArray(
			[
				A2($author$project$View$Style$icon, $author$project$Icon$left, 'w-5 h-5')
			]));
};
var $author$project$View$SideBar$undoRedoGroup = function (theme) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex items-center gap-2')
			]),
		_List_fromArray(
			[
				$author$project$View$SideBar$viewUndoButton(theme),
				$author$project$View$SideBar$viewRedoButton(theme)
			]));
};
var $author$project$View$SideBar$sidebarTitleRow = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex items-center gap-2 px-3 py-2.5')
			]),
		_List_fromArray(
			[
				$author$project$View$SideBar$sidebarTitle(model),
				$author$project$View$SideBar$undoRedoGroup(model.bh)
			]));
};
var $author$project$Type$UpdateSearchText = function (a) {
	return {$: 19, a: a};
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$View$SideBar$searchBoxStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'relative',
				'px-3',
				'py-2',
				$author$project$View$Style$basecolors(theme).aW
			]));
};
var $author$project$View$SideBar$searchClearbuttonStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'absolute',
				'flex',
				'-translate-y-1/2',
				'right-5',
				'top-1/2',
				'w-5',
				'h-5',
				'items-center',
				'justify-center',
				'text-xs',
				'rounded',
				$author$project$View$Style$basecolors(theme).cZ,
				'hover:bg-white/25'
			]));
};
var $author$project$View$SideBar$searchInputStyle = function (theme) {
	return $author$project$View$Style$tw(
		_List_fromArray(
			[
				'w-full',
				'pl-6',
				'pr-3',
				'py-1.5',
				'mono',
				'text-xs',
				'border',
				'outline-none',
				'placeholder:opacity-50',
				$author$project$View$Style$basecolors(theme).cf,
				$author$project$View$Style$basecolors(theme).cg,
				$author$project$View$Style$basecolors(theme).M,
				$author$project$View$Style$basecolors(theme).aW
			]));
};
var $author$project$View$SideBar$viewSearchInput = F2(
	function (theme, searchText) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$SideBar$searchBoxStyle(theme))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('text'),
							$elm$html$Html$Attributes$placeholder('Search content...'),
							$elm$html$Html$Attributes$class(
							$author$project$View$SideBar$searchInputStyle(theme)),
							$elm$html$Html$Events$onInput($author$project$Type$UpdateSearchText),
							$elm$html$Html$Attributes$value(searchText)
						]),
					_List_Nil),
					(!$elm$core$String$isEmpty(searchText)) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$author$project$View$SideBar$searchClearbuttonStyle(theme)),
							$elm$html$Html$Events$onClick(
							$author$project$Type$UpdateSearchText('')),
							$elm$html$Html$Attributes$title('Clear search')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$Type$ChangeSidebarTab = function (a) {
	return {$: 16, a: a};
};
var $author$project$View$SideBar$tabStyle = F2(
	function (theme, isActive) {
		return $author$project$View$Style$tw(
			_List_fromArray(
				[
					'flex-1',
					'py-2',
					'mono',
					'text-sm',
					'relative',
					'font-bold',
					isActive ? $author$project$View$Style$tw(
					_List_fromArray(
						[
							$author$project$View$Style$basecolors(theme).bl,
							$author$project$View$Style$basecolors(theme).bN
						])) : $author$project$View$Style$tw(
					_List_fromArray(
						['hover:bg-white/10']))
				]));
	});
var $author$project$View$SideBar$viewTabButton = F3(
	function (model, tab, label) {
		var searchText = model.bY;
		var isActive = _Utils_eq(model.ac, tab);
		var hasExternalHit = function () {
			if ($elm$core$String$isEmpty(searchText)) {
				return false;
			} else {
				switch (tab) {
					case 0:
						return A2(
							$elm$core$List$any,
							$author$project$Domain$Helper$hasHitInShelf(searchText),
							A2(
								$elm$core$List$filter,
								function (s) {
									return !_Utils_eq(s.D, model.x.ao);
								},
								model.x.A));
					case 1:
						return A2(
							$elm$core$List$any,
							$author$project$Domain$Helper$hasHitInBook(searchText),
							A2(
								$elm$core$List$filter,
								function (b) {
									return !_Utils_eq(
										$elm$core$Maybe$Just(b.D),
										model.x.W);
								},
								A2(
									$elm$core$List$concatMap,
									function ($) {
										return $.V;
									},
									A2(
										$elm$core$List$filter,
										function (s) {
											return _Utils_eq(s.D, model.x.ao);
										},
										model.x.A))));
					default:
						return false;
				}
			}
		}();
		var indicator = hasExternalHit ? A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full shadow-sm')
				]),
			_List_Nil) : $elm$html$Html$text('');
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$View$SideBar$tabStyle, model.bh, isActive)),
					$elm$html$Html$Events$onClick(
					$author$project$Type$ChangeSidebarTab(tab))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label),
					indicator
				]));
	});
var $author$project$View$SideBar$viewSidebarTabs = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex mt-3'),
				A2(
				$elm$html$Html$Attributes$style,
				'font-family',
				$author$project$View$Style$basecolors(model.bh).aG)
			]),
		_List_fromArray(
			[
				A3($author$project$View$SideBar$viewTabButton, model, 0, 'Category'),
				A3($author$project$View$SideBar$viewTabButton, model, 1, 'Books'),
				A3($author$project$View$SideBar$viewTabButton, model, 2, 'Contents')
			]));
};
var $author$project$View$SideBar$sidebarHeader = function (model) {
	return A2(
		$elm$html$Html$header,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$View$SideBar$sideHeaderStyle(model.bh))
			]),
		_List_fromArray(
			[
				$author$project$View$SideBar$sidebarTitleRow(model),
				A2($author$project$View$SideBar$viewSearchInput, model.bh, model.bY),
				$author$project$View$SideBar$viewSidebarTabs(model)
			]));
};
var $author$project$View$SideBar$sidebarArea = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$aside,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$SideBar$asideStyle(model.bh))
				]),
			_List_fromArray(
				[
					$author$project$View$SideBar$sidebarHeader(model),
					A2($author$project$View$SideBarContents$sidebarContent, model, present),
					$author$project$View$SideBar$sidebarFooter(model)
				]));
	});
var $author$project$View$Contents$sidebarWrapper = $author$project$View$Style$tw(
	_List_fromArray(
		['w-[20%]', 'min-w-[250px]', 'flex-shrink-0', 'h-full']));
var $author$project$View$Contents$viewLayout = F2(
	function (model, present) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					$author$project$View$Contents$layoutContainer(model.bh)),
					A2(
					$elm$html$Html$Attributes$style,
					'font-family',
					$author$project$View$Style$basecolors(model.bh).cv)
				]),
			_List_fromArray(
				[
					function () {
					var _v0 = model.ab;
					switch (_v0) {
						case 0:
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($author$project$View$Contents$sidebarWrapper)
									]),
								_List_fromArray(
									[
										A2($author$project$View$SideBar$sidebarArea, model, present)
									]));
						case 1:
							return $elm$html$Html$text('');
						default:
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($author$project$View$Contents$sidebarWrapper)
									]),
								_List_fromArray(
									[
										A2($author$project$View$SideBar$sidebarArea, model, present)
									]));
					}
				}(),
					A2($author$project$View$MainArea$mainContentArea, model, present),
					function () {
					var _v1 = model.ab;
					switch (_v1) {
						case 0:
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($author$project$View$Contents$rightsidebarWrapper)
									]),
								_List_fromArray(
									[
										A2($author$project$View$RightSideBar$rightSidebarArea, model, present)
									]));
						case 1:
							return $elm$html$Html$text('');
						default:
							return $elm$html$Html$text('');
					}
				}(),
					((model.ab === 1) || (model.ab === 2)) ? A2($author$project$View$Contents$overlaySidebarArea, model, present) : $elm$html$Html$text('')
				]));
	});
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		cC: $author$project$Main$init,
		cX: $author$project$Main$subscriptions,
		c_: $author$project$Main$update,
		c$: function (model) {
			return A2($author$project$View$Contents$viewLayout, model, model.x);
		}
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (storageData) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (seed) {
					return $elm$json$Json$Decode$succeed(
						{av: seed, aw: storageData});
				},
				A2(
					$elm$json$Json$Decode$field,
					'seed',
					$elm$json$Json$Decode$list($elm$json$Json$Decode$int)));
		},
		A2($elm$json$Json$Decode$field, 'storageData', $elm$json$Json$Decode$value)))(0)}});}(this));