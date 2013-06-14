
$(document).ready(function(){

	$("#btngo").click(function() {
			var surl = 'geturldetails?url='+$("#gurl").attr("value");
			
			//alert(surl);
						
			$.ajax({

				url: surl,
				data: "",
				type: 'GET',				
				success: function(data) { dispData(data) },
				error: function() { alert('Failed!'); }
			});

	});
//alert();
	$("#btngo1").click(function() {
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			success: success,
			dataType: dataType
		});
	});
	$("#submit_links").click(function() {
		location.href= "./new"
	});
});


function dispData(data){
	var shtml = "title: " + data.title + "<br>description: " + data.text; 
	//alert(shtml)
	
	
	//alert($("#title"));
	$("#title").val(data.title);
	$("#desc").val(data.text);
	$("#btngo").hide();
	//$("#gurl").attr("readOnly");
	$("#showDetails").show();
	return false
}