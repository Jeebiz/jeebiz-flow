package net.jeebiz.flow.admin.setup.config;

import org.flowable.ui.idm.servlet.ApiDispatcherServletConfiguration;
import org.flowable.ui.modeler.properties.FlowableModelerAppProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;


@Configuration
@EnableConfigurationProperties({FlowableModelerAppProperties.class})
@ComponentScan(basePackages = {
        "org.flowable.ui.idm.conf",
        "org.flowable.ui.idm.security",
        "org.flowable.ui.idm.service",
        "org.flowable.ui.modeler.repository",
        "org.flowable.ui.modeler.service",
        "org.flowable.ui.common.filter",
        "org.flowable.ui.common.service",
        "org.flowable.ui.common.repository",
        "org.flowable.ui.common.security",
        "org.flowable.ui.common.tenant"})
public class FlowableModelerConfiguration {


    @Bean
    public ServletRegistrationBean apiServlet(ApplicationContext applicationContext) {
        AnnotationConfigWebApplicationContext dispatcherServletConfiguration = new AnnotationConfigWebApplicationContext();
        dispatcherServletConfiguration.setParent(applicationContext);
        dispatcherServletConfiguration.register(ApiDispatcherServletConfiguration.class);
        DispatcherServlet servlet = new DispatcherServlet(dispatcherServletConfiguration);
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(servlet, "/api/*");
        registrationBean.setName("flow IDM App API Servlet");
        registrationBean.setLoadOnStartup(1);
        registrationBean.setAsyncSupported(true);
        return registrationBean;
    }
}
