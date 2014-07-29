---
layout: post
title:` default-lazy-init`和`SpringUtil`
description: `default-lazy-init`导致`SpringUtil`不被实例化!
category: blog
tags: javaee
keywords: SpringUtil,default-lazy-init
---

最近做项目的时候用到了 `SpringUtil`, 以下是代码:

	@Component
	public class SpringUtil implements ApplicationContextAware {
		private static Logger logger = LoggerFactory.getLogger(SpringUtil.class);
		
		
	    /**
	     * 当前IOC
	     */
	    private static ApplicationContext applicationContext;
	    
	    /**
	     * 设置当前上下文环境，此方法由spring自动装配
	     */
	    @Override
	    public void setApplicationContext(ApplicationContext acCtx)
	            throws BeansException {
	    	SpringUtil.applicationContext = acCtx;
	        logger.debug("setApplicationContext...");
	    }
	    
	    /**
	     * 从当前IOC获取bean
	     * @param id bean的id
	     * @return
	     */
	    public static Object getObject(String id) {
	        return applicationContext.getBean(id);
	    }
	}


具体作用就是在系统初始化的时候获得上下文, 然后在一些地方可以方便的使用上下文, 例如在拦截器里使用:

	UserService userService = (UserService) SpringUtil.getObject("userService");

这样会很方便, 但是我开始的时候遇到一个问题就是SpringUtil在应用启动的时候没有被初始化, 并且上下文也没有注入, 找来找去,找了半天的原因终于发现我的配置文件里有这么一个配置:

	<?xml version="1.0" encoding="UTF-8"?>
	<beans xmlns="http://www.springframework.org/schema/beans" 
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns:aop="http://www.springframework.org/schema/aop" 
		xmlns:context="http://www.springframework.org/schema/context" 
		xmlns:jdbc="http://www.springframework.org/schema/jdbc" 
		xmlns:tx="http://www.springframework.org/schema/tx"
		xmlns:jpa="http://www.springframework.org/schema/data/jpa"
		xsi:schemaLocation="
			http://www.springframework.org/schema/beans 
			http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
			http://www.springframework.org/schema/aop 
			http://www.springframework.org/schema/aop/spring-aop-4.0.xsd
			http://www.springframework.org/schema/context 
			http://www.springframework.org/schema/context/spring-context-4.0.xsd
			http://www.springframework.org/schema/jdbc 
			http://www.springframework.org/schema/jdbc/spring-jdbc-4.0.xsd
			http://www.springframework.org/schema/tx 
			http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
			http://www.springframework.org/schema/data/jpa 
			http://www.springframework.org/schema/data/jpa/spring-jpa-1.3.xsd" 
			default-lazy-init="true">
	
	</beans>

注意这个 `default-lazy-init="true"` 我把这个句话去掉, 结果就可以了.   

  我大致分析了一下原因, `default-lazy-init="true"` 这句话的意思就是懒加载bean, 就是说当bean被其他的bean引用的时候才实例化这个bean. 比如, 如果你在某个action中这样写:

	@Controller
	@RequestMapping("/user")
	public class UsercAction {
		@Resource
		private SpringUtil springUtil;
	}

那么应用启动的时候是会初始化 `SpringUtil` 因为它被 `UsercAction` 引用了, 所以会实例化. 但碰巧的是我们在所有的bean里面都不会这样使用 `SpringUtil` , 因而导致不会被实例化.

  由此可见 `default-lazy-init="true"` 这个属性用的时候还是要慎重.