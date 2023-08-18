package net.jeebiz.flowable.modeler;

import com.alibaba.fastjson.JSON;
import org.flowable.bpmn.model.BpmnModel;
import org.flowable.engine.FormService;
import org.flowable.engine.HistoryService;
import org.flowable.engine.ProcessEngineConfiguration;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.form.StartFormData;
import org.flowable.engine.history.HistoricDetail;
import org.flowable.engine.history.HistoricProcessInstance;
import org.flowable.engine.repository.Deployment;
import org.flowable.engine.runtime.Execution;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.engine.task.Comment;
import org.flowable.form.api.FormInfo;
import org.flowable.image.ProcessDiagramGenerator;
import org.flowable.task.api.Task;
import org.flowable.task.api.history.HistoricTaskInstance;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FlowableModelerApplicationTests {

	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private TaskService taskService;
	@Autowired
	private RepositoryService repositoryService;
	@Autowired
	private ProcessEngineConfiguration processEngineConfiguration;
	@Autowired
	private FormService formService;
	@Autowired
	private HistoryService historyService;

	@Test
	public void test() {
		System.err.println("hello test");
	}

	/**
	 * 部署流程
	 * 
	 * @throws Exception
	 */
	@Test
	public void deploy() throws Exception {
		File file = new File("E:\\请假申请.bpmn20.xml");
		InputStream is = new FileInputStream(file);
		Deployment deploy = repositoryService.createDeployment().addInputStream("请假申请.bpmn20.xml", is).name("请假申请")
				.deploy();
		String id = deploy.getId();
		System.err.println("id:" + id);
	}

	/**
	 * 启动流程实例
	 */
	@Test
	public void statProcessInstance() {
		ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("leave_model");
		System.out.println("processInstanceId:" + processInstance.getId());
	}

	/**
	 * 查询任务
	 */
	@Test
	public void selectTask() {
		System.err.println("=============流程实例id==================");
		String processInstanceId = "e1fb9aaf-3e4c-11e9-9266-7c76352b2cea";
		List<Task> list = taskService.createTaskQuery().processInstanceId(processInstanceId).list();
		for (Task task : list) {
			System.err.println("taskId:" + task.getId());
			System.err.println("assignee:" + task.getAssignee());
		}
		System.err.println("===============审批人================");
		List<Task> tasks = taskService.createTaskQuery().taskAssignee("jingli").list();
		for (Task task : tasks) {
			System.err.println("taskId:" + task.getId());
			System.err.println("taskName:" + task.getName());
		}
		System.err.println("===============历史任务================");
		List<HistoricTaskInstance> hisTasks = historyService.createHistoricTaskInstanceQuery()
				.processInstanceId(processInstanceId).list();
		for (HistoricTaskInstance hisTask : hisTasks) {
			System.err.println(hisTask.getId());
		}
		System.err.println();
	}

	/**
	 * 设置任务审批人
	 */
	@Test
	public void setTaskAssignee() {
		String taskId = "7b6178d5-3e4d-11e9-b2e4-7c76352b2cea";
		// 没有设置审批人的情况下
//        taskService.claim(taskId, "jingli");
		// 设计过审批人的情况下
		taskService.setAssignee(taskId, "jingli");
	}

	/**
	 * 查询任务的表单数据
	 */
	@Test
	public void selectForm() {
		String taskId = "e201b535-3e4c-11e9-9266-7c76352b2cea";
		FormInfo taskFormModel = taskService.getTaskFormModel(taskId);
		System.err.println(JSON.toJSONString(taskFormModel));

	}

	/**
	 * 提交带表单的任务
	 */
	@Test
	public void completeTaskWithForm() {
		String taskId = "e201b535-3e4c-11e9-9266-7c76352b2cea";
		String formDefinitionId = "ed8fcdf8-3e49-11e9-8148-02333fd48295";
		Map<String, Object> formProperties = new HashMap<>();
		formProperties.put("days", 3);
		formProperties.put("reason", "请假原因");
		taskService.completeTaskWithForm(taskId, formDefinitionId, "leave_form", formProperties);
		System.out.println("success");
	}

	/**
	 * 导出运行中的流程图
	 * 
	 * @throws Exception
	 */
	@Test
	public void genProcessDiagram() throws Exception {
		String processId = "4f6e88cb-3b05-11e9-a45e-7c76352b2cea";
		ProcessInstance pi = runtimeService.createProcessInstanceQuery().processInstanceId(processId).singleResult();

		// 流程走完的不显示图
		if (pi == null) {
			return;
		}
		Task task = taskService.createTaskQuery().processInstanceId(pi.getId()).singleResult();
		// 使用流程实例ID，查询正在执行的执行对象表，返回流程实例对象
		String InstanceId = task.getProcessInstanceId();
		List<Execution> executions = runtimeService.createExecutionQuery().processInstanceId(InstanceId).list();

		// 得到正在执行的Activity的Id
		List<String> activityIds = new ArrayList<>();
		List<String> flows = new ArrayList<>();
		for (Execution exe : executions) {
			List<String> ids = runtimeService.getActiveActivityIds(exe.getId());
			activityIds.addAll(ids);
		}

		// 获取流程图
		BpmnModel bpmnModel = repositoryService.getBpmnModel(pi.getProcessDefinitionId());
		ProcessDiagramGenerator diagramGenerator = processEngineConfiguration.getProcessDiagramGenerator();
		String font = "宋体";
		InputStream in = diagramGenerator.generateDiagram(bpmnModel, "png", activityIds, flows, font, font, font,
				processEngineConfiguration.getClassLoader(), 1.0, false);
		OutputStream out = null;
		byte[] buf = new byte[1024];
		int legth = 0;
		try {
			out = new FileOutputStream("E:\\testBpm.png");
			while ((legth = in.read(buf)) != -1) {
				out.write(buf, 0, legth);
			}
		} finally {
			if (in != null) {
				in.close();
			}
			if (out != null) {
				out.close();
			}
		}
	}

}
