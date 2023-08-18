/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flowable.form.dao;

import org.apache.ibatis.annotations.Mapper;

import net.jeebiz.cloud.api.dao.BaseDao;
import net.jeebiz.flowable.form.dao.entities.DemoModel;

@Mapper
public interface IDemoDao extends BaseDao<DemoModel>{

	
}