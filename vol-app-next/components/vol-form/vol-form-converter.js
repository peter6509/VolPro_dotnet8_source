
import common from '@/util/common.js'
const getFormValues = (formFields, formOptions) => {
	//将数组转换成string
	const formValues = {};
	for (const key in formFields) {
		let _val = formFields[key];
		if (Array.isArray(_val)) {
			//上传的图片
			if (formOptions.some(x => {
					return x.field == key && x.type == 'img'
				})) {
				let imgs = _val.filter(c => {
					return c.orginUrl
				});
				imgs = imgs.map(m => {
					return m.orginUrl
				}).join(',');
				formValues[key] = imgs;
			} else {
				formValues[key] = _val.join(',');
			}
		} else {
			formValues[key] = _val
		}
	}
	return formValues;
}
//重置表单
const resetForm = (formFields, formOptions, data) => {
	if (!data) {
		data = {}
	}
	for (const key in formFields) {
		if (data && data.hasOwnProperty(key)) {
			if (formOptions.some(x => {
					return x.field == key && x.type == 'img'
				})) {
				formFields[key] = common.getImg(data[key], common.http)
			} else {
				formFields[key] = data[key];
			}
		} else {
			if (Array.isArray(formFields[key])) {
				formFields[key].splice(0);
				if (formOptions.some(x => {
						return x.field == key && x.range
					})) {
					formFields[key].push(...['', '']);
				}
			} else {
				formFields[key] = null
			}
		}
	}
}
export default {
	getFormValues,
	resetForm
}
