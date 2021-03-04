;(function() {
	class Lunbo {
		constructor(settings) {
			// settings
			// this.settings.node 节点名称 css查找规则
			// this.settings.isNotAutoLunbo 是否不自动轮播 默认 false
			// this.settings.isNotShowOl 是否不显示ol false
			// this.settings.autoLunboDelay 自动轮播间隔 默认3000
			// this.settings.olNode 自己指定ol节点 否则就自动生成
			this.settings = settings
			this.boxNodeStr = this.settings.nodeStr //节点字符串
			this.Node = $(this.boxNodeStr) //jq节点
			this.clientWidth = $('body').width() // 获取当前屏幕宽度
			this.curIndex = 1 //当前索引
			this.olNodeStr = '' //ol节点字符串
			this.timeoutTimer = this.autoLunboTimer = null // 延时器 自动轮播的timer
			this.flag = true // 节流阀
			this.init() //初始化
		}
		init() {
			this.clientResize() // 宽度变化时
			this.copyNode() //节点复制
			this.init_li() // li初始化
			this.init_ol() // 初始化ol
			this.swipeleft() //左滑动
			this.swiperight() // 右滑动
			this.timer = !this.settings.isNotAutoLunbo ? this.autoLunbo() : null // 根据配置是否需要自动轮播
			this.olClick() //ol单击事件
		}
		clientResize() {
			// 当屏幕宽度发生改变时 重新刷新轮播图的大小
			$(window).resize(() => {
				this.clientWidth = $('body').width()
				history.go(0)
			})
		}
		copyNode() {
			//复制前后节点
			const liFirstNode = $(`${this.boxNodeStr}>ul>li:first-child`).clone()
			const liLastNode = $(`${this.boxNodeStr}>ul>li:last-child`).clone()
			liFirstNode.appendTo($(`${this.boxNodeStr}>ul`))
			liLastNode.prependTo($(`${this.boxNodeStr}>ul`))
		}
		init_li() {
			this.ul_liCount = $(`${this.boxNodeStr}>ul>li`).length // ul的li数量
			//初始的定位是第一个张图
			$(`${this.boxNodeStr}>ul`).css({
				'left': `-${this.clientWidth}px`,
				'width': this.ul_liCount * this.clientWidth
			})

			// 设置li的宽度为当前屏幕宽度
			$(`${this.boxNodeStr}>ul>li`).css('width', `${this.clientWidth}px`)
		}
		init_ol() {
			const olNodeStr = this.settings.olNodeStr
			if(!olNodeStr){
				// 生成ol节点
				$(`${this.boxNodeStr}`).append('<ol></ol>')
				// 遍历ul的li数量 生成对应ol的li数量
				for (let i = 1; i <= this.ul_liCount - 2; i++) {
					$(`${this.boxNodeStr} ol`).append($('<li></li>'))
				}
				// 默认第一个添加类
				$(`${this.boxNodeStr} ol>li:first-child`).addClass('curLi')
				this.olNodeStr = `${this.boxNodeStr} ol`
				// 是否不显示ol
				if (this.settings.isNotShowOl) {
					$(`${this.boxNodeStr} ol`).css('display', 'none')
				}
			}else{
				this.olNodeStr = this.settings.olNodeStr
			}
			
		}
		olClick(){
			const that = this // 保存当前实例对象
			$(`${this.olNodeStr}>li`).on('click',function(){
				if(that.flag){
					that.flag = false
					const curIndex = $(this).index() + 1// ol的li索引
					const move = (curIndex - that.curIndex) * that.clientWidth //计算移动距离
					$(this).addClass('curLi').siblings().removeClass('curLi')
					//更新ul的高度
					$(`${that.boxNodeStr}>ul`).css('height',`${$(`${that.boxNodeStr}>ul>li`).eq(curIndex).height()}px`)
					$(`${that.boxNodeStr}>ul`).animate({
						left: `-=${move}px`
					}, 500,()=>{
						that.flag = true
						that.curIndex = curIndex
					})
				}
			})
		}
		swipeleft() {
			// 向左滑动
			this.Node.on('swipeleft', (e) => {
				e.stopPropagation()
				if (this.flag) {
					this.flag = false
					clearInterval(this.timer) // 清除自动轮播的tiemr
					clearTimeout(this.timeoutTimer) // 清除上次延迟的timer
					$(`${this.boxNodeStr}>ul`).animate({
						left: `-=${this.clientWidth}px`
					}, 500, () => {
						this.flag = true
						this.curIndex = this.curIndex + 1
						//更新ul的高度
						$(`${this.boxNodeStr}>ul`).css('height',`${$(`${this.boxNodeStr}>ul>li`).eq(this.curIndex).height()}px`)
						if (this.curIndex >= this.ul_liCount - 1) {
							$(`${this.boxNodeStr}>ul`).css('left', `-${this.clientWidth}px`)
							$(`${this.olNodeStr}>li`).eq(0).addClass('curLi').siblings().removeClass('curLi')
							this.curIndex = 1
						} else {
							$(`${this.olNodeStr}>li`).eq(this.curIndex - 1).addClass('curLi').siblings().removeClass('curLi')
						}
						if (this.settings.isAutoLunbo) {
							// 延时
							this.timeoutTimer = setTimeout(() => {
								this.timer = this.autoLunbo()
							}, 3000)
						}
					})
				}
			})
		}
		swiperight() {
			// 向右滑动
			this.Node.on('swiperight', (e) => {
				e.stopPropagation()
				if (this.flag) {
					this.flag = false
					clearInterval(this.timer) // 清除自动轮播的tiemr
					clearTimeout(this.timeoutTimer) // 清除上次延迟的timer
					$(`${this.boxNodeStr}>ul`).animate({
						left: `+=${this.clientWidth}px`
					}, 500, () => {
						this.flag = true
						this.curIndex = this.curIndex - 1
						//更新ul的高度
						$(`${this.boxNodeStr}>ul`).css('height',`${$(`${this.boxNodeStr}>ul>li`).eq(this.curIndex).height()}px`)
						$(`${this.olNodeStr}>li`).eq(this.curIndex - 1).addClass('curLi').siblings().removeClass('curLi')
						if (this.curIndex <= 0) {
							const curNodeLeft = (this.ul_liCount - 2) * this.clientWidth
							$(`${this.boxNodeStr}>ul`).css('left', `-${curNodeLeft}px`)
							this.curIndex = this.ul_liCount - 2
						}
						if (this.settings.isAutoLunbo) {
							// 延时
							this.timeoutTimer = setTimeout(() => {
								this.timer = this.autoLunbo()
							}, 3000)
						}
					})
				}
			})
		}
		autoLunbo() {
			return setInterval(() => {
				$(`${this.boxNodeStr}>ul`).animate({
					left: `-=${this.clientWidth}px`
				}, 500, () => {
					this.curIndex = this.curIndex + 1
					if (this.curIndex >= this.ul_liCount - 1) {
						$(`${this.boxNodeStr}>ul`).css('left', `-${this.clientWidth}px`)
						$(`${this.olNodeStr}>li`).eq(0).addClass('curLi').siblings().removeClass('curLi')
						this.curIndex = 1
					} else {
						$(`${this.olNodeStr}>li`).eq(this.curIndex - 1).addClass('curLi').siblings().removeClass('curLi')
					}
				})
			}, this.settings.autoLunboDelay || 3000)
		}
	}
	window.Lunbo = Lunbo
})(window);
