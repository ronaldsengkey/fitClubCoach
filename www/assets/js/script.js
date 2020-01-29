var urlService = 'http://192.168.0.44:8888/ronaldSengkey/fitClub/api/v1';
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
	if ($('#registerPage').length > 0) {
		validate();
		select2Activated();
	}
	if($('#addSchedulePage').length > 0){
		validate('addSchedule');
	}
	var userData = parseUserData();
	console.log('user data',userData);
	setTimeout(function () {
		$('.page-loader-wrapper').fadeOut(400, "linear");
	}, 300);
});


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

function validate(param) {
	let dataProfile = JSON.parse(localStorage.getItem("dataProfile"));
	if (dataProfile) {
		switch (param) {
			case "login":
				window.location = "home.html";
				break;
			case "addSchedule":
				// getClassData();
				getData('classList',"all");
				break;
		}
	} else {
		// logout();
	}
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

function getData(param, extraParam) {
	let profile = JSON.parse(localStorage.getItem('dataProfile'));
	let directory = urlService;
	switch (param) {
		case "memberClass":
			directory += '/class/memberClass/' + profile.data.accessToken;
			break;
		case "addSchedule":
			directory += '/class/' + profile.data.accessToken;
			break;
	}
	if(param == 'addSchedule'){
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
				"param":extraParam
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

function postData(uri, target, dd) {
	loadingActive();
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