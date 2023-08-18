package net.jeebiz.flowable.form.web.vo;

import io.swagger.annotations.ApiModelProperty;

public class FormButtonComponentVo {

	@ApiModelProperty(value = "按钮名称", required = true)
	private String label;
	/**
	 * Submit
	 * Event
	 * Reset
	 * Bottom
	 * Post to URL
	 */
	@ApiModelProperty(value = "按钮动作", required = true)
	private String action;
	
	@ApiModelProperty(value = "按钮事件", required = true)
	private String event;
	
	@ApiModelProperty(value = "提交URL", required = true)
	private String url;
	
	@ApiModelProperty(value = "按钮风格", required = true)
	private String theme;
	
	@ApiModelProperty(value = "按钮大小", required = true)
	private String size;
	
	@ApiModelProperty(value = "按钮图标", required = true)
	private String icon;
	
	@ApiModelProperty(value = "按钮提示", required = true)
	private String tooltip;
	
	private boolean block;
	private boolean initialFocus;
	
	/**
	 * Allow multiple masks
	 */
	private boolean multipleMasks;
	
	private String prefix;
	private String suffix;
	private String css;
}
