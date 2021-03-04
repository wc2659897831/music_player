$(function() {
	(async function(){
		
		// 添加歌曲
		$('#addSongForm').on('submit', async function(e) {
			e.preventDefault()
			const addSong = await $.ajax({
				url: '/addSong',
				type: 'post',
				data: $(this).serialize()
			})
			if (addSong.errCode === 0) {
				alert(addSong.message)
			} else if (addSong.errCode === 1) {
				alert(addSong.message)
			}
			window.admin_fun.getAllSong()
		})
		
		// 修改歌曲
		$('#updateSongForm').on('submit', async function(e) {
			e.preventDefault()
			const updateSong = await $.ajax({
				url: '/updateSong',
				type: 'post',
				data: $(this).serialize()
			})
			if (updateSong.errCode === 0) {
				alert(updateSong.message)
			}
			window.admin_fun.getAllSong()
		})
		
		//添加用户单击时
		$('.addSongBtn').click(()=>{
			$('.addSong').fadeIn(150).siblings(':not(.songList)').fadeOut(150) //除了列表和修改表单 其他隐藏
		})
		
		// 修改用户
		$('#updateUserForm').on('submit', async function(e) {
			e.preventDefault()
			const updateUser = await $.ajax({
				url: '/updateUser',
				type: 'post',
				data: $(this).serialize()
			})
			if (updateUser.errCode === 0) {
				alert(updateUser.message)
			}
			window.admin_fun.getUuerData()
		})
		
		// 用户退出
		$('.userExit').click(async ()=>{
			await $.ajax({
				url: '/loginOut',
				type: 'get',
			})
			history.go(0) //手动刷新
		})
		
		//tab切换栏
		$('.toggleNav li').click(function(){
			$(this).addClass('curToggleNav').siblings().removeClass('curToggleNav')
			$('.toggleBox>div').eq($(this).index()).fadeIn(150).siblings().fadeOut(150)
		})
		
		async function getUuerData(){
			//发送获取用户列表请求
			const getUserList = await $.ajax({
				url: '/getUserList',
				type: 'get',
			})
			if (getUserList.errCode === 0) {
				$('.userList table tbody').empty()
				// 渲染列表
				const data = getUserList.userList
				for(const i in data){
					$('<tr></tr>').html(`
						<td>${Number(i) + 1}</td>
						<td>${data[i]._id}</td>
						<td>${data[i].username}</td>
						<td>${data[i].password}</td>
						<td>${data[i].email || '无'}</td>
						<td>${data[i].createTime}</td>
						<td>${data[i].avatar}</td>
						<td>${data[i].level}</td>
						<td>${data[i].jurisdiction}</td>
						<td>${data[i].specialInfo}</td>
						<td>
							<a href="javascript:;" class="updateUserBtn">修改</a>
							<a href="javascript:;" class="delUserBtn">删除</a>
						</td>
						
					`).appendTo('.userList table tbody')
					$('.updateUserBtn').click(async function(){
						$('.updateUser').fadeIn(150).siblings(':not(.userList)').fadeOut(150) //除了列表和修改表单 其他隐藏
						const tdList = $(this).parents('tr').children()	
						$('#updateUserForm input[name=username]').val(tdList.eq(2).html())
						$('#updateUserForm input[name=password]').val(tdList.eq(3).html())
						$('#updateUserForm input[name=email]').val(tdList.eq(4).html() === '无' ? '' : tdList.eq(4).html())
						$('#updateUserForm input[name=createTime]').val(tdList.eq(5).html())
						$('#updateUserForm input[name=avatar]').val(tdList.eq(6).html())
						$('#updateUserForm input[name=level]').val(tdList.eq(7).html())
						$('#updateUserForm select[name=jurisdiction]').find(`[value=${tdList.eq(8).html()}]`).attr('selected',true)
						$('#updateUserForm input[name=specialInfo]').val(tdList.eq(9).html())
						$('#updateUserForm input[name=userId]').val(tdList.eq(1).html())
					})
				}
				$('.delUserBtn').click(async function(){
					const userId = $(this).parents('tr').children().eq(1).html()
					const userName = $(this).parents('tr').children().eq(2).html()
					const flag = confirm(`确定要删除用户名为 ${userName} 的用户吗?`)
					if(flag){
						const delUser = await $.ajax({
							url: '/delUser',
							type: 'get',
							data: `userId=${userId}`
						})
						if (delUser.errCode === 0) {
							getUuerData()
						}
					}
				})
			}
		}
		await getUuerData()
		
		async function getAllSong(){
			//发送获取歌曲列表请求
			const getAllSong = await $.ajax({
				url: '/getAllSong',
				type: 'get',
			})
			if (getAllSong.errCode === 0) {
				$('.songList table tbody').empty()
				// 渲染列表
				const data = getAllSong.songList
				for(const i in data){
					$('<tr></tr>').html(`
						<td>${Number(i) + 1}</td>
						<td>${data[i]._id}</td>
						<td>${data[i].name}</td>
						<td>${data[i].singer}</td>
						<td>${data[i].src}</td>
						<td>${data[i].lrcSrc || '无'}</td>
						<td>${data[i].musicCoverImg}</td>
						<td>
							<a href="javascript:;" class="updateSongBtn">修改</a>
							<a href="javascript:;" class="delSongBtn">删除</a>
						</td>
					`).appendTo('.songList table tbody')
				}
				$('.delSongBtn').click(async function(){
					const songId = $(this).parents('tr').children().eq(1).html()
					const songName = $(this).parents('tr').children().eq(2).html()
					const flag = confirm(`确定要删除歌曲名为 ${songName} 的歌曲吗?`)
					if(flag){
						const delSong = await $.ajax({
							url: '/delSong',
							type: 'get',
							data: `songId=${songId}`
						})
						if (delSong.errCode === 0) {
							window.admin_fun.getAllSong()
						}
					}
				})
				$('.updateSongBtn').click(async function(){
					$('.updateSong').fadeIn(150).siblings(':not(.songList)').fadeOut(150) //除了列表和修改表单 其他隐藏
					const tdList = $(this).parents('tr').children()	
					$('#updateSongForm input[name=name]').val(tdList.eq(2).html())
					$('#updateSongForm input[name=singer]').val(tdList.eq(3).html())
					$('#updateSongForm input[name=src]').val(tdList.eq(4).html())
					$('#updateSongForm input[name=lrcSrc]').val(tdList.eq(5).html() === '无' ? '' : tdList.eq(5).html())
					$('#updateSongForm input[name=musicCoverImg]').val(tdList.eq(6).html())
					$('#updateSongForm input[name=songId]').val(tdList.eq(1).html())
				})
			}
		}
		await getAllSong()
		window.admin_fun = {
			getUuerData,
			getAllSong
		}
	})(window)
})
