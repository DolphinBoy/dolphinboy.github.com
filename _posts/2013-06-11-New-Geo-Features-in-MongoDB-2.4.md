---
layout: post
title: MongoDB2.4中新的几何图形处理特性
description: 前一段时间MongoD更新到了2.4其中的几何图形处理特性在地图上的应用让我心动,所以就翻译了一下,好让自己深入的去了解这个特性,有助于以后项目中使用.
category: blog
tags: mongodb,translate
keywords: MongoDB,Geo,职业计划,Features,2.4
---

###目的
几何处理作为一个研究领域有很多相关的应用, 并且产生了大量的研究成果以及强大的工具。许多现代的web应用程序都有基于位置的组件, 并且需要一个数据存储引擎, 能够管理几何信息。通常这需要在你的基础设施中引入一个额外的存储引擎进, 并且它必须能够支持耗时这样昂贵的操作。

MongoDB有一组几何存储和搜索[特性](http://docs.mongodb.org/manual/core/geospatial-indexes/)。[MongoDB 2.4版本](http://blog.mongodb.org/post/45754637343/mongodb-2-4-released)改进现有的地理能力并且引进了`2dsphere` [索引](http://docs.mongodb.org/manual/core/2dsphere/)。

主要的概念上的差别(虽然也有许多功能差异)在`2d`和`2dsphere`索引, 这是被认为是两种不同类型的坐标系统。[平面坐标系统](http://en.wikipedia.org/wiki/Cartesian_coordinate_system)对于某些应用程序是有用的, 它可以作为一个简化的近似球面坐标。当你考虑更大的几何图形, 或考虑几何图形在子午线和极点附近等, 这就让使用适当的[球面坐标](http://en.wikipedia.org/wiki/Spherical_coordinates)就变得很重要。

除了这个主要概念上的差异,也有显著的功能性差异, 这些差异在于它更深入的概述了[地理空间索引和查询](http://docs.mongodb.org/manual/reference/operator/query-geospatial/)部分的MongoDB文档。这篇文章将讨论这个被添加到2.4版本中的新特性。

###最新特性
####存储非点源几何图形

与`2d`指数不同, 它只允许储存点, `2dsphere`索引允许存储和查询的点、线和多边形。为了支持存储不同的几何图形, 而不是引入专有格式, MongoDB符合[GeoJSON](http://geojson.org/)标准。GeoJSON是一个协作的社区项目, 并且对于在JSON实体定义了规范编码。这个规范已经获得了很大的支持, 包括项目[OpenLayers project](http://openlayers.org/dev/examples/vector-formats.html), [PostGIS](http://www.postgis.org/), 并且已经被python和ruby语言所支持。

这里有几个简单关于GeoJSON嵌入文档的例子:

GeoJSON 点 嵌入到 `geo` 域里面的一个BSON文档:

	{
        geo: {
            type: “Point”,
            coordinates: [100.0, 0.0]
        }
    }

GeoJSON 线 嵌入到 `geo` 域里面的一个BSON文档:

	{
        geo: {
            type: “LineString”,
            coordinates: [ [100.0, 0.0], [101.0, 1.0] ]
        }
    }

GeoJSON 面 嵌入到 `geo` 域里面的一个BSON文档:

	{
        geo: {
            type: “Polygon”,
            coordinates: [
                [ [100.0, 0.0], [101.0, 0.0],
                  [101.0, 1.0], [100.0, 1.0],
                  [100.0, 0.0] ]
            ]
        }
    }

>
注意:一个`GeoJSON`的多边形的组成是一个二维数组。每个数组的点应该有相同的起始和结束点来形成一个封闭的循环。第一个数组定义多边形的点规范的外部几何形状, 每个后续的一系列点在多边形中定义了一个“空白区”。多边形应该非自相交多边形, 空白区应该应该被多边形完全包含。

####搜索一个球体
新的`$geoWithin`函数接受一个多边形几何作为一个说明符, 返回任何类型的任何多边形几何图形。不需要任何索引它一样可以很好的使用, 但必须看每个文档集合中这样做(这地方不是很懂啊!)。

####球面上的几何图形相交
新的`$geoIntersects`函数以任何几何作为一个说明符, 返回任何几何图形, 具有一个非空的交叉与说明符。`$geoIntersects`在没有任何索引的情况下依然可以很好的使用, 也必须看看每个文档集合中(这地方也不是很懂!)。

####更好地支持复合索引
`2d`索引只能用于一个复合索引如果 1.它是第一个字段 2.确切地说,有两个字段在复合索引中 3.第二个字段不是一个`2d`索引。`2dsphere`索引并不局限在这种方式, 它允许我们基于非地理域l来预先过滤——这通常是更有效的。

考虑下面的查询: 找到Hot Dog Stands在纽约州, 即使用复合指数:(业务类型、位置)。在纽约州找到属于Hot Dog Stands的几何图形, 即使用复合指数:(位置、业务类型).

第一个查询会更加的效率比第二个, 因为业务类型是一个简单的文本字段, 并大大减少了使用几何图形来搜索的范围。

此外, 我们可以有多个`2dsphere`索引在同一个复合索引中。这允许像这样来查询:“从肯尼迪机场找到路线与开始位置在50英里, 和结束位置在100英里的YYC”。

###它是如何工作的
当你插入一个几何到`2dsphere`索引时一切都开始了。我们使用开源`s2` [C++ library](https://code.google.com/p/s2-geometry-library/)从谷歌来选择一组简洁的单元格完全覆盖一个几何图形。这组网状单元格格叫做遮盖物, 单元格的大小是动态的(介于500和100公里在侧)基于被覆盖的多边形的大小。

![fig 3](http://media.tumblr.com/e39f546479a86456868450b1c484ee02/tumblr_inline_mn4hfrRnhd1qz4rgp.png)

图3 -一个非常低的粒度覆盖整个国家

![fig 4](http://media.tumblr.com/8ff6c16d3c9c27fd8090c9dc84573efd/tumblr_inline_mn4hg3y3Ml1qz4rgp.png)

图4 -一个相当颗粒覆盖的A4, 围绕在特拉法加广场。

现在这些覆盖物上的每个单元格添加到一个标准的`B-tree`索引, 这里的关键是能够很容易计算球体表面的位置——同一区域的球体的表面, 小单元格的上一层是一个更大的单元格。


###路口和搜索
根据搜索条件来生成一个覆盖物, 并且对于每个被覆盖的单元格, 都通过`B-tree`来查询和几何图形有交互的单元格, 这样就让搜索交叉的图形变得容易多了。列出所有可能相互作用的几何图形检索的索引, 每个几何图形在依次检查, 看它是否应该被包括在结果集。

###附近搜索
附近搜索提供了`$near`操作, 它实现了`$within`, 实现了附近运营商做搜索框架-中心内美元增长甜甜圈(圆的多边形与圆形孔)。

我们鼓励用户反馈和测试这些新的地理特性并且很高兴看到社区构建。

地图图像ⓒ[OpenStreetMap](http://www.openstreetmap.org/copyright)贡献者, 使用[Commons Attribution-ShareAlike 2.0](http://creativecommons.org/licenses/by-sa/2.0/)许可证(cc通过sa)。

地图数据ⓒ[OpenStreetMap](http://www.openstreetmap.org/copyright)贡献者, 使用[开放数据共享开放数据库许可证](http://opendatacommons.org/licenses/odbl/)(ODbL)。

###视频介绍:
<img style="visibility:hidden;width:0px;height:0px;" border=0 width=0 height=0 src="http://c.gigcount.com/wildfire/IMP/CXNID=2000002.11NXC/bT*xJmx*PTEzNjk5ODM1NjI*NzMmcHQ9MTM2OTk4MzYxMjE5NyZwPSZkPSZnPTImbz*1MTcyOWRkNDYzZGU*NGJiOGQwMTY3Yjk1/ZWQwN2E4YiZvZj*w.gif" /><object name="kaltura_player_1369983556" id="kaltura_player_1369983556" type="application/x-shockwave-flash" allowScriptAccess="always" allowNetworking="all" allowFullScreen="true" height="330" width="400" data="http://www.kaltura.com/index.php/kwidget/wid/0_nfib3169/uiconf_id/48501"><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="allowFullScreen" value="true" /><param name="bgcolor" value="#000000" /><param name="movie" value="http://www.kaltura.com/index.php/kwidget/wid/0_nfib3169/uiconf_id/48501"/><param name="flashVars" value=""/><a href="http://corp.kaltura.com">video platform</a><a href="http://corp.kaltura.com/video_platform/video_management">video management</a><a href="http://corp.kaltura.com/solutions/video_solution">video solutions</a><a href="http://corp.kaltura.com/video_platform/video_publishing">video player</a></object>


[原文](http://blog.mongodb.org/post/50984169045/new-geo-features-in-mongodb-2-4?mkt_tok=3RkMMJWWfF9wsRovs67NZKXonjHpfsX74%2BktX6C1lMI%2F0ER3fOvrPUfGjI4JS8FnI%2BSLDwEYGJlv6SgFSrHCMahnybgIUhI%3D)

###参考
[GeoJSON](http://geojson.org/)