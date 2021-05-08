/****************************************************************************************************

ȫ�ֱ���

httpaddr    ӡ�·�������ַ����һ������Ϊӡ�·�������ip+�˿�+·����һ��ֻ��Ҫ�޸�ip+�˿ڼ��ɡ�

*****************************************************************************************************/

/*function OpenModel(){

var AipObj = document.getElementById("HWPostil1").LoadFile("");
}
function HcData(){
      var urlstr = 'policyNo=20120505##ownerName=�Ϲٷ��##ownerSex=��##ownerBirthYear=1999##ownerBirthMonth=08##ownerBirthDay=08##ownerAge=101##ownerIdTC=�⼮����##ownerId=130111199908080000XX##ownerNation=�й�##ownerAddress=�����к�����������120�ŷ��ٴ���2011##ownerZip=10000##ownerComAddress=�����к�����������120�ŷ��ٴ���2011##ownerComZip=10088##ownerHomePhone=8601089897896##ownerUnitPhone=8601089897896##ownerTelPhone=8613023456789##ownerBackPhone=�ֻ�����##ownerService=�������ٲ�ʢ�ɷ����޹�˾##ownerServiceAdd=�����к�����������120�ŷ��ٴ���2011##ownerWorkContent=��˾����##ownerWork=�����ܼ�##ownerWorkCode=CEO##beneSeq=02##beneName=�Ϲٷ���##beneSex=��##beneBirth=1999��08��08��##beneRelation=����##beneSharePercent=100%##beneIdTC=�⼮����##beneId=130111199908080101##&beneSeq=02##&beneName=�Ϲٲ�ʢ##&beneSex=��##&beneBirth=1999��08��09��##&beneRelation=�ֵ�##&beneSharePercent=90%##&beneIdTC=�⼮����##&beneId=130111199908080101##&beneSeq1=02##&beneName1=�Ϲٲ�ʢ##&beneSex1=��##&beneBirth1=1999��08��09��##&beneRelation1=�ֵ�##&beneSharePercent1=90%##&beneIdTC1=�⼮����##&beneId1=130111199908080101##coverageName=���ռƻ�һ##coveragePaymentTerm=100##coverageBenefitTerm=100##coverageCurrentAmt=100,000,000##coverageName1=���ռƻ���##coveragePaymentTerm1=100##coverageBenefitTerm1=100##coverageCurrentAmt1=100,000,000##paymentMethod=һ���Խ���##grossPremAmtITD=2,000,00Ԫ##coverageName2=���ռƻ�3##coveragePaymentTerm2=100##coverageBenefitTerm2=100##coverageCurrentAmt2=100,000,000##&coverageName2=���ռƻ�4##&coveragePaymentTerm2=100##&coverageBenefitTerm2=100##&coverageCurrentAmt2=100,000,000##&coverageName3=���ռƻ�5##&coveragePaymentTerm3=100##&coverageBenefitTerm3=100##&coverageCurrentAmt3=100,000,000##settleMethod=ֱ����ȡ##divType=ֱ����ȡ##couponType=ֱ����ȡ##prophase=POS�����ɱ��շ�##renewal=�����Զ�ת��##bankName=�й���������##bankAccount=6225889987898789##notify1=A##notify3=A##notify4A=A##notify4B=A##notify5=A##notify6=A##notify7=A##notify8=A##notify9=A##notify10=A##notify11=A##notify12=A##notify13=A##income=1000##incomeSource=���ز����ɵȡ�##isDebt=��##debtSum=10000##debtContent=���������ز��ȵȵ�##height=100##weight=100##otherInsureComp1=���չ�˾1##otherInsureComp2=���չ�˾2##lifeAssuredSum1=XXXX##lifeAssuredSum2=XXXX##pAAssuredSum1=XXXX##pAAssuredSum2=XXXX##hospAssuredSum1=XXXX##hospAssuredSum2=XXXX##smokingYears=100##smokingFreNum=200##wineyear=100##wineamount=10000##winekind=ĳ��ĳĳĳĳ��##cyesis=2##detailNo=001##describe=��ϸ������������ϸ��������������ϸ��������������##detailNo1=002##describe1=��ϸ������������ϸ��������������ϸ��������������1##detailNo2=003##describe2=��ϸ������������ϸ��������������ϸ��������������3##liabilitiesinfo=�ǣ� ��ծ��100��Ԫ�� ��ծԭ�򣺴�����Ӫ�ȡ�##getTypes=��ͬ����/���շ�����δ����ʽ�� ������ȡ��ʽ��ֱ����ȡ     ���/�������ȡ��ʽ��ֱ����ȡ   ���շ�����δ�����Զ��潻##insurer1=��������##insurer2=��������##insurercount1=100000##insurercount2=100000##crashcount1=100000##crashcount2=100000##hospcount1=100000##hospcount2=100000';
			urlstr = urlstr.replace(/\##/g,"\r\n");
			urlstr = urlstr.replace(/\amp;/g,"");
			document.all.HWPostil1.SetValue("FORM_DATA_TXT_FORMAT", "STRDATA:"+urlstr);
			//document.all.HWPostil1.SetValue("LABEL_ALLNOTES_STATUS", "3");//���ñ༭�����ɱ༭
			//document.all.HWPostil1.SetValue("FORM_DATA_TXT_FORMAT", "STRDATA:"+"P1=�ƻ�1�ƻ�1\r\nT1=1��\r\nM1=100,000$\r\n&P1=�ƻ�2\r\n&T1=1��\r\n&M1=100,000$");
}
var httpaddr="http://127.0.0.1:8089/inc/seal_interface/";*/

/****************************************************************************************************

��������OpenFile					���ĵ�
��  ����url							�����Ƿ�����http·����http://127.0.0.1/test.pdf
									Ҳ�����Ǳ����ļ�·����c://test.pdf
									Ҳ�������ļ�����http://127.0.0.1/GetFile.aspx

*****************************************************************************************************/
function OpenFile(url) {
	var AipObj = document.getElementById("HWPostil1");
	var IsOpen = AipObj.LoadFile(url);
	if (IsOpen != 1) {
		alert("���ĵ�ʧ�ܣ�");
	}
}
/****************************************************************************************************

��������AddSeal						�ֶ����»���д
��  ����usertype					�û����ͣ�0 �����û���1 ����key�û���2 ������key�û���3 �����������û�
		doaction					�������ͣ�0 ���£�1 ��д��
		other						Ԥ��������
											��usertypeΪ1,2ʱ��ֵΪ�û���ʵ����������Ϊ�ջ���ȡ֤���û�����
											��usertypeΪ3ʱ��ֵΪ�������ݡ�

˵����httpaddr��

*****************************************************************************************************/
function AddSeal(usertype,doaction,other) {
	var AipObj = document.getElementById("HWPostil1");
	if(doaction=='0'){//����
	  	var islogin=AipObj.Login("",1,32767,"","");//key�û���¼
	    if (islogin != 0) {
		    alert("��¼ʧ�ܣ�����ֵ�ǣ�" + islogin);
	    } else {
		   AipObj.CurrAction = 2568;
	    }
	}else if(doaction=='1'){//��д
	    AipObj.CurrAction = 264;
	}else if(doaction=='2'){//��������д	
	   // alert("aa");
	    AipObj.Login("HWSEALDEMO", 4, 65535, "DEMO", ""); 
		  AipObj.ShowFullScreen=1;
		  var id="signatureArea";//��д����ID
		  AipObj.SetValue("SET_POPWND_MAX_WIDTH","260");//���õ�������д��С
		  //AipObj.SetValue("SET_POPWND_MAX_HEIGHT","700");//���õ�������д��С
			AipObj.SetValue(id,":PROP::LABEL:1");//
			AipObj.SetValue(id,":PROP::CLICKPOP:1");
			AipObj.SetValue(id,":PROP:BACKCOLOR:-1");	
			AipObj.SetValue(id,":PROP:BORDER:0");
			AipObj.SetValue(id,":PROP:ACTIVATE:1");
	}else if(doaction=='3'){//��д
	    AipObj.Login("HWSEALDEMO", 4, 65535, "DEMO", ""); 
		  AipObj.ShowFullScreen=1;
		  var id="transcribeArea";//��д����ID
			AipObj.SetValue(id,":PROP::LABEL:3");
			AipObj.SetValue(id,":PROP:ACTIVATE:1");
		
	}else if(doaction=='4'){//�����д���򵯳���д��
	    AipObj.Login("HWSEALDEMO", 4, 65535, "DEMO", ""); 
		  AipObj.ShowFullScreen=1;
	}
}
/****************************************************************************************************

��������AutoSeal					�Զ�����
��  ����usertype					�û����ͣ�0 �����û���1 ����key�û���2 ������key�û���3 �����������û�
		doaction					�������ͣ�0 ��ͨӡ�£�1 ������£�2�Կ����
		searchtype					��λ����λ�����ͣ�ֻ����ͨӡ��doaction=0ʱ��Ч��0 �������꣬1 ���ֶ�λ
		searchstring				��λ��Ϣ��ֻ����ͨӡ��doaction=0ʱ��Ч
											searchtypeΪ0ʱ��searchstringΪx:y:page��ʽ����200:500:0   xΪ��������1-50000��yΪ��������1-50000��pageΪ����ҳ���0��ʼ
											searchtypeΪ1ʱ��searchstringΪҪ���ҵ������ַ���
		other						Ԥ��������
											��usertypeΪ1,2ʱ��ֵΪ�û���ʵ����������Ϊ�ջ���ȡ֤���û�����
											��usertypeΪ3ʱ��ֵΪ�������ݡ�

*****************************************************************************************************/
function AutoSeal(usertype,doaction,searchtype,searchstring,other){
	var AipObj = document.getElementById("HWPostil1");
	var islogin=AipObj.Login("",1,32767,"","");//key�û���¼
	if (islogin != 0) {
		alert("��¼ʧ�ܣ�����ֵ�ǣ�" + islogin);
	} else {
		if(doaction==0){
			var num=AipObj.PageCount;
			var str=searchstring.split(":");
			var page="";
			if(searchtype==0){
				AipObj.AddQifengSeal(0,0+","+str[0]+",0,"+str[1]+",50,"+str[2],"","AUTO_ADD_SEAL_FROM_PATH");
			}else if(searchtype==1){
				AipObj.AddQifengSeal(0,"AUTO_ADD:0,"+num+",0,0,1,"+searchstring+")|(0,","","AUTO_ADD_SEAL_FROM_PATH");
			}
		}else if(doaction==1){
			var num=AipObj.PageCount;
			var page="";
			for(i=1;i<num;i++){
				page+=i+",";
			}
			var bl=100/(num-1);
			AipObj.AddQifengSeal(0,0+",25000,1,3,"+bl+","+page,"","AUTO_ADD_SEAL_FROM_PATH");
		}else if(doaction==2){
			var num=AipObj.PageCount;
			for(i=0;i<num-1;i++){
				AipObj.AddQifengSeal(0,i+",25000,2,3,50,1","","AUTO_ADD_SEAL_FROM_PATH");
			}
		}
	}
}
/****************************************************************************************************

��������SaveTo								�����ĵ�
��  ����savetype							�ĵ����淽ʽ��0 ���汾�أ�1 ���浽������
		filepath							�ĵ�����·����
													savetypeΪ0ʱΪ����·��������Ϊ�գ�Ϊ�ջᵯ����ַ������c:/test/1.pdf
													savetypeΪ1ʱΪ������·��������http://127.0.0.1/getfile.php,��ַΪ�ļ����շ�������ַ�������ļ���FileBlod
		filecode							�ĵ�Ωһ��ʾ��
													savetypeΪ0ʱΪ�ĵ����ͣ�ֵ����Ϊdoc��pdf��aip��word��jpg��gif��bmp��
													savetypeΪ1ʱΪ�ĵ�Ψһ��ʾ���������������յĲ���FileCode

*****************************************************************************************************/
function SaveTo(savetype,filepath,filecode) {
	var AipObj = document.getElementById("HWPostil1");
	if(savetype==0){
		var issave = AipObj.SaveTo(filepath,filecode,0);
		if (issave == 0) {
			alert("����ʧ�ܣ�");
		}else{
		  alert("����ɹ���c:\\test.pdf");
		}
	}else{
		alert("SaveTo������������")
	}
}
/****************************************************************************************************

��������ShowFullScreen					ȫ���鿴
��  ����slog							1Ϊȫ����0Ϊ��ͨ

*****************************************************************************************************/
function ShowFullScreen(slog) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.ShowFullScreen = slog;
}
/****************************************************************************************************

��������FilePrint						��ӡ�ĵ�
��  ����plog							0���ٴ�ӡ��1�д�ӡ�Ի���

*****************************************************************************************************/
function FilePrint(plog) {
	var AipObj = document.getElementById("HWPostil1");
	var isprint = AipObj.PrintDoc(1, plog);
	if (isprint == 0) {
		alert("��ӡʧ�ܣ�");
	}
}
/****************************************************************************************************

��������FileMerge						�ϲ��ļ�
��  ����filepath						Ҫ�ϲ��ļ�·�������ֻΪ�������һ���հ�ҳ
		page							�ļ�Ҫ�����ҳ��,���뵽��һҳֵΪ0

*****************************************************************************************************/
function FileMerge(filepath,page) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.Login("HWSEALDEMO**",4,65535,"DEMO","");
	if(filepath==""){
		var isMerge = AipObj.InsertEmptyPage(page,0,0,0);
	}else{
		var isMerge = AipObj.MergeFile(page,filepath);
	}
	if (isMerge == 0) {
		alert("�ϲ��ĵ�ʧ�ܣ�");
	}
}
function merge2File(){
	var obj=document.getElementById("HWPostil1");
	if(!obj.IsLogin()){
		alert("���¼");
		return false;
	}
	if(!obj.IsOpened()){
		alert("�����һ��PDF�ļ�");
		return false;
	}
	obj.MergeFile(-1,"");
}
/****************************************************************************************************

��������SetPenwidth						������д�ʿ�
��  ������

*****************************************************************************************************/
function SetPenwidth() {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.CurrPenWidth=-1;
}
/****************************************************************************************************

��������SetColor						������д����ɫ
��  ������

*****************************************************************************************************/
function SetColor() {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.CurrPenColor=-1;
}
/****************************************************************************************************

��������SetPressurelevel				������дѹ��
��  ������

*****************************************************************************************************/
function SetPressurelevel() {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.Pressurelevel=-1;
}
/****************************************************************************************************

��������SetAction						�������״̬
��  ����SetLog							����״̬��1 �����2 ����ѡ��

*****************************************************************************************************/
function SetAction(SetLog) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.CurrAction=SetLog;
}
/****************************************************************************************************

��������SetPageMode						������ͼ
��  ����SetLog							���ò���״̬��1 ԭʼ��С��2 ��Ӧ��ȣ�3 ���ڴ�С��4 ˫ҳ��ʾ��5 �ޱ߿�

*****************************************************************************************************/
function SetPageMode(SetLog) {
	var AipObj = document.getElementById("HWPostil1");
	if(SetLog==1){
		AipObj.SetPageMode(1,100);
	}else if(SetLog==2){
		AipObj.SetPageMode(2,100);
	}else if(SetLog==3){
		AipObj.SetPageMode(4,100);
	}else if(SetLog==4){
		AipObj.SetPageMode(8,2);
	}else if(SetLog==5){
		AipObj.SetPageMode(16,1);
	}
}
/****************************************************************************************************

��������ShowToolBar						���ù�����
��  ����SetLog							����״̬��0 ���أ�1 ��ʾ

*****************************************************************************************************/
function ShowToolBar(SetLog) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.ShowToolBar=SetLog;
}
/****************************************************************************************************

��������ShowDefMenu						���ò˵�
��  ����SetLog							����״̬��0 ���أ�1 ��ʾ

*****************************************************************************************************/
function ShowDefMenu(SetLog) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.ShowDefMenu=SetLog;
}
/****************************************************************************************************

��������ShowScrollBarButton				���ù�����
��  ����SetLog							����״̬��2 ���ع�������1 ���ع������Ĺ�������0 ��ʾ������

*****************************************************************************************************/
function ShowScrollBarButton(SetLog) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.ShowScrollBarButton=SetLog;
}
/****************************************************************************************************

��������SetFullScreen					����ȫ��
��  ����SetLog							����״̬��1ȫ����0����

*****************************************************************************************************/
function SetFullScreen(SetLog) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.ShowFullScreen =SetLog;
}
/****************************************************************************************************

��������SearchText						��������
��  ����stxt							Ҫ���ҵ�����
		matchcase						�Ƿ����ִ�Сд
		findnext						����λ�á�0:��ͷ���Բ���;1:������һ��

*****************************************************************************************************/
function SearchText(stxt,matchcase,findnext) {
	var AipObj = document.getElementById("HWPostil1");
	AipObj.SearchText(stxt,matchcase,findnext);
}
/****************************************************************************************************

��������FileAddseal						ʹ���ļ�����
��  ����selpath							ӡ��·��
		doaction						�������ͣ�0 ��ͨӡ�£�1 ������£�2�Կ����
		searchtype						��λ����λ�����ͣ�ֻ����ͨӡ��doaction=0ʱ��Ч��0 �������꣬1 ���ֶ�λ
		searchstring					��λ��Ϣ��ֻ����ͨӡ��doaction=0ʱ��Ч
											searchstringΪx:y:page��ʽ����200:500:0   xΪ��������1-50000��yΪ��������1-50000��pageΪ����ҳ���0��ʼ

*****************************************************************************************************/
function FileAddseal(selpath,doaction,searchtype,searchstring) {
	var AipObj = document.getElementById("HWPostil1");
	var islogin=AipObj.Login("",1,65535,"","");
	if (islogin != 0) {
		alert("����ʧ�ܣ������ţ�" + islogin);
	} else {
		AipObj.ShowErrMsgMode=0;
		if(doaction==0){
			var num=AipObj.PageCount;
			var str=searchstring.split(":");
			var page="";
			if(searchtype==0){
				if(AipObj.AddQifengSeal(0,0+","+str[0]+",0,"+str[1]+",50,"+str[2],"","AUTO_ADD_SEAL_FROM_PATH")!=1){
					AipObj.AddQifengSeal(0,0+","+str[0]+",8,"+str[1]+",50,"+str[2]+","+selpath,"","AUTO_ADD_SEAL_FROM_PATH");
				}
			}else if(searchtype==1){
				if(AipObj.AddQifengSeal(0,"AUTO_ADD:0,"+num+",0,0,1,"+searchstring+")|(0,","","AUTO_ADD_SEAL_FROM_PATH")!=1){
					AipObj.AddQifengSeal(0,"AUTO_ADD:0,"+num+",0,0,1,"+searchstring+")|(8,"+selpath,"","AUTO_ADD_SEAL_FROM_PATH");
				}
			}
		}else if(doaction==1){
			var num=AipObj.PageCount;
			var page="";
			for(i=1;i<num;i++){
				page+=i+",";
			}
			var bl=100/(num-1);
			AipObj.AddQifengSeal(0,0+",25000,9,3,"+bl+","+page+","+selpath,"","AUTO_ADD_SEAL_FROM_PATH");
		}else if(doaction==2){
			var num=AipObj.PageCount;
			for(i=0;i<num-1;i++){
				AipObj.AddQifengSeal(0,i+",25000,10,3,50,1,"+selpath,"","AUTO_ADD_SEAL_FROM_PATH");
			}
		}
	}
}
function UploadPDF(){
	   var AipObj = document.getElementById("HWPostil1");
		 AipObj.HttpInit(); //��ʼ��HTTP���档
	   AipObj.HttpAddPostString("name","test.pdf"); //�����ϴ������ļ�����
	   AipObj.HttpAddPostCurrFile("FileContent");//�����ϴ���ǰ�ļ�,�ļ���ʶΪFileBlod��
     var ispost=AipObj.HttpPost("http://127.0.0.1:8080/Seal/doc/saveTo.jsp");//�ϴ����ݡ�
     if(ispost=="kkkkk"){
	     alert("�ϴ��ɹ�");
	   }else{
	     alert("�ϴ�ʧ��:"+ispost);
	  }
}
function Reset(){
    var AipObj = document.getElementById("HWPostil1");
    AipObj.ShowFullScreen=1;
    var id="signatureArea";//��д����ID
    AipObj.SetValue(id,'');//�������д����
		AipObj.SetValue(id,":PROP::LABEL:1");//����ѡ
		AipObj.SetValue(id,":PROP::CLICKPOP:1");
		AipObj.SetValue(id,":PROP:BORDER:0");
		AipObj.SetValue(id,":PROP:ACTIVATE:1");
}
function GetWrite(){
   var AipObj = document.getElementById("HWPostil1");
   var id="signatureArea";//��д����ID
   var writedata=AipObj.GetValueEx(id,44 ,"gif",0,"");
	 AipObj.setValueEx("signatureArea1",44,0,writedata);
}
function InsertNoteWrite(){
		  var AipObj=document.getElementById("HWPostil1");
		  AipObj.LoadFile("");//���Դ򿪱����ļ���Ҳ���Դ򿪷����http·��
		  var id="signatureArea";//��д����ID
		  var keywordOne = AipObj.FindText("�ͻ�ǩ��",0,0,0,0,2,50000,50000,1);
	   	var strArryOne = keywordOne.split(",");
		  var pageNum = strArryOne[0];
		  var xOne = new Number(strArryOne[1]);
	  	xOne = xOne+3000;
	  	var yOne = new Number(strArryOne[2]);
		  yOne = yOne-1700;
		  AipObj.Login("HWSEALDEMO", 4, 65535, "DEMO", ""); 
		  AipObj.InsertNote(id,pageNum,2,xOne,yOne,7000,3000);
		  AipObj.SetValue(id,':PROP:BORDER:0');
		  AipObj.SetValue(id,':PROP::CLICKPOP:1');	
		  AipObj.Logout();
		  setTimeout("write()",1000);//�ȴ�1��

		 
}
function write(){
     var AipObj=document.getElementById("HWPostil1");
     AipObj.Login("HWSEALDEMO", 4, 65535, "DEMO", ""); 
	   AipObj.ShowFullScreen = 1;
	   var id="signatureArea";//��д����ID
		 AipObj.SetValue(id,':PROP:ACTIVATE:1');
}
function settxt(){
    var AipObj=document.getElementById("HWPostil1");
	  AipObj.Login("sys_admin", 5, 32767, "", "");
		AipObj.CurrAction=1544;
}
function setsign(){
    var AipObj=document.getElementById("HWPostil1");
    AipObj.Login("sys_admin", 5, 32767, "", "");
	  AipObj.CurrAction=1288;
}
function InsertYwm(){
   var AipObj=document.getElementById("HWPostil1");
   AipObj.InsertPicture("id001","BARCODEDATA:12121212121",0,0,0,13172836);
}
function InsertPdf417(){
   var AipObj=document.getElementById("HWPostil1");
   AipObj.InsertPicture("id001","BARCODEDATA:12121212121",0,5000,5000,200);
}
function InsertQr(){
   var AipObj=document.getElementById("HWPostil1");
   AipObj.InsertPicture("id001","BARCODEDATA:12121212121",0,15000,5000,13107500);
}