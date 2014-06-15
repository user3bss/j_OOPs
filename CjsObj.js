
/*
http://sirdarckcat.blogspot.com/2007/07/passing-reference-to-javascript.html
Modify private Var

Object.prototype.$=function $(val){if(val)this.valueOf=this.toSource=this.toString=function(){return val};return val;};
function DownTown(){
var private=Object("You cant modify me");
this.get=function(){
return private;
}
this.export=function(callback){
callback(private);
}
}
var blackbox=new DownTown();
alert(blackbox.get());
blackbox.export(function(x){x.$("new val!")});
alert(blackbox.get());
*/

function info(s, ln){
    var sc = "[INFO] : "+s+"\t\t (line "+ln+")";
    console.log(sc);
}
var js = eval;

//Gets the keys from an object and returns as an array
var getKeys = function(o){
	var a = new Array();
	for (var key in o){
		a.push(key);
	}
	return a;
};

function loadScript(url, callback){
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}

/* var types as enum

	would add a function for enumeration but this serves as a map for the data
	the integers should compare quicker than strings IDK?
	the integers are also smaller than strings, so you can add them to the object!
	should rename the type function to gType or something

I don't like how:
	type(var) == types.object	
	typeof(var) == "Object"   // the original is actually shorter
	
	
But you gain the enum map so
	type(var) == types.object

where

var types = {
	Undefined: 0,
	Object: 1,
	Function: 1
}

would return
	(types.Function == types.object) as true
	
	
this is good because functions are objects in JS!
*/
//I want this funtion to have a default if nothing is called from it
Array.prototype.inArray = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var type = function(o){
	var types = {
		Number: 1,
		String: 2,
		Function: 3,
		Object: 4,		
		Window: 5,
		Array: 6,
		Null: 0,
		Undefined: -1,
	}	
	var typeS = null;
	var typeI = null;
	
	var asInt = function(t){
		//info(typeS, 92);
		typeS = typeof(t);
		switch (typeS){
			case "object": 
				typeI = types.Object;
				break;			
			case "function": 
				typeI = types.Function;
				break;			
			case "number":
				typeI = types.Number;
				break;			
			case "string":
				typeI = types.String;
				break;			
			case "undefined":
				typeI = types.Undefined;
				break;			
			default: 
				typeI = -1; //means unIdentified
				break;
        }
		//support JS object names using type
		if(typeI > types.Function){
			typeS = getObjectType(t); //returns a string
			//convert from string to int in types enum
			if(typeI > types.Function){
				//info("Type is "+typeS+" for "+t.toString(), 114);
				var a = getKeys(types); //a = array of strings
				for(var i=0;i<a.length;i++){
					//if(t == i)
					if(typeS == a[i]){
						//info("Match: "+a[i],108);	//return the string if == to property name
						typeI = types[a[i]];
					} else {
						//info("Skipping type: "+a[i]+" val: "+types[a[i]], 122);
					}
				}
				if(i == (a.length -1))
					info("Type is "+typeI+" for "+t, 126);			
			}		
		}
		//info(typeI, 129);
		return typeI;
	}

	//converts from type.types int to string
	var asString = function(t){
		typeI = asInt(t); 
		//asInt updates typeS var
		return typeS;
	}
		
	var Thingtype = function(t){
		if(t===null)return "[object Null]"; // special case
		return Object.prototype.toString.call(t);
	}
	var getObjectType = function(t){

		//info(Thingtype, 28);
		var tt = Thingtype(t);
		var r = /^\[[object\s]+([A-z0-9]+)\]$/;	
		var tst = r.test(tt);
		if(tst){
			var v = r.exec(tt);
			if(typeof(v[1]) != "undefined"){
				//info(v[1], 156);
				return v[1];
			}
		}
		return false;
	}
	
	//verbose variable print out
	var type_info = function(t, key){
		if((asInt(key) == types.object) && (asInt(t) == types.object))
			info("type:"+asString(t.key)+", value: "+t.key+", name: "+key, 194);
		else if(type(t) == types.object){
			info("type:"+t.toString()+", value: "+t, 196);
		}
		else
			info("type:"+type(t)+", value: "+t, 200);
	}

	var getTypeFromObject = function(t, key){
		info("GetTypeFromObject", 204);
		var ty = asInt(t);
		if((ty == types.Object || ty == types.Function)){
			type_info(ty);
		
			if(asInt(key) != types.Undefined){
				switch (ty){
					case types.Object: 
						info("object: "+t.key, 212);
						return "object";
					case types.Function: 
						info("function: "+t.key, 215);
						return "function";
					default: 
						//info("type:"+type(o.key)+", value: "+o[key]+", name: "+key, 102);
						break;        
				}
			}
		}
	}	
	//try to support public->private calls via this keywork.
	this.get = function(t){
		//if(asInt(t) == types.Function)
		if(this.prototypeFunctions.inArray(t))
			return t();
		else
			return t;
	}
	this.set = function(t, v){
		if((this.prototypeFunctions.inArray(t)) && (asInt(v) > types.Null))
			t(v);
		else if(asInt(v) > types.Null)
			t = v;
	}
	//alert(getKeys(this));
	var testOverRide = "not Overriden";
	
	this.getTypes = function(b, c){
		if(c)
			var a = getKeys(types);
		else
			var a = getKeys(this.types);
		if(a.length > 0 && b){
			for(var i=0;i<a.length;i++){
				info("type: "+a[i]+" val: "+types[a[i]], 215);
			}
			if(c && b)
				info("types: "+asString(types), 218);			
			return a;
		} else {
			if(c && b)
				info("types: "+asString(types), 222);
			else if(b)
				info("this.types: "+asString(this.types), 224);
			
		}
		return false;
	}
	
	
	/*
	this.prototypeVars = new Object();
	this.prototypeVars.types = types;
	this.prototypeVars.typeS = typeS;
	this.prototypeVars.typeI = typeI;
	*/
	this.prototypeFunctions = new Object();		
	this.prototypeFunctions.asInt = asInt;	
	this.prototypeFunctions.asString = asString;	
	this.prototypeFunctions.Thingtype = Thingtype;	
	this.prototypeFunctions.getObjectType = getObjectType;	
	this.prototypeFunctions.type_info = type_info;	
	this.prototypeFunctions.getTypeFromObject = getTypeFromObject;
	
	//return asInt(o); //return int as default
	//return typeS; //return typeof result, this will break further down the chain
	//return asString(o); //return compiled Object definition string		
	//return getObjectType(o);

	//info(this.getTypes(), 245);
	//info(asString(o), 246);		
	return this;
}
//can call prototype functions within a function using eval
var getFunct = function(t, fName, attr){
    //info(getKeys(t));
    var a = getKeys(t);
    if(a.length > 0){
        var b = t[a[1]];     //a[1] is the functions array
        var c = getKeys(b);  //c = function names
        var d = [c[0]];    //d = the function to call
        //figured out function exists
        //info(attr.toSource());
        //info(attr.valueOf());
        //var f = eval("t."+a[1]+"."+d+"("+attr.toString()+");");
        //var f = eval("t."+[a[1]]+"."+[c[0]]+"('"+t+"');");
        var f = "t."+a[1]+"."+d+"(Cobj);";
        info(f);
        eval(f);
        //var f = t[a[1].c[0]](b);
       // var aTy = typ
        if(true){

        }
    }
}

/*
var ty = {String: 8};
//void(type.prototype.types = ty); 
type.prototype.getTypes1 = function(){
    return getKeys(type.prototype.types);
}
//info(type().getTypes(), 5); //another way to call public method
var t = new type();
//t.prototypeVars.types = ty;
t.getTypes(true, false);
//info(t.getTypes1(), 9);


seems that prototyping adds variables using the this.PushNewVariableToObject; syntax
I want to call it the .push syntax because of Array.push

void(type.prototype.types = ty)
will add 
	this.types = ty;

to access variables the this keyword is required

type.prototype.getTypes1 = function(){
    return getKeys(type.prototype.types);
}

or

type.prototype.getTypes1 = function(){
    return getKeys(this.types);
}

will access the same thing;

I originally thought that prototype was overwriting
variables declared in a function via the var keywork
but that is not the case

var t = new type();
info(t.testOverRide, 0);
type.prototype.testOverRide = "OverRiden";
info(t.testOverRide, 0);

executing the above code yeilds:
undefined
OverRiden

that's because the declaration of the variable
function type(){
	var testOverRide = "not Overriden";
}

is private it's always there but is inaccessable by anything
outside of the function brackets

the prototype statement 
type.prototype.testOverRide = "OverRiden";

merly adds this.testOverRide as a new variable
which fixes the undefined problem because it just created a publicly accessable variable.

if I were to declare the variable using the this keyword in the original function
definition I wouldn't have to use the prototype method.

function type(){
	this.testOverRide = "not Overriden";
}


Considiring functions:

var t = new type();
info(t.asString("sdf"));

returns TypeError: t.asString is not a function but if I tried the following


function type(){
	var astring = function(){
		//... some code
	}
	this.prototypeFunctions = new Object();	
	this.prototypeFunctions.asString = asString;
}

t.prototypeFunctions.asString("sdf");
and it works.

because it passes the private functions address pointer to the array;


trying it with variables doesn't work though because the array saves the objects.

*/







var Classes = new Array();
var Cobj = function(){
    Classes.push("Cobj");
    var Class = "Cobj";
    var baseClass = null;
    this.parent = null;
	var hasExtensions = new Array();
	
	
    this.construct = function(){
        info("Constructing "+Class, 119);
    }
    this.dump = function(){
        //dump all variables
		for (var key in this){
			this.getType(this[key]);
		}
    }
    this.getClass = function(){
        return Class;
    }
    this.extendThis = function(o){
        for(each in o){
            info("Extending Property: "+each, 134);
        }
    }
    this.functionString = function(o){
        info("function string", 138);
        var message; //concatinated message: output
        var params;
		this.mode = "public_property";
        //this.getType(o);/
        message = "";
        return this;
    }
    this.construct();
	 //getObjectType(this);
	return this;
}


//prototyping provides a way to override
//private members of an non instantiated object.
function prototypeTest(o){
	// these var don't have this scope
	// so their over ridable via prototype
    var Class = "prototypeTest";
    var baseClass = null;
	var prototypeVar1 = null;	
	
	this.getClass = function(){
		return Class;
	}
	this.getBaseClass = function(){
		return baseClass;
	}
	
    var prototypeVar = function(){
        info("prototypeVar didn't update", 166);
		prototypeVar1 = 1;
		if(prototypeVar1 == 1)
			info("prototypeVar update in base obj", 169);
		else
			info("prototypeVar didn't update in base obj", 171);
    }
    this.nonPrototypeVar = function(){
        info("nonPrototypeVar didn't update", 160);
    }
	
    var construct = function(){
		prototypeVar1 = true;
        info("Constructing "+Class+" prototypeable var =  " +prototypeVar1, 175);
		info("arguments: "+o, 175);
		//this.nonPrototypeVar(); //not a function
    }
    construct(o);
	return this;	
}

function test_MultipleInheritance(parent, property, value){
	Object.prototype
}

function test_prototype(){
	parent = prototypeTest;
	parent.prototype.Class = "test_prototype";
	parent.prototype.baseClass = "prototypeTest";
	parent.prototype.construct = function(){
		//info("prototype construct "+parent);
		//info("Constructing: "+this.prototypeVar1); //undefined, doesn't throw an error?
		//info("Constructing: "+prototypeVar1); //undefined		
		//prototypeVar1 = 9;
		//info("Constructing prototypeable var" +prototypeVar1, 177);		
		//info("Constructing "+Class+" prototypeable var" +prototypeVar1, 177);
		//info("Constructing "+Class+" prototypeable var" +prototypeVar1, 177);
		//can't access variables declared in the object geting prototyped
		// var prototypeVar1 = 1;
		//
		//parent.prototype.construct = function(){
		//	info(prototypeVar1) //class is 
		//}
		
		//this.parent.construct();
		//construct();
		//this.construct();
	}
	parent.prototype.prototypeVar = function(){
		info("prototype PrototypeVar", 186);
	}
	parent.prototype.nonPrototypeVar = function(){
		info("prototype nonPrototypeVar", 189);
	}
	//prototypeTest(); //no protypeing witnessed
	return new parent("testing");
}