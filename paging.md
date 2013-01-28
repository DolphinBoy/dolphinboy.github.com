---
layout: page
title: index list
---

{% for post in paginator.posts %}
   <!-- here add you post markup -->
   <h1><a href="{{ post.url }}">{{ post.title }}</a></h1>
   <p class="author">
    <span class="date">{{post.date}}</span>
  </p>
  <div class="content">
    {{ post.content }}
  </div>
{% endfor %}