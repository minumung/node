function previewImgCreate(e) {
    var $input = $(this);
    var inputFile = this.files[0];
    
    var reader = new FileReader();
    reader.onload = function(event) {
    	$input.before("<img src="+event.target.result+" style='margin-bottom:20px;'>");
        ajaxUpload(inputFile, $input, function(data_url){
        	$input.next().val(data_url);
        })
    };
    reader.readAsDataURL(inputFile);
}
function previewImgUpdate(e) {
    var $input = $(this);
    var inputFile = this.files[0];
    
    var reader = new FileReader();
    reader.onload = function(event) {
    	console.log($input.prev())
    	$input.prev().attr("src", event.target.result);
        ajaxUpload(inputFile, $input, function(data_url){
        	$input.next().val(data_url);
        })
    };
    reader.readAsDataURL(inputFile);
}
var is_show = false;
$(document).on("click", ".showYnBtn", function(e){
	is_show = true;
	$(this).find("input").attr("checked",true);
	var table_name = $(this).attr("data-table-name");
	var table_seq_name = $(this).attr("data-table-seq");
	
	var seq = $(this).attr("data-seq");
	var value = $(this).attr("data-role");
	$.ajax({
		type:"GET",  
		url:"/supervise/common/show/"+table_name+"/"+table_seq_name+"/"+seq+"/"+value,
		success:function(args) {
			console.log(args)
			if(!args.success){
				alert("노출여부 데이터 수정작업에 실패하였습니다.");
			}
			is_show = false;
		},
		error: function(request, status, error){
			console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
})