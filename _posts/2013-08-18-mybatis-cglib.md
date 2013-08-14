---
layout: post
title: Cannot enable lazy loading because CGLIB is not available.
description: 整合SpringMVC和Mybatis时因为jar包问题导致的出错, 在此记录一下.
category: blog
tags: mybatis,spring
keywords:mybatis,cglib,asm,spring
---
###错误

	2013-08-12 14:33:37.672:WARN::Nested in org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'sqlSessionFactory' defined in URL [file:/E:/cloudwave-core/src/main/webapp/WEB-INF/classes/applicationContext.xml]: Invocation of init method failed; nested exception is org.springframework.core.NestedIOException: Failed to parse config resource: class path resource [mybatis-config.xml]; nested exception is org.apache.ibatis.builder.BuilderException: Error parsing SQL Mapper Configuration. Cause: java.lang.IllegalStateException: Cannot enable lazy loading because CGLIB is not available. Add CGLIB to your classpath.:java.lang.IncompatibleClassChangeError: class net.sf.cglib.core.DebuggingClassWriter has interface org.objectweb.asm.ClassVisitor as super class

###是缺少jar包吗?  

这个问题是因为缺少jar包导致的.

	<dependency>
		<groupId>cglib</groupId>
		<artifactId>cglib</artifactId>
		<version>3.0</version>
	</dependency>

在 mybatis 中如果开启了全局性的延迟加载:

	<setting name="lazyLoadingEnabled" value="false" />

那么是需要 `cglib` 这个jar包的. 

###spring中的cglib可以提到吗?

但是在 `Spring 3.2 M2` 之后 `cglib` 已经被包含在 `spring-core` 中了(见.[spring-node-3654](http://www.springsource.org/node/3654)). 这样的话貌似你就不用再添加这个jar包了, 其实不然:

	2013-08-12 14:43:08.715:WARN::Nested in org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'sqlSessionFactory' defined in URL [file:/E:/cloudwave-core/src/main/webapp/WEB-INF/classes/applicationContext.xml]: Invocation of init method failed; nested exception is org.springframework.core.NestedIOException: Failed to parse config resource: class path resource [mybatis-config.xml]; nested exception is org.apache.ibatis.builder.BuilderException: Error parsing SQL Mapper Configuration. Cause: java.lang.IllegalStateException: Cannot enable lazy loading because CGLIB is not available. Add CGLIB to your classpath.:java.lang.ClassNotFoundException: Cannot find class: net.sf.cglib.proxy.Enhancer

这个问题不知道是为什么, 应该是 mybatis 引用不到 spring.
  
禁用 mybatis 的全局性的延迟加载, 然后项目成功运行.


这样就结束了吗? NO!  
后来我在Github上给mybatis提了一个[issues](https://github.com/mybatis/mybatis-3/issues/78)最终找到了问题的原因, 如果你启用了懒加载功能, 虽然spring中有了 `cglib` 但是和 `cglib.jar` 的路径不一致导致mybatis读取不到它而报错, 所以需要额外添加 `cglib.jar` 的引用. 但这里要注意的是 `cglib.jar` 的版本应该为 `2.2.2` 否则就会报上面的错误.  

###问题解决!  
至于是否引用 `spring-cglib` 要看你自己的需要, 但要说明的是它和mybatis没多大关系, mybatis `3.2.2` 需要额外的 `cglib.jar` 并且版本应该为 `2.2.2` .


###致谢!  
感谢[harawata](https://github.com/harawata)在Github上对我的问题的解答.

###参考  
[java-lang-noclassdeffounderror-net-sf-cglib-asm-util-traceclassvisitor](http://stackoverflow.com/questions/17326143/java-lang-noclassdeffounderror-net-sf-cglib-asm-util-traceclassvisitor)

[spring-node-3654](http://www.springsource.org/node/3654)

[mybatis-3-issues](https://github.com/mybatis/mybatis-3/issues/4)

