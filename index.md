---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
<!-- title: YuCrazing's Blog -->
title: YuCrazing's 博客
index: true
---
# [](#header-1)Posts


{% for post in site.posts %}
{% unless post.hidden %}
-   ### [{{ post.title }}]({{ post.url }}) 



{{ post.excerpt }}

<div style="text-align: center;"><p>{{ post.date }}</p></div>
<!-- <div style="text-align: center;"><p>______________</p></div> -->
<!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
{% endunless%}
{% endfor %}

<!-- [Midnight 介绍](intro)


<!-- # [](#header-1)Links
[Midnight 介绍](intro)

[Jekyll 中文网站](http://jekyllcn.com/)
 -->