---
layout: post
title: 在Windows下安装MongoDB
description: 这是一篇翻译文章，主要介绍如何在Windows安装MongoDB还有一点儿自己的实践。
category: blog
tags: mongodb,nosql,db
keywords: MongoDB,安装,翻译
---

###概要
本教程提供了一种用命令行在Windows下安装和运行MongoDB服务器(即“mongod.exe”)的方法,并概述了把MongoDB配置为一个Windows服务的过程.

###步骤
**重要提示:如果您正在运行任何版本的Windows Server 2008 R2或Windows 7,请安装[热修复补丁](http://support.microsoft.com/kb/2731284)来解决一个问题在Windows内存映射文件.**

####下载Windows平台的MongoDB
从[MongoDB下载页面](http://www.mongodb.org/downloads)下载最新的生产版本.  
在Windows系统中MongoDB有三个builds：

- MongoDB的Windows Server 2008 R2版(即2008R2)只运行在Windows Server 2008 R2,Windows 7 64位或者更新版本的Windows。这个构建利用最近的增强Windows平台并且不能使用老版本的Windows。
- MongoDB的Windows 64位版本运行在比Windows XP更新的64位版本的Windows系统中,包括Windows Server 2008 R2和Windows 7 64位。
- MongoDB的Windows 32位版本运行在任何比Windows XP更新的32位版本的Windows中。32位版本的MongoDB只是用于旧系统和用于测试和开发系统。

从2.2版中以后MongoDB不再支持Windows XP。请尽量使用使用最新的Windows系统来运行更多最近发布的MongoDB。

####注意以下问题：

- 最好是下载最新版本的MongoDB，64位的MongoDB将要不支持32位的Windows。
- 32位版本的MongoDB只适用于测试和评估目的,只支持数据库小于 2 GB。
- 你可以用以下命令来查看你的Windows的架构版本:
`wmic os get osarchitecture`

在Windows资源管理器,找到下载文件,通常在MongoDB默认下载目录。解压压缩文件到`C：`

*注意：  
文件夹的名字大概像下面的:  
`C:\mongodb-win32-i386-[version]`  
或者：  
`C:\mongodb-win32-x86_64-[version]`  
两个例子里面的 [version] 是你下载的MongoDB的版本号。*

###设置环境
在开始菜单中以管理员身份启动命令提示符。在命令提示中,执行以下命令:  
`cd \`
`move C:\mongodb-win32-* C:\mongodb`

*注意：  
MongoDB都是独立且没有任何其他系统依赖关系,您可以你选择的任何文件夹运行MongoDB,你可以把MongoDB安装在任何目录(例如`D:\test\MongoDB`)。*

MongoDB需要[数据文件夹](http://docs.mongodb.org/manual/reference/glossary/#term-dbpath)来存储它的文件。默认位置为MongoDB数据目录是`C:\data\db`，使用以下命令语句来创建文件夹:

	md data  
	md data\db

你可以用dbpath参数来指定一个路径`\data\db`来为mongod数据库路径，像下面的例子:
`C:\mongodb\bin\mongod.exe --dbpath d:\test\mongodb\data`  
如果你的路径包括空格,那么将整个路径在双引号,例如:
`C:\mongodb\bin\mongod.exe --dbpath "d:\test\mongo db data"`

###启动MongoDB
用下面的命令来启动MongoDB：  
`C:\mongodb\bin\mongod.exe`

这是启动MongoDB数据库的主要过程，如果控制台打印出`waiting for connections `则说明mongod.exe进程运行成功。

*注意：  
启动过程可能有其他提示，这取决于您的系统的安全等级,Windows将发出一个安全警告对话框，大概意思是是否允许`C:\\mongodb\bin\mongod.exe`访问您的网络，一般勾选家庭或工作(专用)网络，然后点击允许就可以了。关于MongoDB更多的安全信息请阅读[安全实践和管理页面](http://docs.mongodb.org/manual/core/security/)。*

**警告：如果mongod.exe没有运行在“安全模式”(即身份验证)，则不要允许mongod.exe运行在公共网络。MongoDB是设计运行在“可信环境”，并且默认情况下数据库不支持身份验证或“安全模式”。**

使用mongo命令链接MongoDB，打开另一个命令提示符,执行以下命令:  
`C:\mongodb\bin\mongo.exe`

*注意： 
执行该命令`start C:\mongo\bin\mongodb.exe`将自动在一个单独的命令提示符窗口启动mongodb.exe命令。*

[mongo.exe](http://docs.mongodb.org/manual/reference/program/mongo/#bin.mongo) shell将默认连接到运行在localhost端口为27017的[mongod.exe](http://docs.mongodb.org/manual/reference/program/mongod.exe/#bin.mongod.exe)。 在[mongo.exe](http://docs.mongodb.org/manual/reference/program/mongo/#bin.mongo) 命令提示符下,执行以下两个命令会在默认的`test`数据库的`test`集合插入一个记录的,然后查询这条记录:

	db.test.save( { a: 1 } )
	db.test.find()

参见:
“[mongo](http://docs.mongodb.org/manual/reference/program/mongo/#bin.mongo)”和“[mongo Shell Methods]”(http://docs.mongodb.org/manual/reference/method/)。 “如果你想要用.Net开发应用程序使用,那么请查阅[C# and MongoDB](http://docs.mongodb.org/ecosystem/drivers/csharp)来获取更多信息。

###作为Windows服务的MongoDB
这一特性也是在2.0版本以后才支持的  
将MongoDB作为Windows服务来安装,这样的话数据库将随系统自动启动。

*注意：  
在MongoDB 2.0版本中，支持[mongod.exe](http://docs.mongodb.org/manual/reference/program/mongod.exe/#bin.mongod.exe)作为Windows服务运行，在2.1.1版本中也支持[mongos.exe](http://docs.mongodb.org/manual/reference/program/mongos.exe/#bin.mongos.exe)作为Windows服务运行。*

####配置操作系统
当把MongoDB作为一个Windows服务运行时需要指定两个参数:一个路径为日志输出(即[logpath](http://docs.mongodb.org/manual/reference/configuration-options/#logpath))和一个[配置文件](http://docs.mongodb.org/manual/reference/configuration-options/)。  
1. 为MongoDB日志文件创建一个目录  
`md C:\mongodb\log`  
2. 为MongoDB的[logpath](http://docs.mongodb.org/manual/reference/configuration-options/#logpath)选项创建一个配置文件，在命令提示符执行这个命令:  
`echo logpath=C:\mongodb\log\mongo.log > C:\mongodb\mongod.cfg`

虽然这些可选的步骤是可选的,为日志文件和配置文件创建一个特定的位置还是比较好的。

*注意：  
1. 关于[`logappend`](http://docs.mongodb.org/manual/reference/configuration-options/#logappend)参数，如果没有这个才是，则mongod.exe将在每次启动的时候删除原有的日志。  
2. 在2.2版本中默认日志以追加的方式保存。*

####安装和运行MongoDB服务
以管理员的身份在命令提示符下运行以下命令。  
1. 安装MongoDB服务:  
`C:\mongodb\bin\mongod.exe --config C:\mongodb\mongod.cfg --install`  
此时你需要修改mongod.cfg配置文件，为了保证[`--install`](http://docs.mongodb.org/manual/reference/program/mongod.exe/#cmdoption-mongod.exe--install)命令的成功执行，你必须事先在mongod.cfg里面为[logpath](http://docs.mongodb.org/manual/reference/configuration-options/#logpath)参数指定一个路径，或者在运行的时候加上[`--logpath`](http://docs.mongodb.org/manual/reference/program/mongod/#cmdoption-mongod--logpath)参数。  
2. 运行MongoDB服务  
`net start MongoDB`  

*注意：  
如果你想指定一个其他的路径来替代执行[`--install`](http://docs.mongodb.org/manual/reference/program/mongod.exe/#cmdoption-mongod.exe--install)命令的时候指定的[`dbpath`](http://docs.mongodb.org/manual/reference/configuration-options/#dbpath)路径，那么你也可以在每次启动命令的时加上[`-dbpath`](http://docs.mongodb.org/manual/reference/program/mongod/#cmdoption-mongod--dbpath)参数，然而大部分时候我们还是喜欢使用配置文件的方式。*

####停止和移除MongoDB服务
- 停止MongoDB服务  
`net stop MongoDB`  
- 移除MongoDB服务  
`C:\mongodb\bin\mongod.exe --remove`

[查看原文](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/#configure-the-system)
----------
###个人实践
1. 配置文件:

		dbpath=E:\Database\mongodb
		logpath=E:\Database\mongodb\log\mongo.log

2. 安装服务  
`D:\mongodb-win32-i386-2.4.3\bin>mongod --config E:\Database\mongodb\mongod.cfg --install`

3. 启动服务  
`net start mongodg`   

如果出现一下提示:  
>"错误1053：服务没有及时相应启动或控制请求"

说明`logpath=E:\Database\mongodb\log\`这部分路径有问题,例如没有`E`盘或者\Database\mongodb\log\这三个文件夹中的某个你没有手动去建立,所以你需要手动新建这些文件夹,然后再次执行`net start mongodg`，如果提示:
>Mongo DB 服务正在启动...  
Mongo DB 服务正在启动成功.

说明系统服务安装成功。

如果在删除服务之后，Windows系统服务中仍然可以看到MongoDB服务，则可以手动强制删除服务：  
`sc delete "MongoDB"`

OK,可以了!其他基本没有什么问题。



###参考文档
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/