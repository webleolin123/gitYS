jsfw.WebUI.DateTime = function (oDiv){
	if (!Date.prototype.format) jsfw.Import("prototypes.Date");	//加载 Date 扩展方法
	var strTem='';
	var strTem=oDiv.getAttribute('Date');
	var temDate=new Date();
	if ((strTem) && (strTem!='')){
		temDate = Date.fromString(strTem);
		if (!temDate.getFullYear()) temDate=new Date();
	}
	oDiv._year = temDate.getFullYear();
	oDiv._month = temDate.getMonth() + 1;
	oDiv._day = temDate.getDate();
	oDiv.year = oDiv._year;
	oDiv.month = oDiv._month;
	oDiv.day = oDiv._day;

	//选择年度
	var oSelYear = document.createElement('div');
	oSelYear.className = 'DateTime_SelYear';
	oSelYear.style.position = 'absolute';
	oSelYear.style.display = 'none';
	var timYear;
	oSelYear.onmouseout = function(){
		clearTimeout(timYear);
		timYear = setTimeout(function(){oSelYear.style.display='none';},500);
	}
	oSelYear.onmouseover = function(){
		clearTimeout(timYear);
		oSelYear.style.display='';
	}

	//选择月份
	var oSelMonth = document.createElement('div');
	oSelMonth.className = 'DateTime_SelMonth';
	oSelMonth.style.position = 'absolute';
	oSelMonth.style.display = 'none';
	var timMonth;
	oSelMonth.onmouseout = function(){
		clearTimeout(timMonth);
		timMonth = setTimeout(function(){oSelMonth.style.display='none';},500);
	}
	oSelMonth.onmouseover = function(){
		clearTimeout(timMonth);
		oSelMonth.style.display='';
	}

	var oTable = document.createElement('table');
	oTable.insertRow(0).insertCell(0).className = 'DateTime_Foot';
	oTable.insertRow(0).insertCell(0).className = 'DateTime_Body';
	oTable.insertRow(0).insertCell(0).className = 'DateTime_Head';
	oTable.width = '100%';
	oTable.cellPadding = 0;
	oTable.cellSpacing = 0;
	oTable.border = 0;

	//行1,选择年、月
	strTem='';
	strTem += '<label id="year" name="year" onclick="this.parentNode.parentNode.parentNode.parentNode.showSelYear()">'+oDiv._year+'</label>年 &nbsp;';
	strTem += '<label id="month" name="month" onclick="this.parentNode.parentNode.parentNode.parentNode.showSelMonth()">'+oDiv._month+'</label>月';
	oTable.rows[0].cells[0].innerHTML = strTem;

	oDiv.showDays = function (){
		var strTem='';
		strTem += '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
		strTem += '	<tr>';
		strTem += '		<th class="wk">周</th>';
		strTem += '		<th>日</th>';
		strTem += '		<th>一</th>';
		strTem += '		<th>二</th>';
		strTem += '		<th>三</th>';
		strTem += '		<th>四</th>';
		strTem += '		<th>五</th>';
		strTem += '		<th>六</th>';
		strTem += '	</tr>';
		var sYM = oDiv.getYear() + '-' + oDiv.getMonth();
		var t=Date.fromString(sYM + '-1');
		var t2=Date.fromString(sYM + '-' + t.getMonthDays());
		var iWFirst = t.getWeekNumber();
		/*var iWEnd = t2.getWeekNumber();
		if (iWEnd==1){
			t2.setDate(t.getMonthDays()-7);
			iWEnd = t2.getWeekNumber()+1;
		}*/
		for (var iRow=0; iRow <= 8; iRow++){
			if ((iRow*7 - t.getDay() + 1) > t.getMonthDays()) break;
			strTem += '	<tr align="center" onmouseover="this.style.backgroundColor=\'#F5F5F5\'" onmouseout="this.style.backgroundColor=\'\'">';
			if ((t.getMonth()==0) && (iWFirst>1)){
				strTem += '		<td class="wk">' + ((iRow==0)?iWFirst:iRow) + '</td>';
			}else{
				strTem += '		<td class="wk">' + (iWFirst+iRow) + '</td>';
			}
			
			for (var i=0; i<7; i++){
				var intTem = (iRow*7 + i - t.getDay() + 1);
				if ((intTem<1) || (intTem>t.getMonthDays())){
					strTem += '		<td></td>';
				}else{
					if ((oDiv.year==oDiv._year) && (oDiv.month==oDiv._month) && (oDiv.day==intTem)){
						strTem += '		<td onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setDay(' + intTem + ')" class="DateTime_SelDay">' + intTem + '</td>';
					}else{
						strTem += '		<td onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setDay(' + intTem + ')" onmouseover="this.style.backgroundColor=\'#BBBBBB\'" onmouseout="this.style.backgroundColor=\'\'">' + intTem + '</td>';
					}
				}
			}
			strTem += '	</tr>';
		}
		strTem += '</table>';
		oTable.rows[1].cells[0].innerHTML = strTem;
	}
	oTable.showSelYear = function (){
		var temObj;
		var objs = oDiv.getElementsByTagName('label');
		for (var i=0; i<objs.length; i++){
			if (objs[i].id=='year'){
				temObj=objs[i];break;
			}
		}
		if (/msie/i.test(navigator.userAgent)){
			if (oDiv.isFloat){
				oSelYear.style.left = temObj.offsetLeft;
				oSelYear.style.top = temObj.offsetTop + temObj.offsetHeight+1;
			}else{
				oSelYear.style.left = jsfw.getAbsoluteLeft(temObj);
				oSelYear.style.top = jsfw.getAbsoluteTop(temObj) + temObj.offsetHeight+1;
			}
		}else{
			oSelYear.style.left = jsfw.getAbsoluteLeft(temObj) + jsfw.getAbsoluteLeft(oTable);
			oSelYear.style.top = jsfw.getAbsoluteTop(temObj) + jsfw.getAbsoluteTop(oTable) + temObj.offsetHeight;
		}
		var intTem=oDiv.getYear();
		var strTem='';
		for (var i=1; i<7; i++){
			strTem +='<div onclick="this.parentNode.parentNode.setYear(' + (intTem-i) + '); this.parentNode.style.display=\'none\';" onmouseover="this.className=\'Sel\'" onmouseout="this.className=\'\'">' + (intTem-i) + '</div>';
			strTem +='<div onclick="this.parentNode.parentNode.setYear(' + (intTem+i) + '); this.parentNode.style.display=\'none\';" onmouseover="this.className=\'Sel\'" onmouseout="this.className=\'\'">' + (intTem+i) + '</div>';
		}
		oSelYear.innerHTML = strTem;
		oSelYear.style.display = '';
		clearTimeout(timYear);
		timYear = setTimeout(function(){oSelYear.style.display='none';},1000);
	}

	oTable.showSelMonth = function (){
		var temObj;
		var objs = oDiv.getElementsByTagName('label');
		for (var i=0; i<objs.length; i++){
			if (objs[i].id=='month'){
				temObj=objs[i];break;
			}
		}
		if (/msie/i.test(navigator.userAgent)){
			if (oDiv.isFloat){
				oSelMonth.style.left = temObj.offsetLeft;
				oSelMonth.style.top = temObj.offsetTop + temObj.offsetHeight+1;
			}else{
				oSelMonth.style.left = jsfw.getAbsoluteLeft(temObj);
				oSelMonth.style.top = jsfw.getAbsoluteTop(temObj) + temObj.offsetHeight+1;
			}
		}else{
			oSelMonth.style.left = jsfw.getAbsoluteLeft(temObj) + jsfw.getAbsoluteLeft(oTable);
			oSelMonth.style.top = jsfw.getAbsoluteTop(temObj) + jsfw.getAbsoluteTop(oTable) + temObj.offsetHeight;
		}
		var intTem=oDiv.getMonth();
		var strTem='';
		for (var i=1; i<7; i++){
			strTem +='<div onclick="this.parentNode.parentNode.setMonth(' + (i) + '); this.parentNode.style.display=\'none\';" onmouseover="this.className=\'Sel\'" onmouseout="this.className=\'\'">' + ((i==intTem)?'<b>'+i+'</b>':i) + '</div>';
			strTem +='<div onclick="this.parentNode.parentNode.setMonth(' + (i+6) + '); this.parentNode.style.display=\'none\';" onmouseover="this.className=\'Sel\'" onmouseout="this.className=\'\'">' + (((i+6)==intTem)?'<b>'+(i+6)+'</b>':(i+6)) + '</div>';
		}
		oSelMonth.innerHTML = strTem;
		oSelMonth.style.display = '';
		clearTimeout(timMonth);
		timMonth = setTimeout(function(){oSelMonth.style.display='none';},1000);
	}
	
	//年度
	oDiv.getYear = function (){
		return oDiv._year;
	}
	oDiv.setYear = function (value){
		oDiv._year = value;
		var objs = oDiv.getElementsByTagName('label');
		for (var i=0; i<objs.length; i++){
			if (objs[i].id=='year'){
				objs[i].innerHTML = value.toString();
				break;
			}
		}
		oDiv.showDays();
	}
	//获取月份
	oDiv.getMonth = function (){
		return oDiv._month;
	}
	oDiv.setMonth = function (value){
		oDiv._month = value;
		var objs = oDiv.getElementsByTagName('label');
		for (var i=0; i<objs.length; i++){
			if (objs[i].id=='month'){
				objs[i].innerHTML = value.toString();
				break;
			}
		}
		oDiv.showDays();
	}
	//获取天
	oDiv.getDay = function (){
		return oDiv._day;
	}
	oDiv.setDay = function (value){
		oDiv._day = value;
		oDiv.year = oDiv._year;
		oDiv.month = oDiv._month;
		oDiv.day = oDiv._day;
		oDiv.showDays();
		oDiv.showCurDate();
		var sFormat=oDiv.getAttribute('Format');
		if ((!sFormat) || (sFormat=='')) sFormat='yyyy-MM-DD';
		oDiv.Date = (new Date(oDiv.year+'/'+oDiv.month+'/'+oDiv.day)).format(sFormat);
		var sScript=oDiv.getAttribute('onSelectDate');
		if (sScript && (sScript!='')){
			eval(sScript);
		}
	}
	oDiv.showCurDate = function (){
		var strTem='';
		strTem += oDiv.year + '年';
		strTem += oDiv.month + '月';
		strTem += oDiv.day + '日 ';
		strTem += ["星期日", "星期一", "星期二","星期三","星期四", "星期五","星期六"][(new Date(oDiv.year+'/'+oDiv.month+'/'+oDiv.day)).getDay()];
		strTem = '<span style="cursor:hand" onclick="var obj=this.parentNode.parentNode.parentNode.parentNode.parentNode; obj.setYear(obj.year); obj.setMonth(obj.month); obj._day=obj.day; obj.showDays();">' + strTem + '</span>';
		oTable.rows[2].cells[0].innerHTML = strTem;
	}

	strTem = '';
	oDiv.appendChild(oSelYear);
	oDiv.appendChild(oSelMonth);
	oDiv.appendChild(oTable);
	oDiv.showDays();
	oDiv.showCurDate();

	//清除内存
	if (window.attachEvent) window.attachEvent('onunload', function (){
		oDiv.year = null;
		oDiv.month = null;
		oDiv.day = null;
		oDiv._year = null;
		oDiv._month = null;
		oDiv._day = null;
		oSelYear.onmouseout = null;
		oSelYear.onmouseover = null;
		oSelMonth.onmouseout = null;
		oSelMonth.onmouseover = null;
		oTable.showSelYear = null;
		oTable.showSelMonth = null;
		oDiv.showDays = null;
		oDiv.getYear = null;
		oDiv.setYear = null;
		oDiv.getMonth = null;
		oDiv.setMonth = null;
		oDiv.getDay = null;
		oDiv.setDay = null;
		oDiv.showCurDate = null;
		/*oDiv.onblur = null;
		oDiv.onfocus = null;
		oDiv.onclick = null;
		oDivColor.innerHTML='';
		oDivColor.onmouseout = null;
		oDivColor.onmouseover = null;
		oDivColor.selColor = null;*/
	});
};

jsfw.WebUI.DateTime.TagName = 'div';

//引用样式文件
(
	function (){
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = jsfw.Path + 'Themes/' + jsfw.Theme + '/DateTime/css.css';
		link.type = 'text/css';
		link.media = 'all';
		head.appendChild(link);
	}
)();