---
layout: post
title: HTML中input标签的 readonly 属性
description: 今天做项目的时候遇到这个奇怪的问题,查了查资料,写篇文章以做备忘
category: blog
tags: log
keywords: HTML,input,readonly
---

#定义和用法
readonly 属性规定输入字段为只读。
只读字段是不能修改的。不过，用户仍然可以使用 tab 键切换到该字段，还可以选中或拷贝其文本。
readonly 属性可以防止用户对值进行修改，直到满足某些条件为止（比如选中了一个复选框）。然后，需要使用 JavaScript 消除 readonly 值，将输入字段切换到可编辑状态。
readonly 属性可与 `<input type="text">` 或 `<input type="password">` 配合使用。

#实例
带有两个文本字段和一个提交按钮的 HTML 表单：
<script type="syntaxhighlighter" class="brush: html"><![CDATA[
	<form action="/xxx" method="get">
		Name:<input id="name" type="text" />
		Country:<input type="text" name="country" value="China" readonly="readonly" />
		<input type="submit" value="Submit" />
	</form>
]]></script>
#语法

    <input readonly="value">

##值描述
>readonly	把输入字段设置为只读

#JavaScript操作
在JS中readonly属性比较奇怪，直接创建一个对象，给该对象赋值readonly属性不能够向HTML中一样使用下面的方式：

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = "ttttt";
    nameInput.id = "xy";
    nameInput.readonly="readonly";

这样创建的对象并不是只读的,当然也不能这样:

    var nameInput = document.getElementById("name");
    nameInput.readonly = "readonly";

正确的写法是:

    nameInput.readonly = true;

或者

    nameInput.readonly = true;

#结语
好多标签都有一些特殊的情况,看来以后要慢慢学习积累经验,至于深层原因还没来得及研究,如果有大虾路过,请指教...