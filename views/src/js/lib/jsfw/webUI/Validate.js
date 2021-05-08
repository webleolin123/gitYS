if (!JSFW_CST_VALIDATE_EMAIL){
	//Email
	var JSFW_CST_VALIDATE_EMAIL="^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$";
	//Integer 整数
	var JSFW_CST_VALIDATE_INTEGER="^-?\\d+$";
	//Positive Integer 正整数
	var JSFW_CST_VALIDATE_POSITIVEINTEGER="^\\d+$";
	//UserID 用户ID
	var JSFW_CST_VALIDATE_USERID="^[A-Za-z0-9_-]{4,20}$";
	//Number 数字型
	var JSFW_CST_VALIDATE_NUMBER="^-?\\d+(\\.)?\\d*$";
	//PositiveNumber 正数
	var JSFW_CST_VALIDATE_POSITIVENUMBER="^\\d+(\\.)?\\d*$";
	//IP IP地址
	var JSFW_CST_VALIDATE_IP="^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$";
	//FileName 文件名
	var JSFW_CST_VALIDATE_FILENAME='^[^?\\\\*|"<>:/]{1,256}$';
	//Date 日期
	//var JSFW_CST_VALIDATE_DATE="^((1[6-9])|([2-9]\\d))\\d{2}(\\.|-)((1[0-2])|[1-9])$";
	//var JSFW_CST_VALIDATE_DATE="^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$";
	var JSFW_CST_VALIDATE_DATE="^((((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13578]|1[02])(-|\\.)(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13456789]|1[012])(-|\\.)(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)0?2(-|\\.)(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\\.)0?2(-|\\.)29-))$";
	//Time 时间
	var JSFW_CST_VALIDATE_TIME="^(([0-1]?\\d)|(2[0-3])):([0-5]?\\d):([0-5]?\\d)$";//"^((\\d)|(1\\d)|(2[0-3])):((\\d)|())$";
	//DateTime 完整时间
	var JSFW_CST_VALIDATE_DATETIME="^((((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13578]|1[02])(-|\\.)(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)(0?[13456789]|1[012])(-|\\.)(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})(-|\\.)0?2(-|\\.)(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\\.)0?2(-|\\.)29-)) (([0-1]?\\d)|(2[0-3])):([0-5]?\\d):([0-5]?\\d)$";
}

jsfw.WebUI.Validate = function (oForm){
	if (!jsfw.WebUI.Tip) jsfw.Import("WebUI.Tip");
	oForm.onsubmit_old = oForm.onsubmit;
	oForm.onsubmit = function (){
		jsfw.WebUI.Tip.delTip();
		for(var i=0;i<oForm.elements.length;i++){
			var oFld = oForm.elements[i];
			if ((oFld.type=='checkbox') || (oFld.type=='radio')) continue; //radio还未处理
			if (oFld.nodeName=='FIELDSET') continue; //FIELDSET还未处理
			var ErrEmpty = oFld.getAttribute('ErrEmpty')||'';
			var ErrCheck = oFld.getAttribute('ErrCheck')||'';
			var ErrLength = oFld.getAttribute('ErrLength')||'';
			var ErrLengthCap = oFld.getAttribute('ErrLengthCap')||'';
			var ErrSame = oFld.getAttribute('ErrSame')||'';
			var ErrSameCap = oFld.getAttribute('ErrSameCap')||'两次密码输入不一致！';
			var ErrCaption=oFld.getAttribute('ErrCaption')||'输入不合法！';
			
			if (ErrSame!=''){
				if (oFld.value!=jsfw.$(ErrSame).value){
					jsfw.WebUI.Tip.newTip(ErrSameCap,oFld);
					try{oFld.select();oFld.focus();}catch(e){};
					return false;
				}
			}

			if (oFld.value.replace(/ /img,'')==''){
				//不允许为空
				if (ErrEmpty!=''){
					jsfw.WebUI.Tip.newTip(ErrEmpty,oFld);
					try{oFld.focus();}catch(e){};
					return false;
				}
			}else{
				//正则验证
				if (ErrCheck!=''){
					if (ErrCheck.substr(0,1)=='@'){
						var sReg = eval(ErrCheck.toUpperCase().replace(/@/i,'JSFW_CST_VALIDATE_'));
					}else{
						var sReg = ErrCheck;
					}
					var sVal = oFld.value;
					var reg = new RegExp(sReg,"i");
					if(!reg.test(sVal)){
						jsfw.WebUI.Tip.newTip(ErrCaption,oFld);
						try{oFld.focus();}catch(e){};
						return false;
					}
				}
				if (ErrLength!=''){
					if (parseInt(ErrLength)>0){
						if (oFld.value.length>parseInt(ErrLength)){
							jsfw.WebUI.Tip.newTip(ErrLengthCap,oFld);
							try{oFld.focus();}catch(e){};
							return false;
						}
					}
				}
			}
		}
		if (oForm.onsubmit_old==null) return true;
		return oForm.onsubmit_old();
	}
	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oForm.onsubmit_old = null;
	});
};

jsfw.WebUI.Validate.TagName = 'form';