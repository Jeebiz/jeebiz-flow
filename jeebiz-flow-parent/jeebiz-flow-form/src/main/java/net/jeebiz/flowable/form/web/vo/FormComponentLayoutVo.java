/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flowable.form.web.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "FormComponentLayoutVo", description = "xxx数据传输对象")
public class FormComponentLayoutVo {

	@ApiModelProperty(value = "Margin Top", required = true)
	private String marginTop = "0px";
	
	@ApiModelProperty(value = "Margin Right", required = true)
	private String marginRight = "0px";
	   
	@ApiModelProperty(value = "Margin Bottom", required = true)
	private String marginBottom = "0px";
	
	@ApiModelProperty(value = "Margin Left", required = true)
	private String marginLeft = "0px";
	
	
}
