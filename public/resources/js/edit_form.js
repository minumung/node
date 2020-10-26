var oEditors = [];
nhn.husky.EZCreator.createInIFrame({
	oAppRef: oEditors,
	elPlaceHolder: "ir1",
	sSkinURI: "/se2/SmartEditor2Skin",	
	htParams : {
		bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
		bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
		bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
		fOnBeforeUnload : function(){
		}
	}, //boolean
	fOnAppLoad : function(){
		$("iframe").css("height","600px");
	//oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
	},
	fCreator: "createSEditor2"
});
//사진 팝업 이후 콜백함수
function pasteHTML(fname) {
	//setTimeout 안주고 바로 사진을 띄우려고하면 사진 업로드가 완료되지 않은 상태에서 img태그를 실행할수 있다. 익스에서 그런현상발생
	setTimeout(function(){
		var sHTML = "<img src='"+fname+"' style=\"max-width:100%; height:auto;\" id='"+fname+"'><br>";
		oEditors.getById["ir1"].exec("PASTE_HTML", [sHTML]);
	},3000)
}
function submitContents(callbackClassNm, textareaNm) {
	oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.
	var ir1 = document.getElementById("ir1");
	ir1.value = ir1.value.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;");	
	try {
		setTimeout(function(){
			$(".submit-btn").trigger("click");
		},400)
	} catch(e) {}
}
