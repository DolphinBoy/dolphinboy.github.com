---
layout: post
title: Git Errors Collection.
description: 收集在使用TortoiseGit和Git过程中遇到的异常和解决方法.
category: blog
tags: git
keywords:git,TortoiseGit
---

在拉取的时候出现错误, 并且主要错误信息是下面的这段提示:

    early EOF fatal: The remote end hung up unexpectedly fatal: index-pack failed error: RPC failed; result=18, HTTP code = 200

这个错误应该是`https`导致的问题, 具体原因还不清楚, 不过可以把项目的远程版本库地址改为:`git@github.com:xxxxx.git`试试.

本文持续更新中...