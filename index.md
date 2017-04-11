---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults

index: true
---

# [](#header-1)Posts

{% for post in site.posts %}
{% unless post.hidden %}
-   ### [{{ post.title }}]({{ post.url }}) 


<!-- {{ post.excerpt }} -->

<div style="text-align: right;"><p>{{ post.date | date_to_long_string }}</p></div>

<!-- <div style="text-align: center;"><p>______________</p></div> -->
<!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
{% endunless%}
{% endfor %}
