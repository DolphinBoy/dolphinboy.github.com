---
layout: post
title: Mybatis BindingException Invalid bound statement.
description: 使用mybatis时因为一些命名问题导致的异常，在此记录一下原因以及简单的分析.
category: blog
tags: mybatis,spring
keywords:mybatis,spring
---

###主要异常

	org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): com.cloudwave.fwapp.module.mapper.UserMapper.findByEmail

	java.lang.IllegalArgumentException: Mapped Statements collection does not contain value for com.cloudwave.fwapp.module.mapper.UserMapper.findByEmail

导致这个异常的原因可能有多个, 但我发现的其中的一个原因是因为你的接口类和映射类的文件名不同, 例如接口 UserMapper.java 但是你的映射文件却是 User.xml 因为 Mybatis 会在启动的时候把所有mapper.xml里面的方法加载到内存中, 如果你调用了 UserMapper.java 中的某个方法, 例如 UserMapper.findByEmail 此时 Mybatis 会通过反射去找 UserMapper.xml 文件里面的方法, 但因为你的映射文件是 User.xml 所以此时 Mybatis 无法找到你要调用的方法的映射, 所以就会报此异常, 所以无论是你的接口类和你的映射文件名不同, 还是里面的方法名不同都会导致此错误.

具体可以参考 Mybatis 源代码中 MapperMethod.java 的`SqlCommand`方法, 一路调试先去就会发现原因所在. 


----------

###详细异常信息


####HTTP ERROR 500
####Problem accessing /sign/test. Reason:

	Invalid bound statement (not found): com.cloudwave.fwapp.module.mapper.UserMapper.findByEmail</pre></p>

####Caused by:

	org.apache.ibatis.binding.BindingException: Invalid bound statement (not found): com.cloudwave.fwapp.module.mapper.UserMapper.findByEmail
	at org.apache.ibatis.binding.MapperMethod$SqlCommand.&lt;init&gt;(MapperMethod.java:178)
	at org.apache.ibatis.binding.MapperMethod.&lt;init&gt;(MapperMethod.java:38)
	at org.apache.ibatis.binding.MapperProxy.cachedMapperMethod(MapperProxy.java:49)
	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:42)
	at $Proxy29.findByEmail(Unknown Source)
	at com.cloudwave.fwapp.module.service.UserService.checkEmail(UserService.java:39)
	at com.cloudwave.fwapp.module.action.SignAction.test(SignAction.java:106)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:39)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:25)
	at java.lang.reflect.Method.invoke(Method.java:597)
	at org.springframework.web.method.support.InvocableHandlerMethod.invoke(InvocableHandlerMethod.java:219)
	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:132)
	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:104)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandleMethod(RequestMappingHandlerAdapter.java:745)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:686)
	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:80)
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:925)
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:856)
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:936)
	at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:827)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:707)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:812)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:820)
	at org.eclipse.jetty.servlet.ServletHolder.handle(ServletHolder.java:530)
	at org.eclipse.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1216)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:88)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.eclipse.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1187)
	at org.eclipse.jetty.servlet.ServletHandler.doHandle(ServletHandler.java:425)
	at org.eclipse.jetty.server.handler.ScopedHandler.handle(ScopedHandler.java:119)
	at org.eclipse.jetty.security.SecurityHandler.handle(SecurityHandler.java:494)
	at org.eclipse.jetty.server.session.SessionHandler.handle(SessionHandler.java:182)
	at org.eclipse.jetty.server.handler.ContextHandler.doHandle(ContextHandler.java:933)
	at org.eclipse.jetty.servlet.ServletHandler.doScope(ServletHandler.java:362)
	at org.eclipse.jetty.server.handler.ContextHandler.doScope(ContextHandler.java:867)
	at org.eclipse.jetty.server.handler.ScopedHandler.handle(ScopedHandler.java:117)
	at org.eclipse.jetty.server.handler.ContextHandlerCollection.handle(ContextHandlerCollection.java:245)
	at org.eclipse.jetty.server.handler.HandlerCollection.handle(HandlerCollection.java:126)
	at org.eclipse.jetty.server.handler.HandlerWrapper.handle(HandlerWrapper.java:113)
	at org.eclipse.jetty.server.Server.handle(Server.java:334)
	at org.eclipse.jetty.server.HttpConnection.handleRequest(HttpConnection.java:559)
	at org.eclipse.jetty.server.HttpConnection$RequestHandler.headerComplete(HttpConnection.java:992)
	at org.eclipse.jetty.http.HttpParser.parseNext(HttpParser.java:541)
	at org.eclipse.jetty.http.HttpParser.parseAvailable(HttpParser.java:203)
	at org.eclipse.jetty.server.HttpConnection.handle(HttpConnection.java:406)
	at org.eclipse.jetty.io.nio.SelectChannelEndPoint.run(SelectChannelEndPoint.java:462)
	at org.eclipse.jetty.util.thread.QueuedThreadPool$2.run(QueuedThreadPool.java:436)
	at java.lang.Thread.run(Thread.java:662)

####Caused by: 

	java.lang.IllegalArgumentException: Mapped Statements collection does not contain value for com.cloudwave.fwapp.module.mapper.UserMapper.findByEmail
	at org.apache.ibatis.session.Configuration$StrictMap.get(Configuration.java:775)
	at org.apache.ibatis.session.Configuration.getMappedStatement(Configuration.java:615)
	at org.apache.ibatis.session.Configuration.getMappedStatement(Configuration.java:608)
	at org.apache.ibatis.binding.MapperMethod$SqlCommand.&lt;init&gt;(MapperMethod.java:176)
	... 48 more

####Caused by:

	java.lang.IllegalArgumentException: Mapped Statements collection does not contain value for com.cloudwave.fwapp.module.mapper.UserMapper.findByEmail
	at org.apache.ibatis.session.Configuration$StrictMap.get(Configuration.java:775)
	at org.apache.ibatis.session.Configuration.getMappedStatement(Configuration.java:615)
	at org.apache.ibatis.session.Configuration.getMappedStatement(Configuration.java:608)
	at org.apache.ibatis.binding.MapperMethod$SqlCommand.&lt;init&gt;(MapperMethod.java:176)
	at org.apache.ibatis.binding.MapperMethod.&lt;init&gt;(MapperMethod.java:38)
	at org.apache.ibatis.binding.MapperProxy.cachedMapperMethod(MapperProxy.java:49)
	at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:42)
	at $Proxy29.findByEmail(Unknown Source)
	at com.cloudwave.fwapp.module.service.UserService.checkEmail(UserService.java:39)
	at com.cloudwave.fwapp.module.action.SignAction.test(SignAction.java:106)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:39)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:25)
	at java.lang.reflect.Method.invoke(Method.java:597)
	at org.springframework.web.method.support.InvocableHandlerMethod.invoke(InvocableHandlerMethod.java:219)
	at org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:132)
	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:104)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandleMethod(RequestMappingHandlerAdapter.java:745)
	at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:686)
	at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:80)
	at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:925)
	at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:856)
	at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:936)
	at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:827)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:707)
	at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:812)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:820)
	at org.eclipse.jetty.servlet.ServletHolder.handle(ServletHolder.java:530)
	at org.eclipse.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1216)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:88)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
	at org.eclipse.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1187)
	at org.eclipse.jetty.servlet.ServletHandler.doHandle(ServletHandler.java:425)
	at org.eclipse.jetty.server.handler.ScopedHandler.handle(ScopedHandler.java:119)
	at org.eclipse.jetty.security.SecurityHandler.handle(SecurityHandler.java:494)
	at org.eclipse.jetty.server.session.SessionHandler.handle(SessionHandler.java:182)
	at org.eclipse.jetty.server.handler.ContextHandler.doHandle(ContextHandler.java:933)
	at org.eclipse.jetty.servlet.ServletHandler.doScope(ServletHandler.java:362)
	at org.eclipse.jetty.server.handler.ContextHandler.doScope(ContextHandler.java:867)
	at org.eclipse.jetty.server.handler.ScopedHandler.handle(ScopedHandler.java:117)
	at org.eclipse.jetty.server.handler.ContextHandlerCollection.handle(ContextHandlerCollection.java:245)
	at org.eclipse.jetty.server.handler.HandlerCollection.handle(HandlerCollection.java:126)
	at org.eclipse.jetty.server.handler.HandlerWrapper.handle(HandlerWrapper.java:113)
	at org.eclipse.jetty.server.Server.handle(Server.java:334)
	at org.eclipse.jetty.server.HttpConnection.handleRequest(HttpConnection.java:559)
	at org.eclipse.jetty.server.HttpConnection$RequestHandler.headerComplete(HttpConnection.java:992)
	at org.eclipse.jetty.http.HttpParser.parseNext(HttpParser.java:541)
	at org.eclipse.jetty.http.HttpParser.parseAvailable(HttpParser.java:203)
	at org.eclipse.jetty.server.HttpConnection.handle(HttpConnection.java:406)
	at org.eclipse.jetty.io.nio.SelectChannelEndPoint.run(SelectChannelEndPoint.java:462)
	at org.eclipse.jetty.util.thread.QueuedThreadPool$2.run(QueuedThreadPool.java:436)
	at java.lang.Thread.run(Thread.java:662)

