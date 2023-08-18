/* ============================================================== */
/* 基础框架 - API                                                  */
/* ============================================================== */
import request from './request'

export default {

  // 登录
  login (data) { return request('/api/jeebiz-authz/authz/login/jwt', data) },
  // 单点登录
  ssoLogin (data) { return request('/api/jeebiz-authz/authz/login/pac4j', data) },
  // 获取二维码
  qrcodeInfo (data) { return request('/api/jeebiz-authz/authz/qrcode/info', data, 'get') },
  // 获取登录信息
  qrcodeBind (data) { return request('/api/jeebiz-authz/authz/qrcode/bind', data, 'get') },
  // 修改密码
  resetPassword (data) { return request('/api/jeebiz-authz/authz/user/reset/pwd', data, 'get') },

  /** **************************文件服务************************** */

  fileUpload (data) { return request('/api/jeebiz-filestore/file/store/upload', data) },
  uploadFile (data) { return request('/api/jeebiz-filestore/file/store/single', data) },
  uploadFiles (data) { return request('/api/jeebiz-filestore/file/store/upload', data) },
  reuploadFile (data) { return request('/api/jeebiz-filestore/file/store/reupload', data) },
  deleteFiles (data) { return request('/api/jeebiz-filestore/file/store/delete', data) },
  deleteFileByPath (data) { return request('/api/jeebiz-filestore/file/store/deleteByPath', data) },
  deleteFileByUuid (data) { return request('/api/jeebiz-filestore/file/store/deleteByUuid', data) },
  getFilesByPath (data) { return request('/api/jeebiz-filestore/file/store/deleteByUuid', data) },
  getFilesByUuid (data) { return request('/api/jeebiz-filestore/file/store/listByUuid', data) },

  /** **************************权限管理************************** */

  // 获取角色未分配用户数据列表
  getPagedAllotUserList (data) { return request('/api/jeebiz-authz/authz/role/userlist', data) },
  // 获取角色已经分配用户数据列表
  getPagedAllocatedUserList (data) { return request('/api/jeebiz-authz/authz/role/allocated', data) },
  // 角色分配用户
  allotUsers (data) { return request('/api/jeebiz-authz/authz/role/allot', data) },
  // 取消角色分配用户
  unallotUsers (data) { return request('/api/jeebiz-authz/authz/role/unallot', data) },
  // 查询角色信息
  roleRoles (data) { return request('/api/jeebiz-authz/authz/role/roles', data, 'get') },
  // 查询角色可用的服务及功能
  getFeatureTree (data) { return request('/api/jeebiz-authz/authz/role/features/tree', data, 'get') },
  // 查询指定角色已分配功能权限
  getPerms (data) { return request('/api/jeebiz-authz/authz/role/perms/pairs', data, 'get') },
  // 给指定角色分配功能权限
  doPerms (data) { return request('/api/jeebiz-authz/authz/role/perms/perms', data) },
  // 取消已分配给指定角色的权限
  unPerms (data) { return request('/api/jeebiz-authz/authz/role/perms/unperms', data) },

  // 获取用户数据列表
  getPagedUserList (data) { return request('/api/jeebiz-authz/authz/user/list', data) },
  // 设置用户状态
  setUserStatus (data) { return request('/api/jeebiz-authz/authz/user/status', data, 'get') },
  // 添加用户
  addUser (data) { return request('/api/jeebiz-authz/authz/user/new', data) },
  // 删除用户
  deleteUser (data) { return request('/api/jeebiz-authz/authz/user/delete', data, 'get') },
  // 编辑用户
  editUser (data) { return request('/api/jeebiz-authz/authz/user/renew', data) },
  // 重置指定用户密码
  resetPwd (data) { return request('/api/jeebiz-authz/authz/user/resetpwd', data, 'get') },
  // 批量删除用户
  deleteByIds (data) { return request('/api/jeebiz-authz/authz/user/deleteByIds', data, 'get') },
  // 查询所有可用角色
  getRoles (data) { return request('/api/jeebiz-authz/authz/role/roles', data, 'get') },
  // 获取角色列表
  getRolePairs (data) { return request('/api/jeebiz-authz/authz/role/pairs', data, 'get') },
  getPagedRoleList (data) { return request('/api/jeebiz-authz/authz/role/list', data) },
  // 更新角色状态
  changeRoleStatus (data) { return request('/api/jeebiz-authz/authz/role/status', data, 'get') },
  // 增加角色信息
  addRole (data) { return request('/api/jeebiz-authz/authz/role/new', data) },
  // 修改角色信息
  editRole (data) { return request('/api/jeebiz-authz/authz/role/renew', data) },
  // 通过ID删除角色信息
  delRole (data) { return request('/api/jeebiz-authz/authz/role/delete', data, 'get') },
  // 批量删除角色信息
  batchDelRole (data) { return request('/api/jeebiz-authz/authz/role/deleteByIds', data) },
  // 服务菜单
  getChildFeatures (data) { return request('/api/jeebiz-authz/authorized/feature/children', data, 'get') },
  getServFeatures (data) { return request('/api/jeebiz-authz/authorized/feature/tree', data, 'get') },

  /** **************************基础数据************************** */

  // 获取基础数据列表
  keyvalueList (data) { return request('/api/jeebiz-settings/authz/basedata/keyvalue/list', data) },
  // 删除基础数据列表
  keyvalueDelete (data) { return request('/api/jeebiz-settings/authz/basedata/keyvalue/delete', data, 'get') },
  // 查询基础数据分组
  keyvalueGroups (data) { return request('/api/jeebiz-settings/authz/basedata/group/pairs', data, 'get') },
  // 创建基础数据
  keyvalueNew (data) { return request('/api/jeebiz-settings/authz/basedata/keyvalue/new', data) },
  // 更新基础数据
  keyvalueRenew (data) { return request('/api/jeebiz-settings/authz/basedata/keyvalue/renew', data) },
  // 更新基础数据状态
  keyvalueStatus (data) { return request('/api/jeebiz-settings/authz/basedata/keyvalue/status', data, 'get') },
  // 获取下拉框数据
  getKeypairs (data) { return request('/api/jeebiz-settings/authz/basedata/keyvalue/pairs', data, 'get') },
  // 获取学生基本信息
  baseinfoStudentDetail (data) { return request('/api/jeebiz-baseinfo/baseinfo/student/info', data, 'get') },

  // 获取数据分组列表
  groupList (data) { return request('/api/jeebiz-settings/authz/basedata/group/list', data) },
  // 新增数据分组列表
  groupNew (data) { return request('/api/jeebiz-settings/authz/basedata/group/new', data) },
  // 编辑数据分组列表
  groupRenew (data) { return request('/api/jeebiz-settings/authz/basedata/group/renew', data) },
  // 删除数据分组列表
  groupDelete (data) { return request('/api/jeebiz-settings/authz/basedata/group/delete', data, 'get') },
  // 更新按钮状态
  groupStatus (data) { return request('/api/jeebiz-settings/authz/basedata/group/status', data, 'get') },

  // 获取系统参数列表
  settingsList (data) { return request('/api/jeebiz-settings/authz/basedata/settings/list', data) },
  // 编辑
  settingsRenew (data) { return request('/api/jeebiz-settings/authz/basedata/settings/renew', data) },

  /** **************************操作日志************************** */

  // 日志级别
  bizLevels (data) { return request('/api/jeebiz-logbiz/authz/logs/biz/levels', data, 'get') },
  // 操作类型
  bizOpts (data) { return request('/api/jeebiz-logbiz/authz/logs/biz/opts', data, 'get') },
  // 认证日志
  authzList (data) { return request('/api/jeebiz-logbiz/authz/logs/authz/list', data) },
  // 操作日志
  bizList (data) { return request('/api/jeebiz-logbiz/authz/logs/biz/list', data) },

  /** **************************服务管理************************** */

  // 可访问服务（服务中心）：按登录账户查询
  getServList (data) { return request('/api/jeebiz-servmgt/serv/info/list', data, 'get') },
  // 可访问服务（首页）：按登录账户查询
  getServTabs (data) { return request('/api/jeebiz-servmgt/serv/info/tabs', data, 'get') },
  // 常用服务列表
  getLatestServList (data) { return request('/api/jeebiz-servmgt/serv/info/latest', data, 'get') },
  // 服务中心
  getMyServList (data) { return request('/api/jeebiz-servmgt/serv/info/center', data, 'get') },
  visitService (data) { return request('/api/jeebiz-servmgt/serv/visit/new', data, 'get') },

  getPagedServList (data) { return request('/api/jeebiz-servmgt/serv/info/page', data) },
  newServ (data) { return request('/api/jeebiz-servmgt/serv/info/new', data) },
  renewServ (data) { return request('/api/jeebiz-servmgt/serv/info/renew', data) },
  setServStatus (data) { return request('/api/jeebiz-servmgt/serv/info/status', data, 'get') },
  deleteServ (data) { return request('/api/jeebiz-servmgt/serv/info/delete', data, 'get') },
  getServCategorys (data) { return request('/api/jeebiz-servmgt/serv/category/pairs', data, 'get') },
  getServCategoryList (data) { return request('/api/jeebiz-servmgt/serv/category/page', data) },
  newServCategory (data) { return request('/api/jeebiz-servmgt/serv/category/new', data) },
  renewServCategory (data) { return request('/api/jeebiz-servmgt/serv/category/renew', data) },
  setServCategoryStatus (data) { return request('/api/jeebiz-servmgt/serv/category/status', data, 'get') },
  deleteServCategory (data) { return request('/api/jeebiz-servmgt/serv/category/delete', data, 'get') },

  /** **************************工作流************************** */

  /* 工作流程信息 */

  // 获取流程定义列表
  worklistJson (data) { return request('/api/jeebiz-flow/definition/listJson', data) },
  // 获取流程定义详情
  worklistJsondetail (data) { return request('/api/jeebiz-flow/definition/detail', data) },

  /* 工作流 */

  // 启动工作流
  startWorkFlow (data) { return request('/api/jeebiz-flow/instance/start', data) },
  // 获取工作流-待处理(我的申请)
  todoTaskList (data) { return request('/api/jeebiz-flow/my/todoTaskList', data) },
  // 获取工作流-详情
  getTaskInfo (data) { return request('/api/jeebiz-flow/task/getTaskData', data) },
  // 工作流-操作按钮（提交，同意，驳回）
  doAction (data) { return request('/api/jeebiz-flow/task/doAction', data) },
  // 工作流-审批历史
  getWorkHistroy (data) { return request('/api/jeebiz-flow/instance/getInstanceOpinion', data) },
  // 工作流-已处理(我的申请)
  doneTaskList (data) { return request('/api/jeebiz-flow/my/approveList', data) },
  // 工作流-流程实例管理
  getInstanceList (data) { return request('/api/jeebiz-flow/instance/bpmInstanceList', data) },
  // 工作流修改增加
  insertBpmStudentID (data) { return request('/api/jeebiz-stuworker-scholarship/scholarship/form/bpmNew', data) },
  // 获取工作流选项数据
  getWorkFlow (data) { return request('/api/jeebiz-flow/definition/listJson', data) },

  /** **************************文章管理（通知公告）************************** */

  // 获取文章列表
  getArticleList (data) { return request('/api/jeebiz-article/baseinfo/article/list', data) },
  // 添加文章
  addArticle (data) { return request('/api/jeebiz-article/baseinfo/article/addArticle', data) },
  // 修改文章
  editArticle (data) { return request('/api/jeebiz-article/baseinfo/article/editArticle', data) },
  // 删除文章
  deleteArticle (data) { return request('/api/jeebiz-article/baseinfo/article/removeArticle', data) },
  // 文章详情
  getArticleInfo (data) { return request('/api/jeebiz-article/baseinfo/article/getArticleById', data) },
  // 删除文章附件
  deleteArticleFile (data) { return request('/api/jeebiz-article/baseinfo/article/removeAtt', data) },
  // 删除文章内容
  // deleteArticleContent(data){return request('/api/jeebiz-article/baseinfo/article/cleanExt',data)},
  // 设置评论审核状态
  setCommentStatus (data) { return request('/api/jeebiz-article/baseinfo/articleComment/checkComment', data) },
  // 获取评论列表
  getCommentList (data) { return request('/api/jeebiz-article/baseinfo/articleComment/listUncheck', data) },
  // 删除评论
  deleteComment (data) { return request('/api/jeebiz-article/baseinfo/articleComment/remove', data) },
  // 切换发布状态
  changePulish (data) { return request('/api/jeebiz-article/baseinfo/article/changePulish', data) },

  // 获取文章全部分类
  getAllArticle (data) { return request('/api/jeebiz-article/baseinfo/articleCategory/getAll', data) },
  // 添加文章分类
  addArticleCategory (data) { return request('/api/jeebiz-article/baseinfo/articleCategory/add', data) },
  // 编辑文章分类
  editArticleCategory (data) { return request('/api/jeebiz-article/baseinfo/articleCategory/edit', data) },
  // 获取文章分类列表
  getArticleCategoryList (data) { return request('/api/jeebiz-article/baseinfo/articleCategory/list', data) },
  // 删除文章分类
  deleteArticleCategory (data) { return request('/api/jeebiz-article/baseinfo/articleCategory/remove', data) },
  // 获取文章详情
  getArticleCategoryInfo (data) { return request('/api/jeebiz-article/baseinfo/articleCategory/view', data) },

  // 文章栏目树
  articleCloumn_tree (data) { return request('/api/jeebiz-article/baseinfo/articleChannel/tree', data) },
  // 新增文章栏目
  addArticleCloumn (data) { return request('/api/jeebiz-article/baseinfo/articleChannel/add', data) },
  // 删除文章栏目
  deleteArticleCloumn (data) { return request('/api/jeebiz-article/baseinfo/articleChannel/del', data) },
  // 编辑文章栏目
  editArticleCloumn (data) { return request('/api/jeebiz-article/baseinfo/articleChannel/edit', data) },
  // 获取文章栏目列表
  getArticleCloumnList (data) { return request('/api/jeebiz-article/baseinfo/articleChannel/list', data) },
  // 文章栏目详情
  getArticleCloumnInfo (data) { return request('/api/jeebiz-article/baseinfo/articleChannel/view', data) },
  /* 新增或编辑评论 */
  addOrEditDiscuss (data) { return request('/api/jeebiz-article/baseinfo/articleComment/addOrEdit', data) },
  /* 分页获取评论 */
  listUncheckDiscuss (data) { return request('/api/jeebiz-article/baseinfo/articleComment/listUncheck', data) },
  /* 用户的删除接口，如果不是管理员且不是 */
  delCommentuserDel (data) { return request('/api/jeebiz-article/baseinfo/articleComment/userDel', data) }

}
