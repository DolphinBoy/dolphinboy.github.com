---
layout: post
title: Console在Nodejs
description: 从Chrome按下F12开始, 我就喜欢上了console, 简单,优雅,强大.
category: blog
tags: log
keywords: console,Nodejs,log
---


####简单名词解释:  
`stdout`: 标准输出  
`stdin`: 标准输入  
`stderr`: 标准错误输出，你可以将他重定向到其他地方，比如文件

###console介绍
在Nodejs中`console`是一个`Object`  

console在Nodejs里面的作用是打印`stdout`和`stderr`. 类似于大多数web浏览器提供的控制台功能, 这里的输出是指发送到`stdout`和`stderr`.  

当`console`要把信息输入到终端或者输出到一个文件的时候, `console`是同步的, 这样是为了避免丢在失信息的情况下过早退出(如果是异步的话,肯能会导致程序已经因为错误终止了但没有输出任何日志); 当`console`把信息输出到管道时是异步的, 这样是为了避免长时间阻塞.

也就是说,在以下示例中, `stdout`是非阻塞的而`stderr`是阻塞的:

	$ node script.js 2> error.log | tee info.log

在日常使用中, 通常来说你不需要关心什么时候该使用阻塞什么时候该使用非阻塞, 除非你需要记录大量的数据。

###console使用
####console.log([data], [...])
打印到`stdout`并换行  

这个函数可以像`printf()`方法一样传递多个参数。示例:

	console.log('count: %d', count);

如果在第一个字符串参数里面没有找到格式化元素, 那么`util.inspect`将被用于每个参数, 相见[util.format()](http://nodejs.org/docs/latest/api/util.html#util_util_format_format)以获取更多信息.
>没搞懂这句话的意思,我理解是如果第一个字符串参数里面没有格式化元素, 那么后面的参数将依然输出, 例如:

	var str = 'shuchu';
	console.log('没有格式化元素会输出吗?', str);

结果是: `没有格式化元素会输出吗? shuchu` 

####console.info([data], [...])
和`console.log.`一样.

####console.error([data], [...])
和`console.log.`一样, 只是此API会打印`stderr`.

####console.warn([data], [...])
和`console.error.`一样.

####console.dir(obj)
对`obj`进行`util.inspect`并把结果字符串打印到`stdout`.

####console.time(label)
标记一个定时器的开始时间, 通常情况下和`console.timeEnd(label)`配合使用.

####console.timeEnd(label)
结束定时器, 记录输出. 示例:

	console.time('1000-elements');
	for (var i = 0; i < 1000; i++) {
	  	;
	}
	console.timeEnd('1000-elements');

####console.trace(label)
在当前的`stderr`位置打印一个堆栈信息.

####console.assert(expression, [message])
和[assert.ok()](http://nodejs.org/docs/latest/api/assert.html#assert_assert_value_message_assert_ok_value_message)一样, 当一个假设表达式为`false`时,抛出一个`AssertionError`信息.

最后用一张截图来展示console调用不同方法的表现, 因为在普通控制台没什么大的差别, 所以使用Chrome的console来表现!  
![console](http://dolphinboy.me/resources/chrome-console-node-test.png)


###参考:
翻译自:[console api](http://nodejs.org/docs/latest/api/stdio.html)  
console在JavaScript中的表现稍有不同, 具体请参考:[Firebug控制台详解](http://www.ruanyifeng.com/blog/2011/03/firebug_console_tutorial.html)