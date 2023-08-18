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
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ApiModel(value = "FormComponentVo", description = "xxx数据传输对象")
@Setter
@Getter
@ToString
public class FormComponentApiVo {

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
 

}
