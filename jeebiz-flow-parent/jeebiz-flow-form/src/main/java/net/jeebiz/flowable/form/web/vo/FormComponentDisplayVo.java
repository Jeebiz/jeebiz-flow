/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flowable.form.web.vo;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "FormComponentDisplayVo", description = "xxx数据传输对象")
public class FormComponentDisplayVo {

	@ApiModelProperty(value = "标签名称", required = true)
	private String label;
	@ApiModelProperty(value = "是否隐藏标签名称", required = true)
	private boolean hiddenLabel;
	/**
	 * 标签位置
	 * Top
	 * Left (Left-aligned)
	 * Left (Right-aligned)
	 * Right (Left-aligned)
	 * Right (Right-aligned)
	 * Bottom
	 */
	@ApiModelProperty(value = "标签位置", required = true)
	private String labelPosition;
	
	@ApiModelProperty(value = "占位符", required = true)
	@NotBlank(message = "占位符必填")
	private String placeholder;
	
	@ApiModelProperty(value = "字段描述", required = true)
	@NotBlank(message = "描述必填")
	private String description;
	
	@ApiModelProperty(value = "字段描述", required = true)
	@NotBlank(message = "描述必填")
	private String tooltip;
	
	private String errorLabel;
	private String inputMask;
	
	/**
	 * Allow multiple masks
	 */
	private boolean multipleMasks;
	
	private String prefix;
	private String suffix;
	private String css;
	
}

