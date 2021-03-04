$(function () {
  // S contentToggleBox page 2
  // 必须要先生成小轮播的实例 再生成大轮播的实例
  // 生成contentToggleBox的toolBox实例
  const indexLunbo2 = new Lunbo({
    nodeStr: '.bannerBox',
    autoLunboDelay: 5000
  })
  // E contentToggleBox page 2

  // S contentToggleBox page 1
  // 生成contentToggleBox的toolBox实例
  const indexLunbo = new Lunbo({
    nodeStr: '.contentToggleBox',
    olNodeStr: '#indexHeaderOl',
    isNotAutoLunbo: true
  })

  // 生成indexHeader的toolBox实例
  const indexHeaderToolBox = new ToolBox({
    nodeStr: '#indexMain .toolBox',
    selectOne: true
  })

  // 生成contentToggleBox的第一个fold实例
  const contentToggleBoxFold1 = new FoldUl({
    btnNodeId: 'fold1',
    toggleIconNodeStr: '#fold1 em',
    animationTime: 500
  })
  // 生成contentToggleBox的第二个fold实例
  const contentToggleBoxFold2 = new FoldUl({
    btnNodeId: 'fold2',
    toggleIconNodeStr: '#fold2 em',
    animationTime: 500
  })
  // E contentToggleBox page 1

  //更新ul的高度为默认第一个li的高度
  $(`.contentToggleBox>ul`).css('height', `${$(`.contentToggleBox>ul>li`).eq(1).height()}px`)

  // S audioTemplatePageToggle
  $('.coverBox').click(function () {
    $(this).fadeOut(150)
    $('.lyricsAndVoiceBox').fadeIn(150)
  })

  $('.lyricsAndVoiceBox').click(function () {
    $(this).fadeOut(150)
    $('.coverBox').fadeIn(150)
  })
  // E audioTemplatePageToggle

  // S audio
  const audio = $('audio')[0] // 音乐播放控件

  // 初始化音量设置
  audio.volume = 0.7
  $('.voiceRangeLenght').css('width', '70%')
  $('.voiceRangeBtn').css('left', '70%')

  //上一首单击时
  $('.songUp').click(() => {
    fun.audioPrevAndNext({
      type: "leftClick"
    })
  })

  //下一首单击时
  $('.songNext').click(() => {
    fun.audioPrevAndNext({
      type: "rightClick"
    })
  })

  // 左右滑动实现切歌
  $('.coverBox').on('swipeleft', () => {
    fun.audioPrevAndNext({
      type: "leftSwiper"
    })
  })
  $('.coverBox').on('swiperight', () => {
    fun.audioPrevAndNext({
      type: "rightSwiper"
    })
  })

  // 播放按钮单击时
  $('.songPlay').click(() => {
    audio.paused ? audio.play() : audio.pause()
  })
  $('audio').on('pause', () => {
    $('.songPlay').children('em').removeClass('fa-pause-circle').addClass('fa-play-circle')
    $('.fixedAudioBox .songPlay').children('em').removeClass('fa-pause-circle').addClass('fa-play-circle')
    $('.coverBox .coverBoxImg').css('animation-play-state', 'paused')
  })
  $('audio').on('play', () => {
    $('.songPlay').children('em').removeClass('fa-play-circle').addClass('fa-pause-circle') // 更改播放图标
    $('.fixedAudioBox .songPlay').children('em').removeClass('fa-play-circle').addClass('fa-pause-circle') // 更改播放图标
    $('.coverBox .coverBoxImg').css('animation-play-state', 'running') // 中间的动画是否旋转
  })

  //当浏览器可以播放时 canplay事件
  audio.load() // 重新加载 防止canplay事件不生效
  $('audio').on('canplay', () => {
    $('.sumTime').html(`${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}`) // 初始化播放时间
  })
  let audioTimer = null // 播放器的定时器

  $('audio').on('play', () => {
    audioTimer = setInterval(() => {
      const curT = audio.currentTime // 当前播放器时间
      const s = Math.floor(curT % 60).toString().length <= 1 ? `0${Math.floor(curT % 60)}` :
        Math.floor(curT % 60)
      $('.curTime').html(`${Math.floor(curT / 60)}:${s}`) // 实时更新播放时间

      const left = $('.audioRange').width() * (curT / audio.duration)
      $('.audioRangeBtn').css('left', `${left}px`) // 实时更新播放进度
      $('.audioRangeLenght').css('width', `${left}px`) //更新跟随进度条的宽度
      $('.fixedAudioBox .audioRang').css('width', `${(left / $(`.audioRange`).width()) * 100}%`) //更新小播放控件的长度
    }, 50)
  })
  $('audio').on('pause', () => {
    clearInterval(audioTimer)
    audioTimer = null
  })


  // 生成一个播放器的进度实例
  const audioRange = new SlideRange({
    rangeNodeStr: '.audioRange',
    rangeBtnNodeStr: '.audioRangeBtn',
    direction: 'x'
  })

  let curT = 0
  window.updateT = 0 //由于fun.js的showAudioData函数需要使用全局的属性 所以才会加到window中
  audioRange.event({
    click(self) {
      const curX = self.startX - $(`${self.rangeNodeStr}`).offset().left // 获取鼠标在元素中的位置
      updateT = (curX / $(`${self.rangeNodeStr}`).width()) * audio.duration // 获取当前的时间秒数
      $(`${self.rangeBtnNodeStr}`).css('left', `${curX}px`) // 进行对应的移动
      const s = Math.floor(updateT % 60).toString().length <= 1 ? `0${Math.floor(updateT % 60)}` :
        Math.floor(updateT % 60)

      $('.curTime').html(`${Math.floor(updateT / 60)}:${s}`) // 更新当前时间文本
      $('.audioRangeLenght').css('width', `${curX}px`) //更新跟随进度条的宽度
      $('.fixedAudioBox .audioRang').css('width', `${(curX / $(`${self.rangeNodeStr}`).width()) * 100}%`) //更新小播放控件的长度
      $('.coverBox .coverBoxImg').css('animation-pl ay-state', 'paused') //使中间的动画停
      $('.songPlay').children('em').removeClass('fa-pause-circle').addClass('fa-play-circle') // 更改播放键的图标
      curT = audio.currentTime //存放跳跃前的播放器时间
      audio.currentTime = updateT // 更新播放器的当前时间
    },
    start(self) {
      $('.audioRangeLenght').css('width', `${self.startX - $(`${self.rangeNodeStr}`).offset().left}px`) //更新跟随进度条的宽度
      $('.songPlay').children('em').removeClass('fa-pause-circle').addClass('fa-play-circle') // 更改播放键的图标
      $('.coverBox .coverBoxImg').css('animation-play-state', 'paused') //使中间的动画停
      audio.pause() //拖动时停止播放
      curT = audio.currentTime //存放跳跃前的播放器时间
    },
    move(self) {
      updateT = (self.left / $(`${self.rangeNodeStr}`).width()) * audio.duration // 获取当前的时间秒数
      const s = Math.floor(updateT % 60).toString().length <= 1 ? `0${Math.floor(updateT % 60)}` :
        Math.floor(updateT % 60)
      $('.curTime').html(`${Math.floor(updateT / 60)}:${s}`) // 更新当前时间文本
      $('.audioRangeLenght').css('width', `${self.left}px`) //更新跟随进度条的宽度
      $('.songPlay').children('em').removeClass('fa-pause-circle').addClass('fa-play-circle') // 更改播放键的图标
      $('.coverBox .coverBoxImg').css('animation-play-state', 'paused') //使中间的动画停
    },
    end(self) {
      //因为大播放控件拖动时 小播放控件是看不到的进度变化的 所以可以放到变化后才改变
      $('.fixedAudioBox .audioRang').css('width', `${(self.left / $(`${self.rangeNodeStr}`).width()) * 100}%`) //更新小播放控件的长度
      audio.currentTime = updateT // 更新播放器的当前时间
    }
  })

  // 生成一个播放器音量的进度实例
  let voiceRange = new SlideRange({
    rangeNodeStr: '.voiceRange',
    rangeBtnNodeStr: '.voiceRangeBtn',
    direction: 'x'
  })
  let curV = 0
  voiceRange.event({
    click(self, e) {
      e.stopPropagation()
      curV = (self.startX - $(`${self.rangeNodeStr}`).offset().left) / $(`${self.rangeNodeStr}`).width()
      $('.voiceRangeLenght').css('width', `${self.startX - $(`${self.rangeNodeStr}`).offset().left}px`) //更新跟随进度条的宽度
      audio.volume = curV
    },
    start(self) {
      $('.voiceRangeLenght').css('width', `${self.startX - $(`${self.rangeNodeStr}`).offset().left}px`) //更新跟随进度条的宽度
      audio.volume = curV
    },
    move(self) {
      curV = self.left / $(`${self.rangeNodeStr}`).width()
      $('.voiceRangeLenght').css('width', `${self.left}px`) //更新跟随进度条的宽度
      audio.volume = curV
    },
  })

  $('audio').on('ended', () => {
    $('.songPlay').children('em').removeClass('fa-pause-circle').addClass('fa-play-circle') //修改图标
    $('.coverBox .coverBoxImg').css('animation-play-state', 'paused') // 暂停动画

    $('.fixedAudioBox .audioRang').css('width', `0%`) //更新小播放控件的长度
    $('.audioRangeLenght').css('width', '0%') //跟踪进度条长度初始化
    $('.audioRangeBtn').css('left', '0%') //进度条按钮初始化
    audio.currentTime = 0 // 当前时间初始化
    $('.curTime').html('0:00') // 当前时间文本初始化

    fun.audioPrevAndNext({
      type: "audioEnded"
    })
  })

  // E audio

  window.sessionStorage.setItem('playType', 'order') // 初始化播放顺序
  //切换播放顺序
  $('.playType a').click(function () {
    const len = $(this).parent().children().length //类型长度
    let index = $(this).index()
    index = ++index === len ? index = 0 : index
    const curNode = $(this).parent().children().eq(index)
    curNode.addClass('curPlayType').siblings().removeClass('curPlayType')
    window.sessionStorage.setItem('playType', curNode.attr('data-type'))
    const dict = {
      'oneLoop': '单曲循环',
      'random': '随机',
      'order': '顺序',
      'loop': '列表循环',
    }
    const type = curNode.attr('data-type')
    fun.pullMessageBox(`${dict[type]} 播放`, 700)
  })

  // S panelEvent
  // 面板事件 控制面板弹出时 显示黑色背景 使面板有层次感
  $('#userPanel').on('panelbeforeopen', () => {
    $('.panelShowBgBox').fadeIn(150)
  })
  $('#userPanel').on('panelbeforeclose', () => {
    $('.panelShowBgBox').fadeOut(150)
  })
  // E panelEvent

  // S aduioTemple
  // $('#index').on('pagebeforeload',()=>{
  // 	window.sessionStorage.setItem('isLoadAduio',false)
  // })
  // 媒体引擎模板显示时 就隐藏全局的小播放组件
  $('#audioTemplate').on('pageshow', (e, ui) => {
    $('.fixedAudioBox,.toggleBtn').fadeOut(150)
    const isLoadAduio = window.sessionStorage.getItem('isLoadAduio')
    if (isLoadAduio === 'true') {
      const songId = window.sessionStorage.getItem('curAduioMusicId')
      send_ajax.getAduioData(songId) //渲染音乐播放器
    }
  })

  // 媒体引擎模板隐藏时 就如果是有媒体 就显示小播放组件
  $('#audioTemplate').on('pagehide', () => {
    if ($('audio').attr('src')) {
      $('.fixedAudioBox,.toggleBtn').fadeIn(150)
    }
    window.sessionStorage.setItem('isLoadAduio', false)
  })
  // E aduioTemple

  // S searchPage
  $(document).on("pageshow", "#searchPage", function () {
    fun.showSearchHistoryData()
  });
  // E searchPage

  $('#searchInput').on('input', function () {
    if ($(this).val().trim() === '') {
      $('.clearInputVal').fadeOut(150)
      $('#searchPageMain .hotSearchTitle').fadeIn(150)
      $('#searchPageMain .hotSearch').fadeIn(150).siblings('ul').empty()
    } else {
      $('.clearInputVal').fadeIn(150)
    }
  })
  $('.clearInputVal').click(function () {
    $('#searchInput').val('') //清空内容
    $('#searchPageMain .hotSearchTitle').fadeIn(150)
    $('#searchPageMain .hotSearch').fadeIn(150).siblings('ul').empty()
    $(this).fadeOut(150) //自身消失
  })

  // S songListTemplate
  $('#songListTemplate').on('pageshow', () => {
    const type = new URLSearchParams(location.search).get('type')
    const info = JSON.parse(window.sessionStorage.getItem('toSongListTemplateInfo'))
    let userId = type === 'createSongList' ? info.userId : $('.userId').html();
    send_ajax.getSongTemplateData({
      userId,
      type,
      songListId: info.songListId,
      sognListName: info.sognListName
    })
  })
  // E songListTemplate

  // 主页显示时
  $('#index').on('pageshow', function () {
    $(`.contentToggleBox>ul`).css('height', `${$(`.contentToggleBox>ul>li`).eq(1).height()}px`) //更新ul的高度为默认第一个li的高度
    send_ajax.getLikeSongListInfo($('.userId').html()) //刷新我喜欢的歌单
    send_ajax.getUserCreateSongListInfo($('.userId').html(), '.songListBox') //刷新我创建的歌单
  })

  // 监听页面滚动 变换标题色
  $('#index').on('scroll', function (e) {
    if ($(this).scrollTop() >= 5) {
      $('#indexHeader').addClass('bg')
    } else {
      $('#indexHeader').removeClass('bg')
    }
  })

  // 给小播放控件增加跳转到播放器控件的功能
  $('.fixedAudioBox').click(() => {
    $.mobile.changePage('#audioTemplate')
  })
  // 给小播放控件增加跳转到播放器控件的功能
  $('#userPanel .userImg').click(() => {
    $.mobile.changePage('#userInfoTemplate')
  })

  // 给用户模板跳转到用户编辑的功能
  $('.userEdit').click(() => {
    $.mobile.changePage('#userEditPage')
  })

  // 清除某些按钮的冒泡
  $(
    '.fixedAudioBox .songPlay,.fixedAudioBox .songList,.listSongClose,.fixedSongList,.createSongListBtn,.fixedCreateSongList,.fixedShowCreateSongList li,.removeCreateSongList,.fixedShare li a'
  ).click((e) => {
    e.stopPropagation()
  })

  // S 隐藏和显示播放小控件
  let tooggleBtnFalg = true // 切换按钮的节流阀
  $('.toggleBtn').click(function () {
    if (tooggleBtnFalg) {
      tooggleBtnFalg = false
      if ($('.fixedAudioBox').attr('data-flag') === 'true') {
        //让动画的延时和小播放控件的延时同步
        $('.toggleBtn').children('em').css('transform', 'rotate(180deg)')
        $('.fixedAudioBox').animate({
          'left': `-${$('.fixedAudioBox').width()}px`,
          'opacity': 0
        }, 300, () => {
          $('.fixedAudioBox').attr('data-flag', 'false')
          tooggleBtnFalg = true
        })
      } else {
        $('.toggleBtn').children('em').css('transform', 'rotate(0deg)')
        $('.fixedAudioBox').animate({
          'left': `0px`,
          'opacity': 1
        }, 300, () => {
          $('.fixedAudioBox').attr('data-flag', 'true')
          tooggleBtnFalg = true
        })
      }
    }
  })
  // E 隐藏和显示播放小控件

  // S 全局歌曲列表单击
  $('.fixedSongListBox').click(() => {
    $('.fixedSongListBox').fadeOut(150)
  })
  $('.controlTool .songList,.fixedAudioBox .songList').click(() => {
    $('.fixedSongListBox').fadeIn(150)
  })
  // E 全局歌曲列表单击

  // S 全局创建歌单单击
  $('.fixedCreateSongListBox').click(() => {
    $('.fixedCreateSongListBox').fadeOut(150)
  })
  $('.addSongListBtn').click(() => {
    $('.fixedCreateSongListBox').fadeIn(150)
  })
  // E 全局创建歌单单击

  // S 全局歌曲设置
  $('.fixedSongSettingsBox').click(() => {
    $('.fixedSongSettingsBox').fadeOut(150)
  })
  $('.songSettings').click(() => {
    $('.fixedSongSettingsBox').fadeIn(150)
  })
  // E 全局歌曲设置

  // S 全局分享界面
  $('.fixedShareBox').click(() => {
    $('.fixedShareBox').fadeOut(150)
  })
  $('.songListTemplateShare,.audioTemplateShare').click(() => {
    $('.fixedShareBox').fadeIn(150)
  })
  // E 全局分享界面

  // S 全局视频播放器设置
  $('.fiexdBox').click(function () {
    $(this).fadeOut(150)
    $('video')[0].pause()
  })
  $('.videoCover').click(function () {
    $('.fiexdBox').fadeIn(150)
    const videoSrc = $(this).siblings('.videoSrc').html()
    $('video').attr('src', videoSrc)
  })
  // E 全局视频播放器设置

  // S 添加到歌单显示
  $('.fixedShowCreateSongListBox').click(() => {
    $('.fixedShowCreateSongListBox').fadeOut(150)
  })
  // 添加歌曲到创建歌单按钮单击时
  $('.addToCreateSongList').click(() => {
    $('.fixedShowCreateSongListBox').fadeIn(150)
    send_ajax.getUserCreateSongListInfo($('.userId').html(), '.fixedShowCreateSongList ul') //获取用户创建歌单信息
  })
  // E 添加到歌单显示

  //按钮li就等于单击了file的input
  $('.updateUserAvatar').click(() => {
    window.sessionStorage.setItem('uploadImgType', 'avatar')
    $('#searchInput').click()
  })
  //按钮li就等于单击了file的input
  $('.userUpdateCover').click(() => {
    window.sessionStorage.setItem('uploadImgType', 'cover')
    $('#fileInput').click()
  })

  // S 搜索框内容发生变化
  $('#fileInput').on('change', () => {
    $('#fileForm').submit() // 文本框变化就自动提交
  })
  // E 搜索框内容发生变化

})
