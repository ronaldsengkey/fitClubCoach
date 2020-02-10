$(document).on('click','#newProgress',(function(e){	
	$('#bodyProgress').modal('show');
}))

$(document).on('click','.classSchedule',(function(e){
	var idClass = $(this).data('id');	
	window.location.href="scheduleDetail.html?id=" + idClass;
}))

$(document).on('change','#classSwitchDate',(function(e){
	let switchClass = '<div class="row">'+
	'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
		'<div class="clearfix"></div><br>'+
		'<label><i class="fa fa-calendar"></i>&nbsp;Class</label>'+
		'<select id="classChoose" class="form-control"><option selected></option><option>Isi class</option></select>';
		'</div>'+
	'</div>';
	$('.classContain').append(switchClass);
}));

$(document).on('change','#classChoose',(function(e){
	let switchClass = '<div class="row">'+
	'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
		'<div class="clearfix"></div><br>'+
		'<label><i class="fa fa-calendar"></i>&nbsp;Coach</label>'+
		'<select id="coachChoose" class="form-control"><option selected></option><option>Isi coach</option></select>';
		'</div>'+
	'</div>';
	$('.coachContain').append(switchClass);
}));

$(document).on('change','#coachChoose',(function(e){
	let btnChoose = '<button class="btn btn-block btn-success btn-indigo waves-effect waves-light">Switch</button>';
	$('.btnSwitch').append(btnChoose);
}));


$(document).on('submit','#imgProfile',(function(e) {
	e.preventDefault();
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
	if (regex.test($('#profilePicture').val().toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			$.ajax({
				url: urlService+'/update/user',
				type: "POST",
				data:  new FormData(this),
				mimeType:"multipart/form-data",
				contentType: false,
				cache: false,
				processData:false,
				success: function(callback)
				{
					var json = JSON.parse(callback);
					notification(json.response,"Update success");
					if($('#name').val() != '' && $('#gender').val() != ''
						&& $('#phone').val() != '' && $('#address').val() != ''){
							$('#updateProfile').remove();
							$('#skipNav').find('span').html("Let's Go");
					}
					var userId = localStorage.getItem("userId");
					var param = {'token':12345678,'filter':'getProfile','dataId':userId};
					postData('read','user',param);
				},complete: function() {
					
				}
			 });
		} else {
			alert("File can't readed.");
		}
	} else {
		notification(200,"Update success");
		// alert("Please upload a valid image file.");
	}
}));


$(document).on('click','.clickable',function(){
	target = $(this).data('target');
	uri = $(this).data('uri');
	dom = $(this).data('dom');
	if(dom  !== undefined && uri === undefined && target !== undefined){
		getPage(dom,target,'');
	}
	if(dom === undefined && uri === undefined && target !== undefined){
		getPage("",target,'');
	}
	if(uri !== undefined && target !== undefined){
	}
});

$(document).on('click','#getImge',function(){
	$('#profilePicture').click();
});
$(document).on('change','#profilePicture',function(){
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
	if (regex.test($(this).val().toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();
			reader.onload = function (e) {
				$("#dvPreview").attr("src", e.target.result).css({'width':'90px','height':'90px'});
			}
			reader.readAsDataURL($(this)[0].files[0]);
		} else {
			alert("File can't readed.");
		}
	} else {
		alert("Please upload a valid image file.");
	}
})

$(document).on('click','button, a',function(){
	target = $(this).data('target');
	uri = $(this).data('uri');
	dom = $(this).data('dom');
	filter = $(this).data('filter');
	switch (target) {
		case "trainerRegistration":
			getPage("", target, "");
			break;
	}
	if(dom  !== undefined && uri === undefined && target !== undefined){
		getPage(dom,target,'');
	}
	if(dom === undefined && uri === undefined && target !== undefined){
		getPage("",target,'');
	}
	if(uri !== undefined && target !== undefined){
		if(uri == 'create'){
			if(filter == 'trainerRegister' && target == 'user'){
				data = {'filter':'coach','name':$('#name').val(),'address':$('#address').val(),'phone':$('#phone').val(),'gender':parseInt($('select#gender').val()),'email':$('#email').val(),'password':$('#password').val(),
				'specialization':$('select#classTrain').val(),'placeId':$('select#placeId').val()};
			} else if(filter == 'coachSchedule'){
				let profileData = JSON.parse(localStorage.getItem("dataProfile"));
				data = {"token":profileData.accessToken,"classId":parseInt($('select#classOptionList').val()),"startDate":$('#classDate').val(),"endDate":$('#classDate').val(),"startTime":$('#startTime').val(),"endTime":$('#endTime').val()}
				console.log('data schedule',data);
				// window.location.href="home.html";
			}
			console.log("check data =>", JSON.stringify(data));
			postData(uri,target,data);
		}else if(uri == 'read'){
			if(filter == 'confirmCode' && target == 'user'){
				data = {'token':12345678,'filter':filter,'verificationCode':$('#verificationCode').val(),'dataId':$(this).data('id')}
			}else if(filter == 'login'){
				data = {'email':$('#email').val(),'password':$('#password').val()}
				// window.location.href="home.html";
			} else if(filter == 'index'){
				logout();
			}
			// console.log("check data =>", JSON.stringify(data));
			postData(uri,target,data);
		}else if(uri == 'update'){
			if(filter == 'resendCode' && target == 'user'){
				data = {'token':12345678,'filter':filter,'dataId':$(this).data('id')}
			} else if(filter == 'profileUser' && target == 'user'){
				data = {'token':12345678,'filter':filter,'dataId':$(this).data('id'),'name':$('#name').val(),
				'gender':$('#gender').val(),'phone':$('#phone').val(),'address':$('#address').val()}
			}
			console.log("check data =>", JSON.stringify(data));
			postData(uri,target,data);
		} else if(uri == 'view'){
			
		}
		
	}
});


function parseUserData(){
	let dataProfile = JSON.parse(localStorage.getItem("dataProfile"));
	return dataProfile;
}

$(document).on('keyup','.search', function(){
	var filter = $(this).val(), count = 0;
	
	var idTarget = '#'+$(this).data('target');
	var path = $(idTarget).closest('.wrapcontentList');
	
	$(idTarget+' li').each(function(){

		if ($(this).text().search(new RegExp(filter, "i")) < 0) {
			$(this).fadeOut();

		} else {
			$(this).show();
			count++;
		}
	});

	var numberItems = count;
	var hasil = "<b class='filterResult font-bold col-pink'>Matching records found = "+numberItems+"</b>";
	$('.filterResult').remove();
	$(hasil).insertAfter(path);
});

$(document).on('click', '#submitOtp', function(){
	let otpCode = $('#otpCode').val();
	let email = $('#email').val();
	let phone = $('#phone').val();
	let dd = {otpCode:otpCode, phone:phone, email:email};
	$.ajax({
		url: urlService+'/otp',
		  crossDomain: true,
		  method: "PUT",
		  headers: {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:8888",
			  "Accept-Encoding": "gzip, deflate",
			  "Connection": "keep-alive",
	  },
		data: JSON.stringify(dd),
		success: function(callback){
			let text = "";
			switch(callback){
				case 500:
					text = "Oops internal server error, please try again!"
					break;
				default:
					text = "Confirmation Success, Please login"
					break;
			}
			notification(callback,text)
			setTimeout(function () {
				if($(".sweet-alert").length > 0){
					swal.close();
					getPage("","index","");
				}
			}, 950);
		}
	})
});