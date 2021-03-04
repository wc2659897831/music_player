$(function() {
	(async function(document) {
		const user_id = $('.userId').html()
		async function get_userData(userId) {
			return await $.ajax({
				url: '/getUserData',
				type: 'get',
				data: `userId=${userId}`,
			})
		}
		// S 获取用户数据
		const userData = await get_userData(user_id)
		if (userData.errCode === 0) {
			fun.showUserData(userData) //渲染用户数据
		}
		// E 获取用户数据
		// S 获取我喜欢的歌单的信息(我喜欢的歌单封面和歌曲数量)
		async function getLikeSongListInfo(userId) {
			const userLikeSongListInfo = await $.ajax({
				url: '/getUserLikeSongList',
				type: 'get',
				data: `userId=${userId}`
			})
			if (userLikeSongListInfo.errCode === 0) {
				const songList = userLikeSongListInfo.songList
				if (songList.length) {
					$('.likeSongListCount').html(songList.length) //渲染我喜欢的音乐的长度
					$('.userLikeSongListCoverImg').attr('src', userLikeSongListInfo.coverImg) //渲染我喜欢的歌单图片
				} else {
					$('.likeSongListCount').html(0) //渲染我喜欢的音乐的长度
					$('.userLikeSongListCoverImg').attr('src', '/static/imgs/bg.png') //渲染我喜欢的歌单图片
				}
			}
		}
		await getLikeSongListInfo(user_id)
		// E 获取我喜欢的歌单的信息(我喜欢的歌单封面和歌曲数量)

		// S 获取用户创建的歌单信息
		async function getUserCreateSongListInfo(userId, nodeStr) {
			const userCreateSongListInfo = await $.ajax({
				url: '/getCreateSongList',
				type: 'get',
				data: `userId=${userId}`
			})
			if (userCreateSongListInfo.errCode === 0) {
				fun.showUserCreateSongListInfo(userCreateSongListInfo.songList, nodeStr)
			}
		}
		await getUserCreateSongListInfo(user_id, '.songListBox')
		// S 获取用户创建的歌单信息

		// 搜索页面的搜索按钮单击时
		$('#searchBtn').click(async () => {
			const searchInputVal = $('#searchInput').val()
			if(searchInputVal.trim() === ''){
				fun.pullMessageBox('搜索框内容不能为空',700)
				return
			}
			let searchHistory = window.sessionStorage.getItem('searchHistory') //读取
			searchHistory = JSON.parse(searchHistory) || [] // 第一次也是返回数组
			if(searchHistory.indexOf(searchInputVal) === -1){
				searchHistory.push(searchInputVal) // 给数组赋值
				window.sessionStorage.setItem('searchHistory', JSON.stringify(searchHistory)) // 重新存储
			}
			const searchData = await $.ajax({
				url: '/globalSearch',
				type: 'get',
				data: `value=${$('#searchInput').val()}`
			})
			if (searchData.errCode === 0) {
				fun.showSearchData(searchData)
			}
		})

		// 我喜欢按钮单击事件
		$('.likeSongBtn').click(async () => {
			addSongToSongList({
				type: 'likeSongList'
			})
		})
    // 文件表单上传文件时的事件
		$('#fileForm').on('submit', async function(e) {
			e.preventDefault()
			const formData = new FormData()
			formData.append('File', $('#fileInput')[0].files[0])
			formData.append('userId', $('.userId').html())
			formData.append('uploadType', window.sessionStorage.getItem('uploadImgType'))
			console.log(FormData)
			const upFile = await $.ajax({
				url: '/upLoadImg',
				type: 'post',
				data: formData,
				dataType: 'json',
				processData: false, // 不要处理发送的数据
				contentType: false //不要设置Content-Type请求头
			})
			if (upFile.errCode === 0) {
				fun.pullMessageBox('更换头像成功', 700)
				history.go(0) //原地刷新 目的就是重新从服务器获取数据 如果使用ajax由于我命名的规则(新旧图片都是同一个文件名) 它获取是浏览器缓存的文件
			}
		})

		// 添加歌曲到歌单中 
		async function addSongToSongList(data) {
			const songId = window.sessionStorage.getItem('curAduioMusicId')
			const addSongToSongList = await $.ajax({
				url: '/addSongToSongList',
				type: 'get',
				data: `songId=${songId}&type=${data.type}&userId=${user_id}&songListId=${data.songListId}`
			})
			if (addSongToSongList.errCode === 0) {
				if (data.type === 'likeSongList') {
					$('.likeSongBtn em').addClass('likeSongBtn_active')
					console.log(`添加到我喜欢的歌曲成功 ${songId}`)
					fun.pullMessageBox('添加到我喜欢', 700)
				} else if (data.type === 'createSongList') {
					console.log(`添加到指定歌单成功 ${songId}`)
					fun.pullMessageBox('添加到指定歌单', 700)
				}

			} else if (addSongToSongList.errCode === 1) {
				if (data.type === 'likeSongList') {
					$('.likeSongBtn em').removeClass('likeSongBtn_active')
					console.log(`取消到我喜欢的歌曲成功`)
					fun.pullMessageBox('取消到我喜欢', 700)
				} else if (data.type === 'createSongList') {
					console.log(`歌曲已经存在`)
					fun.pullMessageBox('歌曲已经存在', 700)
				}

			}

		}

		//创建歌单按钮单击时
		$('.createSongListBtn').click(async () => {
			const createSongListData = await $.ajax({
				url: '/createSongList',
				type: 'get',
				data: `name=${$('.createSongListName').val()}&userId=${user_id}`
			})
			if (createSongListData.errCode === 0) {
				console.log(createSongListData)
				$('.fixedCreateSongListBox').click()
				getUserCreateSongListInfo(user_id, '.songListBox') //添加完就重新获取用户创建的歌单
				fun.pullMessageBox('创建歌单成功', 700)
			}
		})

		async function delCreateSongList(songListId) {
			const delCreateSongListData = await $.ajax({
				url: '/delCreateSongList',
				type: 'get',
				data: `songListId=${songListId}`
			})
			if (delCreateSongListData.errCode === 0) {
				console.log(delCreateSongListData)
				getUserCreateSongListInfo(user_id, '.songListBox') //添加完就重新获取用户创建的歌单
				fun.pullMessageBox('删除歌单成功', 700)
			}
		}


		// 获取当前播放器歌曲数据
		async function getAduioData(id) {
			const aduioData = await $.ajax({
				url: '/getSong',
				type: 'get',
				data: `songId=${id}&userId=${user_id}`
			})
			if (aduioData.errCode === 0) {
				fun.showAudioData(aduioData)
			}
		}
		// S 获取用户喜欢歌单数据
		async function getSongTemplateData(obj) {
			const userData = await get_userData(obj.userId) //获取用户信息
			let url = ''
			//如果渲染的是我喜欢的歌单数据
			if (obj.type === 'likeSongList') {
				url = 'getUserLikeSongList'
			} else if (obj.type === 'createSongList') {
				url = 'getUserCreateSongList'
			}
			const userSongList = await $.ajax({
				url,
				type: 'get',
				data: `userId=${obj.userId}&songListId=${obj.songListId}`
			})
			let songList = [] //存放实际的歌曲文件
			if (userSongList.songList) {
				// 循环请求 然后获取每一个数据文件并保存
				for (const obj of userSongList.songList) {
					console.log(obj)
					const songData = await $.ajax({
						url: '/getSong',
						type: 'get',
						data: `songId=${obj.songId}`
					})
					songData.songData.addTime = obj.addTime //增加一个添加到我的喜欢的时间
					songList.push(songData.songData)
				}
				songList = songList.sort((a, b) => b.addTime - a.addTime) //排序
			}
			fun.showUserSongList({
				songList,
				userData: {
					name: userData.data.username,
					avatar: userData.data.avatar,
					userId: userData.data._id
				},
				coverImg: userSongList.coverImg,
				songListInfo: obj
			})
		}
		// E 获取用户喜欢歌单数据
		window.send_ajax = {
			getAduioData,
			getSongTemplateData,
			getLikeSongListInfo,
			getUserCreateSongListInfo,
			addSongToSongList,
			delCreateSongList
		}
	})(document)
})
