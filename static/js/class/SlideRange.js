;
(function(window) {
	class SlideRange {
		constructor(obj) {
			// settings
			// this.settings.rangeNodeStr 进度条节点字符串
			// this.settings.rangeBtnNodeStr 进度条暗按钮节点字符串
			// this.settings.direction //移动方向
			this.settings = obj
			this.rangeNodeStr = this.settings.rangeNodeStr
			this.rangeBtnNodeStr = this.settings.rangeBtnNodeStr
			this.init()
		}
		init() {
			this.startX = 0 // 开始X坐标
			this.upCurX = 0 //上一个的X坐标
			this.left = 0 // 左边距离 
			this.startY = 0 // 开始Y坐标
			this.upCurY = 0 //上一个的Y坐标
			this.top = 0 // 上边距离 
		}
		touchstartCommon(e, obj) {
			this.startX = e.originalEvent.targetTouches[0].pageX
			this.startY = e.originalEvent.targetTouches[0].pageY
			obj.start && obj.start(this)
		}
		touchMoveCommon(e, obj) {
			if (this.settings.direction === 'x') {
				const curX = e.originalEvent.targetTouches[0].pageX // 获取当前x坐标
				const xMove = this.upCurX === 0 ? curX - this.startX : curX - this.upCurX // 计算移动的距离
				this.left = Number($(`${this.rangeBtnNodeStr}`).css('left').replace('px', '')) // 得到left属性的值
				console.log(this.left)
				//界限判定
				this.left = this.left <= 0 ? 0 : this.left
				this.left = this.left >= $(`${this.rangeNodeStr}`).width() ? $(`${this.rangeNodeStr}`).width() : this.left
				// console.log(`curX:${this.curX} this.upCurX:${this.upCurX} move:${this.move} left:${this.left}`)
				$(`${this.rangeBtnNodeStr}`).css('left', `${this.left + xMove}px`) // 进行对应的移动
				this.upCurX = curX // 保存当前的x坐标
			} else {
				const curY = e.originalEvent.targetTouches[0].pageY // 获取当前x坐标
				const yMove = this.upCurX === 0 ? curY - this.startY : curY - this.upCurX // 计算移动的距离
				this.top = Number($(`${this.rangeBtnNodeStr}`).css('top').replace('px', '')) // 得到top属性的值
				//界限判定
				this.top = this.top <= 0 ? 0 : this.top
				this.top = this.top >= $(`${this.rangeNodeStr}`).height() ? $(`${this.rangeNodeStr}`).height() : this.top
				// console.log(`curX:${this.curX} this.upCurX:${this.upCurX} move:${this.move} left:${this.left}`)
				$(`${this.rangeBtnNodeStr}`).css('top', `${this.top + yMove}px`) // 进行对应的移动
				this.upCurY = curY // 保存当前的y坐标
			}
			obj.move && obj.move(this)
		}
		touchendCommon(e, obj) {
			this.upCurX = 0 // 移动结束后清除上次的x坐标
			this.upCurY = 0 // 移动结束后清除上次的y坐标
			obj.end && obj.end(this)
		}
		event(obj = {}) {
			// rangeBtn event
			$(`${this.rangeBtnNodeStr}`).on('touchstart', e => {
				this.touchstartCommon(e, obj)
			})
			$(`${this.rangeBtnNodeStr}`).on('touchmove', e => {
				this.touchMoveCommon(e, obj)
			})
			$(`${this.rangeBtnNodeStr}`).on('touchend', e => {
				this.touchendCommon(e, obj)
			})

			// click event
			$(`${this.rangeNodeStr}`).click(e => {
				e.preventDefault()
				obj.click && obj.click(this,e)
			})

			// range event
			$(`${this.rangeNodeStr}`).on('touchstart', e => {
				this.touchstartCommon(e, obj)
				if(this.settings.direction === 'x'){
					$(`${this.rangeBtnNodeStr}`).css('left', `${this.startX - $(`${this.rangeNodeStr}`).offset().left}px`) // 进行对应的移动
				}else{
					$(`${this.rangeBtnNodeStr}`).css('top', `${this.startY - $(`${this.rangeNodeStr}`).offset().top}px`) // 进行对应的移动
				}
			})
			$(`${this.rangeNodeStr}`).on('touchmove', e => {
				this.touchMoveCommon(e, obj)
			})
			$(`${this.rangeNodeStr}`).on('touchend', e => {
				this.touchendCommon(e, obj)
			})
		}
	}
	window.SlideRange = SlideRange
})(window);
