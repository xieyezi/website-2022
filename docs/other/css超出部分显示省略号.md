---
title: css超出部分显示省略号
tags:
  - CSS
---

### 超出部分显示为省略号
  我们经常遇见要展示一行或者多行内容，超出部分会让我们的页面变得很难看，所以我们需要设置一下超出部分显示省略号。
  - 内容为一行   



  ``` css
  overflow: hidden;//把超出的内容进行隐藏
  text-overflow:ellipsis;设置超出内容为省略号
  white-space: nowrap;//设置内容不换行
  ```
  <!-- more -->
  - 内容为两行     


  ``` css
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  ```
  其实原理很简单，主要是针对行内元素进行限制，如果超过了一行的宽度，则显示为省略号，所以你也可以自己设定宽度:
  ```css
  width:500px;
  ```

  ### 块级元素与行内元素
  我们知道，HTML分为块级元素和行内元素，其中
  - 块级元素有：body  from  select  textarea  h1-h6 html table  button  hr  p  ol  ul  dl  cnter  div
  - 行内元素有：heda   meat   title  lable  span  br  a   style  em  b  i   strong       


  块级元素和行内元素的主要区别是行内元素书写完成后不会自动换行，并且元素没有宽和高。块级元素写完后会自动换行，有宽高可以修改。
  那我们如何将块级元素转化为行内元素呢？
  ``` CSS
  display：inline-block
  ```
  那如何将行内元素转化为块级元素呢？
  ``` CSS
  display：block
  ```
