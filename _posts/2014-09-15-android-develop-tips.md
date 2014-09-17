---
layout: post
title:Android 开发Tips
description: 介绍Android开发时的注意点!
category: blog
tags: Android
keywords: Android,App,性能与安全
---


1、模块间有消息需要传递时，使用LocalBroadcastManager替代Listener进行模块解耦。除了解耦，这样发送消息和执行消息差一个线程循环，可以减小方法的调用链，我这就碰到一次方法调用链太长导致StackOverflow的问题。


2、静态变量不要直接或者间接引用Activity、Service等。这会使用Activity以及它所引用的所有对象无法释放，然后，用户操作时间一长，内存就会狂升。


3、Handler机制有一个特点是不会随着Activity、Service的生命周期结束而结束。也就是说，如果你Post了一个Delay的Runnable，然后在Runnable执行之前退出了Activity，Runnable到时间之后还是要执行的。如果Runnable里面包含更新View的操作，程序崩溃了。


4、不少人在子线程中更新View时喜欢使用Context.runOnUiThread，这个方法有个缺点，就是一但Context生命周期结束，比如Activity已经销毁时，一调用就会崩溃。


5、SharedPreferences.Editor.commit这个方法是同步的，一直到把数据同步到Flash上面之后才会返回，由IO操作的不可控，尽量使用apply方法代替。apply只在API Level>=9才会支持，需要做兼容。


6、PackageManager.getInstalledPackages这个方法经常使用，你可能不知道，当获取的结果数量比较多的时候，在某些机型上面调用它花费的时间可能秒级的，所以尽量在子线程中使用。另外，如果结果太多，超过系统设置的Binder数据最大传输量的上限，则会发生TransactionException，如果你使用这个方法获取机器上的己安装应用列表，最好做一下预防。


7、如果使用Context.startActivity启动外部应用，最好做一下异常预防，因为寻找不到对应的应用时，会抛出异常。如果你要打开的是应用内的Activity，不防使用显式Intent，这样能提高系统搜索目标Activity的效率。


8、Application的生命周期就是进程的生命周期。只有进程被干掉时，Application才会销毁。哪怕是没有Activity、Service在运行，Application也会存在。所以，为了减少内存压力，尽量不要在Application里面引用大对象、Context等。

转载:http://blog.csdn.net/a345017062/article/details/17536043