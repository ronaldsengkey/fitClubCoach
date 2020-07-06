// var urlService = 'http://fitclubdev.zapto.org:8888/ronaldSengkey/fitClub/api/v1';
var urlService = 'http://192.168.0.13:8888/ronaldSengkey/fitClub/api/v1';
var fieldTextInput = '<input type="text" class="form-control fieldText">';
var fieldEmailInput = '<input type="email" class="form-control fieldEmail">';
var fieldPswdInput = '<input type="password" class="form-control fieldPswd">';
var fieldSelect = '<select class="form-control select2"></select>';
var target, uri, dom, data, userId, userName, userRole = '';
var backBtn = '<button type="button" id="backBtn" data-target="index" style="position:fixed;right:7%;bottom:5%;" class="btn bg-blue btn-circle-lg waves-effect waves-circle waves-float">' +
	'<i class="material-icons">keyboard_arrow_left</i>' +
	'</button>';
$(function () {
	if ($('#loginPage').length > 0) {
		validate('login');
	}
	if ($('#profilePage').length > 0) {
		validate('profile');
	}
	if ($('#registerPage').length > 0) {
		validate();
		select2Activated();
	}
	if($('#trainerRegistPage').length > 0){
		validate('trainerRegist');
		validate('getPlace');
	}
	if($('#addSchedulePage').length > 0){
		validate('addSchedule');
		validate('getPlace');
	}
	if($('#schedulePage').length > 0){
		validate('listSchedule');
		
	}
	if($('#scheduleDetailPage').length > 0){
		validate('scheduleDetail');
	}
	if($('#switchSchedulePage').length > 0){
		validate('switchSchedule');
	}
	if($('#homeCoachPage').length > 0){
		validate('classHistory');
		validate('ongoingClass');
		$('#tabs-swipe').tabs({
			swipeable : true
		});
	}
	if($('#switchRequestPage').length >0){
		validate('switchReqeuest');
	}
	var userData = parseUserData();
	console.log('user data',userData);
	setTimeout(function () {
		$('.page-loader-wrapper').fadeOut(400, "linear");
	}, 300);
});

// $(document).ready(function() {
//     document.addEventListener("deviceready", onDeviceReady, false);
// });

// function onDeviceReady() {      
// 	$('.scanMember').click( function() 
// 	{
// 	cordova.plugins.barcodeScanner.scan(
// 	function (result) {
// 		alert("We got a barcode\n" +
// 				"Result: " + result.text + "\n" +
// 				"Format: " + result.format + "\n" +
// 				"Cancelled: " + result.cancelled);            
// 	}, 
// 	function (error) {
// 		alert("Scanning failed: " + error);
// 	});
// 	}
// );
// }

function logout() {
	localStorage.removeItem("dataProfile");
	window.location.href = "index.html";
}

function notification(cat, T) {
	if (cat == 200) {
		swal({
			title: "Proccess success!",
			text: T,
			icon: "success",
			button: "Thanks!",
		});
		$(".sweet-alert").css({
			'background-color': '#2196F3'
		});
	} else if (cat == 500) {
		swal({
			title: "Proccess failed!",
			text: T,
			icon: "error",
			button: "Thanks!",
		});
		$(".sweet-alert").css({
			'background-color': '#F44336'
		});
	}

	$(".sweet-alert").find('p').css({
		'color': '#fff'
	});
	$(".sweet-alert").find('h2').css({
		'color': '#fff'
	});
	$(".sweet-alert").find('button').css({
		'background': '#03A9F4'
	});
}

function controlBackBtn(page) {
	$('#backBtn').attr('data-target', page);
}

function loadingActive() {
	$('.page-loader-wrapper').fadeIn(400, "linear");
}

function loadingDeactive() {
	$('.page-loader-wrapper').fadeOut(400, "linear");
}

function parseUserData(){
	let dataProfile = JSON.parse(localStorage.getItem("dataProfile"));
	return dataProfile;
}

async function makeSpecArray(dataProfile){
	// var splitSpec = dataProfile.specialization.split(",");
	// var splittedFinal = splitSpec.map(function (x) { 
	// 	return parseInt(x, 10); 
	//   });
	// return splittedFinal;
	return dataProfile.specialization;
}

function putSwitchData(){
	let searchParams = new URLSearchParams(window.location.search);
	let classId = searchParams.get('classId');
	let coachOldId = searchParams.get('coachId');
	let schedOldId = searchParams.get('oldSchedId');
	$('#schedId').val(schedOldId);
	$('#oldCoachId').val(coachOldId);
	console.log('data to switch',schedOldId);
	console.log('data to switch coach',coachOldId);
}

async function validate(param) {
	let dataProfile = JSON.parse(localStorage.getItem("dataProfile"));
	let directory = urlService;
	if (dataProfile) {
		switch (param) {
			case "login":
				window.location = "home.html";
				break;
			case "addSchedule":
				getData(param,dataProfile.specialization);
				break;
			case "scheduleDetail":
				getScheduleDetail();
				break;
			case "listSchedule":
				getData(param);
				break;
			case "classHistory":
				getClassHistory();
				break;
			case "switchReqeuest":
				getSwitchRequest();
				break;
			case "ongoingClass":
				getOngoingClass();
				break;
			case "switchSchedule":
				putSwitchData();
				break;
			case "getPlace":
				getPlace();
				break;
			case "profile":
				appendProfile(dataProfile)
				break;
		}
	} else {
		// logout();
		switch(param){
			default:
				getData(param,"all");
				break;
		}
	}
}

function getPlace(){
	getData('placeList')
}

function getOngoingClass(){
	getData('ongoingClass');
}

function getSwitchRequest(){
	getData('switchRequest');
}

function getClassHistory(){
	getData('classHistory');
}

function getScheduleDetail(){
	let searchParams = new URLSearchParams(window.location.search);
	let classId = searchParams.get('classId');
	console.log('ww',classId);
	let coachOldId = searchParams.get('coachId');
	let schedOldId = searchParams.get('oldSchedId');
	let classSetatus = searchParams.get('status');
	$('#schedId').val(schedOldId);
	$('#oldCoachId').val(coachOldId);
	$('#status').val(classSetatus);
	getData('classDetail',classId);
}

function appendSpecialization(data,index){
	let specHtml = '<option value='+data.id+'>'+data.name+'</option>';
	$('#classTrain').append(specHtml);
}

function appendGetPlaceSchedule(data,index){
	let placeSchedule = '<option value='+data.id+'>'+data.name+'</option>';
	$('#placeOption').append(placeSchedule);
}

function appendGetPlace(data,index){
	let placeHtml = '<option value='+data.id+'>'+data.name+'</option>';
	$('#placeId').append(placeHtml);
}

function callModal(content) {
	$('#largeModal').modal({
		backdrop: 'static',
		keyboard: false,
		show: true
	});
	$('.modal-body').empty('');
	$('.modal-body').html('');
	$('.modal-body').html(content);
}

function appendClassList(data,index){
	let classHtml = '<option value='+data.id+'>'+data.name+'</option>';
	$('#classOptionList').append(classHtml);
}

function appendSwitchRequest(data,index){
	console.log('data to switch',data);
	let respondedButton = '';
	let respondedText = '';
	if(data.status !== "yes" && data.status !== "no"){
		respondedButton += '<a class="btn-floating btn-xs purple-gradient waves-effect waves-light text-white accRequest" data-switch='+data.id+'><i class="fas fa-check"></i></a>' +
		'<a class="btn-floating btn-xs peach-gradient waves-effect waves-light text-white rejectRequest" data-switch='+data.id+'><i class="fas fa-times"></i></a>';
	} else {
		respondedText += '<br/><div> your respon : ' + data.status + '</div>';
	}
	let switchReqHtml = '<div class="card card-cascade wider">' +
		'<div class="card-body card-body-cascade text-center">' +
		'<div class="row">' +
		'<div class="col-6" style="border-right:solid 1px #ddd;padding-left:3%;">' +
		'<div class="news">' +
		'<div class="excerpt">' +
		'<div class="brief">' +
		'<h5 class="blue-text">' + data.className + '</h5></div>' +
		'<div class="feed-footer">' +
		'<div> by : ' + data.name + '</div>' +
		'<div> on : ' + moment(data.fromStartDate).format('DD MMMM YYYY') + '</div><br/>'+
		'<h5 class="blue-text"> To your </h5> <div> class : '+data.toClassName+' </div> on : ' + moment(data.toStartDate).format('DD MMMM YYYY') +
		// '<h5 class="blue-text"> To your schedule on : </h5>' + moment(data.toStartDate).format('DD MMMM YYYY') +
		'<div> at : ' + moment(data.toStartTime, "HH:mm:ss").format('HH:mm') + '</div>'+
		'<div> until : ' + moment(data.toEndTime, "HH:mm:ss").format('HH:mm') + '</div>';
		switchReqHtml += respondedText;
		switchReqHtml += '<a class="like">' +
		'</a></div></div></div></div>' +
		'<div class="col-6" style="align-self:center">' +
		'<h6 class="h6 text-default"> start : ' + moment(data.fromStartTime, "HH:mm:ss").format('HH:mm') + '</h6>';
		switchReqHtml += respondedButton;
		switchReqHtml +='<h6 class="h6 text-default"> end : ' + moment(data.fromEndTime, "HH:mm:ss").format('HH:mm') + '</h6>' +
		'</div>' +
		'</div>' +
		'</div></div><div class="clearfix"></div><br/>';
	$('#switchRequestData').append(switchReqHtml);
}

function appendProfile(dataProfile){
	$('#profName').append(dataProfile.name);
	$('#profAddr').append(dataProfile.address);
	$('#profEmail').append(dataProfile.email);
	$('#profPhone').append(dataProfile.phone);
}

function getData(param, extraParam) {
	let profile = JSON.parse(localStorage.getItem('dataProfile'));
	let directory = urlService;
	switch (param) {
		case "memberClass":
			directory += '/class/memberClass/' + profile.accessToken;
			break;
		case "addSchedule":
			directory += '/class/get/' + profile.accessToken;
			break;
		case "trainerRegist":
			directory += '/class/get/x';
			break;
		case "listSchedule":
			directory += '/coach/class/schedule/' + profile.accessToken;
			break;
		case "classDetail":
			console.log('sched id',extraParam);
			directory += '/class/detail/' + profile.accessToken + '/' + extraParam;
			break;
		case "classHistory":
			directory += '/class/coachClass/history/' + profile.accessToken;
			break;
		case "getPlace":
			directory += '/place';
			break;
		case "coachScheduleDate":
			directory += '/class/schedule/' + profile.accessToken;
			console.log('param schedule',extraParam);
			break;
		case "switchRequest":
			directory += '/coach/class/schedule/' + profile.accessToken;
			break;
		case "ongoingClass":
			directory += '/coach/class/schedule/' + profile.accessToken;
			break;
		case "placeList":
			directory += '/place';
			break;
	}
	if(param == 'trainerRegist'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"param" :"all"
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian', callback);
				console.log('kembalian p', param);
				console.log('kembalian d', directory);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						notification(500,'data not found');
						break;
					case "200":
						callback.data.forEach(appendSpecialization);
						break;
				}
			}
		})
	} else if(param == 'switchRequest'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"filter" :"switchRequest"
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian data switch request', callback);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						notification(500,'data not found');
						break;
					case "200":
						callback.data.forEach(appendSwitchRequest);
						break;
				}
			}
		})
	} else if(param == 'placeList'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"token" :profile.accessToken
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian data place list', callback);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						notification(500,'data not found');
						break;
					case "200":
						callback.data.forEach(appendGetPlaceSchedule);
						break;
				}
			}
		})
	} else if(param == 'ongoingClass'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"classStatus" :"started"
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian data filter started', callback);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						// notification(500,'data not found');
						let emptyOngoing = "<h3>You don't have any ongoing class right now</h3>"
						$('#ongoingClass').append(emptyOngoing);
						break;
					case "200":
						callback.data.forEach(appendStartedClass);
						break;
				}
			}
		})
	} else if(param == 'getPlace'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache"
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian', callback);
				console.log('kembalian p', param);
				console.log('kembalian d', directory);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						notification(500,'data not found');
						break;
					case "200":
						callback.data.forEach(appendGetPlace);
						break;
				}
			}
		})
	} else if(param == 'coachScheduleDate'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"param" : JSON.stringify({"byDate":String(extraParam)}) 
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian coach schedule', callback);
				console.log('kembalian p', param);
				console.log('kembalian d', directory);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						notification(500,'data not found');
						break;
					case "200":
						callback.data.forEach(appendScheduleByDate);
						break;
				}
			}
		})
	} else if(param == 'classHistory'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"classStatus" :"finished"
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian', callback);
				console.log('kembalian p', param);
				console.log('kembalian d', directory);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						let emptySchedule = '<h3>Empty Class History</h3>'
						$('#finishedClass').append(emptySchedule);
						break;
					case "200":
						callback.data.forEach(appendClassHistory);
						break;
				}
			}
		})
	} else if(param == 'classDetail'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"param" :"all"
			},
			timeout: 8000,
			tryCount: 0,
			retryLimit: 3,
			success: function (callback) {
				console.log('kembalian', callback);
				console.log('kembalian p', param);
				console.log('kembalian d', directory);
				switch (callback.responseCode) {
					case "500":
						this.tryCount++;
						if (this.tryCount < this.retryLimit) {
							$.ajax(this);
						}
						break;
					case "401":
						logout();
						break;
					case "404":
						notification(500,'data not found');
						break;
					case "200":
						// callback.data.forEach(appendGetPlace);
						console.log('ww',callback);
						if($('#status').val() == 'null'){
							$('#classSwitch').prop('checked',false);
						} else if($('#status').val() == 'started'){
							$('#classSwitch').prop('checked',true);
							$('#btnSwap').remove();
							$('#btnScan').remove();
						} 

						// if(callback.data.action == 'started'){
						// 	$('#classSwitch').prop('checked',true);
						// 	$('#btnSwap').remove();
						// 	$('#btnScan').remove();
						// } else if(callback.data.action == null || callback.data.action == 'null'){
						// 	$('#classSwitch').prop('checked',false);
						// } else {
						// 	$('#classSwitch').attr('disabled',true);
						// 	$('#btnSwap').remove();
						// 	$('#btnScan').remove();
						// }
						appendDetailSchedule(callback.data);
						break;
				}
			}
		})
	} else if(param == 'addSchedule'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"Accept-Encoding": "gzip, deflate",
				"Connection": "keep-alive",
				"byClassId":extraParam
			},
			timeout: 8000,
			success: function (callback) {
				switch (callback.responseCode) {
					case "401":
						logout();
						break;
					case "404":
						break;
					case "200":
						callback.data.forEach(appendClassList);
						break;
				}
			}
		})
	} else if(param == 'listSchedule'){
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"classStatus" : "null",
			},
			timeout: 8000,
			success: function (callback) {
				switch (callback.responseCode) {
					case "401":
						logout();
						break;
					case "404":
						// console.log('schedule',callback);
						let emptyScheduleNow = "<h3>You don't have any schedule</h3>"
						$('.scheduleList').append(emptyScheduleNow);
						break;
					case "200":
						console.log('schedule success',callback);
						callback.data.forEach(appendScheduleData);
						break;
				}
			}
		})
	} else {
		$.ajax({
			url: directory,
			crossDomain: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"Accept-Encoding": "gzip, deflate",
				"Connection": "keep-alive",
			},
			timeout: 8000,
			success: function (callback) {
				switch (callback.responseCode) {
					case "401":
						logout();
						break;
					case "404":
						if (param == 'memberClass') {
							appendEmptyClass();
						} else {
							alert(callback.responseMessage);
						}
						break;
					case "200":
						if (param == 'classList') {
							callback.data.forEach(appendClassData);
						} else if (param == 'classDetail') {
							domClassDetail(callback.data[0]);
						}
						break;
				}
			}
		})
	}
}

function appendScheduleByDate(data,index){
	let switchClassSchedule = '<option value="'+data.coachName+'" data-schedId="'+data.scheduleId+'" data-coachId='+data.coachId+' data-class='+data.classId+'>'+data.className+' - '+data.startTime+'</option>'
	$('#classChoose').append(switchClassSchedule);
}

function appendStartedClass(data,index){
	let startedTag = '<div class="card card-cascade wider mb-3 classSchedule" data-status="started" data-schedule='+data.scheduleId+' data-id='+data.class_id+' data-coach='+data.coach_id+'>'+
		'<div class="card-body card-body-cascade text-center">'+
			'<div class="row">'+
				'<div class="col-12" style="padding:0px;">'+
					'<table class="table table-borderless table-sm mb-0">'+
						'<tbody>'+
							'<tr>'+
								'<td class="font-weight-normal align-middle">'+
									'<span class="blue-text"><i class="fas fa-dumbbell fa-lg text-muted"></i>'+
										'&nbsp;'+data.class_name+'</span>'+
								'</td>'+
								'<td class="font-weight-normal mr-3 align-middle">'+
									'<p class="mb-1 text-muted text-default">'+moment(data.class_start_date).format('DD MMMM YYYY')+'</p>'+
								'</td>'+
								'<td class="font-weight-normal mr-3" align-center>'+
									'<p class="mb-1 text-muted text-default">'+moment(data.class_start_time, "HH:mm:ss").format('HH:mm')+' - ' + moment(data.class_end_time, "HH:mm:ss").format('HH:mm') +'</p>'+
									// '<p class="mb-1 text-muted text-default">-</p>'+
									// '<span class="text-default">'+data.class_end_time+'</span>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="clearfix"></div><br/>';
	$('#ongoingClass').append(startedTag);
}

function appendClassHistory(data,index){
	let tagHistory = '<div class="card card-cascade wider mb-3" data-id='+data.classId+'>'+
		'<div class="card-body card-body-cascade text-center">'+
			'<div class="row">'+
				'<div class="col-12" style="padding:0px;">'+
					'<table class="table table-borderless table-sm mb-0">'+
						'<tbody>'+
							'<tr>'+
								'<td class="font-weight-normal align-middle">'+
									'<span class="blue-text"><i class="fas fa-dumbbell fa-lg text-muted"></i>'+
										'&nbsp;'+data.className+'</span>'+
								'</td>'+
								'<td class="font-weight-normal mr-3 align-middle">'+
									'<p class="mb-1 text-muted text-default">'+moment(data.startDate).format('DD MMMM YYYY')+'</p>'+
								'</td>'+
								'<td class="font-weight-normal mr-3" align-center>'+
									'<p class="mb-1 text-muted text-default">'+moment(data.startTime, "HH:mm:ss").format('HH:mm')+' - ' + moment(data.endTime, "HH:mm:ss").format('HH:mm') +'</p>'+
									// '<p class="mb-1 text-muted text-default">-</p>'+
									// '<span class="text-default">'+data.endTime+'</span>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="clearfix"></div><br/>';
	$('#finishedClass').append(tagHistory);
}

function appendDetailSchedule(data){
	$('.className').html(data.className);
	$('#classDesc').html(data.descript);
}

function appendScheduleData(data,index){
	let tagSchedule = '<div class="card card-cascade wider mb-3 classSchedule" data-status="null" data-schedule='+data.scheduleId+' data-id='+data.class_id+' data-coach='+data.coach_account_id+'>'+
		'<div class="card-body card-body-cascade text-center">'+
			'<div class="row">'+
				'<div class="col-12" style="padding:0px;">'+
					'<table class="table table-borderless table-sm mb-0">'+
						'<tbody>'+
							'<tr>'+
								'<td class="font-weight-normal align-middle">'+
									'<span class="blue-text"><i class="fas fa-dumbbell fa-lg text-muted"></i>'+
										'&nbsp;'+data.class_name+'</span>'+
								'</td>'+
								'<td class="font-weight-normal mr-3 align-middle">'+
									'<p class="mb-1 text-muted text-default">'+moment(data.class_start_date).format('DD MMMM YYYY')+'</p>'+
								'</td>'+
								'<td class="font-weight-normal mr-3" style="align-self:center;">'+
									'<p class="mb-1 text-muted text-default">'+moment(data.class_start_time, "HH:mm:ss").format('HH:mm')+' - '+ moment(data.class_end_time, "HH:mm:ss").format('HH:mm') +'</p>'+
									// '<p class="mb-1 text-muted text-default">-</p>'+
									// '<span class="text-default">'+data.class_end_time+'</span>'+
								'</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="clearfix"></div><br/>';
	$('.scheduleList').append(tagSchedule);
}

function postData(uri, target, dd) {
	loadingActive();
	let profileData = JSON.parse(localStorage.getItem("dataProfile"));
	
	if (target == 'login') {
		
		$.ajax({
			url: urlService + '/' + target,
			type: "POST",
			data: JSON.stringify(dd),
			timeout: 5000,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			success: function (callback) {
				loadingDeactive();
				switch (callback.responseCode) {
					case "200":
						notification(200, "Login success");
						localStorage.setItem("dataProfile", JSON.stringify(callback.data));
						window.location.href = 'home.html';
						break;
					default:
						notification(500, "Login failed");
						break;
				}
				
			},
			error: function () {
				loadingDeactive();
				notification(500, "Cannot login, please try again");
			}
		});
	} else if (target == 'coachSchedule') {
		$.ajax({
			url: urlService + '/coach/class/schedule/' + profileData.accessToken,
			type: "POST",
			data: JSON.stringify(dd),
			timeout: 5000,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			success: function (callback) {
				loadingDeactive();
				switch (callback.responseCode) {
					case "200":
						notification(200, "Success create schedule");
						// console.log('schedule back',callback);
						window.location.href="schedule.html";
						break;
					default:
						notification(500, "Failed create schedule, please try again");
						break;
				}
				
			},
			error: function () {
				loadingDeactive();
				notification(500, "Server error, please try again");
			}
		});
	} else {
		let link = "";
		switch (data.filter) {
			case "coach":
				link = urlService + "/register"
				break;
		}
		$.ajax({
			url: link,
			crossDomain: true,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"Host": "localhost:8888",
			},
			timeout: 7000,
			data: JSON.stringify(dd),
			success: function (callback) {
				loadingDeactive();
				// var json = JSON.parse(callback);
				// console.log("check json ==>", json)
				// console.log(dd.filter);
				if (dd.filter == 'resendCode' || dd.filter == 'memberRegister' || dd.filter == 'coach') {
					console.log(callback);
					switch (callback.responseCode) {
						case "200":
							let content = '<input type="text" class="form-control" id="otpCode">' +
								"<b><small style='color:#fff;'>Your verification code has been send in your email address, Please check your email, and verify your account</small></b>"
							callModal(content);

							console.log(callback)
							// alert();	
							break;
						case "406":
							// alert(callback.responseMessage);
							notification(500, callback.responseMessage);
							break;
					}
					// if(callback.response == 200){
					// 	notification(json.response,"Please check your inbox mail, to have your verification code");
					// 	getPage('.container-wrap','verification',json.dataId);
					// }else{
					// 	notification(json.response,json.reason);
					// }
				} else if (dd.filter == 'confirmCode') {
					$.each($(json), function (i) {
						localStorage.setItem("userId", json[i].id);
						localStorage.setItem("userName", json[i].name);
					});
					window.location.href = 'profile.html';
				} else if (dd.filter == 'profileUser') {
					$('#imgProfile').submit();
				} else if (dd.filter == 'getProfile') {
					var gc = '';
					$.each($(json), function (i) {
						if (json[i].gender == 1) {
							gc = '<option value="' + json[i].gender + '">Male</option>' +
								'<option value="2">Female</option>';
						} else {
							gc = '<option value="' + json[i].gender + '">Female</option>' +
								'<option value="1">Male</option>';
						}
						$('#gender').empty();
						$('#gender').append(gc);
						$('#phone').val(json[i].phone);
						$('#address').val(json[i].address);
						$('#dvPreview').attr("src", json[i].imgProfile).css({
							'width': '90px',
							'height': '90px'
						});
						console.log(json);
					});
					if ($('#name').val() != '' && $('#gender option:selected').val() != '' &&
						$('#phone').val() != '' && $('#address').val() != '') {
						$('#updateProfile').remove();
						$('#skipNav').find('span').html("Let's Go");
					}
					if ($('#classHistoryPage').length > 0) {
						$.each($(json), function (i) {
							$('#userName').html(json[i].name);
							$('#imgUser').attr("src", json[i].imgProfile).css({
								'width': '90px',
								'height': '90px'
							});
						});
					}
				}
				setTimeout(function () {
					if ($(".sweet-alert").length > 0) {
						swal.close();
					}
				}, 950);
			},
			error: function () {
				loadingDeactive();
			}
		});

	}
}

function select2Activated() {
	$(".select2").select2({
		placeholder: 'Select Here'
	});
	$(".tags").select2({
		tags: true,
		tokenSeparators: [','],
		placeholder: 'Select Here'
	});
	$('.select2').css({
		"width": "100%"
	});
}

function getPage(dom, target, param) {
	if (dom != '') {
		$.ajax({
			url: target + '.html',
			success: function (response) {
				$(dom).empty();
				$(dom).html();
				$(dom).html(response);
				if (target == 'forgotPassword') {
					controlBackBtn('login');
				}
				if (target == 'verification') {
					$('.container-wrap').css({
						'margin-top': '60%'
					});
					$('#resendCode').attr('data-id', param);
					$('#confirmCode').attr('data-id', param);
					controlBackBtn('login');
				}
				loadingDeactive();
			}
		});
	} else {
		window.location.href = target + '.html';
	}
}

function dataTablleActivated() {
	$('.dataTable').dataTable();
}