---
layout: post
title: 单例设计模式思考
description: 单例设计是最简单, 也是最常见的设计模式, 但简单的单例其实也不简单.
category: blog
tags: life
keywords: design,singleton
---


7月份不是个找工作的好时期, 投了N家都没一个电话, 可能是鄙人水平太差, 也可能是今年行情不好, 或者是运气不好吧. 不管怎样, 今天还是有了一个机会, 不过其中一个问题一下子把我问住了, 那就是传说中的单例.   
他说单例有几种实现方式, 能讲一下吗? 我蒙了一下, 我怎么就记得一种呢, 我脑子里是这样想的:  
  
####1.使用静态方法实例化:

	public class Singleton_1 {
		private static Singleton_1 instance;  //私有静态变量
		private Singleton_1 (){}  //为什么要加上这个默认构造方法呢?
		// 1.这个构造方法是默认的, 如果不加上这个默认的构造方法, 那么每次调用 `Singleton_1 s = new Singleton_1()` 的时候每次都会实例化一个 `Singleton_1` 对象, 这就不叫单例了.
		// 2.私有属性隐藏了构造方法，所以当你实例化时必须要调用getInstance这个方法

		 public static Singleton_1 getInstance() {  
			 if (instance == null) {  //判断内存中是否存在这样一个对象, 如果存在就之直接返回, 不存在就实例化一个
				 instance = new Singleton_1();  
			 }  
			 return instance;  
		 }
	}

运行结果是: 211

他说, 那如果是在多线程里调用这个单例会出问题吗, 怎么解决呢?   
好吧, 那我们加上个万恶的`synchronized`吧!

####2.使用静态方法实例化,线程安全

	class Singleton_sync {
		private static Singleton_sync instance;
		private Singleton_sync (){}
		 public static synchronized Singleton_sync getInstance() {  //加上 synchronized 保证线程安全
			 if (instance == null) {
				 instance = new Singleton_sync();  
			 }  
			 return instance;  
		 }
		 
		 public static void main(String[] args) {
			 Singleton_sync ts = new Singleton_sync();
			 Long start = System.currentTimeMillis();
			 System.out.println("Singleton start:" + start);
			 for (int i=0; i<100000000; i++) {
				 ts.getInstance();
			 }
			 Long end = System.currentTimeMillis();
			 System.out.println("Singleton end:" + end);
			 System.out.println("Singleton cost:" + (end - start));
		 }
	}

运行结果是: 2928

回来一查才发现还有下面这么多种...

####3.使用静态变量实例化:  

	class Singleton_3 {
		private static Singleton_3 instance = new Singleton_3();
		private Singleton_3 () {}
		public static Singleton_3 getInstance() {
			return instance;
		}
		public static void main(String[] args) {
			Singleton_3 t3 = new Singleton_3();
			 Long start = System.currentTimeMillis();
			 System.out.println("Singleton start:" + start);
			 for (int i=0; i<100000000; i++) {
				 t3.getInstance();
			 }
			 Long end = System.currentTimeMillis();
			 System.out.println("Singleton end:" + end);
			 System.out.println("Singleton cost:" + (end - start));
		 }
	}

运行结果是: 81

####4.使用静态代码块实例化:  

	class Singleton_4 {
		private Singleton_4 instance = null;
		private Singleton_4 () {}
		
		static {  //静态代码块, 作用当加载此类的时候会运行静态代码块
			instance = new Singleton_4();
		} 
		
		public static Singleton_4 getInstance() {
			return instance;
		}
		
		public static void main(String[] args) {
			Singleton_4 t4 = new Singleton_4();
			 Long start = System.currentTimeMillis();
			 System.out.println("Singleton start:" + start);
			 for (int i=0; i<100000000; i++) {
				 t4.getInstance();
			 }
			 Long end = System.currentTimeMillis();
			 System.out.println("Singleton end:" + end);
			 System.out.println("Singleton cost:" + (end - start));
		 }
	}

运行结果是: 108

####5.静态内部类实例化:

	class Singleton_5 {
		private static Singleton_5 INSTANCE;
		private Singleton_5 () {}
		
		private static class SingletonHolder {  //静态内部类 
			private static final Singleton_5 INSTANCE = new Singleton_5();  
		}  
		
		public static Singleton_5 getInstance() {
			return SingletonHolder.INSTANCE;
		}
		
		public static void main(String[] args) {
			Singleton_5 t5 = new Singleton_5();
			 Long start = System.currentTimeMillis();
			 System.out.println("Singleton_3 start:" + start);
			 for (int i=0; i<100000000; i++) {
				 t5.getInstance();
			 }
			 Long end = System.currentTimeMillis();
			 System.out.println("Singleton_3 end:" + end);
			 System.out.println("Singleton_3 cost:" + (end - start));
		 }
	}

运行结果是: 88

####6.使用枚举类型:

	public enum Singleton_6 {
		INSTANCE;
		public void whateverMethod() {
			
		}  
	}

####7.双重校验锁:

	class Singleton_7 {
		private volatile static Singleton_7 INSTANCE;
		private Singleton_7 () {}
		
		public static Singleton_7 getInstance() {
			if (INSTANCE == null) {
				synchronized (Singleton_7.class) {
					if (INSTANCE == null) {
						INSTANCE = new Singleton_7();
					}
				}
			}  
			return INSTANCE;  
		}
		
		public static void main(String[] args) {
			Singleton_7 t7 = new Singleton_7();
			 Long start = System.currentTimeMillis();
			 System.out.println("Singleton_7 start:" + start);
			 for (int i=0; i<100000000; i++) {
				 t7.getInstance();
			 }
			 Long end = System.currentTimeMillis();
			 System.out.println("Singleton_7 end:" + end);
			 System.out.println("Singleton_7 cost:" + (end - start));
		 }
	}

运行结果是: 642

常用的设计模式还算理解, 但是我以前就没怎么搞过多线程, 所以, 今天痛定思痛, 回来以后, 赶紧学习啊...  


###思考
单例都用在声明情况下?  
1. 例如像JDBC一类的配置文件, 肯定要有一个类去加载, 然后放到内存中, 在整个服务器的生命周期内只需要一个这样的对象，也不需要经常的改变, 所以这样的类大部分用单例来实现, Spring中就大量使用了单例模式,并且Spring推荐将所有业务逻辑组件、DAO组件、数据源组件等配制成单例模式，还有就是Hibernate中的`SessionFactory`也是一个比较熟悉的单例.  
2. 缓存、日志对象、打印机等, 例如有多个打印机, 但是你只想打印一份资料, 总不能每个打印机都打印一份.

单例的作用范围是什么?  
同一个虚拟机范围内(单个类加载器)

###勉励
每次找工作之前都应该做好准备, 不然就白白失去一次机会, 虽然你永远不知道下一个是否会更好, 但这都值得努力!

###参考
http://www.blogjava.net/kenzhh/archive/2013/03/15/357824.html  
http://www.cnblogs.com/zhuowei/archive/2009/01/04/1368611.html