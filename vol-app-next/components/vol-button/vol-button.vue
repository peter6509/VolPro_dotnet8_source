<template>
	<view class="vol-button" @click.stop>
		<u-button @click="click" :size="size" :shape="shape" :icon="icon" :customStyle="getBoxShadow()">
			<slot></slot>
		</u-button>
		<!-- 	<u-button @click="loginClick" shape="circle" :loading="loading" :loadingText="loading?'登录中..':''"
			:customStyle="{'box-shadow': '3px 3px 8px #5babff80'}" size="large" type="primary" text="登录">
		</u-button> -->
	</view>

</template>

<!-- 
Author:vol
QQ:283591387
Date:2024
-->
<script setup>
	import {
		ref,
		defineProps,
		defineEmits,
		defineExpose,
		computed,
		getCurrentInstance,
		nextTick
	} from 'vue'
	const props = defineProps({
		type: {
			type: String,
			default: ""
		},
		icon: "",
		size: "default",
		shape: {
			type: String,
			default: "circle"
		}
	})
	const emit = defineEmits(['click'])
	const click = () => {
		emit('click')
	}
	const getBoxShadow = () => {
		// console.log('type')
		if (props.type == 'primary') {
			return {
				'border': 'none',
				'color': '#ffff',
				'background-color': '#3c9cff',
				'box-shadow': '3px 3px 8px #5babff80'
			}
		} else if (props.type == 'error') {
			return {
				'border': 'none',
				'background-color': '#f56c6c',
				'color': '#ffff',
				'box-shadow': '3px 3px 8px rgb(255 195 195)'
			}
		} else if (props.type == 'success') {
			return {
				'border': 'none',
				'background-color': '#5ac725',
				'color': '#ffff',
				'box-shadow': '3px 3px 8px #d3f3c4 '
			}
		}
		return {
			'border': '1px solid #faf7f7',
			'background-color': '#ffff',
			'box-shadow': '3px 3px 8px rgb(241 241 241)'
		}
	}
</script>
<style scoped>
	.vol-button {
		width: 100%;
	}
</style>