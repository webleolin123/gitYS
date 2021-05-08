//LibraryName:jUI;
/*!
 * jUI JavaScript Library v1
 * http://...
 *
 * Includes jQuery v1.12.4  [http://jquery.com/]
 * Includes Sizzle.js       [http://sizzlejs.com/]
 *
 * LastUpdate: 2018-01-12
 */

(function( window, appName ) {

	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var deletedIds = [];

	var document = window.document;

	var slice = deletedIds.slice;

	var concat = deletedIds.concat;

	var push = deletedIds.push;

	var indexOf = deletedIds.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};



	var
		version = "1.12.4",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android<4.1, IE<9
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	//定义<jUI>原型
	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		//[Attr](fn) 获取的对象个数
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		//[Func](fn) 获取数组第N个值或整个数组 @return {Element} @Tag <jUI>_Array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		//[Func](fn) 取一个数组中的元素，将其放入堆上，返回新的堆上的元素集合（<jUI>对象） @Tag <jUI>_Array
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		//[Func](fn) 遍历一个<jUI>对象，为每个匹配元素执行一个函数。@param {Function} callback callback(index, elem, args) @param 扩展参数，该参数将一并传入callback函数中 @Tag <jUI>_Array
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		//[Func](fn) 通过一个函数匹配当前集合中的每个元素,产生一个包含新的<jUI>对象。 @param {Function} callback callback(index, elem) @return {Array} 将 callback 返回的值合并成一个数组 @Tag <jUI>_Array
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		//[Func](fn) 根据指定的下标范围，过滤匹配的元素集合，并生成一个新的 <jUI> 对象。 @Tag <jUI>_Array
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		//[Func](fn) 获取匹配元素集合中第一个元素 @return {<jUI>} @Tag <jUI>_Array
		first: function() {
			return this.eq( 0 );
		},

		//[Func](fn) 获取匹配元素集合中最后一个元素 @return {<jUI>} @Tag <jUI>_Array
		last: function() {
			return this.eq( -1 );
		},

		//[Func](fn) 减少匹配元素的集合为指定的索引的哪一个元素 @param index 指示元素的位置，以0为基数 @return {<jUI>} @Tag <jUI>_Array
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		//[Func](fn) 终止在当前链的最新过滤操作，并返回匹配的元素的以前状态 @Tag <jUI>_Array
		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: deletedIds.sort,
		splice: deletedIds.splice
	};

	/**
	 * 将两个或更多对象的内容合并到第一个对象
	 * 当参数中仅有一个Object时，将会合并到<jUI>中
	 * @name <jUI>.extend
	 * @param deep {Boolean} 深拷贝（递归）(非必填)
	 * @param target {JSON|Object} 对象扩展。这将接收新的属性。
	 * @param object1 {JSON|Object} 一个对象，它包含额外的属性合并到target.
	 * @param objectN {JSON|Object} 包含额外的属性合并到第一个参数 (非必填)
	 * @return {JSON|Object} 合并完后的对象
	 * @Tag <jUI>_Utils
	 */
	//
	/**
	 * 一个对象的内容合并到<jUI>的原型，以提供新的<jUI>实例方法。
	 * @name <jUI>.fn.extend
	 * @param object {JSON|Object} 一个对象，用来合并到<jUI>的原型。
	 * @Tag <jUI>_Utils
     */
	jQuery.extend = jQuery.fn.extend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {

						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		//[Func] 一个空函数 @Tag <jUI>_Utils
		noop: function() {},

		// See test/unit/core.js for details concerning isFunction.
		// Since version 1.3, DOM methods and functions like alert
		// aren't supported. They return false on IE (#2968).
		//[Func]确定参数是否为一个Javascript 函数 @return {Boolean} @Tag <jUI>_Utils,<jUI>_Check
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},

		//[Func]确定的参数是一个数组 @return {Boolean} @Tag <jUI>_Utils,<jUI>_Check
		isArray: Array.isArray || function( obj ) {
			return jQuery.type( obj ) === "array";
		},

		//[Func]确定参数是否为一个window对象 @return {Boolean} @Tag <jUI>_Utils,<jUI>_Check
		isWindow: function( obj ) {
			/* jshint eqeqeq: false */
			return obj != null && obj == obj.window;
		},

		//[Func]确定它的参数是否是一个数字 @return {Boolean} @Tag <jUI>_Utils,<jUI>_Check
		isNumeric: function( obj ) {

			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},

		//[Func]检查对象是否为空（不包含任何属性） @return {Boolean} @Tag <jUI>_Utils,<jUI>_Check
		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},

		//[Func]判断指定参数是否是一个纯粹的对象（通过 "{}" 或者 "new Object" 创建的） @return {Boolean} @Tag <jUI>_Utils,<jUI>_Check
		isPlainObject: function( obj ) {
			var key;

			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			try {

				// Not own constructor property must be Object
				if ( obj.constructor &&
					!hasOwn.call( obj, "constructor" ) &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
					return false;
				}
			} catch ( e ) {

				// IE8,9 Will throw exceptions on certain host objects #9897
				return false;
			}

			// Support: IE<9
			// Handle iteration over inherited properties before own properties.
			if ( !support.ownFirst ) {
				for ( key in obj ) {
					return hasOwn.call( obj, key );
				}
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
			for ( key in obj ) {}

			return key === undefined || hasOwn.call( obj, key );
		},

		//[Func]确定 JavaScript 对象的类型 &#91;&#91;Class&#93;&#93; @return {String} obj的类型，包含:Boolean Number, String, Function, Array, Date, RegExp, Object, Error, undefined, null @Tag <jUI>_Utils,<jUI>_Check
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},

		// Workarounds based on findings by Jim Driscoll
		// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
		//[Func] 在全局上下文下执行一些 JavaScript 代码 @param {String} 用来执行的JavaScript代码。 @Tag <jUI>_Utils
		globalEval: function( data ) {
			if ( data && jQuery.trim( data ) ) {

				// We use execScript on Internet Explorer
				// We use an anonymous function so that context is window
				// rather than jQuery in Firefox
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
				} )( data );
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Microsoft forgot to hump their vendor prefix (#9572)
		//将形如background-color转化为驼峰表示法：backgroundColor @Tag <jUI>_Utils
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		//检查elem的nodeName是否为name
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		//[Func] 一个通用的迭代函数，它可以用来无缝迭代对象和数组。数组和类似数组的对象通过一个长度属性（如一个函数的参数对象）来迭代数字索引，从0到length - 1。其他对象通过其属性名进行迭代。@param {Object} 遍历的对象或数组。 @param {Function} callback callback(index, value, args) @param 扩展参数，该参数将一并传入callback函数中 @Tag <jUI>_Array,<jUI>_Utils
		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1, IE<9
		//[Func] 去掉字符串起始和结尾的空格。 @param {String} 要处理的字符 @Tag <jUI>_Utils
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		//[Func] 将一个类数组对象转换为真正的数组对象 @param {Array} 转换成一个原生数组的任何对象。 @Tag <jUI>_Array,<jUI>_Utils
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		//[Func] 在数组中查找指定值并返回它的索引（如果没有找到，则返回-1）。@param {Anything|Function} 要查找的值。当该参数为函数时，格式为function(item) 自行判断返回true 或false @param {Array} 一个数组，通过它来查找。@param {Number} fromIndex 数组索引值，表示从哪里在开始查找。默认值是0，这将查找整个数组。@return {Number}（如果没有找到，则返回-1） @Tag <jUI>_Array,<jUI>_Utils,<jUI>_Check
		inArray: function( elem, arr, i ) {
			var len;

			if ( arr ) {
				if ( indexOf ) {
					return indexOf.call( arr, elem, i );
				}

				len = arr.length;
				i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

				for ( ; i < len; i++ ) {

					// Skip accessing in sparse arrays
					if ( i in arr && arr[ i ] === elem ) {
						return i;
					}
				}
			}

			return -1;
		},

		//[Func] 合并两个数组，修改第一个参数的内容 @param {Array} 第一个用于合并的数组，其中将会包含合并后的第二个数组的内容。 @param {Array} 第二个用于合并的数组，该数组不会被修改，其中的内容将会被合并到第一个数组中。@return {Array} 合并后的数组 @Tag <jUI>_Array,<jUI>_Utils
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			while ( j < len ) {
				first[ i++ ] = second[ j++ ];
			}

			// Support: IE<9
			// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
			if ( len !== len ) {
				while ( second[ j ] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}

			first.length = i;

			return first;
		},

		//[Func] 查找满足过滤函数的数组元素。原始数组不受影响。@param {Array} array 用于查询元素的数组。@param {Function} callback(item,index) 该函数来处理每项元素的比对。该函数应返回一个布尔值 @param {Boolean} 如果“invert”为true，函数返回一个“callback”中返回false的所有元素组成的数组。 @return {Array} 过滤过的数组 @Tag <jUI>_Array,<jUI>_Utils
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		//[Func] 将一个数组中的所有元素转换到另一个数组中。@param {Array|Object} 待转换数组。@param {Function} callback(item,index,arg) 处理每一个元素的函数。该函数可以返回任何值。 @param 扩展参数，该参数将一并传入callback函数中 @return {Array|Object} 转换过的数组 @Tag <jUI>_Array,<jUI>_Utils
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var args, proxy, tmp;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		//当前时间
		now: function() {
			return +( new Date() );
		},

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		/**
		 * 返回用户当前使用的浏览器的特性或bug信息
		 * @Name <jUI>.support
		 * @Type Attr
		 * @eg //返回内容如下：
		 * {
		 * appendChecked:true, //检查被添加到 DOM 中的 checkbox 是否仍然保留原来的选中状态。IE:false,FireFox:true
		 * boxSizing:true,     //检测是否支持box-sizing
		 * boxSizingReliable:function(), //检测盒子模型是否可靠
		 * changeBubbles:true, //检查 change 事件是否在“冒泡阶段”触发
		 * checkClone:true,    //检查 fragment 中的 checkbox 的选中状态是否能被复制。IE:false,FireFox:true
		 * checkOn:true,       //检查 chebox 的 value 是否为 “on”。
		 * clearCloneStyle:true, //检测元素的backgroundClip是否被清除
		 * cssFloat:true,      //检查 css 样式中的 float 属性能够被有效支持。
		 * deleteExpando:true, //检查是否允许删除附加在 DOM Element 上的数据。IE:false,FireFox:true
		 * enctype:true,       //检查 form 是否支持 enctype
		 * focusBubbles:true,  //检查 focus 事件是否在“冒泡阶段”触发
		 * getSetAttribute:true, //检查能够功过 getAttribute("calssName") 和 setAttribute("className", "...") 来获取和设置 div 的 css class。
		 * hrefNormalized:true, //检查链接的 “href” 属性能否被正常地序列化。
		 * html5Clone:true,    //是否可以克隆 html5 节点
		 * htmlSerialize:true, //link标签能否被正确地序列化。IE:false,FireFox:true
		 * inlineBlockNeedsLayout:true, //检测块元素在display:inline并拥有layout属性，是否会按inline-block显示
		 * input:true,         //验证input元素value值
		 * leadingWhitespace:true, //用 innerHTML 赋值时，是否会保留前面的空白符。IE:false,FireFox:true
		 * noCloneChecked:true, //检查复制 checkbox 时是否连选中状态也一同复制
		 * noCloneEvent:true,  //检查复制 DOM Element 时是否会连同 event 一起复制。IE:false,FireFox:true
		 * opacity:true,       //检查 css 样式中的透明度设置能够被有效支持。
		 * optDisabled:true,   //已经被设为 disable 的 select ，其内部的 option 的 disable 不应为 true
		 * optSelected:true,   //检查 select 中的第一个 option 能否被默认选中。
		 * ownLast:true,       //ownLast
		 * pixelPosition:function(), //检测图层定位（像素位置）是否有误
		 * radioValue:true,    //检查 input 元素被设为 radio 类型后是否仍然保持原来的值。
		 * reliableHiddenOffsets:function(), //检查 hidden 状态下的 offsetWidth 和 offsetHeight 是否正确。
		 * reliableMarginRight:function(), //检查 Margin Right 的计算是否可靠
		 * shrinkWrapBlocks:function(), //内部 DOM Element 的样式是否会影响外部 DOM Element 的样式
		 * style:true,         //检查是否能通过 “style” 属性获取 DOM Element 的样式。
		 * submitBubbles:true, //检查 submit 事件是否在“冒泡阶段”触发
		 * tbody:true          //是否会自动为 table 插入 tbody。IE:false,FireFox:true
		 * }
         */
		support: support
	} );

	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
	}
	/* jshint ignore: end */

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

	function isArrayLike( obj ) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",

		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {

			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

					// ID selector
					if ( (m = match[1]) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {

								results.push( elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {

						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;

					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {

						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}

					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );

		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );

			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return document;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});

									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {

										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});

												uniqueCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	//[Func:<jUI>.find] Sizzle选择器, 选择后直接返回 HTML 对象数组而且非<jUI>对象 @Tag <jUI>_Array
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	//[Func:<jUI>.unique] 删除数组(或DOM元素数组)中重复元素。去重前必须先排序。@param {Array} arr 用于排序的数组。@Tag <jUI>_Array
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	//[Func:<jUI>.text] 得到元素集合中每个元素的合并文本，包括他们的后代设置匹配元素集合中每个元素的文本内容为指定的文本内容。@param {<jUI>|Element} elem 要获取的元素集合。@Tag <jUI>_DOM
	jQuery.text = Sizzle.getText;
	//[Func:<jUI>.isXMLDoc] 检查一个DOM节点是否在XML文档中（或者是一个XML文档）。@param {Element} elem 用来检查是否在一个XML文档中的DOM节点。 @Tag <jUI>_Utils,<jUI>_Check
	jQuery.isXMLDoc = Sizzle.isXML;
	//[Func:<jUI>.contains] 检查一个DOM元素是另一个DOM元素的后代。@param {Element} container DOM元素作为容器，可以包含其他元素 @param {Element} contained DOM元素，可能被其他元素所包含 @Tag <jUI>_Array
	jQuery.contains = Sizzle.contains;



	//从一个元素出发，迭代检索某个方向上的所有元素并记录，直到遇到document对象或遇到until匹配的元素 @param 起始元素 @param 迭代方向，可选值：parentNode nextSibling previousSibling @param 选择器表达式，如果遇到until匹配的元素，迭代终止 @Tag <jUI>_Array
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	//元素n的所有后续兄弟元素，包含n，不包含elem @param 起始元素（包含在返回结果中） @param 排除元素 @Tag <jUI>_Array
	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );

		}

		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );

		}

		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}

			qualifier = jQuery.filter( qualifier, elements );
		}

		return jQuery.grep( elements, function( elem ) {
			return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
		} );
	}

	//[Func] 筛选出符合指定表达式的元素 @param {String} 一个用于匹配元素的选择器字符串。 @param  @param {Boolean} 是否为排除 @Tag <jUI>_Array
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};

	jQuery.fn.extend( {
		//[Func](fn) 通过一个选择器，<jUI>对象，或元素过滤，得到当前匹配的元素集合中每个元素的后代。 @param {String|<jUI> object|Element} 一个用于匹配元素的选择器字符串 或 <jUI>对象 或 元素集合 @return {<jUI>} 返回<jUI>集合 @Tag <jUI>_Array
		find: function( selector ) {
			var i,
				ret = [],
				self = this,
				len = self.length;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		//[Func](fn) 筛选元素集合中匹配表达式 或 通过传递函数测试的 那些元素集合。 @param {String|Function|Element|<jUI> object} 一个用于匹配元素的选择器字符串 或函数(funciton(index)) 或 元素集合 或 <jUI>对象 @return {<jUI>} 返回<jUI>集合 @Tag <jUI>_Array
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		//[Func](fn) 从匹配的元素集合中移除指定的元素。 @param {String|Function|Element|<jUI> object} 一个用于匹配元素的选择器字符串 或函数(funciton(index)) 或 元素集合 或 <jUI>对象 @return {<jUI>} 返回<jUI>集合 @Tag <jUI>_Array
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		//[Func](fn) 判断当前匹配的元素集合中的元素，是否为一个选择器，DOM元素，或者<jUI>对象，如果这些元素至少一个匹配给定的参数，那么返回true。 @param {String|Function|Element|<jUI> object} 一个用于匹配元素的选择器字符串 或函数(funciton(index)) 或 元素集合 或 <jUI>对象 @return {<jUI>} 返回<jUI>集合 @Tag <jUI>_Array
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// init accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector.charAt( 0 ) === "<" &&
					selector.charAt( selector.length - 1 ) === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {

							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id !== match[ 2 ] ) {
								return rootjQuery.find( selector );
							}

							// Otherwise, we inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return typeof root.ready !== "undefined" ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		//[Func](fn) 筛选匹配元素集合中的那些有相匹配的选择器或DOM元素的后代元素。@param {String|Element} 一个用于匹配元素的选择器字符串 或 DOM元素 @Tag <jUI>_Array
		has: function( target ) {
			var i,
				targets = jQuery( target, this ),
				len = targets.length;

			return this.filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		//[Func](fn) 从元素本身开始，在DOM 树上逐级向上级元素匹配，并返回最先匹配的祖先元素。以数组的形式返回与选择器相匹配的所有元素，从当前元素开始，在 DOM 树中向上遍历。@param {String|<jUI> object|Element} 一个用于匹配元素的选择器字符串 或 <jUI>对象 或 DOM元素 @Tag <jUI>_Array
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;

			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within
		// the matched set of elements
		//[Func](fn) 从匹配的元素中搜索给定元素的索引值，从0开始计数。 @param {String|Element} 一个选择器，代表一个<jUI>对象，将会从这个对象中查找元素。 或 将要用于查找的DOM元素，或者jQuery对象中的第一个元素。@return {number} 如果不传递任何参数,则返回值就是<jUI>对象中第一个元素相对于它同辈元素的位置。 @Tag <jUI>_Array
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// index in selector
			if ( typeof elem === "string" ) {
				return jQuery.inArray( this[ 0 ], jQuery( elem ) );
			}

			// Locate the position of the desired element
			return jQuery.inArray(

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem, this );
		},

		//[Func](fn) 添加元素到匹配的元素集合。@param {String|Element|HTML String|<jUI> object} 一个字符串表示的选择器表达式 或 DOM元素 或 HTML片段 或 <jUI>元素集合 @param {Element} 指定选择器查找元素所在的上下文 (当selector为表达式时，可用此参数) @Tag <jUI>_Array
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		//[Func](fn) 添加堆栈中元素集合到当前集合，一个选择性的过滤选择器。@param {String} 一个字符串表示的选择器表达式 @Tag <jUI>_Array
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		do {
			cur = cur[ dir ];
		} while ( cur && cur.nodeType !== 1 );

		return cur;
	}

	jQuery.each( {
		//[Func](fn) 取得匹配元素集合中，每个元素的父元素，可以提供一个可选的选择器。@param {String} 一个字符串表示的选择器表达式 @Tag <jUI>_Array
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		//[Func](fn) 获得集合中每个匹配元素的祖先元素，可以提供一个可选的选择器作为参数。@param {String} 一个字符串表示的选择器 @Tag <jUI>_Array
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		//[Func](fn) 查找当前元素的所有的前辈元素，直到遇到选择器， DOM 节点或 <jUI> 对象匹配的元素为止，但不包括这些元素。@param {String} 一个字符串表示的选择器 @Tag <jUI>_Array
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		//[Func](fn) 取得匹配的元素集合中每一个元素紧邻的后面同辈元素的元素集合。如果提供一个选择器，那么只有紧跟着的兄弟元素满足选择器时，才会返回此元素。 @Tag <jUI>_Array
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		//[Func](fn) 取得一个包含匹配的元素集合中每一个元素紧邻的前一个同辈元素的元素集合。选择性筛选的选择器。 @Tag <jUI>_Array
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		//[Func](fn) 获得每个匹配元素集合中所有下面的同辈元素，选择性筛选的选择器。 @Tag <jUI>_Array
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		//[Func](fn) 获得集合中每个匹配元素的所有前面的兄弟元素，选择性筛选的选择器。 @Tag <jUI>_Array
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		//[Func](fn) 通过选择器，DOM节点，或<jUI>对象得到每个元素之后的所有兄弟元素，但不包括匹配的元素。 @Tag <jUI>_Array
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		//[Func](fn) 获取每个元素但不包括选择器，DOM节点，或者<jUI>对象匹配的元素的所有前面的兄弟元素。 @Tag <jUI>_Array
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		//[Func](fn) 获得匹配元素集合中每个元素的兄弟元素,可以提供一个可选的选择器。 @Tag <jUI>_Array
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		//[Func](fn) 获得匹配元素集合中每个元素的子元素，选择器选择性筛选。 @Tag <jUI>_Array
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		//[Func](fn) 获得匹配元素集合中每个元素的子元素，包括文字和注释节点。 @Tag <jUI>_Array
		contents: function( elem ) {
			return jQuery.nodeName( elem, "iframe" ) ?
				elem.contentDocument || elem.contentWindow.document :
				jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var ret = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				ret = jQuery.filter( selector, ret );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					ret = jQuery.uniqueSort( ret );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					ret = ret.reverse();
				}
			}

			return this.pushStack( ret );
		};
	} );
	var rnotwhite = ( /\S+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = true;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];

				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add( function() {

						// state = [ resolved | rejected ]
						state = stateString;

					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}

				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );

						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}

			// if we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	} );


	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function( fn ) {

		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );

	/**
	 * Clean-up method for dom ready events
	 */
	function detach() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed );
			window.removeEventListener( "load", completed );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	}

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener ||
			window.event.type === "load" ||
			document.readyState === "complete" ) {

			detach();
			jQuery.ready();
		}
	}

	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE6-10
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );

			// Standards-based browsers support DOMContentLoaded
			} else if ( document.addEventListener ) {

				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );

			// If IE event model is used
			} else {

				// Ensure firing before onload, maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", completed );

				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", completed );

				// If IE and not a frame
				// continually check to see if the document is ready
				var top = false;

				try {
					top = window.frameElement == null && document.documentElement;
				} catch ( e ) {}

				if ( top && top.doScroll ) {
					( function doScrollCheck() {
						if ( !jQuery.isReady ) {

							try {

								// Use the trick by Diego Perini
								// http://javascript.nwbox.com/IEContentLoaded/
								top.doScroll( "left" );
							} catch ( e ) {
								return window.setTimeout( doScrollCheck, 50 );
							}

							// detach all dom ready events
							detach();

							// and execute any waiting functions
							jQuery.ready();
						}
					} )();
				}
			}
		}
		return readyList.promise( obj );
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();




	// Support: IE<9
	// Iteration over object's inherited properties before its own
	var i;
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownFirst = i === "0";

	// Note: most support tests are defined in their respective modules.
	// false until the test is run
	//检测块元素在display:inline并拥有layout属性，是否会按inline-block显示
	support.inlineBlockNeedsLayout = false;

	// Execute ASAP in case we need to set body.style.zoom
	jQuery( function() {

		// Minified: var a,b,c,d
		var val, div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Return for frameset docs that don't have a body
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		if ( typeof div.style.zoom !== "undefined" ) {

			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

			support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
			if ( val ) {

				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );
	} );


	( function() {
		var div = document.createElement( "div" );

		// Support: IE<9
		//检查是否允许删除附加在 DOM Element 上的数据。IE:false,FireFox:true
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch ( e ) {
			support.deleteExpando = false;
		}

		// Null elements to avoid leaks in IE.
		div = null;
	} )();
	var acceptData = function( elem ) {
		var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
			nodeType = +elem.nodeType || 1;

		// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
		return nodeType !== 1 && nodeType !== 9 ?
			false :

			// Nodes accept data unless otherwise specified; rejection can be conditional
			!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
	};




	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /([A-Z])/g;

	function dataAttr( elem, key, data ) {

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {

			var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :

						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				jQuery.data( elem, key, data );

			} else {
				data = undefined;
			}
		}

		return data;
	}

	// checks a cache object for emptiness
	function isEmptyDataObject( obj ) {
		var name;
		for ( name in obj ) {

			// if the public data object is empty, the private is still empty
			if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
				continue;
			}
			if ( name !== "toJSON" ) {
				return false;
			}
		}

		return true;
	}

	function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !acceptData( elem ) ) {
			return;
		}

		var ret, thisCache,
			internalKey = jQuery.expando,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
			data === undefined && typeof name === "string" ) {
			return;
		}

		if ( !id ) {

			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {

			// Avoid exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( typeof name === "string" ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	}

	function internalRemoveData( elem, name, pvt ) {
		if ( !acceptData( elem ) ) {
			return;
		}

		var thisCache, i,
			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				} else {

					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = name.concat( jQuery.map( name, jQuery.camelCase ) );
				}

				i = name.length;
				while ( i-- ) {
					delete thisCache[ name[ i ] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		/* jshint eqeqeq: false */
		} else if ( support.deleteExpando || cache != cache.window ) {
			/* jshint eqeqeq: true */
			delete cache[ id ];

		// When all else fails, undefined
		} else {
			cache[ id ] = undefined;
		}
	}

	jQuery.extend( {
		//[Attr] 全局缓存对象
		cache: {},

		// The following elements (space-suffixed to avoid Object.prototype collisions)
		// throw uncatchable exceptions if you attempt to set expando properties
		noData: {
			"applet ": true,
			"embed ": true,

			// ...but Flash objects (which have this classid) *can* handle expandos
			"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},

		//[Func] 是否有关联的数据
		hasData: function( elem ) {
			elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
			return !!elem && !isEmptyDataObject( elem );
		},

		//[Func] 设置,读取自定义数据
		data: function( elem, name, data ) {
			return internalData( elem, name, data );
		},

		//[Func] 移除自定义数据
		removeData: function( elem, name ) {
			return internalRemoveData( elem, name );
		},

		// For internal use only.
		_data: function( elem, name, data ) {
			return internalData( elem, name, data, true );
		},

		_removeData: function( elem, name ) {
			return internalRemoveData( elem, name, true );
		}
	} );

	jQuery.fn.extend( {
		//[Func](fn) 设置,读取自定义数据,解析html5属性 data-
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Special expections of .data basically thwart jQuery.access,
			// so implement the relevant behavior ourselves

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = jQuery.data( elem );

					if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						jQuery._data( elem, "parsedAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					jQuery.data( this, key );
				} );
			}

			return arguments.length > 1 ?

				// Sets one value
				this.each( function() {
					jQuery.data( this, key, value );
				} ) :

				// Gets one value
				// Try to fetch any internally stored data first
				elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
		},

		//[Func](fn) 移除自定义数据
		removeData: function( key ) {
			return this.each( function() {
				jQuery.removeData( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = jQuery._data( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object,
		// or returns the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return jQuery._data( elem, key ) || jQuery._data( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					jQuery._removeData( elem, type + "queue" );
					jQuery._removeData( elem, key );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = jQuery._data( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );


	( function() {
		var shrinkWrapBlocksVal;

		//内部 DOM Element 的样式是否会影响外部 DOM Element 的样式
		support.shrinkWrapBlocks = function() {
			if ( shrinkWrapBlocksVal != null ) {
				return shrinkWrapBlocksVal;
			}

			// Will be changed later if needed.
			shrinkWrapBlocksVal = false;

			// Minified: var b,c,d
			var div, body, container;

			body = document.getElementsByTagName( "body" )[ 0 ];
			if ( !body || !body.style ) {

				// Test fired too early or in an unsupported environment, exit.
				return;
			}

			// Setup
			div = document.createElement( "div" );
			container = document.createElement( "div" );
			container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
			body.appendChild( container ).appendChild( div );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			if ( typeof div.style.zoom !== "undefined" ) {

				// Reset CSS: box-sizing; display; margin; border
				div.style.cssText =

					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;" +
					"padding:1px;width:1px;zoom:1";
				div.appendChild( document.createElement( "div" ) ).style.width = "5px";
				shrinkWrapBlocksVal = div.offsetWidth !== 3;
			}

			body.removeChild( container );

			return shrinkWrapBlocksVal;
		};

	} )();
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHidden = function( elem, el ) {

			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};



	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );

			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}


	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	//-[Func] 多功能值操作（内部使用）。access方法可以使set/get方法在一个函数中体现。@param {Elements} elems DOM元素集合 @param {Function} 回调函数 callback(elems,key,value) @param 键  @param 值 @param  chainable 0:读取 1:设置 @param 该参数一般是不给的，当没有元素时返回undefined @param 字符串为真，函数为假
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn(
						elems[ i ],
						key,
						raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([\w:-]+)/ );

	var rscriptType = ( /^$|\/(?:java|ecma)script/i );

	var rleadingWhitespace = ( /^\s+/ );

	var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
			"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
			"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



	function createSafeFragment( document ) {
		var list = nodeNames.split( "|" ),
			safeFrag = document.createDocumentFragment();

		if ( safeFrag.createElement ) {
			while ( list.length ) {
				safeFrag.createElement(
					list.pop()
				);
			}
		}
		return safeFrag;
	}


	//检测浏览器支持情况
	( function() {
		var div = document.createElement( "div" ),
			fragment = document.createDocumentFragment(),
			input = document.createElement( "input" );

		// Setup
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

		// IE strips leading whitespace when .innerHTML is used
        //用 innerHTML 赋值时，是否会保留前面的空白符。IE:false,FireFox:true
		support.leadingWhitespace = div.firstChild.nodeType === 3;

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
        //是否会自动为 table 插入 tbody。IE:false,FireFox:true
		support.tbody = !div.getElementsByTagName( "tbody" ).length;

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		//link标签能否被正确地序列化。IE:false,FireFox:true
		support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		//是否可以克隆 html5 节点
		support.html5Clone =
			document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		input.type = "checkbox";
		input.checked = true;
		fragment.appendChild( input );
        //检查被添加到 DOM 中的 checkbox 是否仍然保留原来的选中状态。IE:false,FireFox:true
		support.appendChecked = input.checked;

		// Make sure textarea (and checkbox) defaultValue is properly cloned
		// Support: IE6-IE11+
		div.innerHTML = "<textarea>x</textarea>";
		//检查复制 checkbox 时是否连选中状态也一同复制
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

		// #11217 - WebKit loses check when the name is after the checked attribute
		fragment.appendChild( div );

		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input = document.createElement( "input" );
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
		// old WebKit doesn't clone checked state correctly in fragments
		//检查 fragment 中的 checkbox 的选中状态是否能被复制。IE:false,FireFox:true
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE<9
		// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
		//检查复制 DOM Element 时是否会连同 event 一起复制。IE:false,FireFox:true
		support.noCloneEvent = !!div.addEventListener;

		// Support: IE<9
		// Since attributes and properties are the same in IE,
		// cleanData must set properties to undefined rather than use removeAttribute
		div[ jQuery.expando ] = 1;
		support.attributes = !div.getAttribute( jQuery.expando );
	} )();


	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],

		// Support: IE8
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
	};

	// Support: IE8-IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll( context, tag ) {
		var elems, elem,
			i = 0,
			found = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
					undefined;

		if ( !found ) {
			for ( found = [], elems = context.childNodes || context;
				( elem = elems[ i ] ) != null;
				i++
			) {
				if ( !tag || jQuery.nodeName( elem, tag ) ) {
					found.push( elem );
				} else {
					jQuery.merge( found, getAll( elem, tag ) );
				}
			}
		}

		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], found ) :
			found;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var elem,
			i = 0;
		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			jQuery._data(
				elem,
				"globalEval",
				!refElements || jQuery._data( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/,
		rtbody = /<tbody/i;

	function fixDefaultChecked( elem ) {
		if ( rcheckableType.test( elem.type ) ) {
			elem.defaultChecked = elem.checked;
		}
	}

	/*
	 * 创建文档碎片
	 * 创建一个文档片段DocumentFragment,然后将HTML代码转换为DOM元素，并存在创建的文档片段中
	 * @param 含有待转换为DOM元素的HTML代码
	 * @param 含有文档对象、<jUI>对象或DOM元素，用于修正创建文档片段DocumentFragment的文档对象。
	 * @param 用于存放HTML代码中的script元素。
	 * @Tag <jUI>_DOM
	 */
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
								!tbody.childNodes.length ) {

								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}

				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	}


	( function() {
		var i, eventName,
			div = document.createElement( "div" );

		// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
		for ( i in { submit: true, change: true, focusin: true } ) {
			eventName = "on" + i;

			if ( !( support[ i ] = eventName in window ) ) {

				// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
				div.setAttribute( eventName, "t" );
				support[ i ] = div.attributes[ eventName ].expando === false;
			}
		}

		// Null elements to avoid leaks in IE.
		div = null;
	} )();


	var rformElems = /^(?:input|select|textarea)$/i,
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {
			var tmp, events, t, handleObjIn,
				special, eventHandle, handleObj,
				handlers, type, namespaces, origType,
				elemData = jQuery._data( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" &&
						( !e || jQuery.event.triggered !== e.type ) ?
						jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
						undefined;
				};

				// Add elem as a property of the handle fn to prevent a memory leak
				// with IE non-native events
				eventHandle.elem = elem;
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener/attachEvent if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						// Bind the global event handler to the element
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );

						} else if ( elem.attachEvent ) {
							elem.attachEvent( "on" + type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

			// Nullify elem to prevent memory leaks in IE
			elem = null;
		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
			var j, handleObj, tmp,
				origCount, t, events,
				special, handlers, type,
				namespaces, origType,
				elemData = jQuery.hasData( elem ) && jQuery._data( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				delete elemData.handle;

				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery._removeData( elem, "events" );
			}
		},

		trigger: function( event, data, elem, onlyHandlers ) {
			var handle, ontype, cur,
				bubbleType, special, tmp, i,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
					jQuery._data( cur, "handle" );

				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if (
					( !special._default ||
					 special._default.apply( eventPath.pop(), data ) === false
					) && acceptData( elem )
				) {

					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						try {
							elem[ type ]();
						} catch ( e ) {

							// IE<9 dies on focus/blur to hidden element (#1486,#12518)
							// only reproducible on winXP IE8 native, not IE9 in IE8 mode
						}
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function( event ) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

				/* jshint eqeqeq: false */
				for ( ; cur != this; cur = cur.parentNode || this ) {
					/* jshint eqeqeq: true */

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];

			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

			event = new jQuery.Event( originalEvent );

			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}

			// Support: IE<9
			// Fix target property (#1925)
			if ( !event.target ) {
				event.target = originalEvent.srcElement || document;
			}

			// Support: Safari 6-8+
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}

			// Support: IE<9
			// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
			event.metaKey = !!event.metaKey;

			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {

				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
				"pageX pageY screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var body, eventDoc, doc,
					button = original.button,
					fromElement = original.fromElement;

				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}

				// Add relatedTarget, if necessary
				if ( !event.relatedTarget && fromElement ) {
					event.relatedTarget = fromElement === event.target ?
						original.toElement :
						fromElement;
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						try {
							this.focus();
							return false;
						} catch ( e ) {

							// Support: IE<9
							// If we error on focus to hidden element (#1486, #12518),
							// let .trigger() run the handlers
						}
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		// Piggyback on a donor event to simulate a different one
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true

					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// Guard for simulated events was moved to jQuery.event.stopPropagation function
					// since `originalEvent` should point to the original event for the
					// constancy with other events and for more focused logic
				}
			);

			jQuery.event.trigger( e, null, elem );

			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};

	jQuery.removeEvent = document.removeEventListener ?
		function( elem, type, handle ) {

			// This "if" is needed for plain objects
			if ( elem.removeEventListener ) {
				elem.removeEventListener( type, handle );
			}
		} :
		function( elem, type, handle ) {
			var name = "on" + type;

			if ( elem.detachEvent ) {

				// #8545, #7054, preventing memory leaks for custom events in IE6-8
				// detachEvent needed property on element, by name of that event,
				// to properly expose it to GC
				if ( typeof elem[ name ] === "undefined" ) {
					elem[ name ] = null;
				}

				elem.detachEvent( name, handle );
			}
		};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: IE < 9, Android < 4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;
			if ( !e ) {
				return;
			}

			// If preventDefault exists, run it on the original event
			if ( e.preventDefault ) {
				e.preventDefault();

			// Support: IE
			// Otherwise set the returnValue property of the original event to false
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( !e || this.isSimulated ) {
				return;
			}

			// If stopPropagation exists, run it on the original event
			if ( e.stopPropagation ) {
				e.stopPropagation();
			}

			// Support: IE
			// Set the cancelBubble property of the original event to true
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && e.stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	// IE submit delegation
	if ( !support.submit ) {

		jQuery.event.special.submit = {
			setup: function() {

				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}

				// Lazy-add a submit handler when a descendant form may potentially be submitted
				jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target,
						form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

							// Support: IE <=8
							// We use jQuery.prop instead of elem.form
							// to allow fixing the IE8 delegated submit issue (gh-2332)
							// by 3rd party polyfills/workarounds.
							jQuery.prop( elem, "form" ) :
							undefined;

					if ( form && !jQuery._data( form, "submit" ) ) {
						jQuery.event.add( form, "submit._submit", function( event ) {
							event._submitBubble = true;
						} );
						jQuery._data( form, "submit", true );
					}
				} );

				// return undefined since we don't need an event listener
			},

			postDispatch: function( event ) {

				// If form was submitted by the user, bubble the event up the tree
				if ( event._submitBubble ) {
					delete event._submitBubble;
					if ( this.parentNode && !event.isTrigger ) {
						jQuery.event.simulate( "submit", this.parentNode, event );
					}
				}
			},

			teardown: function() {

				// Only need this for delegated form submit events
				if ( jQuery.nodeName( this, "form" ) ) {
					return false;
				}

				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove( this, "._submit" );
			}
		};
	}

	// IE change delegation and checkbox/radio fix
	if ( !support.change ) {

		jQuery.event.special.change = {

			setup: function() {

				if ( rformElems.test( this.nodeName ) ) {

					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if ( this.type === "checkbox" || this.type === "radio" ) {
						jQuery.event.add( this, "propertychange._change", function( event ) {
							if ( event.originalEvent.propertyName === "checked" ) {
								this._justChanged = true;
							}
						} );
						jQuery.event.add( this, "click._change", function( event ) {
							if ( this._justChanged && !event.isTrigger ) {
								this._justChanged = false;
							}

							// Allow triggered, simulated change events (#11500)
							jQuery.event.simulate( "change", this, event );
						} );
					}
					return false;
				}

				// Delegated event; lazy-add a change handler on descendant inputs
				jQuery.event.add( this, "beforeactivate._change", function( e ) {
					var elem = e.target;

					if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
						jQuery.event.add( elem, "change._change", function( event ) {
							if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
								jQuery.event.simulate( "change", this.parentNode, event );
							}
						} );
						jQuery._data( elem, "change", true );
					}
				} );
			},

			handle: function( event ) {
				var elem = event.target;

				// Swallow native change events from checkbox/radio, we already triggered them above
				if ( this !== elem || event.isSimulated || event.isTrigger ||
					( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

					return event.handleObj.handler.apply( this, arguments );
				}
			},

			teardown: function() {
				jQuery.event.remove( this, "._change" );

				return !rformElems.test( this.nodeName );
			}
		};
	}

	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = jQuery._data( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = jQuery._data( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						jQuery._removeData( doc, fix );
					} else {
						jQuery._data( doc, fix, attaches );
					}
				}
			};
		} );
	}

	jQuery.fn.extend( {

		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		},

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
		rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
		safeFragment = createSafeFragment( document ),
		fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

	// Support: IE<8
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

			elem.getElementsByTagName( "tbody" )[ 0 ] ||
				elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
			elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
			return;
		}

		var type, i, l,
			oldData = jQuery._data( src ),
			curData = jQuery._data( dest, oldData ),
			events = oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}

		// make the cloned public data object a copy from the original
		if ( curData.data ) {
			curData.data = jQuery.extend( {}, curData.data );
		}
	}

	function fixCloneNodeIssues( src, dest ) {
		var nodeName, e, data;

		// We do not need to do anything for non-Elements
		if ( dest.nodeType !== 1 ) {
			return;
		}

		nodeName = dest.nodeName.toLowerCase();

		// IE6-8 copies events bound via attachEvent when using cloneNode.
		if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
			data = jQuery._data( dest );

			for ( e in data.events ) {
				jQuery.removeEvent( dest, e, data.handle );
			}

			// Event data gets referenced instead of copied if the expando gets copied too
			dest.removeAttribute( jQuery.expando );
		}

		// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
		if ( nodeName === "script" && dest.text !== src.text ) {
			disableScript( dest ).text = src.text;
			restoreScript( dest );

		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		} else if ( nodeName === "object" ) {
			if ( dest.parentNode ) {
				dest.outerHTML = src.outerHTML;
			}

			// This path appears unavoidable for IE9. When cloning an object
			// element in IE9, the outerHTML strategy above is not sufficient.
			// If the src has innerHTML and the destination does not,
			// copy the src.innerHTML into the dest.innerHTML. #10324
			if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
				dest.innerHTML = src.innerHTML;
			}

		} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set

			dest.defaultChecked = dest.checked = src.checked;

			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if ( dest.value !== src.value ) {
				dest.value = src.value;
			}

		// IE6-8 fails to return the selected option to the default selected
		// state when cloning options
		} else if ( nodeName === "option" ) {
			dest.defaultSelected = dest.selected = src.defaultSelected;

		// IE6-8 fails to set the defaultValue to the correct value when
		// cloning other types of input fields
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	//DOM操作，主要功能是为了实现 DOM 的插入和替换。（内部使用）@param args 待插入的DOM元素或HTML代码 @param callback 回调函数，执行格式为callback.call( 目标元素即上下文, 待插入文档碎片/单个DOM元素 ) @Tag <jUI>_DOM
	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval(
									( node.text || node.textContent || node.innerHTML || "" )
										.replace( rcleanScript, "" )
								);
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			elems = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = elems[ i ] ) != null; i++ ) {

			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},

		//[Func] 创建一个元素的深度拷贝副本 @param {Element} 要拷贝的DOM元素 @param {Boolean=false} 表示是否会复制元素上的事件处理函数。 @param {Boolean=false} 指示是否对事件处理程序和克隆的元素的所有子元素的数据应该被复制。默认情况下它的值相匹配的第一个参数的值 @Tag <jUI>_DOM
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var destElements, node, clone, i, srcElements,
				inPage = jQuery.contains( elem.ownerDocument, elem );

			if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
				!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

				clone = elem.cloneNode( true );

			// IE<=8 does not properly clone detached, unknown element nodes
			} else {
				fragmentDiv.innerHTML = elem.outerHTML;
				fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
			}

			if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
					( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				// Fix all IE cloning issues
				for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

					// Ensure that the destination node is not null; Fixes #9587
					if ( destElements[ i ] ) {
						fixCloneNodeIssues( node, destElements[ i ] );
					}
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
						cloneCopyEvent( node, destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			destElements = srcElements = node = null;

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems, /* internal */ forceAcceptData ) {
			var elem, type, id, data,
				i = 0,
				internalKey = jQuery.expando,
				cache = jQuery.cache,
				attributes = support.attributes,
				special = jQuery.event.special;

			for ( ; ( elem = elems[ i ] ) != null; i++ ) {
				if ( forceAcceptData || acceptData( elem ) ) {

					id = elem[ internalKey ];
					data = id && cache[ id ];

					if ( data ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Remove cache only if it was not already removed by jQuery.event.remove
						if ( cache[ id ] ) {

							delete cache[ id ];

							// Support: IE<9
							// IE does not allow us to delete expando properties from nodes
							// IE creates expando attributes along with the property
							// IE does not have a removeAttribute function on Document nodes
							if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
								elem.removeAttribute( internalKey );

							// Webkit & Blink performance suffers when deleting properties
							// from DOM nodes, so set to undefined instead
							// https://code.google.com/p/chromium/issues/detail?id=378607
							} else {
								elem[ internalKey ] = undefined;
							}

							deletedIds.push( id );
						}
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {

		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,

		//[Func](fn) 从DOM中去掉所有匹配的元素。@param {String} Selector 一个选择表达式将需要移除的元素从匹配的元素中过滤出来。 @Tag <jUI>_DOM
		detach: function( selector ) {
			return remove( this, selector, true );
		},

		//[Func](fn) 将匹配元素集合从DOM中删除。 @param {String} 一个选择器表达式用来过滤将被移除的匹配元素集合。 @param keepData 此参数仅供内部使用 @Tag <jUI>_DOM
		remove: function( selector ) {
			return remove( this, selector );
		},

		//[Func](fn) 得到匹配元素集合中每个元素的合并文本，包括他们的后代设置匹配元素集合中每个元素的文本内容为指定的文本内容。@param {String|Function} 当传入参数为字符串时，设置元素的文本<br>当传函数时，函数return要设置的内容 function(index, text) @return {String} 合并后的文本 @Tag <jUI>_DOM
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().append(
						( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
					);
			}, null, value, arguments.length );
		},

		//[Func](fn) 在每个匹配元素里面的末尾处插入参数内容。@param {String|Element|<jUI>|Function} content DOM 元素，DOM元素数组，HTML字符串，或者<jUI>对象，用来插在每个匹配元素里面的末尾，可以有多个 content 参数。<br>当传函数时，函数return要插入的内容 function(index, text) @Tag <jUI>_DOM
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		//[Func](fn) 将参数内容插入到每个匹配元素的前面（元素内部）。@param {String|Element|<jUI>|Function} content DOM 元素，DOM元素数组，HTML字符串，或者<jUI>对象，将被插入到匹配元素前的内容。可以有多个 content 参数。<br>当传函数时，函数return要插入的内容 function(index, text) @Tag <jUI>_DOM
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		//[Func](fn) 根据参数设定，在匹配元素的前面插入内容（外部插入）@param {String|Element|<jUI>|Function} content DOM 元素，DOM元素数组，HTML字符串，或者<jUI>对象，将被插入到匹配元素前的内容。可以有多个 content 参数。<br>当传函数时，函数return要插入的内容 function(index, text) @Tag <jUI>_DOM
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		//[Func](fn) 在匹配元素集合中的每个元素后面插入参数所指定的内容，作为其兄弟节点。@param {String|Element|<jUI>|Function} content DOM 元素，DOM元素数组，HTML字符串，或者<jUI>对象，将被插入到匹配元素前的内容。可以有多个 content 参数。<br>当传函数时，函数return要插入的内容 function(index, text) @Tag <jUI>_DOM
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		//[Func](fn) 从DOM中移除集合中匹配元素的所有子节点。 @Tag <jUI>_DOM
		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {

				// Remove element nodes and prevent memory leaks
				if ( elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem, false ) );
				}

				// Remove any remaining nodes
				while ( elem.firstChild ) {
					elem.removeChild( elem.firstChild );
				}

				// If this is a select, ensure that it displays empty (#12336)
				// Support: IE<9
				if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
					elem.options.length = 0;
				}
			}

			return this;
		},

		//[Func](fn) 创建一个匹配的元素集合的深度拷贝副本。@param {Boolean=false} 是否会复制元素上的事件处理函数。 @param {Boolean=false} 是否对事件处理程序和克隆的元素的所有子元素的数据应该被复制。 @Tag <jUI>_DOM
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		//[Func](fn) 获取集合中第一个匹配元素的HTML内容 或 设置每一个匹配元素的html内容。@param {String|Function} （当此参数不传时为获取）用来设置每个匹配元素的一个HTML 字符串。<br>当传函数时，函数return要插入的内容 function(index, oldHtml) @Tag <jUI>_DOM
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined ) {
					return elem.nodeType === 1 ?
						elem.innerHTML.replace( rinlinejQuery, "" ) :
						undefined;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
					( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {

							// Remove element nodes and prevent memory leaks
							elem = this[ i ] || {};
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		//[Func](fn) 用提供的内容替换集合中所有匹配的元素并且返回被删除元素的集合。@param {String|Element|<jUI>|Function} content DOM 元素，DOM元素数组，HTML字符串，或者<jUI>对象，将被插入到匹配元素前的内容。<br>当传函数时，函数return要插入的内容 function(index, text) @Tag <jUI>_DOM
		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		//[Func:<jUI>.fn.appendTo](fn) 将匹配的元素插入到目标元素的最后面（内部插入）。 @param {String|Element|<jUI>} target 一个选择符，元素，HTML字符串，DOM元素数组，或者<jUI>对象；符合的元素们会被插入到由参数指定的目标的末尾。 @Tag <jUI>_DOM
		appendTo: "append",
		//[Func:<jUI>.fn.prependTo](fn) 将所有元素插入到目标前面（元素内）。 @param {String|Element|<jUI>} target 一个选择符，元素，HTML字符串，DOM元素数组，或者<jUI>对象；将被插入到匹配元素前的内容。 @Tag <jUI>_DOM
		prependTo: "prepend",
		//[Func:<jUI>.fn.insertBefore](fn) 在目标元素前面插入集合中每个匹配的元素(注：插入的元素作为目标元素的兄弟元素)。 @param {String|Element|<jUI>} target 一个选择符，元素，HTML字符串，DOM元素数组，或者<jUI>对象；匹配的元素将会被插入在由参数指定的目标后面。 @Tag <jUI>_DOM
		insertBefore: "before",
		//[Func:<jUI>.fn.insertAfter](fn) 在目标元素后面插入集合中每个匹配的元素(注：插入的元素作为目标元素的兄弟元素)。 @param {String|Element|<jUI>} target 一个选择符，元素，HTML字符串，DOM元素数组，或者<jUI>对象；匹配的元素将会被插入在由参数指定的目标后面。 @Tag <jUI>_DOM
		insertAfter: "after",
		//[Func:<jUI>.fn.replaceAll](fn) 用集合的匹配元素替换每个目标元素。 @param {String|Element|<jUI>} target 一个选择符，元素，HTML字符串，DOM元素数组，或者<jUI>对象；包含哪个元素被替换。 @Tag <jUI>_DOM
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				i = 0,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );


	var iframe,
		elemdisplay = {

			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};

	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */

	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

			display = jQuery.css( elem[ 0 ], "display" );

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];

		if ( !display ) {
			display = actualDisplay( nodeName, doc );

			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {

				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}

		return display;
	}
	var rmargin = ( /^margin/ );

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var documentElement = document.documentElement;



	( function() {
		var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
			reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		div.style.cssText = "float:left;opacity:.5";

		// Support: IE<9
		// Make sure that element opacity exists (as opposed to filter)
		//检查 css 样式中的透明度设置能够被有效支持。
		support.opacity = div.style.opacity === "0.5";

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		//检查 css 样式中的 float 属性能够被有效支持。
		support.cssFloat = !!div.style.cssFloat;

		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		//检测元素的backgroundClip是否被清除
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container = document.createElement( "div" );
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		div.innerHTML = "";
		container.appendChild( div );

		// Support: Firefox<29, Android 2.3
		// Vendor-prefix box-sizing
		//检测是否支持box-sizing
		support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
			div.style.WebkitBoxSizing === "";

		jQuery.extend( support, {
			//检查 hidden 状态下的  offsetWidth 和 offsetHeight 是否正确。
			reliableHiddenOffsets: function() {
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableHiddenOffsetsVal;
			},

			//检测盒子模型是否可靠
			boxSizingReliable: function() {

				// We're checking for pixelPositionVal here instead of boxSizingReliableVal
				// since that compresses better and they're computed together anyway.
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},

			pixelMarginRight: function() {

				// Support: Android 4.0-4.3
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},

			//检测图层定位（像素位置）是否有误
			pixelPosition: function() {
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return pixelPositionVal;
			},

			//检查 Margin Right 的计算是否可靠
			reliableMarginRight: function() {

				// Support: Android 2.3
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableMarginRightVal;
			},

			reliableMarginLeft: function() {

				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( pixelPositionVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			}
		} );

		function computeStyleTests() {
			var contents, divStyle,
				documentElement = document.documentElement;

			// Setup
			documentElement.appendChild( container );

			div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";

			// Support: IE<9
			// Assume reasonable values in the absence of getComputedStyle
			pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
			pixelMarginRightVal = reliableMarginRightVal = true;

			// Check for getComputedStyle so that this code is not run in IE<9.
			if ( window.getComputedStyle ) {
				divStyle = window.getComputedStyle( div );
				pixelPositionVal = ( divStyle || {} ).top !== "1%";
				reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
				boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

				// Support: Android 4.0 - 4.3 only
				// Some styles come back with percentage values, even though they shouldn't
				div.style.marginRight = "50%";
				pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

				// Support: Android 2.3 only
				// Div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				contents = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				contents.style.cssText = div.style.cssText =

					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				contents.style.marginRight = contents.style.width = "0";
				div.style.width = "1px";

				reliableMarginRightVal =
					!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

				div.removeChild( contents );
			}

			// Support: IE6-8
			// First check that getClientRects works as expected
			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			div.style.display = "none";
			reliableHiddenOffsetsVal = div.getClientRects().length === 0;
			if ( reliableHiddenOffsetsVal ) {
				div.style.display = "";
				div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
				div.childNodes[ 0 ].style.borderCollapse = "separate";
				contents = div.getElementsByTagName( "td" );
				contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
				if ( reliableHiddenOffsetsVal ) {
					contents[ 0 ].style.display = "";
					contents[ 1 ].style.display = "none";
					reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
				}
			}

			// Teardown
			documentElement.removeChild( container );
		}

	} )();


	var getStyles, curCSS,
		rposition = /^(top|right|bottom|left)$/;

	if ( window.getComputedStyle ) {
		getStyles = function( elem ) {

			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view || !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};

		curCSS = function( elem, name, computed ) {
			var width, minWidth, maxWidth, ret,
				style = elem.style;

			computed = computed || getStyles( elem );

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

			// Support: Opera 12.1x only
			// Fall back to style even without computed
			// computed is undefined for elems on document fragments
			if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			if ( computed ) {

				// A tribute to the "awesome hack by Dean Edwards"
				// Chrome < 17 and Safari 5.0 uses "computed value"
				// instead of "used value" for margin-right
				// Safari 5.1.7 (at least) returns percentage for a larger set of values,
				// but width seems to be reliably pixels
				// this is against the CSSOM draft spec:
				// http://dev.w3.org/csswg/cssom/#resolved-values
				if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

					// Remember the original values
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;

					// Put in the new values to get a computed value out
					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;

					// Revert the changed values
					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}

			// Support: IE
			// IE returns zIndex value as an integer.
			return ret === undefined ?
				ret :
				ret + "";
		};
	} else if ( documentElement.currentStyle ) {
		getStyles = function( elem ) {
			return elem.currentStyle;
		};

		curCSS = function( elem, name, computed ) {
			var left, rs, rsLeft, ret,
				style = elem.style;

			computed = computed || getStyles( elem );
			ret = computed ? computed[ name ] : undefined;

			// Avoid setting ret to empty string here
			// so we don't default to auto
			if ( ret == null && style && style[ name ] ) {
				ret = style[ name ];
			}

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			// but not position css attributes, as those are
			// proportional to the parent element instead
			// and we can't measure the parent instead because it
			// might trigger a "stacking dolls" problem
			if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

				// Remember the original values
				left = style.left;
				rs = elem.runtimeStyle;
				rsLeft = rs && rs.left;

				// Put in the new values to get a computed value out
				if ( rsLeft ) {
					rs.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				if ( rsLeft ) {
					rs.left = rsLeft;
				}
			}

			// Support: IE
			// IE returns zIndex value as an integer.
			return ret === undefined ?
				ret :
				ret + "" || "auto";
		};
	}




	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var

			ralpha = /alpha\([^)]*\)/i,
		ropacity = /opacity\s*=\s*([^)]*)/i,

		// swappable if display is none or starts with table except
		// "table", "table-cell", or "table-caption"
		// see here for display values:
		// https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;


	// return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {

		// shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}

		// check for vendor prefixed names
		var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			values[ index ] = jQuery._data( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] =
						jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
				}
			} else {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}

		return elements;
	}

	function setPositiveNumber( elem, value, subtract ) {
		var matches = rnumsplit.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?

			// If we already have the right measurement, avoid augmentation
			4 :

			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for ( ; i < 4; i += 2 ) {

			// both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {

				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// at this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {

				// at this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// at this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = support.boxSizing &&
				jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		//直接向 <jUI> 中添加钩子，用于覆盖设置或获取特定 CSS 属性时的方法，目的是为了标准化 CSS 属性名或创建自定义属性。（内部使用）
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {

			// normalize float css property
			"float": support.cssFloat ? "cssFloat" : "styleFloat"
		},

		// Get and set the style property on a DOM Node
		//[Func] 获取设置 DOM 节点的 style 属性 @Tag <jUI>_CSS
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set. See: #7116
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
				// but it would mean to define eight
				// (for every problematic property) identical functions
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					// Support: IE
					// Swallow errors from 'invalid' CSS values (#5509)
					try {
						style[ name ] = value;
					} catch ( e ) {}
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		//[Func] 获取设置元素CSS属性 @Tag <jUI>_CSS
		css: function( elem, name, extra, styles ) {
			var num, val, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			//convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var styles = extra && getStyles( elem );
				return setPositiveNumber( elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						support.boxSizing &&
							jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					) : 0
				);
			}
		};
	} );

	if ( !support.opacity ) {
		jQuery.cssHooks.opacity = {
			get: function( elem, computed ) {

				// IE uses filters for opacity
				return ropacity.test( ( computed && elem.currentStyle ?
					elem.currentStyle.filter :
					elem.style.filter ) || "" ) ?
						( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
						computed ? "1" : "";
			},

			set: function( elem, value ) {
				var style = elem.style,
					currentStyle = elem.currentStyle,
					opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
					filter = currentStyle && currentStyle.filter || style.filter || "";

				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// if setting opacity to 1, and no other filters exist -
				// attempt to remove filter attribute #6652
				// if value === "", then remove inline opacity #12685
				if ( ( value >= 1 || value === "" ) &&
						jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
						style.removeAttribute ) {

					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute( "filter" );

					// if there is no filter style applied in a css rule
					// or unset inline opacity, we are done
					if ( value === "" || currentStyle && !currentStyle.filter ) {
						return;
					}
				}

				// otherwise, set new filter values
				style.filter = ralpha.test( filter ) ?
					filter.replace( ralpha, opacity ) :
					filter + " " + opacity;
			}
		};
	}

	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return (
					parseFloat( curCSS( elem, "marginLeft" ) ) ||

					// Support: IE<=11+
					// Running getBoundingClientRect on a disconnected node in IE throws an error
					// Support: IE8 only
					// getClientRects() errors on disconnected elems
					( jQuery.contains( elem.ownerDocument, elem ) ?
						elem.getBoundingClientRect().left -
							swap( elem, { marginLeft: 0 }, function() {
								return elem.getBoundingClientRect().left;
							} ) :
						0
					)
				) + "px";
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		//[Func](fn) 获取匹配元素集合中的第一个元素的样式属性的值设置每个匹配元素的一个或多个CSS属性。 @param {String|Array} propertyName 一个css属性名或 多个CSS属性组成的一个数组 @param {String|Number|Function} 传入此参数后，设置这个CSS属性的值，当为 Function 时格式为 function(index, value) @Tag <jUI>_CSS
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		//[Func](fn) 显示匹配的元素 @Tag <jUI>_CSS
		show: function() {
			return showHide( this, true );
		},
		//[Func](fn) 隐藏匹配的元素。 @Tag <jUI>_CSS
		hide: function() {
			return showHide( this );
		},
		//[Func](fn) 显示或隐藏匹配元素。@param {Boolean} 指示元素是显示或隐藏。 @Tag <jUI>_CSS
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails
				// so, simple values such as "10px" are parsed to Float.
				// complex values such as "rotate(1rad)" are returned as is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// use step hook for back compat - use cssHook if its there - use .style if its
				// available and use plain properties where available
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9
	// Panic based approach to setting things on disconnected nodes

	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			attrs = { height: type },
			i = 0;

		// if we include width, step value is 1 to do all cssExpand values,
		// if we don't include width, step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// we're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = jQuery._data( elem, "fxshow" );

		// handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// doing this makes sure that the complete handler will be called
				// before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE does not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

				// inline-level elements accept inline-block;
				// block-level elements need to be inline with layout
				if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
					style.display = "inline-block";
				} else {
					style.zoom = 1;
				}
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			if ( !support.shrinkWrapBlocks() ) {
				anim.always( function() {
					style.overflow = opts.overflow[ 0 ];
					style.overflowX = opts.overflow[ 1 ];
					style.overflowY = opts.overflow[ 2 ];
				} );
			}
		}

		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}

		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = jQuery._data( elem, "fxshow", {} );
			}

			// store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;
				jQuery._removeData( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// not quite $.extend, this wont overwrite keys already present.
				// also - reusing 'index' from above because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// if we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// resolve when we played the last frame
					// otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()

				// animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || jQuery._data( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = jQuery._data( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = jQuery._data( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// enable finishing flag on private data
				data.finish = true;

				// empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;

	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		window.clearInterval( timerId );
		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	//检测浏览器支持情况
	( function() {
		var a,
			input = document.createElement( "input" ),
			div = document.createElement( "div" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		// Setup
		div = document.createElement( "div" );
		div.setAttribute( "className", "t" );
		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
		a = div.getElementsByTagName( "a" )[ 0 ];

		// Support: Windows Web Apps (WWA)
		// `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "checkbox" );
		div.appendChild( input );

		a = div.getElementsByTagName( "a" )[ 0 ];

		// First batch of tests.
		a.style.cssText = "top:1px";

		// Test setAttribute on camelCase class.
		// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		//检查能够功过 getAttribute("calssName") 和 setAttribute("className", "...") 来获取和设置 div 的 css class。
		support.getSetAttribute = div.className !== "t";

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		//检查是否能通过 “style” 属性获取 DOM Element 的样式。
		support.style = /top/.test( a.getAttribute( "style" ) );

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		//检查链接的 “href” 属性能否被正常地序列化。
		support.hrefNormalized = a.getAttribute( "href" ) === "/a";

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		//检查 chebox 的 value 是否为 “on”。
		support.checkOn = !!input.value;

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		//检查 select 中的第一个 option 能否被默认选中。
		support.optSelected = opt.selected;

		// Tests for enctype support on a form (#6743)
		//检查 form 是否支持 enctype
		support.enctype = !!document.createElement( "form" ).enctype;

		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		//已经被设为 disable 的 select ，其内部的 option 的 disable 不应为 true
		support.optDisabled = !opt.disabled;

		// Support: IE8 only
		// Check if we can trust getAttribute("value")
		input = document.createElement( "input" );
		input.setAttribute( "value", "" );
		//验证input元素value值
		support.input = input.getAttribute( "value" ) === "";

		// Check if an input maintains its value after becoming a radio
		input.value = "t";
		input.setAttribute( "type", "radio" );
		//检查 input 元素被设为 radio 类型后是否仍然保持原来的值。
		support.radioValue = input.value === "t";
	} )();


	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;

	jQuery.fn.extend( {
		//[Func](fn) 获取匹配的元素集合中第一个元素的当前值 或 设置匹配的元素集合中每个元素的值。@param {String|Array|Function} （该参数设置值的时候使用） 一个文本字符串或一个以字符串形式的数组来设定每个匹配元素的值。<br>当为Function时格式为 function(index, value) 一个用来返回设置值的函数。 @Tag <jUI>_Attr
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if (
						hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?

						// handle most common string cases
						ret.replace( rreturn, "" ) :

						// handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
				} else if ( typeof val === "number" ) {
					val += "";
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :

						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// oldIE doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled :
									option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];

						if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

							// Support: IE6
							// When new option element is added to select box we need to
							// force reflow of newly added node in order to workaround delay
							// of initialization properties
							try {
								option.selected = optionSet = true;

							} catch ( _ ) {

								// Will be executed only in IE6
								option.scrollHeight;
							}

						} else {
							option.selected = false;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}

					return options;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	var nodeHook, boolHook,
		attrHandle = jQuery.expr.attrHandle,
		ruseDefault = /^(?:checked|selected)$/i,
		getSetAttribute = support.getSetAttribute,
		getSetInput = support.input;

	jQuery.fn.extend( {
		//[Func](fn) 获取匹配的元素集合中的第一个元素的属性的值 或 设置每一个匹配元素的一个或多个属性（attribute） @param {String|JSON} 要获取或设置的属性名称，当参数为 JSON 时，则JSON的 Key Value 设置到元素中 @param {String|Number|Function} （该参数设置值的时候使用）属性设置的值<br>当为Function时格式为 function(index, attr) 一个用来返回设置值的函数。 @Tag <jUI>_Attr
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		//[Func](fn) 为匹配的元素集合中的每个元素中移除一个或多个属性（attribute） @param {String} 要移除的属性名称，要同时移除多个属性，请用空格隔开 @Tag <jUI>_Attr
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		//[Func] 获取元素的属性的值 或 设置元素的一个或多个属性（attribute） @param {Element} 要获取或设置的元素 @param {String} 要获取或设置的属性名称 @param {String|Number} （该参数设置值的时候使用）属性设置的值 @Tag <jUI>_Attr
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {

						// Setting the type on a radio button after the value resets the value in IE8-9
						// Reset value to default in case type is set after value during creation
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		//[Func] 移除元素的一个或多个属性（attribute） @param {Element} 要操作的元素 @param {String} 要移除的属性名称，要同时移除多个属性，请用空格隔开 @Tag <jUI>_Attr
		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;

					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {

						// Set corresponding property to false
						if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
							elem[ propName ] = false;

						// Support: IE<9
						// Also clear defaultChecked/defaultSelected (if appropriate)
						} else {
							elem[ jQuery.camelCase( "default-" + name ) ] =
								elem[ propName ] = false;
						}

					// See #9699 for explanation of this approach (setting first, then removal)
					} else {
						jQuery.attr( elem, name, "" );
					}

					elem.removeAttribute( getSetAttribute ? name : propName );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

				// IE<8 needs the *property* name
				elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

			} else {

				// Support: IE<9
				// Use defaultChecked and defaultSelected for oldIE
				elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
			}
			return name;
		}
	};

	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			attrHandle[ name ] = function( elem, name, isXML ) {
				var ret, handle;
				if ( !isXML ) {

					// Avoid an infinite loop by temporarily removing this function from the getter
					handle = attrHandle[ name ];
					attrHandle[ name ] = ret;
					ret = getter( elem, name, isXML ) != null ?
						name.toLowerCase() :
						null;
					attrHandle[ name ] = handle;
				}
				return ret;
			};
		} else {
			attrHandle[ name ] = function( elem, name, isXML ) {
				if ( !isXML ) {
					return elem[ jQuery.camelCase( "default-" + name ) ] ?
						name.toLowerCase() :
						null;
				}
			};
		}
	} );

	// fix oldIE attroperties
	if ( !getSetInput || !getSetAttribute ) {
		jQuery.attrHooks.value = {
			set: function( elem, value, name ) {
				if ( jQuery.nodeName( elem, "input" ) ) {

					// Does not return so that setAttribute is also used
					elem.defaultValue = value;
				} else {

					// Use nodeHook if defined (#1954); otherwise setAttribute is fine
					return nodeHook && nodeHook.set( elem, value, name );
				}
			}
		};
	}

	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if ( !getSetAttribute ) {

		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = {
			set: function( elem, value, name ) {

				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode( name );
				if ( !ret ) {
					elem.setAttributeNode(
						( ret = elem.ownerDocument.createAttribute( name ) )
					);
				}

				ret.value = value += "";

				// Break association with cloned elements by also using setAttribute (#9646)
				if ( name === "value" || value === elem.getAttribute( name ) ) {
					return value;
				}
			}
		};

		// Some attributes are constructed with empty-string values when not defined
		attrHandle.id = attrHandle.name = attrHandle.coords =
			function( elem, name, isXML ) {
				var ret;
				if ( !isXML ) {
					return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
						ret.value :
						null;
				}
			};

		// Fixing value retrieval on a button requires this module
		jQuery.valHooks.button = {
			get: function( elem, name ) {
				var ret = elem.getAttributeNode( name );
				if ( ret && ret.specified ) {
					return ret.value;
				}
			},
			set: nodeHook.set
		};

		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		jQuery.attrHooks.contenteditable = {
			set: function( elem, value, name ) {
				nodeHook.set( elem, value === "" ? false : value, name );
			}
		};

		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		jQuery.each( [ "width", "height" ], function( i, name ) {
			jQuery.attrHooks[ name ] = {
				set: function( elem, value ) {
					if ( value === "" ) {
						elem.setAttribute( name, "auto" );
						return value;
					}
				}
			};
		} );
	}

	if ( !support.style ) {
		jQuery.attrHooks.style = {
			get: function( elem ) {

				// Return undefined in the case of empty string
				// Note: IE uppercases css property names, but if we were to .toLowerCase()
				// .cssText, that would destroy case sensitivity in URL's, like in "background"
				return elem.style.cssText || undefined;
			},
			set: function( elem, value ) {
				return ( elem.style.cssText = value + "" );
			}
		};
	}




	var rfocusable = /^(?:input|select|textarea|button|object)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		//[Func](fn) 获取匹配的元素集合中的第一个元素的属性（property）的值 或 设置每一个匹配元素的一个或多个属性（properties）@param {String|JSON} 要获取或设置的属性名称，当参数为 JSON 时，则JSON的 Key Value 设置到元素中 @param {String|Number|Function} （该参数设置值的时候使用）属性设置的值<br>当为Function时格式为 function(index, oldPropertyValue) 一个用来返回设置值的函数。 @Tag <jUI>_Attr
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		//[Func](fn) 为匹配的元素集合中的每个元素中移除一个或多个属性（property） @param {String} 要移除的属性名称，要同时移除多个属性，请用空格隔开 @Tag <jUI>_Attr
		removeProp: function( name ) {
			name = jQuery.propFix[ name ] || name;
			return this.each( function() {

				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[ name ] = undefined;
					delete this[ name ];
				} catch ( e ) {}
			} );
		}
	} );

	jQuery.extend( {
		//[Func] 获取元素的属性的值 或 设置元素的一个或多个属性（property） @param {Element} 要获取或设置的元素 @param {String} 要获取或设置的属性名称 @param {String|Number} （该参数设置值的时候使用）属性设置的值 @Tag <jUI>_Attr
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	// Some attributes require a special call on IE
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !support.hrefNormalized ) {

		// href/src property should get the full normalized URL (#10299/#12915)
		jQuery.each( [ "href", "src" ], function( i, name ) {
			jQuery.propHooks[ name ] = {
				get: function( elem ) {
					return elem.getAttribute( name, 4 );
				}
			};
		} );
	}

	// Support: Safari, IE9+
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;

				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
				return null;
			},
			set: function( elem ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );

	// IE6/7 call enctype encoding
	if ( !support.enctype ) {
		jQuery.propFix.enctype = "encoding";
	}




	var rclass = /[\t\r\n\f]/g;

	function getClass( elem ) {
		return jQuery.attr( elem, "class" ) || "";
	}

	jQuery.fn.extend( {
		//[Func](fn) 为每个匹配的元素添加指定的样式类名 @param {String|Function} 一个或多个样式名。<br>当参数为函数时，函数格式 function(index, currentClass) 这个函数返回一个或更多用空格隔开的要增加的样式名。 @Tag <jUI>_CSS
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							jQuery.attr( elem, "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		//[Func](fn) 移除集合中每个匹配元素上一个，多个或全部样式。 @param {String|Function} 每个匹配元素移除的一个或多个用空格隔开的样式名。。<br>当参数为函数时，函数格式 function(index, class) 返回一个或多个将要被移除的样式名。<br>不传任何参数时，则移除所有样式 @Tag <jUI>_CSS
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {

							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							jQuery.attr( elem, "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		//[Func](fn) 在匹配的元素集合中的每个元素上添加或删除一个或多个样式类,取决于这个样式类是否存在或值切换属性。@param {String|Function} className 用来切换的一个或多个（用空格隔开）样式类名。<br>当为函数时 格式： function(index, class, switch) 用来返回在匹配的元素集合中的每个元素上用来切换的样式类名的一个函数。接收元素的索引位置和元素旧的样式类作为参数。 @param {Boolean} switch 用于判断样式是否应该被添加或移除。 @Tag <jUI>_CSS
		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			return this.each( function() {
				var className, i, self, classNames;

				if ( type === "string" ) {

					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];

					while ( ( className = classNames[ i++ ] ) ) {

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// store className if set
						jQuery._data( this, "__className__", className );
					}

					// If the element has a class name or if we're passed "false",
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					jQuery.attr( this, "class",
						className || value === false ?
						"" :
						jQuery._data( this, "__className__" ) || ""
					);
				}
			} );
		},

		//[Func](fn) 确定任何一个匹配元素是否有被分配给定的（样式）类。@param {String} className 要查询的样式名。 @Tag <jUI>_CSS
		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}

			return false;
		}
	} );




	// Return jQuery for attributes-only inclusion


	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );

	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );


	var location = window.location;

	var nonce = jQuery.now();

	var rquery = ( /\?/ );



	var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

	jQuery.parseJSON = function( data ) {

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {

			// Support: Android 2.3
			// Workaround failure to string-cast null input
			return window.JSON.parse( data + "" );
		}

		var requireNonComma,
			depth = null,
			str = jQuery.trim( data + "" );

		// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
		// after removing valid tokens
		return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

			// Force termination if we see a misplaced comma
			if ( requireNonComma && comma ) {
				depth = 0;
			}

			// Perform no more replacements after returning to outermost depth
			if ( depth === 0 ) {
				return token;
			}

			// Commas must not follow "[", "{", or ","
			requireNonComma = open || comma;

			// Determine new depth
			// array/object open ("[" or "{"): depth += true - false (increment)
			// array/object close ("]" or "}"): depth += false - true (decrement)
			// other cases ("," or primitive): depth += true - true (numeric cast)
			depth += !close - !open;

			// Remove this token
			return "";
		} ) ) ?
			( Function( "return " + str ) )() :
			jQuery.error( "Invalid JSON: " + data );
	};


	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new window.DOMParser();
				xml = tmp.parseFromString( data, "text/xml" );
			} else { // IE
				xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch ( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,

		// IE leaves an \r character at EOL
		rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Document location
		ajaxLocation = location.href,

		// Segment location into parts
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

			if ( jQuery.isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType.charAt( 0 ) === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var deep, key,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
		var firstDataType, ct, finalDataType, type,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var

				// Cross-domain detection vars
				parts,

				// Loop variable
				i,

				// URL without anti-cache param
				cacheURL,

				// Response headers as string
				responseHeadersString,

				// timeout handle
				timeoutTimer,

				// To know if global events are to be dispatched
				fireGlobals,

				transport,

				// Response headers
				responseHeaders,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// The jqXHR state
				state = 0,

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {

									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" )
				.replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :

						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );

					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};


	jQuery.fn.extend( {
		//[Func](fn) 在所有匹配元素外面包一层HTML结构。@param {String|Selector|Element|<jUI>} 用来包在外面的HTML片段，选择表达式，<jUI>对象或者DOM元素。 @Tag <jUI>_DOM
		wrapAll: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}

			if ( this[ 0 ] ) {

				// The elements to wrap the target around
				var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
						elem = elem.firstChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		//[Func](fn) 在匹配元素里的内容外包一层结构。 @param {String|Function} 用来包在匹配元素的内容外面的HTML片段，选择表达式，<jUI>对象或者DOM元素。<br>当为 Function 时，格式 function(index) 一个返回HTML结构的函数，用来包在匹配元素内容的外面。接收集合中元素的索引位置作为参数。 @Tag <jUI>_DOM
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		//[Func](fn) 在每个匹配的元素外层包上一个html元素。 @param {String|Function} 一个HTML片段，选择表达式，<jUI> 对象，或者DOM元素，用来包在匹配元素的外层。。<br>当为 Function 时，格式 function(index) 回调函数，返回用于包裹匹配元素的 HTML 内容或 <jUI> 对象。 @Tag <jUI>_DOM
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},

		//[Func](fn) 将匹配元素集合的父级元素删除，保留自身（和兄弟元素，如果存在）在原来的位置。 @Tag <jUI>_DOM
		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );


	function getDisplay( elem ) {
		return elem.style && elem.style.display || jQuery.css( elem, "display" );
	}

	function filterHidden( elem ) {

		// Disconnected elements are considered hidden
		if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
			return true;
		}
		while ( elem && elem.nodeType === 1 ) {
			if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
				return true;
			}
			elem = elem.parentNode;
		}
		return false;
	}

	jQuery.expr.filters.hidden = function( elem ) {

		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return support.reliableHiddenOffsets() ?
			( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
				!elem.getClientRects().length ) :
				filterHidden( elem );
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	//[Func] 创建一个数组或对象序列化的的字符串，适用于一个URL 地址查询字符串或Ajax请求。@param {Array|Object} obj 用于数组或序列化的对象。@param {Boolean} 指示是否执行了传统的“shallow”的序列化。 @Tag <jUI>_Utils
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {

				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};

	jQuery.fn.extend( {
		//[Func](fn) 将用作提交的表单元素的值编译成字符串。 @Tag <jUI>_Utils
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		//[Func](fn) 将用作提交的表单元素的值编译成拥有name和value对象组成的数组 @Tag <jUI>_Utils
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;

				// Use .is(":disabled") so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

		// Support: IE6-IE8
		function() {

			// XHR cannot access local files, always use ActiveX for that case
			if ( this.isLocal ) {
				return createActiveXHR();
			}

			// Support: IE 9-11
			// IE seems to error on cross-domain PATCH requests when ActiveX XHR
			// is used. In IE 9+ always use the native XHR.
			// Note: this condition won't catch Edge as it doesn't define
			// document.documentMode but it also doesn't support ActiveX so it won't
			// reach this code.
			if ( document.documentMode > 8 ) {
				return createStandardXHR();
			}

			// Support: IE<9
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
				createStandardXHR() || createActiveXHR();
		} :

		// For all other browsers, use the standard XMLHttpRequest object
		createStandardXHR;

	var xhrId = 0,
		xhrCallbacks = {},
		xhrSupported = jQuery.ajaxSettings.xhr();

	// Support: IE<10
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]( undefined, true );
			}
		} );
	}

	// Determine support properties
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	xhrSupported = support.ajax = !!xhrSupported;

	// Create transport if the browser can provide an xhr
	if ( xhrSupported ) {

		jQuery.ajaxTransport( function( options ) {

			// Cross domain only allowed if supported through XMLHttpRequest
			if ( !options.crossDomain || support.cors ) {

				var callback;

				return {
					send: function( headers, complete ) {
						var i,
							xhr = options.xhr(),
							id = ++xhrId;

						// Open the socket
						xhr.open(
							options.type,
							options.url,
							options.async,
							options.username,
							options.password
						);

						// Apply custom fields if provided
						if ( options.xhrFields ) {
							for ( i in options.xhrFields ) {
								xhr[ i ] = options.xhrFields[ i ];
							}
						}

						// Override mime type if needed
						if ( options.mimeType && xhr.overrideMimeType ) {
							xhr.overrideMimeType( options.mimeType );
						}

						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
							headers[ "X-Requested-With" ] = "XMLHttpRequest";
						}

						// Set headers
						for ( i in headers ) {

							// Support: IE<9
							// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
							// request header to a null-value.
							//
							// To keep consistent with other XHR implementations, cast the value
							// to string and ignore `undefined`.
							if ( headers[ i ] !== undefined ) {
								xhr.setRequestHeader( i, headers[ i ] + "" );
							}
						}

						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send( ( options.hasContent && options.data ) || null );

						// Listener
						callback = function( _, isAbort ) {
							var status, statusText, responses;

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Clean up
								delete xhrCallbacks[ id ];
								callback = undefined;
								xhr.onreadystatechange = jQuery.noop;

								// Abort manually if needed
								if ( isAbort ) {
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;

									// Support: IE<10
									// Accessing binary-data responseText throws an exception
									// (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch ( e ) {

										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && options.isLocal && !options.crossDomain ) {
										status = responses.text ? 200 : 404;

									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}

							// Call complete if needed
							if ( responses ) {
								complete( status, statusText, responses, xhr.getAllResponseHeaders() );
							}
						};

						// Do send the request
						// `xhr.send` may raise an exception, but it will be
						// handled in jQuery.ajax (so no try/catch here)
						if ( !options.async ) {

							// If we're in sync mode we fire the callback
							callback();
						} else if ( xhr.readyState === 4 ) {

							// (IE6 & IE7) if it's in cache and has been
							// retrieved directly we need to fire the callback
							window.setTimeout( callback );
						} else {

							// Register the callback, but delay it in case `xhr.send` throws
							// Add to the list of active xhr callbacks
							xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
						}
					},

					abort: function() {
						if ( callback ) {
							callback( undefined, true );
						}
					}
				};
			}
		} );
	}

	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	}

	function createActiveXHR() {
		try {
			return new window.ActiveXObject( "Microsoft.XMLHTTP" );
		} catch ( e ) {}
	}




	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and global
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
			s.global = false;
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {

			var script,
				head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

			return {

				send: function( _, callback ) {

					script = document.createElement( "script" );

					script.async = true;

					if ( s.scriptCharset ) {
						script.charset = s.scriptCharset;
					}

					script.src = s.url;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function( _, isAbort ) {

						if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;

							// Remove the script
							if ( script.parentNode ) {
								script.parentNode.removeChild( script );
							}

							// Dereference the script
							script = null;

							// Callback if not abort
							if ( !isAbort ) {
								callback( 200, "success" );
							}
						}
					};

					// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					head.insertBefore( script, head.firstChild );
				},

				abort: function() {
					if ( script ) {
						script.onload( undefined, true );
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// data: string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	//[Func] 将字符串解析到一个DOM节点的数组中。@param {String} 用来解析的HTML字符串。 @param {Element=document} DOM元素的上下文，在这个上下文中将创建的HTML片段。 @param {Boolean=false} 表明是否在传递的HTML字符串中包含脚本。 @Tag <jUI>_Utils
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}

		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off, url.length ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};





	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ?
			elem :
			elem.nodeType === 9 ?
				elem.defaultView || elem.parentWindow :
				false;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

			// need to be able to calculate position if either top or left
			// is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );
			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {
		//[Func](fn) 在匹配的元素集合中，获取的第一个元素的当前坐标，坐标相对于文档。<br>设置匹配的元素集合中每一个元素的坐标， 坐标相对于文档。@param {JSON|Function} 一个包含top 和 left属性的对象，用整数指明元素的新顶部和左边坐标。<br>当为函数时 格式：function(index, coords) 返回用于设置坐标的一个函数。接收元素在匹配的元素集合中的索引位置作为第一个参数，和当前坐标作为第二个参数。这个函数应该返回一个包含top 和 left属性的对象。 @Tag <jUI>_CSS
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var docElem, win,
				box = { top: 0, left: 0 },
				elem = this[ 0 ],
				doc = elem && elem.ownerDocument;

			if ( !doc ) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}

			// If we don't have gBCR, just use 0,0 rather than error
			// BlackBerry 5, iOS 3 (original iPhone)
			if ( typeof elem.getBoundingClientRect !== "undefined" ) {
				box = elem.getBoundingClientRect();
			}
			win = getWindow( doc );
			return {
				top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
				left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
			};
		},

		//[Func](fn) 获取匹配元素中第一个元素的当前坐标，相对于offset parent的坐标。(offset parent指离该元素最近的而且被定位过的祖先元素 ) @Tag <jUI>_CSS
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				parentOffset = { top: 0, left: 0 },
				elem = this[ 0 ];

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// we assume that getBoundingClientRect is available when computed position is fixed
				offset = elem.getBoundingClientRect();
			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}

			// Subtract parent offsets and element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			return {
				top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		//[Func](fn) 取得离指定元素最近的含有定位信息的祖先元素。含有定位信息的元素指的是，CSS 的 position 属性是 relative, absolute, 或 fixed 的元素。 @Tag <jUI>_CSS
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
					jQuery.css( offsetParent, "position" ) === "static" ) ) {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	//[Func:<jUI>.fn.scrollLeft](fn) 获取匹配的元素集合中第一个元素的当前水平滚动条的位置。<br>设置每个匹配元素的水平滚动条位置。@param {Number} value 一个用来设置滚动条水平位置的正整数。 @Tag <jUI>_Attr
	//
	//[Func:<jUI>.fn.scrollTop](fn) 获取匹配的元素集合中第一个元素的当前垂直滚动条的位置。<br>设置每个匹配元素的垂直滚动条位置。@param {Number} value 一个用来设置滚动条垂直位置的正整数。 @Tag <jUI>_Attr
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = /Y/.test( prop );

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? ( prop in win ) ? win[ prop ] :
						win.document.documentElement[ method ] :
						elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : jQuery( win ).scrollLeft(),
						top ? val : jQuery( win ).scrollTop()
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	} );

	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// if curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	//[Func:<jUI>.fn.height](fn) 为匹配的元素集合中获取第一个元素的当前计算高度值。<br>或给每个匹配的元素设置高度。@param {String|Number|Function} value 一个正整数代表的像素数,或是整数和一个可选的附加单位（默认是：“px”）(作为一个字符串)。<br>当为函数时 格式：function(index, height) 返回用于设置高度的一个函数。接收元素的索引位置和元素旧的高度值作为参数。 @Tag <jUI>_CSS
	//
	//[Func:<jUI>.fn.width](fn) 为匹配的元素集合中获取第一个元素的当前计算宽度值。<br>或给每个匹配的元素设置宽度。@param {String|Number|Function} value 一个正整数代表的像素数,或是整数和一个可选的附加单位（默认是：“px”）(作为一个字符串)。<br>当为函数时 格式：function(index, width) 返回用于设置宽度的一个函数。接收元素的索引位置和元素旧的高度值作为参数。 @Tag <jUI>_CSS
	// 创建 innerHeight, innerWidth, height, width, outerHeight, outerWidth 方法
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

			// margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {

						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						// unfortunately, this causes bug #3838 in IE6/8 only,
						// but there is currently no good, small way to fix it.
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );


	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );

	// The number of elements contained in the matched element set
	jQuery.fn.size = function() {
		return this.length;
	};

	jQuery.fn.andSelf = jQuery.fn.addBack;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function() {
			return jQuery;
		} );
	}



	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in
	// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	//if ( !noGlobal ) {
	//	window.jQuery = window.$ = jQuery;
	//}

	//return jQuery;

	//----------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------
	//  以上为 jQuery v1.12.4 源码
	//----------------------------------------------------------------------------------
	//----------------------------------------------------------------------------------
	var jUI = jQuery;
	window.jUI = window.jQuery = window.$ = jUI;
	if (typeof appName === 'undefined') { appName='jUI'; }
	if (appName!='jUI') { window[appName]= jUI; }
	if (appName=='jUI') { window._ = jUI; }


    (function() {
		//[Attr:jUI.browser] 浏览器信息
		jUI.browser = {};
		var ua = navigator.userAgent.toLowerCase();
		var match = /(edge)[ \/]([\w.]+)/.exec( ua ) ||
				/(chrome)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
				/(msie) ([\w.]+)/.exec( ua ) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
		var matched= { browser: match[ 1 ] || "", version: match[ 2 ] || "0" };
		if ( matched.browser ) {
			jUI.browser[ matched.browser ] = true;
			jUI.browser.version = matched.version;
		};
		if ( jUI.browser.chrome ) {
			jUI.browser.webkit = true;
		} else if ( jUI.browser.webkit ) {
			jUI.browser.safari = true;
		};

		jUI.browser.quirks = document.compatMode === 'BackCompat';

		if (!!window.ActiveXObject || "ActiveXObject" in window) { //IE
			jUI.browser.msie=true;
			var dm = document.documentMode;
			if (!dm){
				var isLteIE8 = !+[1,];
				if (isLteIE8){
					if ((!document.compatMode || document.compatMode === 'BackCompat')){
						dm=5;
					}else if (typeof(XMLHttpRequest)=='undefined'){
						dm=6;
					}else if (!document.documentMode){
						dm=7;
					}else{
						dm=8;
					}
				}else{
					if (function(){ "use strict"; return !!this; }()){ dm=9; }
					if (!!document.attachEvent && (function(){ "use strict"; return !this; }())) { dm=10; }
					if (!document.attachEvent) { dm=11; }
				}
			}
			jUI.browser.documentMode = dm;
			jUI.browser.msie11 = /Trident\/[7-9]\./ig.test(ua);
			jUI.browser.msie6 = /msie 6/ig.test(ua);
		}
		//setTimeout(function(){
		//	jUI.log(navigator.userAgent,0);
		//	jUI.log(document.compatMode,0);
		//},800);
	})();

	jUI.extend({
		//-[Func] 设置框架 js 所在路径（内部使用）
		setPath: function (sPath){
			sPath=sPath.substr(0,sPath.lastIndexOf('/')+1);
			jUI.Path = sPath;
			jUI.each(['Extend','Plugin','Themes','ThirdParty'],function(idx,str){
				jUI['Path_'+str] = sPath + appName.toLowerCase() + str + '/';
			});
			if (jUI.TransparentImg) { jUI.TransparentImg = '<img width="1" src="' + jUI.Path_Themes + 't.gif">'; }
			//[Attr:jUI.Path_Extend] 框架扩展 js 所在路径
			//
			//[Attr:jUI.Path_Plugin] 框架插件所在路径
			//
			//[Attr:jUI.Path_Themes] 框架皮肤所在路径
			//
			//[Attr:jUI.Path_ThirdParty] 框架第三方组件所在路径
			//
		}
	});
	(function() {
		var curJS = jUI('script:last');
		//[Attr:jUI.Path] 框架 js 所在路径
		//jUI.Path = curJS.attr('src').replace(appName.toLowerCase()+'.js', '');
		jUI.setPath(curJS.attr('src').replace(appName.toLowerCase()+'.js', ''));
		//[Attr] <jUI> 当前皮肤
		jUI.Theme = curJS.attr('theme')||'default';

		jUI.exPlugin = curJS.attr('loadPlugin')||'';  //动态加载插件

		//[Attr] 是否是 IE @Tag <jUI>_Check
		jUI.bIE = jUI.browser.msie || /msie \d/i.test(navigator.userAgent);
		//jUI.bIE = /msie \d/i.test(navigator.userAgent);
		//[Attr] 是否是 IE6 @Tag <jUI>_Check
		jUI.bIE6 = /msie 6/i.test(navigator.userAgent);
	})();


    //---------------------------------- 重写[Begin] ----------------------------------
	////////// 直接覆盖原有方法 //////////
	jUI.extend( {
		error: function( err ) {
			if (typeof err === 'string') {
				throw new Error( err );
			}else{
				jUI.log('---jUI错误函数---'+
							(err.fun?'\nfunction:    '+err.fun:'')+
							(err.name?'\nname:   '+err.name:'')+
							(err.number?'\nnumber:  '+err.number:'')+
							(err.message?'\nmessage: '+err.message:'')+
							(err.description?'\ndescription: '+err.description:'')+
							(err.url?'\nurl:         '+err.url:'')
							);
				//throw new Error( err.name );
			}
		},

		//[Func] 获取元素的属性的值 或 设置元素的一个或多个属性（attribute） @param {Element} 要获取或设置的元素 @param {String} 要获取或设置的属性名称 @param {String|Number} （该参数设置值的时候使用）属性设置的值 @Tag <jUI>_Attr
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
			if ( typeof elem.getAttribute === "undefined" ) {
				return jUI.prop( elem, name, value );
			}
			if ( nType !== 1 || !jUI.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jUI.attrHooks[ name ] ||
					( jUI.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}
			if ( value !== undefined ) {
				if ( value === null ) {
					jUI.removeAttr( elem, name );
					return;
				}
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
				//elem.setAttribute( name, value + "" );
				try{ elem.setAttribute(name, value+'', 0); }catch(e){elem.setAttribute(name, value); }  //setAttribute最后一个参数是否区分属性的大小写 Witson 2017-08-04
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jUI.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		//[Func] 解析一个字符串到一个XML文档。@param {String} 用来解析的格式良好的XML字符串。 @Tag <jUI>_Utils
		parseXML: function( data ) {
			//Modify by Witson 2017-12-29 优先使用 MSXML
			if ( !data || typeof data !== "string" ) {
				return null;
			}
			var xml=jUI.createMSXMLDom();
			if (xml!=null){
				xml.async = "false";
				xml.loadXML( data );
			}else{
				try {
					xml = (new DOMParser()).parseFromString( data, "text/xml" );
				} catch( e ) {
					xml = undefined;
				}
			}
			if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
				jUI.error( "Invalid XML: " + data );
			}
			return xml;
		},

		//[Func] 创建一个数组或对象序列化的的字符串，适用于一个URL 地址查询字符串或Ajax请求。@param {Array|Object} obj 用于数组或序列化的对象。@param {Boolean} 指示是否执行了传统的“shallow”的序列化。 @Tag <jUI>_Utils
		param: function( a, traditional ) {
			var prefix,
				s = [],
				_encodeURIComp = function(str){
					if (/%/.test(str)){ try{str=decodeURIComponent(str)}catch(e){} }
					return encodeURIComponent(str);
				},
				add = function( key, value ) {
					value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
					s[ s.length ] = _encodeURIComp( key ) + "=" + _encodeURIComp( value );
				};
			if ( traditional === undefined ) {
				traditional = jQuery.Settings.Ajax && jQuery.Settings.Ajax.traditional;
				//traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
			}
			if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
				jQuery.each( a, function() {
					add( this.name, this.value );
				} );
			} else {
				for ( prefix in a ) {
					buildParams( prefix, a[ prefix ], traditional, add );
				}
			}
			return s.join( "&" ).replace( r20, "+" );
		}
	} );
	////////// 保存原有方法后覆盖原有方法 //////////

	jUI.parseJSON_ = jUI.parseJSON;
	//[Func] 将字符串转为JSON对象。接受一个标准格式的 JSON 字符串，并返回解析后的 JavaScript 对象。@param {String} 要解析的 JSON 字符串。 @Tag <jUI>_Utils
	jUI.parseJSON = function( data ) {
		try{
            window.__TEMP_json;
            eval('window.__TEMP_json=' + data);
            return window.__TEMP_json;
		}catch(e){};
	};
    //---------------------------------- 重写[ End ] ----------------------------------


    //---------------------------------- 扩展[Begin] ----------------------------------
	jUI.extend( {
		appName: appName,  //当前框架名称 默认 jUI
		builded: false,    //是否已合并
		FormatUIed:false,  //是否已经格式化控件
		//[Attr] <jUI> 已加载控件列表
		PluginList: [],
		//[Attr] <jUI> 动态加载控件列表
		PluginList_Dynamic: [
			//////////Here *****
			//{Name:'CodeEditor', TagName:['textarea'], RequirePlugin:[]}
		],

		//[Func] 获取元素的属性的值，当为空时返回默认值（attribute） @param {Element} 要获取的元素 @param {String} 要获取的属性名称 @param {String|Number} 默认值 @Tag <jUI>_Attr
		getAttr: function (elem, name, defValue) {
            return jUI.def(elem.getAttribute(name), defValue, 0);
		},

		//[Func] 为元素添加指定的样式类名 @param {Element} 要操作的元素 @param {String} 一个或多个样式名。 @Tag <jUI>_CSS
		addClass: function( elem, value ) {
			return jUI(elem).addClass(value);
		},

		//[Func] 移除元素上一个，多个或全部样式。 @param {Element} 要操作的元素 @param {String} 一个或多个样式名。 @Tag <jUI>_CSS
		removeClass: function( elem, value ) {
			return jUI(elem).removeClass(value);
		},

		//[Func] 在元素上添加或删除一个或多个样式类,取决于这个样式类是否存在或值切换属性。 @param {Element} 要操作的元素 @param {String} className 用来切换的一个或多个（用空格隔开）样式类名。 @param {Boolean} switch 用于判断样式是否应该被添加或移除。 @Tag <jUI>_CSS
		toggleClass: function( elem, value, stateVal ) {
			return jUI(elem).toggleClass(value);
		},

		//[Func] 确定元素是否有被分配给定的（样式）类。@param {String} className 要查询的样式名。 @Tag <jUI>_CSS
		hasClass: function( elem, value ) {
			return jUI(elem).hasClass(value);
		},

		//[Func] 将 Object 转为字符串 @param {JSON|Object} object 要转换的对象 @Tag <jUI>_Utils
		Obj2Str: function (o) {
			if (o == undefined) { return null; };
			var r = [];
			if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
			if (typeof o == "object") {
				if (!o.sort) {
					for (var i in o)
						r.push("\"" + i + "\":" + jUI.Obj2Str(o[i]));
					if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
						r.push("toString:" + o.toString.toString());
					};
					r = "{" + r.join() + "}";
				} else {
					for (var i = 0; i < o.length; i++)
						r.push(jUI.Obj2Str(o[i]));
					r = "[" + r.join() + "]";
				};
				return r;
			};
			return o.toString().replace(/\"\:/g, '":""');
		},

		//[Func] 将 JSON 转为字符串 @param {JSON} 要转换的 JSON @Tag <jUI>_Utils
		JSON2Str: function(json){
			if ( window.JSON && window.JSON.stringify ) { return window.JSON.stringify(json,null,'\t'); }
			return jUI.Obj2Str(json);
		},

		//[Func] 将字符串转为JSON对象 (扩展)。 用DataSplit DataSplit2属性切割字符串<br>当字符串为 aaa,bbb 时自动转为 { &#91;id:'aaa',text:'aaa'&#93;, &#91;id:'bbb',text:'bbb'&#93; }<br>当字符串为 aaa|123,bbb|456 时自动转为 { &#91;id:'aaa',text:'123'&#93;, &#91;id:'bbb',text:'456'&#93; } @param {String} 要处理的字符串 @param {String=,} 数组分隔符 @param {String=|} sSplit2 Key Value 分隔符
		parseJSONEx: function (str, sSplit, sSplit2){
			if ((/^\s*\[[\s\S]*\](\s|\;)*$/.test(str)) || (/^\s*\{[\s\S]*\}(\s|\;)*$/.test(str))) return jUI.parseJSON(str);
			if (str.trim()=='') return [];
			sSplit=jUI.def(sSplit,','); sSplit2=jUI.def(sSplit2,'|');
			var arr=[]; var arrTem=str.replace('\\'+sSplit,'_*juispl*_').split(sSplit);
			for (var i=0; i<arrTem.length; i++) {
				var arrTem2=arrTem[i].split(sSplit2);
				arr.push( {id:arrTem2[0].replace('_*juispl*_',sSplit), text:arrTem2[arrTem2.length-1].replace('_*juispl*_',sSplit)} );
			};
			return arr;
		}
	} );

	jUI.extend({
		//[Attr] <jUI> 默认设置集 @Tag <jUI>_Settings
		Settings: {
			update:function(settingID){
				var newVal=window[appName+'_Settings_'+settingID];
				if (newVal===undefined) { return; }
				jUI.extend(true,jUI.Settings[settingID],newVal);
				window[appName+'_Settings_'+settingID]=undefined;
			}
		},
		//[Func] 替代默认值（当value的类型为undefined时，返回def）@param {String|Boolean|Number} value 要判断的值 @param {String|Boolean|Number=''} defaultValue 默认值 @return {String|Boolean|Number} 返回值类型与 defaultValue 类型一致 @Tag <jUI>_Utils
		def: function(val,def){
			if (typeof(def)=='undefined') { def=''; } if (typeof(val)=='undefined') { return def; }
			var sVal; try{ sVal=val.toString(); }catch(e){};
			if (typeof(def)=='boolean'){
				if (/(^true$)|(^yes$)|(^1$)|(^-1$)/i.test(sVal)) { return true; }
				if (/(^false$)|(^no$)|(^0$)/i.test(sVal)) { return false; }
				return def;
			};
			if (typeof(def)=='number'){
				if (/(^(\+|\-)?\d+$)/i.test(sVal)) { return parseInt(sVal); }
				if (/(^(\+|\-)?\d+\.\d+$)/i.test(sVal)) { return parseFloat(sVal); }
				return def;
			};
			if (typeof(val)=='number') return val.toString();
			return val || def;
		},
		//获取扩展函数
		getExtendFunction: function(sFunction){
			var fun=window[sFunction.replace(/<AppPre>/g,appName+'_')];
			//var fun=window[sFunction.replace(/<AppPre>/g,appName+'_')]||window[sFunction.replace(/<AppPre>/g,appName)];
			if (typeof(fun)=='function') return fun;
			return null;
		},
		//执行扩展函数
		evalExtendFunction: function(sFunction){
			var fun=jUI.getExtendFunction(sFunction);
			//var args=[].slice.call(arguments,1);
			if (!fun) return arguments[1];
			for (var i=0; i<arguments.length-1; i++){ arguments[i]=arguments[i+1]; }  //移参数
			arguments.length=arguments.length-1;
			return fun.apply(this,arguments);
		},
		//[Func] 从字符串中获取值（字符串如 "name=Witson&id=001&age=35"）@param {String} 源字符串 @param {String} 要查找的键 @param {String} 分隔符 @Tag <jUI>_Utils
		getValueFromParam: function(str,sName,sSplit){
			if (typeof(str)!='string') return '';
			var reg = new RegExp('(^| |'+sSplit+')' + sName + '=([^'+sSplit+']*)('+sSplit+'|$)','i');
			var r = str.match(reg);
			return (r==null)?'':(r[2]);
		},
		//[Func] 获取URL中的参数
		getParam: function(sParam,sURL){
			var str=jUI.def(sURL);
			if (str=='') { str=window.location.search.substr(1); } else { if (str.indexOf('?')!=-1){str=str.substr(str.indexOf('?')+1);} };
			return decodeURI(jUI.getValueFromParam(str, sParam,'&'));
		},
		//[Func] 读取写入cookie @Tag <jUI>_Cookie,<jUI>_Utils
		cookie: function(sName,sVal,sDomain){
			sName=encodeURIComponent(sName);
			sDomain=jUI.def(sDomain);
			if (typeof(sVal)=='undefined') { //读取cookie
				return decodeURIComponent(jUI.getValueFromParam(document.cookie, sName, ';'));
			}
			var expires = new Date(); expires.setTime((new Date()).getTime() + 1000*60*60*24*365);
			var sVal=sName + "=" + encodeURIComponent(sVal) + "; path=/; expires=" + expires.toGMTString();
			if (sDomain!='') sVal+=';domain='+sDomain;
			document.cookie = sVal;
		},
		//[Func] 读取cookie，当没有此cookie时使用默认值 @param {String} cookie名称 @param {String|Number|Boolean} 默认值 @Tag <jUI>_Cookie,<jUI>_Utils
		getCookie: function(sName, defValue) { return jUI.def(jUI.cookie(sName),defValue||''); },
		//[Func] 删除cookie @Tag <jUI>_Cookie,<jUI>_Utils
		removeCookie: function(sName){ document.cookie = sName + "=; path=/; expires=" + (new Date(0)).toGMTString(); },
		//[Func] 解析URL(替换JSTime、JUIPath等) @param {String} sURL 原始URL @param {String} sCallerName 函数调用者名称(非必要参数) @return {String} 处理后的URL @Tag <jUI>_Utils
		parseURL: function(sURL,sCallerName){
			//sCallerName = sCallerName||arguments.callee.caller.name;
			if (!sCallerName && arguments.callee.caller) sCallerName = arguments.callee.caller.name;
			//[Event@<jUI>.parseURL] 当用 parseURL 解析URL前触发，用户可预先替换URL变量，并返回新的URL @param {String} sURL 原始URL @param {String} sCallerName 函数调用者名称(非必要参数) @return {String} 处理后的URL @Tag <jUI>_Utils
			sURL=jUI.evalExtendFunction('<AppPre>ParseURL',sURL,sCallerName);
			sURL=sURL.replace(/{JSTime}/ig, (new Date()).getTime().toString());
			//sURL=sURL.replace(/{jUIPath}/ig, jUI.Path);
			var regPath = new RegExp( '{'+appName+'Path}', 'ig' );
			sURL=sURL.replace(regPath,jUI.Path);
			return sURL;
		},
		/**
		 * 将字符串中的 {} 解析成 JSON 的相应属性值
         * (将sTemplate中的 &#123;属性名&#125; 替换成 oJson的属性  oJson.属性 )
		 * 可选项目表达示如下：
		 * 选择表达式: {type?a|类型A,b|类型B,ELSE|其他}
		 * 调用JS函数: [=jsFunction('&#123;type&#125;')] 或 [=jsFunction(json)]
		 * @param {String} sTemplate 模板（要处理的字符串）
		 * @param {JSON} json JOSN 数据
		 * @param {Boolean=true} bForceReplace 强制替换所有花括号，即使 JSON 中没有此属性
		 * @return {String} 替换后的字符串
		 * @Tag <jUI>_Utils
         */
		parseField: function (sTemplate, json, bForceReplace){
			bForceReplace=jUI.def(bForceReplace,true);
			var sVal=sTemplate;
			//[Event@<jUI>.parseField] 当用 parseField 解析字符串前触发，用户可预先对字符串进行处理，并返回新的字符串 @param {String} sTemplate 模板（要处理的字符串） @param {JSON} json JSON 数据 @return {String} 处理后的URL @Tag <jUI>_Utils
			sVal=jUI.evalExtendFunction('<AppPre>ParseField',sVal, json);
			//if(typeof(jUI_ParseField)=='function') sVal=jUI_ParseField(sVal, json);
			//解析{}
			sVal = sVal.replace(/{([^{}]+?)}/ig,function(word){
				var str = word.substring(1,word.length-1);
				if (/\?/i.test(str)){
					var arr=str.split(/[,\?\|]/);
					if (bForceReplace || json.hasOwnProperty(arr[0])){
						str=jUI.def(json[arr[0]],'').toString();
						for (var i=1; i<arr.length-1; (i=i+2)){
							if ((/^else$/ig.test(arr[i])) || (arr[i]==str)){ str = arr[i+1]; break; };
						}
					}else{
						str=word;
					}
				}else{
					str = (bForceReplace || json.hasOwnProperty(str))?str = jUI.def(json[str]):word;
				}
				return str;
			});
			//解析 [=fun()]
			//sVal = sVal.replace(/\[=[^\]\(]+?\([^\)\[\]]*?\)[\s\;]*?\]/ig,function(word){
			sVal = sVal.replace(/\[=[^\]\(]+?\(.*?\)[\s\;]*?\]/ig,function(word){
				var sCode=word.substr(2).replace(/[\s\;]*?\]$/,'');
				var str=word;
				try{ str = eval(sCode); }catch(e){}
				return str;
			});
            if(sVal!=null&&("{DOC_TITLE}"==sTemplate||"{S_SUBJECT}"==sTemplate))
                sVal=sVal.replace('<','&lt;').replace('>','&gt;');//尖括号转义
			return sVal;
		},
		//[Func] 将 JSON 数组元素逐个 parseField，并拼接在一起 @param {String} sTemplate 模板（要处理的字符串） @param {JSONArray} json JOSN 数据 @param {String} 分隔符 @param {Function} 回调函数 funParseItemAfter(sResult,idx,jsonItem) 函数可在解析每项之后再进行处理，对sResult进行再处理，然后return出来 @return {String} 替换后的字符串 @Tag <jUI>_Utils
		parseField_Data: function (sTemplate, arr, splitStr, funParseItemAfter){
			arr=jUI.isArray(arr)?arr:arr.data;
			if (typeof(splitStr)=='function') { funParseItemAfter=splitStr; splitStr='';}
			var sVal=''; splitStr=jUI.def(splitStr);
			var regSeq = new RegExp( '{'+appName+'Seq}', 'i' );
			var regSeqig = new RegExp( '{'+appName+'Seq}', 'ig' );
			var bSeq2Idx=regSeq.test(sTemplate);
			if (bSeq2Idx && (arr.length>0) && (typeof(arr[0][appName+'Seq'])!='undefined')) bSeq2Idx=false; //数据中包含jUISeq没不自行替换为i
			for (var i=0; i<arr.length; i++){
				var sTpl=bSeq2Idx?(sTemplate.replace(regSeqig,i+1)):sTemplate;
				var str = jUI.parseField(sTpl,arr[i]);
				if (typeof(funParseItemAfter)=='function') {
					str = funParseItemAfter(str,i,arr[i]);
				}
				sVal += (i>0?splitStr:'') + str;
			};
			return sVal;
		},
		//[Func] 从模板XMP中解析生成HTML并赋值到某个元素 @param {String|Element} elem 要赋值的对象或对象ID @param {String|Element} xmpID XMP模板ID或XMP对象或HTML字符串（要处理的字符串） @param {JSONArray} json JOSN 数据 @param {Function} 回调函数 funParseItemAfter(sResult,idx,jsonItem) 函数可在解析每项之后再进行处理，对sResult进行再处理，然后return出来 @return {String} 替换后的字符串 @Tag <jUI>_Utils
		parseField_FromXMP: function(elem, xmpID, json, funParseItemAfter){
			var sTpl='';
			if (typeof(xmpID)=='object') sTpl = /Opera/i.test(navigator.userAgent)?xmpID.innerText:xmpID.innerHTML;
			if (typeof(xmpID)=='string'){
				if (/\<|\{| /i.test(xmpID)){ sTpl=xmpID; }else{ xmpID=jUI('#'+xmpID)[0]; sTpl = /Opera/i.test(navigator.userAgent)?xmpID.innerText:xmpID.innerHTML; }
			}
			var arr=jUI.isArray(json)?json : json.data||[json];
			var sHTML=jUI.parseField_Data(sTpl, arr, '', funParseItemAfter);
			if ((elem==null)||(elem=='')) return sHTML;
			if (typeof(elem)=='string') elem=jUI('#'+elem)[0];
			elem.innerHTML = sHTML;
		},

		//获取obj的属性，为空时获取XMP属性
		getAttrAndXMP: function (obj, sAttr, sDef) {
			var str = jUI(obj).getAttr(sAttr);
			if (str != '') { return str; };
			var objs = jUI(obj).children('xmp.'+sAttr);
			if (objs.length>0) str=(/opera/i.test(navigator.userAgent))?objs[0].innerText : objs[0].innerHTML;
			return (str != '')? str : (sDef||'');
		},

		//[Func] 执行elem的属性（控件内部调用）<br> 将obj的属性拿来eval，当obj存在与属性同名的函数，则执行该将param当参数传入 @param {Element} 控件 @param {String} 控件属性或函数 @param {AllType} 执行函数时传入的参数
		evalAttr: function (elem, sAttr, param, param1, param2, param3){
			if ( (typeof(elem[sAttr])!='function') && (jUI.getAttr(elem,sAttr)=='') ) return;
			elem.__evalAttr=function (sAttr, param, param1, param2, param3){
				if(typeof(elem[sAttr])=='function') { return elem[sAttr](param, param1, param2, param3); };
                var sJS = jUI.getAttr(elem, sAttr);
                if (sJS != '') return eval(sJS);
			};
			elem.__evalAttr(sAttr,param, param1, param2, param3);
			elem.__evalAttr=null;
		},

		//loadDataForComponent'
		//[Func] <jUI>组件加载数据通用方法 (用于加载本地数据、远程数据，并对数据进行预处理)
		loadDataForComponent: function (elem, jParam, callback) {
			var oComp=jUI(elem);
			//[Event@<jUI>.loadDataForComponent] 接管 <jUI>.loadDataForComponent 方法, 当返回true则不再执行原有的方法 @param {Element} elem 要加载数据的组件 @Param {JSON} jParam 加载数据参数 @param {Function} callback 加载完回调函数
			if (jUI.evalExtendFunction('<AppPre>LoadDataForComponent', elem, jParam, callback)===true) { return; };
			function procResult(sJson){
				var arr,
						spl = oComp.getAttr('DataSplit',','),
						spl2= oComp.getAttr('DataSplit2','|');
				if (typeof(sJson)=='object'){
					arr=sJson;   //JSON对象
				}else{
					//[Event:<AppPre>LoadData_FormatData@<jUI>.loadDataForComponent] 页面可实现此方法来将请求返回的字串转为<jUI>的标准JSON @param {Element} elem 加载数据的组件 @param {String} str 数据 @return {JSON} <jUI>标准的JSON
					var fun = jUI.getExtendFunction('<AppPre>LoadData_FormatData');
					//arr = jtString2JtDataFormat(oComp,sJson);   //交由外部处理 ///TODO 替换备注中所有 jtString2JtDataFormat
					if (fun){
						arr = fun(elem,sJson);
					}else{
						arr=jUI.parseJSONEx(sJson, spl, spl2);  //JSON格式字符串 或 分割字符串
					}
					/*
					var temDat=jUI.evalExtendFunction('<AppPre>LoadData_FormatData', elem, sJson); if (temDat!=elem){
						arr=temDat;
					}else{
						arr=jUI.parseJSONEx(sJson, spl, spl2);  //JSON格式字符串 或 分割字符串
					};
					*/
				}

				//处理数组
				var json = jUI.isArray(arr)? {data:arr} : arr ;
				if (typeof(json.data)=='string') { json.data=jUI.parseJSONEx(json.data, spl, spl2); };

				var iSeqBase=0;
				if (json.pageSize) iSeqBase=(json.currentPage-1)*json.pageSize;
				if (json.data){
					for (var i=0; i<json.data.length; i++) { //添加数据序号
						json.data[i][appName+'SeqCurPage'] = i+1; //当前页序号
						json.data[i][appName+'Seq'] = i+iSeqBase+1; //当前页序号
					};
				};
				//[Event@<jUI>.loadDataForComponent] 组件数据加载完成 @param {Element} elem 加载数据的组件 @param {JSON} json 数据
                jUI.evalExtendFunction('<AppPre>AfterLoadData', elem, json);
				//if(typeof(jtAfterComponetLoadData)=='function') jtAfterComponetLoadData(oComp,json);

				//[Event:<AppPre>LoadData_InitItem@<jUI>.loadDataForComponent] 组件数据加载完成后，处理 JSON 中 data 的每个项  @param {Element} elem 加载数据的组件 @param {JSON} json 数据
				var funInit = jUI.getExtendFunction('<AppPre>LoadData_InitItem');
				if(funInit) {
					jUI.each(json.data, function(idx,item){
                        try {
                            funInit(elem, item, idx);
                        } catch (e) {
                        }//初始化JSON数据
					});
				};
                callback(json);
			};
			//1. 加载json数据对象
			if ((typeof(jParam.URLData)=='object')) { procResult(jParam.URLData); return;};
			var sURL=jParam.URLData,
					iStartNO=jUI.def(jParam.StartNO,0),
					iPage=jUI.def(jParam.Page,1);
			if ((typeof(sURL)!='string') || (sURL=='')) sURL=oComp.getAttr('URLData');

			if (sURL==''){
				var sData=jUI.getAttrAndXMP(elem,'data');
				//4. 加载本地数据json字符串
				if (sData!=''){ procResult(sData); return; };
				//5. 加载调用JS函数返回的数据
				var sJSData=oComp.getAttr('JSData');
				if (sJSData!=''){ procResult(eval(sJSData)); return; };
				//6. 加载空白
                procResult('{data:[]}');
                return;
			};
			sURL = sURL.replace(/{startNO}/ig, iStartNO.toString());
			sURL = sURL.replace(/{page}/ig, iPage.toString());
			//2. Ajax加载
			if (!jUI.isCrossDomain(jUI.parseURL(sURL))){
				jUI.get(sURL,function(str,xhr){ procResult(str); });
				return;
			};
			//3. 跨域加载
			//[Event@<jUI>.loadData] 加载数据跨域处理 @param {String} sURL 请求URL @param {Function} procResult 请求完数据后处理函数 procResult(sJson) @param {Element} elem 加载数据的组件 @Param {JSON} jParam 加载数据参数
			var fun=jUI.getExtendFunction('<AppPre>LoadData_CrossDomain');
			if (fun) {
				fun(sURL, procResult, elem, jParam);
			}else{
				jt.getJSONP(sURL,procResult);
			}
		},
		doc:{
			//[Func:jUI.doc.getHead] 获取当前 document 的 Head 节点 @return {Element} HEAD 节点
			getHead:function() {
				return document.head || jUI("head")[0] || document.documentElement;
			},
			//[Func:jUI.doc.getScrollTop] 获取文档的 scrollTop
			getScrollTop:function() {
				return document.body.scrollTop||document.documentElement.scrollTop;
			},
			//[Func:jUI.doc.getScrollLeft] 获取文档的 scrollLeft
			getScrollLeft:function() {
				return document.body.scrollLeft||document.documentElement.scrollLeft;
			},
			//[Func:jUI.doc.getClientHeight] 获取文档的 clientHeight
			getClientHeight:function() {
				return document.documentElement.clientHeight||document.body.clientHeight;
			},
			//[Func:jUI.doc.getClientWidth] 获取文档的 clientWidth
			getClientWidth:function() {
				return document.documentElement.clientWidth||document.body.clientWidth;
			}
		},
		//[Func] 加载样式<br>&lt;link rel="stylesheet" type="text/css" href="xxx.css"&gt; 形式。@param {String} 要加载的 CSS 的 URL @Tag <jUI>_Load
		loadCSS: function (sURL){
			sURL = jUI.parseURL(sURL,'loadCSS');
			var obj = document.createElement('link');
			obj.href = sURL; obj.rel = 'stylesheet'; obj.type = 'text/css'; obj.media = 'all'; jUI.doc.getHead().appendChild(obj);
		},
		//[Func] 添加CSS，直接添加CSS代码<br> &lt;style type="text/css"&gt; sStyle... &lt;/style&gt; 形式。@param {String} 要添加的 CSS 的 内容 @Tag <jUI>_Load
		appendCSS: function (sStyle){
			var obj = document.createElement('style');
            obj.type = 'text/css';
			if(obj.styleSheet){ obj.styleSheet.cssText = sStyle; } else { obj.appendChild(document.createTextNode(sStyle)); };
			jUI.doc.getHead().appendChild(obj);
		},
		//[Func] 以&lt;script&gt;方式加载JS<br>&lt;script type="text/javascript" src="sURL"&gt;&lt;/script&gt; 形式。@param {String} 要加载的 JS 的 URL @param 回调函数, 当JS加载完成、加载失败、加载超时后调用 格式 function(isSucc) @Tag <jUI>_Load
		loadJS: function (arrJS, funLoaded){
			//加载单个JS
			if (typeof(arrJS)=='string') { return jUI.loadJS( [arrJS] , funLoaded); };
			//没有需要加载的JS
			if ( (arrJS.length==0) && (typeof(funLoaded)=='function') ) { funLoaded(true,[]); return; }
			//加载多个JS
			var arr=[];
			for (var i=0; i<arrJS.length; i++){
				arr.push( { url:arrJS[i], loaded:false, isSucc:false } );
			}
			for (var i=0; i<arr.length; i++){
				if (typeof(funLoaded)!='function') { jUI.loadJSFile(arr[i].url); continue; }
				jUI.loadJSFile(arr[i].url, function(isSucc,args){
					args.isSucc = isSucc;
					args.loaded = true;
					var bAllLoaded=true;
					var bAllIsSucc=true;
					for (var j=0; j<arr.length; j++){
						if (!arr[j].loaded) { bAllLoaded=false; }
						if (!arr[j].isSucc) { bAllIsSucc=false; }
					}
					if (bAllLoaded) { funLoaded(bAllIsSucc,arr); }
				},arr[i]);
			}
		},
		loadJSFile: function (sURL, funLoaded, args){
			if (sURL==''){
				if (typeof(funLoaded)=='function') { funLoaded(true,args); }
				return;
			}
			sURL=jUI.parseURL(sURL,'loadJSFile');
			var script = document.createElement("script");
			script.src = sURL; script.type = "text/javascript";
			if (typeof(funLoaded)!='function') { jUI.doc.getHead().appendChild(script); return; };
			var done=false;
			function callback_(isSucc){
				if (isSucc) done = true;
				funLoaded(isSucc,args);
				script.onload = script.onerror = script.onreadystatechange = null; // Handle memory leak in IE
				jUI.doc.getHead().removeChild(script);
			};
			if(!-[1,]){  //IE 6 7 8
				script.onreadystatechange = function(){
					if(!done && (/(^loaded$)|(^complete$)/i.test(this.readyState))){ callback_(true); };
				};
			}else{
				script.onload = function(){ callback_(true); };
				script.onerror = function(){ callback_(false); };
				if(/Opera/i.test(navigator.userAgent)){
					setTimeout(function(){ if(!done){ callback_(false); } }, 3000); //超时时间3秒//fixOnerror
				};
			};
			jUI.doc.getHead().appendChild(script);
		},

		//[Func] 动态加载第三方JS @param {String} 判断变量，当变量不存在则加载JS @param {String} 要加载的 JS 的 URL @param 回调函数, 当JS加载完成、加载失败、加载超时后调用 格式 function(isSucc) @Tag <jUI>_Load
		loadThirdParty: function(checkVar, arrJS, funLoaded){
			var str = eval('typeof('+checkVar+')');
			if (/function|object/i.test(str)) { funLoaded(true); return; }
			jUI.loadJS(arrJS,funLoaded);
			//if (!jt.isCrossDomain(sURL)){ jt.appendJS(jt.get(sURL, null, false)); funLoaded(); return; } //未跨域,同步加载
			//jt.loadJS(sURL,funLoaded); //跨域(JS文件不在同一个域)
		},


		//*[Func] Ajax 方式同步加载 JS。<br>new Function('') 形式。@param {String} 要加载的 JS 的 URL @Tag <jUI>_Load
		//importJS: function (sURL){ (new Function(jUI.get(sURL,null,false).result))(); },
		//[Func] 添加 JS，直接添加 JS 代码。<br>&lt;script type="text/javascript"&gt; sScript... &lt;/script&gt; 形式。@param {String} 要添加的 JS 的内容 @Tag <jUI>_Load
		appendJS: function (sScript){
			var obj = document.createElement("script");
            obj.text = sScript;
            obj.type = "text/javascript";
			jUI.doc.getHead().appendChild(obj);
		},
		//[Func] 动态加载组件（同步方式） @param {String|StringArray} 组件名称（多个组件以,隔开）或 组件名称数组 @Tag <jUI>_Load
		loadPlugin: function (sPlugin){
			function getFullPath(sPlgName){
				if (/[\\\/]/g.test(sPlgName)){
					sPlgName = sPlgName.replace(/^(Extend[\\\/])(.*)/g,jUI.Path_Extend+'$2');
					sPlgName = sPlgName.replace(/^(ThirdParty[\\\/])(.*)/g,jUI.Path_ThirdParty+'$2');
					return sPlgName;
				}
				return jUI.Path_Plugin + sPlgName+'.js';
			}
			if (!sPlugin) { return; }
			var arr = (typeof(sPlugin)=='string')? sPlugin.replace(/ *[,;] */g,',').split(',') : sPlugin;
			arr = jUI.grep(arr,function (str,idx) { return (jUI.trim(str)!='') && (typeof(jUI[str])=='undefined'); }); //清除字符串和已加载组件
			if (jUI.isCrossDomain(jUI.Path)){ //跨域
				var arrJS=[];
				jUI.each(arr,function(idx,str){
					arrJS.push( getFullPath(str) );
					jUI.each(jUI.PluginList_Dynamic,function(idx,item){
						if (str!=item.Name) { return; }
						var arrReq=item.RequirePlugin;
						for (var i=0; i<arrReq.length; i++){
							if (typeof(jUI[arrReq[i]])!='undefined') { continue; }
							var sURL=getFullPath(arrReq[i]);
							if (/\.js$/ig.test(sURL)) { arrJS.push(sURL); }
						}
					});
				});
				jUI.loadJS(arrJS,jUI.FormatUI);
			}else{
				jUI.each(arr,function(idx,str){
					//jUI.log(getFullPath(str));
					jUI.appendJS( jUI.get( getFullPath(str) , null,false).result ); //加载插件
					if (!jUI[str]) return;
					if (!jUI[str].noCSS) { jUI.loadCSS(jUI.Path_Themes + jUI.Theme+'/'+str+'/css.css'); } //加载插件样式
					//TODO 如果 RequirePlugin 中包含目录而非js时，未处理
                    jUI.loadPlugin(jUI[str].RequirePlugin);
				});
			}
		},

		//[Func] 在页面上输出调试信息 @Tag <jUI>_Utils
		log: function (info,iShowTime){
			iShowTime = jUI.def(iShowTime,5);
			var divLog = jUI('#div_jUI_Log');
			if (divLog.length==0){
				var sHTML='<div id="div_jUI_Log" style="position:fixed; _position: absolute; z-index:1000; left:10px; top:10px; background-color:#fffbe8; border:1px solid #bf9045; line-height:22px; max-width:90%; max-height:90%; overflow:auto;min-width:120px;box-shadow:0px 0px 6px #CCCCCC; border-radius: 3px;" ondblclick="jUI(this).html(\'\');jUI(this).hide()"></div>';
				jUI(document.body).append(sHTML);
				divLog = jUI('#div_jUI_Log');
			}
			clearTimeout(jUI.time_jUI_Log);
			if (arguments.length==0){
				divLog.html('');
				jUI.time_jUI_Log=setTimeout( function(){ jUI('#div_jUI_Log').hide();}, 2000);
			}else{
				if (iShowTime>0) {
					jUI.time_jUI_Log = setTimeout( function(){
						jUI('#div_jUI_Log').html('');
						jUI('#div_jUI_Log').hide();
					}, iShowTime*1000);
				}
				var sHTML='<pre style="border-top:'+(divLog.children().length==0?'0':'1')+'px solid #bf9045;margin:0px; position: relative;">';
				sHTML+='<span style="position:absolute; right:3px; top:2px; color:gray; line-height:8px; font-size:8px;">'+(divLog.children().length+1)+'</span>';
				if (jUI.isArray(info)){
					for (var i=0;i<info.length;i++){ sHTML += '<div style="border-top:'+(i==0?'0':'1')+'px solid #abd35d; position: relative;min-height:12px;"><span style="position:absolute; right:16px; top:2px; color:green; line-height:6px; font-size:8px;">'+(i+1)+'</span><xmp style="display:block;margin:0px; padding:3px;">'+info[i]+'</xmp></div>'; }
				}else if (jUI.isPlainObject(info)){
					sHTML += '<xmp style="display:block;margin:0px; padding:3px;tab-size:2;">'+jUI.JSON2Str(info)+'</xmp>';
				}else{
					sHTML += '<xmp style="display:block;margin:0px; padding:3px;">'+info+'</xmp>';
				}
				divLog.append(sHTML+'</pre>');
				divLog.show();
			}
		},
		//[Func] 判断URL是否跨域 @param {String} 要判断的URL @param {String} 要对比的URL，不传则为当前页面URL @Tag <jUI>_Load
		isCrossDomain: function (sURL, sURLSelf){
			if (typeof(sURLSelf)!='string'){
				if (self.location.protocol=='file:') return false;
				sURLSelf=self.location.href;
			}
			var rurl=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
			var arr1 = rurl.exec( sURL.toLowerCase() ); var arr0 = rurl.exec( sURLSelf.toLowerCase() );
			if (arr1==null) return false;
			return !!( arr0 &&
					( arr0[ 1 ] !== arr1[ 1 ] || arr0[ 2 ] !== arr1[ 2 ] ||
							( arr0[ 3 ] || ( arr0[ 1 ] === "http:" ? "80" : "443" ) ) !==
									( arr1[ 3 ] || ( arr1[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		},
		//[Func] 计算顶级域名 @param {String} url 要计算的URL，不传则为当前页面URL
		getDomain: function(url){
			var str = jUI.def(url,document.domain);
			if (!/[a-z]/i.test(str)) return str;
			if (str.split('.').length<3) return str;
			var sRet='';
			var regex=/(\.(cn|hk|tw|us|de|uk|fr|eu|mo|io|br|ca|cc|ee|me))$/ig;  var match = str.match(regex);  if (match) { sRet=match[0]; str=str.replace(regex,''); };
			regex=/(\.(com|net|top|teck|org|gov|edu|ink|red|int|mil|pub|biz|tv|mobi|travel))$/ig;  match = str.match(regex);  if (match) {sRet=match[0]+sRet; str=str.replace(regex,''); };
			var arr=str.split('.');
			return arr[arr.length-1]+sRet;
		},
		//[Func] 跨站脚本攻击(Cross Site Scripting)过滤， sType可为 'URL'(默认)、'HTML'
		xssFilter:function(str,sType){
			//if (/^html$/i.test(sType)){
			//}else{
			//}
			return str;
		}
	});


    jUI.fn.extend( {
		//[Func](fn) 获取属性， 当没有此属性时使用默认值 @param {String} 要获取的属性名称 @param {String|Number|Boolean} 默认值 @Tag <jUI>_Attr
		getAttr: function(name, defValue) {
			return jUI.def(this.attr(name),typeof(defValue)=='undefined'?'':defValue);
		}
	} );


    //////////// 事件 ////////////
	jUI.extend({
		//[Func] 为元素添加事件 @param {Element} elem DOM元素 @param {String} type 事件名称，如 click resize mouseup @param {Function} handler 执行函数 @param {Boolean=false} 添加完后立即执行一次 @Tag <jUI>_Event,<jUI>_Utils
		addEvent: function(elem, type, handler, bRun){
			type = /^on/i.test(type)?type.substr(2):type;
            if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			}else if (elem.attachEvent){
				//elem.attachEvent("on" + type, handler);
				//改变this指向,解决在函数中this获取不正确的问题
				elem.attachEvent('on' + type, function(){ handler.call(elem,arguments); });
			}else{
				elem["on" + type] = handler;
			}
			if (bRun) handler.call(elem); //立即执行
		},
		//[Func] 删除元素事件 @param {Element} elem DOM元素 @param {String} type 事件名称，如 click resize mouseup @param {Function} handler 执行函数 @Tag <jUI>_Event,<jUI>_Utils
		removeEvent: function(elem, type, handler){
			if (elem.removeEventListener){ return elem.removeEventListener(type, handler, false); }
			if (elem.detachEvent){ return elem.detachEvent("on" + type, handler); }
			return elem["on" + type] = null;
		},
		//[Func] 在指定窗口里设置鼠标捕获
		setCapture: function(elem){
			if (!window.captureEvents) {
				elem.setCapture();
			}else{
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			};
		},
		//[Func] 在指定窗口里设置鼠标释放
		releaseCapture: function(elem){
			if(!window.captureEvents){
				elem.releaseCapture();
			}else{
				window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
			};
		},
		//[Func] 获取当前鼠标下的对象 @return {Element} DOM对象  @Tag <jUI>_Event,<jUI>_Utils
		getTarget: function(event){ return event.target || event.srcElement; }
	});

	jUI.fn.extend({
		//[Func](fn) 为匹配元素添加事件 @param {String} type 事件名称，如 click resize mouseup @param {Function} handler 执行函数 @param {Boolean=false} 添加完后立即执行一次 @Tag <jUI>_Event,<jUI>_Utils
		addEvent: function(type, handler, bRun){
			return this.each(function() { jUI.addEvent(this,type,handler, bRun); });
		},
		//[Func](fn) 删除匹配元素的事件 @param {String} type 事件名称，如 click resize mouseup @param {Function} handler 执行函数 @Tag <jUI>_Event,<jUI>_Utils
		removeEvent: function(type, handler){
			return this.each(function() { jUI.removeEvent(this,type,handler); });
		}
	});
    //---------------------------------- 扩展[ End ] ----------------------------------

	///其他扩展
	//alert(typeof(window.console));
	if (!window.console){
		var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
		window.console = {};
		for (var i = 0; i < names.length; ++i) {window.console[names[i]] = function() {}}
	};

	//[Func] <em>String扩展方法</em> 除去两边空白，如：<code>' aa  '.trim()</code>
	String.prototype.trim = function(){ return jUI.trim(this); };

	Array.prototype.indexOfEx = function(oCondition,fromIndex){ return jUI.inArray(oCondition,this,fromIndex); };
	if (!indexOf) {
		Array.prototype.indexOf = function(oCondition,i){
			var len;
			len = this.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
			for ( ; i < len; i++ ) {
				if ( i in this && this[ i ] === oCondition ) { return i; }
			}
			return -1;
		};
	};

	// 格式化日期 //TODO 这个函数要优化
	Date.prototype.format = function(sFmt){
		//yyyy mm dd hh MI ss ww
		var strTem='';
		var sResult=sFmt;

		sResult = sResult.replace(/yyyy/ig,this.getFullYear().toString());
		sResult = sResult.replace(/yy/ig,this.getFullYear().toString().substr(2));

		strTem = (this.getMonth()+1).toString();
		sResult = sResult.replace(/mm/g,strTem);
		if (strTem.length<2) strTem='0'+strTem;
		sResult = sResult.replace(/MM/g,strTem);

		strTem = this.getDate().toString();
		sResult = sResult.replace(/dd/g,strTem);
		if (strTem.length<2) strTem='0'+strTem;
		sResult = sResult.replace(/DD/g,strTem);

		strTem = this.getHours().toString();
		sResult = sResult.replace(/hh/g,strTem);
		if (strTem.length<2) strTem='0'+strTem;
		sResult = sResult.replace(/HH/g,strTem);

		strTem = this.getMinutes().toString();
		sResult = sResult.replace(/mi/g,strTem);
		if (strTem.length<2) strTem='0'+strTem;
		sResult = sResult.replace(/MI/g,strTem);

		strTem = this.getSeconds().toString();
		sResult = sResult.replace(/ss/g,strTem);
		if (strTem.length<2) strTem='0'+strTem;
		sResult = sResult.replace(/SS/g,strTem);

		strTem = ["日", "一", "二","三","四", "五","六"][this.getDay()];
		sResult = sResult.replace(/ww/g,strTem);
		strTem = ["星期日", "星期一", "星期二","星期三","星期四", "星期五","星期六"][this.getDay()];
		sResult = sResult.replace(/WW/g,strTem);

		return sResult;
	};
	Date.fromString = function (sDate){ return new Date(sDate.replace(/-|\.|年|月|日|(\/\/)/g,'/').replace(/\/ /g,' ').replace(/\/$/g,'')); };

	//{NEWLINE}



	//////////// Ajax ////////////
	//[Func] 创建 XMLHttpRequest 对象 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
	jUI.createXHR = function(){
		if (/^(file):$/i.test(self.location.protocol)){ //本地文件优先使用ActiveXObject
			for (var i=0; i<5; i++){
				try{ var xhr = new ActiveXObject(['MSXML2.XMLHTTP','Microsoft.XMLHTTP','MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'][i]);return xhr; }catch(e){};
            }
            ;
		}
		if (typeof XMLHttpRequest != "undefined"){ return new XMLHttpRequest(); }
		for (var i=0; i<4; i++){
			try{ var xhr = new ActiveXObject(['Microsoft.XMLHTTP','MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'][i]);return xhr; }catch(e){};
		};
		jUI.error('No XHR object available.');
	};

	//[Func] 创建 MSXMLDOM 对象 @return {MSXMLDOM} 返回 MSXMLDOM 对象
	jUI.createMSXMLDom = function () {
		for (var i=0; i<4; i++){
			try{
				var r = new ActiveXObject(["Microsoft.XMLDOM", "MSXML2.DOMDocument", "MSXML.DOMDocument", "MSXML3.DOMDocument"][i]);
				return r;
			}catch(e){};
		};
		return null;
	};
	//[Func] 创建 XMLDOM 对象 @return {XMLDOM} 返回 MSXMLDOM 或 document 对象
	jUI.createXMLDom = function () {
		var dom=jUI.createMSXMLDom();
		return (dom!=null)?dom:document.implementation.createDocument("", "doc", null);
	};

	/**
	 * Ajax 默认设置
	 * @Type Attr
	 * @Name <jUI>.Settings.Ajax
	 * @Tag <jUI>_Ajax,<jUI>_Settings
	 * @eg  //格式如下：
	 * {
	 *   url:'',      //请求URL
	 *   type:'GET', //请求方式 POST 或 GET
	 *   async:true,  //是否异步
	 *   data:{}, //要提交的数据
	 *   showErrorInfo:false, //请求出错时是否弹出出错信息
	 *   dataType:'html', //返回数据类型 xml,html,script,json,jsonp,text
	 *   headers: { 'x-requested-with': 'XMLHttpRequest' }, //http头信息
	 *   success: function(result, xhr){ }, //请求成功回调函数
	 *   error: function(result, xhr){ },   //请求失败回调函数
     *   complete: function(result, bSuccess, xhr){ } //请求完成回调函数（无论成功失败都会触发）
	 * }
     */
	jUI.Settings.Ajax = {
		url:'', type:'GET', async:true, data:{}, showErrorInfo:true,
		dataType: 'html', // xml,html,script,json,jsonp,text
		headers: { //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'x-requested-with': 'XMLHttpRequest'
		}
	};

	////////// 保存原有方法后覆盖原有方法 //////////
	//保存原有ajax方法
	jUI.ajax_ = jUI.ajax;
	//jUI.get_  = jUI.get;
	jUI.extend({

		//TODO 重写 ajax
		ajax_____: function( url, options ) {
			if ( typeof url === "object" ) { options = url; url = undefined; }
			options = options || {};
			var
				i,
				parts,         //跨域检测变量
				cacheURL,      // URL without anti-cache param
				responseHeadersString, // Response headers as string
				timeoutTimer,  // timeout handle
				fireGlobals,   // To know if global events are to be dispatched
				transport,
				responseHeaders, // Response headers
				s = jQuery.ajaxSetup( {}, options ), // Create the final options object
				callbackContext = s.context || s,  //回调上下文
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) : jQuery.event,
				deferred = jQuery.Deferred(),  // Deferreds
				completeDeferred = jQuery.Callbacks( "once memory" ),
				statusCode = s.statusCode || {},  // Status-dependent callbacks
				requestHeaders = {},  // Headers (they are sent all at once)
				requestHeadersNames = {},
				state = 0,  // The jqXHR state
				strAbort = "canceled",  // Default abort message

				// Fake xhr
				jqXHR = {
					readyState: 0,
					//建立请求头哈希表
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},
					//缓存请求头
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
					//重写响应content-type头
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},
					//取消请求
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			//添加延时事件
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" )
				.replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :

						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );

					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		/**
         * 执行一个同步或异步的HTTP（Ajax）的请求。
		 * @param {String} 一个用来包含发送请求的URL字符串。
		 * @param {String=GET} 请求方式 ("POST" 或 "GET")
		 * @param {Boolean=true} 是否异步请求。默认为异步请求(true)
		 * @param {JSON} 发送到服务器的数据。
		 * @param {Fnction} 成功后回调函数 function( result, xhr )
		 * @param {String=html} 返回数据类型（json,html,xml）
		 * @param {JSON} 其他 Ajax 参数。
		 * @return {XHR} 返回 XMLHttpRequest 对象
		 * @Tag <jUI>_Ajax
		 * @eg  //options 格式如下：
		 * {
		 *   url:'',      //请求URL
		 *   type:'POST', //请求方式 POST 或 GET
		 *   async:true,  //是否异步
		 *   showErrorInfo:false, //请求出错时是否弹出出错信息
		 *   dataType:'html', //返回数据类型 xml,html,script,json,jsonp,text
		 *   headers: { 'x-requested-with': 'XMLHttpRequest' }, //http头信息
		 *   success: function(result, xhr){ }, //请求成功回调函数
		 *   error: function(result, xhr){ },   //请求失败回调函数
         *   complete: function(result, bSuccess, xhr){ } //请求完成回调函数（无论成功失败都会触发）
		 * }
         */
    ajax: function( sURL, sType, async, data, callback, dataType, options ){
			//if ( typeof(sURL) === "object" )  //TODO 兼容性处理
			//if ( typeof(sType) === "object" )  //TODO 兼容性处理
			jUI.Settings.update('Ajax');
			var sKey,   oRet,   strTem,  postData=null,
					xhr = jUI.createXHR(),
					opt=jUI.extend( true, {}, jUI.Settings.Ajax),
					jXHR={
						readyState:0, status:0, statusText:'', result:'',
						response:'', responseText:'', responseType:'', responseURL:'', responseXML: null,
						isXHRObject:true
					};
			if ( typeof sURL === "object" ) { //传入JSON
				jUI.extend( true, opt, sURL);
			}else{ //传入参数
				jUI.extend( true, opt, options, { url:sURL, type:sType, async:async, data:data, success:callback, dataType:dataType } );
			}
			sURL = jUI.parseURL( opt.url,'ajax' );  dataType=opt.dataType;
			function funAfter(){
				//jUI.each(['readyState','responseURL','status','statusText', 'responseType'],function(i,key){ jXHR[key] = xhr[key]; });
				jXHR.readyState = xhr.readyState;  jXHR.responseURL = xhr.responseURL;  jXHR.responseType = xhr.responseType;
				if(xhr.readyState==4) { //0:Uninitialized,  1:Open,  2:Sent,  3:Receiving,  4:Loaded
					//jUI.each(['response','responseText','responseXML'],function(i,key){ jXHR[key] = xhr[key]; });
					jXHR.status = xhr.status;  jXHR.statusText = xhr.statusText;
					jXHR.response = xhr.response;  jXHR.responseText = xhr.responseText;  jXHR.responseXML = xhr.responseXML;
					var bSuccess=false;
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 0/*当本地文件请求时,status会为0*/){
						bSuccess=true;
						strTem=jXHR.responseText;
						jXHR.result=(dataType=='json')?jUI.parseJSON(strTem):( (dataType=='xml')?jUI.parseXML(strTem):strTem );
						if (typeof(opt.success)=='function') { opt.success( jXHR.result, jXHR ) }
					}else{
						jXHR.result = jXHR.responseText;
						if (typeof(opt.error)=='function') {
							opt.error( jXHR.result, jXHR )
						}else{
							if (opt.showErrorInfo){ jUI.error( {fun:'jUI.ajax',description:'XMLHttp.status='+xhr.status,url:sURL} ); }
						}
					}
					if (typeof(opt.complete)=='function') { opt.complete( jXHR.result, bSuccess, jXHR ) }
					//[Event@@<jUI>.ajax] Ajax 请求结束后触发 @param {XHR} xhr XMLHttpRequest 对象 @param {String|JSON|XML} result 返回结果 @param {Sring} url 请求的URL @param {String} dataType 请求数据类型 @Tag <jUI>_Ajax
					jUI.evalExtendFunction('<AppPre>AfterAjax', jXHR, jXHR.result, sURL, dataType);
					//if(typeof(jUI_AfterAjax)=='function') jUI_AfterAjax(jXHR, jXHR.result, sURL, dataType);
				};
			}
			xhr.onreadystatechange = funAfter;
			xhr.open( opt.type, sURL, opt.async );
			if (/post/i.test( opt.type )) {
				
				if(opt["Content-Type"]){
					xhr.setRequestHeader("Content-Type",opt["Content-Type"]);
					postData = JSON.stringify(opt.data);
				}else{
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					postData = (typeof opt.data === 'object')? (opt.data==null?'':jUI.param( opt.data )) : opt.data ;
				}
			};
			for ( sKey in opt.headers ) { xhr.setRequestHeader( sKey, opt.headers[sKey] ); }
			xhr.setRequestHeader( 'x-content-type', dataType );
            try {
                xhr.send(postData);
            } catch (e) {
				//if (opt.showErrorInfo){ e.url=sURL; e.fun='jUI.ajax';jUI.error(e); return; }
				if (typeof(opt.error)=='function') {
					opt.error( jXHR, jXHR.result )
				}else{
					if (opt.showErrorInfo){ jUI.error( {fun:'jUI.ajax',description:'XMLHttp.status='+xhr.status,url:sURL} ); }
				}
			};
			return jXHR;
    },
		//[Func] Ajax GET 请求，返回 HTML 字符串。 @param {String} 一个用来包含发送请求的URL字符串。 @param {Fnction} 成功后回调函数 function( result, xhr ) @param {Boolean=true} 是否异步请求。默认为异步请求(true) @param {JSON} 其他 Ajax 参数。 格式参见 Ajax 的 options 参数说明 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
		get:     function(sURL, callback, async, options){
			return jUI.ajax(sURL, 'GET',  async, '', callback, 'html', options);
		},
		//[Func] Ajax GET 请求，返回 JSON 数据。 @param {String} 一个用来包含发送请求的URL字符串。 @param {Fnction} 成功后回调函数 function( resultJSON, xhr ) @param {Boolean=true} 是否异步请求。默认为异步请求(true) @param {JSON} 其他 Ajax 参数。 格式参见 Ajax 的 options 参数说明 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
		getJSON: function(sURL, callback, async, options){
			return jUI.ajax(sURL, 'GET',  async, '', callback, 'json', options);
		},
		//[Func] Ajax GET 请求，返回 XML 对象。 @param {String} 一个用来包含发送请求的URL字符串。 @param {Fnction} 成功后回调函数 function( resultXML, xhr ) @param {Boolean=true} 是否异步请求。默认为异步请求(true) @param {JSON} 其他 Ajax 参数。 格式参见 Ajax 的 options 参数说明 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
		getXML:  function(sURL, callback, async, options){
			return jUI.ajax(sURL, 'GET',  async, '', callback, 'xml',  options);
		},
		//[Func] Ajax POST 请求，返回 HTML 字符串。 @param {String} 一个用来包含发送请求的URL字符串。 @param {JSON} 发送到服务器的数据。 @param {Fnction} 成功后回调函数 function( result, xhr ) @param {Boolean=true} 是否异步请求。默认为异步请求(true) @param {JSON} 其他 Ajax 参数。 格式参见 Ajax 的 options 参数说明 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
		post:    function(sURL, data, callback, async, options){
			return jUI.ajax(sURL, 'POST', async, data, callback, 'html', options);
		},
		//[Func] Ajax POST 请求，返回 JSON 数据。 @param {String} 一个用来包含发送请求的URL字符串。 @param {JSON} 发送到服务器的数据。 @param {Fnction} 成功后回调函数 function( resultJSON, xhr ) @param {Boolean=true} 是否异步请求。默认为异步请求(true) @param {JSON} 其他 Ajax 参数。 格式参见 Ajax 的 options 参数说明 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
		postJSON:function(sURL, data, callback, async, options){
			return jUI.ajax(sURL, 'POST', async, data, callback, 'json', options);
		},
		//[Func] Ajax POST 请求，返回 XML 对象。 @param {String} 一个用来包含发送请求的URL字符串。 @param {JSON} 发送到服务器的数据。 @param {Fnction} 成功后回调函数 function( resultXML, xhr ) @param {Boolean=true} 是否异步请求。默认为异步请求(true) @param {JSON} 其他 Ajax 参数。 格式参见 Ajax 的 options 参数说明 @return {XHR} 返回 XMLHttpRequest 对象 @Tag <jUI>_Ajax
		postXML: function(sURL, data, callback, async, options){
			return jUI.ajax(sURL, 'POST', async, data, callback, 'xml',  options);
		},
		//[Func] JSONP，跨域请求JSON, 采用JSONP方式，回调函数为window.<jUI>_funJSONP[]函数数组 (sURL会自动追加 &callback=<jUI>_funJSONP[0] 以供JSONP返回时调用)|||<code>jt.getJSONP('xxxx.xx', function(json){ alert(json) });</code>
		getJSONP: function (sURL, callback){
			var arrFun=window[appName+'_funJSONP']; //jUI_funJSONP
			if (typeof(arrFun)=='undefined') { arrFun=window[appName+'_funJSONP']=[]; }
			sURL = jUI.parseURL(sURL,'getJSONP');
			var jsonp_fun = appName+encodeURI('_funJSONP[' + (arrFun.push(callback)-1) + ']');
			sURL += ((sURL.indexOf('?')==-1)?'?':'&') + 'callback=' + jsonp_fun;
			jUI.loadJS(sURL);
		}
	});


	//[Attr] 空白图片
	jUI.TransparentImg = '<img width="1" src="' + jUI.Path_Themes + 't.gif">';

	//弹出窗口的 zIndex (内部变量)
	jUI._PopFrame_zIndex = 10100;

	//|||本函数提供如下接管函数：|||<code>jtBeforeFormatUI (obj) </code> 在调用jt.FormatUI前将会触发
	//[Func] 格式化控件 @param {Element=document} elem 被格式化的控件

	jUI.FormatUI = function (elem){
		elem = (typeof(elem)=='object')?elem:document;
		function checkClass(arrTag,sPlugin){
			var sExp=jUI.map(arrTag,function(str,idx){ return str+'.'+sPlugin+':first'; }).join();
			if (jUI(elem).is(sExp)) { return true; }
			return jUI(sExp,elem).length>0;
		}
		(function(){ //动态加载需要的组件
			var arr=[];
			//加入 <script loadPlugin="XXX" 中的组件
			if (jUI.exPlugin!='') { arr = jUI.grep(jUI.exPlugin.replace(/ *[,;] */g,',').split(','),function (str,idx) { return jUI.trim(str)!=''; }); }
			//检查页面中用到的动态组件
			jUI.each(jUI.PluginList_Dynamic,function(idx,item){
				if (typeof(jUI[item.Name])!='undefined') { return; } //已经加载
				if (checkClass(item.TagName,item.Name)) { arr.push(item.Name); }
			});
			if (arr.length>0) { jUI.loadPlugin(arr); }
		})();

		//[Event@<jUI>.FormatUI] 格式化控件前触发 @param {Element} elem 被格式化的控件
		jUI.evalExtendFunction('<AppPre>BeforeFormatUI',elem);
		//if(typeof(jUI_BeforeFormatUI)=='function') jUI_BeforeFormatUI(elem);
		jUI.FormatUIed=true;
		if (jUI.builded) jUI.loadCSS(jUI.Path_Themes + jUI.Theme+'/css.css');
		for (var i=0; i<jUI.PluginList.length; i++){
			var sPlugin = jUI.PluginList[i];
			var arrTag = jUI[sPlugin].TagName||[];
			if (arrTag.length==0) continue;
			var funFormat = jUI[sPlugin].FormatUI;
			if (typeof(funFormat)!='function') continue;

			var sExp=jUI.map(arrTag,function(str,idx){ return str+'.'+sPlugin; }).join();

			var objs = jUI();
			if (jUI(elem).is(sExp)) { objs = objs.add( jUI(elem) ); }
			objs = objs.add( jUI(sExp,elem) );
			for (var j=(objs.length-1); j>=0; j--) {
				if (objs[j].Formated) { continue; }
				objs[j].Formated=true;
				funFormat(objs[j]);
			}
		};
	};

	jUI.addEvent(window,'load',function (){
		if (!jUI.FormatUIed){jUI.FormatUI()};
	});

	return jUI;
})(window,'jt');




//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------------- jt对象   ----------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

//window.jt = {};
jt.builded = true;  //是否已合并

(
function () { //初始化jt变量
	jt.Const={};
	jt.getDefVal = jt.def;
	jt.setAttr = jt.attr;

	jt.setCookie = jt.cookie;
	jt.delCookie = jt.removeCookie;

	jt.getValueFromKeyValue = jt.getValueFromParam; //TODO DEL
	jt.Error = jt.error; //TODO DEL

	jt.Str2Json = jt.parseJSON;
	jt.Str2JsonEx = jt.parseJSONEx;

	jt.Str2XML = jt.parseXML; //TODO DEL

	window.funJTJSONP=window.jt_funJSONP=[]; //

//	//获取扩展函数
//	jt.getExtendFunction = function(sFunction){
//		var sFun1 = sFunction.replace(/<AppPre>/g,'jt_');
//		var sFun2 = sFunction.replace(/<AppPre>/g,'jt');
//		if (sFun2=='jtLoadData_InitItem') sFun1='jtInitJtDataItem'; //强制修改扩展函数名
//		var fun=window[sFun1]||window[sFun2];
//		if (typeof(fun)=='function') return fun;
//		return null;
//	};
	var arrExtendFunction={
		jtLoadData_InitItem   : 'jtInitJtDataItem',
		jtList_BeforeLoadData : 'jtBeforeListLoadData',
		jtList_AfterLoadData  : 'jtAfterListLoadData',
		jtList_AfterShowData  : 'jtAfterListShowData',
		jtList_AfterItemClick : 'jtAfterListItemClick',
		jtPageBar_AfterChangePageSize : 'jtAfterPageBarChangePageSize'

	}
	//获取扩展函数
	jt.getExtendFunction = function(sFunction){
		var sFun1 = sFunction.replace(/<AppPre>/g,'jt_');
		var sFun2 = sFunction.replace(/<AppPre>/g,'jt');
		////强制修改扩展函数名
		var sFunNew = arrExtendFunction[sFun2];
		if (sFunNew) sFun2 = sFunNew;
		//console.log(sFun1+'  '+sFun2)
		var fun=window[sFun1]||window[sFun2];
		if (typeof(fun)=='function') return fun;
		return null;
	};


	//[Func] 执行obj的属性（控件内部调用）|||将obj的属性拿来eval，当obj存在与属性同名的函数，则执行该将oParam当参数传入
	jt.evalAttr = function (obj, sAttr, oParam){
		obj.__evalAttr=function (sAttr, oParam){
			if(typeof(obj[sAttr])=='function') { obj[sAttr](oParam); return; };
            var sJS = jt.getAttr(obj, sAttr);
            if (sJS != '') eval(sJS);
		};
		obj.__evalAttr(sAttr,oParam);
		obj.__evalAttr=null;
	};

	//jt筛选器, expr:表达式, context:指定对象(默认document) 支持如下查询
    //_('#elementID') 查找某个 ID 或 Name 为 elementID 的对象 [返回对象]
    //_('div',node) 查找 node 下所有 div  [返回数组]
	//_('.cssX') _('element.cssX',node) 查找所有 class 为 cssX 的对象  所有 class 为 cssX 的 element(可以为td div 等)  [返回数组]
    //_('[children]element.cssX',node) 查找所有符合条件node的子节点,不含孙节点  [返回数组]
	//_('[parent]element.cssX',node) 查找所有符合条件第一个父对象  [返回对象]
	jt._ = function (expr, context){
		function __newArray(arr) { var ret = []; for (var i=0; i<arr.length; i++) ret.push(arr[i]); return ret; };
		function __filterByClassName(elements,className){  //context,tagName
			className = className.split(" ");
            var classNameLength = className.length;
			for(var i=0,j=classNameLength;i<j;i++) className[i]= new RegExp("(^|\\s)" + className[i].replace(/\-/g, "\\-") + "(\\s|$)",'i');
            var result = [];
            for (var i = 0, j = elements.length, k = 0; i < j; i++) {//缓存length属性
                var element = elements[i];
				while(className[k++].test(element.className)){//优化循环
					if(k === classNameLength){ result[result.length] = element; break; };
				};
				k = 0;
			};
			return result;
		};

		context=context||document;
		var match;
		//   #id
		if(/^#([\w-\.]+)$/.test(expr)) return context.getElementById(expr.substr(1))||document.getElementsByName(expr.substr(1))[0];
		//   element
		if(/^([\w-]+)$/.test(expr)) return __newArray(context.getElementsByTagName(expr));
        //   .class element.class
		if ((match = /^(([\w-]*|\*)\.([\w-]+))$/.exec(expr)) != null) return __newArray( __filterByClassName(context.getElementsByTagName(match[2] || "*"),match[3]));
		//   [children]element.cssX
		if ((match = /^\[children\](([\w-]*|\*)(\.([\w-]*))*)$/.exec(expr)) != null) {
			match[2]=match[2].toLowerCase() || "*"; match[4]=match[4]||''; match[3]=match[3]||'';
			if (match[2]=='*') {
				if ((match[3]=='')&&(match[4]=='')) return __newArray(context.childNodes);
				return __newArray( __filterByClassName(context.childNodes,match[4]));
			};
			var arr=[];
			for (var i=0; i<context.childNodes.length; i++){
				if (context.childNodes[i].nodeName.toLowerCase()==match[2]) arr.push(context.childNodes[i]);
			};
			if ((match[3]=='')&&(match[4]=='')) return arr;
			return __newArray( __filterByClassName(arr,match[4]));
		};
		//   [parent]element.cssX
		if ((match = /^\[parent\](([\w-]*|\*)(\.([\w-]*))*)$/.exec(expr)) != null) {
			match[2]=match[2].toLowerCase() || "*"; match[4]=match[4]||''; match[3]=match[3]||'';
			var j=0;
			var oPar=context;
			while(oPar.nodeName != 'BODY'){ //while(oPar != document.body){
				//oPar=oPar.parentNode;
				j++; if(j>200) break;
				if (match[2]!='*'){ if (oPar.nodeName.toLowerCase()!=match[2]) {oPar=oPar.parentNode; continue;} };
				if (match[4]!='') { if (!jt.hasClass(oPar,match[4])) {oPar=oPar.parentNode; continue;} };
				return oPar;
			};
			return;
		};
		return [];
	};

	if(typeof(window._)!='function') window._=jt._;

	//-[Func] 获取对象的实际Left
	jt.getAbsLeft = function(obj, objStopAt){ return jt(obj).offset().left; };
	//-[Func] 获取对象的实际Top
	jt.getAbsTop = function(obj, objStopAt){ return jt(obj).offset().top; };
	//[Func] 执行HTML中包含的JS
	jt.execHtmlScript = function (sHTML){	//执行HTML中包含的JS
		if (!sHTML.match(/<script(.|\s)*?\/script>/g)) return;
		var arr=sHTML.match(/<script(.|\s)*?\/script>/g);
		for (var i=0; i<arr.length; i++){
			var script = document.createElement("script");
			var head = document.getElementsByTagName('head')[0];
			script.type = "text/javascript";
			//if (arr[i].match(/src=\"(.|\s)*?\"/g)){
			if (arr[i].indexOf('><\/script>')>0){
				var sSrc=arr[i].match(/src=(\"|\')(.|\s)*?(\"|\')/g)[0];
				sSrc = sSrc.substr(5,sSrc.length-6);
				script.src=sSrc;
			}else{
				var sJS = arr[i].replace(/<\/script>/g,'');
				sJS = sJS.replace(/<script.+?>/g,'');
				sJS = sJS.replace(/<script>/g,'');
				script.text=sJS;
			};
			head.appendChild(script);
		};
	};
	//[Func] 将IMG的src转为支持IE6的src（处理PNG）
	jt.FixImgPngSrc = function (src,sType){
		return ((jt.bIE6) && (/\.png/i.test(src))) ? (jt.Path + 'jtThemes/t.gif" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''+src+'\', sizingmethod='+jt.getDefVal(sType,'crop')+');') : src;
	};

	if (!window._jt_Window_zIndex) window._jt_Window_zIndex = 10100;
}
)();


/*<desc>提供各种常用函数</desc>*/
jt.PluginList.push('jt_util');
jt.jt_util = {};
jt.jt_util.TagName = [];

//[Func] 将utf8转为GBK|||注:js引擎内码是unicode，所以通过encodeURI(str)进行URL编码的时候均属utf8编码，本函数将utf8转为GBK
jt.gb2312 = function (key) {
	var r = "";
	for (var i=0; i<key.length; i++){
		var t = key.charCodeAt(i);
		if(t>=0x4e00 || t==0x300A || t==0x300B){
			try{ execScript("ascCode=hex(asc(\""+key.charAt(i)+"\"))", "vbscript"); r += ascCode.replace(/(.{2})/g, "%$1");  }catch(e){};
		}else{
			r += escape(key.charAt(i));
		};
	};
	return r;
};

//[Func] Form中的元素转JSON，方便Ajax提交
jt.Form2Json = function (aForm){
	var jPost={};
	for(var i=0;i<aForm.elements.length;i++){
		var obj=aForm.elements[i];
		if ((obj.name=='') || (obj.disabled) ) continue;
		if (jt.getAttr(obj,'NotSubmit',false)) continue;
		var bCheckBox=false;
		if (/input/i.test(obj.nodeName)) {
			if (obj.type=='checkbox') {
				if (!obj.checked) continue;
				bCheckBox=true;
			};
			if ( (obj.type=='radio') && (!obj.checked) ) continue;
		};
		/*
		if (bCheckBox) {
			if (typeof(jPost[encodeURIComponent(obj.name)])!='undefined') continue;
			jPost[encodeURIComponent(obj.name)]= jt.getCheckBoxValue(obj.name,true,false,true);
		}else{
			jPost[encodeURIComponent(obj.name)] = encodeURIComponent(obj.value);
		};
		*/
		if (bCheckBox) {
			if (typeof(jPost[obj.name])!='undefined') continue;
			jPost[obj.name]= jt.getCheckBoxValue(obj.name,true,false,true);
		}else{
			jPost[obj.name] = obj.value;
		};
	};
	return jPost;
};


//[Func] 对象、字串是否为空
jt.isEmpty = function (o) {
	if (typeof(o) == 'undefined') return true;
	if (o=='') return;
	return false;
};


//[Func] CheckBox 全选
jt.selectAll = function (sName,bCheck) {
	var objs=document.getElementsByName(sName);
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].disabled) continue;
		objs[i].checked = bCheck;
	};
};

//[Func] 获取radio的值
jt.getRadioValue = function (sRadioName){
	var objs=document.getElementsByName(sRadioName);
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].checked) return objs[i].value;
	};
	return '';
};

//[Func] 获取CheckBox的值，（当bString为false时返回数组[默认],为true时返回以逗号(,)隔开的字符串）
jt.getCheckBoxValue = function (sCheckBoxName,bString,bFilterEmpty,bEncode){
	var arr=[]; var sRet=''; bString=jt.getDefVal(bString,false); bFilterEmpty=jt.getDefVal(bFilterEmpty,false); bEncode=jt.getDefVal(bEncode,false);
	var objs=document.getElementsByName(sCheckBoxName);
    for (var i = 0; i < objs.length; i++) {
		if (objs[i].checked) {
			if ((bFilterEmpty)&&(objs[i].value=='')) continue;
			if (bString){
				if (sRet!='') sRet+=',';
				if (bEncode){
					sRet += encodeURIComponent(objs[i].value);
				}else{
					sRet += objs[i].value;
				};
			}else{
				arr.push(objs[i].value);
			};
		};
	};
	return bString?sRet:arr;
};

//[Func] 获取URL中的Hash参数
jt.getHash=function(sParam,defValue){
	var strTem=window.location.hash.substr(1);
	if(strTem.indexOf(sParam)==-1) return defValue;
	return jt.getValueFromKeyValue(strTem,sParam,'&');
};
//[Func] 设置URL中的Hash参数
jt.setHash=function(sParam,sValue){
	var sHash=window.location.hash.substr(1);
	var reg = new RegExp('(^|&)' + sParam + '=([^&]*)(&|$)','i');
	var r = sHash.match(reg);
	if (r!=null){
		sHash = sHash.replace(r[0], r[1]+sParam+'='+sValue+r[3]);
	}else{
		sHash += ((sHash=='')?'':'&') + sParam + '=' + sValue;
	};
	self.location.hash=jt.xssFilter(sHash);
};

//[Func] 在指定的已有子节点之后插入新的子节点。
jt.insertAfter = function (newElement,targetElement) {
	var par = targetElement.parentNode;
	if(par.lastChild==targetElement){
		par.appendChild(newElement);
  }else{
		par.insertBefore(newElement,targetElement.nextSibling);
	};
};

//[Func] <em>Date扩展方法</em> 字串转日期型
Date.fromString = function (sDate){
	var strTem=sDate.replace(/-|年|月|日|(\/\/)/g,'/').replace(/\/ /g,' ');
	return new Date(strTem);
};

//[Func] <em>Date扩展方法</em> 格式化日期，将 Date 转化为指定格式的String ||| <code> (new Date()).format("yyyy-MM-dd HH:MI:SS")==> 2006-07-02 08:09:04||| (new Date()).format("yyyy-MM-dd WW HH:MI:SS") ==> 2009-03-10 星期二 08:09:04</code>
Date.prototype.format=function(sFmt) {
	var strTem='';
	var sResult=sFmt;

	sResult = sResult.replace(/yyyy/ig,this.getFullYear().toString());
	sResult = sResult.replace(/yy/ig,this.getFullYear().toString().substr(2));

	strTem = (this.getMonth()+1).toString();
	sResult = sResult.replace(/mm/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/MM/g,strTem);

	strTem = this.getDate().toString();
	sResult = sResult.replace(/dd/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/DD/g,strTem);

	strTem = this.getHours().toString();
	sResult = sResult.replace(/hh/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/HH/g,strTem);

	strTem = this.getMinutes().toString();
	sResult = sResult.replace(/mi/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/MI/g,strTem);

	strTem = this.getSeconds().toString();
	sResult = sResult.replace(/ss/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/SS/g,strTem);

	strTem = ["日", "一", "二","三","四", "五","六"][this.getDay()];
	sResult = sResult.replace(/ww/g,strTem);
	strTem = ["星期日", "星期一", "星期二","星期三","星期四", "星期五","星期六"][this.getDay()];
	sResult = sResult.replace(/WW/g,strTem);

	return sResult;
};

//[Func] 时间个性化|||1、< 60s, 显示为“刚刚”|||2、>= 1min && < 60 min, 显示与当前时间差“XX分钟前”|||3、>= 60min && < 1day, 显示与当前时间差“今天 XX:XX”|||4、>= 1day && < 1year, 显示日期“XX月XX日 XX:XX”|||5、>= 1year, 显示具体日期“XXXX年XX月XX日 XX:XX”
jt.formatTime = function (time) {
	var date = new Date(time),
			curDate = new Date(),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			curYear = curDate.getFullYear(),
			curHour = curDate.getHours(),
			timeStr;
	if(year < curYear){
		timeStr = date.format('yyyy-MM-DD HH:MI');// year +'年'+ month +'月'+ day +'日 '+ hour +':'+ minute;
	}else{
		var pastTime = curDate - date,
				pastH = pastTime/3600000;
		if(pastH > curHour){
			timeStr = date.format('MM-DD HH:MI');//month +'月'+ day +'日 '+ hour +':'+ minute;
		}else if(pastH >= 1){
			timeStr = date.format('今天 HH:MI');//'今天 ' + hour +':'+ minute +'分';
		}else{
			var pastM = curDate.getMinutes() - minute;
			if(pastM > 1){
				timeStr = pastM +'分钟前';
			}else{
				timeStr = '刚刚';
			};
		};
	};
	return timeStr;
};

/**
 * 代码编辑器
 * 采用第三方组件：<a href="http://codemirror.net/" target="_blank">CodeMirror 5.25.0</a> (<a href="http://www.hyjiacan.com/category/trans/codemirror-doc/" target="_blank">中文说明</a>) <br> 低版本浏览器(IE8以下) 不支持代码编辑器
 * @require Extend/CodeFormat.js,ThirdParty/CodeMirror
 * @TagName textarea
 * @desc 代码编辑器
 */
(function(jUI){
	jUI.PluginList.push('CodeEditor');
	jUI.CodeEditor = { TagName:['textarea'], RequirePlugin:[] };

	jUI.CodeEditor.FormatUI = function (elem) {
		var me=jUI(elem);
		var sURL_CodeMirror = jUI.Path_ThirdParty + 'CodeMirror/';

		var IFrame=null; //IFrame对象
		var IFrame_Win=null; //IFrame对象
		var Editor=null; //编辑器对象

		//编辑器参数
		var option={
			readOnly: elem.readOnly,
			//[Attr:elem.TabSize] tab字符的宽度 (默认2)
			tabSize: me.getAttr('TabSize',2),
			//[Attr:elem.Theme] 代码样式 @eg  jUI.log(jUI.CodeEditor.ThemeList,10); //列举支持样式
			theme: me.getAttr('Theme','default'),
			//[Attr:elem.LineNumber] 显示行号 (默认true)
			lineNumbers: me.getAttr('LineNumber',true),
			//[Attr:elem.Wrap] 自动换行 (默认true)
			lineWrapping: me.getAttr('Wrap',true),
			//[Attr:elem.IndentWithTabs] 在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符 (默认true)
			indentWithTabs: false,
			//[Attr:elem.HighLightActiveLine] 高亮当前行 (默认true)
			styleActiveLine: me.getAttr('HighLightActiveLine',true)
		}
			//CodeMirror无法自动将键盘输入的Tab转成空格
		option.indentUnit = option.tabSize;
		option.tabMode = option.indentWithTabs?'indent':'spaces';

	//	var iCMLineHeight=16;

		//[Attr:elem.Syntax] 语法(为空时自动检测) @eg  jUI.each(CodeMirror.modeInfo,function(idx,item){ jUI.log(item.name,15) }); //列举支持语法
		var sSyntax;

		//if (jt.isCrossDomain(jt.Path)) EditorType=etCM; //跨域时使用CodeMirror

		//[Func] 获取编辑器对象（CodeMirror）
		elem.getEditor = function(){ return Editor; };

		//[Func] 获取编辑器所在的 IFrame 对象（CodeMirror）
		elem.getIFrame = function(){ return IFrame_Win; };

		//[Func] 获取编辑器支持的语法列表
		elem.getSyntaxList = function(){ return IFrame_Win?IFrame_Win.CodeMirror.modeInfo:[]; };

		//[Func] 获取编辑器支持的语法列表
		elem.getThemeList = function(){ return IFrame_Win?IFrame_Win.arrThemeList:[]; };

		//[Func] 编辑器刷新。
		elem.refresh = function(){ if (Editor) { Editor.refresh(); } };

		//[Func] 获取当前编辑器的内容。
		elem.getValue = function(){
			try{ return Editor ? Editor.getValue() : elem.value; }catch(e){
				jUI.log('CodeEditor.getValue Error.');
			}
			return elem.value;
		};

		//[Func] 设置编辑器的内容。
		elem.setValue = function(value){
			elem.value = value;
			if (Editor) { Editor.setValue(value); }
		};

		//[Func] 设置编辑器大小。 (width, height 为数字型,也可以为字符 '100%' 'auto',   0为不改变)
		elem.setSize = function(width, height){
			me.width(width); me.height(height);
			if (IFrame) { jUI(IFrame).width(width); jUI(IFrame).height(height); }
		};

		//[Func] 格式化代码
		elem.formatCode = function(){
			var sURL=jUI.Path_Extend+'CodeFormat.js';
			jUI.loadThirdParty( 'FormatCode', sURL, function(isSucc,arrResult){
				var indent_char='\t';
                if (!option.indentWithTabs) indent_char = '                '.substr(0, option.tabSize);
				var sCode = FormatCode(elem.getValue(),sSyntax,indent_char);
				elem.setValue(sCode);
			});
		};

		//[Func] 设置代码样式。
		elem.setTheme = function(strTheme){
			option.theme = strTheme;
			if (IFrame_Win) IFrame_Win.setTheme(strTheme);
		};

		//[Func] 设置语言
		elem.setSyntax = function(strSyntax){
			sSyntax=strSyntax;
			if (IFrame_Win) IFrame_Win.setSyntax(strSyntax);
		}

		//自动检查语法
		function checkSyntax(sCode){
			sCode = sCode.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "" );
			var syn='javascript';
			if (/^\</i.test(sCode)) syn='html';
			if (/^select /i.test(sCode)) syn='sql';
			if (/^package /i.test(sCode)) syn='java';
			if (/^dim /i.test(sCode)) syn='vb';
			return syn;
		};

		elem.init = function(){
			sSyntax=me.getAttr('Syntax').toLowerCase();
			if (sSyntax=='') sSyntax=checkSyntax(elem.value); //当语法为空时自动检测
			if (sSyntax=='js') sSyntax='javascript';

			if ( jUI.browser.msie && jUI.browser.documentMode<8) { return; } //IE8 以下模式不支持编辑器

			var iW=elem.style.width||elem.offsetWidth;
			var iH=elem.style.height||elem.offsetHeight;
			var temFrame = jUI('<iframe class="CodeEditor" style="width:'+iW+'; height:'+iH+'" src="'+sURL_CodeMirror+'editor.htm" frameborder="0"></iframe>');
			IFrame = temFrame[0];
			IFrame.option = option;
			IFrame.inited = function(win){
				IFrame_Win=win;
				Editor = IFrame_Win.Editor;
				IFrame_Win.jUI.loadCSS(IFrame_Win.jUI.Path_Themes + jUI.Theme+'/CodeEditor/css.css');
				//Editor.setSize('100%','100%');
				Editor.setValue(elem.value);
				Editor.on("change", function(cm) {
					elem.value = Editor.getValue();
				});
				//log(elem.setSyntax)
				elem.setSyntax(sSyntax);

				if (option.theme!='default') { elem.setTheme(option.theme); }
				//[Event] 代码编辑器初始化完成后触发 @param {Element} 编辑器组件 @param {Object} editor CodeMirror编辑器对象
				if(typeof(jUI_CodeEditor_AfterInited)=='function') jUI_CodeEditor_AfterInited(elem,Editor);
			}

			temFrame.insertBefore(elem);
			//IFrame.width(elem.style.width||elem.offsetWidth)
//			IFrame.height(elem.style.height||elem.offsetWidth)
//			debugger;
//			IFrame.style.width = elem.style.width||elem.offsetWidth;
//			IFrame.style.height = elem.style.height||elem.offsetWidth;
			elem.style.display = 'none';
		}

		elem.init();

		//jUI.addEvent(window,'unload',function(){ jUI(divPar).remove(); });
	};

})(jt);

/*<desc>在线编辑器<br>采用第三方组件 <a href="http://kindeditor.net" target="_blank">KindEditor</a></desc>*/
jt.PluginList.push('WebEditor');
jt.WebEditor = {};
jt.WebEditor.TagName = ['textarea'];


jt.WebEditor.FormatUI = function (oCtl) {
	var sURL_KE = jt.Path+'jtThirdParty/KindEditor/';
	//var sURL_KE = 'http://oa.gap.com.cn/~Witson/gap/gap-parent/jt/jt/jtThirdParty/KindEditor/';
	var KEditor=null; //编辑器

    //[Const]
	jt.Const.CST_WE_TOOLBAR_00 = '';  //无工具栏
    //[Const]
	jt.Const.CST_WE_TOOLBAR_05 = 'bold,italic,underline,removeformat,|,insertorderedlist,insertunorderedlist';  //极简工具栏
	//[Const] 2
	jt.Const.CST_WE_TOOLBAR_10 = 'bold,italic,underline,removeformat,|,fontname,fontsize,forecolor,|,justifyleft,'+  //简单工具栏
			'justifycenter,justifyright,insertorderedlist,insertunorderedlist,|,image,link,|,fullscreen';
	//[Const] 2
	jt.Const.CST_WE_TOOLBAR_12 = 'fontname,fontsize,|,forecolor,hilitecolor,bold,italic,underline,removeformat,|,'+  //简单工具栏1
			'justifyleft,justifycenter,justifyright,insertorderedlist,insertunorderedlist,|,image,link';
	//[Const] 2
	jt.Const.CST_WE_TOOLBAR_15 = 'fontname,fontsize,|,forecolor,hilitecolor,bold,italic,underline,removeformat,|,'+  //简单工具栏2
			'justifyleft,justifycenter,justifyright,insertorderedlist,insertunorderedlist,|,emoticons,image,link,|,fullscreen';
	//[Const] 5
	jt.Const.CST_WE_TOOLBAR_20 = 'source,|,undo,redo,|,preview,print,template,code,cut,copy,paste,plainpaste,'+  //标准工具栏
			'wordpaste,|,justifyleft,justifycenter,justifyright,justifyfull,insertorderedlist,insertunorderedlist,indent,'+
			'outdent,subscript,superscript,clearhtml,quickformat,selectall,|,fullscreen,/,formatblock,fontname,fontsize,|,'+
			'forecolor,hilitecolor,bold,italic,underline,strikethrough,lineheight,removeformat,|,image,multiimage,flash,'+
			'media,insertfile,table,hr,emoticons,baidumap,pagebreak,anchor,link,unlink';

	//[Func] 获取CodeMirror编辑器对象。CodeMirror 的详细操作详见 <a href="http://kindeditor.net" target="_blank">http://kindeditor.net</a>
	oCtl.getKEditor = function(){ return KEditor; };

	//[Func] 获取当前编辑器的内容。可以传入可选参数来指定行分隔符（默认为 \n）
	oCtl.getValue = function(){
		if (KEditor) { var str=KEditor.html(); oCtl.value=str; return str; };
		return oCtl.value;
	};

	//[Func] 设置编辑器的内容。
	oCtl.setValue = function(value){
		oCtl.value = value;
		if (KEditor) KEditor.html(value);
	};

	//[Func] 将指定的HTML内容插入到编辑区域里的光标处。
	oCtl.insertHtml = function(value){
		if (!KEditor) return;
		KEditor.insertHtml(value);
		KEditor.sync();
		//oCtl.value = KEditor.html();
	};

	//[Func] 将指定的HTML内容添加到编辑区域的最后位置。
	oCtl.appendHtml = function(value){
		if (!KEditor) return;
		KEditor.appendHtml(value);
		KEditor.sync();
		//oCtl.value = KEditor.html();
	};

	//[Func] 执行编辑命令，替代document.execCommmand接口。
	oCtl.exec = function(commandName){ if (KEditor) { KEditor.exec(commandName); } };

	//[Func] 动态加载插件。
	oCtl.loadPlugin = function(name, fn){ if (KEditor) { KEditor.exec(name, fn); } };



//	//[Func] 设置编辑器大小。 (width, height 为数字型,也可以为字符 '100%' 'auto',   0为不改变)
//	oCtl.setSize = function(width, height){
//		if (typeof(width)=='string') oDiv.style.width = width;
//		if (typeof(height)=='string') oDiv.style.height = height;
//		if ((typeof(width)=='number') && (width>0)) oDiv.style.width = width+'px';
//		if ((typeof(height)=='number') && (height>0)) oDiv.style.height = height+'px';
//	};

	//加载CodeMirror
	function loadKindEditor(callback){
		if (typeof(window.KindEditor)=='function'){
			callback();
			return;
		}
		//jt.appendCSS( jt.get(sURL_KE+'themes/default/default.css', null, false) );
		jt.loadCSS(sURL_KE+'themes/default/default.css');
		//jt.appendJS( jt.get(sURL_KE + 'kindeditor.js', null, false) );
		jt.loadJS(sURL_KE + 'kindeditor.js',callback); //解决跨域问题
	};


    //[Func] 组件初始化
	oCtl.init = function(){
		loadKindEditor(function (){
			//[Attr] Options###编辑器初始化参数, 格式:JSON格式字符串 如 {allowFileManager:true}
			var sOpt=jt.getAttr(oCtl,'options','{}');
			var opt = { allowFileManager:true, basePath:sURL_KE };
			try{ opt=jt.Str2Json(sOpt); }catch(e){}
			if (typeof(opt.allowFileManager)=='undefined') opt.allowFileManager=true;
			if (typeof(opt.basePath)=='undefined') opt.basePath=sURL_KE;
			//alert(jt.Obj2Str(opt))

			//[Attr] Toolbar###辑器工具栏，其中”/”表示换行，”|”表示分隔符。 <a href="javascript:ShowHideNext(_('#divCommentConst'));void(0);">详细参见常量表</a>
			var sItems=jt.getAttr(oCtl,'Toolbar','{CST_WE_TOOLBAR_15}');
			for (var i=0;i<40;i++){
				try{
					var sI=i.toString(); if (sI.length==1) sI='0'+sI;
					var varSty=eval('jt.Const.CST_WE_TOOLBAR_'+sI);
					var re = new RegExp('{CST_WE_TOOLBAR_'+sI+'}','ig');
					sItems = sItems.replace(re, varSty);
				}catch(e){};
			};
			opt.items = sItems.split(',');

			//## 2017/11/6
            //## linshengxiong
			//## 隐藏上传相关图标
			var arr = 'image,image,multiimage,flash,media,insertfile,baidumap';
			jt.each(arr.split(','),function(idx,val){
				if(jt.inArray(val,opt.items) == -1) return;
				opt.items.splice(jt.inArray(val,opt.items),1);
			});
			//[Attr] ResizeType###可否改变大小(默认1)2或1或0，2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动。
			opt.resizeType = jt.getAttr(oCtl,'ResizeType',1);
			//[Attr] Dialog###当编辑器存在于页面iframe内,解决IE8下透明穿透问题。
			opt.dialog = jt.getAttr(oCtl,'Dialog',true);

//			uploadJson : '../jsp/upload_json.jsp',
//			fileManagerJson : '../jsp/file_manager_json.jsp',
//			allowFileManager : true,


			opt.afterChange = function(){
				if (KEditor){
					KEditor.sync();
					if (oCtl.onchange) oCtl.onchange();
				}
			};


			if ( document.addEventListener && jt.FormatUIed ) {
				KindEditor._readyFinished=true;
			};
			KindEditor.ready(function(K) {
				KEditor = K.create(oCtl, opt );
				if (oCtl.readOnly) KEditor.readonly(true);
			});
		});
	};

	oCtl.init();

	jt.addEvent(window,'onunload',function (){  //清除内存
		oCtl.init = null;
		oCtl.getCMEditor = null;
		oCtl.getValue = null;
		oCtl.setValue = null;
		oCtl.lineCount = null;
		oCtl.setSize = null;
		//oCtl.oDiv = null;
		//oDiv.parentNode.removeChild(oDiv);
	});
};





/**
 * 选择周
 * @require
 * @TagName div
 * @desc 选择周
 */
(function(jUI){
	jUI.PluginList.push('SelectWeek');
	jUI.SelectWeek = { TagName:['div'], RequirePlugin:[] };
	//获取周
Date.prototype.getWeekNumber = function() {
	var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var DoW = d.getDay();
	d.setDate(d.getDate() - (DoW + 6) % 7 + 6); // Nearest Thu
	var ms = d.valueOf(); // GMT
	d.setMonth(0);
	d.setDate(4); // Thu in Week 1
	return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};
	jUI.SelectWeek.FormatUI = function (oCtl) {
		var iShowDateDay;//是否显示日期

		//## 上一年
		oCtl.showPrevYear = function (){oCtl.Year--;oCtl.showWeek();}
		//##下一年
		oCtl.showNextYear = function (){oCtl.Year++;oCtl.showWeek();}
		//显示周
		oCtl.showWeek = function(){
			var sHTML = '';
			sHTML +='<table class="j_SelectWeek '+(iShowDateDay?'':' j_SelectWeek_NotDateDay')+'" border=0 cellSpacing=0 cellPadding=2>';
			var strTem='this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode';
			sHTML+='<tr>';
			sHTML+='	<td>';
			sHTML +='		<table class="j_SelectWeek_Top" width="100%" border="0" cellpadding="0" cellspacing="0">';
			sHTML +=			'<tr>';
			sHTML +=				'<td class="j_SelectWeek_PrevYear" onclick="'+strTem+'.showPrevYear()"></td>';
			sHTML +=				'<td width="20%"></td>';
			sHTML +=				'<td align=center >'+oCtl.Year+'年</td>';
			sHTML +=				'<td width="20%"></td>';
			sHTML +=				'<td class="j_SelectWeek_NextYear" onclick="'+strTem+'.showNextYear()"></td>';
			sHTML +=			'</tr>';
			sHTML +=		'</table>';
			sHTML+='	</td>';
			sHTML+='</tr>';
			sHTML+='<tr>';
			sHTML+='	<td>';
			sHTML +='		<table class="j_SelectWeek_body" border=0 cellSpacing=0 cellPadding=0>';
			sHTML+='			<tr>';
			sHTML+='				<td class="j_SelectWeek_Head" >月<td><td class="j_SelectWeek_Head" ColSpan=5 >周<td>';
			sHTML+='			</tr>';
								for(var i=1;i<=12;i++){
									sHTML+='<tr onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" >';
									sHTML+='		<td class="j_SelectWeek_Left" >'+i+'<td>';
									sHTML+=			oCtl.showWeekNode(i);
									sHTML+='</tr>';
								}
			sHTML +='		</table>';
			sHTML+='	</td>';
			sHTML+='</tr>';
			sHTML +='</table>';
			oCtl.innerHTML = sHTML;//末尾插入
		}
		//显示每月周数据
		oCtl.showWeekNode = function (Month){
			var oDate = Date.fromString(oCtl.Year+'-'+Month+'-1');//设置时间当前月的第一天
			var sDay = oDate.getDay();//获取当前星期X
			if(sDay==0) sDay = 7;
			if(Month==1||sDay==1) oDate.setTime(oDate.getTime()-24*60*60*1000*(sDay-1)); //第一周第一天
			else oDate.setTime(oDate.getTime()+24*60*60*1000*(8-sDay));//第一周第一天
			var html = '';
			for(var i=0;i<5;i++){
				if(!(oDate.getMonth()+1<=Month && oDate.getFullYear()<=oCtl.Year)&&(Month!=1&&oDate.getMonth()!=11)){
					html+='<td></td>';
					continue;
				}
				var jsonItem = {};
				jsonItem.BeginDay = oDate.getDate();
				jsonItem.BeginDate = oDate.format('yyyy-mm-dd');
				oDate.setTime(oDate.getTime()+24*60*60*1000*6);//本周最后一天
				jsonItem.EndDay = oDate.getDate();
				jsonItem.EndDate = oDate.format('yyyy-mm-dd');
				jsonItem.Week = oDate.getWeekNumber();
				jsonItem.Css = 'j_SelectWeek_Node';
				if(Month=='12' && jsonItem.Week =='1'){//特殊处理最后一周为1的情况
					oDate.setTime(oDate.getTime()-24*60*60*1000*7);
					jsonItem.Week = oDate.getWeekNumber()+1;
				}
				if(jsonItem.Week == oCtl._Date.getWeekNumber() && oCtl.Year==oCtl._Date.getFullYear()) jsonItem.Css+=' j_SelectWeek_ToWeek';//本周
				if(jsonItem.Week == oCtl.Date_Week && oCtl.Year==oCtl.Date_Year) jsonItem.Css+=' j_SelectWeek_CurWeek';//本周
				//[Func] 处理周的每项显示 (周显示的时候触发)|||本函数提供如下接管函数：|||<code>jInitWeekDataItem(oCtl,jsonItem)</code>
				if(typeof(jInitWeekDataItem)=='function') jInitWeekDataItem(oCtl,jsonItem);
				html+='<td class="'+jsonItem.Css+'" title="'+jsonItem.BeginDate+'至'+jsonItem.EndDate+'" Week="'+jsonItem.Week+'" Date="'+jsonItem.BeginDate+'至'+jsonItem.EndDate+'" onmouseover="this.style.backgroundColor=\'#E0E0E0\'" onmouseout="this.style.backgroundColor=\'\'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.selectWeek(this)" >';
				html+='<span class="j_SelectWeek_Node_Week" >'+jsonItem.Week+'</span>';
				if(iShowDateDay) html+= '<span class="j_SelectWeek_Node_Day">'+jsonItem.BeginDay+'~'+jsonItem.EndDay+'</span>';
				html+='</td>';
				oDate.setTime(oDate.getTime()+24*60*60*1000);//第下周第一天
			}
			return html;
		}
		//点击具体周
		oCtl.selectWeek = function (oNode){
			var str = jt.attr(oNode,'Date');
			oCtl.Date_Str = str;
			oCtl.Date_Week = jt.attr(oNode,'Week');
			oCtl.Date_Year = oCtl.Year;
			jt.evalAttr(oCtl,'AfterSelectWeek',oCtl.Date_Str);
			//[Func] 点击选择周 |||本函数提供如下接管函数：|||<code>jSelectWeek (oNode) </code>页面可实现此方法,点击具体周完后将触发
			if(typeof(jSelectWeek)=='function') jSelectWeek(oNode,str);
		}
		oCtl.init = function(){
			iDateTime = jt.getAttr(oCtl,'Date');
			iShowDateDay = jt.getAttr(oCtl,'ShowDateDay',true);
			if (typeof(iDateTime)=='string') oCtl._Date = (iDateTime=='')?(new Date()):Date.fromString(iDateTime);
            else oCtl._Date = iDateTime;
			oCtl.Year = oCtl._Date.getFullYear();
			oCtl.showWeek();
		}
		oCtl.init();
	};

})(jt);
/*<desc>
日期时间选择
</desc>*/
////TODO: 缺少跳转到"今天"
////TODO: 缺少标题下拉直接跳转到某年\某月
Date._MD = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
//字串转日期型
Date.fromString = function (sDate){ return new Date(sDate.replace(/-|\.|年|月|日|(\/\/)/g,'/').replace(/\/ /g,' ').replace(/\/$/g,'')); };
//获取月份的总天数
Date.prototype.getMonthDays = function(month) {
	var year = this.getFullYear(); month = jt.getDefVal(month,this.getMonth());
	if (((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) && month == 1) return 29;
	return Date._MD[month];
};
//获取一年的天数
Date.prototype.getDayOfYear = function() {
	var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
	var time = now - then;
	return Math.floor(time / Date.DAY);
};
//获取周
Date.prototype.getWeekNumber = function() {
	var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var DoW = d.getDay();
	d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
	var ms = d.valueOf(); // GMT
	d.setMonth(0);
	d.setDate(4); // Thu in Week 1
	return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};
//加减天
Date.prototype.addDate = function (iDay) { return new Date(this.valueOf() + iDay * 24 * 60 * 60 * 1000); };
// 格式化日期
Date.prototype.format = function(sFmt){
	//yyyy mm dd hh MI ss ww
	var strTem='';
	var sResult=sFmt;

	sResult = sResult.replace(/yyyy/ig,this.getFullYear().toString());
	sResult = sResult.replace(/yy/ig,this.getFullYear().toString().substr(2));

	strTem = (this.getMonth()+1).toString();
	sResult = sResult.replace(/mm/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/MM/g,strTem);

	strTem = this.getDate().toString();
	sResult = sResult.replace(/dd/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/DD/g,strTem);

	strTem = this.getHours().toString();
	sResult = sResult.replace(/hh/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/HH/g,strTem);

	strTem = this.getMinutes().toString();
	sResult = sResult.replace(/mi/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/MI/g,strTem);

	strTem = this.getSeconds().toString();
	sResult = sResult.replace(/ss/g,strTem);
	if (strTem.length<2) strTem='0'+strTem;
	sResult = sResult.replace(/SS/g,strTem);

	strTem = ["日", "一", "二","三","四", "五","六"][this.getDay()];
	sResult = sResult.replace(/ww/g,strTem);
	strTem = ["星期日", "星期一", "星期二","星期三","星期四", "星期五","星期六"][this.getDay()];
	sResult = sResult.replace(/WW/g,strTem);

	return sResult;
};


jt.PluginList.push('DateTime');
jt.DateTime = {};
jt.DateTime.TagName = ['div'];




jt.DateTime.FormatUI = function (oCtl) {
	var iShowTime=false;
	var bShowWeek=true;
	var bMondayFirst=false;
	var iShowTimeType;
	var iSelectRange;
	var iOnlyYM = false;//只有年月选择
	var myDate = new Date();//当前时间，日期型
	var _today = myDate.toLocaleString();//今天
	var _showToday=false;
	var HourDiv;//用于存放小时的DIV
	var MinDiv;//用于存放小时的DIV
	var select_HH=myDate.getHours();
	var select_MI=myDate.getMinutes();
	var iLoadShow = false;

	oCtl.setHourMin = function(h,m){if(h) select_HH = h;if(m) select_MI = m;}
	//[Func ] 显示上一年
	oCtl.showPrevYear = function(){oCtl.yearShow--; oCtl.showDate();};
	//[Func ] 显示下一年
	oCtl.showNextYear = function(){oCtl.yearShow++; oCtl.showDate();};
	//[Func ] 显示上一月
	oCtl.showPrevMonth = function(){
		oCtl.monthShow--; if (oCtl.monthShow<1) {oCtl.monthShow=12; oCtl.yearShow--;};
		oCtl.showDate();
	};
	//[Func ] 显示下一月
	oCtl.showNextMonth = function(){
		oCtl.monthShow++; if (oCtl.monthShow>12) {oCtl.monthShow=1; oCtl.yearShow++;};
		oCtl.showDate();
	};
	//年、月份选择
	oCtl.selectYearPrev = function(SetDateYear,e){
		if(e==0) SetDateYear = SetDateYear-10;
		if(e==1) SetDateYear = SetDateYear+10;
		oCtl.showSetDate(SetDateYear);
	};
	oCtl.showSetDate=function(SetDateYear,setedYear){
		var sHTML='';
		if(setedYear==null) setedYear = oCtl.yearShow;
		var strSet='this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode';
		sHTML +='<table class="jt_xiaodaoSeletDate" width="238px" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=	'<tr >';
		sHTML +=		'<td width="50%" align="center" style="border-right:#ccc 1px solid;">';
		sHTML +=				'<div class="jt_DateTime_btnLeft" onclick="'+strSet+'.selectYearPrev('+SetDateYear+',0)"></div>';
		sHTML +=				'<div class="jt_DateTime_btnRight" onclick="'+strSet+'.selectYearPrev('+SetDateYear+',1)"></div>';
								for(i=SetDateYear-SetDateYear%10;i<SetDateYear+10-SetDateYear%10;i++){
									i==setedYear?sHTML +='<div class="jt_YearSelect_current" onclick="'+strSet+'.EidtDate(0,'+i+','+oCtl.monthShow+')">'+i+'</div>':sHTML +='<div class="jt_YearSelect" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" onclick="'+strSet+'.EidtDate(0,'+i+','+oCtl.monthShow+')">'+i+'</div>';
								};
		sHTML +=	    '</td>';
		sHTML +=		'<td width="50%" align="center"  style="padding-left:5px">';
								for(var i=1;i<13;i++){
									i==oCtl.monthShow?sHTML +='<div class="jt_YearSelect_current" onclick="'+strSet+'.EidtDate(0,'+oCtl.yearShow+','+i+')">'+i+'月</div>':sHTML +='<div class="jt_YearSelect" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" onclick="'+strSet+'.EidtDate(0,'+oCtl.yearShow+','+i+')">'+i+'月</div>';
								};
		sHTML +=	    '</td>';
		sHTML +=	'</tr>';
		sHTML +='</table>';
		oCtl.DateSelect.innerHTML = sHTML;
	};
	//[Func] funTimeJudge 动态变更时间可选区域
	oCtl.funTimeJudge = function(term){
		iSelectRange = term;
		oCtl.showDate();
	};
	//当只选择年月##年、月份选择
	oCtl.selectYearPrev2 = function(SetDateYear,e){
		if(e==0) SetDateYear = SetDateYear-10;
		if(e==1) SetDateYear = SetDateYear+10;
		oCtl.showOnlyYM(SetDateYear);
	};
	oCtl.selectOnlyY = function(year){
		oCtl.yearShow = year;
		oCtl.showOnlyYM();
		oCtl.selectOnlyYM();
	};
	oCtl.selectOnlyM = function(month){
		oCtl.monthShow = month;
		oCtl.showOnlyYM();
		oCtl.selectOnlyYM();
	};
	//[Func] 选择日期 (设置日期并触发事件)|||本函数提供如下接管函数：|||<code>jtAfterSelectDate (oCmp,tDate)</code> 选中日期后触发
	oCtl.selectOnlyYM = function(){
		oCtl._Date = Date.fromString(oCtl.yearShow+'-'+oCtl.monthShow+'-01');
		if (!iShowTime){
			jt.evalAttr(oCtl,'AfterSelectDate',oCtl.getDate());
			if(typeof(jtAfterSelectDate)=='function') jtAfterSelectDate(oCtl,oCtl.getDate());
		};
	};
	//[Func ]只显示年月
	oCtl.showOnlyYM = function(SetDateYear){
		var sHTML='';
		if(!SetDateYear) SetDateYear = oCtl.yearShow;
		var strSet='this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode';
		var sCss = 'jt_YearSelect';

		sHTML +='<table width="238px" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=	'<tr >';
		sHTML +=		'<td width="50%" align="center" style="border-right:#ccc 1px solid;">';
		sHTML +=				'<div class="jt_DateTime_btnLeft" onclick="'+strSet+'.selectYearPrev2('+SetDateYear+',0)"></div>';
		sHTML +=				'<div class="jt_DateTime_btnRight" onclick="'+strSet+'.selectYearPrev2('+SetDateYear+',1)"></div>';
								for(i=SetDateYear-SetDateYear%10;i<SetDateYear+10-SetDateYear%10;i++){
									if(i==oCtl.yearShow) sCss='jt_YearSelect_current'; else sCss = 'jt_YearSelect';

									sHTML +='<div class="'+sCss+'" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" onclick="'+strSet+'.selectOnlyY('+i+')">'+i+'</div>';
								};
		sHTML +=	    '</td>';
		sHTML +=		'<td width="50%" align="center"  style="padding-left:5px">';
								for(var i=1;i<13;i++){
									if(i==oCtl.monthShow) sCss='jt_YearSelect_current'; else sCss = 'jt_YearSelect';

									sHTML +='<div class="'+sCss+'" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" onclick="'+strSet+'.selectOnlyM('+i+')">'+i+'月</div>';
								};
		sHTML +=	    '</td>';
		sHTML +=	'</tr>';
		sHTML +='</table>';
		oCtl.oData.innerHTML = sHTML;
	};

	//[Func ]显示日历
	oCtl.showDate = function(){
		//只显示年月
		if(iOnlyYM){oCtl.showOnlyYM(oCtl.yearShow);return;};
		_showToday = oCtl.DateArea(_today);//是否不显示今天按钮
		var strTem='this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode';
        var sHTML = '';
		var YM_Style ='style="display:none" '; //
		sHTML +='<table class="DateTime_top" width="100%" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=	'<tr>';
		sHTML +=		'<td class="jt_DateTime_PrevYear" onclick="'+strTem+'.showPrevMonth()"></td>';
		sHTML +=		'<td width="20%"></td>';
		sHTML +=		'<td align="center" style="cursor:pointer" onclick="'+strTem+'.EidtDate(1)">'+oCtl.yearShow+'年'+oCtl.monthShow+'月</td>';//'+oCtl.yearShow+'年
		sHTML +=		'<td width="20%"></td>';
		sHTML +=		'<td class="jt_DateTime_NextYear" onclick="'+strTem+'.showNextMonth()"></td>';
		sHTML +=	'</tr>';
        sHTML += '<tr><td ' + YM_Style + '></td></tr>';//
		sHTML +='</table>';
		oCtl.oTitlePar.innerHTML = sHTML;
		oCtl.DateSelect=oCtl.oTitlePar.childNodes[0].rows[1].cells[0];
		oCtl.showSetDate(oCtl.yearShow);
		arrW=['日','一','二','三','四','五','六','日'];
		var sHTML='';
		//显示星期一、二、三
		sHTML += '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
		sHTML += '<tr>';
		sHTML += '<th style="'+(bShowWeek?'':'display:none;')+'">周</th>';// class="DateTimeLeft"
		for (i=0;i<7;i++){ sHTML += '<th>'+arrW[(bMondayFirst?1:0)+i]+'</th>';};
		sHTML += '</tr>';

		var ct=Date.fromString(oCtl.yearShow + '-' + oCtl.monthShow + '-1');
		ct = ct.addDate( - (ct.getDay()+(bMondayFirst?-1:0)) );
		if (ct>Date.fromString(oCtl.yearShow + '-' + oCtl.monthShow + '-1')) ct = ct.addDate(-7);
		var intRows=0;
		for (var ix = 0; ix < 60; ix++) {
			var otherMonth = (ct.getMonth()+1)!=oCtl.monthShow;//dt_cOtherMonth
			//重起一行
			if (ix%7==0) {
				intRows++;
				sHTML += '<tr align="center" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'">';
				sHTML += '<td class="DateTimeLeft" style="'+(bShowWeek?'':'display:none;')+'">' + ct.addDate(1).getWeekNumber() + '</td>';
			};
			var ct2String=ct.format('yyyy-mm-dd');
			var sCss='dt_cday';
			if (otherMonth) sCss+='dt_cOtherMonth';
			if (ct2String==oCtl._Date.format('yyyy-mm-dd')) sCss+='jt_DateTime_CurDay dt_cday';
			if (ct2String==(new Date()).format('yyyy-mm-dd')) sCss+='jt_DateTime_Today dt_cday';

			if (oCtl.DateArea(ct2String)) sCss='dt_cdaydt_cOtherMonth';//xiaodao

			sHTML += '<td class="'+sCss+'" Date="' + ct2String + '" ';
			//if(!otherMonth)
			if (!oCtl.DateArea(ct2String)) sHTML +=' onmouseover="this.style.backgroundColor=\'#E0E0E0\'" onmouseout="this.style.backgroundColor=\'\'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.selectDate(this)"';
			sHTML +='>';
			sHTML += ct.getDate();
            sHTML += '</td>';
			ct = ct.addDate(1);
			if (ix%7==6) {
				sHTML += '</tr>';
				if ((ct.getMonth()+1)!=oCtl.monthShow) break;
			};
		};
		sHTML += '</table>';
		oCtl.oData.innerHTML = sHTML;


        //时间
		if (iShowTime==false){
			if(!iShowNow) return;
            var sHTML = '';
			sHTML +='<table class="" width="100%" border="0" cellpadding="0" cellspacing="0">';
			sHTML +=	'<tr>';
			sHTML +=		'<td>';
			sHTML +=        myDate.toLocaleDateString();
			sHTML +=		'</td>';

			sHTML +=		'<td align="right">';
			sHTML +=			'<table  class="jt_DateTime_Hous" border="0" cellpadding="0" cellspacing="0">';
			sHTML +=				'<tr>';
			if(!_showToday) sHTML +=					'<td style="border-right:#e0e1e2 solid 1px"><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="今天" /></td>';
            sHTML += '<td style="border-right:#e0e1e2 solid 1px"><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="清空" /></td>';
			sHTML +=				'</tr>';
			sHTML +=			'</table>';
			sHTML +=		'</td>';
			sHTML +=	'</tr>';
			sHTML +='</table>';
			oCtl.oTime.innerHTML = sHTML;
			return;
		};

		var strTem_HH=oCtl._Date.format('HH');
		var strTem_MI=oCtl._Date.format('MI');
		var sHTML='';

				//时间选择类型
				if(iShowTimeType==1 || iShowTimeType==2){
                    var sHTML = '';
					sHTML +='<table class="" width="100%" border="0" cellpadding="0" cellspacing="0">';
					sHTML +=	'<tr>';
					sHTML +=		'<td>';
					sHTML +=        myDate.toLocaleDateString();
					sHTML +=		'</td>';
					sHTML +=		'<td align="right">';
					sHTML +=			'<table  class="jt_DateTime_Hous" border="0" cellpadding="0" cellspacing="0">';
					sHTML +=				'<tr>';
					if(iShowNow) sHTML +=					'<td style="border-right:#e0e1e2 solid 1px"><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="今天" /></td>';
                    sHTML += '<td style="border-right:#e0e1e2 solid 1px"><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="清空" /></td>';
					sHTML +=				'</tr>';
					sHTML +=			'</table>';
					sHTML +=		'</td>';
					sHTML +=	'</tr>';
					sHTML +='</table>';
					if(!HourDiv){
						var mDiv = document.createElement('div');
						oCtl.oTime.appendChild(mDiv);
						mDiv.innerHTML = sHTML;

						HourDiv = document.createElement('div');  //创建div
						HourDiv.style.position = 'relative';
						HourDiv.onmouseover = function(){HourDiv.style.display='';};

						if(iShowTimeType!=2){
							HourDiv.style.display = 'none';
							HourDiv.onmouseout= function(){HourDiv.style.display='none';}
						}
						oCtl.oTime.appendChild(HourDiv);
					}
					if(iShowTimeType==2){
						var sTD = jt('[date="'+oCtl._Date.format('yyyy-mm-dd')+'"]',oCtl)[0];
						if(sTD.offsetTop!=0) return;
						var sTD_Index = jt(sTD).index();
						var sTR_Index = jt(sTD.penterNode).index();
						var iTop = 24*sTR_Index-42;
						if(iTop>-7) iTop = -7;
						var iLeft = 24*(sTD_Index+1)+20;
						if(iLeft>171) iLeft = iLeft-80;
						HourDiv.style.top = iTop +'px';
						HourDiv.style.left = iLeft +'px';
					}

					if(!iLoadShow){
						iLoadShow=true;
						var _m_Data = oCtl.yearShow+'-'+oCtl.monthShow +'-'+oCtl._Date.getDate();
						jt('[Date="'+_m_Data+'"]',oCtl)[0].click();

					}

					return;
				}


		var iMinHours = 0;
		var iMaxHours = 24;
		var iMinMin = 0;
		var iMaxMin = 60;
		if(iSelectRange){
			var iElem = iSelectRange.split(',');//暂时只支持传一个区域控制
			if(iElem[0]=='before'){//之前不可选
				var pTime = Date.fromString(iElem[1]);
				iMinHours = pTime.getHours();
				if(parseInt(strTem_HH)<=iMinHours) iMinMin = pTime.getMinutes();//
				if(parseInt(strTem_MI)<pTime.getMinutes()) iMinHours++;
			}else{
				var pTime = Date.fromString(iElem[0]);
				iMaxHours = pTime.getHours();
				if(parseInt(strTem_HH)==iMaxHours) iMaxMin = pTime.getMinutes();
				iMaxHours++;
				if(parseInt(strTem_MI)>pTime.getMinutes()) iMaxHours--;
			};
		};
		sHTML +='<table class="" width="100%" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=	'<tr>';
		sHTML+=			'<td>';
		sHTML +=			'<table class="jt_DateTime_Hous" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=				'<tr>';
		sHTML+=						'<td align="center" style="width:30px;border-right:#e0e1e2 solid 1px">时间</td>';
		sHTML+=						'<td>';
		sHTML+=						'<input class="jt_DateTime_Timeleft" type="text" readonly="readonly" value="'+strTem_HH+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.showSelectTime(0)"/>:';
		sHTML+=						'<input class="jt_DateTime_Timeleft" type="text" readonly="readonly" value="'+strTem_MI+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.showSelectTime(1)"/>';
		sHTML +=					'</td>';
		sHTML +=				'</tr>';
		sHTML +=			'</table>';
		sHTML +=		'</td>';
		sHTML +=		'<td align="right">';
		sHTML +=			'<table  class="jt_DateTime_Hous" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=				'<tr>';
		sHTML +=					'<td style="border-right:#e0e1e2 solid 1px"><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="清空" /></td>';
		if(!_showToday) sHTML +=					'<td style="border-right:#e0e1e2 solid 1px"><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="今天"/></td>';
		sHTML +=					'<td><input class="jt_DateTime_but" type="submit" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.confirm(this)" value="确定"/></td>';
		sHTML +=				'</tr>';
		sHTML +=			'</table>';
		sHTML +=		'</td>';
		sHTML +=	'</tr>';
		sHTML +='</table>';
		oCtl.oTime.innerHTML = sHTML;

		HourDiv = document.createElement('div');  //创建div
		MinDiv = document.createElement('div');  //创建div
		HourDiv.style.position = 'relative';
		MinDiv.style.position = 'relative';
		HourDiv.style.display = 'none';
		HourDiv.onmouseover = function(){HourDiv.style.display='';};
		HourDiv.onmouseout= function(){HourDiv.style.display='none';};
		MinDiv.style.display = 'none';
		MinDiv.onmouseover = function(){MinDiv.style.display='';};
		MinDiv.onmouseout= function(){MinDiv.style.display='none';};

		oCtl.oTime.appendChild(HourDiv);
		oCtl.oTime.appendChild(MinDiv);
		oCtl.LoadHour(iMinHours,iMaxHours);
		oCtl.LoadMin(iMinMin,iMaxMin);
	};
	//显示小时
	oCtl.LoadHour = function(iMinHours,iMaxHours){
		var HTML='';
		HTML +='<div class="jt_xiaodaoHous" width="100%" >';
		for(var i=iMinHours;i<iMaxHours;i++){
			HTML +=		'<div onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" time="'+i+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.selectTime(this,0)">'+i+'</div>';
		};
		HTML +='</div>';
		HourDiv.innerHTML = HTML;
	};
	//显示分钟
	oCtl.LoadMin = function(iMinMin,iMaxMin){
		var HTML='';
		HTML +='<div class="jt_xiaodaoMouth" width="100%">';
		//HTML +='<div class="jt_xiaodaoMouth" width="100%" >';
		//debugger;
		for(var i=iMinMin;i<iMaxMin;i++){
			//if(i!=0 && i%iShowTimeType!=0) continue;
			HTML +=		'<div onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" time="'+i+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.selectTime(this,1)">'+i+'</div>';
		};
		HTML +='</div>';
		MinDiv.innerHTML = HTML;
	};

	//不可选范围
	oCtl.DateArea = function(ct2String){
		if(!iSelectRange) return false;
		//var iSelectRange = jt.getAttr(oCtl,'SelectRange');
		var CannotDate = new Array;//iSelectRange
		var Can = false;
		CannotDate = iSelectRange.split(";");
		for(var j=0;j<CannotDate.length;j++){
			CannotDate[j] = CannotDate[j].split(",");
			if(CannotDate[j][0]=='before'){
				if(Date.fromString(ct2String+' 23:59:59')<Date.fromString(CannotDate[j][1]) ){Can=true;break;};
			};
			if(CannotDate[j][1]=="after"){
				if(Date.fromString(ct2String+' 00:00:00')>Date.fromString(CannotDate[j][0])){Can=true;break;};
			};
			if(Date.fromString(CannotDate[j][0])<Date.fromString(ct2String)){
				if(Date.fromString(ct2String+' 23:59:59')<Date.fromString(CannotDate[j][1])){Can=true;break;};
			};
		};
		return Can;
	};
	//年月选择
	oCtl.EidtDate= function(e,setedYear,setedMonth){
		if(e=="0"){
			oCtl.yearShow=setedYear;
			oCtl.monthShow=setedMonth;
			oCtl.DateSelect.style.display='none';
			oCtl.showDate();
		};
		if(e=="1") oCtl.DateSelect.style.display='';
        if (e == "2") {
			oCtl.DateSelect.style.display='none';
			oCtl.showDate();
		};
	};
	//显示小时、分钟选择MinDiv/HourDiv
	oCtl.showSelectTime = function(e){
		var iHeight;
		if(jt.IEVersion==5||jt.IEVersion==6||jt.IEVersion==7||jt.IEVersion==8||jt.IEVersion==9) iHeight = oCtl.oTime.clientHeight*2;
		else iHeight = oCtl.oTime.clientHeight;

		if(e){
			HourDiv.style.display = 'none';
			MinDiv.style.display = '';
			MinDiv.childNodes[0].style.bottom = iHeight+'px';
		}else{
			HourDiv.style.display = '';
			MinDiv.style.display = 'none';
			HourDiv.childNodes[0].style.bottom = iHeight+'px';
		};
	};

	oCtl._showSeltctTime2 = function(sDate){
		//debugger;
		if (jt.getAttr(sDate,'time','')!=''){
			var sTime = jt.getAttr(sDate,'time');
			oCtl._Date.setHours(sTime.split(':')[0]);
			oCtl._Date.setMinutes(sTime.split(':')[1]);
			sDate=jt.getAttr(sDate,'Date');
		}
			select_HH=oCtl._Date.getHours();
			select_MI=oCtl._Date.getMinutes();
			var HTML = '';
			HTML +='<div class="jt_xiaodaoHous" style="width:50px;" >';
			var iMMs = ['00','15','30','45'];
			var iMM = parseInt(select_MI/15);
			iMM=iMM-2;
			if(iMM<0){
				iMM = iMM+4
				select_HH--;
				if(select_HH<0) select_HH =23;
			}
			//debugger;
			HTML +=		'<div style="width:100%" Date="'+sDate+'" time="'+select_HH+':'+iMMs[iMM]+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode._showSeltctTime2(this,0)">︿</div>';
			for(var i=0;i<5;i++){
				var sHH = parseInt(select_HH)<10?'0'+parseInt(select_HH):select_HH;
				var iHH = sHH+':'+iMMs[iMM];
				iMM++;
				HTML +=		'<div style="width:100%" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'" time="'+iHH+'" onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.selectDateTime(this)">'+iHH+'</div>';
				if(iMM>3) {iMM =0;select_HH++	}
				if(select_HH>23) select_HH=0;
			};
			HTML +=		'<div style="width:100%" Date="'+sDate+'" time="'+iHH+'"  onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode._showSeltctTime2(this,0)">﹀</div>';
			HTML +='</div>';
			HourDiv.innerHTML = HTML;

	}
	//显示小时.分钟2
	oCtl.showSeltctTime2 = function(sDate){

		//[Attr] jtBeforeShowSeltctTime###显示时间之前重新处理时间
		if(typeof(jtBeforeShowDateTime)=='function'){
			var _sDate;
			if (typeof(sDate)=='object') _sDate=jt.getAttr(sDate,'Date');
			oCtl._Date = jtBeforeShowDateTime(oCtl,oCtl._Date,_sDate)||oCtl._Date;
			oCtl._showSeltctTime2(sDate);
		}
		HourDiv.style.display = '';

		var iTop = sDate.offsetTop-110;
		if(iTop>-7) iTop = -7;
		var iLeft = sDate.offsetLeft+30;
		if(iLeft>171) iLeft = iLeft-80;
		HourDiv.style.top = iTop +'px';
		HourDiv.style.left = iLeft +'px';

		if (typeof(sDate)=='object') sDate=jt.getAttr(sDate,'Date');
		oCtl.setDate(sDate);
	}
	oCtl.selectDateTime = function(sTime,e) {
		if (typeof(sTime)=='object') sTime=jt.getAttr(sTime,'Time');
		select_HH = sTime.split(':')[0];
		select_MI = sTime.split(':')[1];
		oCtl.setDate(oCtl._Date.format('yyyy-mm-dd'));
		jt.evalAttr(oCtl,'AfterSelectDate',oCtl.getDate());
		if(typeof(jtAfterSelectDate)=='function') jtAfterSelectDate(oCtl,oCtl.getDate());
	}

	//[Func] 选择日期 (设置日期并触发事件)|||本函数提供如下接管函数：|||<code>jtAfterSelectDate (oCmp,tDate)</code> 选中日期后触发
	oCtl.selectDate = function(sDate){
		//处理时间选择第二种类型
		if(iShowTimeType==1 || iShowTimeType==2){oCtl.showSeltctTime2(sDate);return;}
		if (typeof(sDate)=='object') sDate=jt.getAttr(sDate,'Date');
		oCtl.setDate(sDate);
		//[Attr] AfterSelectDate###选择日期后执行
		//if (!iShowTime){
			jt.evalAttr(oCtl,'AfterSelectDate',oCtl.getDate());
			if(typeof(jtAfterSelectDate)=='function') jtAfterSelectDate(oCtl,oCtl.getDate());
		//};
	};
	//[Func] 选择时间 (设置时间并触发事件)|||本函数提供如下接管函数：|||<code>jtAfterSelectDate (oCmp,tDate)</code> 选中日期后触发
	oCtl.selectTime = function(sTime,e) {
		if (typeof(sTime)=='object') sTime=jt.getAttr(sTime,'Time');
		oCtl.setTime(sTime,e);
	};
	oCtl.confirm = function(e){
		if(e.value=='今天') oCtl._Date = new Date();
		if(e.value=='清空'){
			jt.evalAttr(oCtl,'Empty',oCtl.getDate());
		}else jt.evalAttr(oCtl,'AfterSelectDate',oCtl.getDate());
		if(typeof(jtAfterSelectDate)=='function') jtAfterSelectDate(oCtl,oCtl.getDate());
	};
	//[Func] 获取时间(日期型)
	oCtl.getDate = function(){ return oCtl._Date; };
	//[Func] 设置时间(日期型)
	oCtl.setDate = function(oDate){
		if (typeof(oDate)=='string') {
				oCtl._Date = (oDate=='')?(new Date()):Date.fromString(oDate);
        } else {
            oCtl._Date = oDate;
		};
		if(iShowTime) oCtl._Date = Date.fromString(oCtl._Date.format('yyyy-mm-dd') + ' ' + select_HH + ':' + select_MI);

		oCtl.yearShow = oCtl._Date.getFullYear();
		oCtl.monthShow = oCtl._Date.getMonth() + 1;
		oCtl.showDate();
		oCtl.setTime = function(sTime,e){
			e==0?select_HH=sTime:select_MI=sTime;
			e==0?oCtl._Date = Date.fromString( oCtl._Date.format('yyyy-mm-dd') + ' ' + sTime + ':' + select_MI):oCtl._Date = Date.fromString( oCtl._Date.format('yyyy-mm-dd') + ' ' + select_HH + ':' + sTime);
			//if(e==0) {oCtl.showSeltctTime2(oCtl._Date.getFullYear()+'-'+(oCtl._Date.getMonth()+1)+'-'+oCtl._Date.getDate());}
			oCtl.showDate();
		};
	};

	//[Func] 组件初始化
	oCtl.init = function(){
		var sHTML='';
		sHTML+='<table class="jt_DateTime" border="0" cellspacing="0" cellpadding="0">';
		sHTML+='	<tr>';
		sHTML+='		<td></td>';
		sHTML+='	</tr>';
		sHTML+='	<tr>';
		sHTML+='		<td class="jt_DateTime_Date">日历</td>';
		sHTML+='	</tr>';
		sHTML+='	<tr>';
		sHTML+='		<td class="jt_DateTime_Time"></td>';
		sHTML+='	</tr>';
		sHTML+='</table>';
		oCtl.innerHTML = sHTML;
		oCtl.oTitlePar=oCtl.childNodes[0].rows[0].cells[0];
		oCtl.oData=oCtl.childNodes[0].rows[1].cells[0];
		oCtl.oTime=oCtl.childNodes[0].rows[2].cells[0];
		//[Attr] ShowWeek###是否显示第几周 (默认true)
		bShowWeek = jt.getAttr(oCtl,'ShowWeek',true);
		//[Attr] ShowTime###是否可选时间
		iShowTime = jt.getAttr(oCtl,'ShowTime',false);
		//[Attr] iShowNow###是否显示今天
		iShowNow = jt.getAttr(oCtl,'ShowNow',true);
		//[Attr] ShowTimeType###时间可选方式，多种类型 0，普通时间选择方式；1，时间选择框点击出现;2，时间选择框不消失
		iShowTimeType = jt.getAttr(oCtl,'ShowTimeType',0);
		//[Attr] SelectRange###不可选日期,before表示之前所有日期，after表示之后所有日期,每个条件用；隔开|||例如：before,2014-5-20 表示2014-5-20之前的日期不可选
		iSelectRange = jt.getAttr(oCtl,'SelectRange');
		//[Attr] OnlyYM###是否只选择年月
		iOnlyYM = jt.getAttr(oCtl,'OnlyYM',false);
		//[Attr] MondayFirst###是否把周一当做每周第一天 (默认false)
		bMondayFirst = jt.getAttr(oCtl,'MondayFirst',false);
		//[Attr] Date###初始日期时间
		var sDateTime = jt.getAttr(oCtl,'Date');
		oCtl.setDate(sDateTime);
	};
    oCtl.init();

	jt.addEvent(window,'onunload',function (){  //清除内存
		oCtl.oTitlePar=null;
		oCtl.oData=null;
		oCtl.oTime=null;

		oCtl.init = null;
	});
};


jt.PluginList.push('DateTimeRange');
jt.DateTimeRange = {};
jt.DateTimeRange.TagName = ['div'];

jt.DateTimeRange.FormatUI = function (oCtl) {
	var oDate,oDate2,StarText,EndText,oTime,starTimeRange,endTimeRange;
	//显示上部分
	oCtl.showDownShop=function(){
		var sHTML ='';
		var strTem='this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode';
		sHTML+='<table width=100% border=0 cellSpacing=0 cellPadding=0>';
		sHTML+='<tr>';
		sHTML+='<td>';
		sHTML+='<td>';
		var Style = 'style="border-right:#e0e1e2 solid 1px"';
		var sButton = jt.getAttr(oCtl,'Button');
		if(sButton){
			sHTML +=	'<table  class="jt_DateTime_Hous" border="0" cellpadding="0" cellspacing="0">';
			sHTML +=		'<tr>';
			var elem = sButton.split('|');
			for(var i=0;i<elem.length;i++){
				sHTML +='<td ';
				sHTML +=i==elem.length-1?'':Style;
				sHTML +='><input class="jt_DateTime_but" onClick="'+strTem+'.Shortcut(this)" type="submit" value="'+elem[i]+'"/></td>';
			}
			sHTML +=		'</tr>';
			sHTML +=	'</table>';
		}
		sHTML+='</td>';
		sHTML+='<td align=right >';
		sHTML +=	'<table  class="jt_DateTime_Hous" border="0" cellpadding="0" cellspacing="0">';
		sHTML +=		'<tr>';
		sHTML +=			'<td '+Style+' ><input class="jt_DateTime_but" onClick="'+strTem+'.clearDate()" type="submit" value="清空" /></td>';
		sHTML +=			'<td><input class="jt_DateTime_but" onClick="'+strTem+'.outputDate()" type="submit" value="确定"/></td>';
		sHTML +=		'</tr>';
		sHTML +=	'</table>';
		sHTML+='</td>';
		sHTML+='</tr>';
		sHTML+='</table>';

        sHTML+='<input type=hidden readonly="readonly" /><input type=hidden readonly="readonly" />';

		oCtl.DownShop.innerHTML = sHTML;
		StarText = oCtl.DownShop.childNodes[1];
		EndText = oCtl.DownShop.childNodes[2];
	};
	// 日历左
	oCtl.showDateTime = function(){
		//创建日期
		oDate = document.createElement('div');
		oDate.className = 'DateTime';
		//[Attr] ShowTime###可选时间
		var bShowTime=jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate, 'ShowTime', bShowTime);
		jt.setAttr(oDate, 'ShowNow',false);
		//[Attr] Format###日期格式 (无显示时间时默认 YYYY-MM-DD,显示时间时默认 YYYY-MM-DD HH:MI)
		var sFormat = bShowTime?'YYYY-MM-DD HH:MI':'YYYY-MM-DD';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		//[Attr] ShowWeek###是否显示第几周 (默认true)
		jt.setAttr(oDate, 'ShowWeek', jt.getAttr(oCtl,'ShowWeek',true) );
		//[Attr] MondayFirst###是否把周一当做每周第一天 (默认false)
		jt.setAttr(oDate, 'MondayFirst', jt.getAttr(oCtl,'MondayFirst',false) );
		//[Attr] SelectRange###可选区域选择
		//jt.setAttr(oDate, 'SelectRange', jt.getAttr(oCtl,'SelectRange'));
		//初始化日期
		var iShowTime = jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate,'ShowTime',iShowTime);
		var sFormat = (iShowTime==false)?'YYYY-MM-DD':'YYYY-MM-DD HH:MI';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		var sDateTime = jt.getAttr(oCtl,'Date');
		if(!oCtl.value) oCtl.value='';
		if(sDateTime!='' && !oCtl.value) jt.setAttr(oDate, 'Date', jt.getAttr(oCtl,'Date') );
		else jt.setAttr(oDate,'Date',oCtl.value);
		oCtl.oTimeData1.appendChild(oDate);
		jt.DateTime.FormatUI(oDate);
		oDate.AfterSelectDate = function(dat){
			StarText.value = dat.format(sFormat);
			//starTimeRange ='before,'+StarText.value;
			//oDate2.funTimeJudge(starTimeRange);
		};
	};
	// 日历右
	oCtl.showDateTime2 = function(){
		//创建日期
		oDate2 = document.createElement('div');
		oDate2.className = 'DateTime';
		//[Attr] ShowTime###可选时间
		var bShowTime=jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate2, 'ShowTime', bShowTime);
		jt.setAttr(oDate2, 'ShowNow',false);
		//[Attr] Format###日期格式 (无显示时间时默认 YYYY-MM-DD,显示时间时默认 YYYY-MM-DD HH:MI)
		var sFormat = bShowTime?'YYYY-MM-DD HH:MI':'YYYY-MM-DD';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		//[Attr] ShowWeek###是否显示第几周 (默认true)
		jt.setAttr(oDate2, 'ShowWeek', jt.getAttr(oCtl,'ShowWeek',true) );
		//[Attr] MondayFirst###是否把周一当做每周第一天 (默认false)
		jt.setAttr(oDate2, 'MondayFirst', jt.getAttr(oCtl,'MondayFirst',false) );
		//[Attr] SelectRange###可选区域选择
		//jt.setAttr(oDate2, 'SelectRange', jt.getAttr(oCtl,'SelectRange2'));
		//var sOnlyYM = jt.getAttr(oCtl,'OnlyYM');
		//初始化日期
		var iShowTime = jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate2,'ShowTime',iShowTime);
		var sFormat = (iShowTime==false)?'YYYY-MM-DD':'YYYY-MM-DD HH:MI';
		//if(sOnlyYM) sFormat = 'YYYY-MM';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		var sDateTime = jt.getAttr(oCtl,'Date');
		if(!oCtl.value) oCtl.value='';
		if(sDateTime!='' && oCtl.value==null) jt.setAttr(oDate2, 'Date', jt.getAttr(oCtl,'Date') );
		else jt.setAttr(oDate2, 'Date',oCtl.value);
		oCtl.oTimeData2.appendChild(oDate2);
		jt.DateTime.FormatUI(oDate2);

		oDate2.AfterSelectDate = function(dat){
			EndText.value = dat.format(sFormat);
			//starTimeRange = EndText.value+',after';
			//oDate.funTimeJudge(starTimeRange);
			oCtl.outputDate();
		};
	};
	// 加载内容
	oCtl.showDateTimeRange = function(){
		oCtl.showDownShop();
		oCtl.showDateTime();
		oCtl.showDateTime2();
	};
	//[Func] 快捷操作
	oCtl.Shortcut = function(obj){
		var Time = EditDateSlot(obj);
		var elem = Time.split('|');
		StarText.value=elem[0];
		EndText.value=elem[1];
		oCtl.outputDate();
	};
	//[Func] 清空日期
	oCtl.clearDate = function(){
		StarText.value='';
		EndText.value='';
		oCtl.outputDate();
	};

	//[Func] 确定输出当前选择日期
	oCtl.outputDate = function(){//StarText,EndText;
		jt.evalAttr(oCtl,'AfterSelectDate',oCtl.returnDate());
	};
	oCtl.returnDate = function(){
		var sTime = oCtl.getDate();
	};
	oCtl.getDate = function(){
		var oTime='';
		if(StarText.value) oTime +=StarText.value;
		if(StarText.value || EndText.value) oTime+='至';
		if(EndText.value) oTime+=EndText.value;
		return oTime;
	};

	//[Func] 组件初始化
	oCtl.init = function(){
		var sHTML='';
		sHTML+='<table class="jt_DataTimeRange">';
		sHTML+='<tr>';
		sHTML+='<td Valign = "top" ></td>';
		sHTML+='<td Valign = "top" ></td>';
		sHTML+='</tr>';
		sHTML+='<tr>';
		sHTML+='<td colspan=2></td>';
		sHTML+='</tr>';
		sHTML+='</table>';
		oCtl.innerHTML = sHTML;
		oCtl.DownShop=oCtl.childNodes[0].rows[1].cells[0];
		oCtl.oTimeData1=oCtl.childNodes[0].rows[0].cells[0];
		oCtl.oTimeData2=oCtl.childNodes[0].rows[0].cells[1];
		oCtl.showDateTimeRange();
	};

	oCtl.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		//oDate.onclick = null;
		oCtl.init = null;
		oCtl.showDateTime=null;
		oCtl.showDateTime2=null;
	});
};

/*<desc>可拖放控件</desc>*/
jt.PluginList.push('DragDrop');
jt.DragDrop = {};
jt.DragDrop.TagName = ['div'];

jt.DragDrop.FormatUI = function (oCtl) {
	//[Attr] MoveStep###每次移动的距离 (默认1)
	var iMoveStep = jt.getAttr(oCtl,'moveStep',1);
	//[Attr] MinLeft###最小Left (默认0)
	var iMinLeft = jt.getAttr(oCtl,'minLeft',0);
	//[Attr] MinTop###最小Top (默认0)
	var iMinTop = jt.getAttr(oCtl,'minTop',0);
	//[Attr] DragObject###拖动对象ID，也可以以<code>oCtl.DragObject=_('#XXX')</code>方式直接赋值对象
	if (typeof(oCtl.DragObject)=='object'){
		var oDrag = oCtl.DragObject;
	}else{
		var strTem = jt.getAttr(oCtl,'DragObject');
		var oDrag = (strTem=='')?oCtl:jt._('#'+strTem);
	};
	oCtl.style.position = 'absolute';

    var chaLeft = 0; var chaTop = 0;
	var beginLeft = 0; var beginTop=0;
	var offsetW = parseInt(oCtl.offsetWidth/2);
	var offsetH = parseInt(oCtl.offsetHeight/2);
	//捕捉拖动
	oDrag.onmousedown = function (e){
		if(typeof(oCtl.BeforeDraging)=='function') oCtl.BeforeDraging(0);
		//[Attr] CanDrag###是否可以被拖动 (默认true)
		if (typeof(oCtl.CanDrag)=='boolean'){
			var bCanDrag=oCtl.CanDrag;
		}else{
			var bCanDrag = jt.getAttr(oCtl,'CanDrag',true);
		};
		if (!bCanDrag) return;
		e = e || event;
		//这里可以过滤点击对象
		//if ((e.srcElement||e.target).className!='Drag') return;
		if(oDrag.setCapture){
			oDrag.setCapture();
		}else if(window.captureEvents){
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		};
		offsetW = parseInt(oCtl.offsetWidth/2);
		offsetH = parseInt(oCtl.offsetHeight/2);
		chaLeft = e.clientX - (parseInt(oCtl.style.left)||0);
		chaTop = e.clientY - (parseInt(oCtl.style.top)||0);
		document.onmousemove = oCtl.Drag;
		document.onmouseup   = oCtl.Drop;
		document.onselectstart = function(){return false;};
		beginLeft=e.clientX-chaLeft; beginTop=e.clientY-chaTop;
		if(typeof(oCtl.Draging)=='function') oCtl.Draging(0, beginLeft, beginTop, 0, 0);
		return false;
	};
	///拖动[BEGIN]-------------------
	oCtl.Drag = function(e){
		if(typeof(oCtl.BeforeDraging)=='function') oCtl.BeforeDraging(1);
		e = e || event;
		var iX=parseInt((e.clientX-chaLeft+offsetW)/iMoveStep)*iMoveStep-offsetW;
		var iY=parseInt((e.clientY-chaTop+offsetH)/iMoveStep)*iMoveStep-offsetH;
		oCtl.style.left = iX + "px";
		oCtl.style.top = iY + "px";
		if(typeof(oCtl.Draging)=='function') oCtl.Draging(1,iX,iY, iX-beginLeft, iY-beginTop);
	};
	oCtl.Drop = function(){
		if(typeof(oCtl.BeforeDraging)=='function') oCtl.BeforeDraging(2);
		if(oDrag.releaseCapture){
			oDrag.releaseCapture();
		}else if(window.captureEvents){
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		};
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		if (parseInt(oCtl.style.left)<iMinLeft) oCtl.style.left=iMinLeft;
		if (parseInt(oCtl.style.top)<iMinTop) oCtl.style.top=iMinTop;
		if(typeof(oCtl.Draging)=='function') oCtl.Draging(2, parseInt(oCtl.style.left), parseInt(oCtl.style.top), parseInt(oCtl.style.left)-beginLeft, parseInt(oCtl.style.top)-beginTop);
	};
	//[Func] oCtl.Draging(iStatus,iX,iY,iDeltaX,iDeltaY)###给组件设置Draging函数，拖动时即会触发函数，iStatus状态为0,1,2
	//oCtl.Draging = function(iStatus,iX,iY,iDeltaX,iDeltaY){};
	//[Func] oCtl.BeforeDraging(iStatus)###给组件设置BeforeDraging函数，拖动时即会触发函数，iStatus状态为0,1,2 (先触发BeforeDraging再者Draging)
	//oCtl.BeforeDraging = function(iStatus){};

    jt.addEvent(window,'onunload',function (){  //清除内存
		oDrag.onmousedown = null;
		oCtl.Drag = null;
		oCtl.Drop = null;
		oCtl.Draging = null;
	});
};

jt.PluginList.push('Grid');
jt.Grid = {};
jt.Grid.TagName = ['table'];

jt.Grid.FormatUI = function (oTab){
	//var bQuirks = jt.bIE && (jt.IEVersion<8); //低版本IE浏览模式
	var bQuirks = jt.bIE && (jt.browser.documentMode<8); //Modify By Witson 2017-08-04  IEVersion属性已删除

    //[Attr] FixHead###固定表头(默认false)
	var bFixHead=jt.getAttr(oTab,'FixHead',false);
	//[Attr] ShowCellTip###鼠标移入时显示Tip (当表格内容超出以...代替后 鼠标移入单元格后显示Tip)(默认true)
	var bShowCellTip=jt.getAttr(oTab,'ShowCellTip',true);
	var bIE10 = document.documentMode>9;
	var oPar = document.createElement('table');
	//[Attr] Drag###表格列拖拽(默认为false)
	var bDrag = jt.getAttr(oTab,'Drag',false);

    //[Attr] GridWidth###(当Drag为false时使用,默认宽度为100%)表格宽度，浏览器分辨率宽度大于当前设置值时，表格宽度则为100%,否则表格宽度为当前设置值
	var bGridWidth = jt.getAttr(oTab,'GridWidth','100%');

    //[Attr] EditMode###编辑模式(默认为false)
	var bEditMode = false;
	oTab.oPar=oPar;
	//oTab.className = 'PopFrame' + (jt.bIE6?' PopFrameIE6 IE6':'');
	oPar.border=0; oPar.cellPadding=0; oPar.cellSpacing=0;
	oPar.className = 'jtGridPar';
	var bWidth=jt.getAttr(oTab,'width','');
	oPar.width = bWidth;
	oPar.insertRow(0).insertCell(0).className='jtGridFoot';
	oPar.insertRow(0).insertCell(0).className='jtGridBody';
	oPar.insertRow(0).insertCell(0).className='jtGridHead';
	oPar.rows[0].style.display=bFixHead?'':'none';
	oPar.rows[2].style.display='none';
	oTab.parentNode.insertBefore(oPar,oTab);
	oPar.rows[0].cells[0].innerHTML='&nbsp;';
	oPar.rows[1].cells[0].innerHTML='<div style=""></div>';
	oPar.rows[1].cells[0].vAlign='top';
	//oPar.rows[2].className='jtGridFoot';
	var oParDiv=oPar.rows[1].cells[0].childNodes[0];
	oParDiv.style.overflow = bFixHead?'auto':'visible';
	oParDiv.className = 'jtGridBodyDiv';
	oParDiv.style.height = bFixHead?'100%':'';
    oParDiv.appendChild(oTab);


	oTab.cellPadding = 3;
	oTab.cellSpacing = 0;
	oTab.border = 0;//jt.getAttr(oTab,'noBorder')=='true'?0:1;
	oTab.style.tableLayout = 'fixed';
	jt.addClass(oTab,'jtGrid');

    //[Attr] Action###点击时执行的脚本|||在列中如果不调用Action请在COL中的 UseAction 属性设置为 false(可选:auto,true,false)
	var sAction='';

	//[Attr] TableStyle###表格样式 (采用CSS方法实现) 支持如下样式:|||NoBorder：没有表格边线|||NoHead：没有表头|||NoInterlaced：不隔行显示不同颜色|||NoOverColor：鼠标移上去时颜色不变 (NoOverColor只能与NoInterlaced共用)
	var sTableStyle=jt.getAttr(oTab,'TableStyle');
	if (sTableStyle!='') oTab.className += ' ' + sTableStyle;

	var intHeadRowsCount=0;//表头行数
	//oTab.borderColor='#CCCCCC';
	//oTab.borderColorDark='white';

	//[Attr] ShowPageBar###显示翻页信息 ("true","false","auto"，默认"true")|||<code>jtGridGoPage (oComp,iStartNO, iPage) </code>页面可实现此方法接管内置的翻页函数
	var sShowPageBar=jt.getAttr(oTab,'ShowPageBar','true');
	//[Attr] PageStyle###翻页显示样式，参见PageBar组件PageStyle属性 (如未设置PageStyle属性,可在页面上定义变量JTCST_GridPageStyle,适用于全系统统一样式)

	//[Attr] Data###数据，也可使用&lt;xmp class="data"&gt;&lt;/xmp&gt;代替
	if (jt.getAttr(oTab,'data')=='') jt.setAttr(oTab,'data',jt.getAttrAndXMP(oTab,'data')); //初始化时将XMP属性复制到属性上
	//[Attr] URLData###数据URL
	//[Attr] JSData###数据源，调用JS，返回字符串或JSON

	//[Func] 加载json数据 (sURL:要加载的URL或JSON对象) |||本函数提供如下接管函数：|||<code>jtBeforeGridLoadData (oComp) </code>页面可实现此方法List加载数据前，将会触发|||<code>jtAfterGridLoadData (oComp) </code>页面可实现此方法List数据并加载完后，将会触发|||<code>jtAfterGridShowData (oComp) </code>页面可实现此方法List数据显示完后，将会触发|||<code>jtAfterGridAddRow(oComp, oTR, jsonItem) </code>添加行之后<hr><code>jtString2JtDataFormat (oComp, sJson) </code>页面可实现此方法来将请求返回的字串转为jt的标准JSON<br><code>jtInitJtDataItem (oComp, jsonItem, idx) </code>页面可实现此方法 自行处理 JSON中 data 的每个项
	oTab.loadData = function (sURL,iStartNO,iPage){
		if(typeof(jtBeforeGridLoadData)=='function') jtBeforeGridLoadData(oTab);
		showOneLineInfo('<font color="gray">正在加载，请稍候……</font>');
		jt.loadDataForComponent(oTab, {URLData:sURL, StartNO:iStartNO, Page:iPage}, function (json){
			oTab.json=json;
			if(typeof(jtAfterGridLoadData)=='function') jtAfterGridLoadData(oTab);
			oTab.showData('');
			if(bDrag) oPar.Colshow();//xiaodao
		});
	};

    //删除Tab行
	function deleteTabRow(){
//		if (/msie (6|7|8)/i.test(navigator.userAgent)){ //IE 6 7 8 在处理bods[i].rows.length会发生致命错误
//			for (var i=oTab.rows.length; i>0; i--){
//				if ((i==1) && (oTab.rows[i-1].className=='GridHead')) continue;//不删除表头
//				oTab.rows[i-1].onmouseover=null; oTab.rows[i-1].onmouseout=null; oTab.deleteRow(i-1);
//			};
//			return;
//		};
		var bods=oTab.tBodies;
		for (var i=bods.length-1; i>=0; i--){
			var rows=getRows(bods[i]);
			for (var j=rows.length-1; j>=0; j--){
                bods[i].rows[j].onmouseover = null;
                bods[i].rows[j].onmouseout = null;
                oTab.deleteRow(rows[j].rowIndex);
			};
			oTab.removeChild(bods[i]);
		};
	};
	//添加一行，显示提示信息
	function showOneLineInfo(sInfo){
		var objs=oTab.getElementsByTagName('col');
		deleteTabRow();
		var tbody=getTBody0();
		var oTR=tbody.insertRow(getRows(tbody).length); var temTD=oTR.insertCell(0);
		if ( (jt.bIE) && (objs.length>0) && (objs[0].style.display=='none')) {
			temTD=oTR.insertCell(1);
			temTD.colSpan=objs.length - 1;
		}else{
			if (objs.length>0) temTD.colSpan=objs.length;
		};
        temTD.style.textAlign = 'center';
		temTD.innerHTML=sInfo;
	};

    //创建tBody  //解决IE10以下无法 createTBody 的问题
	function getTBody0(){
		if (oTab.tBodies.length==0) {
			if (oTab.createTBody) { oTab.createTBody(); }else{ oTab.appendChild(document.createElement('tbody')); };
		};
		return oTab.tBodies[0];
	};

    //获取Body所有行  //解决IE10以下无法 createTBody 的问题
	function getRows(tbody){
		if (typeof(tbody)=='undefined') tbody=getTBody0();
		if (!/msie (6|7|8)/i.test(navigator.userAgent)) return tbody.rows;
		return jt._('[children]tr',tbody);
	};

	//解析编辑字段  name:inputType:data$exHTML
	function parseEditField(sTemplate, oJson){
		if (!typeof String.prototype.splitEx) {//这方法建议删除
			String.prototype.splitEx = function(sSeparator, iCount){
				var arr=[]; var str=this; var iLen=sSeparator.length;
				for (var i=0; i<iCount; i++){
					if (i==iCount-1) {arr.push(str); break;};
					if (str==''){ arr.push(''); continue; };
					var idx=str.indexOf(sSeparator);
					if (idx==-1){ arr.push(str); str=''; }else{ arr.push(str.substr(0,idx)); str=str.substr(idx+iLen); };
				};
				return arr;
			};
		}
		var arr=sTemplate.splitEx('$',2);
		var sExHTML=arr[1];
		var arr=arr[0].splitEx(':',3);
		var sName=arr[0]; var sInputType=arr[1]; var sData=arr[2];
		var arrData=[];
		if (sData!=''){
			var arr=sData.replace(/\\\,/g,'_#44;_').split(',');
			for (var i=0; i<arr.length; i++){ var arrTem=arr[i].split('|'); arrData.push( {id:arrTem[0].replace(/_#44;_/ig,','),text:arrTem[arrTem.length-1].replace(/_#44;_/ig,',')} ); };
		};
		var sFixEx=' name="'+sName+'" '+sExHTML+' ';
		sFixEx += ' onchange="jt._(\'[parent]table.Grid\',this).EditFieldChange(this)" onkeyup="jt._(\'[parent]table.Grid\',this).EditFieldChange(this)" onpaste="jt._(\'[parent]table.Grid\',this).EditFieldChange(this)" oncut="jt._(\'[parent]table.Grid\',this).EditFieldChange(this)" ';
		var sTpl='';
		if (/^input$/i.test(sInputType)) sTpl += '<input class="Grid_Input" type="text" value="{'+sName+'}" '+sFixEx+'>';
		if (/^Input_DateTime$/i.test(sInputType)) sTpl += '<input class="Grid_Input Input_DateTime" type="text" value="{'+sName+'}" ' + sFixEx + (bFixHead?' ContainerID=".jtGridBodyDiv" ':'') + '>';
		if (/^Input_Select$/i.test(sInputType)) sTpl += '<input class="Grid_Input Input_Select" type="text" value="{'+sName+'}" ' + sFixEx + (bFixHead?' ContainerID=".jtGridBodyDiv" ':'') + ' Data="'+sData+'">';// HtmlItem="{text}"
		if (/^textarea$/i.test(sInputType)) sTpl += '<textarea class="Grid_textarea" '+sFixEx+'>{'+sName+'}</textarea>';
		if (/^textarea_Select$/i.test(sInputType)) sTpl += '<textarea class="Grid_textarea Input_Select" '+sFixEx+' Data="'+sData+'">{'+sName+'}</textarea>';
		if (/^DropDown_Select$/i.test(sInputType)) sTpl += '<select class="DropDown_Select" '+sFixEx+' DefaultValue="'+sName+'"  Data="'+sData+'" ><option value ="'+sName+'">加载中...</option></select>';

        if (/^select$/i.test(sInputType)){
			sTpl += '<select class="Grid_Select" '+sFixEx+'>';
			for (var i=0; i<arrData.length; i++) sTpl += '<option value="'+arrData[i].id+'" '+(arrData[i].id==oJson[sName]?'selected':'')+'>'+arrData[i].text+'</option>';
			sTpl += '</select>';
		};
		var sVal = jt.parseField(sTpl,oJson);
		return sVal;
	};

    //可编辑状态内容修改时触发
	oTab.EditFieldChange = function(oInput){
		var oTR=jt._('[parent]tr.GridRow',oInput);
		if(typeof(jtAfterGridEditFieldChange)=='function') jtAfterGridEditFieldChange(oTab, oTR, oInput);
	}
	//可编辑状态内容获取
	oTab.getEditFieldJSON = function(){
		//var bNotEmpty=true;
		var arr=[];
		var rows=getRows();
		for (var j=0; j<rows.length; j++){
			var row=rows[j];
			var objs=jt._('input',row)
			objs=objs.concat(jt._('textarea',row));
			objs=objs.concat(jt._('select',row));
			var item={};
			var bEmpty=true;
			for (var i=0; i<objs.length; i++){
				if ( (jt.hasClass(objs[i],'GridCheckBox')) || (objs[i].name=='') ) continue;
				if (objs[i].value.replace(/(^\s*)|(\s*$)/g,'')!='') bEmpty=false;
				item[objs[i].name] = objs[i].value;
			}
			if (!bEmpty) arr.push(item);
		};
		return arr;
	}

	//[Func] 添加行 (编辑模式时使用)
	oTab.addRow = function(jsonItem){
		oTab.json.data.push(jsonItem);
		var tbody=getTBody0();
		showData_addRow(tbody, oTab.json.data.length-1);
		jt.FormatUI(oTab);
		//oTab.initRowColor();
	};
	//[Func] 删除行 (编辑模式时使用)|||本函数提供如下接管函数：|||<code>jtBeforeGridDelRow(oComp,oTR, jsonItem) </code>删除行之前 返回false则不删除
	oTab.delRow = function(idx){
		var oTR=idx;
		if ((typeof(oTR)=='object') && (!jt.hasClass(oTR,'GridRow'))) oTR=jt._('[parent]tr.GridRow',oTR);
		if (typeof(oTR)=='number') oTR=getRows()[idx];
		idx=jt.getAttr(oTR,'idx',0);
		var jsonItem = oTab.json.data[idx];
		if(typeof(jtBeforeGridDelRow)=='function') { if (!jtBeforeGridDelRow(oTab,oTR, jsonItem)) return};
        oTR.onmouseover = null;
        oTR.onmouseout = null;
        oTab.deleteRow(oTR.rowIndex);
		//oTab.initRowColor();
	};

	//显示数据
	oTab.showData = function (){
		deleteTabRow();
		bEditMode = jt.getAttr(oTab,'EditMode',false);
		if (bEditMode) jt.addClass(oTab,'GridEdit');

        sAction = jt.getAttr(oTab,'Action','');
		var objs=oTab.getElementsByTagName('col');
		if (oTab.rows.length==0){
			var thead=oTab.tHead||oTab.createTHead();
			var temTR=thead.insertRow(i);
			temTR.className="GridHead";
			intHeadRowsCount=1;
			for (var j=0; j<objs.length; j++){
				var temTD=temTR.insertCell(j);
				if (jt.getAttr(objs[j],'boxName')!=''){
					temTD.innerHTML='<input type="'+jt.getAttr(objs[j],'boxType','checkbox')+'" onclick="var objs=jt._(\'.GridCheckBox\',jt._(\'[parent]table.jtGridPar\',this));for (var i=0; i<objs.length; i++){if(!objs[i].disabled){ objs[i].checked=this.checked;}}">';
					//temTD.innerHTML='<input type="'+jt.getAttr(objs[j],'boxType','checkbox')+'" onclick="var objs=document.getElementsByName(\''+jt.getAttr(objs[j],'boxName')+'\');for (var i=0; i<objs.length; i++){if(!objs[i].disabled){ objs[i].checked=this.checked;}}">';
					temTD.style.width='24px';
					jt.setAttr(objs[j],'align','center');
				}else{
					//[Attr] col > Caption###<em>列属性</em>，列标题
					//[Attr] col > SortField###<em>列属性</em>，排序列
					var sSortField = jt.getAttr(objs[j],'SortField');
					if (sSortField!='') {
						temTD.innerHTML='<img class="ImgSort" src="'+jt.Path + 'jtThemes/t.gif"/>'+jt.getAttr(objs[j],'caption');
						temTD.className="GridHeadSort";
						if (sSortField==oTab.SortField){
							temTD.className = 'GridHeadSort ' + (oTab.SortASC?'GridHeadSort_ASC':'GridHeadSort_DESC');
						};
						jt.setAttr(temTD,'SortField',sSortField);
						var strTem='jt._(\'table.Grid\',jt._(\'[parent]table.jtGridPar\',this))[0].sort(this)';
						jt.setAttr(temTD,'_onclick_',strTem);
						temTD.onclick=new Function(strTem);
					}else{
						temTD.innerHTML=jt.getAttr(objs[j],'caption');
					};
				};
			};
		};
		if (oTab.json.data==null) oTab.json.data=[];
		//var arr=oTab.json.data;//jt.isArray(oTab.json.data)?oTab.json.data:oTab.json;

        var divTem=document.createElement('div');
		divTem.innerHTML='<table><tbody></tbody></table>';
		var tbody=divTem.childNodes[0].tBodies[0];

        for (var i=0; i<oTab.json.data.length; i++){ showData_addRow(tbody,i); };

        //清除空的tbody
		var bods=oTab.tBodies;
		for (var i=bods.length-1; i>=0; i--){ if (getRows(bods[i]).length==0) { oTab.removeChild(bods[i]); } };

        oTab.initRowColor(tbody);

        oTab.appendChild( tbody);
		document.body.appendChild(divTem);
		document.body.removeChild(divTem);

        if (bEditMode) jt.FormatUI(oTab);

		if (sShowPageBar!='false'){
			if ((jt.getDefVal(oTab.json.currentPage,-100)!=-100) && (jt.getDefVal(oTab.json.currentPage,-100)!=-100) && (jt.getDefVal(oTab.json.currentPage,-100)!=-100)){
				jt.setAttr(oDivPage,'CurPage', oTab.json.currentPage);
				jt.setAttr(oDivPage,'TotalCount', oTab.json.totalCount);
				jt.setAttr(oDivPage,'PageSize', oTab.json.pageSize);
				oDivPage.init();
				oPar.rows[2].style.display = ( (jt.getDefVal(oTab.json.totalCount,0)>0)||(sShowPageBar=='true') )?'':'none';
			};
			//oPar.rows[2].style.display = ( (oDivPage.TotalPage>1)||(sShowPageBar=='true') )?'':'none';
			//oDivPage.style.display= ( (oDivPage.TotalPage>1)||(sShowPageBar=='true') )?'':'none';
		};
		//[Attr] EmptyInfo###空信息内容，当加载数据为空时显示
		if ((jt.getAttr(oTab,'EmptyInfo')!='') && (oTab.json.data.length==0)) showOneLineInfo(jt.getAttr(oTab,'EmptyInfo'));
		if(typeof(jtAfterGridShowData)=='function') jtAfterGridShowData(oTab);

        //固定表头[Begin]
		if (!bFixHead) return;
		if (oTab.rows.length==0) return;
		var sHTML='';
		sHTML += '<table class="jtGridHead_table" border="0" cellspacing="0" cellpadding="3">';
		sHTML += oTab.rows[0].outerHTML.replace(/_onclick_/ig,'onclick');
		sHTML += '</table>';
		oPar.rows[0].cells[0].innerHTML = jt.xssFilter(sHTML,'HTML');
		oTab.resizeHead();
		oTab.setHeight();
		setTimeout(function(){ oTab.resizeHead(); oTab.setHeight(); },10);
		setTimeout(function(){ oTab.resizeHead(); oTab.setHeight(); },100);


        //##当拖动横向滚动条时，表格跟着拖动。xiaodao
		var iDiv = oPar.rows[1].cells[0].childNodes[0];//table外div
		iDiv.onscroll = function(){
			var oHead = oPar.rows[0].cells[0].childNodes[0];//指向表格头部table
			var t = iDiv.scrollLeft;
			oHead.style.marginLeft= -t+'px';
		}
		if(parseInt(bGridWidth)<oTab.offsetWidth) bGridWidth = '100%';
		iDiv.style.width = '100%';
		iDiv.childNodes[0].style.width = bGridWidth;

	};

	//添加行
	function showData_addRow(tbody,idx){
		var objs=oTab.getElementsByTagName('col');
		var item=oTab.json.data[idx];
		var temTR=tbody.insertRow(getRows(tbody).length);
		jt.setAttr(temTR,'idx',idx);
		jt.setAttr(temTR,'jtSeq', jt.getDefVal(item.jtSeq,idx));
		for (var j=0; j<objs.length; j++){
			var temTD=temTR.insertCell(j);
			temTD.style.cssText = objs[j].style.cssText;
			//复制事件
			var sEvent='';
			//bShowTip
			if (bShowCellTip){
				temTD.onmouseenter = new Function('jt.Grid.CellTipShow(this);');
				temTD.onmouseleave = new Function('jt.Grid.CellTipHide(this);');
			}
			sEvent = jt.getAttr(objs[j],'_onmouseover'); if (sEvent!='') temTD.onmouseover=new Function(jt.parseField(sEvent,item));
			sEvent = jt.getAttr(objs[j],'_onmouseout'); if (sEvent!='') temTD.onmouseout=new Function(jt.parseField(sEvent,item));
			sEvent = jt.getAttr(objs[j],'_onclick'); if (sEvent!='') temTD.onclick=new Function(jt.parseField(sEvent,item));

			var sTitle=jt.getAttr(objs[j],'title');
			if (sTitle!='') temTD.title=jt.parseField(sTitle,item);

            if (!bQuirks){
				var sAlign=jt.getAttr(objs[j],'align');
				if (sAlign!='') temTD.align=jt.trim(sAlign);
			};
			if (jt.getAttr(objs[j],'boxName')!=''){
				var strTem=jt.getAttr(objs[j],'boxValue','{id}');
				strTem = jt.parseField(strTem,item);
				var sExAttr=jt.getAttr(objs[j],'boxAttr');
				if (sExAttr!='') sExAttr=jt.parseField(sExAttr,item);
				var sVal='<input type="'+jt.getAttr(objs[j],'boxType','checkbox')+'" name="'+jt.getAttr(objs[j],'boxName')+'" value="'+strTem+'" '+sExAttr+' class="GridCheckBox">';
			}else{
				//[Attr] col > Field###<em>列属性</em>，列显示的内容
				//[Attr] col > EditField###<em>列属性</em>，列显示的内容(编辑模式时使用)
				//[Attr] col > UseAction###<em>列属性</em>，列内容是否添加链接调用表格的Action (可选:auto[默认],true,false)
				var sVal = jt.parseField(jt.getAttr(objs[j],'Field'),item);
				var bUseAction=false;
				if (sAction!=''){ //添加点击动作
					var sUseAction = jt.getAttr(objs[j],'UseAction','auto');
					if (/(^auto$)/i.test(sUseAction)){ bUseAction=!/\</i.test(sVal); }else{ bUseAction=/(^true$)|(^1$)/i.test(sUseAction); };
				};

				//编辑模式
				if (bEditMode && (jt.getAttr(objs[j],'EditField')!='')){
					bUseAction=false;
					var sEditField=jt.getAttr(objs[j],'EditField');
					//^[_a-zA-Z]\w*\:
					if (/^[_a-zA-Z]\w*\:/i.test(sEditField)){
						sVal = parseEditField(sEditField,item);
					}else{
						sVal = jt.parseField(sEditField,item);
					};
				};

				if (bUseAction) { sVal = '<a href="javascript:void(0);" onclick="'+jt.parseField(sAction,item)+';return false;" hidefocus="true">'+sVal+'</a>'; };
			};
			if (sVal=='') sVal='&nbsp;';
			temTD.innerHTML=sVal;
		};
		if(typeof(jtAfterGridAddRow)=='function') jtAfterGridAddRow(oTab, temTR, item);
	};

	if (bFixHead) {
		jt.addEvent(window,'onresize',function (){
			setTimeout(function(){
				oTab.resizeHead();
				oTab.setHeight();
			},0)
		});
	};


    //[Attr] SortField###当前排序字段 (只读)
	oTab.SortField = '';
	//[Attr] SortASC###当前排序方式 (布尔型 true 为正序 false 为倒序) (只读)
	oTab.SortASC = true;
	//[Func] 显示排序字段 (画表头)
	oTab.showSortField = function(sField, bASC){
		if (typeof(sField)=='string') oTab.SortField = sField;
		if (typeof(bASC)=='boolean') oTab.SortASC = bASC;
		var objs=jt._('TD.GridHeadSort',oPar);
		for (var i=0; i<objs.length; i++){
			jt.removeClass(objs[i],'GridHeadSort_ASC');
			jt.removeClass(objs[i],'GridHeadSort_DESC');
			if (jt.getAttr(objs[i],'SortField')==oTab.SortField) {
				jt.addClass(objs[i], oTab.SortASC?'GridHeadSort_ASC':'GridHeadSort_DESC');
			};
		};
	};
	//[Func] 排序 (参数:排序字段, 正反序)|||本函数提供如下接管函数：|||<code>jtAfterGridSort (oComp, sField, bASC) </code>页面可实现此方法,点击排序完后将触发
	oTab.sort = function(sField, bASC){
		if (typeof(sField)=='object') sField=jt.getAttr(sField,'SortField');
		if (typeof(bASC)!='boolean') bASC = (sField!=oTab.SortField)?true:(!oTab.SortASC);
		oTab.showSortField(sField, bASC);
		if(typeof(jtAfterGridSort)=='function') jtAfterGridSort(oTab, sField, bASC);
		if(typeof(oTab.afterSort)=='function') oTab.afterSort(sField, bASC); //调用控件追加函数
	};

    oTab.resizeHead = function(){
		if(bDrag) oTab.parentNode.style.width = oPar.offsetWidth+'px';
		if (!bFixHead) return;
		var tabHead=oPar.rows[0].cells[0].childNodes[0];
		if (tabHead.nodeName=='#text') return;
		var clsN=tabHead.rows[0].cells;
		var clsO = oTab.rows[0].cells;
		var _Col=oTab.getElementsByTagName('col');
		oTab.style.marginTop = '-' + (clsO[0].offsetHeight+ 1) + 'px';
		var deltaWidth = jt.bIE?0:7;   ///TODO  //// FixIE10//为IE10打补丁, 表头宽度及中间滚动高度
		var deltaWidth = ((jt.bIE)&&(!bIE10))?0:7;
		if (oTab.offsetWidth>0) { tabHead.style.width=oTab.offsetWidth+'px'; }
		//oTab.rows[0].style.display='0px';
		for (var i=0; i<clsO.length; i++){
			try{
				if(_Col[i].width) clsO[i].width = _Col[i].width;
				if (_Col[i].width!='') jt.setAttr(_Col[i],'_width',_Col[i].width);
				_Col[i].width = '';
				clsN[i].width = clsO[i].width;
			}catch(e){};
		};
    };

	//[Attr] GridHeight###表格高度(当固定表头时使用), 接管函数：|||<code>jtGetGridHeight (oComp) </code>页面可实现此方法,用于计算Grid高度 (当 固定表头 并且 GridHeight为空 时触发)
	//oPar.style.height = jt.getAttr(oTab,'GridHeight','');

	//[Func] 设置表格高度(当固定表头时使用)
	oTab.setHeight = function(sHeight){
		if ( (typeof(sHeight)!='number') && (typeof(sHeight)!='string')) sHeight=jt.getAttr(oTab,'GridHeight','');
		if ((sHeight=='') && (typeof(jtGetGridHeight)=='function')) sHeight = jt.getDefVal(jtGetGridHeight(oTab),'');
		oPar.style.height=sHeight;
		var oParDiv=oPar.rows[1].cells[0].childNodes[0];
		if ((typeof(sHeight)=='string') && (sHeight.indexOf('%')>0)){
			oParDiv.style.height='100%';
			return;
		};
		var iHeight=parseInt(sHeight);
		iHeight = iHeight - oPar.rows[2].offsetHeight - oPar.rows[0].offsetHeight;
		if (iHeight<1) iHeight=100;
		oParDiv.style.height = iHeight + 'px';
	};

	//[Func] 格式化颜色表格样式
	oTab.initRowColor = function(tbody){
		var bShowRowStyle=jt.getAttr(oTab,'ShowRowStyle',true);
		//if (!jt.getAttr(oTab,'ShowRowStyle',true)) return;
		//if(/NoInterlaced/i.test(sTableStyle)) return;//不显示隔行变色则返回
		if ((typeof(tbody)=='undefined') && (oTab.tBodies.length==0)) return;
		var rows=getRows(tbody);
		for (var i=0; i<rows.length; i++){
			var row=rows[i];
			if (!row.onmouseover) row.onmouseover=function (){ jt.addClass(this,'trOver'); };
			if (!row.onmouseout) row.onmouseout=function (){ jt.removeClass(this,'trOver'); };
			row.className = (i%2)?'GridRow tr_even':'GridRow tr_odd';

            if (bShowRowStyle) {
				for (var j=0; j<row.cells.length; j++) {
					if (j==0){
						row.cells[j].className = 'GridCell GridCell_L';
					}else if (j==row.cells.length-1){
						row.cells[j].className = 'GridCell GridCell_R';
					}else{
						row.cells[j].className = 'GridCell';
					};
				};
			};
		};
		for (var i=0; i<intHeadRowsCount; i++){
			var row=oTab.rows[i];
			for (var j=0; j<row.cells.length; j++) {
				var sBaseCSS = row.cells[j].className+' ';//jt.hasClass(row.cells[j],'GridHeadSort')?'GridHeadSort ':'';
				if (j==0){
					row.cells[j].className = sBaseCSS+'GridCell GridCell_L';
				}else if (j==row.cells.length-1){
					row.cells[j].className = sBaseCSS+'GridCell GridCell_R';
				}else{
					row.cells[j].className = sBaseCSS+'GridCell';
				};
			};
		};
	};
	//---------------创建拖柱 xiaodao
	oPar.Colshow = function(){
		var oDiv = document.createElement('div');//拖拽div
		oDiv.className='Grid-Drag-div';
		oPar.rows[0].cells[0].appendChild(oDiv);
		var iDiv = oPar.rows[1].cells[0].childNodes[0];//table外div
		var oTab = oPar.rows[1].cells[0].childNodes[0].childNodes[0];//指向表格内容table
		var oHead = oPar.rows[0].cells[0].childNodes[0];//指向表格头部table
		var oCol=oTab.rows[0].cells;

        var deltaWidth = jt.bIE?0:7;   ///TODO  //// FixIE10//为IE10打补丁, 表头宽度及中间滚动高度
		var deltaWidth = ((jt.bIE)&&(!bIE10))?0:7;
		iDiv.style.width=oPar.offsetWidth+'px';//设置最大宽度
		oTab.width= oTab.offsetWidth +'px';
		oHead.width=oTab.offsetWidth +'px';

		var _oCol=iDiv.getElementsByTagName('col');
		var str ='';
		for(var i=0;i<oCol.length-1;i++){
			//////TODO oCol[i].offsetWidth有可能为0
			if (oCol[i].offsetWidth>0) oCol[i].width=oCol[i].offsetWidth-deltaWidth;
            str += '<div class="DragDrop" style="height:' + (oHead.offsetHeight) + 'px" DivID = ' + i + '></div>';//
		};
		oCol[i].style.width=oCol[i].offsetWidth-deltaWidth;//为最后一个赋值宽度

		oDiv.innerHTML = str;

		jt.FormatUI(oDiv);
		var Column = jt._('div',oDiv);
		for(var i=0;i<Column.length;i++){//添加拖拽
			Column[i].Draging = function(iStatus,iX,iY,iDeltaX,iDeltaY){
				this.style.top = '0px';
				var iDivID = jt.getAttr (this,'DivID');
				if(iStatus==1) oDiv.DragChange(iStatus,iX,iDeltaX,iDivID);
				if(iStatus==2) oDiv.TrackStar();
			};
		};
		//拖动触发事件##iStatus_0按下1拖动2放开
		oDiv.DragChange = function(iStatus,iX,iDeltaX,id){
			var iWidth = oCol[id].offsetLeft;
			var EidtWidth = iX-iWidth;
			if(EidtWidth<=0) return;
			oCol[id].style.width=EidtWidth+'px';//修改td宽度
			_oCol[id].width=EidtWidth;//修改col_width
			iDiv.onscroll();
			oDiv.HeadCorrectWidth();
		};
		//修正表头宽度
		oDiv.HeadCorrectWidth = function(){
			oTab.resizeHead();
			for(var i=0;i<oCol.length;i++){
				oHead.rows[0].cells[i].style.width=oCol[i].offsetWidth-deltaWidth+'px';
			};
		};
		//滚动条滚动事件
		iDiv.onscroll = function(){
			var t = iDiv.scrollLeft;
			oHead.style.marginLeft= -t+'px';
			oDiv.style.marginLeft= -t+'px';
		};

		//页面加载光标位置
		oDiv.TrackStar = function(){
			var sWidth=0;
			for(var i=0;i<Column.length;i++){
				sWidth += oTab.rows[0].cells[i].offsetWidth;
				Column[i].style.left=sWidth-3;
			};
		};
		oDiv.TrackStar();
	};
	//---------------------

    //创建分页
	var oDivPage;
	function createPageBar(){
		if (oDivPage) return;
		if (!jt.PageBar) jt.loadPlugin('PageBar');
		oDivPage = document.createElement('div');
		oDivPage.className='Grid_PageBar';
		var sStyle=(typeof(JTCST_GridPageStyle)=='string')?JTCST_GridPageStyle:'{CST_PAGESTYLE_10}';
		jt.setAttr(oDivPage,'PageStyle',jt.getAttr(oTab,'PageStyle',sStyle));
		jt.PageBar.FormatUI(oDivPage);

        oDivPage.funGoPage = function (iPage) {
			if(typeof(jtGridGoPage)=='function') {jtGridGoPage(oTab,(iPage-1)*oTab.json.pageSize, iPage); return;};
			oTab.loadData('',(iPage-1)*oTab.json.pageSize, iPage);
		};
		oPar.rows[2].cells[0].appendChild(oDivPage);
	};

	//[Func] 组件初始化
	oTab.init = function(){
		if (sShowPageBar!='false') createPageBar();
		//初始化前判断是否需要加载
        if ((jt.getAttrAndXMP(oTab, 'data') == '') && (jt.getAttr(oTab, 'URLData') == '') && (jt.getAttr(oTab, 'JSData') == '')) {
			oTab.initRowColor();
        } else {
			//[Attr] AutoLoadData###控件自动加载数据 (默认true)
			if (jt.getAttr(oTab,'AutoLoadData',true)) oTab.loadData();
		};
		if (bFixHead) oTab.setHeight();
	};
	oTab.init();

	jt.addEvent(window,'onunload',function (){  //清除内存
		oTab.json=null;
		oTab.oPar=null;
		oTab.sort=null;
		oTab.loadData=null;
		oTab.showData=null;
		oTab.setHeight=null;
		oTab.resizeHead=null;
		oTab.initRowColor=null;
		oTab.addRow=null;
		oTab.delRow=null;
		oPar.Colshow=null;//xiaodao
		try{ oDivPage.funGoPage=null; }catch(e){};
		for (var i=0; i<oTab.rows.length; i++){ oTab.rows[i].onmouseover=null; oTab.rows[i].onmouseout=null; };
		try{ oDivPage.parentNode.removeChild(oDivPage); }catch(e){};
		oTab.init = null;
	});
};

//鼠标移入的时候显示单元格中超出的字符
jt.Grid.CellTipShow = function(cel){
	if (cel.offsetWidth > cel.scrollWidth - 2) return;
	var str=cel.innerText;
	if (str.trim()=='') return;
	var divTip=jt._('#divJTGridCellTip');
	if (!divTip){
		divTip=document.createElement('div');
		divTip.id = 'divJTGridCellTip';
		divTip.style.position = 'absolute';
		document.body.appendChild(divTip);
	}

    divTip.innerHTML = '<div id="divJTGridCellTipCnt">' + str + '</div>';
	var oParDiv=jt._('[parent]div.jtGridBodyDiv',cel);
	divTip.style.display = '';
//	divTip.style.top = (jt.getAbsTop(cel)+cel.offsetHeight-oParDiv.scrollTop) + 'px';
//	divTip.style.left = jt.getAbsLeft(cel) + 'px';
	divTip.style.top = jt(cel).offset().top+cel.offsetHeight + 'px';
	divTip.style.left = jt(cel).offset().left + 'px';
	//ContainerID
};

jt.Grid.CellTipHide = function(cel){
	var divTip=jt._('#divJTGridCellTip');
	if (divTip) divTip.style.display = 'none';
};

jt.PluginList.push('Input_CheckBox');
jt.Input_CheckBox = {};
jt.Input_CheckBox.TagName = ['input'];

jt.Input_CheckBox.FormatUI = function (oCtl) {

    var oSpan = document.createElement('span');
	oSpan.className = 'Input_CheckBox_SPAN';
	oCtl.parentNode.insertBefore(oSpan,oCtl);
	oSpan.oInput=oCtl;
	//oCtl.oSpan= oSpan;

    //[Attr] CheckBoxName###用于CheckBox的Name
	var sCheckBoxName;
	var intLineNumber;
	var bRadio=false;
	var sDisabled = false;


	//[Func] 加载json数据 (sURL:要加载的URL或JSON对象) |||本函数提供如下接管函数：|||<code>jtBeforeInputCheckBoxLoadData (oComp) </code>页面可实现此方法List加载数据前，将会触发|||<code>jtAfterInputCheckBoxLoadData (oComp) </code>页面可实现此方法List数据并加载完后，将会触发|||<code>jtAfterInputCheckBoxShowData (oComp) </code>页面可实现此方法List数据显示完后，将会触发<hr><code>jtString2JtDataFormat (oComp, sJson) </code>页面可实现此方法来将请求返回的字串转为jt的标准JSON<br><code>jtInitJtDataItem (oComp, jsonItem, idx) </code>页面可实现此方法 自行处理 JSON中 data 的每个项
	oCtl.loadData = function (sURL){
		if(typeof(jtBeforeInputCheckBoxLoadData)=='function') jtBeforeInputCheckBoxLoadData(oCtl);
		jt.loadDataForComponent(oCtl, {URLData:sURL, StartNO:0, Page:1}, function (json){
			oCtl.json=json;
			if(typeof(jtAfterInputCheckBoxLoadData)=='function') jtAfterInputCheckBoxLoadData(oCtl);
			oCtl.showData();
		});
	};
	//[Func] 选中传进来的值,多个用逗号隔开
	oCtl.setValue = function (sVal){
		if((sVal=='') && bRadio) return;
		var objs=jt._('input',oSpan);
		var arr=sVal.split(',');
		for (var i=0;i<objs.length;i++) {
			objs[i].checked=false;
			for(var j=0;j<arr.length;j++){
				if (arr[j] == objs[i].value) objs[i].checked=true;
			};
		};
		oCtl.syncValue();
	};
	//[Func] 获取Input的值
	oCtl.getValue = function (){
		var sVal='';
		var objs=jt._('input',oSpan);
		for (var i=0;i<objs.length;i++) {
			if (objs[i].checked) { sVal += (sVal==''?'':',') + objs[i].value; };
		};
		oCtl.value = sVal;
		return sVal;
	};

	//[Func] 获取选中的值，返回JSON
	oCtl.getValueJson = function(){
		var sArr = [];
		var objs=jt._('input',oSpan);
		for (var i=0;i<objs.length;i++) {
			if (objs[i].checked) {sArr.push(oCtl.json.data[i]);};
		};
		return sArr;
	};
	//将选择与Value同步(内部调用)
	oCtl.syncValue = function(){
		var sVal=oCtl.value;
		if (sVal!=oCtl.getValue()) {
			if (oCtl.onchange) oCtl.onchange();
		};
	};
	//[Func] 获取Checkbox(radio)
	oCtl.getInputs = function(){
		return jt._('input',oSpan);
	};

    //[Func] 全选(当为Checkbox时)
	oCtl.selectAll = function(bSelect){
		var objs=jt._('input',oSpan);
		if (objs.length==0) return;
		if (typeof(bSelect)!='boolean'){ bSelect = !objs[0].checked; };
		for (var i=0;i<objs.length;i++) { objs[i].checked=bSelect; };
		oCtl.getValue();
		oCtl.syncValue();
	};

    //显示数据
	oCtl.showData = function (sKey){
		if (!oCtl.json) return;


        //[Attr] CheckBoxText###用于CheckBox的显示内容 (默认值 '{text}')
		//[Attr] CheckBoxValue###用于CheckBox的Value (默认值 '{id}')

        //[Attr] CheckBoxOnClick###CheckBox的onclick事件

		//////[Attr] DefaultValue###原始值
		//[Attr] DefaultValueJS###原始值JS (执行JS返回值做为原始 值如:'self.getSystemID()')
		//[Attr] SplitStr###分隔字符串 (默认值: ' ' 英文空格)

		//[Attr] Radio###是否显示为单选 (默认值 false)
		//[Attr] RadioIndex###当为Radio时默认选择第几项 (仅当value为空时生效) (默认0)

		var sDefValue=oCtl.value;//jt.getAttr(oCtl,'DefaultValue','');
		var sDefValueJS=jt.getAttr(oCtl,'DefaultValueJS','');
		if (sDefValueJS!='') sDefValue=eval(sDefValueJS);
		bRadio=jt.getAttr(oCtl,'Radio',false);
		var iRadioIndex=jt.getAttr(oCtl,'RadioIndex',0);
		var sCheckText=jt.getAttr(oCtl,'CheckBoxText','{text}');
		var sCheckValue=jt.getAttr(oCtl,'CheckBoxValue','{id}');
		var sCheckBoxOnClick=jt.getAttr(oCtl,'CheckBoxOnClick','');

        var sSplitStr=jt.getAttr(oCtl,'SplitStr',' ');

        var sHTML='';
		//debugger;
		var spl='<label><input type="'+(bRadio?'radio':'checkbox')+'" '+(sDisabled==true?'disabled=true':'')+' ';
		spl += 'name="'+sCheckBoxName+'" value="'+sCheckValue+'" NotSubmit="true" ';
		spl += 'onclick="jt._(\'[parent]span.Input_CheckBox_SPAN\',this).oInput.syncValue();'+sCheckBoxOnClick+'" ';
		spl += '>'+sCheckText+'</label>';
		if (intLineNumber>0){
			sHTML = jt.parseField_Data(spl, oCtl.json, sSplitStr,
				function (sResult,idx,jsonItem){
					return (idx%intLineNumber==0&&idx>0?'</br>':'') + sResult;
				}
			);
		}else{
			sHTML = jt.parseField_Data(spl, oCtl.json, sSplitStr);
		}

        oSpan.innerHTML = sHTML;
		var objs=jt._('input',oSpan);
		if (bRadio && (iRadioIndex>-1) && (iRadioIndex<objs.length)) objs[iRadioIndex].checked=true;
		if (sDefValue!=''){
			var arr=sDefValue.split(',');
			for (var i=0;i<objs.length;i++) {
				if (arr.indexOfEx(objs[i].value)>-1) objs[i].checked=true;
			};
		};
		oCtl.syncValue();
		if(typeof(jtAfterInputCheckBoxShowData)=='function') jtAfterInputCheckBoxShowData (oCtl);
	};

    //[Func] 组件初始化
	oCtl.init = function(){
		bRadiobRadio=jt.getAttr(oCtl,'Radio',false);
		//[Attr] LineNumber###控制CheckBox每行显示个数
		intLineNumber = jt.getAttr(oCtl,'LineNumber',0);
		sCheckBoxName=jt.getAttr(oCtl,'CheckBoxName','');
		sDisabled=jt.getAttr(oCtl,'InputDisabled',false);

        if (sCheckBoxName=='') {
			sCheckBoxName=oCtl.name + '_' +parseInt(Math.random()*10000000).toString();
		};
		oCtl.style.display='none';
		//[Attr] AutoLoadData###控件自动加载数据 (默认true)
		if (jt.getAttr(oCtl,'AutoLoadData',true)) oCtl.loadData();
	};
	oCtl.init();


    jt.addEvent(window,'onunload',function (){  //清除内存
		oCtl.init = null;
		oCtl.loadData = null;
		oCtl.getValue = null;
		oCtl.setValue = null;
		oCtl.syncValue = null;
		oCtl.selectAll = null;
		oCtl.getInputs = null;
		oSpan.oInput=null;
		//oCtl.parentNode.removeChild(oSpan);
	});
};


/**
 * 选择周
 * @require
 * @TagName div
 * @desc 选择周
 */
(function(jUI){
	jUI.PluginList.push('Input_SelectWeek');
	jUI.Input_SelectWeek = { TagName:['input'], RequirePlugin:[] };
	jUI.Input_SelectWeek.FormatUI = function (oCtl) {
		var oPop,oWeek;
		var iSelectType;

		oCtl.showWeek =  function(){
			oWeek.showWeek();
		}

		oCtl.init = function(){
			//创建 -周选择
			oWeek = document.createElement('div');
			oWeek._name = oCtl.name;
			oWeek.className = 'SelectWeek SelectWeek_Week';
			//[Attr] Date###设置默认日期,例如:2018-3-15
			jt.setAttr(oWeek,'Date',jt.getAttr(oCtl,'Date',''));
            //[Attr] ShowDateDa###是否显示周对应日期,默认true
			jt.setAttr(oWeek,'ShowDateDay',jt.getAttr(oCtl,'ShowDateDay',''));
			//[Attr] SelectType,选择后返回类型,支持 date|week,默认返回 date
			iSelectType = jt.getAttr(oCtl,'SelectType','date')
			jt.SelectWeek.FormatUI(oWeek);
			oWeek.AfterSelectWeek = function(dat){
				//if(iSelectType=='week') dat = oWeek.Date_Week;
				//else dat = oWeek.Date_Str;
				oCtl.value = dat;
				if (oCtl.onchange) oCtl.onchange();
				setTimeout(function() { oPop.hide(0); }, 100);
			};
			oWeek.onclick = function() { clearTimeout(oPop.TimeHide); };
			//[Attr] ContainerID###所在容器ID,  当控件置于某 overflow:auto  的 DIV 时, 将些属性设置为此DIV
			//创建弹出框
			oPop = jt.PopFrame.regPopObject(oCtl,oWeek,'onfocus,onclick','onblur', jt.getAttr(oCtl,'ContainerID'));

			oPop.style.zIndex= window._jt_Window_zIndex+100;
			jt.addClass(oPop,'PopFrameTemp'); //临时弹出
			oWeek.style.background="#fff";
		}
		oCtl.init();
	};
})(jt);
jt.PluginList.push('Input_DateTime');
jt.Input_DateTime = {};
jt.Input_DateTime.TagName = ['input'];

Date.fromString = function (sDate){
	return new Date(sDate.replace(/-|年|月|日|(\/\/)/g,'/').replace(/\/ /g,' ').replace(/\/$/g,''));
};

jt.Input_DateTime.FormatUI = function (oCtl) {
	var oPop,oDate;
	//[Func] 组件初始化
	oCtl.init = function(){
		//创建日期
		oDate = document.createElement('div');
		oDate._name = oCtl.name;
		oDate.className = 'DateTime Input_DateTime_DateTime';
		//[Attr] ShowTime###可选时间
		var bShowTime=jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate, 'ShowTime', bShowTime);
		//[Attr] Format###日期格式 (无显示时间时默认 YYYY-MM-DD,显示时间时默认 YYYY-MM-DD HH:MI)
		var sFormat = bShowTime?'YYYY-MM-DD HH:MI':'YYYY-MM-DD';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		//[Attr] ShowWeek###是否显示第几周 (默认true)
		jt.setAttr(oDate, 'ShowWeek', jt.getAttr(oCtl,'ShowWeek',true) );
		//[Attr] MondayFirst###是否把周一当做每周第一天 (默认false)
		jt.setAttr(oDate, 'MondayFirst', jt.getAttr(oCtl,'MondayFirst',false) );
		//[Attr] SelectRange###可选区域选择
		jt.setAttr(oDate, 'SelectRange', jt.getAttr(oCtl,'SelectRange'));
		//[Attr] SelectRange###是否只选年月
		jt.setAttr(oDate, 'OnlyYM', jt.getAttr(oCtl,'OnlyYM'));
		//[Attr] ShowTimeType###设置时间类型
		jt.setAttr(oDate, 'ShowTimeType', jt.getAttr(oCtl,'ShowTimeType',0));
		//[Attr] ShowNow###是否显示今天
		jt.setAttr(oDate, 'ShowNow', jt.getAttr(oCtl,'ShowNow'));

        var sOnlyYM = jt.getAttr(oCtl,'OnlyYM');
		//初始化日期
		var iShowTime = jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate,'ShowTime',iShowTime);
		var sFormat = (iShowTime==false)?'YYYY-MM-DD':'YYYY-MM-DD HH:MI';
		if(sOnlyYM) sFormat = 'YYYY-MM';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		var sDateTime = jt.getAttr(oCtl,'Date');
		var sDateTimeVal = oCtl.value;
        if (/\d{4}-\d{2}/i.test(sDateTimeVal) && jt.getAttr(oCtl, 'OnlyYM')) sDateTimeVal += '-1';
		if(sDateTime!='' && sDateTimeVal=='') jt.setAttr(oDate, 'Date', jt.getAttr(oCtl,'Date') );
		else jt.setAttr(oDate, 'Date',sDateTimeVal);

        if (sDateTimeVal != '') sDateTimeVal = Date.fromString(sDateTimeVal).format(sFormat);
		jt.DateTime.FormatUI(oDate);

		oDate.AfterSelectDate = function(dat){
			oCtl.value = dat.format(sFormat);
			if (oCtl.onchange) oCtl.onchange();
			//oPop.hide(0);
			setTimeout(function() { oPop.hide(0); }, 100);
		};
		//##清空
		oDate.Empty = function(){
			oCtl.value='';
			if (oCtl.onchange) oCtl.onchange();
			setTimeout(function() { oPop.hide(0); }, 100);
		};

		oDate.onclick = function() { clearTimeout(oPop.TimeHide); };
		//[Attr] ContainerID###所在容器ID,  当控件置于某 overflow:auto  的 DIV 时, 将些属性设置为此DIV
		//创建弹出框
		oPop = jt.PopFrame.regPopObject(oCtl,oDate,'onfocus,onclick','onblur', jt.getAttr(oCtl,'ContainerID'));

		oPop.style.zIndex= window._jt_Window_zIndex+100;
		jt.addClass(oPop,'PopFrameTemp'); //临时弹出

		oDate.style.background="#fff";
	};


    //[Func] funTimeJudge 动态变更时间可选区域
	oCtl.funTimeJudge = function(term){
		oDate.funTimeJudge(term);
	};
	oCtl.selectDate = function(sDate){
		oDate.setDate(sDate);
		jt.evalAttr(oDate,'AfterSelectDate',oDate.getDate());
	}
	oCtl.setHourMin = function(h,m){
		oDate.setHourMin(h,m);
	}
	oCtl.init();


    jt.addEvent(window,'onunload',function (){  //清除内存
		oDate.onclick = null;
		oCtl.init = null;
	});
};


jt.PluginList.push('Input_DateTimeRange');
jt.Input_DateTimeRange = {};
jt.Input_DateTimeRange.TagName = ['input'];

jt.Input_DateTimeRange.FormatUI = function (oCtl) {
	var oPop,oDate;
	//[Func] 组件初始化
	oCtl.init = function(){
		//创建日期
		oDate = document.createElement('div');
		oDate.className = 'DateTimeRange Input_DateTime_DateTimeRange';
		//[Attr] ShowTime###可选时间
		var bShowTime=jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate, 'ShowTime', bShowTime);
		//[Attr] Button###快捷操作按钮,支持本月、上月、今年、去年、本季、上季、前一天、今天、后一天、本周、上周,多个用 | 隔开,例如：本月|上月
		var bButton=jt.getAttr(oCtl,'Button');
		jt.setAttr(oDate, 'button', bButton);
		//[Attr] Format###日期格式 (无显示时间时默认 YYYY-MM-DD,显示时间时默认 YYYY-MM-DD HH:MI)
		var sFormat = bShowTime?'YYYY-MM-DD HH:MI':'YYYY-MM-DD';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		//[Attr] ShowWeek###是否显示第几周 (默认true)
		jt.setAttr(oDate, 'ShowWeek', jt.getAttr(oCtl,'ShowWeek',true) );
		//[Attr] MondayFirst###是否把周一当做每周第一天 (默认false)
		jt.setAttr(oDate, 'MondayFirst', jt.getAttr(oCtl,'MondayFirst',false) );
		//[Attr] SelectRange###可选区域选择
		jt.setAttr(oDate, 'SelectRange', jt.getAttr(oCtl,'SelectRange'));
		var sOnlyYM = jt.getAttr(oCtl,'OnlyYM');
		//初始化日期
		var iShowTime = jt.getAttr(oCtl,'ShowTime',false);
		jt.setAttr(oDate,'ShowTime',iShowTime);
		var sFormat = (iShowTime==false)?'YYYY-MM-DD':'YYYY-MM-DD HH:MI';
		if(sOnlyYM) sFormat = 'YYYY-MM';
		sFormat=jt.getAttr(oCtl,'Format',sFormat);
		var sDateTime = jt.getAttr(oCtl,'Date');
		if(sDateTime!='' && oCtl.value=='') jt.setAttr(oDate, 'Date', jt.getAttr(oCtl,'Date') );
		else jt.setAttr(oDate, 'Date',oCtl.value);

		jt.DateTimeRange.FormatUI(oDate);

		oDate.AfterSelectDate = function(dat){
			oCtl.value = oDate.getDate();
			if (oCtl.onchange) oCtl.onchange();
			setTimeout(function() { oPop.hide(0); }, 10);
		};
		//清空
		oDate.Empty = function(){
			oCtl.value='';
			if (oCtl.onchange) oCtl.onchange();
			setTimeout(function() { oPop.hide(0); }, 10);
		};
		oDate.onclick = function() { clearTimeout(oPop.TimeHide); };
		//[Attr] ContainerID###所在容器ID,  当控件置于某 overflow:auto  的 DIV 时, 将些属性设置为此DIV
		//创建弹出框
		oPop = jt.PopFrame.regPopObject(oCtl,oDate,'onfocus,onclick','onblur', jt.getAttr(oCtl,'ContainerID'));
		oPop.style.zIndex= window._jt_Window_zIndex+100;
		jt.addClass(oPop,'PopFrameTemp'); //临时弹出

		oDate.style.background="#fff";
	};
	//[Func] funTimeJudge 动态变更时间可选区域
	oCtl.funTimeJudge = function(term){
		oDate.funTimeJudge(term);
	};

	oCtl.init();


    jt.addEvent(window,'onunload',function (){  //清除内存
		oDate.onclick = null;
		oCtl.init = null;
	});
};

jt.PluginList.push('Input_Select');
jt.Input_Select = {};
jt.Input_Select.TagName = ['input','textarea'];

jt.Input_Select.FormatUI = function (oCtl) {
	var oPop,oList;
	//[Attr] Field###选择后赋值内容，用于选择后赋值到input (默认值 '{text}')
	//[Attr] HtmlItem###下拉项显示内容，为空时使用Field属性做为显示内容
	//[Attr] Input2###选择后赋值第二Input，用于选择后赋值到input (如：选择后赋值用户名及用户ID)
	//[Attr] Field2###选择后赋值第二Input的内容，用于选择后赋值到input
	var sField=''; var oInput2=null; var sField2='';
	var sHtmlItem='';
	var sFirstItem='';

    //[Attr] ListWidth###下拉列表宽度，默认为Input宽度 (为0或-1时，则自动)
	//[Attr] ListHeight###下拉列表高度，默认为150 (为0或-1时，则自动)
	var listWidth=0; var listHeight=0;

    //[Attr] Data###数据
	//[Attr] URLData###数据URL
	//[Attr] JSData###数据源，调用JS，返回字符串或JSON

    var sKeyOld=''; //保存旧的搜素内容
	var iCurIdx=-1; //当前选择的项

    //[Attr] SearchField###要搜索的字段, 当设置了搜索字段后, 在输入框输入时, 下拉内容会自动过滤
	var arrSearchField=[];

    //[Attr] UpDownKey###向上向下键选择可选项，默认true
	var bUpDownKey=true;

    //[Func] 加载json数据 (sURL:要加载的URL或JSON对象) |||本函数提供如下接管函数：|||<code>jtBeforeInputSelectLoadData (oComp) </code>页面可实现此方法List加载数据前，将会触发|||<code>jtAfterInputSelectLoadData (oComp) </code>页面可实现此方法List数据并加载完后，将会触发|||<code>jtAfterInputSelectShowData (oComp) </code>页面可实现此方法List数据显示完后，将会触发<hr><code>jtString2JtDataFormat (oComp, sJson) </code>页面可实现此方法来将请求返回的字串转为jt的标准JSON<br><code>jtInitJtDataItem (oComp, jsonItem, idx) </code>页面可实现此方法 自行处理 JSON中 data 的每个项
	oCtl.loadData = function (sURL){
		if(typeof(jtBeforeInputSelectLoadData)=='function') jtBeforeInputSelectLoadData(oCtl);
		jt.loadDataForComponent(oCtl, {URLData:sURL, StartNO:0, Page:1}, function (json){
			oCtl.json=json;
			if(typeof(jtAfterInputSelectLoadData)=='function') jtAfterInputSelectLoadData(oCtl);
			//自动识别，当数据中有id和text，并且未设置显示样式时，采用id和text
			if (json.data.length>0){
				if ((jt.getAttr(oCtl,'Field')=='') && (typeof(json.data[0].id)=='string')){ sField='{id}'; }
				if ((jt.getAttr(oCtl,'HtmlItem')=='') && (typeof(json.data[0].text)=='string')){ sHtmlItem='{text}'; }
			};
			oCtl.showData();
		});
	};

    //显示数据
	oCtl.showData = function (sKey){
		if (!oCtl.json) return;
		iCurIdx=-1;
		oCtl.arrSearch=[];

		sKey = jt.getDefVal(sKey,'').toLowerCase();
		if (arrSearchField.length==0) sKey='';

		//[Attr] FirstItem###下拉项第一条 （加载完数据后，自动在前面加入此条数据，如下拉选择框中常用的空值“请选择”
		sFirstItem=jt.getAttr(oCtl,'FirstItem');
		if ((sKey=='') && (sFirstItem!='')) oCtl.arrSearch.push( jt.Str2Json(sFirstItem) );
		sKeyOld=sKey;

		//搜索并添加到 oCtl.arrSearch
		var arr = oCtl.json.data;
		for (var i=0; i<arr.length; i++){
			// if ((sKey!='') && (arrSearchField.indexOfEx( function(item){ return arr[i][item].toString().toLowerCase().indexOf(sKey)>-1; } )==-1)) continue;
			if(sKey!=''){
                for(var j=0;j<arrSearchField.length;j++){
                    if ((arr[i][arrSearchField[j]].toString().toLowerCase().indexOf(sKey)==-1 )){
                        continue;
                    } else {
                        oCtl.arrSearch.push(arr[i]);
                    }
                }
			}else{
                oCtl.arrSearch.push(arr[i]);
			}
		};


        var sItem = sHtmlItem;
		var sHTML='';
		for (var i=0; i<oCtl.arrSearch.length; i++){
			var sVal=jt.parseField(sItem,oCtl.arrSearch[i]);
			if (sVal=='') sVal='&nbsp;';
			var sTpl='<div class="Input_Select_List_Item" onmouseover="jt.addClass(this,\'Input_Select_List_Item_Over\')" onmouseout="jt.removeClass(this,\'Input_Select_List_Item_Over\')" onclick="this.parentNode.ownerInput.selectItem(this)" idx="'+i.toString()+'">' + sVal + '</div>';
			sHTML+=sTpl;
			//sHTML += jt.parseField(sTpl,oCtl.arrSearch[i]);
		};
		oList.innerHTML=sHTML;

        if(typeof(jtAfterInputSelectShowData)=='function') jtAfterInputSelectShowData(oCtl);

        var sVal = oCtl.value;
		var sVal2= ''; if (oInput2) sVal2=oInput2.value;
		if ( (sVal!='') || (sVal2!='') ){ //选中默认
			arr = oCtl.arrSearch;
			for (var i=0; i<arr.length; i++){
				var bFind=true;
				if ((sVal!='') && (sVal!=jt.parseField(sField,arr[i]))) bFind=false;
				if ((bFind) && (sVal2!='') && (sVal2!=jt.parseField(sField2,arr[i]))) bFind=false;
				if (bFind){
					oCtl.selectItem(i);
					break;
				};
			};
		}else if(sKey==''){
			//[Attr] DefaultIndex###当值为空时默认选中第几个选项
			var idx=jt.getAttr(oCtl,'DefaultIndex',-1);
			if (idx>-1) oCtl.selectItem(idx);
		};
		if (oCtl.arrSearch.length==0) { oPop.hide(0); return; };
		if (sKey!='') oPop.popup(oCtl);
	};

    //设置光标位置
	function setCaretPosition(ctrl, pos){
		if (ctrl.setSelectionRange){
			ctrl.focus();
			ctrl.setSelectionRange(pos,pos);
		}else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		};
	};

    oCtl._onkeydown = function(){
		//if (oPop.style.display=='none') return;
		var keyCode=event.keyCode||event.charCode;
		if ((!bUpDownKey) || ((keyCode!=38) && (keyCode!=40)) ) return;
		var arr=oCtl.arrSearch;
		if (arr.length==0) return;
		if (!jt.bIE) setTimeout(function(){ setCaretPosition(oCtl,oCtl.value.length);}, 0);
		var bUp=keyCode==38;
		if (oPop.style.display=='none') oPop.popup(oCtl);
		var iTem = iCurIdx + (bUp?-1:1);
		if (iTem<0) iTem=arr.length-1;
		if (iTem>=arr.length) iTem=0;
		oCtl.selectItem(iTem,false);
	};
	var timSearch;
	oCtl._onpaste = function(){ setTimeout(oCtl._onkeyup,100) };
	oCtl._onkeyup = function(){
		//if (oPop.style.display=='none') return;
		var keyCode=0;
		try { keyCode=event.keyCode||event.charCode; }catch(e){};
		var k_Return=13; var k_Esc=27;
		//var k_Back=8; var k_Space=32; var k_Left=37; var k_Up=38; var k_Right=39; var k_Down=40; var k_Del=46;
		if (keyCode==k_Esc){
			//oCtl.value=sKeyOld;
			oPop.hide(0);
			return;
		};
		//if (keyCode==k_Return){ oPop.hide(0); return; };
		if (arrSearchField.length==0) return;  //以下处理过滤功能

        if ((keyCode>40) || (keyCode<37)){
			if (oCtl.value!=sKeyOld){
				clearTimeout(timSearch);
				timSearch = setTimeout( function(){
					if (oInput2) oInput2.value = '';
					oCtl.showData(oCtl.value);
				},100);
			};
		};
	};


    //[Func] selectItem(idx)###选择项|||<code>jtAfterInputSelectSelectItem (oComp, jsonItem, idx) </code>页面可实现此方法List加载数据前，将会触发
	oCtl.selectItem = function (idx, bHidePop){
		var objs=jt._('[children]div.Input_Select_List_Item',oList);
		if (typeof(idx)=='number') idx=objs[idx];
		for (var i=0;i<objs.length;i++) jt.removeClass(objs[i],'Input_Select_List_Item_Sel');
		for (var i=0;i<objs.length;i++){
			if (objs[i]!=idx) continue;
			iCurIdx=i;
			oCtl.selectedIndex = i+1;//+1为了和DropDown_Select的selectedIndex 相同
			jt.addClass(objs[i],'Input_Select_List_Item_Sel');
			var jsonItem=oCtl.arrSearch[i];
			oCtl.value= jt.parseField(sField,jsonItem);
			if (oInput2) oInput2.value = jt.parseField(sField2,jsonItem);
			if(typeof(jtAfterInputSelectSelectItem)=='function') jtAfterInputSelectSelectItem(oCtl,jsonItem,i);
			if (jt.getDefVal(bHidePop,true)){
				oPop.hide(0);
			}else{
				if (listHeight>1){
					if (objs[i].offsetTop < oList.scrollTop ){ //在上方
						oList.scrollTop = objs[i].offsetTop;
					};
					if (objs[i].offsetTop > (oList.scrollTop+listHeight-objs[i].offsetHeight) ){ //在上方
						oList.scrollTop = objs[i].offsetTop - listHeight + objs[i].offsetHeight;
					};
				};
			};
			if (oCtl.onchange) { try{oCtl.onchange(); }catch(e){} };
			break;
		};
	};

    //[Func] 组件初始化
	oCtl.init = function(){

        oCtl.arrSearch=[];
		sKeyOld = oCtl.value;
		bUpDownKey = jt.getAttr(oCtl,'UpDownKey',true);
		sField=jt.getAttr(oCtl,'Field','{text}');
		sHtmlItem=jt.getAttr(oCtl,'HtmlItem',sField);
		if (jt.getAttr(oCtl,'Input2')!='') {
			oInput2=jt._('#'+jt.getAttr(oCtl,'Input2'));
			sField2=jt.getAttr(oCtl,'Field2',sField);
		};

		//创建List
		oList = document.createElement('div');
		oList.className = 'Input_Select_List';
		oList.ownerInput=oCtl;

		listWidth=jt.getAttr(oCtl,'ListWidth',oCtl.offsetWidth);
		oList.style.width = listWidth<1?'':(listWidth+'px');
		listHeight=jt.getAttr(oCtl,'ListHeight',150);
		oList.style.height = listHeight<1?'':(listHeight+'px');

        var sSearchField=jt.getAttr(oCtl,'SearchField');
		if (sSearchField!='') {
			arrSearchField=sSearchField.split(',');
			jt.addEvent(oCtl,'onpaste',oCtl._onpaste);
		};
		jt.addEvent(oCtl,'onkeyup',oCtl._onkeyup);
		jt.addEvent(oCtl,'onkeydown',oCtl._onkeydown);


        //[Attr] AutoDropDown###控件自动下拉, 为true获得焦点或点击时自动下拉, 为false时双击下拉 (默认true)
		var sEvent = (jt.getAttr(oCtl,'AutoDropDown',true)?'onfocus,onclick':'ondblclick');

        //[Attr] ContainerID###所在容器ID,  当控件置于某 overflow:auto  的 DIV 时, 将些属性设置为此DIV
		//创建弹出框
		oPop = jt.PopFrame.regPopObject(oCtl,oList,sEvent,'onblur', jt.getAttr(oCtl,'ContainerID'));
		oPop.style.zIndex= window._jt_Window_zIndex+100;
		jt.addClass(oPop,'PopFrameTemp'); //临时弹出
		oPop.beforePopup = function(x, y, jOffset){
			listWidth=jt.getAttr(oCtl,'ListWidth',oCtl.offsetWidth);
			oList.style.width = listWidth<1?'':(listWidth+'px');
			return oCtl.arrSearch.length>0;
		};
		oPop.intDelayShow=100;

        //[Attr] AutoLoadData###控件自动加载数据 (默认true)
		if (jt.getAttr(oCtl,'AutoLoadData',true)) oCtl.loadData();
	};
	oCtl.init();


    jt.addEvent(window,'onunload',function (){  //清除内存
		oInput2=null;
		oList.ownerInput=null;
		oCtl.arrSearch=null;
		oCtl.selectItem=null;
		oCtl.init = null;
		oCtl.loadData = null;
		oCtl.showData = null;
		oCtl._onkeydown = null;
		oCtl._onkeyup = null;
		oCtl._onpaste = null;

        oList.parentNode.removeChild(oList);
	});
};

jt.PluginList.push('DropDown_Select');
jt.DropDown_Select = {};
jt.DropDown_Select.TagName = ['select'];

jt.DropDown_Select.FormatUI = function (oCtl) {
    ////objSelect.options[objSelect.length] = new Option( " 你好 " , " hello " );

	//[Attr] OptionText###用于OPTION的显示内容 (默认值 '{text}')
	//[Attr] OptionValue###用于OPTION的Value (默认值 与OptionText相同)
	var sOptionText=''; var sOptionValue='';
	//[Attr] DefaultValue###原始值
	//[Attr] DefaultValueJS###原始值JS (执行JS返回值做为原始 值如:'self.getSystemID()')
	//[Attr] DefaultIndex###当值为空时默认选中第几个选项 (仅当DefaultValue为空时生效)
	var sDefValue=''; var sDefValueJS=''; var iDefIndex=-1;

    //[Attr] Data###数据
	//[Attr] URLData###数据URL
	//[Attr] JSData###数据源，调用JS，返回字符串或JSON


    //[Attr] Loading###是否正在加载数据 (只读)
	oCtl.Loading=false;

    //[Func] 加载json数据 (sURL:要加载的URL或JSON对象) |||本函数提供如下接管函数：|||<code>jtBeforeDropDownSelectLoadData (oComp) </code>页面可实现此方法List加载数据前，将会触发|||<code>jtAfterDropDownSelectLoadData (oComp) </code>页面可实现此方法List数据并加载完后，将会触发|||<code>jtAfterDropDownSelectShowData (oComp) </code>页面可实现此方法List数据显示完后，将会触发|||<code>jtAfterDropDownSelectAddOption(oComp, newOption, jsonItem)</code>添加Option之后触发<hr><code>jtString2JtDataFormat (oComp, sJson) </code>页面可实现此方法来将请求返回的字串转为jt的标准JSON<br><code>jtInitJtDataItem (oComp, jsonItem, idx) </code>页面可实现此方法 自行处理 JSON中 data 的每个项
	oCtl.loadData = function (sURL){
		oCtl.Loading=true;
		oCtl.options.length = 0;
        oCtl.options[oCtl.options.length] = new Option('正在加载...', sDefValue);
		if(typeof(jtBeforeDropDownSelectLoadData)=='function') jtBeforeDropDownSelectLoadData(oCtl);
		jt.loadDataForComponent(oCtl, {URLData:sURL, StartNO:0, Page:1}, function (json){
			//[Attr] FirstItem###下拉项第一条 （加载完数据后，自动在前面加入此条数据，如下拉选择框中常用的空值“请选择”
			oCtl.Loading=false;
			var sFirstItem=jt.getAttr(oCtl,'FirstItem');
			if (sFirstItem!='') json.data.splice(0,0,jt.Str2Json(sFirstItem));
			oCtl.json=json;
			if(typeof(jtAfterDropDownSelectLoadData)=='function') jtAfterDropDownSelectLoadData(oCtl);
			oCtl.showData();
			if (sFirstItem!='') json.data.splice(0,1);
		});
	};

    //显示数据
	oCtl.showData = function (){
		if (!oCtl.json) return;
		var arr=oCtl.json.data;
		sOptionText=jt.getAttr(oCtl,'OptionText','{text}');
		var strTem=sOptionText;
		if ((arr.length>0) && (typeof(arr[0].id)!='undefined')) strTem='{id}';
		sOptionValue=jt.getAttr(oCtl,'OptionValue',strTem);

        sDefValue=jt.getAttr(oCtl,'DefaultValue','');
		sDefValueJS=jt.getAttr(oCtl,'DefaultValueJS','');
		if (sDefValueJS!='') sDefValue=eval(sDefValueJS);
		iDefIndex=jt.getAttr(oCtl,'DefaultIndex',-1);
		oCtl.options.length = 0;
		//[Attr] ShowGroup###分组显示 (默认值 false)
		var bShowGroup=jt.getAttr(oCtl,'ShowGroup',false);
		if (bShowGroup){ //按组显示
			for (var i=0; i<arr.length; i++) {
				var group=document.createElement('OPTGROUP');
				group.label = jt.parseField(sOptionText,arr[i]);
				oCtl.appendChild(group);
				if(typeof(jtAfterDropDownSelectAddOption)=='function') jtAfterDropDownSelectAddOption(oCtl, group, arr[i]);
				if (typeof(arr[i].children)!='object') continue;
				var arrSub=arr[i].children;
				for (var j=0; j<arrSub.length; j++) {
					var sText = jt.parseField(sOptionText,arrSub[j]);
					var sVal = jt.parseField(sOptionValue,arrSub[j]);
                    var newOpt = new Option(sText, sVal, (sVal == sDefValue), (sVal == sDefValue));
					if (jt.bIE){
						oCtl.options[oCtl.options.length] = newOpt;
					}else{
						group.appendChild(newOpt);
					};
					if(typeof(jtAfterDropDownSelectAddOption)=='function') jtAfterDropDownSelectAddOption(oCtl, newOpt, arrSub[j]);
				};
			};
		}else{
			for (var i=0; i<arr.length; i++) {
				var sText = jt.parseField(sOptionText,arr[i]);
				var sVal = jt.parseField(sOptionValue,arr[i]);
                var newOpt = new Option(sText, sVal, (sVal == sDefValue), (sVal == sDefValue));
				oCtl.options[oCtl.options.length] = newOpt;
				if(typeof(jtAfterDropDownSelectAddOption)=='function') jtAfterDropDownSelectAddOption(oCtl, newOpt, arr[i]);
			};
		};
		if ((jt.bIE6) && (sDefValue!='')){ oCtl.value = sDefValue; }; //解决IE6下默认值选择错误的Bug(IE6本身存在的Bug,当有OPTGROUP时)
		if ((sDefValue=='') && (iDefIndex!=-1)){
            oCtl.selectedIndex = iDefIndex;
			if (oCtl.onchange) oCtl.onchange();
		};
		if(typeof(jtAfterDropDownSelectShowData)=='function') jtAfterDropDownSelectShowData(oCtl);
		if(typeof(oCtl.afterShowData)=='function') oCtl.afterShowData(); //未公开接口
	};


    //[Func] 组件初始化
	oCtl.init = function(){
		sDefValue=jt.getAttr(oCtl,'DefaultValue','');
		sDefValueJS=jt.getAttr(oCtl,'DefaultValueJS','');
		iDefIndex=jt.getAttr(oCtl,'DefaultIndex',-1);
		//[Attr] AutoLoadData###控件自动加载数据 (默认true)
		if (jt.getAttr(oCtl,'AutoLoadData',true)) oCtl.loadData();
	};
	oCtl.init();


    jt.addEvent(window,'onunload',function (){  //清除内存
		oInput2=null;
		oCtl.init = null;
		oCtl.loadData = null;
		oCtl.showData = null;
	});
};

/*<desc>列表控件</desc>*/
jt.PluginList.push('List');
jt.List = {};
jt.List.TagName = ['div'];

jt.List.FormatUI = function (oDiv){
	jt.addClass(oDiv,'jtList');
	//[Attr] ShowPageBar###显示翻页信息 ("true","false","auto"，默认"auto")|||<code>jtListGoPage (oComp,iStartNO, iPage) </code>页面可实现此方法接管内置的翻页函数
	var sShowPageBar=jt.getAttr(oDiv,'ShowPageBar','auto');
	//[Attr] PageStyle###翻页显示样式，参见PageBar组件PageStyle属性 (如未设置PageStyle属性,可在页面上定义变量JTCST_ListPageStyle,适用于全系统统一样式)

	//[Attr] HTML###HTML模板，用于循环解析，也可使用&lt;xmp class="html"&gt;&lt;/xmp&gt;代替
	if (jt.getAttr(oDiv,'html')=='') jt.setAttr(oDiv,'html',jt.getAttrAndXMP(oDiv,'html')); //初始化时将XMP属性复制到属性上

	//[Attr] ListStyle###列表样式，预计设置样式(默认 "{CST_LISTSTYLE_20}")，<a href="javascript:ShowHideNext(_('#divCommentConst'));void(0);">详细参见常量表</a>
	var sListStyle = '';//jt.getAttr(oDiv,'ListStyle','{CST_LISTSTYLE_1}');
	function initListStyle(){
		var htmTpl=jt.getAttr(oDiv,'html');
		sListStyle = jt.getAttr(oDiv,'ListStyle','{CST_LISTSTYLE_20}');
		for (var i=0;i<40;i++){
			try{
				var varSty=eval('jt.Const.CST_LISTSTYLE_'+i.toString());
				var re = new RegExp('{CST_LISTSTYLE_'+i.toString()+'}','ig');
				sListStyle = sListStyle.replace(re, varSty);
			}catch(e){};
		};
		sListStyle=sListStyle.replace(/{HtmlTemplate}/ig, htmTpl);
	};

    //[Attr] Data###数据，也可使用&lt;xmp class="data"&gt;&lt;/xmp&gt;代替
	if (jt.getAttr(oDiv,'data')=='') jt.setAttr(oDiv,'data',jt.getAttrAndXMP(oDiv,'data')); //初始化时将XMP属性复制到属性上
	//[Attr] URLData###数据URL
	//[Attr] JSData###数据源，调用JS，返回字符串或JSON

	//[Attr] SearchField###要搜索的字段
	//[Attr] SearchInput###搜索绑定输入框
	if (jt.getAttr(oDiv,'SearchInput')!=''){
		var oSearch=jt._('#'+jt.getAttr(oDiv,'SearchInput'));
		oSearch.onkeyup = function (){if (event.keyCode==13) oDiv.search(this.value); };
	};

    //[Const]
	jt.Const.CST_LISTSTYLE_10 = '{HtmlTemplate}';  //最简单拼接
    //[Const]
	jt.Const.CST_LISTSTYLE_11 = '<span onclick="parentNode.clickItem(this);">{HtmlTemplate}</span>';
    //[Const]
	jt.Const.CST_LISTSTYLE_12 = '<span onclick="parentNode.selectItem(this);parentNode.clickItem(this);">{HtmlTemplate}</span>';
	//[Const] 3
	jt.Const.CST_LISTSTYLE_20 = '<div class="jListItem" onclick="parentNode.clickItem(this);" '+   //单行，支持mouseover时变色
			'onmouseover="jt.addClass(this,\'jListItem_Over\');" '+
			'onmouseout="jt.removeClass(this,\'jListItem_Over\');">{HtmlTemplate}</div>';
	//[Const] 3
	jt.Const.CST_LISTSTYLE_21 = '<div class="jListItem" onclick="parentNode.selectItem(this);parentNode.clickItem(this);" '+  //单选
			'onmouseover="jt.addClass(this,\'jListItem_Over\');" '+
			'onmouseout="jt.removeClass(this,\'jListItem_Over\');">{HtmlTemplate}</div>';
	//[Const] 3
	jt.Const.CST_LISTSTYLE_22 = '<div class="jListItem" onclick="parentNode.selectItem(this,false);parentNode.clickItem(this);" '+ //多选
			'onmouseover="jt.addClass(this,\'jListItem_Over\');" '+
			'onmouseout="jt.removeClass(this,\'jListItem_Over\');">{HtmlTemplate}</div>';

 	//[Func] 加载json数据 (sURL:要加载的URL或JSON对象) |||本函数提供如下接管函数：|||<code>jtBeforeListLoadData (oComp) </code>页面可实现此方法List加载数据前，将会触发|||<code>jtAfterListLoadData (oComp) </code>页面可实现此方法List数据并加载完后，将会触发|||<code>jtAfterListShowData (oComp) </code>页面可实现此方法List数据显示完后，将会触发<hr><code>jtString2JtDataFormat (oComp, sJson) </code>页面可实现此方法来将请求返回的字串转为jt的标准JSON<br><code>jtInitJtDataItem (oComp, jsonItem, idx) </code>页面可实现此方法 自行处理 JSON中 data 的每个项
	oDiv.loadData = function (sURL,iStartNO, iPage){
		if(typeof(jtBeforeListLoadData)=='function') jtBeforeListLoadData(oDiv);
		initListStyle();
		jt.loadDataForComponent(oDiv, {URLData:sURL, StartNO:iStartNO, Page:iPage}, function (json){
			oDiv.json=json;
			if(typeof(jtAfterListLoadData)=='function') jtAfterListLoadData(oDiv);
			oDiv.showData('');
		});
	};

    //[Func] 搜索数据
	oDiv.search = function (sKey){ oDiv.showData(sKey); };

    //显示数据
	oDiv.showData = function (sKey){
		oDiv.arrSearch=[];
		sKey = jt.getDefVal(sKey,'').toLowerCase();
		var sSearchField=jt.getAttr(oDiv,'SearchField');
		if (sSearchField=='') {sKey=''}else{var arrFld=sSearchField.split(',');};
		var arr = oDiv.json.data; //jt.isArray(oDiv.json.data)?oDiv.json.data:oDiv.json;
		var sHTML='';
		for (var i=0; i<arr.length; i++){
			if ( (sKey!='') && ( arrFld.indexOfEx( function(item){ return arr[i][item].toString().toLowerCase().indexOf(sKey)>-1; } )==-1 ) ) continue;
			oDiv.arrSearch.push(arr[i]); oDiv.arrSearch[oDiv.arrSearch.length-1].json_idx=i;
			sHTML += jt.parseField(sListStyle,arr[i]);
		};
		oDiv.innerHTML = sHTML;
		if (sShowPageBar!='false'){
			jt.setAttr(oDivPage,'CurPage', oDiv.json.currentPage);
			jt.setAttr(oDivPage,'TotalCount', oDiv.json.totalCount);
			jt.setAttr(oDivPage,'PageSize', oDiv.json.pageSize);
			oDivPage.init();
			oDivPage.style.display= ( (oDivPage.TotalPage>1)||(sShowPageBar=='true') )?'':'none';
		};
		//[Attr] EmptyInfo###空信息内容，当加载数据为空时显示
		if ((jt.getAttr(oDiv,'EmptyInfo')!='') && (arr.length==0)) oDiv.innerHTML=jt.getAttr(oDiv,'EmptyInfo');
		if(typeof(jtAfterListShowData)=='function') jtAfterListShowData(oDiv);
		if(typeof(oDiv.AfterShowData)=='function') oDiv.AfterShowData();
		//[Attr] DefaultSelectItem###List加载完后默认选择条目 (数字，-1则不执行)
		var iDefItem=jt.getAttr(oDiv,'DefaultSelectItem',-1);
		if (iDefItem>-1){ oDiv.selectItem(iDefItem); oDiv.clickItem(iDefItem); };
	};

    //[Func] 选中项 (将选中项加入样式)，idx:数字型或对象，bOnlySelOne:只选中一项(默认true)，sClass:选中显示样式(默认jListItem_Sel)
	oDiv.selectItem = function (idx, bOnlySelOne, sClass){
        bOnlySelOne = jt.getDefVal(bOnlySelOne, true); //if (typeof(bOnlySelOne)!='boolean') bOnlySelOne=true;
		sClass = jt.getDefVal(sClass,'jListItem_Sel'); //if (typeof(sClass)!='string') sClass='jListItem_Sel';
		var objs=jt._('[children]',oDiv);
		if (typeof(idx)=='number') idx=objs[idx];
		if (bOnlySelOne) { for (var i=0;i<objs.length;i++) jt.removeClass(objs[i],sClass);};
		for (var i=0;i<objs.length;i++){
			if (objs[i]==idx) { jt.addClass(objs[i],sClass); return; };
		};
	};
	//[Func] 获取已选择的项,返回div数组
	oDiv.getSelectedItem = function(sClass){
        sClass = jt.getDefVal(sClass, 'jListItem_Sel');
        return jt._('[children]div.' + sClass, oDiv);
	};
  //[Func] 点击项(在模板中调用，参见常量CST_LISTSTYLE_11)idx:数字型或对象|||本函数提供如下接管函数：|||<code>jtAfterListItemClick (oComp, oItem, jsonItem, idx) </code>页面可实现此方法来处理ItemClick事件
	oDiv.clickItem = function (idx){
		if ((typeof(jtAfterListItemClick)!='function')&&(typeof(oDiv.AfterItemClick)!='function')) return;
		var objs=jt._('[children]',oDiv);
		if (typeof(idx)=='number') idx=objs[idx];
		for (var i=0;i<objs.length;i++){
			if (objs[i]!=idx) continue;
			var arr=oDiv.json.data;//jt.isArray(oDiv.json.data)?oDiv.json.data:oDiv.json;
			if (typeof(jtAfterListItemClick)=='function') jtAfterListItemClick(oDiv, objs[i], arr[oDiv.arrSearch[i].json_idx], i);
			if (typeof(oDiv.AfterItemClick)=='function') oDiv.AfterItemClick(objs[i], arr[oDiv.arrSearch[i].json_idx], i);
			break;
		};
	};

    //创建分页
	var oDivPage;
	function createPageBar(){
		if (oDivPage) return;
		if (!jt.PageBar) jt.loadPlugin('PageBar');
		oDivPage = document.createElement('div');
		oDivPage.className='List_PageBar';
		var sStyle=(typeof(JTCST_ListPageStyle)=='string')?JTCST_ListPageStyle:'{CST_PAGESTYLE_10}';
		jt.setAttr(oDivPage,'PageStyle',jt.getAttr(oDiv,'PageStyle',sStyle));
		jt.PageBar.FormatUI(oDivPage);

		oDivPage.funGoPage = function (iPage){
			if(typeof(jtListGoPage)=='function') {jtListGoPage(oDiv,(iPage-1)*oDiv.json.pageSize,iPage); return;};
			oDiv.loadData('',(iPage-1)*oDiv.json.pageSize,iPage);
		};
		oDivPage.style.display='none';
		if (oDiv.parentNode.lastChild==oDiv){ oDiv.parentNode.appendChild(oDivPage); }else{ oDiv.parentNode.insertBefore(oDivPage,oDiv.nextSibling); };
    }

	//[Func] 组件初始化
	oDiv.init = function(){
		if (sShowPageBar!='false') createPageBar();
		//[Attr] AutoLoadData###控件自动加载数据 (默认true)
		if (jt.getAttr(oDiv,'AutoLoadData',true)) oDiv.loadData();
	};
	oDiv.init();

	jt.addEvent(window,'onunload',function (){  //清除内存
		oDiv.json=null;
		oDiv.arrSearch=null;
		oDiv.loadData=null;
		oDiv.showData=null;
		oDiv.itemClick=null;
		oDiv.selectItem=null;
		oDiv.getSelectedItem=null;
		oDiv.search = null;
		try{ oDivPage.funGoPage=null; }catch(e){};
		try{ oSearch.onkeyup=null; }catch(e){};
		try{ oDivPage.parentNode.removeChild(oDivPage); }catch(e){};
		oDiv.init = null;
	});
};

/*<desc>消息类</desc>*/
jt.PluginList.push('Msg');
jt.Msg = {};
jt.Msg.TagName = [];

window.timJTMsgClose=null; window.timJTMsgCloseCap=null;

//[Func] jt.Msg.showMsg (sMessage, iTimeClose)###显示消息|||<code>sMessage</code>:消息内容 [必要参数]|||<code>iTimeClose</code>:自动关闭时间 (单位秒,默认为:4)
jt.Msg.showMsg = function (sMessage, iTimeClose){
	iTimeClose=jt.getDefVal(iTimeClose,3);
	var oDiv=jt._('#divJTMsgMsg');
	if (!oDiv){
		var oDiv = document.createElement("div");
		oDiv.id = 'divJTMsgMsg';
		document.body.appendChild(oDiv);
		oDiv.onclick = function(){this.style.display='none'};
    }

	var sHTML='';
	if (jt.bIE6) {
		sHTML += '<iframe class="PopFrameIE6IFrame" frameborder=0 style="position:absolute; visibility:inherit; top:0px; left:0px; width:110%; height:101%; z-index:-1; filter: alpha(opacity = 0); "></iframe>';
	};
	sHTML += sMessage;
	sHTML += '';

    oDiv.innerHTML=sHTML;
	oDiv.style.display='inline';
	oDiv.style.left = parseInt((document.body.clientWidth-oDiv.offsetWidth)/2) + 'px';
	oDiv.style.top = (jt.doc.getScrollTop() + parseInt((jt.doc.getClientHeight()-oDiv.offsetHeight)/2)) + 'px';
	oDiv.style.zIndex= window._jt_Window_zIndex+100;

    setTimeout(function(){
		oDiv.style.display='none';
	},iTimeClose*1000);
};

//[Func] jt.Msg.alert (sMessage, callback, sTitle, iTimeClose)###Alert 消息框|||<code>sMessage</code>:消息内容 [必要参数]|||<code>callback</code>:回调函数|||<code>sTitle</code>:标题 (默认为:提示)|||<code>iTimeClose</code>:自动关闭时间 (单位秒,默认为:0 不关闭)
jt.Msg.alert = function (sMessage, callback, sTitle, iTimeClose){
	sTitle=jt.getDefVal(sTitle,'提示'); iTimeClose=jt.getDefVal(iTimeClose,0);
	var oDiv=jt._('#divJTMsgAlert');
	if (!oDiv){ var oDiv = document.createElement("div"); oDiv.id = 'divJTMsgAlert'; document.body.appendChild(oDiv); };
	var sHTML='';
	sHTML += '<table width="100%" style="height:100%;" border="0" cellspacing="0" cellpadding="0">';
	sHTML += '	<tr>';
	sHTML += '		<td style="padding-left:15px;" onclick="clearTimeout(window.timJTMsgClose); clearTimeout(window.timJTMsgCloseCap); jt._(\'#JTMsgAlertButton\').value=\'确定\';">';
	sHTML += '			<table border="0" cellspacing="0" cellpadding="0">';
	sHTML += '				<tr>';
	sHTML += '					<td class="MsgAlertIconTD"><div class="MsgAlertIcon"></div></td>';
	sHTML += '					<td class="MsgContentTD">'+sMessage+'</td>';
	sHTML += '				</tr>';
	sHTML += '			</table>';
	sHTML += '		</td>';
	sHTML += '	</tr>';
	sHTML += '	<tr>';
	sHTML += '		<td class="MsgAlertBottom"><input id="JTMsgAlertButton" type="button" class="MsgAlertButton" value="确定" onclick="jt.Window.findWindow (\'winJTMsgAlert\').hide()"></td>';
	sHTML += '	</tr>';
	sHTML += '</table>';
	oDiv.innerHTML = sHTML;
	var oWin=jt.Window.newWindow( {
		id:'winJTMsgAlert', obj:oDiv, title:sTitle,
		maskLayer:true, maxButton:false, sizeable:false, refreshButton:false,
		width:300, height:160
	});
	oWin.setHeight(160);
	oWin.bringToFront();
	var defBtn=jt._('#JTMsgAlertButton');
	defBtn.focus();
	setTimeout(function(){try{ defBtn.focus(); }catch(e){}},10);

    if (typeof (callback) == 'function') oWin.afterHide = function () {
		clearTimeout(window.timJTMsgClose); clearTimeout(window.timJTMsgCloseCap);
		setTimeout(callback,0);
	};

    if (iTimeClose>0) {
		window.timJTMsgClose = setTimeout(function(){oWin.hide()}, iTimeClose*1000);

        defBtn.value = '确定 [' + iTimeClose + ']';
		window.timJTMsgCloseCap = setInterval(function(){ iTimeClose--; 	defBtn.value = '确定 [' + iTimeClose + ']'; }, 1000);
	};

    jt.addEvent(window,'onunload',function (){ //清除内存
		try{ document.body.removeChild(oDiv); }catch(e){};
	});
};


//[Func] jt.Msg.confirm (sMessage, callback, sTitle, iTimeClose, bDefYes)###Confirm 询问框|||<code>sMessage</code>:消息内容 [必要参数]|||<code>callback</code>:回调函数,回调传回boolean型参数|||<code>sTitle</code>:标题 (默认为:确认)|||<code>iTimeClose</code>:自动关闭时间 (单位秒,默认为:0 不关闭)|||<code>bDefYes</code>:是否默认选中确定 (默认true,选中有确定按钮)
jt.Msg.confirm = function (sMessage, callback, sTitle, iTimeClose, bDefYes){
	sTitle=jt.getDefVal(sTitle,'确认'); iTimeClose=jt.getDefVal(iTimeClose,0); bDefYes=jt.getDefVal(bDefYes,true);
	var oDiv=jt._('#divJTMsgConfirm');
	if (!oDiv){ var oDiv = document.createElement("div"); oDiv.id = 'divJTMsgConfirm'; document.body.appendChild(oDiv); };
	var sHTML='';
	sHTML += '<table width="100%" style="height:100%;" border="0" cellspacing="0" cellpadding="0">';
	sHTML += '	<tr>';
	sHTML += '		<td style="padding-left:15px;" onclick="clearTimeout(window.timJTMsgClose); clearTimeout(window.timJTMsgCloseCap); jt._(\'#JTMsgConfirmButton_OK\').value=\'确定\'; jt._(\'#JTMsgConfirmButton_Cancel\').value=\'取消\';">';
	sHTML += '			<table border="0" cellspacing="0" cellpadding="0">';
	sHTML += '				<tr>';
	sHTML += '					<td class="MsgConfirmIconTD"><div class="MsgConfirmIcon"></div></td>';
	sHTML += '					<td class="MsgContentTD">'+sMessage+'</td>';
	sHTML += '				</tr>';
	sHTML += '			</table>';
	sHTML += '		</td>';
	sHTML += '	</tr>';
	sHTML += '	<tr>';
	sHTML += '		<td class="MsgConfirmBottom"><input id="JTMsgConfirmButton_OK" type="button" class="MsgConfirmButton" value="确定" onclick="window.JTMsgConfirmResult=true;jt.Window.findWindow (\'winJTMsgConfirm\').hide()"> <input id="JTMsgConfirmButton_Cancel" type="button" class="MsgConfirmButton" value="取消" onclick="jt.Window.findWindow (\'winJTMsgConfirm\').hide()"></td>';
	sHTML += '	</tr>';
	sHTML += '</table>';
	oDiv.innerHTML = sHTML;
	var oWin=jt.Window.newWindow( {
		id:'winJTMsgConfirm', obj:oDiv, title:sTitle,
		maskLayer:true, maxButton:false, sizeable:false, refreshButton:false,
		width:300, height:160
	});
	oWin.bringToFront();
	var defBtn=bDefYes?jt._('#JTMsgConfirmButton_OK'):jt._('#JTMsgConfirmButton_Cancel');
	defBtn.focus();

    window.JTMsgConfirmResult=false;

    if (typeof (callback) == 'function') oWin.afterHide = function () {
		clearTimeout(window.timJTMsgClose); clearTimeout(window.timJTMsgCloseCap);
		setTimeout(function(){ callback(window.JTMsgConfirmResult); },0);
	};

    if (iTimeClose>0) {
		window.timJTMsgClose = setTimeout(function(){defBtn.click()}, iTimeClose*1000);
		defBtn.value = (bDefYes?'确定':'取消') + ' [' + iTimeClose + ']';
		window.timJTMsgCloseCap = setInterval(function(){ iTimeClose--; 	defBtn.value = (bDefYes?'确定':'取消') + ' [' + iTimeClose + ']'; }, 1000);
	};

    jt.addEvent(window,'onunload',function (){ //清除内存
		try{ document.body.removeChild(oDiv); }catch(e){};
	});
};

//[Func] jt.Msg.prompt (sMessage, callback, sDefaultValue, sTitle)###prompt 提示输入框询问框
jt.Msg.prompt = function (sMessage, callback, sDefaultValue, sTitle){
	//未完成
};

//[Func] jt.Msg.showLoading (bShow)###显示正在加载|||<code>bShow</code>:显示隐藏, bShow为字符串时, 显示相应文字 (默认true)
jt.Msg.showLoading = function (bShow){
	var sText = (typeof(bShow)=='string')?bShow:'正在加载，请稍候……';
	var bShow = (typeof(bShow)=='boolean')?bShow:true;
	var oDiv=jt._('#divJTMsgLoading');
	if (bShow){
		if (!oDiv){
			var oDiv = document.createElement("div");
			oDiv.id = 'divJTMsgLoading';
			document.body.appendChild(oDiv);
		};
		var sHTML='';
		if (jt.bIE6) {
			sHTML += '<iframe class="PopFrameIE6IFrame" frameborder=0 style="position:absolute; visibility:inherit; top:0px; left:0px; width:110%; height:110%; z-index:-1; filter: alpha(opacity = 0); "></iframe>';
		};
		sHTML += sText;
		oDiv.innerHTML=sHTML;
		oDiv.style.display='inline';
		oDiv.style.zIndex= window._jt_Window_zIndex+100;
	}else{
		if (oDiv) oDiv.style.display='none';
	};
};


/*<desc>
Outlook 2003 导航菜单
</desc>*/
jt.PluginList.push('OutlookMenu');
jt.OutlookMenu = {};
jt.OutlookMenu.TagName = ['div'];

jt.OutlookMenu.FormatUI = function (oCtl){
	//[Attr] IconPath###图标路径
	var sIconPath='';
	//[Attr] IconHeight###图标高度（宽度与高度一样）
	var sIconHeight='';
	//[Attr] SmallIconHeight###底部图标高度（宽度与高度一样）
	var sSmallIconHeight='';
	//[Attr] 当前选中标签的序号 (只读)
	oCtl.CurItemIndex=-1;

    var oTab;

	//[Func] 获取内容单元格
	oCtl.getContentCell = function () {return oTab.rows[1].cells[0];};

	//[Func] 获取当前标签的IFrame (sParam,可为序号, 或标题, 不传则返回当前iFrame)
	oCtl.getIFrame = function(sParam){
		var items=jt._('TD.OLM_List_Item',oTab);
		var iframe_id='';
		if (typeof(sParam)=='number') iframe_id=jt.getAttr(item[sParam],'IFrame_id');
		if (typeof(sParam)=='string') {
			for (var i=0; i<items.length; i++){
				if (sParam==jt.getAttr(item[i],'Title')) { iframe_id=jt.getAttr(item[i],'IFrame_id'); break;};
			};
		};
		if (iframe_id=='') iframe_id=jt.getAttr(jt._('TD.OLM_List_Item_Sel',oTab)[0],'IFrame_id');

        if (document.frames) return document.frames[iframe_id];
		return jt._('#'+iframe_id).contentWindow;
	};

    //[Func] 选择标签
	oCtl.selectItem = function(idx){
		if (typeof(idx)=='object') {
			if (idx.nodeName=='TD') idx=idx.parentNode.rowIndex-3;
			if (idx.nodeName=='DIV'){
				var objs=jt._('DIV.OLM_Bottom_Item',idx.parentNode);
				for(var i=0; i<objs.length; i++) { if (objs[i]==idx){idx=i; break;} };
			};
		};

        var items=jt._('TD.OLM_List_Item',oTab);
		if (typeof(idx)=='string'){
			for(var i=0; i<items.length; i++) {
				return this.trim();
			};
		};
		oCtl.CurItemIndex=idx;

        for(var i=0; i<items.length; i++) { jt.removeClass(items[i],'OLM_List_Item_Sel'); };
		jt.addClass(items[idx],'OLM_List_Item_Sel');

		var itemsB=jt._('DIV.OLM_Bottom_Item',oTab);
		for(var i=0; i<itemsB.length; i++) { jt.removeClass(itemsB[i],'OLM_Bottom_Item_Sel'); };
		jt.addClass(itemsB[idx],'OLM_Bottom_Item_Sel');

        var frms=jt._('IFRAME.OLM_Iframe',oTab);
		for(var i=0; i<frms.length; i++) { frms[i].style.display = i==idx?'':'none'; };

		var oTD=items[idx];
		oTab.rows[0].cells[0].innerHTML = oTD.innerHTML;
		if ( (frms.length>0)&&(frms[idx].src=='') ) { frms[idx].src=jt.getAttr(oTD,'URL'); };

        var sAfterClick=jt.getAttr(oTD,'AfterClick'); if (sAfterClick!='') eval(sAfterClick);
	};

    //[Func] 显示标签数|||本函数提供如下接管函数：|||<code>jtAfterOutlookMenuShowCount (iCount) </code>页面可实现此方法,当显示标签数变化后会触发
	oCtl.showCount = function(iCount){
		var bRaiseEvent=typeof(iCount)=='number';
		//[Attr] ItemCount###默认显示的标签数 (默认:-1[全部显示])
		if (typeof(iCount)!='number') iCount = jt.getAttr(oCtl,'ItemCount',-1);
		var items=jt._('TD.OLM_List_Item',oTab);
		var itemsB=jt._('DIV.OLM_Bottom_Item',oTab);
		if ( (iCount<0) || (iCount>items.length) ) iCount=items.length;
		//[Attr] intItemCount###当前显示标签数(只读)
		oCtl.intItemCount=iCount;
		for(var i=0; i<items.length; i++) {
			items[i].parentNode.style.display = i<iCount?'':'none';
			itemsB[i].style.display = i<iCount?'none':'';
		};
		oTab.rows[oTab.rows.length-1].style.display = iCount>=items.length?'none':'';
		if( bRaiseEvent && (typeof(jtAfterOutlookMenuShowCount)=='function')) jtAfterOutlookMenuShowCount(iCount);
	};

    //[Func] 添加标签
	oCtl.addItem = function(sTitle, sURL, sIcon, sIconSmall, sAfterClick){
		var oTR=oTab.insertRow(oTab.rows.length-1);
		var oTD=oTR.insertCell(0);
		oTR.className = oTD.className = 'OLM_List_Item';
		jt.setAttr(oTD,'Title',sTitle); jt.setAttr(oTD,'URL',sURL);
		jt.setAttr(oTD,'Icon',sIcon); jt.setAttr(oTD,'IconSmall',sIconSmall);
		jt.setAttr(oTD,'AfterClick',sAfterClick);
		sIconSmall=jt.getDefVal(sIconSmall,sIcon); sIconSmall = sIconPath+sIconSmall;
		sIcon = sIconPath+sIcon; //sIcon=jt.FixImgPngSrc(sIcon)
		oTD.innerHTML = '<img src="'+jt.FixImgPngSrc(sIcon,'scale')+'" '+ (sIconHeight==''?'':'width="'+sIconHeight+'"') +' align="absmiddle"> ' + sTitle;
		oTD.onmouseover=new Function('jt.addClass(this,\'OLM_List_Item_Over\')');
		oTD.onmouseout=new Function('jt.removeClass(this,\'OLM_List_Item_Over\')');
		oTD.onclick=new Function('jt._(\'[parent]div.OutlookMenu\',this).selectItem(this)');

        var oDiv = document.createElement('div');
		oDiv.className='OLM_Bottom_Item';
		oDiv.innerHTML = '<img src="'+jt.FixImgPngSrc(sIconSmall,'scale')+'"'+ (sSmallIconHeight==''?'':'width="'+sSmallIconHeight+'"') +'>';
		oDiv.title = sTitle;
		oDiv.onmouseover=new Function('jt.addClass(this,\'OLM_Bottom_Item_Over\')');
		oDiv.onmouseout=new Function('jt.removeClass(this,\'OLM_Bottom_Item_Over\')');
		oDiv.onclick=new Function('jt._(\'[parent]div.OutlookMenu\',this).selectItem(this)');
		oTab.rows[oTab.rows.length-1].cells[0].appendChild(oDiv);

        if (sURL!=''){
			var iframe_id='divIFrame_OutlookMenu_'+parseInt(Math.random()*10000000).toString();
			jt.setAttr(oTD,'IFrame_id',iframe_id);
			var oFrm = document.createElement('iframe');
			oFrm.id=iframe_id;
			oFrm.className='OLM_Iframe';
			oFrm.frameBorder=0; oFrm.style.width='100%'; oFrm.style.height='100%'; oFrm.style.display='none'; oFrm.style.border='none';
			oTab.rows[1].cells[0].appendChild(oFrm);
		};
	};

    //初始化分隔条
	var bMouseDown=false;
	var chaTop;
	var iShowCount_Save;//--保存当前显示的个数--
	var itemHeight;
	function initSplit(){
		oTab.rows[2].cells[0].innerHTML = '<div class="OLM_Split'+(jt.bIE6?'_IE6':'')+'">'+jt.TransparentImg+'</div>';
		var oSplit=oTab.rows[2].cells[0].childNodes[0];
		oSplit.onmousedown = function (e){
			e = e || event;
			chaTop = (e.clientY||0);
			iShowCount_Save = oCtl.intItemCount;//--保存当前显示的个数--
			itemHeight=oTab.rows[3].cells[0].offsetHeight;
			if (itemHeight==0) itemHeight=oTab.rows[oTab.rows.length-1].cells[0].offsetHeight;

			bMouseDown=true;
			if(oSplit.setCapture){ oSplit.setCapture(); }else if(window.captureEvents){ window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); };
			document.onselectstart = function(){return false;};
			document.onmousemove = function (e){
				e = e || event;
				var intTem = iShowCount_Save - parseInt((e.clientY-chaTop+27)/itemHeight);
				if (intTem<0) intTem=0;
				oCtl.showCount(intTem);
			};
			document.onmouseup   = function (){
				if(oSplit.releaseCapture){ oSplit.releaseCapture(); }else if(window.captureEvents){ window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP); };
				document.onmousemove = document.onmouseup = document.onselectstart = null;
			};
		};

	};

    //[Func] 组件初始化
	oCtl.init = function(){
		sIconPath= jt.parseURL(jt.getAttr(oCtl,'IconPath'));
		sIconHeight=jt.getAttr(oCtl,'IconHeight','');
		sSmallIconHeight=jt.getAttr(oCtl,'SmallIconHeight','');
		//创建主表格
		oTab = document.createElement('table');
		oTab.className = 'OLM_Table';
		oTab.border = 0; oTab.cellPadding = 0; oTab.cellSpacing = 0;
        for (var i = 0; i < 4; i++) {
			var oTR=oTab.insertRow(i);
			var oTD=oTR.insertCell(0);
			oTR.className=oTD.className=['OLM_Title','OLM_Content','OLM_Split','OLM_Bottom'][i];
		};
		oCtl.appendChild(oTab);
        initSplit();
		//初始化标签
		var objs=jt._('[children]div',oCtl);
		var iDef=0;
		for(var i=0; i<objs.length; i++) {
			objs[i].style.display='none';
			var sTitle = objs[i].innerHTML;
			//[Attr] URL###<em>标签属性</em>，标签内容
			var sURL = jt.getAttr(objs[i],'URL');
			//[Attr] Icon###<em>标签属性</em>，标签图标
			var sIcon = jt.getAttr(objs[i],'Icon');
			//[Attr] IconSmall###<em>标签属性</em>，标签小图标
			var sIconSmall = jt.getAttr(objs[i],'IconSmall',sIcon);
			//[Attr] AfterClick###<em>标签属性</em>，标签点击完后执行
			var sAfterClick=jt.getAttr(objs[i],'AfterClick'); //if (sAfterClick!='') eval(sAfterClick);
			oCtl.addItem(sTitle, sURL, sIcon, sIconSmall, sAfterClick);
			//[Attr] default###<em>标签属性</em>，是否默认选中此标签
			if (jt.getAttr(objs[i],'default',false)) iDef=i;
		};
		if (objs.length>0) oCtl.selectItem(iDef);  //选中默认标签
		oCtl.showCount();
	};
	oCtl.init();

	jt.addEvent(window,'onunload',function (){  //清除内存
		oCtl.init = null;
		oCtl.addItem = null;
		oCtl.showCount = null;
		oCtl.selectItem = null;
		oCtl.getIFrame = null;
	});
};

jt.PluginList.push('PageBar');
jt.PageBar = {};
jt.PageBar.TagName = ['div'];
//查找父节点为PageBar的节点
jt.PageBar._find = function (oChild) {
	var nod = oChild.parentNode;
	while (nod != null){
		if (nod.goPage) return nod;
		nod = nod.parentNode;
		if (nod == null) break;
	};
};
jt.PageBar.FormatUI = function (oDiv){
	//[Const] 5
    jt.Const.CST_PAGESTYLE_19 =
			'<a href="javascript:void(0);" onclick="jt.PageBar._find(this).goPage({curPage}-1);return false;" style="{FirstPageHide}">上一页</a>'+
			'<span class="PageBar_NavDisable" style="{FirstPageShow}">上一页</span> &nbsp;'+
			'<a href="javascript:void(0);" onclick="jt.PageBar._find(this).goPage({curPage}+1);return false;" style="{LastPageHide}">下一页</a>'+
			'<span class="PageBar_NavDisable" style="{LastPageShow}">下一页</span> &nbsp;';
	//[Const] 6
    jt.Const.CST_PAGESTYLE_10 =
        '<a href="javascript:void(0);" onclick="jt.PageBar._find(this).goPage(1);return false;" style="{FirstPageHide}">首页</a>' +
			'<span class="PageBar_NavDisable" style="{FirstPageShow}">首页</span> &nbsp;'+
			'{CST_PAGESTYLE_19}'+
			'<a href="javascript:void(0);" onclick="jt.PageBar._find(this).goPage({TotalPage});return false;" style="{LastPageHide}">尾页</a>'+
			'<span class="PageBar_NavDisable" style="{LastPageShow}">尾页</span>';
	//[Const] 3
    jt.Const.CST_PAGESTYLE_20 =
			'<input size="3" onkeyup="if (event.keyCode==13) jt.PageBar._find(this).goPage(this.value)" value="{CurPage}"> '+
			'<a href="javascript:void(0);" onclick="var o=jt.PageBar._find(this);o.goPage(jt._(\'input\',o)[0].value);return false;">GO</a>';
	//[Const] 3
    jt.Const.CST_PAGESTYLE_30 =
			'<select class="PageBar_SelPageSize" onchange="if(typeof(jtAfterPageBarChangePageSize)==\'function\') jtAfterPageBarChangePageSize(this);"><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="150">150</option><option value="200">200</option>'+
			'</select>';
	//[Const]
	jt.Const.CST_PAGESTYLE_1='{CurPage}/{TotalPage}页 共{TotalCount}条记录  {PageSize}条/页 {CST_PAGESTYLE_10} {CST_PAGESTYLE_20}';
	//[Const]
	jt.Const.CST_PAGESTYLE_2='{CurPage}/{TotalPage}页 &nbsp;&nbsp; {CST_PAGESTYLE_10}';

    //[Func] 组件初始化
	oDiv.init = function(){
		//[Attr] TotalCount###总记录数
		var TotalCount = oDiv.TotalCount = parseInt(jt.getAttr(oDiv,'TotalCount','0'));
		//[Attr] PageSize###每页记录数 (默认10)
		var PageSize = oDiv.PageSize = parseInt(jt.getAttr(oDiv,'PageSize','10'));
		//[Attr] TotalPage###总页数 (只读)
		var TotalPage = oDiv.TotalPage = parseInt(TotalCount/PageSize) + (TotalCount%PageSize>0?1:0);
		var CurPage = parseInt(jt.getAttr(oDiv,'CurPage','1'));
		CurPage = (CurPage<1)?1:((CurPage>TotalPage)?TotalPage:CurPage);
		//[Attr] CurPage###当前页
		oDiv.CurPage = CurPage;
		//[Attr] PageStyle###显示样式，可自定义，预计设置样式 (<a href="javascript:ShowHideNext(_('#divCommentConst'));void(0);">详细参见常量表</a>)： |||CST_PAGESTYLE_1='{CurPage}/{TotalPage}页 共{TotalCount}条记录   {PageSize}条/页 {CST_PAGESTYLE_10} {CST_PAGESTYLE_20}'|||CST_PAGESTYLE_10：包含首页、上一页、下一页、尾页|||CST_PAGESTYLE_19：包含上一页、下一页|||CST_PAGESTYLE_20：跳转
		var PageStyle = jt.getAttr(oDiv,'PageStyle','{CST_PAGESTYLE_10}');
		for (var i=0;i<40;i++){
			try{
				var varSty=eval('jt.Const.CST_PAGESTYLE_'+i.toString());
				var re = new RegExp('{CST_PAGESTYLE_'+i.toString()+'}','ig');
				PageStyle = PageStyle.replace(re, varSty);
			}catch(e){};
		};
		var sHTML = PageStyle;
		var strTem='';
		sHTML = sHTML.replace(/{CurPage}/ig, CurPage);
		sHTML = sHTML.replace(/{TotalPage}/ig, TotalPage);
		sHTML = sHTML.replace(/{TotalCount}/ig, TotalCount);
		sHTML = sHTML.replace(/{PageSize}/ig, PageSize);
		if (CurPage<2) { sHTML = sHTML.replace(/{FirstPageHide}/ig, 'display:none;');}else{ sHTML = sHTML.replace(/{FirstPageShow}/ig, 'display:none;'); };
		if (CurPage>=TotalPage) { sHTML = sHTML.replace(/{LastPageHide}/ig, 'display:none;');}else{ sHTML = sHTML.replace(/{LastPageShow}/ig, 'display:none;'); };
		oDiv.innerHTML = sHTML;
		var oSel=jt._('select.PageBar_SelPageSize',oDiv)[0];
		if (oSel) oSel.value=PageSize;
	};

    oDiv.goPage = function(iPage) {
		if (typeof(iPage)=='string') iPage=/\d+/.test(iPage)?parseInt(iPage):1;
		if (iPage<1) iPage=1;
		if (iPage>oDiv.TotalPage) iPage=oDiv.TotalPage;
				//[Attr] URL###跳转URL 例 URL="DataList.do?page={PageNum}&act=1" {PageNum}将会被替换为要跳转的页
		var URL=jt.getAttr(oDiv,'URL').replace(/{PageNum}/img, iPage);
				//[Attr] Action###执行脚本 Action="alert({PageNum})" {PageNum}将会被替换为要跳转的页
		var Action=jt.getAttr(oDiv,'Action').replace(/{PageNum}/img, iPage);
		if (Action!='') eval(Action);
		if (URL!='') self.location=URL;
		if (oDiv.funGoPage) oDiv.funGoPage(iPage);
	};
	oDiv.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		oDiv.goPage = null;
		oDiv.init = null;
		oDiv.funGoPage = null;
	});
};

/*<desc>本控件提供给框架内部使用</desc>*/
jt.PluginList.push('PopFrame');
jt.PopFrame = {};
jt.PopFrame.TagName = [];


//[Func] jt.PopFrame.regPopObject(oHost,oPop,sEventShow,sEventHide,oContainer)###自动创建边框变关联控件事件 (oContainer容器, 默认留空)
jt.PopFrame.regPopObject = function(oHostObject,oPopObject,sEventShow,sEventHide,oContainer){
	var oPop=jt.PopFrame.newFrame('',oContainer);
	//oHostObject.parentNode.insertBefore(oPop,oHostObject);
	document.body.appendChild(oPop);
	oPop.appendContent(oPopObject);
	var arr=sEventShow.split(',');
	for (var i=0;i<arr.length;i++) oPop.regEventShow(oHostObject,arr[i],{x:jt.bIE?1:0,y:0});
	var arr=sEventHide.split(',');
	for (var i=0;i<arr.length;i++) oPop.regEventHideDelay(oHostObject,arr[i], /onblur/i.test(arr[i])?300:0);
	oPopObject.style.display = '';
	oPop.style.display = 'none';
	return oPop;
};

//[Func] jt.PopFrame.newFrame (sSubHTML,oContainer)###新边框 (oContainer容器, 默认留空)
jt.PopFrame.newFrame = function (objInner,oContainer){
	var oDiv = document.createElement('div');
	oDiv.className = 'PopFrame';
	if (jt.bIE6) { //解决IE6无法覆盖SELECT控件的问题
		oDiv.innerHTML='<iframe class="PopFrameIE6IFrame" frameborder=0 src="" style="position:absolute; visibility:inherit; top:0px; left:0px; width:102%; height:100%; z-index:-1;"></iframe>'; //filter1=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';
	};
	if (typeof(objInner)=='string') { oDiv.innerHTML+=objInner; }else{ oDiv.appendChild(objInner); };

    //[Func] 弹出, x可为某控件
	oDiv.popup = function (x, y, jOffset){
		if(typeof(oDiv.beforePopup)=='function') {
			if (!oDiv.beforePopup(x, y, jOffset)) return;
		};
		var ix=x,iy=y; var offsetX=0, offsetY=0;
		if (typeof(jOffset)=='object') { offsetX = jt.getDefVal(jOffset.x,0); offsetY = jt.getDefVal(jOffset.y,0); };
		if (typeof(x)=='object'){
			//ix=jt.getAbsLeft(x,document.body);
			//iy=jt.getAbsTop(x,document.body) + x.offsetHeight;
			ix=jt(x).offset().left;
			iy=jt(x).offset().top + x.offsetHeight;;
			bMoveIntoScreen=true;

//			if ((typeof(oContainer)=='string') && (jt.getDefVal(oContainer)!='')) {
//				if (oContainer.substr(0,1)=='.'){ var oPar = jt._('[parent]'+oContainer,x); }else{ var oPar = jt._('#'+oContainer); };
//				if (typeof(oPar)=='object'){
//					iy-=oPar.scrollTop;
//					ix-=oPar.scrollLeft;
//				};
//			};
			oDiv.style.left=(ix+offsetX)+'px'; oDiv.style.top=(iy+offsetY)+'px';
			oDiv.show();
			//防止超出网页
			var bodyHeight=jt.doc.getClientHeight();
			var bodyEnd=jt.doc.getScrollTop()+bodyHeight;
			if ((iy+offsetY+oDiv.offsetHeight)>bodyEnd){
				if ((oDiv.offsetHeight+x.offsetHeight)<bodyHeight) oDiv.style.top = (iy+offsetY-oDiv.offsetHeight-x.offsetHeight-5)+'px'
			};
			var bodyWidth=jt.doc.getClientWidth();
			var bodyEnd=jt.doc.getScrollLeft()+bodyWidth;
			if ((ix+offsetX+oDiv.offsetWidth)>bodyEnd){
				if (oDiv.offsetWidth<bodyWidth) oDiv.style.left = (bodyEnd-oDiv.offsetWidth-5)+'px'
			};
		}else{
			oDiv.style.left=(ix+offsetX)+'px'; oDiv.style.top=(iy+offsetY)+'px';
			oDiv.show();
		};
		if (jt.bIE6) {
			var ifrm=jt._('iframe.PopFrameIE6IFrame',oDiv);
			if (ifrm.length>0){
				ifrm=ifrm[0];
				ifrm.style.width = oDiv.offsetWidth+'px';
				ifrm.style.height = oDiv.offsetHeight+'px';
			};
		};
	};

    //[Attr] 延时隐藏计时器，想取消隐藏可调用 clearTimeout(oTab.TimeHide);
	oDiv.TimeHide=null;
	oDiv.TimeForScroll=null;

    //[Func] 隐藏
	oDiv.hide = function (iDelay){
		if (iDelay<50) clearTimeout(oDiv.TimeForScroll);
		clearTimeout(oDiv.TimeHide);
		oDiv.TimeHide = setTimeout(function(){
			oDiv.style.display='none';
			clearTimeout(oDiv.TimeForScroll);
			//[Func] afterHide###弹出框隐藏时出发
			if(typeof(oDiv.afterHide)=='function') {oDiv.afterHide();};
		},iDelay);
	};
	//[Func] 显示
	oDiv.show = function (){
		if (!oDiv.DontHideOtherPopFrame){ //可以设置DontHideOtherPopFrame, 则不强行隐藏临时弹出框
			//隐藏临时弹出框
			var objs=jt._('div.PopFrameTemp');
			for (var i=0; i<objs.length; i++){ if (objs[i]!=oDiv) objs[i].hide(0); };
		};
		clearTimeout(oDiv.TimeHide);
		oDiv.style.display='';
		//[Func] afterShow###弹出框显示时触发
		if(typeof(oDiv.afterShow)=='function') {oDiv.afterShow();};
	};
	//[Func] 添加内容
	oDiv.appendContent = function (obj) {oDiv.getContentCell().appendChild(obj);};

	//[Func] 获取内容单元格
	oDiv.getContentCell = function () {return oDiv;};

    //[Func] 注册显示事件|||jOffset格式为{x:0, y:0};
	oDiv.regEventShow = function (obj, sEvent, jOffset){
		jt.addEvent(obj,sEvent,function(){ clearTimeout(oDiv.TimeHide); oDiv.popup(obj,-1,jOffset); });
	};
	//[Func] 注册隐藏事件
	oDiv.regEventHide = function (obj, sEvent){
		jt.addEvent(obj,sEvent,function(){ oDiv.hide(0); });
	};
	//[Func] 注册延时隐藏事件
	oDiv.regEventHideDelay = function (obj, sEvent, iDelay){
		jt.addEvent(obj,sEvent,function(){ oDiv.hide(iDelay||500); });
	};

	oDiv.onmouseover = function (){ oDiv.show(); };
	//当下拉中有滚动条时，点击拖放滚动条时，弹出层会消失，因此引入oTab.onmousedown
	oDiv.onmousedown = function (){ oDiv.TimeForScroll=setTimeout(function(){ oDiv.show(); },100) };
	oDiv.onmouseout = function (){ oDiv.hide(500); };

	jt.addEvent(window,'onunload',function (){  //清除内存
		try{
			oDiv.popup=null;
			oDiv.appendContent=null;
			oDiv.regEventShow=null;
			oDiv.regEventHide=null;
			oDiv.regEventHideDelay=null;
			oDiv.onmouseover = null;
			oDiv.onmouseout = null;
			oDiv.onmousedown = null;
			oDiv.hide=null;
			oDiv.TimeHide=null;
			oDiv.TimeForScroll=null;
			oDiv.afterHide=null;
			oDiv.afterShow=null;
			oDiv.beforePopup=null;
			oDiv.parentNode.removeChild(oDiv);
		}catch(e){};
	});
	return oDiv;
};

/*<desc>弹出消息</desc>*/
jt.PluginList.push('PopMsg');
jt.PopMsg = {};
jt.PopMsg.TagName = [];

var _PopMsg_Title = '';
var _PopMsg_Width = 100;
var _PopMsg_Div = null;
var _PopMsgContent_List = [];

jt.PopMsg.removeMsg = function(){
	if(!_PopMsg_Div) return;
	_PopMsg_Div.close();
	//jt(_PopMsg_Div).remove();
	_PopMsgContent_List = [];
	_PopMsg_Div = null;
}
//[Func] 添加消息
jt.PopMsg.addMsg = function (sContent,sTitle,iTime,iWidth,iHeight){//,iHeight
	//debugger;
	sContent = sContent.replace(/<br\/>/img,'<br/>');
	sContent = sContent.replace(/<br>/img,'<br/>');
	_PopMsgContent_List = _PopMsgContent_List.concat(sContent.split("<br/>"));
	var strTem='';
	for (var i=0; i<_PopMsgContent_List.length; i++){
		strTem += '<div class="OneLine" title="' + _PopMsgContent_List[i].replace(/<(.*?)>/img,'') + '">' + _PopMsgContent_List[i] + '</div>';
	};
	if ((_PopMsg_Div==null) || (!_PopMsg_Div.close)){
		_PopMsg_Title = ((typeof(sTitle)=='string')&&(sTitle!=''))?sTitle:_PopMsg_Title;
		if (_PopMsg_Title=='') _PopMsg_Title='消息';
		_PopMsg_Div = jt.PopMsg.newMsg(strTem,_PopMsg_Title,iTime,iWidth,iHeight);
		_PopMsg_Div.style.zIndex = 11000;
	}else{
		_PopMsg_Div.setContent(strTem);
	};
	_PopMsg_Div.setHeightForAddMsg();
};

//[Func] 删除消息
jt.PopMsg.delMsg = function (idx){
	if (typeof(idx)=='object'){
		if ((_PopMsg_Div==null) || (!_PopMsg_Div.close)) return;
		var objs=jt._('div.OneLine',_PopMsg_Div);
		for (var i=0; i<objs.length; i++){
			if (objs[i]==idx){ jt.PopMsg.delMsg(intTem); return; };
		};
		return;
	};
	if (idx>-1){
		_PopMsgContent_List.splice(idx,1);
	}else{
		for (var i=(_PopMsgContent_List.length-1); i>=0; i--) { _PopMsgContent_List.splice(i,1); };
	};
	if ((_PopMsg_Div!=null) && (_PopMsg_Div.close)){
		var strTem='';
		for (var i=0; i<_PopMsgContent_List.length; i++)
			strTem += '<div class="OneLine" title="' + _PopMsgContent_List[i].replace(/<(.*?)>/img,'') + '">' + _PopMsgContent_List[i] + '</div>';
		_PopMsg_Div.setContent(strTem);
		if (_PopMsgContent_List.length==0){
			_PopMsg_Div.close();
		}else{
			_PopMsg_Div.setHeightForAddMsg();
		};
	};
};

//[Func] 新消息
jt.PopMsg.newMsg = function (sContent,sTitle,iTime,iWidth,iHeight){
	//debugger;
	//if (!$('jsfw_sound_obj')){var oSound=document.createElement('bgsound');oSound.id='jsfw_sound_obj';document.body.appendChild(oSound);} //$('jsfw_sound_obj').src = jsfw.Path + 'jtThemes/' + jsfw.Theme + '/PopMsg/PopMsgSound.mid';
	iWidth = ((typeof(iWidth)=='number') && (iWidth>50))?iWidth:200;
	iHeight = ((typeof(iHeight)=='number') && (iHeight>30))?iHeight:102;
	iTime = (typeof(iTime)=='number')?iTime:5000;

	var chaLeft=0;
	var chaTop =0;

	var oDiv = document.createElement('div');
	oDiv.className = "jt_PopMsg";
	oDiv.style.position = "absolute";
	oDiv.style.height = iHeight;
	oDiv.style.width = iWidth;
	oDiv.style.zIndex = 10000;

	var strTem='';
	if (/msie/i.test(navigator.userAgent)) strTem += '<iframe frameborder=0 src="" style="position:absolute; visibility:inherit; top:0px; left:0px; width:' + (iWidth-3)+'; height:'+(iHeight+2)+'; z-index:-1; filter1=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
	strTem += '<table class="MsgTitle" width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td class="Title">1</td><td width="20"  class="Close" onclick="jt._(\'[parent]div.jt_PopMsg\',this).close()"><img width="1"/></td></tr></table>';
	strTem += '<div class="MsgContent">';
	strTem += '</div>';
	oDiv.innerHTML= strTem;

	var oTitle = oDiv.getElementsByTagName("table")[0].rows[0].cells[0];
	var oClose = oDiv.getElementsByTagName("table")[0].rows[0].cells[1];
	var oContent = oDiv.getElementsByTagName("div")[0];
	oContent.style.height = iHeight-oTitle.offsetHeight-4;
	if (!/msie/i.test(navigator.userAgent)){
		oContent.style.height = parseInt(oContent.style.height) - Math.abs(parseInt(oContent.clientHeight) - parseInt(oContent.style.height));
	};
	oTitle.innerHTML=sTitle;
	oContent.innerHTML=sContent;

	oDiv.close = function(){
		function hidet(){
			if (parseInt(oDiv.style.height) <= 20){
				setTimeout(freeMem,10);
			}else{
				oDiv.style.height = parseInt(oDiv.style.height)-15;
				oDiv.style.top = parseInt(oDiv.style.top)+15;
				setTimeout(hidet,10);
			};
		};
		hidet();
	};
	oDiv.show = function (){
		oDiv.style.top = -1000;
		oDiv.style.height = 20;
		oDiv.style.display = '';

		var objs = document.getElementsByName('div_jsfw_PopMsg');
		var iFrom = jt.doc.getScrollTop() + jt.doc.getClientHeight() - iHeight -5;
		var iTo = iFrom + iHeight;

        for (var i=0; i<objs.length; i++){
			var intTem = (iFrom + iTo)/2;
			var idx=-1;
			for (var j=0; j<objs.length; j++){
				if ((!objs[j].moved) && (intTem>objs[j].iFrom) && (intTem<objs[j].iTo)) idx=j;
			};
			if (idx==-1){
				break;
			};
			var iFrom = objs[idx].iFrom - iHeight - 2;
			var iTo = objs[idx].iFrom - 2;
		};
		oDiv.iFrom = iFrom;
		oDiv.iTo = iTo;

		oDiv.id = 'div_jsfw_PopMsg';
		oDiv.name = 'div_jsfw_PopMsg';

		oDiv.style.top = oDiv.iTo - oDiv.offsetHeight -5;
		oDiv.style.left = jt.doc.getScrollLeft() + jt.doc.getClientWidth() - oDiv.offsetWidth - 25;
		try{oContent.style.height = oDiv.offsetHeight - oTitle.offsetHeight-4;}catch (e){};
		function showt(){
			oDiv.style.top = oDiv.iTo - oDiv.offsetHeight -15;
			oDiv.style.height = parseInt(oDiv.style.height)+10;
			if (parseInt(oDiv.style.height) >= iHeight){
				oDiv.style.top = oDiv.iFrom;
				oDiv.style.height = iHeight;
				try{oContent.style.height = oDiv.offsetHeight - oTitle.offsetHeight-4;}catch (e){};
			}else{
				setTimeout(showt,10);
			};
		};
		showt();
	};

	oDiv.funDrag = function(e){
		e = e || event;
		oDiv.style.left = (oDiv.style.left=e.clientX-chaLeft) + "px";
		oDiv.style.top = (oDiv.style.top=e.clientY-chaTop) + "px";
	};
	oDiv.funDrop = function(){
		if(oTitle.releaseCapture)
			oTitle.releaseCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		document.onmousemove = document.onmouseup = document.onselectstart = null;
		if (parseInt(oDiv.style.left)<0) oDiv.style.left=0;
		if (parseInt(oDiv.style.top)<0) oDiv.style.top=0;
		if (!oDiv.moved) oDiv.moved=true;
	};
	oTitle.onmousedown = function (e){
		e = e || event;
		if(oTitle.setCapture)
			oTitle.setCapture();
		else if(window.captureEvents)
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		oDiv = oDiv;
		chaLeft = e.clientX - parseInt(oDiv.style.left);
		chaTop = e.clientY - parseInt(oDiv.style.top);
		document.onmousemove = oDiv.funDrag;
		document.onmouseup   = oDiv.funDrop;
		document.onselectstart = function(){return false;};
	};
	//设置消息内容
	oDiv.setContent = function (value){
		oContent.innerHTML = value;
	};
	oDiv.setHeightForAddMsg = function (){
		if (oDiv.offsetHeight < (iHeight-2)){
			oContent.style.overflow = 'visible';
			oContent.style.height = '';
			iHeight = oContent.offsetHeight + oTitle.offsetHeight + 4;
			if (iHeight>250) iHeight=250;
			oDiv.iFrom = oDiv.iTo - iHeight;
			oContent.style.overflow = 'auto';
		}else{
			var intTem=0;
			oContent.style.overflow = 'visible';
			intTem = iHeight;
			oContent.style.height = '';
			iHeight = oContent.offsetHeight + oTitle.offsetHeight + 4;
			if (iHeight>250) iHeight=250;
			intTem = iHeight-intTem;
			oDiv.style.top = parseInt(oDiv.style.top) - intTem;
			oDiv.style.height = iHeight;
			oContent.style.overflow = (oContent.offsetHeight<(iHeight-oTitle.offsetHeight))?'visible':'auto';
			oContent.style.height = iHeight-oTitle.offsetHeight-4;
			oDiv.iFrom = oDiv.iTo - iHeight;
		};
	};

	oDiv.style.display = 'none';
	document.body.appendChild(oDiv);

	oDiv.show();
	if (iTime>0) setTimeout(oDiv.close,iTime);

	jt.addEvent(window,'onunload',function (){
		freeMem();
	});
	function freeMem(){  //清除内存
		try{
			oDiv.funDrag = null;
			oDiv.funDrop = null;
			oDiv.iFrom = null;
			oDiv.iTo = null;
			oDiv.moved = null;
			oDiv.close = null;
			oDiv.show = null;
			oDiv.setContent = null;
			oDiv.setHeightForAddMsg = null;
			oTitle.onmousedown = null;
			oDiv.innerHTML = '';
			document.body.removeChild(oDiv);
			delete oDiv;
		}catch(e){};
	};
	return oDiv;
};

jt.PluginList.push('ScrollPanel');
jt.ScrollPanel = {};
jt.ScrollPanel.TagName = ['div'];

jt.ScrollPanel.FormatUI = function (oCtl) {
	var oScroll,oBegin,oEnd;
	var bScrollUp=false;//向上滚动
	var bScrolling=false;


    //[Func] 滚动,iSize:像素|||接管函数:|||<code>jtAfterScrollPanelScroll(oComp)</code> 滚动之后，将会触发
	oCtl.scroll = function(iSize){
		if (bScrolling) return;
		if (bScrollUp) { scroll_Up(iSize); }else{ scroll_Left(iSize); };
	};
	//[Func] 翻页,iPage页数
	oCtl.scrollPage = function(iPage){
		oCtl.scroll( iPage * (bScrollUp?oCtl.offsetHeight:oCtl.offsetWidth) );
	};
	//[Func] 翻到第几页,iPage页数
	oCtl.scrollToPage = function(iPageNum){
		//debugger;
		var iTo = iPageNum * (bScrollUp?oCtl.offsetHeight:oCtl.offsetWidth);
		var iSize = -parseInt(bScrollUp?oScroll.style.top:oScroll.style.left) - iTo;
		oCtl.scroll(iSize);
	};
	//[Func] 获取总页数
	oCtl.getPageCount = function(){
		if (bScrollUp) return Math.ceil(oScroll.offsetHeight/oCtl.offsetHeight);
		return Math.ceil(oScroll.offsetWidth/oCtl.offsetWidth);
	};
	//[Func] 获取当前页码(从0开始)
	oCtl.getPageNum = function(){
		if (bScrollUp) return Math.abs(parseInt(parseInt(oScroll.style.top)/oCtl.offsetHeight));
		return Math.abs(parseInt(parseInt(oScroll.style.left)/oCtl.offsetWidth));
	};
	//[Func] 是否已经滚动到头
	oCtl.isBegin = function(){
		if (bScrollUp) return parseInt(oScroll.style.top)==0;
		return parseInt(oScroll.style.left)==0;
	};
	//[Func] 是否已经滚动到尾
	oCtl.isEnd = function(){
		if (bScrollUp) return (oScroll.offsetHeight+parseInt(oScroll.style.top))<=oCtl.offsetHeight;
		return (oScroll.offsetWidth+parseInt(oScroll.style.left))<=oCtl.offsetWidth;
	};

    //[Func] 更新界面, 设置左右按钮是否显示
	oCtl.updateUI = function(){
		if (oBegin){ oBegin.style.visibility = oCtl.isBegin()?'hidden':'visible'; };
		if (oEnd){ oEnd.style.visibility = oCtl.isEnd()?'hidden':'visible'; };
	};

    function scroll_Left(iSize){
		bScrolling=true;
		var iLeft=jt.getDefVal(parseInt(oScroll.style.left),0);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*5/30)+'px' }, 0);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*10/30)+'px' }, 20);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*16/30)+'px' }, 40);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*18/30)+'px' }, 60);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*20/30)+'px' }, 80);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*22/30)+'px' }, 100);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*24/30)+'px' }, 120);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*26/30)+'px' }, 140);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*28/30)+'px' }, 160);
		setTimeout(function() { oScroll.style.left = (iLeft + iSize*30/30)+'px'; scroll_After() }, 180);
	};
	function scroll_Up(iSize){
		bScrolling=true;
		var iTop=jt.getDefVal(parseInt(oScroll.style.top),0);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*5/30)+'px' }, 0);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*10/30)+'px' }, 20);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*16/30)+'px' }, 40);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*18/30)+'px' }, 60);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*20/30)+'px' }, 80);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*22/30)+'px' }, 100);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*24/30)+'px' }, 120);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*26/30)+'px' }, 140);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*28/30)+'px' }, 160);
		setTimeout(function() { oScroll.style.top = (iTop + iSize*30/30)+'px'; scroll_After() }, 180);
	};
	function scroll_After(){
		oCtl.updateUI();
		bScrolling=false;
		if(typeof(jtAfterScrollPanelScroll)=='function') jtAfterScrollPanelScroll(oCtl);
	}


    //[Func] 组件初始化
	oCtl.init = function(){
		//[Attr] ScrollObject###滚动对象ID(为空时, 默认滚动第一个子对象)
		var sTem = jt.getAttr(oCtl,'ScrollObject');
		if (sTem!=''){
			oScroll = jt._('#'+sTem);
		}else{
			var objs=oCtl.childNodes;
			for (var i=0;i<objs.length; i++){
				if (objs[i].nodeName!='#text'){ oScroll = objs[i]; break; };
			};
		};
		jt.addClass(oScroll,'ScrollPanel_Scroll');
		//[Attr] ScrollUp###滚动方向,是否向上滚动 (默认false)
		bScrollUp = jt.getAttr(oCtl,'ScrollUp',false);
		if (bScrollUp){
			if (oScroll.style.top=='') oScroll.style.top='0px';
		}else{
			if (oScroll.style.left=='') oScroll.style.left='0px';
		}
		//[Attr] ScrollButtonLeft###向左滚动箭头对象的ID
		var sTem = jt.getAttr(oCtl,'ScrollButtonLeft');
		if (sTem!='') oBegin = jt._('#'+sTem);
		//[Attr] ScrollButtonRight###向左滚动箭头对象的ID
		var sTem = jt.getAttr(oCtl,'ScrollButtonRight');
		if (sTem!='') oEnd = jt._('#'+sTem);

        if (oBegin && (!oBegin.onclick)) { oBegin.onclick=function(){ oCtl.scrollPage(1) }; };
		if (oEnd && (!oEnd.onclick)) { oEnd.onclick=function(){ oCtl.scrollPage(-1) }; };
		oCtl.updateUI();
	};
	oCtl.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		oCtl.init = null;
		oCtl.scroll = null;
		oCtl.scrollPage = null;
		oCtl.scrollToPage = null;
		oCtl.getPageCount = null;
		oCtl.getPageNum = null;
		oCtl.isBegin = null;
		oCtl.isEnd = null;
		oCtl.updateUI = null;
		if (oBegin) oBegin.onclick=null;
		if (oEnd) oEnd.onclick=null;
	});
};

/*<desc>左右分隔条</desc>*/
jt.PluginList.push('SplitBar');
jt.SplitBar = {};
jt.SplitBar.TagName = ['td'];

jt.SplitBar.FormatUI = function (oTD){
	var oLeft,oRight,oBarTem,oSplitImg;
	//[Attr] SplitImg0 | SplitImg1###分隔图片(隐藏显示，两张图片)
	var sSplitImg0=jt.getAttr(oTD,'SplitImg0'); var sSplitImg1=jt.getAttr(oTD,'SplitImg1');
	if (sSplitImg1=='') {sSplitImg1=sSplitImg0}; if (sSplitImg0=='') {sSplitImg0=sSplitImg1};

	function getCellIndex(obj){ //解决IE下，如果有TD是隐藏的，obj.cellIndex获取错误的问题
		if (!jt.bIE) return obj.cellIndex;
		for(var i =0,objs=obj.parentNode.cells; i<objs.length;i++){ if (objs[i]==obj) return i; };
	};

    oTD.init = function(){
		oTD.style.position='relative';
		if (oTD.align=='') oTD.align='center';
		var cIdx=getCellIndex(oTD);
		oLeft=oTD.parentNode.cells[cIdx-1];
		oRight=oTD.parentNode.cells[cIdx+1];

		oBarTem = document.createElement("div");
		oBarTem.style.position = "absolute";
		oBarTem.style.zIndex = 10000;
		oBarTem.style.width=(oTD.offsetWidth||5) + 'px';
		oBarTem.style.height='100%';//oTD.offsetHeight;
		oBarTem.className='jtSplitBar_Frame';
		oBarTem.innerHTML=jt.TransparentImg;
		oBarTem.style.display='none';
		if (/firefox/i.test(navigator.userAgent)) oBarTem.style.borderWidth=0;
		oTD.appendChild(oBarTem);
		if (sSplitImg1!=''){
			oSplitImg=document.createElement("img");
			oSplitImg.className='jtSplitImg';
			oSplitImg.src=sSplitImg1;
			if (/firefox/i.test(navigator.userAgent)) oSplitImg.style.position = 'static';
			oTD.appendChild(oSplitImg);
		};

		if (oTD.style.cursor=='') oTD.style.cursor=jt.bIE?'col-resize':'w-resize';

		jt.setAttr(oBarTem,'minLeft','-10000'); jt.setAttr(oBarTem,'minTop','-10000');
		jt.DragDrop.FormatUI(oBarTem);
		oTD.onmousedown = function(e){
			oBarTem.style.display=''; oBarTem.style.width=(oTD.offsetWidth||5)+'px';
			oBarTem.style.top=0; oBarTem.style.left=0;
			if (oBarTem.offsetHeight<10) oBarTem.style.height=oTD.offsetHeight+'px';
			oBarTem.onmousedown(e);
		};
		oBarTem.Draging = function(iStatus,iX,iY,iDeltaX,iDeltaY){
			if (iStatus==1) oBarTem.style.top=0;
			if (iStatus==2){
                //[Attr] MinLeft###左边最小宽度，当小于最小宽度时自动隐藏(0为不自动隐藏)
				var iMinLeft=jt.getAttr(oTD,'MinLeft',0);
				//[Attr] MinRight###右边最小宽度，当小于最小宽度时自动隐藏(0为不自动隐藏) <em>MinLeft与MinRight只允许用一个</em>
				var iMinRight=jt.getAttr(oTD,'MinRight',0);
				//[Attr] LeftWidth###左边宽度
				oTD.LeftWidth=oLeft.offsetWidth;
				//[Attr] RightWidth###右边宽度
				oTD.RightWidth=oRight.offsetWidth;

                oBarTem.style.display='none';
				if (iDeltaX==0){
					//[Attr] AfterClick###点击完后执行(未发生拖动)
					oTD.EvalAttr('AfterClick');
					return;
				};
				if (iMinRight>0){
					if ((oRight.offsetWidth-iX)<iMinRight){
						oTD.hideRight();
					}else{
						oRight.style.display='';
						try{ oRight.style.width = (oRight.offsetWidth-iX)+'px';}catch(e){};
						oTD.RightWidth=oRight.offsetWidth;
						oTD.EvalAttr('AfterResize');
					};
				}else{
					if ((iMinLeft>0) && ((oLeft.offsetWidth+iX)<iMinLeft)) {
						oTD.hideLeft();
					}else{
						oLeft.style.display='';
						try{ oLeft.style.width = (oLeft.offsetWidth+iX)+'px';}catch(e){};
						oTD.LeftWidth=oLeft.offsetWidth;
						oTD.EvalAttr('AfterResize');
					};
				};
			};
		};
		//DragObject
	};
	//[Attr] AfterResize###点击完后执行(发生拖动)
	//[Attr] AfterHideShow###显示隐藏(左边或右边)后触发
	//[Func] 隐藏左边
	oTD.hideLeft = function(){
		var bShow=(oLeft.style.display=='none');
		oLeft.style.display=bShow?'':'none';
		oTD.LeftWidth=oLeft.offsetWidth;
		oTD.EvalAttr('AfterResize');
		oTD.EvalAttr('AfterHideShow');
		if (sSplitImg1!=''){ oSplitImg.src = bShow?sSplitImg1:sSplitImg0; };
	};
	//[Func] 隐藏右边
	oTD.hideRight = function(){
		var bShow=(oRight.style.display=='none');
		oRight.style.display=bShow?'':'none';
		oTD.RightWidth=oRight.offsetWidth;
		oTD.EvalAttr('AfterResize');
		oTD.EvalAttr('AfterHideShow');
		if (sSplitImg1!=''){ oSplitImg.src = bShow?sSplitImg1:sSplitImg0; };
	};

    oTD.EvalAttr = function (sAttr){ var sJS=jt.getAttr(oTD,sAttr); if (sJS!='') eval(sJS); };

    oTD.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		if (oBarTem!=null) oBarTem.parentNode.removeChild(oBarTem);
		oTD.hideLeft = null;
		oTD.hideRight = null;
		oTD.EvalAttr = null;
		oTD.init = null;
	});
};

/*<desc>
Tab基类，实现一组对象中仅能选中一个对象，并且显示对象对应的内容控件,<br>
可用于做标签控件、Outlook控件、单选控件
</desc>*/
jt.PluginList.push('TabBase');
jt.TabBase = {};
jt.TabBase.TagName = ['div'];

jt.TabBase.FormatUI = function (oDiv) {
	var tabs=[]; var cnts=[]; var tabPar=oDiv; var cntPar=oDiv;
	var MouseOverActive,CSSTab,CSSTabSel,CSSTabOver,CSSCnt;
	var sHTML4Copy=jt.getAttrAndXMP(oDiv,'ItemHTML'); //copyItem时使用

    //[Attr] 当前选中项的Index
	oDiv.SelectedIndex = 0;

    oDiv.loadIFrame = function(obj){
		var sURL=jt.getAttr(obj,'FrameURL');
		if (( sURL=='') || (obj.getElementsByTagName('IFRAME').length!=0)) return;
		var sName=jt.getAttr(obj,'FrameName');
		if (sName!='') sName=' name="'+sName+'"';
		obj.innerHTML = '<iframe '+sName+' style="width:100%; height:100%;" frameborder="0" src="'+jt.parseURL(sURL)+'"></iframe>';
	};

    //[Func] selectItem(idx, bClick)###选择项|||idx:标签序号(可为标签对象),   bClick:是否触发点击事件(AfterClick) 默认true|||本函数提供如下接管函数：|||<code>jtAfterTabBaseSelectItem (oComp, idx) </code>页面可实现此方法Tab切换完标签后，将会触发
	oDiv.selectItem = oDiv.selectGroup = function (idx, bClick){
		bClick=jt.getDefVal(bClick,true);
		var tab=idx;
		if (typeof(idx)=='number') tab = tabs[idx];
		if (typeof(idx)=='object') idx = tabs.indexOf(idx);

        for (var i=0;i<tabs.length;i++){
			if (i==idx){
				oDiv.SelectedIndex=idx;
				jt.addClass(tabs[i],CSSTabSel);
				if (cnts.length>0){
					cnts[i].style.display='';
					//[Attr] FrameURL###<em>标签内容属性</em>，用于点击标签时，以iFrame的形式加载标签页
					//[Attr] FrameName###<em>标签内容属性</em>，iFrame名称
					//[Attr] FrameAutoLoad###<em>标签内容属性</em>，iFrame自动加载(默认false, 当标签显示时才加载)
					oDiv.loadIFrame(cnts[i]);
				};
			}else{
				jt.removeClass(tabs[i],CSSTabSel);
				if (cnts.length>0) cnts[i].style.display='none';
			};
		};
		if (bClick) tab.evalClick();
		if(typeof(jtAfterTabBaseSelectItem)=='function') jtAfterTabBaseSelectItem(oDiv,idx);
	};

    //[Func] 获取DIV标签列表
	oDiv.getTabs = function(){ return tabs; };
	//[Func] 获取内容DIV列表
	oDiv.getCnts = function(){ return cnts; };

    //[Func] 添加项|||idx: 插入位置(-1表示在追加到最后,0表示第1个)|||sText: 标签文本
	oDiv.addItem = function(idx, sText, sAfterClick, sFrameURL, sTabID, sCntID,sContent){
		if (typeof(idx)=='undefined') idx=-1;
		sTabID=jt.getDefVal(sTabID);   sAfterClick=jt.getDefVal(sAfterClick);
		sCntID=jt.getDefVal(sCntID);   sFrameURL=jt.getDefVal(sFrameURL);   sContent=jt.getDefVal(sContent);
		var tab = document.createElement("div");
		tab.className=CSSTab;
		tab.innerHTML=sText;
		if (sTabID!='') tab.id = sTabID;
		if (sAfterClick!='') jt.setAttr(tab,'AfterClick',sAfterClick);
		if ((idx<0) || (idx>tabs.length-1)){
			tabPar.appendChild(tab);
		}else{
			if (idx<=oDiv.SelectedIndex) oDiv.SelectedIndex++; //TODO 插入在当前选中标签之前时, oDiv.SelectedIndex要进行调整
			tabs[idx].parentNode.insertBefore(tab,tabs[idx]);
		};
		tabs=jt._('*.'+CSSTab,oDiv);

        if (CSSCnt!=''){
			var cnt = document.createElement("div");
			cnt.className=CSSCnt;
			if (sCntID!='') cnt.id = sCntID;
			if (sFrameURL!='') jt.setAttr(cnt,'FrameURL',sFrameURL);
			cnt.style.display = 'none';
			if ((idx<0) || (idx>cnts.length-1)){
				cntPar.appendChild(cnt);
			}else{
				cnts[idx].parentNode.insertBefore(cnt,cnts[idx]);
			};
			cnts=jt._('*.'+CSSCnt,oDiv);
			if (sContent!='') cnts.innerHTML=sContent;
		};
		oDiv.initTab(tab);

        return tab;
	};
	//[Func] 复制项|||idxSrc:要复制的标签|||idx: 插入位置(-1表示在追加到最后,0表示第1个)|||sText: 标签文本
	oDiv.copyItem = function(idxCopy, idx, sText, sAfterClick, sFrameURL, sTabID, sCntID){
		var sHTML=sHTML4Copy;
		if (jt.getDefVal(idxCopy,-1)>-1) sHTML = oDiv.getCnts[idxCopy].innerHTML;
		var oTab=oDiv.addItem(idx, sText, sAfterClick, sFrameURL, sTabID, sCntID);
		for (var i=0;i<tabs.length;i++){
			if (tabs[i]==oTab) cnts[i].innerHTML=sHTML;
		};
		return oTab;
	};

    //[Func] 删除项
	oDiv.delItem = function(idx){
		if (tabs.length==0) return;
		if (typeof(idx)=='object') idx = tabs.indexOf(idx);
		var iActiveIdx=-1;
		if (idx==oDiv.SelectedIndex){
			iActiveIdx=idx;
			if (iActiveIdx>tabs.length-2) iActiveIdx=tabs.length-2;
		};
		tabs[idx].parentNode.removeChild(tabs[idx]);
		if (cnts.length>0) cnts[idx].parentNode.removeChild(cnts[idx]);
		tabs=jt._('*.'+CSSTab,oDiv);
		if (CSSCnt!='') cnts=jt._('*.'+CSSCnt,oDiv);
		if (iActiveIdx>-1) oDiv.selectItem(iActiveIdx);
	};

    //初始化Tab事件
	oDiv.initTab = function(idx){
        if (typeof (idx) == 'object') idx = tabs.indexOf(idx);
		tabs[idx].onclick = function(){ oDiv.selectItem(this,true); };
		//[Attr] AfterClick###<em>标签属性</em>，标签点击完后执行
		tabs[idx].evalClick = function(){ var sAfterClick=jt.getAttr(this,'AfterClick'); if (sAfterClick!='') eval(sAfterClick); };

        if (MouseOverActive||(CSSTabOver!='')){
			tabs[idx].onmouseover = function(){
				if (MouseOverActive) this.onclick();
				if (CSSTabOver!='') jt.addClass(this,CSSTabOver);
			};
		};
		if (CSSTabOver!=''){
			tabs[idx].onmouseout = function(){ jt.removeClass(this,CSSTabOver); };
		};
		if (cnts.length>0){
			if (jt.getAttr(cnts[idx],'FrameAutoLoad',false)) {
				oDiv.loadIFrame(cnts[idx]);
			}
		};
	};

    //[Func] 组件初始化
	oDiv.init = function(){
		for (var i=0;i<tabs.length;i++){ tabs[i].onclick=null; tabs[i].onmouseover=null; tabs[i].onmouseout=null; };

        //[Attr] MouseOverActive###鼠标移过时是否激活标签(默认false)
		MouseOverActive=jt.getAttr(oDiv,'MouseOverActive',false);
		//[Attr] CSSTab###要加载的Tab标签样式
		CSSTab=jt.getAttr(oDiv,'CSSTab');
		//[Attr] CSSTabSel###要加载的Tab标签选中时样式
		CSSTabSel=jt.getAttr(oDiv,'CSSTabSel');
		//[Attr] CSSTabOver###要加载的Tab标签MosuseOver时样式
		CSSTabOver=jt.getAttr(oDiv,'CSSTabOver');
		//[Attr] CSSCnt###要加载的标签对应内容样式 (如果无对应内容，请留空)
		CSSCnt=jt.getAttr(oDiv,'CSSCnt');

        tabs=jt._('*.'+CSSTab,oDiv);
		cnts=[];
		if (CSSCnt!='') cnts=jt._('*.'+CSSCnt,oDiv);
		var defIdx=0;
		for (var i=0;i<tabs.length;i++){
			oDiv.initTab(i);
			//[Attr] Default###<em>标签属性</em>，是否为初始选中标签
			if (jt.getAttr(tabs[i],'Default',false)) defIdx=i;
		};

        var tPars=jt._('*.TabBase_tabPar'); if (tPars.length>0) {tabPar=tPars[0]};
		var tPars=jt._('*.TabBase_cntPar'); if (tPars.length>0) {cntPar=tPars[0]};

        if (tabs.length>0) {
			tabs[defIdx].onclick();
			tabPar=tabs[0].parentNode;
		};
		if (cnts.length>0) {
			if (sHTML4Copy=='') sHTML4Copy = cnts[cnts.length-1].innerHTML;
			cntPar=cnts[0].parentNode;
		};
	};
	oDiv.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		oDiv.init = null;
		oDiv.initTab = null;
		oDiv.loadIFrame = null;
		oDiv.selectItem = oDiv.selectGroup = null;
		oDiv.addItem = null;
		oDiv.delItem = null;
		oDiv.copyItem = null;
		oDiv.getTabs = null;
		oDiv.getCnts = null;
		for (var i=0;i<tabs.length;i++){ tabs[i].onclick=null; tabs[i].onmouseover=null; tabs[i].onmouseout=null; tabs[i].evalClick=null; };
	});
};

/*<desc>
本控件基于TabBase进行扩展
</desc>*/
jt.PluginList.push('TabMenuLite');
jt.TabMenuLite = {};
jt.TabMenuLite.TagName = ['div'];

jt.TabMenuLite.FormatUI = function (oCtl){
	//[Attr] TabType###标签样式(默认1)，可选0|1|2
	jt.addClass(oCtl,'jt_TabMenuLite_' + jt.getAttr(oCtl,'tabType','1'));

    //[Attr] MouseOverActive###鼠标移过时是否激活标签(默认false)
	//[Attr] DIV > AfterClick###<em>标签属性</em>，标签点击完后执行
	//[Attr] DIV > Default###<em>标签属性</em>，是否为初始选中标签
	jt.setAttr(oCtl,'CSSTab','TM_Tab');
	jt.setAttr(oCtl,'CSSTabSel','TM_Tab_Sel');
	//jt.setAttr(oCtl,'CSSTabOver','TM_Tab_Over');
	jt.setAttr(oCtl,'CSSCnt','TM_Cnt');

    var tabs=jt._('*.TM_Tab',oCtl);
	for (var i=0;i<tabs.length;i++){
		var nDiv=document.createElement('div'); nDiv.className='TM_Tab_L'; tabs[i].appendChild(nDiv);
		var nDiv=document.createElement('div'); nDiv.className='TM_Tab_R'; tabs[i].appendChild(nDiv);
	};

    jt.TabBase.FormatUI(oCtl);

	//清除内存
	//jt.addEvent(window,'onunload',function (){
	//});
};



/*<desc>简单树<br>支持PNG图标</desc>*/
jt.PluginList.push('TreeViewLite');
jt.TreeViewLite = {};
jt.TreeViewLite.TagName = ['div'];

jt.TreeViewLite.FormatUI = function (oDiv){
	if (jt.bIE6) jt.addClass(oDiv,'IE6');
	jt.addClass(oDiv,'jtTreeViewLite');
	//[Attr] Data###数据，也可使用&lt;xmp class="data"&gt;&lt;/xmp&gt;代替
	if (jt.getAttr(oDiv,'data')=='') jt.setAttr(oDiv,'data',jt.getAttrAndXMP(oDiv,'data')); //初始化时将XMP属性复制到属性上
	//[Attr] URLData###数据URL
	//[Attr] JSData###数据源，调用JS，返回字符串或JSON

	//[Attr] IconPath###树节点图标路径
	var sIconPath='';
	//[Attr] NodeIcon###节点默认图标, 支持{}表达式
	var sNodeIcon='';
	//[Attr] ExpandLevel###自动展开节点（级数）
	var iExpandLevel=0;
	//[Attr] TextField###节点显示内容 (默认值 '{text}',表示json的text属性)
	var sTextField='';
	//[Attr] CheckBoxName###CheckBox 的 Name (当为空或不设置时, 不显示 CheckBox)
	var sCheckBoxName='';
	//[Attr] CheckBoxValue###CheckBox 的 value (默认值 '{id}',表示json的id属性)
	var sCheckBoxValue='';
	//[Attr] CheckBoxChecked###CheckBox 的 checked (默认值 为空, 表示可用,  可以用JS, 返回true或false)
	var sCheckBoxChecked='';
	//[Attr] CheckBoxDisabled###CheckBox 的 disabled (默认值 为空, 表示可用,  可以用JS, 返回true或false)
	var sCheckBoxDisabled='';
	//[Attr] CheckBoxOnClick###CheckBox 的 onclick
	var sCheckBoxOnClick='';
	//[Attr] CheckChildren###勾选CheckBox时自动勾选子节点 (默认值 false), 与CheckParent不能同时为true
	var bCheckChildren=false;
	//[Attr] CheckParent###勾选CheckBox时自动勾选父节点 (默认值 false), 与CheckChildren不能同时为true
	var bCheckParent=false;

    //[Func] 加载json数据 (sURL:要加载的URL或JSON对象) |||本函数提供如下接管函数：|||<code>jtBeforeTreeViewLiteLoadData (oComp, oNode,sURL) </code>页面可实现此方法List加载数据前，将会触发|||<code>jtAfterTreeViewLiteLoadData (oComp, oNode,json,sURL) </code>页面可实现此方法List数据并加载完后，将会触发|||<code>jtAfterTreeViewLiteShowData (oComp, oNode, json) </code>页面可实现此方法List数据显示完后，将会触发<hr><code>jtString2JtDataFormat (oComp, sJson) </code>页面可实现此方法来将请求返回的字串转为jt的标准JSON<br><code>jtInitJtDataItem (oComp, jsonItem, idx) </code>页面可实现此方法 自行处理 JSON中 data 的每个项
	oDiv.loadData = function (sURL, oNode){
		oNode = oNode || oDiv;
		if(typeof(jtBeforeTreeViewLiteLoadData)=='function') jtBeforeTreeViewLiteLoadData(oDiv,oNode,sURL);
		cleanNodeSub(oNode,'<font color="gray" style="padding-left:'+(oNode.jsonItem.level*18)+'">正在加载，请稍候……</font>');
		jt.loadDataForComponent(oDiv, {URLData:sURL}, function (json){
			if(typeof(jtAfterTreeViewLiteLoadData)=='function') jtAfterTreeViewLiteLoadData(oDiv,oNode,json,sURL);
			sTextField=jt.getAttr(oDiv,'TextField','{text}');
			oDiv.showData(json, oNode);
		});
	};

    //显示数据
	oDiv.showData = function (json, oNode){
		iExpandLevel=parseInt(jt.getAttr(oDiv,'ExpandLevel',0));
		var oNodeSub = (oNode==oDiv)?oNode:oNode.nextSibling;
		var iLevel=oNode.jsonItem.level+1;
		var arr = jt.isArray(json.data)?json.data:json;
		var sHTML='';
		oNode.jsonItem.isLoaded=true;
		if (oNode.jsonItem.isFolder != (arr.length>0)){ oNode.jsonItem.isFolder = arr.length>0; oDiv.nodeInit(oNode);};
		for (var i=0;i<arr.length;i++){
			if (typeof(arr[i])=='undefined') continue; //JSON格式容错（多了,）
			arr[i].isFolder = ((arr[i].children) && (arr[i].children.length>0));
			if (!arr[i].isFolder) arr[i].isFolder=(arr[i].childUrl||'')!='';
			arr[i].level = iLevel;
			arr[i].isLoaded = false;
			arr[i].isEnd = i==arr.length-1;
			sHTML+='<div class="jtTreeNode"></div>';
			sHTML+='<div class="jtTreeSub" style="display:none;"></div>';
		};
		//if (arr.length==0) alert(sHTML);
		sHTML+='';
		oNodeSub.innerHTML = sHTML;
		var objs=oNodeSub.childNodes;
		for (var i=0;i<arr.length;i++) {
			if (typeof(arr[i])=='undefined') continue; //JSON格式容错（多了,）
			objs[i*2].jsonItem = arr[i];
			oDiv.nodeInit(objs[i*2]);
			if ((arr[i].children) && (arr[i].children.length>0)) oDiv.loadData(arr[i].children,objs[i*2]);
			if (arr[i].isFolder){
				//var bAutoExpand=false;
				//[Attr] expanded###<em>JSON节点属性</em>，当设置为true时，节点加载完后自动展开
				var bAutoExpand=objs[i*2].jsonItem.expanded;
				if (!bAutoExpand) bAutoExpand=iLevel<=iExpandLevel;
				if (bAutoExpand) oDiv.nodeExpand(objs[i*2],true);
			};
		};
		if(typeof(jtAfterTreeViewLiteShowData)=='function') jtAfterTreeViewLiteShowData(oDiv,oNode,json);
		if(typeof(oDiv.afterShowData)=='function') oDiv.afterShowData(oNode,json); //调用控件追加函数

        //[Attr] AutoFocusFirst###自动选中第一个节点
		if (oDiv==oNode) {
			if (jt.getAttr(oDiv,'AutoFocusFirst',false)){
				var objs=oDiv.getChildNodes();
				if (objs.length>0) oDiv.nodeFocus(objs[0]);
			};
		};

		oDiv.focusNodePathEx();
	};

    //[Func] 初始化节点 (包含：设置Node DIV的innerHTML 及 onclick)|||<code>jtBeforeTreeViewLiteNodeInit (oComp, oNode) </code>节点初始化前触发|||<code>jtAfterTreeViewLiteNodeClick (oComp, oNode, oSrcElement) </code>节点点击时触发 (oSrcElement:当前鼠标点击到的对象)|||<code>jtAfterTreeViewLiteNodeDblClick (oComp, oNode) </code>节点点击时触发
	oDiv.nodeInit = function(oNode){
		if (oNode==oDiv) return;
		if(typeof(jtBeforeTreeViewLiteNodeInit)=='function') jtBeforeTreeViewLiteNodeInit(oDiv,oNode);
		oDiv.updateNode(oNode);
		oNode.onclick = function(event) {
			var e = event||window.event; var obj=e.srcElement?e.srcElement:e.target;
			if (this.jsonItem.isFolder){
				if (/tnPreExpCol/i.test(obj.className)) { oDiv.nodeExpand(this); return; } //点击展开收起按钮
				if (/tnCheckBox_Input/i.test(obj.className)) return;
				//[Attr] ClickExpand###点击节点自动展开 'true'、'false'
				if (jt.getAttr(oDiv,'ClickExpand','false')=='true') oDiv.nodeExpand(this);
			};
			oDiv.nodeFocus(this);
			//[Attr] action###<em>JSON节点属性</em>,节点点击时执行脚本
			var sAction=this.jsonItem.action||'';
			if (sAction!='') eval(sAction);
			if(typeof(jtAfterTreeViewLiteNodeClick)=='function') jtAfterTreeViewLiteNodeClick(oDiv,oNode,obj);
			if(typeof(oDiv.afterNodeClick)=='function') oDiv.afterNodeClick(oNode,obj); //调用控件追加函数
		};
        oNode.ondblclick = function () {
            if (this.jsonItem.isFolder) oDiv.nodeExpand(this);
			if(typeof(jtAfterTreeViewLiteNodeDblClick)=='function') jtAfterTreeViewLiteNodeDblClick(oDiv,oNode);
			if(typeof(oDiv.afterNodeDblClick)=='function') oDiv.afterNodeDblClick(oNode); //调用控件追加函数
		};
		oNode.onmouseover = function() { jt.addClass(this,'NodeOver'); };
		oNode.onmouseout = function() { jt.removeClass(this,'NodeOver'); };
	};

    //[Func] 更新节点(不包含子节点)
	oDiv.updateNode = function(oNode){
		//if (typeof(jsonItem)=='object') oNode.jsonItem=jsonItem;
		var sHTML='';
		var oPar=oNode.parentNode;
		//前端空白
		while (oPar!=oDiv){
			var isEnd = oPar.previousSibling.jsonItem.isEnd;
			var iLev =  oPar.previousSibling.jsonItem.level;
			sHTML='<div class="tnPreBlank'+(isEnd?'':' tnPreLineI tnPreLineI'+iLev)+'"></div>'+sHTML; //tnPreLineI tnPreLineL tnPreLineT
			oPar=oPar.parentNode;
		};
		//展开收起按钮
		sHTML+='<div class="tnPreExpCol'+ (oNode.jsonItem.isFolder?' tnPreExp':'') + (oNode.jsonItem.isEnd?' tnPreLineL':'') +'"></div>';
		if (!oNode.jsonItem.isFolder) oNode.nextSibling.style.display='none';
		if (sCheckBoxName!=''){
			sHTML+='<div class="tnCheckBox">';
			sHTML+='<input type=checkbox class="tnCheckBox_Input" ';
			sHTML+='name="'+sCheckBoxName+'" ';
			sHTML+='value="'+jt.parseField(sCheckBoxValue,oNode.jsonItem)+'" ';
			sHTML+='onclick="jt._(\'[parent]div.jtTreeViewLite\',this).checkNode(this);'+sCheckBoxOnClick+'" ';
			if (sCheckBoxChecked!='') {
				try{ if (eval(jt.parseField(sCheckBoxChecked,oNode.jsonItem))) sHTML+='checked="true" '; }catch(e){};
			};
			if (sCheckBoxDisabled!='') {
				try{ if (eval(jt.parseField(sCheckBoxDisabled,oNode.jsonItem))) sHTML+='disabled="true" '; }catch(e){};
			};
			sHTML+='>';
			sHTML+='</div>';
		}

		//[Attr] icon###<em>JSON节点属性</em>,节点图标<br>当为空时,取 TreeViewLite 的 NodeIcon 属性<br>可包含 <code>{XXX}</code>(节点JS的XXX属性，如{text}代表本节点的text属性)
		if ( (oNode.jsonItem.icon||sNodeIcon||'')!='' ) {
			var src = sIconPath + jt.getDefVal(oNode.jsonItem.icon,sNodeIcon);
			src=jt.parseField(src,oNode.jsonItem);
			var iW=(oNode.jsonItem.iconWidth||'16');
			if ((jt.bIE6) && (/\.png/i.test(src))){
				sHTML+='<div class="tnIconBlank" style="padding-top:4px;"><img src="'+jt.FixImgPngSrc(src)+'" width="'+iW+'" height="'+iW+'"></div>';
			}else{
				sHTML+='<div class="tnIconBlank" style="background: no-repeat url(\''+src+'\') 0% 50%;"></div>';
			};
		}else{
			var iconCss=oNode.jsonItem.iconCss||'';
			if (iconCss=='') iconCss=oNode.jsonItem.isFolder?'tnFolder':'tnLeaf';
			sHTML+='<div class="'+ iconCss +'"></div>';
		};

        sHTML+='<span class="tnText">'+jt.parseField(sTextField,oNode.jsonItem)+'</span>';
		if(typeof(oDiv.beforeSetNodeHTML)=='function') sHTML=oDiv.beforeSetNodeHTML(oNode,sHTML); //调用控件追加函数
		oNode.innerHTML = sHTML;
	};
	//[Func] 获取下一个节点
	oDiv.nextNode = function(oNode){
		if (oNode==null) oNode=oDiv.ActiveNode;
		if ((oNode==null) || (oNode==oDiv)) return null;
		var parNode=oDiv.getParentNode(oNode);
		var objs = oDiv.getChildNodes(parNode);
		var idx=1;
		for (var i=0;i<objs.length;i++) {
			if (objs[i]==oNode) {idx=i;break;};
		};
		var tagNode = objs[idx+1];
		if(tagNode) return tagNode;
		else return null;
	};
	//[Func] 获取上一个节点
	oDiv.preNode = function(oNode){
		if (oNode==null) oNode=oDiv.ActiveNode;
		if ((oNode==null) || (oNode==oDiv)) return null;
		var parNode=oDiv.getParentNode(oNode);
		var objs = oDiv.getChildNodes(parNode);
		var idx=1;
		for (var i=0;i<objs.length;i++) {
			if (objs[i]==oNode) {idx=i;break;};
		};
		var tagNode = objs[idx-1];
		if(tagNode) return tagNode;
		else return null;
	};
	//[Func] 移动节点(将oNode移动到tagNode之前) (当tagNode为整型时,-1代表上移1代表下移)(目前只支持上下移)
	oDiv.moveNode = function(oNode, tagNode){
		//TODO  当前只支持同级节点上下移
		if (oNode==null) oNode=oDiv.ActiveNode;
		if ((oNode==null) || (oNode==oDiv)) return;
		var parNode=oDiv.getParentNode(oNode);
		var objs = oDiv.getChildNodes(parNode);
		var idx=1;
		for (var i=0;i<objs.length;i++) {
			if (objs[i]==oNode) {idx=i;break;};
		};
		if (typeof(tagNode)=='number'){
			if (objs.length<2) return;
			if (tagNode>0){//转成上移
				if (idx>=objs.length-1) return;
				return oDiv.moveNode(objs[idx+1],-1);
			}
			//上移
			if (idx<=0) return;
			tagNode = objs[idx-1];
			var oNodeSub=oNode.nextSibling;
			tagNode.parentNode.insertBefore(oNode,tagNode);
			tagNode.parentNode.insertBefore(oNodeSub,tagNode);
			//var arr=parNode.jsonItem.children;
			//arr[idx-1] = arr.splice(idx, 1, arr[idx-1])[0];
			//TODO  未处理isEnd
			if (typeof(jtAfterTreeViewLiteMoveNode)=='function') jtAfterTreeViewLiteMoveNode(oDiv, oNode, tagNode);
		};
	};

    //[Func] 勾选节点|||<code>jtBeforeTreeViewLiteCheckNode(oComp, oNode, oCheck, bCheck) 节点勾选前触发, 当返回值为boolean型时, 则改变CheckBox的勾选状态||| jtAfterTreeViewLiteCheckNode (oComp, oNode, oCheck, bCheck) </code>节点勾选后时触发
	oDiv.checkNode = function (oNode,bCheck){
		var oCheck=oNode;
		if (oNode.nodeName=='INPUT') {
			oNode=jt._('[parent]div.jtTreeNode',oNode);
			bCheck=oCheck.checked;
		}else{
			oCheck=jt._('input.tnCheckBox_Input',oNode)[0];
		}
		if (typeof(jtBeforeTreeViewLiteCheckNode)=='function') {
			var ret=jtBeforeTreeViewLiteCheckNode(oDiv, oNode, oCheck, bCheck);
			if (typeof(ret)=='boolean') oCheck.checked=bCheck=ret;
		}
		if (typeof(bCheck)!='boolean') bCheck=oCheck.checked;
		oCheck.checked = bCheck;
		if (bCheckParent && bCheck){
			var objs=oDiv.getAllParentNodes(oNode);
			for (var i=0;i<objs.length;i++){
				if ((objs[i]!=oDiv) && (objs[i]!=oNode)){if(objs[i].disabled != true) jt._('input.tnCheckBox_Input',objs[i])[0].checked=bCheck;};
			}
		}
		if (bCheckChildren){
			var objs=jt._('input.tnCheckBox_Input',oNode.nextSibling);
			for (var i=0;i<objs.length;i++){ if(objs[i].disabled != true) objs[i].checked=bCheck;};
		}
		if (typeof(jtAfterTreeViewLiteCheckNode)=='function') jtAfterTreeViewLiteCheckNode(oDiv, oNode, oCheck, bCheck);
	};

    //[Func] 展开节点|||<code>jtAfterTreeViewLiteNodeExpand (oComp, oNode, bExpand) </code>节点展开时触发
	oDiv.nodeExpand = function (oNode,bExpand){
		if (typeof(bExpand)!='boolean') bExpand=oNode.nextSibling.style.display=='none';
		oNode.nextSibling.style.display=bExpand?'':'none';
        var divExpCol = jt._('[children]div.tnPreExpCol', oNode)[0];
		jt.removeClass(divExpCol, bExpand?'tnPreExp':'tnPreCol'); jt.addClass(divExpCol, bExpand?'tnPreCol':'tnPreExp');
		var divFolder=jt._('[children]div.tnFolder',oNode)[0];
		if (divFolder){
			if (bExpand) { jt.addClass(divFolder, 'tnFolderOpen'); }else{ jt.removeClass(divFolder, 'tnFolderOpen') };
		};
		if (oNode.jsonItem.isFolder) { oNode.jsonItem.isExpand=bExpand; }; //oNode.jsonItem.expanded
		//[Attr] children###<em>JSON节点属性</em>,子节点集
		//[Attr] childUrl###<em>JSON节点属性</em>,子节点URL,URL中可包含以下变量<br><code>{JTPath}</code>：JT.js所在位置<br><code>{URLNodeData}</code>：TreeViewLite 的 URLNodeData 属性<br><code>{XXX}</code>：节点JS的XXX属性，如{text}代表本节点的text属性
		if ((oNode.jsonItem.isFolder) && (!oNode.jsonItem.isLoaded)) {
			var sURL=oNode.jsonItem.childUrl;
			if (/{URLNodeData}/i.test(sURL)) sURL=sURL.replace(/{URLNodeData}/ig, jt.getAttr(oDiv,'URLNodeData'));
			var arr=sURL.match(/{((.|\s)+?)}/ig);
			for (var i=0;i<arr.length;i++){
				if (/{JTPath}|{JSTime}/i.test(arr[i])) continue;
				var re = new RegExp(arr[i],'ig');
				var sVal=oNode.jsonItem[ arr[i].substr(1,arr[i].length-2) ];
				if (typeof(sVal)=='undefined') continue;
				sURL = sURL.replace(re, encodeURIComponent(sVal));
			};
			oDiv.loadData(sURL, oNode); //动态加载树
		};
		if(typeof(jtAfterTreeViewLiteNodeExpand)=='function') jtAfterTreeViewLiteNodeExpand(oDiv,oNode,bExpand);
		if(typeof(oDiv.afterNodeExpand)=='function') oDiv.afterNodeExpand(oNode,bExpand); //调用控件追加函数
	};

    //[Func] 查找（已加载）节点，sCondition格式为<br>"id=1200"，查找json中id为1200的第一个节点<br>"text=北京"，查找json中text为北京的第一个节点
	oDiv.findNode = function(sCondition){//<br>"PATH=中国/福建省/福州市"，按路径查找(PATH为大写)
		var iPos=sCondition.indexOf('=');
		var key=sCondition.substr(0,iPos);
		var value=sCondition.substr(iPos+1);
		var objs=oDiv.getAllChildNodes();
		for (var i=0; i<objs.length; i++){ if (objs[i].jsonItem[key] == value) { return objs[i]; } };
		return null;
	};
	//[Func] 重新加载子节点
	oDiv.reloadNode = function(oParentNode){
		var oNodeSub = (oParentNode==oDiv)?oParentNode:oParentNode.nextSibling;
		oParentNode.jsonItem.isLoaded=false;
		oNodeSub.innerHTML = '';
		oDiv.nodeExpand(oParentNode,true);
	};

    //[Func] 获取子节点（不包括子节点的子节点）
	oDiv.getChildNodes = function(oNode){
		oNode = oNode || oDiv;
		var oNodeSub = (oNode==oDiv)?oNode:oNode.nextSibling;
		return jt._('[children]div.jtTreeNode', oNodeSub);
	};
	//[Func] 获取所有子节点（包括子节点的子节点）
	oDiv.getAllChildNodes = function(oNode){
		oNode = oNode || oDiv;
		var oNodeSub = (oNode==oDiv)?oNode:oNode.nextSibling;
		return jt._('div.jtTreeNode', oNodeSub);
	};
	//[Func] 获取某节点的父节点
	oDiv.getParentNode = function(oNode){
		if (oNode.parentNode==oDiv) return oDiv;
		return oNode.parentNode.previousSibling;
	};
	//[Func] 获取某节点的所有父节点
	oDiv.getAllParentNodes = function(oNode){
		var arr=[];
		var tnode=oNode;
		while(tnode!=oDiv){
			if (tnode==document.body) return '';
			arr.push(tnode);
			if (tnode.parentNode==oDiv) break;
			tnode=tnode.parentNode.previousSibling;
		};
		arr.push(oDiv);
		arr.reverse();
		return arr;
	};


    var strFocusNodePath='';
	//[Func] 动态加载树中，自动展开并聚焦，格式为："text=中国/福建省/福州市" 或 "id=0086/35/3501"
	oDiv.focusNodePath = function(sPath){
		strFocusNodePath=sPath;
		oDiv.focusNodePathEx();
	};
	oDiv.focusNodePathEx = function(){
		if (strFocusNodePath=='') return;
		var sFld=strFocusNodePath.split('=')[0];
		var arrPath =strFocusNodePath.split('=')[1].split('/');
		var rnode=oDiv;
		for (var l=0; l<arrPath.length; l++){
			var objs=oDiv.getChildNodes(rnode);
			for (var i=0; i<objs.length; i++){
				if (!objs[i].jsonItem) return; //递归未加载完时退出
				if (objs[i].jsonItem[sFld] == arrPath[l]){
					rnode = objs[i];
					if (l==arrPath.length-1) {
						oDiv.nodeFocus(rnode,true);
						strFocusNodePath = '';
						return;
					};
					oDiv.nodeExpand(rnode,true);
					break;
                }
			};
		};
	};

    //[Func] 获取节点路径<br> <code>oNode</code>为null时，则为ActiveNode<br><code>sField</code>为json字段名，如id、text
	oDiv.getNodePath = function(oNode,sField){
		var tnode = (oNode==null?oDiv.ActiveNode:oNode); if (tnode==null) return '';
		sField = jt.getDefVal(sField,'text');
		var sRet='';
		while(tnode!=oDiv){
			if (tnode==document.body) return '';
			sRet = tnode.jsonItem[sField] + (sRet!=''?'/':'') + sRet;
			if (tnode.parentNode==oDiv) break;
			tnode=tnode.parentNode.previousSibling;
		};
		return sRet;
	};

	//[Attr] 当前选中节点
	oDiv.ActiveNode = null;
	//[Func] 选中节点|||<code>jtAfterTreeViewLiteNodeFocus (oComp, oNode) </code>节点选中时触发
	oDiv.nodeFocus = function (oNode){
		if (oDiv.ActiveNode==oNode) return;
		if (oDiv.ActiveNode!=null) jt.removeClass(oDiv.ActiveNode,'NodeFocus');
		oDiv.ActiveNode=oNode;
		jt.addClass(oDiv.ActiveNode,'NodeFocus');
		//自动展开上级
		var temNode=oNode;
		while ((temNode!=oDiv) && (temNode.parentNode!=oDiv)){
			temNode=temNode.parentNode.previousSibling;
			oDiv.nodeExpand(temNode,true);
		};
		if(typeof(jtAfterTreeViewLiteNodeFocus)=='function') jtAfterTreeViewLiteNodeFocus(oDiv,oNode);
		if(typeof(oDiv.afterNodeFocus)=='function') oDiv.afterNodeFocus(oNode); //调用控件追加函数
	};


    //清除子节点DIV
	function cleanNodeSub(oNode,sHTML){
		if ( (typeof(sHTML)=='undefined') && (jt.getAttr(oDiv,'NotCleanNodes',false)) ) return;
		var oNodeSub = (oNode==oDiv)?oNode:oNode.nextSibling;
		var objs=oNodeSub.getElementsByTagName('div');
		for (var i=0;i<objs.length;i++) {
			objs[i].jsonItem=null;
			objs[i].onclick=null;
			objs[i].ondblclick=null;
			objs[i].onmouseover=null;
			objs[i].onmouseout=null;
		};
		oNodeSub.innerHTML = sHTML||'';
	};

    //[Func] 组件初始化|||<code>jtAfterTreeViewLiteInit (oComp) </code>页面可实现此方法TreeView初始化完将会触发
	oDiv.init = function(){
		//[Attr] TreeStyle###树型样式 (采用CSS方法实现) 支持如下样式:|||NoFocusColor：选中时不改变颜色|||NoOverColor：鼠标移上去时颜色不变|||Icon_Folder：所有节点均显示为目录|||Icon_OrgUser：节点显示为组织机构、用户|||Icon_Org：节点显示为组织机构|||NoIcon：无图标
		var sTreeStyle=jt.getAttr(oDiv,'TreeStyle');
		if (sTreeStyle!='') oDiv.className += ' ' + sTreeStyle;

		sTextField=jt.getAttr(oDiv,'TextField','{text}');
		sIconPath=jt.parseURL(jt.getAttr(oDiv,'IconPath'));
		sNodeIcon=jt.parseURL(jt.getAttr(oDiv,'NodeIcon'));

        sCheckBoxName=jt.getAttr(oDiv,'CheckBoxName');
		if (sCheckBoxName!=''){
			sCheckBoxValue=jt.getAttr(oDiv,'CheckBoxValue','{id}');
			sCheckBoxChecked=jt.getAttr(oDiv,'CheckBoxChecked');
			sCheckBoxDisabled=jt.getAttr(oDiv,'CheckBoxDisabled');
			sCheckBoxOnClick=jt.getAttr(oDiv,'CheckBoxOnClick');
			bCheckChildren=jt.getAttr(oDiv,'CheckChildren',false);
			bCheckParent=jt.getAttr(oDiv,'CheckParent',false);
			if (bCheckParent && bCheckChildren) bCheckParent=false;
		};

        //iExpandLevel=parseInt(jt.getAttr(oDiv,'ExpandLevel',0));
		oDiv.jsonItem={isFolder:false,isLoaded:false,level:0};
		//[Attr] AutoLoadData###控件自动加载数据 (默认true)
		if (jt.getAttr(oDiv,'AutoLoadData',true)) oDiv.loadData();
		oDiv.onselectstart = function(){return false;};
		if(typeof(jtAfterTreeViewLiteInit)=='function') jtAfterTreeViewLiteInit(oDiv);
		if(typeof(oDiv.afterInit)=='function') oDiv.afterInit(); //调用控件追加函数
	};
	oDiv.init();

	jt.addEvent(window,'onunload',function (){  //清除内存
		oDiv.ActiveNode = null;
		oDiv.nodeFocus=null;
		oDiv.loadData=null;
		oDiv.showData=null;
		oDiv.nodeInit=null;
		oDiv.updateNode=null;
		oDiv.checkNode=null;
		oDiv.moveNode=null;
		oDiv.nodeExpand=null;
		oDiv.findNode=null;
		oDiv.getChildNodes=null;
		oDiv.getAllChildNodes=null;
		oDiv.getParentNode=null;
		oDiv.getAllParentNodes=null;
		oDiv.reloadNode=null;
		oDiv.focusNodePath=null;
		oDiv.focusNodePathEx=null;
		oDiv.onselectstart=null;
		oDiv.getNodePath = null;

        oDiv.afterShowData = null;
		oDiv.afterNodeFocus = null;
		oDiv.afterNodeExpand = null;
		oDiv.afterNodeClick = null;
		oDiv.afterNodeDblClick =null;
		oDiv.afterInit = null;

        cleanNodeSub(oDiv);
		oDiv.init = null;
	});
};

/*<desc>树型表单<br>本控件继承于 <a href="TreeViewLite.htm">TreeViewLite</a> 控件, 可沿用所有 TreeViewLite 所有函数及方法</desc>*/
jt.PluginList.push('TreeGrid');
jt.TreeGrid = {};
jt.TreeGrid.TagName = ['div'];

jt.TreeGrid.FormatUI = function (oDiv){
	jt.addClass(oDiv,'jtTreeGrid');
	var oHead = document.createElement('div');
	oHead.className = 'jtTreeGridHead';
	oDiv.parentNode.insertBefore(oHead,oDiv);
	oDiv.oHead= oHead;

	var arrGrid=[];

    //生成表样
	function getCellHTML(item){
		var sHTML=''; var iRight=0;
		for (var i=arrGrid.length-1;i>=0;i--){
			sHTML += '<div class="TreeGridCell" ';
			sHTML += 'style="right:'+iRight+'px; width:'+arrGrid[i].Width+'px"';
			sHTML += '>';
			if (typeof(item)=='object'){
				sHTML += jt.parseField(arrGrid[i].Field,item);
			}else{
				sHTML += arrGrid[i].Caption;
			};
			iRight += arrGrid[i].Width;
			sHTML += '</div>';
		};
		return sHTML;
	};

    //在树弄画节点时对HTML进行调整
	oDiv.beforeSetNodeHTML = function(oNode,sHTML){
		sHTML += getCellHTML(oNode.jsonItem);
		return sHTML;
	};

//	//[Func] 设置高度
//	oDiv.setHeight = function (){ };

	//[Func] 组件初始化
	oDiv.initTreeGrid = function(){
		arrGrid = [];
		//[Attr] GridCaption###表头,以逗号隔开
		//[Attr] GridField###表格字段,以逗号隔开或字符串数组形式 |||如 {id},{text}   或   ['{id}','{text}']
		//[Attr] GridWidth###表格宽度,以逗号隔开
		var arrCap = jt.getAttr(oDiv,'GridCaption').split(',');
		var arrWidth = jt.getAttr(oDiv,'GridWidth').split(',');
		var sFields=jt.getAttr(oDiv,'GridField','[]');
		var arrField = (/^\s*\[[\s\S]*\](\s|\;)*$/.test(sFields)) ? jt.Str2Json(sFields) : sFields.split(',');

        var sHTML='';
		for (var i=0;i<arrField.length;i++){
			var item={};
			item.Caption = (i+2>arrCap.length)?'':arrCap[i+1];
			item.Field = arrField[i];
			item.Width = jt.getDefVal( ((i+1>arrWidth.length)?'50':arrWidth[i]), 50);
			arrGrid.push(item);
		};
		sHTML += '<div class="TreeGridCell TreeGridCellFirst">'+arrCap[0]+'</div>';
		sHTML += getCellHTML();
		oHead.innerHTML=sHTML;
	};
	oDiv.initTreeGrid();

	jt.TreeViewLite.FormatUI(oDiv);

    jt.addEvent(window,'onunload',function (){  //清除内存
		oDiv.initTreeGrid = null;
		oDiv.beforeSetNodeHTML = null;
		oDiv.oHead = null;
		oHead.parentNode.removeChild(oHead);
		//oDiv.setHeight = null;
	});
};


/*<desc>
简单工具栏<br>
支持PNG图标<br>
仅支持一级下拉菜单
</desc>*/
jt.PluginList.push('ToolbarLite');
jt.ToolbarLite = {};
jt.ToolbarLite.TagName = ['div'];

jt.ToolbarLite.FormatUI = function (oCtl){
	if (!jt.PopFrame) jt.loadPlugin('PopFrame');
	jt.addClass(oCtl,'jtToolbarLite');
	if (jt.bIE6) jt.addClass(oCtl,'IE6');
	//[Attr] ItemHeight###按钮高度
	var sItemHeight='';
	//[Attr] IconHeight###图标高度（宽度与高度一样）
	var sIconHeight='';
	//[Attr] IconPath###工具栏图标路径
	var sIconPath='';

    var oBtns=[];
	var oSubs=[];

    function getParTBItem(obj){
		var ret=obj.previousSibling;
		for (var i=0; i<20; i++) { if ((ret.nodeName=='DIV')&&(/TBLItem/i.test(ret.className))) return ret; ret=ret.previousSibling; };
	};

    //将子节点的DIV的Class初始化
	function initChildItem(obj,isSub){
		var objs=jt._('[children]div',obj);
		for (var i=0; i<objs.length; i++) {
			if (objs[i].className=='') {
				if ((jt.getAttr(objs[i],'icon')=='')&&(objs[i].innerHTML=='')){
					objs[i].className ='TBLSeparator';
					objs[i].innerHTML =jt.TransparentImg;
				}else{
					objs[i].className ='TBLItem';
					//objs[i].setAttribute('unselectable','on');
				};
			};
		};
		objs=jt._('[children]div.TBLItem',obj);
		for (var i=0; i<objs.length; i++){
			initTBLItem(objs[i],isSub);
		};
	};
	function initTBLItem(obj,isSub){
		//[Attr] Div > Icon###<em>按钮属性</em>，按钮图标
		obj.setAttribute('unselectable','on');
		if ((sItemHeight!='')&&(!/\<br\>/i.test(obj.innerHTML))) obj.style.height=obj.style.lineHeight=sItemHeight;

        obj.onmouseover=new Function('jt.addClass(this,\'TBLItem_Over\')');
		obj.onmouseout=new Function('jt.removeClass(this,\'TBLItem_Over\')');

        var sText = obj.innerHTML;
		var sIcon = jt.getAttr(obj,'Icon');
		if ((sIcon=='') && (!isSub)) return;
		var sImg = '<img width="'+sIconHeight+'" height="'+sIconHeight+'" ';
		if (sIcon==''){
			sImg += 'src="' + jt.Path + 'jtThemes/t.gif">';
		}else{
			sImg += 'src="' + jt.FixImgPngSrc(sIconPath+sIcon) + '">';
		}
		var sHTML='';
		sHTML+='<table class="TBLItem_Table" border="0" cellspacing="0" cellpadding="0">';
		sHTML+='<tr>';
		sHTML+='<td class="TBLItem_Icon">'+sImg+'</td>';
		sHTML+='<td class="TBLItem_Text"><nobr>'+sText+'</nobr></td>';
		sHTML+='</tr>';
		obj.innerHTML = sHTML;
	};
	//[Func] 追加按钮
	oCtl.appendItem = function (sID, sText, sOnclick, sIcon){
		sID=jt.getDefVal(sID); sText=jt.getDefVal(sText); sOnclick=jt.getDefVal(sOnclick); sIcon=jt.getDefVal(sIcon);
		var div = document.createElement('div');
		if (sID!='') div.id=sID;
		if ((sIcon=='')&&(sText=='')){
			div.className ='TBLSeparator';
			div.innerHTML =jt.TransparentImg;
		}else{
			div.className ='TBLItem';
			div.onclick=new Function(sOnclick);
			jt.setAttr(div,'Icon',sIcon);
			div.innerHTML = sText;
			initTBLItem(div);
		};
		var objs=jt._('[children]div.Toolbar_Right',oCtl);
		if (objs.length>0){
			oCtl.insertBefore(div,objs[0]);
		}else{
			oCtl.appendChild(div);
		};
	};
	//[Func] 根据按钮名称返回obj
	oCtl.findItem = function(sText){
		var objs=jt._('div',oCtl);
		for(var i=0;i<objs.length;i++){
			var str = objs[i].innerText;
			str = str.replace(/(^\s*)|(\s*$)/g,"");
			if(str == sText) return objs[i];
		};

		return null;
	};

	//[Func] 组件初始化
	oCtl.init = function(){
		sItemHeight=jt.getAttr(oCtl,'ItemHeight');
		sIconHeight=jt.getAttr(oCtl,'IconHeight','16');
		sIconPath= jt.parseURL(jt.getAttr(oCtl,'IconPath'));
		//初始化按钮
		oBtns=jt._('[children]div.TBLItem',oCtl);
		initChildItem(oCtl);
		//初始化子菜单
		oSubs=jt._('[children]div.TBLSubMenu',oCtl);
		for (var i=0; i<oSubs.length; i++){
			var oTab=jt.PopFrame.newFrame('');
			oCtl.insertBefore(oTab,oSubs[i]);
			oTab.appendContent(oSubs[i]);
			var oItem=getParTBItem(oTab);
			jt.addClass(oItem,'TBLSubItemPar');
			oSubs[i].oFrame = oTab;
			oSubs[i].oItem = oItem;
			oTab.regEventShow(oItem,'onmouseover',{x:jt.bIE?1:0,y:-1});
			oTab.regEventHideDelay(oItem,'onmouseout');
			initChildItem(oSubs[i],true);
			oTab.style.display = 'none';
			oTab.afterHide = function (){var oTem=jt._('div.TBLSubMenu',this.getContentCell())[0]; jt.removeClass(oTem.oItem,'TBLItem_Over');};
			oTab.afterShow = function (){
				var oTem=jt._('div.TBLSubMenu',this.getContentCell())[0];
				jt.addClass(oTem.oItem,'TBLItem_Over');
				for (var j=0; j<oSubs.length; j++){ if (oSubs[j]!=oTem) oSubs[j].oFrame.hide(0); } //隐藏其他弹出菜单
			};
		};
	};
	oCtl.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		oCtl.init = null;
		oCtl.appendItem = null;
		for (var i=0; i<oBtns.length; i++){
			oBtns[i].onmouseover=null;
			oBtns[i].onmouseout=null;
		};
		for (var i=0; i<oSubs.length; i++){
			oSubs[i].onmouseover=null;
			oSubs[i].onmouseout=null;
			oSubs[i].oFrame = null;
			oSubs[i].oItem = null;
		};
    });
};

/*<desc>气泡提示消息</desc>*/
jt.PluginList.push('Tip');
jt.Tip = {};
jt.Tip.TagName = [];

//[Func] 显示提示消息.|||<code>sContent</code>:内容[必要参数]|||<code>obj</code>:HTML对象或坐标[x,y][必要参数]|||<code>iTime</code>:显示时间，默认5000(5秒),为0则不自动关闭|||<code>iWidth,iHeight</code>:宽度,高度
jt.Tip.newTip = function (sContent, obj, iTime, iWidth, iHeight, bLeft){
	iWidth = jt.getDefVal(iWidth,180); //iWidth = ((typeof(iWidth)=='number') && (iWidth>50))?iWidth:180;
	iHeight = jt.getDefVal(iHeight,50); //iHeight = ((typeof(iHeight)=='number') && (iHeight>30))?iHeight:50;
	iTime = jt.getDefVal(iTime,5000); //iTime = (typeof(iTime)=='number')?iTime:5000;
	var oDiv=jt._('#jt_Tip_div');
	if (!oDiv){  /////创建DIV
		oDiv = document.createElement('div');
		oDiv.id = "jt_Tip_div";
		oDiv.style.zIndex = window._jt_Window_zIndex+10;
		if (jt.bIE6) oDiv.className = "jt_Tip_div_IE6 IE6";
		oDiv.style.height = iHeight; oDiv.style.width = iWidth;
		var sHTML='';
		sHTML += '<div id="jt_Tip_Arr"><img width="1" height="23" src="'+jt.Path + 'jtThemes/t.gif"/></div>';
		sHTML += '<table style="table-layout:fixed;height:100%" width="100%" border="0" cellpadding="0" cellspacing="0">';
		sHTML += '<tr><td class="jt_Tip_0_0">'+jt.TransparentImg+'</td><td class="jt_Tip_0_1">'+jt.TransparentImg+'</td><td class="jt_Tip_0_2">'+jt.TransparentImg+'</td></tr>';
		sHTML += '<tr>';
		sHTML += '	<td class="jt_Tip_1_0">'+jt.TransparentImg+'</td>';
		sHTML += '	<td class="jt_Tip_1_1"><div id="jt_Tip_cnt"></div></td>';
		sHTML += '	<td class="jt_Tip_1_2">'+jt.TransparentImg+'</td>';
		sHTML += '</tr>';
		sHTML += '<tr><td class="jt_Tip_2_0">'+jt.TransparentImg+'</td><td class="jt_Tip_2_1">'+jt.TransparentImg+'</td><td class="jt_Tip_2_2">'+jt.TransparentImg+'</td></tr>';
		sHTML += '</table>';
		//if (/msie/i.test(navigator.userAgent)) sHTML += '<iframe frameborder=0 src="" scrolling="no" style="position:absolute; visibility:inherit; top:0px; left:0px; width:' + (iWidth+4)+'; height:'+(iHeight+18)+'; z-index:-11; filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';"></iframe>';
		oDiv.innerHTML=sHTML;
		document.body.appendChild(oDiv);
		//oDiv.getElementsByTagName("table")[0].style.filter = 'alpha(opacity=100)';
		//document.getElementById('jt_Tip_divTab').style.filter = 'alpha(opacity=100)';
		//document.getElementById('jt_Tip_Arr').style.filter = 'alpha(opacity=100)';
		oDiv.onclick=function (){ oDiv.style.display='none'; };
	};

    oDiv.style.display='';
	jt._('#jt_Tip_cnt').innerHTML=sContent;

    oDiv.style.height = iHeight; oDiv.style.width = iWidth;

	var iX=0;var iY=0;
    bLeft = jt.getDefVal(bLeft, true);
	var bTop=true; var bObj=!jt.isArray(obj);

    if (bObj){
        //iX = jt.getAbsLeft(obj) + obj.offsetWidth - 30;
		//iY = jt.getAbsTop(obj)  + obj.offsetHeight + 20;
        iX = jt(obj).offset().left + obj.offsetWidth - 30;
		iY = jt(obj).offset().top  + obj.offsetHeight + 20;
	}else{
		iX=obj[0]-20; iY=obj[1]+20;
	};

    if ((iX+iWidth)>document.body.clientWidth){////右边超出网页
		iX = iX-iWidth+40;
		if (bObj) { bLeft = (obj.offsetWidth>(iWidth-40)); }else{ bLeft = false; };
    }

	var iOffHeight=oDiv.offsetHeight||iHeight;
	if ((iY+iOffHeight-jt.doc.getScrollTop()+20)>document.body.clientHeight){
		iY = iY - iOffHeight - 40 - (bObj?obj.offsetHeight:0);
		bTop=false;
	};

    oDiv.style.left=iX;
	oDiv.style.top=iY;
	var oArr=_('#jt_Tip_Arr');
	oArr.style.left = '';oArr.style.top = '';oArr.style.right = '';oArr.style.bottom = '';
	if (bLeft){ oArr.style.left=20; }else{ oArr.style.right=20; };
	if (bTop){
		oArr.style.top=-17;
		oArr.className = 'jt_Tip_Arr_' + (bLeft?'0':'1');
	}else{
		oArr.style.bottom=-17;
		oArr.className = 'jt_Tip_Arr_' + (bLeft?'2':'3');
	};

    clearTimeout(oDiv.timHide);
    if (iTime > 0) {
        oDiv.timHide = setTimeout(function () {
            oDiv.style.display = 'none';
        }, iTime);
    }

	jt.addEvent(window,'onunload',function (){
		freeMem();
	});
	function freeMem(){  //清除内存
		try{
			oDiv.innerHTML = '';
			clearTimeout(oDiv.timHide);
			oDiv.timHide = null;
			oDiv.onclick = null;
			document.body.removeChild(oDiv);
		}catch(e){};
	};
	return oDiv;
};

//[Func] 去除所有提示消息.
jt.Tip.delTip = function (){ var obj = jt._('#jt_Tip_div'); if (obj) {obj.style.display='none';} };

/*<desc>表单验证</desc>*/
jt.PluginList.push('Validate');
jt.Validate = {};
jt.Validate.TagName = ['form'];

jt.Validate.FormatUI = function (oForm){
    //[Const]
	jt.Const.CST_Email = '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$'; //Email
    //[Const]
	jt.Const.CST_Number = '^-?\\d+(\\.)?\\d*$'; //数字形
    //[Const]
	jt.Const.CST_PositiveNumber = "^\\d+(\\.)?\\d*$"; //正数
    //[Const]
	jt.Const.CST_Integer = '^-?\\d{1,5}$'; //整形
    //[Const]
	jt.Const.CST_PositiveInteger = '^\\d{1,5}$'; //正整数
	//[Const]
	jt.Const.CST_SystemID = "^[A-Za-z0-9]{2,20}$"; //系统编号 (长度为2-20个字符，只允许包含大小写字母、数字)
	//[Const]
    jt.Const.CST_UserID = "^[A-Za-z0-9_-]{4,20}$"; //用户ID (4-20个字符，只允许 大小写字母、数字、下划线_)
    //[Const]
	jt.Const.CST_IP = "^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$"; //IP地址
    //[Const]
	jt.Const.CST_FileName = '^[^?\\\\*|"<>:/]{1,256}$'; //文件名
    //[Const]
	jt.Const.CST_Date = "^((((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13578]|1[02])(-|\\.)(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13456789]|1[012])(-|\\.)(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)0?2(-|\\.)(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\\.)0?2(-|\\.)29-))$"; //日期
    //[Const]
	jt.Const.CST_Time = "^(([0-1]?\\d)|(2[0-3])):([0-5]?\\d):([0-5]?\\d)$"; //时间
    //[Const]
	jt.Const.CST_DateTime = "^((((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13578]|1[02])(-|\\.)(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13456789]|1[012])(-|\\.)(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)0?2(-|\\.)(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\\.)0?2(-|\\.)29-)) (([0-1]?\\d)|(2[0-3])):([0-5]?\\d):([0-5]?\\d)$"; //完整时间
    //[Const]
	jt.Const.CST_DateTime_HM = "^((((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13578]|1[02])(-|\\.)(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13456789]|1[012])(-|\\.)(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)0?2(-|\\.)(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\\.)0?2(-|\\.)29-)) (([0-1]?\\d)|(2[0-3])):([0-5]?\\d)$"; //完整时间 (日期+时分)
    //[Const]
	jt.Const.CST_ANSI='^[A-Za-z0-9_-]+$'; //ANSI字符
    //[Const]
	jt.Const.CST_Identifier='^[a-zA-Z][a-zA-Z_]{2,20}$'; //以英文字母开头的 /^[0-9a-zA-Z]*$/g


    oForm.init = function(){
		////添加 jt_Validate_ErrEmpty 样式
		for(var i=0;i<oForm.elements.length;i++){
			var oFld = oForm.elements[i];
			if ((oFld.type!='text') && (oFld.type!='textarea') && (oFld.type!='password')) continue;
			if (jt.getAttr(oFld,'ErrEmpty')=='') continue;
			jt.addClass(oFld,'jt_Validate_ErrEmpty');
			oFld.className = oFld.className + (oFld.className==''?'':' ') + 'jsfw_Validate_ErrEmpty';
		};
		//修改submit函数
		oForm.onsubmit_old = oForm.onsubmit;
		oForm.onsubmit = function (){
			var bCheck=oForm.checkForm();
			if (!bCheck) return false;
			if (oForm.onsubmit_old==null) return true;
			return oForm.onsubmit_old();

		};
	};

    //[Func] 验证错误时触发此方法，默认采用Tip组件提示。 <font color=gray>当然你可以重写oFrom.showError = function (sErrInfo,oInput){}方法</font>|||本函数提供如下接管函数：|||<code>jtShowValidateError (sErrInfo,oInput)</code> 显示错提示
	oForm.showError = function (sErrInfo,oInput){
		if(typeof(jtShowValidateError)=='function') { jtShowValidateError (sErrInfo,oInput); return; };
		jt.Tip.newTip(sErrInfo,oInput,3000);
		try{oInput.focus();}catch(e){};
	};

    //[Func] 表单验证。返回true  false
	oForm.checkForm = function (){
		try{ jt.Tip.delTip(); }catch(e){};
		for(var i=0;i<oForm.elements.length;i++){
			var oFld = oForm.elements[i];
			if ((oFld.type=='checkbox') || (oFld.type=='radio') || (oFld.nodeName=='FIELDSET') || (oFld.nodeName=='OBJECT')) continue; //radio还未处理

            //[Attr] ErrEmptyCap###<em>域属性</em>，不允许为空的提示[可选](如果允许为空，则不验证ErrCheck)
			var ErrEmptyCap = jt.getAttr(oFld,'ErrEmptyCap',jt.getAttr(oFld,'ErrEmpty'));
            //[Attr] ErrCheck###<em>域属性</em>，验证正则表达式，可用常量[可选]
			var ErrCheck = jt.getAttr(oFld,'ErrCheck');
            //[Attr] ErrCheckCap###<em>域属性</em>，错误提示[可选]
			var ErrCheckCap = jt.getAttr(oFld,'ErrCheckCap','输入不合法！');


            //(等于4时只允许两个汉字)
            //[Attr] ErrLength###<em>域属性</em>，限制长度 ErrLength="4"
			var ErrLength = jt.getAttr(oFld,'ErrLength',0);
			//[Attr] ErrLengthCap###<em>域属性</em>，限制长度 错误提示
			var ErrLengthCap = jt.getAttr(oFld,'ErrLengthCap','输入字数超过限制长度:'+ErrLength.toString());
			//[Attr] ErrSame###<em>域属性</em>，密码一致性判断 (ErrSame="input2")
			var ErrSame = jt.getAttr(oFld,'ErrSame','');
			//[Attr] ErrSameCap###<em>域属性</em>，密码一致性判断 错误提示
			var ErrSameCap = jt.getAttr(oFld,'ErrSameCap','两次密码输入不一致！');

			//密码一致性
			if ( (ErrSame!='') && (oFld.value!=jt._('#'+ErrSame).value) ){
				oForm.showError(ErrSameCap,oFld);
				return false;
			};
			if (oFld.value.replace(/ /img,'')==''){
				//不允许为空
				if (ErrEmptyCap!=''){
					oForm.showError(ErrEmptyCap,oFld);
					return false;
				};
			}else{
				//正则验证
				if (ErrCheck!=''){
					if (/^{CST_((.|\s)+?)}$/i.test(ErrCheck)) ErrCheck=eval('jt.Const.'+ErrCheck.substr(1,ErrCheck.length-2)); //替换常量
					var sVal = oFld.value;
					var reg = new RegExp(ErrCheck,"i");
					if(!reg.test(sVal)){
						oForm.showError(ErrCheckCap,oFld);
						return false;
					};
				};
				//长度超过
				//if ((ErrLength>0) && (oFld.value.replace(/[^\x00-\xff]/g,"**").length>ErrLength)){
				if ((ErrLength>0) && (oFld.value.replace(/[^\x00-\xff]/g,"*").length>ErrLength)){
					oForm.showError(ErrLengthCap,oFld);
					return false;
				};
			};
		};
		return true;
	};

    oForm.init();

    jt.addEvent(window,'onunload',function (){  //清除内存
		oForm.init = null;
		oForm.showError = null;
		oForm.onsubmit_old = null;
    });
};

/*<desc>
弹出窗口
</desc>*/
jt.PluginList.push('Window');
jt.Window = {};
jt.Window.TagName = [];

//窗口列表
jt.Window.windowList=[];

//jsfw.WebUI.Window.newWindow = function (sWindowID, sTitle,sURL,iWidth,iHeight,iLeft,iTop,bModalWindow,bNoTitle)
//[Func] jt.Window.newWindow (jParam)###新建窗口，返回<em>Win对象</em>.|||jParam格式如下|||<code>{<br>  id : 'win001', //窗口ID，可用于findWindow,delWindow<br>url : '/xxx/window.htm', //窗口内容（URL）<br>  obj : 'divWin1', //窗口内容（HTML元素对象，可以是对象ID也可以是对象）<br>title : '标题', //标题<br>noTitle : true, //是否隐藏标题<br>width : 100, height : 100, top : 10, left : 10, //位置<br>isMax : true, //是否最大化<br>maxButton : true, //是否显示最大化按钮<br>sizeable : true, //是否可调整大小<br>refreshButton : true, //是否显示刷新按钮（当窗口内容不是URL时，将不会显示刷新按钮）<br>hideButton : false, //是否显示隐藏按钮（当窗口内容是URL时，控件会自动使用关闭按钮，而且不是隐藏按钮）<br>closeButton : true, //是否显示关闭按钮<br>maskLayer : false //是否显示遮罩层<br>}</code>
jt.Window.newWindow = function (jParam){
	//查找是否已有窗口
	var sWinID=jt.getDefVal(jParam.id, '');
	if (sWinID!=''){
		var temWin=jt.Window.findWindow(sWinID);
		if (temWin!=null) {
            temWin.show();
			return temWin;
		};
	};
	var sTmpID=parseInt(Math.random()*10000000).toString();
	var me={};
	me.id  = jt.getDefVal(jParam.id, sTmpID);
	me.url = jt.getDefVal(jParam.url, '');
	if (typeof(jParam.obj)=='string'){ me.obj=jt._('#'+jParam.obj); };
	if (typeof(jParam.obj)=='object'){ me.obj=jParam.obj; };
	me.isFrame= me.url!=''; //是否是iFrame方式
	//[Attr] Win.IFrameName###<em>Win对象属性</em>，弹出窗口的IFrame名称
	me.IFrameName = 'jt_Window_' + sTmpID;
	me.noTitle= jt.getDefVal(jParam.noTitle, false);
	me.isMax  = jt.getDefVal(jParam.isMax, false);
	me.width  = jt.getDefVal(jParam.width, 480);
	me.height = jt.getDefVal(jParam.height, 360);
	me.top    = jt.getDefVal(jParam.top, -1);
	me.left   = jt.getDefVal(jParam.left, -1);
	me.title  = jt.getDefVal(jParam.title, '&nbsp;');
	me.maxButton  = jt.getDefVal(jParam.maxButton, true);
	me.sizeable   = jt.getDefVal(jParam.sizeable, true);
	me.maskLayer = jt.getDefVal(jParam.maskLayer, false);
	me.refreshButton = jt.getDefVal(jParam.refreshButton, me.isFrame);
	me.hideButton    = jt.getDefVal(jParam.hideButton, !me.isFrame);
	me.closeButton   = jt.getDefVal(jParam.closeButton, me.isFrame);

	//[Func] Win.setTitle(sTitle)###<em>Win对象方法</em>，设置窗口标题
	me.setTitle = function(sTitle){ me.title=sTitle; me.setUI(); };
	//[Func] Win.setWidth(iWidth)###<em>Win对象方法</em>，设置窗口Width
	me.setWidth = function(iWidth){me.width=iWidth; me.setUI();};
	//[Func] Win.setHeight(iHeight)###<em>Win对象方法</em>，设置窗口Height
	me.setHeight = function(iHeight){me.height=iHeight; me.setUI();};
	//[Func] Win.setLeft(iLeft)###<em>Win对象方法</em>，设置窗口Left
	me.setLeft = function(iLeft){me.left=iLeft; me.setUI();};
	//[Func] Win.setTop(iTop)###<em>Win对象方法</em>，设置窗口Top
	me.setTop = function(iTop){me.top=iTop; me.setUI();};

    me.setMaxButton = function(bShow){me.maxButton=bShow; me.sizeable=bShow; me.setUI();};
	me.setSizeable = function(bShow){me.sizeable=bShow; me.setUI();};
	me.setCloseButton=function(bShow){me.closeButton=bShow; me.setUI();};
	me.setRefreshButton=function(bShow){me.refreshButton=bShow; me.setUI();};
	me.setHideButton=function(bShow){me.hideButton=bShow; me.setUI();};
	me.setCloseButton=function(bShow){me.closeButton=bShow; me.setUI();};

	//[TODO] Chrome新开网页立即弹出Window，会有一半窗口在网页外
	if (me.left<0) me.left = jt.doc.getScrollLeft() + parseInt((jt.doc.getClientWidth()-me.width)/2);
	if (me.top<0) me.top = jt.doc.getScrollTop() + parseInt((jt.doc.getClientHeight()-me.height)/2);

    //设置内容
	me.setContent = function (){
		var oTD=me.oTab.rows[1].cells[1]; //oTD.style.height="400px";
		if (me.isFrame){
			var sHTML='';
			sHTML+='<iframe name="' + me.IFrameName + '" id="' + me.IFrameName + '" ';
			sHTML+=' onload="jt.Window.initWindowIFrame(this)" ';
			sHTML+='src="' + jt.parseURL(me.url) + '" style="width:100%;height:100%;display:inline-block;" marginwidth="0" scrolling="auto" frameborder="0"></iframe><div style="display:none">this is a Window Dialog,Write by Witson.</div>';
			oTD.innerHTML=sHTML;
		}else{
			oTD.appendChild(me.obj);
			me.obj.style.display=''; me.obj.style.width = '100%'; me.obj.style.height = '100%';
		};
	};

    me.oPop=jt.PopFrame.newFrame(''); //创建弹出框
	jt.addClass(me.oPop,'jt_Window_PopFrame');
	me.bodyScroll = document.body.scroll;
	if (!jt.bIE) me.bodyOverflow = document.body.style.overflow;
	me.oPop.style.zIndex = ++window._jt_Window_zIndex;
	me.oPop.onmouseout = null; //去除自动隐藏
	var strTem='jt._(\'[parent]table.jt_Window\',this).oWin';
	var sHTML='';
	if (jt.bIE6) sHTML += '<iframe class="PopFrameIE6IFrame" frameborder=0 src="" style="position:absolute; visibility:inherit; top:0px; left:0px; width:100%; height:100%; z-index:-1;"></iframe>'; //filter1=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';
	sHTML += '<table class="jt_Window" style="width:'+me.width+'px;height:'+me.height+'px;table-layout:fixed;" border="0" cellspacing="0" cellpadding="0">';
	sHTML += '<tr class="'+(me.noTitle?'noTitle':'')+' jt_Window_0" height="'+(me.noTitle?'':'31')+'">';
		sHTML += '<td class="jt_Window_0_0">'+jt.TransparentImg+'</td>';
		sHTML += '<td class="jt_Window_0_1">';
			sHTML += '<table style="width:100%;height:100%;table-layout:fixed; " border="0" cellspacing="0" cellpadding="0">';
			sHTML += '<tr>';
			sHTML += '<td unselectable="on" class="jt_Window_Title" ondblclick="jt._(\'[parent]table.jt_Window\',this).oWin.max()">'+me.title+'</td>';
			sHTML += '<td unselectable="on" class="jt_Window_SysButton">';
			sHTML += '<div class="jt_WinBtn jt_Window_Refresh" title="刷新" onclick="'+strTem+'.refresh()"></div>';
			sHTML += '<div class="jt_WinBtn jt_Window_Max" title="最大化/还原" onclick="'+strTem+'.max()"></div>';
			sHTML += '<div class="jt_WinBtn jt_Window_Hide" title= "隐藏" onclick="'+strTem+'.hide()"></div>';
			sHTML += '<div class="jt_WinBtn jt_Window_Close" title="关闭" onclick="jt.Window.closeWindow(this)"></div>';
			sHTML += '</td>';
			sHTML += '</tr>';
			sHTML += '</table>';
		sHTML += '</td>';
		sHTML += '<td class="jt_Window_0_2">'+jt.TransparentImg+'</td>';
	sHTML += '</tr>';
	sHTML += '<tr class="jt_Window_1">';
		sHTML += '<td class="jt_Window_1_0">'+jt.TransparentImg+'</td>';
		sHTML += '<td class="jt_Window_1_1"></td>';
		sHTML += '<td class="jt_Window_1_2">'+jt.TransparentImg+'</td>';
	sHTML += '</tr>';
	sHTML += '<tr height="6" class="jt_Window_2">';
		sHTML += '<td height="6" class="jt_Window_2_0">'+jt.TransparentImg+'</td>';
		sHTML += '<td height="6" class="jt_Window_2_1">'+jt.TransparentImg+'</td>';
		sHTML += '<td height="6" class="jt_Window_2_2">'+jt.TransparentImg+'</td>';
	sHTML += '</tr>';
	sHTML += '</table>';
	//[Attr] Win.oPop###<em>Win对象属性</em>，弹出窗口的PopFrame对象（窗口外框）
	me.oPop.getContentCell().innerHTML = sHTML;
	me.oPop.getContentCell().style.border='none';  //去除PopFrame本身的边框
	document.body.appendChild(me.oPop);
	//[Attr] Win.oTab###<em>Win对象属性</em>，弹出窗口的Table（包含窗口外框、标题栏、系统按钮的主Table）
	me.oTab=me.oPop.getContentCell().childNodes[jt.bIE6?1:0];
	//[Attr] Win.oTab.oWin###<em>窗口Table对象属性</em>，弹出窗口的Table反向查找Win，<em>Win.oTab.oWin=Win</em>
	me.oTab.oWin=me;
	me.oTitle =me.oTab.rows[0].cells[1].childNodes[0].rows[0].cells[0];
	me.oSysBtn=me.oTab.rows[0].cells[1].childNodes[0].rows[0].cells[1];


    me.oPop.DragObject=me.oTitle;
	me.oPop.Draging = function(iStatus,iX,iY,iDeltaX,iDeltaY){
		if (iStatus==0) {
			me.oPop.style.zIndex = ++window._jt_Window_zIndex;
		};
	};
	jt.DragDrop.FormatUI(me.oPop);

    me.oPop.popup(me.left,me.top);
	me.setContent();

    me.divGray=null;
	if (me.maskLayer){
		document.body.scroll='no';
		if (!jt.bIE) document.body.style.overflow='hidden';
		me.divGray=document.createElement("div");
		//me.divGray.style.border='1px solid red';
		me.divGray.style.position='absolute';
		me.divGray.style.left=jt.doc.getScrollLeft()+'px';
		me.divGray.style.top=jt.doc.getScrollTop()+'px';
		me.divGray.style.height= '100%';//document.body.clientHeight;
		me.divGray.style.width= '100%';//document.body.clientWidth;
		me.divGray.style.backgroundColor='#333333';
		me.divGray.style.filter = 'alpha(opacity=35)';
		me.divGray.style.MozOpacity=0.35;
		me.divGray.style.opacity=0.35;
		me.divGray.style.zIndex = window._jt_Window_zIndex-1;
		document.body.appendChild(me.divGray);
	};

    //[Func] Win.getIFrame()###<em>Win对象方法</em>，获取IFrame
	me.getIFrame = function (){
		if (document.frames){return document.frames[me.IFrameName]; }else{ return jt._('#'+me.IFrameName).contentWindow; };
	};

    //[Func] Win.bringToFront()###<em>Win对象方法</em>，把窗口移到最上面;
	me.bringToFront = function(){
		if (me.divGray!=null) me.divGray.style.zIndex = ++window._jt_Window_zIndex;
		me.oPop.style.zIndex = ++window._jt_Window_zIndex;
	};

    //[Func] Win.refresh()###<em>Win对象方法</em>，刷新窗口
	me.refresh = function(){
		me.getIFrame().history.go();
	};
	//[Func] Win.max(bMax)###<em>Win对象方法</em>，最大化、还原窗口(bMax可为空)
	me.max = function(bMax){
		if (typeof(bMax)!='boolean') bMax= !me.isMax;
		me.isMax=bMax;
		me.oPop.CanDrag=!bMax;
		me.setUI();
        //修改调整窗口大小功能
		//处理AfterResize方法
	};
	//[Func] Win.show()###<em>Win对象方法</em>，显示窗口
    me.show = function () {
		if (me.divGray!=null) me.divGray.style.display='';
        me.oPop.show();
	};
	//[Func] Win.isShow()###<em>Win对象方法</em>，获取窗口是不是显示
    me.isShow = function () {
        return me.oPop.style.display != 'none';
	};
	//[Func] Win.hide()###<em>Win对象方法</em>，隐藏窗口|||相关触发函数：|||<code>jtAfterWindowHide ()</code>窗口隐藏前触发
	me.hide = function(){
		if (me.divGray!=null) me.divGray.style.display='none';
		document.body.scroll=me.bodyScroll;
		if (!jt.bIE) document.body.style.overflow=me.bodyOverflow;
        me.oPop.hide(0);
		if(typeof(jtAfterWindowHide)=='function') jtAfterWindowHide(me);
		if(typeof(me.afterHide)=='function') me.afterHide(); //调用控件追加函数
	};
	//[Func] Win.close()###<em>Win对象方法</em>，关闭窗口|||相关触发函数：|||<code>jtBeforeWindowClose (oWin)</code>窗口关闭前触发,如果return false 则窗口不关闭|||<code>jtAfterWindowClose ()</code>窗口关闭前触发
	me.close = function(bFromWindowList){
		if (!jt.getDefVal(bFromWindowList,false)) {
			jt.Window.delWindow(me);
			return;
		};
		if(typeof(jtBeforeWindowClose)=='function') {
			if (!jtBeforeWindowClose(me)) return;
		};
		if (me.isFrame) var oFrm=me.getIFrame();
		if (me.isFrame) {
			try{
				//调用IFrame内的函数
				if(typeof(oFrm.jtBeforeWindowClose_IFrame)=='function') {
					if (!jtBeforeWindowClose_IFrame(me)) return;
				};
			}catch(e){};
		};

        //document.body.scroll=me.bodyScroll;
		if (me.divGray!=null) document.body.removeChild(me.divGray);

        //setTimeout(function (){me.hide},500);
		me.hide();
		//if (!me) return;
		if (me.isFrame) {
			try{
				//me.getIFrame().document.write("");
				//me.getIFrame().document.clear();
			}catch(e){};
			//try{ me.getIFrame().location='about:blank'; }catch(e){};
			if(typeof(jtAfterWindowClose)=='function') jtAfterWindowClose(me);
			try{
				if(typeof(oFrm.jtAfterWindowClose_IFrame)=='function') oFrm.jtAfterWindowClose_IFrame(me); //调用IFrame内的函数
			}catch(e){};
		};
		setTimeout(freeMem,500);
	};
//调整位置及大小，设置标题
	me.setUI = function (){
		me.oTitle.innerHTML = me.title;
		var btns=me.oSysBtn.childNodes;
		btns[0].style.display = me.refreshButton?'':'none';; //刷新
		btns[1].style.display = me.maxButton?'':'none'; //最大化/还原
		btns[2].style.display = me.hideButton?'':'none'; //隐藏
		btns[3].style.display = me.closeButton?'':'none'; //关闭
		me.oTab.rows[1].cells[1].style.height = '';
		if (me.isMax){
			document.body.scroll='no';
			if (!jt.bIE) document.body.style.overflow='hidden';
			me.oPop.style.width =document.body.clientWidth+'px';
			me.oPop.style.height=document.body.clientHeight+'px';
			me.oPop.style.left  =jt.doc.getScrollLeft()+'px';
			me.oPop.style.top   =jt.doc.getScrollTop()+'px';
			me.oTab.style.width='100%'; me.oTab.style.height='100%';
		}else{
			me.oPop.style.width='';       me.oPop.style.height='';
			me.oPop.style.left=me.left+'px';   me.oPop.style.top=me.top+'px';
			me.oTab.style.width=me.width+'px'; me.oTab.style.height=me.height+'px';
			if (!me.maskLayer){
				document.body.scroll=me.bodyScroll;
				if (!jt.bIE) document.body.style.overflow=me.bodyOverflow;
			};
		};
		if (jt.browser.msie && (!jt.browser.quirks)){
			me.oTab.rows[1].cells[1].style.height='';
			setTimeout(function(){
				me.oTab.rows[1].cells[1].style.height = (me.height-me.oTab.rows[0].cells[0].offsetHeight-me.oTab.rows[2].cells[0].offsetHeight) + 'px';
			},1);
		}
		//setTimeout(function(){
			//me.oTab.rows[1].cells[1].style.height = (me.height-me.oTab.rows[0].cells[0].offsetHeight-me.oTab.rows[2].cells[0].offsetHeight) + 'px';
		//},100);
	};


    //最大化时改变大小
	//jt.addEvent(window,'onresize',function (){
    //alert(12)
	//});
	jt.addEvent(window,'onunload',function (){
		freeMem();
	});
	function freeMem(){  //清除内存
		try{me.hide()}catch(e){};
		try{
			me.setCloseButton = null;    me.setHideButton = null;  me.setMaxButton = null;
			me.setRefreshButton = null;  me.setSizeable = null;    me.setTitle = null;

            me.setHeight = null; me.setWidth = null;   me.setLeft = null;   me.setTop = null;

            me.setContent = null;
			me.getIFrame = null;
			me.obj = null;
			me.refresh = null;
			me.max = null;
			me.show = null;
			me.isShow = null;
			me.hide = null;
			me.close = null;

            me.setUI = null;

            me.oPop.DragObject = null;
			me.oTitle = null;
			me.oSysBtn= null;
			me.afterHide=null;
			me.bringToFront = null;

            if (me.oTab) me.oTab.oWin = null;
			me.oTab = null;
		}catch(e){};
		try{
			jt.Window.delWindow(me)
		}catch(e){};
	};
	jt.Window.windowList.push(me);
	me.setUI();
	if (me.isMax) me.max(true);
	return me;
};

//[Func] jt.Window.delWindow (oValue)###关闭窗口|||oValue可以是 窗口id 或 Win对象 或 iFrame
jt.Window.delWindow = function (oValue){
	var aWin=jt.Window.findWindow(oValue);
	if (!aWin) return;
	var arr=jt.Window.windowList;
	for (var i=0; i<arr.length; i++){
		if (arr[i]==aWin){
			arr.splice(i,1);
			try{ aWin.close(true); }catch (e){};
			return;
		};
	};
};

//[Func] jt.Window.findWindow (oValue)###查找窗口
jt.Window.findWindow = function (oValue){
	var arr=jt.Window.windowList;
	if (typeof(oValue)=='string'){
		for (var i=0; i<arr.length; i++){
			if(arr[i].id==oValue) return arr[i];
		};
	};
	if (typeof(oValue)=='object'){
		if (oValue.oPop && oValue.setContent && oValue.setUI) return oValue;
		for (var i=0; i<arr.length; i++){
			if ((arr[i].isFrame) && (arr[i].getIFrame()==oValue)) return arr[i];
		};
	};
	return null;
};

//初始化IFrame
jt.Window.initWindowIFrame = function(obj){
	var oWin=jt._('[parent]table.jt_Window',obj).oWin;
	var oFrm=oWin.getIFrame();
	try{ oWin.setTitle(oFrm.document.title); }catch(e){};
	try{
		oFrm.close=function(){ oWin.close(); };
		oFrm.returnFunc=function(param){ try {oWin.returnFunc(param); }catch(e){} };
	}catch(e){};
};
//解决窗口无法关闭问题
jt.Window.closeWindow = function(obj){
	if (!jt.hasClass(obj,'jt_Window')) obj=jt._('[parent]table.jt_Window',obj);
	if (obj.oWin) {
		obj.oWin.close();
		return;
	}
	obj.parentNode.hide(0);//obj.parentNode.style.display='none';
};
