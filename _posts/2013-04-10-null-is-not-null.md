---
layout: post
title: NULL IS NOT NULL
description: 其实NULL认识你,但你不一定真的认识NULL.
category: blog
tags: others
keywords: null,empty
---

##示例
诡异的例子...
####Java:
<script type="syntaxhighlighter" class="brush: java; toolbar: false;"><![CDATA[
public static void main(String\[\] args) {
	System.out.println(null == null);
	System.out.println(null != null);
}
]]></script>
console:  
true  
false

####JavaScript: 
<script type="syntaxhighlighter" class="brush: js; toolbar: false;"><![CDATA[
console.log(null == null);
console.log(null != null);
]]></script>
console:  
true  
false

####SQL:
<script type="syntaxhighlighter" class="brush: sql; toolbar: false;"><![CDATA[
select * from app_user where null == null;
select * from app_user where null != null;
]]></script>
console:  
false  
false


##解析
元方,你怎么看?
>""：意思是空字符串，我们都知道它和 null 是不相等的，简单的讲是因为空字符串是个值，而null不是一个值。

###Java中的null:
- null 是代表不确定的对象  
<script type="syntaxhighlighter" class="brush: java; toolbar: false;"><![CDATA[
int num = null;  //是错误的
Ojbect o = null;  //是正确的
]]></script>
>
- null 本身不是对象，也不是Objcet的实例。  
<script type="syntaxhighlighter" class="brush: java; toolbar: false;"><![CDATA[
System.out.println(null instanceof java.lang.Object);
]]></script>
console:  
false  

因为 null 代表不确定的对象，然后它本身不是对象，所以任何等于 null 的对象都是相等的：  
<script type="syntaxhighlighter" class="brush: java; toolbar: false;"><![CDATA[
String s1 = null;
String s2 = null;
System.out.println(s1 != s2);
]]></script>
console:  
true  
所以`null == null`为真，这也是Set只能有一个 null 和Map的key只能有一个 null 的原因了。

###JavaScript中的null:
- null 是一种特殊的 Object  
<script type="syntaxhighlighter" class="brush: js; toolbar: false;"><![CDATA[
console.log(typeof(null));
]]></script>
console:  
object

在JavaScript中数据类型 null 只有一个值：null  
<script type="syntaxhighlighter" class="brush: js; toolbar: false;"><![CDATA[
console.log(null);
]]></script>
console:  
null
所以:
<script type="syntaxhighlighter" class="brush: js; toolbar: false;"><![CDATA[
console.log(null == null);  //为真
console.log(null != null);  //为假
]]></script>

###SQL中的null:
- null 用作未知的或不适用的值的占位符  
请看下面的 "Persons" 表：
<table>
	<tr>
		<td>Id</td><td>LastName</td><td>FirstNam</td><td>Address</td><td>City</td>
	</tr>
	<tr>
		<td>1</td><td>Adams</td><td>John</td><td></td><td>London</td>
	</tr>
	<tr>
		<td>2</td><td>Bush</td><td>George</td><td>Fifth Avenue</td><td>New York</td>
	</tr>
	<tr>
		<td>3</td><td>Carter</td><td>Thomas</td><td></td><td>Beijing</td>
	</tr>
</table>
假如 "Persons" 表中的 "Address" 列是可选的。这意味着如果在 "Address" 列插入一条不带值的记录，"Address" 列会使用 null 值保存，这就是 null 作为占位符的意义。

- null 值的处理方式与其他值不同  
无法使用比较运算符来测试 NULL 值，比如 `=, <,` 或者 `<>`。  
我们必须使用 `IS NULL` 和 `IS NOT NULL` 操作符。
这两点也说明 null 不是一个值,所以无论 `null == null` 或者 `null != null` 都为假。
其实有点儿像JavaScript里面的NaN.

###结语
感觉自己总结的并不是很好,有时间还要继续深入,也请各位读者多提建议,可以分享一下自己的理解.

###参考
Java：  
http://lavasoft.blog.51cto.com/62575/79243  
JavaScript:  
http://www.cnblogs.com/meil/archive/2006/12/01/578868.html  
http://www.cnblogs.com/qiantuwuliang/archive/2010/01/12/1645302.html  
SQL:  
http://www.w3school.com.cn/sql/sql_null_values.asp

