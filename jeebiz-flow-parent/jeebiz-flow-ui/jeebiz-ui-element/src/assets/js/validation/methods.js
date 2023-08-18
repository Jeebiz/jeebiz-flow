// 接口js
import regexp from "./regexp";

// 注册一个全局自定义指令 `v-roles`
Vue.directive('roles', {
  // 当被绑定的元素插入到 DOM
  inserted: function (el, binding, vNode) {
    el.addEventListener('keyup', function (event) {
		// e.target 是你当前点击的元素
		// e.currentTarget 是你绑定事件的元素
		//#获得点击元素的前一个元素
		el.currentTarget.previousElementSibling.innerHTML
		//#获得点击元素的第一个子元素
		el.currentTarget.firstElementChild
		//# 获得点击元素的下一个元素
		el.currentTarget.nextElementSibling
		//# 获得点击元素中id为string的元素
		el.currentTarget.getElementById("string")
		//# 获得点击元素的string属性
		el.currentTarget.getAttributeNode('string')
		//# 获得点击元素的父级元素
		el.currentTarget.parentElement
		//# 获得点击元素的前一个元素的第一个子元素的HTML值
		el.currentTarget.previousElementSibling.firstElementChild.innerHTML
      	// 首先去除已有样式
      	el.className = el.className.replace('input-error', '').trim()
      	if (!event.keyCode) { // 加上这个判断就是在提交时，才会校验
        	// 判断是否是否必填
        	let isRequired = binding.value.required
        	if (isRequired) {
          	if (!el.value || el.value === '') {
            	el.className += ' input-error'
          	}
        	}

        	// 判断正则
        	let regex = binding.value.regex
        	if (regex === 'IpRegex') {
          	if (!el.value.match(IP_REGEX)) {
            	el.className += ' input-error'
          	}
        } else if (!el.value.match(regex)) {
          el.className += ' input-error'
        }
      }
    })
  }
})

// 注册一个全局自定义指令 `v-submit`
Vue.directive('submit', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vNode) {
    el.addEventListener('click', function (event) {
      let elements = document.getElementsByClassName('v-check')
      var evObj = document.createEvent('Event')
      evObj.initEvent('keyup', true, true)
      for (let element of elements) {
        element.dispatchEvent(evObj)
      }
      let errorInputs = document.getElementsByClassName('input-error');
      if(errorInputs.length === 0){
        vNode.context.submit();
      }
    })
  }
});

function stripHtml(value) {
	// remove html tags and space chars
	return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
	// remove punctuation
	.replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
}

const methods = {

	maxWords : (rule, value, callback) => {
		let telephone = new RegExp(regexp.telephone);
		let mobile_cn = new RegExp(regexp.mobile_cn);
		if(!(telephone.test(value)) (mobile_cn.test(value))){
			callback(new Error('手机号码不正确'))
		}else{
			callback()
		}
	},

	/** 工信部已向三大运营商分配的号码段手机号码/固定电话 综合验证 */
	mobileASGN : (rule, value, callback) => {
		let telephone = new RegExp(regexp.telephone);
		let mobile_cn = new RegExp(regexp.mobile_cn);
		if(!(telephone.test(value)) (mobile_cn.test(value))){
			callback(new Error('手机号码不正确'))
		}else{
			callback()
		}
	},
	
};
export default methods

