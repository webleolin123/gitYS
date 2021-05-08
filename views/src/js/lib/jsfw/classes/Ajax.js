/*******************************************\
  Ajax 类(2006-7-30)
\*******************************************/
jsfw.Class.Ajax = function (){
	var me = this;
	var navName = (function (){
		var u = navigator.userAgent.toLowerCase();
		if (/gecko/i.test(u)) return "moz";
		if (/msie/i.test(u)) return "ie";
		return "other";
	})();
	var ie = navName=="ie";
	var moz = navName=="moz";

	// xmlHttp对象
	this.xmlHttp = function (){
		if (ie){
			for (var i=0; i<5; i++){
				try{
					var r = new ActiveXObject(["MSXml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0"][i]);
					//var r = new ActiveXObject(["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "MSXml2.XMLHTTP", "Microsoft.XMLHTTP"][i]);
				}catch(e){}
				if (r) return r;
			}
			return null;
		}else return new XMLHttpRequest();
	}

	// xmlDom对象
	this.xmlDom = function (){
		if (ie)
			for (var i=0; i<4; i++)
				try{
					var r = new ActiveXObject(["MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument", "MSXML3.DOMDocument"][i]);
					return r;
				}catch (e){return null;}
		else return document.implementation.createDocument("", "doc", null);
	}

	//下载远程HTML代码到网页中
	this.loadHttpToObj = function (url,obj,bShowLoading){
		if ( (typeof(bShowLoading)!='boolean') || (bShowLoading) ) obj.innerHTML='正在载入';
		me.loadHttp(url, true, function(r,o){
			o.innerHTML=r.responseText;
			var objs=o.getElementsByTagName('script');
			jsfw.FormatUI(o);
			for (var i=0; i<objs.length; i++){
				if (objs[i].src){
					jsfw.Call(objs[i].src,true);
				}
				eval(objs[i].innerHTML);
			}
		},obj);
	}

	// 装载一个Http
	this.loadHttp = function (url, asy, fun, exObj){ //Add 'exObj' By Witson
		var xmlHttp = this.xmlHttp();
		xmlHttp.open("GET", url, (asy ? true : false));
		if (asy){
			xmlHttp.onreadystatechange = function(){
				if(xmlHttp.readyState==4) {
					if (fun) fun (xmlHttp,exObj);
					setTimeout(function (){delete xmlHttp; xmlHttp=null;},100);
				}
			};
			xmlHttp.send(null);
		}else{
			try{
				xmlHttp.send(null);
			}catch (e){
				throw new Error("LoadHttp Error.");
				return;
			}
			setTimeout(function (){delete xmlHttp; xmlHttp=null;},100);
			return xmlHttp.responseText;
		}
	}

	// 装载一个XmlDom
	this.loadXml = function (url, asy, fun, exObj){ //Add 'exObj' By Witson
		var xmlDom = this.xmlDom();
		xmlDom.async = asy ? true : false;
		if ((asy) && (fun)){
			if (ie) xmlDom.onreadystatechange = function (){
				if(xmlDom.readyState == 4){
					fun(xmlDom,exObj);
					setTimeout(function (){delete xmlDom; xmlDom=null;},100);
				}
			}
			else xmlDom.onload = function (){
				fun(xmlDom,exObj);
				setTimeout(function (){delete xmlDom; xmlDom=null;},100);
			}
		}
		try{
			xmlDom.load(url);
		}catch(e){
			if (!asy){
				return (new DOMParser()).parseFromString(me.loadHttp(url),"text/xml");
			}else{
				me.loadHttp(url,asy,function (r){
					fun((new DOMParser()).parseFromString(r.responseText,"text/xml"),exObj);
				});
			}
			/*alert(asy);
			xmlDom=new DOMParser();
			alert(me.loadHttp(url,asy));
			me.loadHttp(url,asy,function (r){
			alert(1);
			});
			alert(11);*/
		};
//		alert(me.loadHttp(url));
//				return (new DOMParser()).parseFromString(me.loadHttp(url),"text/xml");
		if ((!asy) && (fun)) {
			fun(xmlDom,exObj);
			setTimeout(function (){delete xmlDom; xmlDom=null;},100);
		}
		if (!fun) setTimeout(function (){delete xmlDom; xmlDom=null;},100);
		return xmlDom;
	}
	
	//将Form提交
	this.postDataHttp = function (aForm,asy,fun,exObj){
		var xmlHttp = this.xmlHttp();
//		xmlHttp.open("GET", url, (asy ? true : false));
		if (aForm.action==''){alert('Form 的 action 属性不允许为空！');return;}
		xmlHttp.open("post",aForm.action,asy);
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		if (asy){
			xmlHttp.onreadystatechange = function(){
				if(xmlHttp.readyState==4) {
					if (fun) fun (xmlHttp,exObj);
					setTimeout(function (){delete xmlHttp; xmlHttp=null;},100);
				}
			};
			xmlHttp.send(me.getRequestBody(aForm));
		}else{
			try{
				xmlHttp.send(me.getRequestBody(aForm));
			}catch (e){
				throw new Error("LoadHttp Error.");
				return;
			}
			setTimeout(function (){delete xmlHttp; xmlHttp=null;},100);
			return xmlHttp.responseText;
		}
	}
	this.postDataXml = function (aForm,asy,fun,exObj){
		var xmlDom = this.xmlDom();
		xmlDom.async = asy ? true : false;
		if (asy){
			if (ie) xmlDom.onreadystatechange = function (){
				if(xmlDom.readyState == 4) {
					if (fun) fun(xmlDom,exObj);
					setTimeout(function (){delete xmlDom; xmlDom=null;},100);
				}
			}
			else xmlDom.onload = function (){
				fun(xmlDom,exObj);
				setTimeout(function (){delete xmlDom; xmlDom=null;},100);
			}
		}
		xmlDom.open("post",aForm.action,true);
		xmlDom.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlDom.send(me.getRequestBody(aForm));
		//xmlDom.load(url);
		if (!fun) setTimeout(function (){delete xmlDom; xmlDom=null;},100);
		return xmlDom;
	}
	this.getRequestBody = function(aForm){
		var aParams=new Array();
		for(var i=0;i<aForm.elements.length;i++){
			//radio还未处理
			//if (!((aForm.elements[i].type=='checkbox') && (!aForm.elements[i].checked))){
			if (!(((aForm.elements[i].type=='checkbox')||(aForm.elements[i].type=='radio')) && (!aForm.elements[i].checked))){
				var sParam=encodeURIComponent(aForm.elements[i].name);
				sParam+="=";
				sParam+=encodeURIComponent(aForm.elements[i].value);
				aParams.push(sParam);
			}
		}
		return aParams.join("&");
	}

	// 二进制转换
	this.Bin2Str = function (binary){
		var rec = new ActiveXObject("ADODB.RecordSet");
		rec.Fields.Append("DDD",201,1);
		rec.open();
		rec.addNew();
		rec(0).appendChunk(binary);
		rec.update();
		var result = rec(0).value;
		rec.Close();
		return result;
	}
	// 取得xmlDom对象的xml内容
	this.getXml = function (xDom){
		if (ie) return xDom.xml;
		else return (new XMLSerializer()).serializeToString(xDom);
	}
	//获取XML节点内容
	this.getNodeText = function (Node){
		var Text = "";
		for(var i = 0; i < Node.childNodes.length;i++){
			if(Node.childNodes[i].hasChildNodes()){
				Text += getText(Node.childNodes[i]);
			}else{
				Text += Node.childNodes[i].nodeValue;
			}
		}
		return Text;
	}

/*	//嘿嘿，小偷程序
	this.getRemote = function (url, char, reg){
		return this.loadHttp(jsfw.Path + "classes/_Ajax/remote.asp?url=" + url + "&char=" + char + "&reg=" + reg, false);
	}*/
}