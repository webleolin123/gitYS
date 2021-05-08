/*******************************************\
  Date 的扩展方法(2006-8-8)
\*******************************************/
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

Date._MD = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
Date.SECOND = 1000 /* milliseconds */;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR   = 60 * Date.MINUTE;
Date.DAY    = 24 * Date.HOUR;
Date.WEEK   =  7 * Date.DAY;

//获取月份的总天数
Date.prototype.getMonthDays = function(month) {
	var year = this.getFullYear();
	month = (typeof(month)== "undefined")?this.getMonth():month;
	if (((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) && month == 1) {
		return 29;
	} else {
		return Date._MD[month];
	}
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

//字串转日期型
Date.fromString = function (sDate){
	var strTem=sDate.replace(/-/g,'/');
	strTem=strTem.replace(/年/g,'/');
	strTem=strTem.replace(/月/g,'/');
	strTem=strTem.replace(/日/g,'/');
	return new Date(strTem);
}

