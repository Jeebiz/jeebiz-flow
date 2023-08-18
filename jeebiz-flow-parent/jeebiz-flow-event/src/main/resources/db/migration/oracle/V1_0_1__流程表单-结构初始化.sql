
-- ----------------------------
-- Create table 
-- ----------------------------
create table ACT_FORMS(
  	FM_ID      	VARCHAR2(32) default sys_guid() not null,  
  	FM_USERID		VARCHAR2(32) not null,  
  	FM_TYPE   	VARCHAR2(10) not null, 
  	FM_TITLE		VARCHAR2(200) not null,
  	FM_DETAIL		CLOB not null,
  	FM_STATUS		CHAR(1) default '1' not null,
  	TIME24			VARCHAR2(34) default to_char(sysdate,'yyyy-mm-dd hh24:mi:ss'),	
  	CONSTRAINT ACT_FORMS_PK PRIMARY KEY(FM_ID)
);
-- Add comments to the table 
comment on table ACT_FORMS is '流程表单信息表';
-- Add comments to the columns 
comment on column ACT_FORMS.FM_ID is '流程表单ID编号';
comment on column ACT_FORMS.FM_USERID  is '流程表单创建人ID';
comment on column ACT_FORMS.FM_TYPE  is '流程表单类型：（1：通知、2：私信）';
comment on column ACT_FORMS.FM_TITLE  is '流程表单标题';
comment on column ACT_FORMS.FM_DETAIL  is '流程表单内容';
comment on column ACT_FORMS.FM_STATUS  is '参数状态:（0:不可用|1：可用）';
comment on column ACT_FORMS.TIME24  is '表单创建时间，格式：yyyy-mm-dd hh:mm:ss';


-- ----------------------------
-- Create table 
-- ----------------------------
create table ACT_FORM_DISPLAY(
  	FM_ID      	VARCHAR2(32) default sys_guid() not null,  
  	FM_USERID		VARCHAR2(32) not null,  
  	FM_TYPE   	VARCHAR2(10) not null, 
  	FM_TITLE		VARCHAR2(200) not null,
  	FM_DETAIL		CLOB not null,
  	FM_STATUS		CHAR(1) default '1' not null,
  	TIME24			VARCHAR2(34) default to_char(sysdate,'yyyy-mm-dd hh24:mi:ss'),	
  	CONSTRAINT ACT_FORMS_PK PRIMARY KEY(FM_ID)
);
-- Add comments to the table 
comment on table ACT_FORM_DISPLAY is '流程表单信息表';
-- Add comments to the columns 
comment on column ACT_FORM_DISPLAY.FM_ID is '流程表单ID编号';
comment on column ACT_FORM_DISPLAY.FM_USERID  is '流程表单创建人ID';
comment on column ACT_FORM_DISPLAY.FM_TYPE  is '流程表单类型：（1：通知、2：私信）';
comment on column ACT_FORM_DISPLAY.FM_TITLE  is '流程表单标题';
comment on column ACT_FORM_DISPLAY.FM_DETAIL  is '流程表单内容';
comment on column ACT_FORM_DISPLAY.FM_STATUS  is '参数状态:（0:不可用|1：可用）';
comment on column ACT_FORM_DISPLAY.TIME24  is '表单创建时间，格式：yyyy-mm-dd hh:mm:ss';
