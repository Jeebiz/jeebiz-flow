/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flowable.form.web.vo;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * https://gitee.com/yyalon/angular-formio
 *
 */
@ApiModel(value = "FormVo", description = "表单数据传输对象")
@Setter
@Getter
@ToString
public class FormVo {

	@ApiModelProperty(value = "xxID", required = true)
	private String id;
	@ApiModelProperty(value = "xx名称", required = true)
	@NotBlank(message = "名称必填")
	private String name;
	@ApiModelProperty(value = "xx描述", required = true)
	@NotBlank(message = "描述必填")
	private String text;
	
	@ApiModelProperty(value = "显示")
	private FormComponentDisplayVo display;
	@ApiModelProperty(value = "数据")
	private FormComponentDataVo data;
	@ApiModelProperty(value = "验证")
	private FormComponentValidationVo validation;
	@ApiModelProperty(value = "接口")
	private FormComponentApiVo api;
	@ApiModelProperty(value = "布局")
	private FormComponentLayoutVo layout;
	@ApiModelProperty(value = "条件")
	private FormComponentConditionalVo conditional;

}
