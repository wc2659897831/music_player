;
(function(window) {
	class ToolBox {
		constructor(obj) {
			// settigns
			// this.settings.nodeStr 节点字符串
			// this.settings.selectOne 是否选中第一个(有时候在无缝轮播图中使用这个类 会找到两组的值) 默认为false
			this.settings = obj
			this.nodeStr = this.settings.nodeStr
			this.init()
		}
		init() {
			this.clientWidth = $(window).width() // 屏幕宽度
			this.updateUlWidth() // 更新ul的宽度
			this.touchMove() // 移动事件
		}
		updateUlWidth() {
			const liWidth = $(`${this.nodeStr}>ul>li:first-child`).width() // 获取单个li的宽度
			const liCount = this.settings.selectOne ? $(`${this.nodeStr}>ul>li`).length / 2 : $(`${this.nodeStr}>ul>li`).length // 查看配置文件是否只查找第一组的组的值
			$(`${this.nodeStr}>ul`).css('width', `${liWidth * liCount}px`) // 重设ul的宽度
		}
		touchMove() {
			const that = this
			let startX = 0 // 初始x的位置
			$(`${this.nodeStr}>ul`).on('touchstart', (e) => {
				startX = e.originalEvent.targetTouches[0].pageX
			})
			let upCurX = 0 // 上一次的x坐标
			let left = 0 // 元素定位left属性的值
			let tooltipLeft = 0 // tooltip元素定位的left属性的值
			$(`${this.nodeStr}>ul`).on('touchmove', function(e) {
				e.stopPropagation() //防止冒泡
				const curX = e.originalEvent.targetTouches[0].pageX // 获取当前x坐标
				let move = upCurX === 0 ? curX - startX : curX - upCurX // 计算移动的距离
				left = Number($(this).css('left').replace('px', '')) // 得到left属性的值

				// console.log(`curX:${curX} upCurX:${upCurX} move:${move} left:${left}`)
				$(this).css('left', `${left + move}px`) // 进行对应的移动

				upCurX = curX // 保存当前的x坐标
			})
			$(`${this.nodeStr}>ul`).on('touchend', function(e) {
				upCurX = 0 // 移动结束后清除上次的x坐标
				const maxMove = $(this).width() - that.clientWidth // 获取最大的移动距离
				// 界限判定
				if (left > 0) {
					$(this).animate({
						'left': `0px`
					}, 200)
				} else if (left < -maxMove) {
					$(this).animate({
						'left': `-${maxMove}px`
					}, 200)
				}
			})
		}
	}
	window.ToolBox = ToolBox
})(window);
