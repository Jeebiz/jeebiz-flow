/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flowable.form.web.vo;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "FormComponentVo", description = "xxx数据传输对象")
public class FormComponentConditionalVo {

	@ApiModelProperty(value = "This component should Display:", required = true)
	private boolean display;
	
	@ApiModelProperty(value = "When the form component:", required = true)
	@NotBlank(message = "名称必填")
	private String name;
	
	@ApiModelProperty(value = "Has the value:", required = true)
	@NotBlank(message = "描述必填")
	private String text;
	 
	private String expression;
}
