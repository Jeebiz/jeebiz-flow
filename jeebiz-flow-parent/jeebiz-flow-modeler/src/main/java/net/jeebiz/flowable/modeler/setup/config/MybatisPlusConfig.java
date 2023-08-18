package net.jeebiz.flowable.modeler.setup.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.baomidou.mybatisplus.autoconfigure.MybatisPlusAutoConfiguration;
import com.baomidou.mybatisplus.core.injector.DefaultSqlInjector;
import com.baomidou.mybatisplus.core.injector.ISqlInjector;
import com.baomidou.mybatisplus.core.parser.ISqlParser;
import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.plugins.SqlExplainInterceptor;

@Configuration
@AutoConfigureBefore(MybatisPlusAutoConfiguration.class)
public class MybatisPlusConfig {

	/**
	 * 乐观锁插件
	 * https://mp.baomidou.com/guide/optimistic-locker-plugin.html#%E4%B8%BB%E8%A6%81%E9%80%82%E7%94%A8%E5%9C%BA%E6%99%AF
	 * 
	 * @return
	 */
	@Bean
	public OptimisticLockerInterceptor optimisticLockerInterceptor() {
		return new OptimisticLockerInterceptor();
	}

	/**
	 * mybatis-plus分页插件<br>
	 * 文档：http://mp.baomidou.com<br>
	 */
	@Bean
	public PaginationInterceptor paginationInterceptor() {
		PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
		paginationInterceptor.setOverflow(true);

		List<ISqlParser> sqlParserList = new ArrayList<>();
		// 攻击 SQL 阻断解析器、加入解析链
		/// sqlParserList.add(new BlockAttackSqlParser());
		paginationInterceptor.setSqlParserList(sqlParserList);

		/*
		 * 【测试多租户】 SQL 解析处理拦截器<br> 这里固定写成住户 1 实际情况你可以从cookie读取，因此数据看不到 【 麻花藤 】 这条记录（
		 * 注意观察 SQL ）<br>
		 */
		/*
		 * List<ISqlParser> sqlParserList = new ArrayList<>(); TenantSqlParser
		 * tenantSqlParser = new TenantSqlParser(); tenantSqlParser.setTenantHandler(new
		 * TenantHandler() {
		 * 
		 * @Override public Expression getTenantId() { return new LongValue(1L); }
		 * 
		 * @Override public String getTenantIdColumn() { return "tenant_id"; }
		 * 
		 * @Override public boolean doTableFilter(String tableName) { // 这里可以判断是否过滤表
		 * 
		 * if ("user".equals(tableName)) { return true; } return false; } });
		 * 
		 * 
		 * sqlParserList.add(tenantSqlParser);
		 * paginationInterceptor.setSqlParserList(sqlParserList);
		 */
		// 以下过滤方式与 @SqlParser(filter = true) 注解等效
//       paginationInterceptor.setSqlParserFilter(new ISqlParserFilter() {
//           @Override
//           public boolean doFilter(MetaObject metaObject) {
//               MappedStatement ms = PluginUtils.getMappedStatement(metaObject);
//               // 过滤自定义查询此时无租户信息约束【 麻花藤 】出现
//               if ("com.baomidou.springboot.mapper.UserMapper.selectListBySQL".equals(ms.getId())) {
//                   return true;
//               }
//               return false;
//           }
//       });
		return paginationInterceptor;
	}

	/**
	 * 注入sql注入器
	 */
	@Bean
	public ISqlInjector sqlInjector() {
		return new DefaultSqlInjector();
	}

	@Bean
	public SqlExplainInterceptor sqlExplainInterceptor() {
		// 启用执行分析插件
		SqlExplainInterceptor sqlExplainInterceptor = new SqlExplainInterceptor();
		return sqlExplainInterceptor;
	}

   /*
    * oracle数据库配置JdbcTypeForNull
     * 参考：https://gitee.com/baomidou/mybatisplus-boot-starter/issues/IHS8X
    不需要这样配置了，参考 yml:
    mybatis-plus:
      confuguration
        dbc-type-for-null: 'null' 
   @Bean
   public ConfigurationCustomizer configurationCustomizer(){
       return new MybatisPlusCustomizers();
   }

   class MybatisPlusCustomizers implements ConfigurationCustomizer {

       @Override
       public void customize(org.apache.ibatis.session.Configuration configuration) {
           configuration.setJdbcTypeForNull(JdbcType.NULL);
       }
   }
   */
}