package net.jeebiz.flow.admin;

import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import io.micrometer.core.instrument.MeterRegistry;
import net.jeebiz.flow.admin.setup.config.AppDispatcherServletConfiguration;
import net.jeebiz.flow.admin.setup.config.FlowableIdmConfiguration;

// https://blog.csdn.net/puhaiyang/article/details/79845248
@EnableAutoConfiguration
@EnableCaching(proxyTargetClass = true)
@EnableScheduling
@EnableTransactionManagement
@ComponentScan(basePackages = {"net.jeebiz.flow"})
@Import({
	FlowableIdmConfiguration.class,
    AppDispatcherServletConfiguration.class
})
@SpringBootApplication
public class JeebizFlowAdminApplication implements CommandLineRunner {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> configurer(
            @Value("${spring.application.name}") String applicationName) {
        return (registry) -> registry.config().commonTags("application", applicationName);
    }
    
    public static void main(String[] args) {
        SpringApplication.run(JeebizFlowAdminApplication.class, args);
    }
    
	@Override
	public void run(String... args) throws Exception {
		System.err.println("Spring Cloud Application（Jeebiz-Flow-Admin） Started !");
	}

	@Bean
    public CommandLineRunner init(final RepositoryService repositoryService,
                                  final RuntimeService runtimeService,
                                  final TaskService taskService) {

        return new CommandLineRunner() {
            @Override
            public void run(String... strings) throws Exception {
                System.out.println("Number of process definitions : "
                    + repositoryService.createProcessDefinitionQuery().count());
                System.out.println("Number of tasks : " + taskService.createTaskQuery().count());
                runtimeService.startProcessInstanceByKey("oneTaskProcess");
                System.out.println("Number of tasks after process start: "
                    + taskService.createTaskQuery().count());
            }
        };
    }
	 
	
}
