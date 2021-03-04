;
(function(window) {
	function getRandomInt(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	//显示全局播放列表
	function showFixedSongList(songList,songId){
		$('.fixedSongList ul').empty()
		// 重新渲染播放列表
		for(const i in songList){
			$('.fixedSongList ul').append(`
				<li class=${ songList[i].songId === songId ? "curSong" : "" }>
					<a href="#audioTemplate">
						<h2 class="listSongName">${songList[i].songName}</h2>
						<span class="listSongSinger">${songList[i].songSinger}</span>
						<div class="listSongClose"><em class="fas fa-times"></em></div>
						<input class="songId" value="${songList[i].songId}" hidden>
					</a>
				</li>
			`)
		}
		// li的单击事件
		$('.fixedSongList ul li').click(function(){
			send_ajax.getAduioData($(this).find('.songId').val()) //让大播放控件重新渲染数据
			$(this).addClass('curSong').siblings().removeClass('curSong') //更新当前播放歌曲的颜色
			$('.fixedSongListBox').click() //隐藏全局的播放列表
			
		})
	}
	//歌曲单击 (进入大播放控件前的操作)
	function songClick(e){
		e.stopPropagation() 
		window.sessionStorage.setItem('isLoadAduio',true) // 让播放控件可以进行歌曲替换渲染
		window.sessionStorage.setItem('curAduioMusicId', $(this).find('.songId').val()) // 将歌曲进行获取方便渲染
		
		let songList = window.sessionStorage.getItem('songList')
		songList = songList === null ? [] : JSON.parse(songList) //如果是第一次取就返回空数组
		
		const type = $(this).find('.type').val() // 获取类型源
		let songName = songSinger  = '' // 初始化歌曲名和歌手名
		const songId =  $(this).find('.songId').val() // 获取歌曲id
		const findIndex = songList.findIndex((v)=> v.songId === songId ) //查找是否有重复的
		if(findIndex === -1){
			//搜索出来的歌曲和歌单的歌曲取的方式不太相同
			if(type === 'search'){
				songName =  $(this).find('.songTitle').html()
				songSinger =  $(this).find('.singer').html()
			}else if(type === 'songList'){
				songName =  $(this).find('h4').html()
				songSinger =  $(this).find('p').html()
			}
			songList.push({songName,songSinger,songId}) // 添加到songList
			window.sessionStorage.setItem('songList',JSON.stringify(songList)) //写入本地存储
		}else{
			$('.fixedSongList ul').eq(findIndex).addClass('curSong').siblings().removeClass('curSong')
		}
		
		showFixedSongList(songList,songId) //渲染歌曲列表
		
		
		//歌列表的删除按钮
		$('.fixedSongList ul li .listSongClose').click(function(){
			let songList = JSON.parse(window.sessionStorage.getItem('songList'))
			const findIndex = songList.findIndex((v)=> v.songId === songId ) //找到当前存储的id索引
			songList.splice(findIndex,1) // 删除列表
			window.sessionStorage.setItem('songList',JSON.stringify(songList)) //写入本地存储
			showFixedSongList(songList,songId) //渲染歌曲列表
			pullMessageBox('删除歌曲成功',700)
		})
		
		
	}
	//解析lrc文件js 怎么读取一个文件内容
	function parseLrc(lrc) {
		const obj = {
			ms: []
		}
		if (!lrc.length) {
			return
		}
		const lrcList = lrc.split('\n').map(v => v.trim()) // 按照回车符分隔 并去除空格
		for (const i in lrcList) {
			if (isNaN(parseInt(lrcList[i][1]))) {
				//不是数值
				str = lrcList[i].substring(1, lrcList[i].length - 1) //去掉两边的中括号 'asd:"asdf"'
				obj[str.split(':')[0]] = str.split(':')[1]
			} else {
				const charIndex = lrcList[i].lastIndexOf(']') // 最右边中括号索引
				const timeArr = lrcList[i].substring(0, charIndex + 1).split(']') //截取时间   ['[00:0.0','']
				for (const j in timeArr) {
					const s = timeArr[j].substring(1) // [00:0.0 -> 00:0.0
					if (s.split(':')[0] === '') {
						break
					} // 去除上一个分隔后面多出来的空格 防止后续操作出现空字符串
					obj['ms'].push({
						t: (parseInt(s.split(':')[0]) * 60 + parseFloat(s.split(':')[1])).toFixed(3),
						c: lrcList[i].substring(charIndex + 1) // 截取歌词
					})
				}
			}
		}
		obj.ms.sort((a, b) => a.t - b.t) // 排序
		return obj
	}
	// 渲染用户数据
	function showUserData(data) {
		console.log(data)
		$('.userImg,.userAvatar').attr('src', data.data.avatar)
		$('.userName').html(data.data.username)
		$('.userLevel').html(data.data.level)
		$('.userEmail').html(data.data.email || '无')
		$('.userCoverBox').css('background-image',`url(${data.data.cover})`)
	}
	// 渲染用户我喜欢的歌单
	function showUserSongList(data) {
		console.log(data)
		
		$('#songListTemplateMain .songList ul').empty()
		$('#songListTemplateMain .imgBox img').attr('src',data.coverImg) //修改歌单模板的封面
		
		$('#songListTemplateMain .songListTemplateInfoTitle').html(data.songListInfo.sognListName) //显示名字
		
		//渲染用户信息
		$('.songListTemplateUserImg').attr('src',data.userData.avatar)//显示头像
		$('.songListTemplateUserName').text(data.userData.name) //显示名字
		$('.songListTemplateUserId').val(data.userData.userId) //赋值id
		//渲染歌曲
		const songList = data.songList
		for (const i in songList) {
			$('#songListTemplateMain .songList ul').append(`
				<li>
					<a href="#audioTemplate">
						<span class="number">${Number(i) + 1}</span>
						<h4>${songList[i].name}</h4>
						<p>${songList[i].singer}</p>
						<span class="songMv"><em class="fas fa-play-circle"></em></span>
						<span class="songTool"><em class="fas fa-ellipsis-v"></em></span>
						<input class="songId" value="${songList[i]._id}" hidden>
						<input class="type" value="songList" hidden>
					</a>
				</li>
			`)
			$('#songListTemplateMain .songList ul li').click(songClick)
		}
	}
	// 渲染用户创建的歌单信息(省略)
	function showUserCreateSongListInfo(songList,nodeStr){
		if(nodeStr === '.fixedShowCreateSongList ul'){
			$(`${nodeStr},.userTemplateCreactSongList ul`).empty()
		}else{
			$(`.userTemplateCreactSongList ul`).empty()
			$(`${nodeStr} li:first-child`).siblings().remove() //清除除了第一个 其他都要清除
		}
		for(const obj of songList){
			$(`${nodeStr},.userTemplateCreactSongList ul`).append(
			`
				<li class="clr_txtShadow">
					<a href=${nodeStr === '.fixedShowCreateSongList ul' ? "#" : '\"?type=createSongList#songListTemplate\" data-ajax="false"'} >
						<img src="${obj.coverImg}" alt="">
						<h2 class="clr_txtShadow">${obj.name}</h2>
						<h3 class="clr_txtShadow">${obj.songList.length}首</h3>
						<div class="createSongListId" hidden>${obj._id}</div>
						<div class="createSongListUserId" hidden>${obj.userId}</div>
					</a>
					${nodeStr === '.fixedShowCreateSongList ul' ? '' : '<div class=\'removeCreateSongList\'><em class="far fa-trash-alt"></em></div>' }
				</li>
			`)
		}
		if(nodeStr === '.fixedShowCreateSongList ul'){
			$('.fixedShowCreateSongList li').click(function(e){
				const obj = {
					songListId:$(this).find('.createSongListId').html(),
					type:'createSongList'
				}
				send_ajax.addSongToSongList(obj)
			})
		}else{
			$(`${nodeStr} li,.userTemplateCreactSongList ul li`).click(function(e){
				window.sessionStorage.setItem('toSongListTemplateInfo',JSON.stringify({
					userId:$(this).find('.createSongListUserId').html(),
					songListId:$(this).find('.createSongListId').html(),
					sognListName:$(this).find('h2').html()
				}))
			})
			$('.removeCreateSongList').click(function() {
				const songListId = $(this).parent().find('.createSongListId').html()
				confirm('确定要删除此歌单？') ? send_ajax.delCreateSongList(songListId) : null
			})
		}
		
		$('.createSongListFold').find('strong').html(`(${songList.length + 1})`) // 渲染创建歌单的数量
		//更新ul的高度为默认第一个li的高度
		$(`.contentToggleBox>ul`).css('height', `${$(`.contentToggleBox>ul>li`).eq(1).height()}px`)
	}
	// 渲染搜索历史记录	
	function showSearchHistoryData(){
		let list = window.sessionStorage.getItem('searchHistory')
		list = JSON.parse(list) || [] 
		$('.searchHistoryBox ul').empty()
		for(const data of list){
			$('.searchHistoryBox ul').append(`<li>${data}</li>`)
		}
		$('.searchHistoryBox ul li').click(function(){
			$('.clearInputVal').fadeIn(150) //显示清除按钮
			$('#searchInput').val($(this).html()) //将当前文本值赋值到搜索框
			$('#searchBtn').click() // 模拟单击搜索
		})
	}
	// 渲染搜索数据
	function showSearchData(data) {
		$('#searchPageMain .hotSearch').fadeOut(150).siblings('ul').empty() 
		$('#searchPageMain .hotSearchTitle').fadeOut(150)
		showSearchHistoryData() //渲染历史记录
		// 渲染歌曲搜索结果
		for (const obj of data.data.songList) {
			$('<li></li>').html(
				`<li>
				<a href="#audioTemplate">
					<h3 class="songTitle">${obj.name}</h3>
					<span class="singer">${obj.singer}</span>
					<input class="songId" value="${obj.id}" hidden>
					<input class="type" value="search" hidden>
				</a>
			</li>`
			).appendTo('.songSerch')
			$('.songSerch li').click(songClick)
		}
		// 渲染用户搜索结果
		for (const obj of data.data.userList) {
			$('<li></li>').html(
				`<li>
				
				<a href="#">
					<img src="${obj.avatar}" class="searchUserImg">
					<h3 class="searchUserName">${obj.username}</h3>
					<span class="searchUserInfo">${obj.specialInfo}</span>
				</a>
			</li>`
			).appendTo('.userSearch')
		}
	}
	// 渲染播放器数据
	function showAudioData(data) {
		function showLyricData(data) {
			$('#lyric').empty()
			const lrcObj = parseLrc(data)
			// 渲染歌词
			for (const i in lrcObj.ms) {
				$('#lyric').html(`${$('#lyric').html()}<li>${lrcObj.ms[i].c}</li>`)
			}
			// S 歌词滚动
			let curAduioIndex = 0 //当前歌词索引
			const offset = $('.lyricBox li:first').height() //每个li的高度
			const curPos = Math.floor($('.lyricBox').height() / 2 / offset)
			$('audio').on('timeupdate', () => {
				// 如果当前歌词索引大于歌词长度就退出
				if (curAduioIndex === lrcObj.ms.length) {
					return
				}
				// 判断当前歌词的长度是否小于当前播放器的时间长度
				if (parseFloat(lrcObj.ms[curAduioIndex].t) <= $('audio')[0].currentTime) {
					$('#lyric li').eq(curAduioIndex).addClass('curLyric').siblings().removeClass('curLyric')
					if (curAduioIndex > curPos) {
						$('#lyric').css('transform', `translateY(-${(curAduioIndex - curPos)* offset}px)`)
					}
					$('.fixedAudioTitle .singerName').html($('#lyric li').eq(curAduioIndex).html()) // 更新小播放控件的歌词
					curAduioIndex++
				}

				//seeked 是播放器进度已经跳跃完的事件
				$('audio').on('seeked', () => {
					let curIndexCount = 0 //当前索引的位置
					for (const i in lrcObj.ms) {
						if (lrcObj.ms[i].t > updateT) {
							$('#lyric li').eq(curIndexCount - 1).addClass('curLyric').siblings().removeClass('curLyric')
							if (curIndexCount > curPos) {
								$('#lyric').css('transform', `translateY(-${(curIndexCount - 1 - curPos)* offset}px)`)
							} else {
								$('#lyric').css('transform', `translateY(${0}px)`)
							}
							curAduioIndex = curIndexCount
							break
						}
						curIndexCount++
					}
				})

				$('audio').on('ended', () => {
					$('#lyric .curLyric').removeClass('curLyric') // 删除当前类
					$('#lyric').css('transform', 'translateY(0)') //滚动顶部
					curAduioIndex = 0 // 当前歌词索引初始化
				})
				// E 歌词滚动
			})
		}
		$('.songName').html(data.songData.name)
		$('.singerName').html(data.songData.singer)
		$('.coverBoxImg img,.audioTemplateBg img,.fixedAudioImg').attr('src', data.songData.musicCoverImg)
		$('audio')[0].pause() //渲染前暂停 很重要!!
		$('audio').attr('src', data.songData.src)
		//判断歌词数据是否存在
		if (!data.songData.lrcData) {
			$('#lyric').html(`<li>暂无歌词</li>`)
		} else {
			showLyricData(data.songData.lrcData) //渲染歌词并实现歌词滚动
		}
		//是否为用户喜欢的歌曲
		if(data.songData.isLikeMusic){
			$('.likeSongBtn em').addClass('likeSongBtn_active')
		}else{
			$('.likeSongBtn em').removeClass('likeSongBtn_active')
		}
		window.sessionStorage.setItem('curAduioMusicId', data.songData._id) // 更新本地存储当前播放的id
		// $('audio')[0].play()
		
		
	}
	//上一首也下一首
	function audioPrevAndNext(obj){
		let songList = JSON.parse(window.sessionStorage.getItem('songList'))
		const playType = window.sessionStorage.getItem('playType')
		const songId = window.sessionStorage.getItem('curAduioMusicId')
		let findIndex = songList.findIndex((v) => v.songId === songId) //找到当前存储的id索引
		let dataObj = {}
		if(obj.type === 'leftClick' ||  obj.type === 'rightSwiper'){
			findIndex = findIndex === 0 ? songList.length - 1 : --findIndex
			send_ajax.getAduioData(songList[findIndex].songId) //渲染音乐播放器
			fun.showFixedSongList(songList, songList[findIndex].songId) //刷新播放列表
			return
		}else{
			dataObj = {
				//顺序
				order(){
					console.log('order')
					if(++findIndex === songList.length){ return false }
					return true
				},
				//列表循环
				loop(){
					console.log('loop')
					findIndex = ++findIndex === songList.length ? 0 : findIndex
					return true
				},
				//单曲循环
				oneLoop(){
					console.log('oneLoop')
					//如果是单击进来的下一首 就按照列表循环获取下一首 否则就原地刷新
					if(obj.type === 'rightClick'){
						findIndex = ++findIndex === songList.length ? 0 : findIndex
					}
					return true
				},
				//随机
				random(){
					console.log('random')
					const index = getRandomInt(0,songList.length - 1) //随机值
					if(index === findIndex){this.random()} //如果一样就用递归重新随机
					findIndex = index // 不一致就赋值
					return true
				}
			}
		}
		if(dataObj[playType]()){
			send_ajax.getAduioData(songList[findIndex].songId) //渲染音乐播放器
			fun.showFixedSongList(songList, songList[findIndex].songId) //刷新播放列表
		}
	}
	// 弹出消息框
	function pullMessageBox(text,delay){
		$('.fixedMessageBox span').html(text).parent().stop().fadeIn(150)
		setTimeout(()=>{ $('.fixedMessageBox').stop().fadeOut(150) },delay)
	}
	window.fun = {
		parseLrc,
		showUserData,
		showUserSongList,
		showSearchData,
		showAudioData,
		showFixedSongList,
		showUserCreateSongListInfo,
		audioPrevAndNext,
		pullMessageBox,
		showSearchHistoryData
	}
})(window);
