<template>
	<view class="vol-bg">
		<view class="demo-pd-30">
			<vol-alert type="primary">
				<view>可指定标题显示靠左或靠右显示及标签宽度设置</view>
			</vol-alert>
		</view>
		<vol-form ref="editRef" :formFields="editFormFields" :formOptions="editFormOptions"
			:label-position="labelPosition" :label-width="labelWidth">
		</vol-form>
		<view class="btns">
			<view class="btn">
				<vol-button type="default" @click="clickWidth">标题宽度</vol-button>
			</view>
			<view class="btn">
				<vol-button type="success" @click="clickLeft">标题靠左</vol-button>
			</view>
			<view class="btn">
				<vol-button type="primary" @click="clickRight">标题靠右</vol-button>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref,
		getCurrentInstance,
		defineEmits,
		defineProps,
		watch,
	} from "vue";

	const {
		proxy
	} = getCurrentInstance();

	//发起请求proxy.http.get/post
	//消息提示proxy.$toast()

	const labelWidth = ref(70);

	const clickWidth = () => {
		labelWidth.value = labelWidth.value == 70 ? labelWidth.value = 80 : labelWidth.value = 70;
		proxy.$toast(`标题宽度已设置为：${labelWidth.value}`)
	}

	const labelPosition = ref('left');

	const clickLeft = () => {
		labelPosition.value = 'left'
		proxy.$toast(`标题已靠左显示`)
	}

	const clickRight = () => {
		labelPosition.value = 'right'
		proxy.$toast(`标题已靠右显示`)
	}

	//vol-view组件
	const editRef = ref(null);

	const editFormFields = ref({
		"OrderNo": "P202411200000001",
		"OrderType": "1",
		"TotalPrice": 12000,
		"TotalQty": 9000,
		"OrderDate": '2024-12-20',
		"Customer": '不要问',
		"PayType": "微信支付",
		"PhoneNo": "13888888888",
		"OrderStatus": "2",
		"Address": "北京市海淀区西北旺东路10号",
		"Remark": "还没想好。。。。。。。。"
	});

	const editFormOptions = ref([{
			"title": "订单编号",
			"required": true,
			"field": "OrderNo",
			"disabled": false
		},
		[{
				"key": "订单类型",
				"data": [],
				"title": "订单类型",
				"required": true,
				"field": "OrderType",
				"type": "select"
			},
			{
				"key": "订单状态",
				"data": [],
				"title": "订单状态",
				"required": true,
				"field": "OrderStatus",
				"type": "select"
			}
		],
		[{
				"title": "订单总价",
				"field": "TotalPrice",
				"type": "decimal"
			},
			{
				"title": "订单数量",
				"field": "TotalQty",
				"type": "number"
			}
		],
		[{
			"title": "客户姓名",
			"field": "Customer"
		}, {
			"title": "支付方式",
			"field": "PayType"
		}, ],
		{
			"title": "手机号码",
			"field": "PhoneNo"
		},
		{
			"title": "订单日期",
			"required": true,
			"field": "OrderDate",
			"type": "datetime"
		},
		{
			"type": "group"
		},
		{
			"title": "详细地址",
			"field": "Address"
		},
		{
			"title": "备注说明",
			"field": "Remark"
		}
	]);
	
	//页面加载时可以从后台获取给表单绑定值
	onLoad((options) => {
		//options获取跳转时参数
		//调用接口获取表单的值
		// proxy.http.post("url",{参数},true).then(res=>{
			//const fields=res;
			////表单设置值，注意fields的类型应该是json数组格式：{字段1:值1,字段2:值2}
			//proxy.base.resetForm(editFormFields.value, editFormOptions.value,fields)
		//})
	})
</script>
<style lang="less" scoped>
	.btns {
		margin-top: 20rpx;
	}
</style>
