/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flowable.form.web.vo;

import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;

import com.github.hiwepy.validation.constraints.StrictMimeTypeCheck;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "FormComponentVo", description = "xxx数据传输对象")
public class FormComponentDataVo {

	@ApiModelProperty(value = "xxID", required = true)
	private String id;
	@ApiModelProperty(value = "xx名称", required = true)
	@NotBlank(message = "名称必填")
	private String name;
	@ApiModelProperty(value = "xx描述", required = true)
	@NotBlank(message = "描述必填")
	private String text;
	@ApiModelProperty(value = "文件")
	@StrictMimeTypeCheck
	private MultipartFile file;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
	}

}
