/**
 */
package net.jeebiz.flowable.form.web.mvc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import net.formio.FormData;
import net.formio.FormMapping;
import net.formio.Forms;
import net.formio.validation.ValidationResult;
import net.jeebiz.cloud.api.annotation.BusinessLog;
import net.jeebiz.cloud.api.annotation.BusinessType;
import net.jeebiz.cloud.api.utils.StringUtils;
import net.jeebiz.cloud.api.webmvc.BaseApiController;
import net.jeebiz.cloud.api.webmvc.Result;
import net.jeebiz.flowable.form.dao.entities.DemoModel;
import net.jeebiz.flowable.form.service.IDemoService;
import net.jeebiz.flowable.form.setup.data.LogConstant;
import net.jeebiz.flowable.form.web.vo.FormVo;
import net.jeebiz.flowable.form.web.vo.Person;

@Controller
@RequestMapping("demo/")
@SuppressWarnings("unchecked")
public class DemoController extends BaseApiController{
	
	@Autowired
	private IDemoService demoService;
    
	public void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		  response.setContentType("text/html;charset=UTF-8");
		  
		  FormMapping<Person> personForm = Forms.automatic(Person.class, "person").build();
		  
		  Person person = new Person();
		  person.setFirstName("John");
		  FormData<Person> formData = new FormData<Person>(person, ValidationResult.empty);
		  FormMapping<Person> filledForm = personForm.fill(formData);
		         
		  request.setAttribute("personForm", filledForm);
		  request.getRequestDispatcher("/WEB-INF/jsp/index.jsp").forward(request, response);
		} 
	
	
    @GetMapping(value = "index", produces = "text/html; charset=UTF-8")
	public String index(ModelMap model) {
    	
		//model.addAttribute("xxxList", getDemoService().getxxxList());
		
		return "html/demo/index";
	}

    @ApiOperation(value = "获取xxx列表", notes = "分页查询xxx信息")
	@ApiImplicitParams({ 
		@ApiImplicitParam(name = "pageNo", value = "当前页码", required = true, dataType = "Integer"),
		@ApiImplicitParam(name = "limit", value = "每页记录数", required = true, dataType = "Integer"),
		@ApiImplicitParam(name = "sortName", value = "排序字段名称", required = true, dataType = "String"),
		@ApiImplicitParam(name = "sortOrder", value = "排序类型 asc \\ desc", required = true, dataType = "String"),
		@ApiImplicitParam(name = "FormVo", value = "用户详细实体user", required = true, dataType = "UserVo") 
	})
    @BusinessLog(module = LogConstant.Module.N01, business = LogConstant.BUSINESS.N010001, opt = BusinessType.SELECT)
	@PostMapping(value = "list")
	@ResponseBody
	public Object list( Integer pageNo, Integer limit,
			String sortName, String sortOrder, FormVo FormVo, 
			HttpServletRequest request) throws Exception {
		try {
			
			Page<DemoModel> pageResult = getDemoService().getPagedList(null);
			List<FormVo> retList = new ArrayList<FormVo>();
			for (DemoModel model : pageResult.getRecords()) {
				retList.add(getBeanMapper().map(model, FormVo.class));
			}
			return new Result<FormVo>(pageResult, retList);
		} catch (Exception e) {
			logException(this, e);
			return error("");
		}
	}

	/**
	 * 跳转至新增界面
	 */
	@RequestMapping(value = "to/new-demo", produces = "text/html; charset=UTF-8")
	public String toNewDemo(@RequestBody FormVo FormVo, Model model) throws Exception {
		//model.addAttribute("xxxList", getDemoService().getxxxList());
		return "html/demo/new-demo";
	}

	/**
	 * 增加逻辑实现
	 */
	@ApiOperation(value = "创建xxx信息", notes = "根据FormVo创建xxx", httpMethod = "POST")
	@ApiImplicitParam(name = "FormVo", value = "xxx数据传输对象", required = true, dataType = "FormVo")
	@BusinessLog(module = LogConstant.Module.N01, business = LogConstant.BUSINESS.N010001, opt = BusinessType.INSERT)
	@PostMapping("new/form")
	@ResponseBody
	public Object newDemo(@Valid FormVo FormVo) {
		try {

			DemoModel demoModel = new DemoModel();
			
			//如果自己较少，采用手动设置方式
			demoModel.setName(FormVo.getName());
			//如果自动较多，采用对象拷贝方式；该方式不支持文件对象拷贝
			//PropertyUtils.copyProperties(demoModel, FormVo);

			getDemoService().insert(demoModel);
			return success("I99001");
		} catch (Exception e) {
			logException(this, e);
			return fail("I99002");
		}
	}
	
	
	/**
	 * 跳转至修改界面
	 */
	@RequestMapping(value = "to/edit-demo/{id}", produces = "text/html; charset=UTF-8")
	public String toEditDemo(@PathVariable(value = "id")  String id, HttpServletRequest request, Model model) throws Exception {

		DemoModel rtModel = getDemoService().getModel(id);
		if (rtModel != null) {
			model.addAttribute("rtModel", rtModel);
			//model.addAttribute("xxxList", getDemoService().getxxxList());
		}
		return "html/demo/edit-demo";
	}

	/**
	 * 修改逻辑实现
	 */
	@ApiOperation(value = "修改xxx信息", notes = "修改xxx", httpMethod = "POST")
	@ApiImplicitParam(name = "FormVo", value = "xxx数据传输对象", required = true, dataType = "FormVo")
	@BusinessLog(module = LogConstant.Module.N01, business = LogConstant.BUSINESS.N010001, opt = BusinessType.UPDATE)
	@RequestMapping("edit/form")
	@ResponseBody
	public Object editDemo(@Valid FormVo FormVo) throws Exception {
		try {
			 
			DemoModel demoModel = new DemoModel();
			
			//如果自己较少，采用手动设置方式
			demoModel.setName(FormVo.getName());
			//如果自动较多，采用对象拷贝方式；该方式不支持文件对象拷贝
			//PropertyUtils.copyProperties(demoModel, FormVo);
			
			getDemoService().update(demoModel);
			return success("I99003");
		} catch (Exception e) {
			logException(this, e);
			return fail("I99004");
		}
	}

	/**
	 * 删除逻辑实现
	 */
	@ApiOperation(value = "删除xxx信息", notes = "根据ID删除xxx", httpMethod = "POST")
	@ApiImplicitParam(name = "ids", value = "ID集合，多个使用,拼接", required = true, dataType = "String")
	@BusinessLog(module = LogConstant.Module.N01, business = LogConstant.BUSINESS.N010001, opt = BusinessType.DELETE)
	@PostMapping("delete")
	@ResponseBody
	public Object delete(@RequestParam(value = "ids") String ids, HttpServletRequest request) throws Exception {
		try {
			if (StringUtils.isEmpty(ids)) {
				return fail("I00002");
			}
			List<String> list = CollectionUtils.arrayToList(StringUtils.tokenizeToStringArray(ids));
			/*// 查询要删除的数据对应的依赖
			List<Map<String, String>> dependencies = getDemoService().getDependencies(list);
			// 不为空，则表示有数据在被使用
			if (!CollectionUtils.isEmpty(dependencies)) {
				// 解析依赖关系，组织描述信息
				StringBuilder builder = new StringBuilder("存在未解除的依赖关系：【");
				for (Map<String, String> hashMap : dependencies) {
					builder.append(hashMap.get("字段1")).append(" >> ").append(hashMap.get("字段2"))
							.append(",");
				}
				builder.deleteCharAt(builder.length() - 1);
				builder.append("】,无法删除.");
				return ResultUtils.statusMap(STATUS_FAIL, builder.toString());
			}*/
			// 批量删除数据库配置记录
			getDemoService().batchDelete(list);
			return success("I99005");
		} catch (Exception e) {
			logException(this, e);
			return fail("I99006");
		}
	}
	
	@BusinessLog(module = LogConstant.Module.N01, business = LogConstant.BUSINESS.N010001, opt = BusinessType.SELECT)
	@RequestMapping(value = "to/detail/{id}", produces = "text/html; charset=UTF-8")
	public String detail(@PathVariable(value = "id") String id, HttpServletRequest request, Model model) throws Exception {

		DemoModel rtModel = getDemoService().getModel(id);
		if (rtModel != null) {
			model.addAttribute("rtModel", rtModel);
			//model.addAttribute("xxxList", getDemoService().getxxxList());
		}
		return "html/demo/detail-demo";
	}

	public IDemoService getDemoService() {
		return demoService;
	}

	public void setDemoService(IDemoService demoService) {
		this.demoService = demoService;
	}
	
}
