;(function(window){
	class FoldUl{
		constructor(obj) {
			// settings
			// this.settings.btnNodeId 是控制按钮的id
			// this.settings.toggleIconNodeStr 切换图标的节点字符串
			// this.settings.animationTime 动画时间
		    this.settings = obj
			this.init()
		}
		init(){
			const foldNode = $(`*[data-foldId=${this.settings.btnNodeId}]`) // 获取隐藏的节点
			const that = this // 存储当前this
			this.foldFlag = false
			$(`#${this.settings.btnNodeId}`).on('click',function(e){
				e.cancelBubble = true
				e.stopPropagation()
				if(that.foldFlag){
					foldNode.slideDown(that.settings.animationTime)
					$(`${that.settings.toggleIconNodeStr}`).removeClass('foldIconHide')
					that.foldFlag = false
				}else{
					foldNode.slideUp(that.settings.animationTime)
					$(`${that.settings.toggleIconNodeStr}`).addClass('foldIconHide')
					that.foldFlag = true
				}
			})
		}
	}
	window.FoldUl = FoldUl
})(window);