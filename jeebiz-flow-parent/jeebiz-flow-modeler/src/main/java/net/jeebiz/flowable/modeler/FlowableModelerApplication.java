package net.jeebiz.flowable.modeler;

import javax.sql.DataSource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

// https://blog.csdn.net/puhaiyang/article/details/79845248
@EnableAutoConfiguration
@EnableCaching(proxyTargetClass = true)
@EnableScheduling
@EnableTransactionManagement
@SpringBootApplication
public class FlowableModelerApplication implements CommandLineRunner {

	// 其中 dataSource 框架会自动为我们注入
    @Bean
    public PlatformTransactionManager txManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
    
	public static void main(String[] args) throws Exception {
		 SpringApplication.run(FlowableModelerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.err.println("Spring Boot Application（Flowable-Modeler） Started !");
	}
	
}
