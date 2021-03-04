$(function(){
	// 登录和注册的切换
	$('.loginBox .toggleBtn').click(function(){
		$('.box').css('transform',`translateX(-${$(this).parent().width()}px)`)
	})
	$('.registerBox .toggleBtn').click(function(){
		$('.box').css('transform',`translateX(0px)`)
	})
	// 登录按钮的操作
	$('#loginForm').on('submit',function(e){
		e.preventDefault()
		$.ajax({
			url:'/login',
			type:'post',
			data:$(this).serialize(),
			success(data){
				if(data.errCode === 0){
					location.href = '/'
				}else if(data.errCode === 1){
					alert('用户名或者密码错误')
				}
			},
			error(err){
				console.log(err)
			}
		})
	})
	// 注册按钮的操作
	$('#registerForm').on('submit',function(e){
		e.preventDefault()
		if($('#registerForm input[name=password]').val() !== $('#registerForm input[name=enterpassword]').val()){
			console.log(12312)
			alert('密码和确认密码不一致')
			return
		}
		$.ajax({
			url:'/register',
			type:'post',
			data:$(this).serialize(),
			success(data){
				console.log(data)
				if(data.errCode === 0){
					alert('注册成功,请进行登录操作')
					$('.registerBox .toggleBtn').click()
				}else if(data.errCode === 1){
					alert('用户名已经存在,请重新注册')
				}
			},
			error(err){
				console.log(err)
			}
		})
	})
})