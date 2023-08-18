/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flow.admin.service;

import java.util.List;

import org.flowable.task.api.Task;

import net.jeebiz.cloud.api.service.IBaseService;
import net.jeebiz.flow.admin.dao.entities.DemoModel;

public interface IDemoService extends IBaseService<DemoModel>{

	public void startProcess();
	public List<Task> getTasks(String assignee);
}
