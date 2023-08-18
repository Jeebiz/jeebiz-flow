/** 
 * Copyright (C) 2018 Jeebiz (http://jeebiz.net).
 * All Rights Reserved. 
 */
package net.jeebiz.flow.admin.service.impl;

import java.util.List;

import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.jeebiz.cloud.api.service.BaseServiceImpl;
import net.jeebiz.flow.admin.dao.IDemoDao;
import net.jeebiz.flow.admin.dao.entities.DemoModel;
import net.jeebiz.flow.admin.service.IDemoService;

@Service
public class DemoServiceImpl extends BaseServiceImpl<DemoModel, IDemoDao> implements IDemoService {

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;

	@Transactional
	public void startProcess() {
		runtimeService.startProcessInstanceByKey("oneTaskProcess");
	}

	@Transactional
	public List<Task> getTasks(String assignee) {
		return taskService.createTaskQuery().taskAssignee(assignee).list();
	}

}
