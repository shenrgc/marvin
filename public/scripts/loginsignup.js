var token;

$(document).ready(function(){
	token = "";
	$("#login").click(function(){
		$.ajax ({
			type: 'GET',
			url: '/login',
			success: function (response){
				$('body').html(response.substring(response.indexOf('<body'), response.indexOf('/body>')));
			},
			error: function() {
				location.reload();
			}
		});
	});
	$("#signup").click(function(){
		$.ajax ({
			type: 'GET',
			url: '/register',
			success: function (response){
				$('body').html(response.substring(response.indexOf('<body'), response.indexOf('/body>')));
			},
			error: function() {
				location.reload();
			}
		});
	});
});

function registerUser(name, email, password) {
	$.ajax ({
		type: 'POST',
		url: '/register',
		data: {
			"name": name.value,
			"email": email.value,
			"password": password.value
		},
		success: function (response){
			if(response.token) token = response.token;
			else location.reload();
		},
		error: function() {
			location.reload();
		}
	});
	return false;
}