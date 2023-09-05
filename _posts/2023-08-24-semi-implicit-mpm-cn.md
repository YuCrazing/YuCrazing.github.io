---
layout: latex_style
title: "二维半隐式mpm时间积分求解器推导"
author: Yu Zhang
custom_date: April 2023
abstract: "本文给出了二维半隐式mpm时间积分求解器的详细推导，并对实验结果进行了分析。"
hidden: false
---

# Introduction
如今常见的mpm的隐式方法均为基于能量的全隐式方法，并且常常使用 matrix free 的求解方法来避免对刚度矩阵的显式构造。本文给出了一个半隐式方法的二维全部推导过程，另外为了让方便读者更直观的理解刚度矩阵的形式，本文提供了刚度矩阵的的计算方法和其显式形式。

# 什么是半隐式时间积分？

本章对时间积分的显式、半隐式和全隐式方法进行了介绍。

## 显式时间积分
<p>
在物理仿真中，时间积分的离散化有多种方法，最简单的是显式时间积分，如辛欧拉方法为

$$
\begin{aligned}
\mathbf{v}^{n+1} &= \mathbf{v}^{n} + \frac{\mathbf{f}^n}{m} \Delta t
\\
\mathbf{x}^{n+1} &= \mathbf{x}^{n} + \mathbf{v}^{n+1} \Delta t
\end{aligned}
\\
$$
其中上标 $n$ 表示变量在第 $n$ 个离散时刻的值，上标 $n+1$ 表示变量在第 $n+1$ 个离散时刻的值。
</p>

## 隐式时间积分
<p>
隐式方法通常需要求解一个方程组，如后向欧拉法为

$$
\begin{equation}
\begin{aligned}
\mathbf{v}^{n+1} &= \mathbf{v}^{n} + \frac{\mathbf{f}^{n+1}}{m} \Delta t
\\
\mathbf{x}^{n+1} &= \mathbf{x}^{n} + \mathbf{v}^{n+1} \Delta t
\end{aligned}
\end{equation}
$$

以这两个式子为基础，可以引出全隐式和半隐式方法。
</p>

### 全隐式时间积分
<p>
基于能量的求解器是一种全隐式方法：

$$
\begin{aligned}
E(\mathbf{v}) = \frac{1}{2} m ||\mathbf{v}-\mathbf{v}_n||^2 + e(\mathbf{x}_n + \Delta t \mathbf{v})
\end{aligned}
\\
$$
该全隐式方法可以使用牛顿法来求解。
</p>


### 半隐式时间积分
本文要介绍的半隐式方法也是在 公式 1 的基础上得到的。我们使用泰勒公式对 $f_{n+1}$ 进行


## 为什么要使用半隐式时间积分？

 
[1]: {{ site.ImgDir }}/PDE/transport.gif
[2]: {{ site.ImgDir }}/PDE/laplace.gif
[3]: {{ site.ImgDir }}/PDE/heat.gif
[4]: {{ site.ImgDir }}/PDE/wave_1200_16.gif
