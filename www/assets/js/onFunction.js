$(document).on('click','#newProgress',(function(e){	
	$('#bodyProgress').modal('show');
}))

$(document).on('click','.classSchedule',(function(e){
	var oldScheduleId = $(this).data('schedule');
	var thisClassId = $(this).data('id');
	var oldCoachId = $(this).data('coach');
	var statusClass = $(this).data('status');
	window.location.href="scheduleDetail.html?oldSchedId=" + oldScheduleId + '&coachId=' + oldCoachId + '&classId=' + thisClassId + '&status=' + statusClass;
}))

$(document).on('click','.toSwitch',function(){
	let searchParams = new URLSearchParams(window.location.search);
	let classToSwitchId = searchParams.get('classId');
	let coachOldSwitchId = searchParams.get('coachId');
	let schedOldSwitchId = searchParams.get('oldSchedId');

	window.location.href="switchSchedule.html?oldSchedId=" + schedOldSwitchId + '&coachId=' + coachOldSwitchId + '&classId=' + classToSwitchId;
})

$(document).on('change','#classSwitchDate',(function(e){
	console.log('ww',$(this).val());
	var date = $(this).val();
	getData('coachScheduleDate',date);
	let switchClass = '<div class="row classSwitchOption">'+
	'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
		'<div class="clearfix"></div><br>'+
		'<label><i class="fa fa-calendar"></i>&nbsp;Class</label>'+
		'<select id="classChoose" class="form-control"><option selected></option></select>';
		'</div>'+
	'</div>';
	if($('.classSwitchOption').length > 0){
		$('.classSwitchOption').remove();
	}
	$('.classContain').append(switchClass);
}));

$(document).on('change','#classChoose',(function(){
	// console.log('choose class val',$(this).val());
	console.log('cak',$(this).find(':selected').attr('data-schedId'));
	let newSchedId = $(this).find(':selected').attr('data-schedId');
	let newCoachId = $(this).find(':selected').attr('data-coachId');
	$('#newSchedId').val(newSchedId);
	$('#newCoachId').val(newCoachId);
	let switchClass = '<div class="row">'+
	'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
		'<div class="clearfix"></div><br>'+
		'<label><i class="fa fa-calendar"></i>&nbsp;Coach</label>'+
		'<input type="text" class="form-control" disabled value="'+$(this).val()+'"'+
		'</div>'+
	'</div>';
	$('.coachContain').append(switchClass);

	let btnChoose = '<button class="btn btn-block btn-success btn-indigo waves-effect waves-light switchSchedule">Switch</button>';
	$('.btnSwitch').append(btnChoose);
}));

$(document).on('click','.switchSchedule',function(){
	let profile = JSON.parse(localStorage.getItem('dataProfile'));
	let directoryPass = urlService;
	directoryPass += '/coach/switchClass/' + profile.accessToken;
	let dataSwitch = {
		"idSelfSchedule" : parseInt($('#schedId').val()),
		"selfId" : parseInt($('#oldCoachId').val()),
		"targetSchedule" : parseInt($('#newSchedId').val()),
		"targetCoach" : parseInt($('#newCoachId').val())
	};
	console.log('halos',dataSwitch);
	console.log('pass',directoryPass);
	$.ajax({
		url: directoryPass,
		crossDomain: true,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Accept": "*/*",
			"Cache-Control": "no-cache",
			"Accept-Encoding": "gzip, deflate",
			"Connection": "keep-alive",
		},
		data : JSON.stringify(dataSwitch),
		timeout: 8000,
		success: function (callback) {
			console.log('kembalian switch',callback);
			switch (callback.responseCode) {
				case "401":
					logout();
					break;
				case "404":
					notification(404,'data not found');
					break;
				case "200":
					notification(200,'process success, thank you');
					setTimeout(() => {
						window.location.href = 'schedule.html';
					}, 500);
					break;
			}
		}
	})
})

$(document).on('click','.accRequest',function(){
	let profile = JSON.parse(localStorage.getItem('dataProfile'));
	let directoryPass = urlService;
	directoryPass += '/coach/switchClassResponse/' + profile.accessToken;
	let accData = {
		"switchId": parseInt($(this).attr('data-switch')),
		"action" : "yes"
	};
	console.log('acc data',accData);
	console.log('pass dir',directoryPass);
	$.ajax({
		url: directoryPass,
		crossDomain: true,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Accept": "*/*",
			"Cache-Control": "no-cache",
			"Accept-Encoding": "gzip, deflate",
			"Connection": "keep-alive",
		},
		data : JSON.stringify(accData),
		timeout: 30000,
		success: function (callback) {
			console.log('kembalian switch',callback);
			switch (callback.responseCode) {
				case "401":
					logout();
					break;
				case "404":
					notification(404,'data not found');
					break;
				case "200":
					notification(200,'switch request has been accepted');
					setTimeout(() => {
						window.location.href = 'schedule.html';
					}, 500);
					break;
				default:
					notification(500,'internal server error');
					break;
			}
		}
	})
})

$(document).on('click','.rejectRequest',function(){
	let profile = JSON.parse(localStorage.getItem('dataProfile'));
	let directoryPass = urlService;
	directoryPass += '/coach/switchClassResponse/' + profile.accessToken;
	let rejectData = {
		"switchId": parseInt($(this).attr('data-switch')),
		"action":"no"
	};
	console.log('reject data',rejectData);
	console.log('pass dir reject',directoryPass);
	$.ajax({
		url: directoryPass,
		crossDomain: true,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Accept": "*/*",
			"Cache-Control": "no-cache",
			"Accept-Encoding": "gzip, deflate",
			"Connection": "keep-alive",
		},
		data : JSON.stringify(rejectData),
		timeout: 30000,
		success: function (callback) {
			console.log('kembalian switch',callback);
			switch (callback.responseCode) {
				case "401":
					logout();
					break;
				case "404":
					notification(404,'data not found');
					break;
				case "200":
					notification(200,'switch request has been declined');
					setTimeout(() => {
						window.location.href = 'schedule.html';
					}, 500);
					break;
				default:
					notification(500,'internal server error');
					break;
			}
		}
	})
})


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

$(document).on('click','#classSwitch',function(){
	console.log('switch yok',$(this).is(':checked'));
	let profile = JSON.parse(localStorage.getItem('dataProfile'));
	let directoryPassSwitch = urlService;
	directoryPassSwitch += '/coach/actionClass/' + profile.accessToken;
	var checkedSwitch = $(this).is(':checked');
	let searchParamsSwitch = new URLSearchParams(window.location.search);
	let classIdSwitch = searchParamsSwitch.get('oldSchedId');
	var dataToSwitch = '';
	if(checkedSwitch){
		dataToSwitch = {
			"scheduleId" : parseInt(classIdSwitch),
			"action" : "started"
		};
	} else {
		dataToSwitch = {
			"scheduleId" : parseInt(classIdSwitch),
			"action" : "finished"
		};
	}
	$.ajax({
		url: directoryPassSwitch,
		crossDomain: true,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Accept": "*/*",
			"Cache-Control": "no-cache",
			"Accept-Encoding": "gzip, deflate",
			"Connection": "keep-alive",
		},
		data : JSON.stringify(dataToSwitch),
		timeout: 8000,
		success: function (callback) {
			console.log('kembalian turn on off class',callback);
			switch (callback.responseCode) {
				case "401":
					logout();
					break;
				case "200":
					if(checkedSwitch){
						notification(200,'Class has been activated, thank you');
					} else {
						notification(200,'Class has been deactivated, thank you');
					}
					setTimeout(() => {
						window.location.href = 'schedule.html';
					}, 1000);
					break;
				default:
					notification(500,'server error');
					break;
			}
		}
	})
})

// $(document).on('click','.scanMember',function(){
// 	window.QRScanner.scan(displayContents);

// 	function displayContents(err, text){
// 	if(err){
// 		// an error occurred, or the scan was canceled (error code `6`)
// 	} else {
// 		// The scan completed, display the contents of the QR code:
// 		alert(text);
// 	}
// 	}

// 	// Make the webview transparent so the video preview is visible behind it.
// 	window.QRScanner.show();
// })

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
	var userDataOnFunction = parseUserData();
	if(uri !== undefined && target !== undefined){
		if(uri == 'create'){
			if(filter == 'trainerRegister' && target == 'user'){
				data = {'filter':'coach','name':$('#name').val(),'address':$('#address').val(),'phone':$('#phone').val(),'gender':parseInt($('select#gender').val()),'email':$('#email').val(),'password':$('#password').val(),
				'specialization':$('select#classTrain').val(),'placeId':$('select#placeId').val()};
			} else if(filter == 'coachSchedule'){
				data = {"coachId":userDataOnFunction.coachId,"classId":parseInt($('select#classOptionList').val()),"placeId":parseInt($('select#placeOption').val()),"startDate":$('#classDate').val(),"endDate":$('#classDate').val(),"startTime":$('#startTime').val(),"endTime":$('#endTime').val(),"maxPerson":parseInt($('#maxPerson').val())}
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
			if(filter == 'profile' && target == 'profile'){
				window.location.href='profile.html';
			}	
		}
		
	}
});

$(document).on('click','.openOTP',async function(){
	let content = '<input type="text" class="form-control" id="otpCode">' +
		"<b><small style='color:#fff;'>Your verification code has been send in your email address, Please check your email, and verify your account</small></b>"
	callModal(content);
})


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