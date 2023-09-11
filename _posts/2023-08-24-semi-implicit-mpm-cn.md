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
$$
该全隐式方法可以使用牛顿法来求解。
</p>


### 半隐式时间积分
<p>
本文要介绍的半隐式方法也是在 公式 1 的基础上得到的。我们使用泰勒公式对 $f_{n+1}$ 进行近似展开再进行求解：
$$
\begin{aligned}
\mathbf{f}^{n+1} &= \mathbf{f}(\mathbf{x}^n + \Delta t \mathbf{v}^{n+1})
                 &= \mathbf{f}^n + \Delta t \mathbf{v}^{n+1} \frac{\partial \mathbf{f}}{\partial \mathbf{x}} (\mathbf{x}^n)
\end{aligned}
$$
</p>


## 为什么要使用半隐式时间积分？
在显式时间积分中，在模拟时间步长不变的情况下，当刚度较大时，系统会出现 overshooting 的情况。即速度在数值上会出现很大的震荡，可能会波动到正无穷而导致模拟失败。在显式方法中，只能通过减小时间步长来解决这个问题，但当时间步长非常小时，会导致模拟性能严重下降。而隐式方法可以有效解决这个问题，我们之所以选择半隐式方法是因为在常见的材料刚度范围内，半隐式方法已经足够支持以较大的步长进行稳定模拟，而不需要全隐式方法。


# 半隐式方法的推导
<p>
从公式中可以看出，最重要的一步是求解出 $\frac{\partial \mathbf{f}}{\partial \mathbf{x}} (\mathbf{x}^n)$ 这一项。这一项在一些数值方法中可以避免显式构造（如共轭梯度法）。据作者所知，目前网络上公开的mpm实现中，使用的都是cg方法从而绕开了对该项的显式计算，并没有人给出其显示形式。今天我们会显式地将其求解出来以方便大家理解。我们的大概思路是将这个比较复杂的公式拆成若干个相互独立的部分，对每个部分分开进行推导，更便于理解。

在 mpm 框架中，该项在离散化之后可以写成： 

$$
\frac{\partial \mathbf{f}_i}{\partial \mathbf{x}_j} (\mathbf{x}^n) = \frac{\partial^2 e}{\partial \mathbf{x}_i \mathbf{x}_j} (\mathbf{x}^n) = - \sum_p \frac{\partial^2 e_p}{\partial \mathbf{x}_i \mathbf{x}_j} (\mathbf{x}^n) = - \sum_p V_p \frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j} (\mathbf{x}^n)
$$

其中，下标 $i$ 和 $j$ 表示网格格点的编号，下标 $p$ 表示粒子的编号。从上式可以看出，我们只需要计算出每一个粒子对该项的贡献即可。接下来最关键的部分就是对 $\frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j} (\mathbf{x})$ 的推导，以下为了方便省略参数 $\mathbf{x}$。根据链式法则：

$$
\frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j} = \frac{\partial \Psi_p}{\partial \mathbf{F}_p} : \frac{\partial^2 \mathbf{F}_p}{\mathbf{x}_i \mathbf{x}_j} + \frac{\partial^2 \Psi_p}{\partial \mathbf{F}_p \mathbf{F}_p} : \frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_i} : \frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_j}
$$

其中，符号 $:$ 表示 tensor contraction，即为张量沿两个维度的内积。这里为了书写方面我没有写对应的唯独，在实现 contraction 时注意不要选错了维度。

接下来我们以 mls-mpm 和 fixed-corotated 模型为例继续下面的推导。

对于 mls-mpm 来说，上面这个式子的第一项可以去掉，因为 $\frac{\partial^2 \mathbf{F}_p}{\mathbf{x}_i \mathbf{x}_j}$ 这一项的值为0。接下来我们来证明这一点。在 mls-mpm 中，形变梯度 $\mathbf{F}_p$ 的形式为：

$$
\mathbf{x}_i = \mathbf{x}_i^n + \Delta t \mathbf{v}_i
\\
\mathbf{C}_p(\mathbf{x}) = \frac{4}{\Delta \mathbf{x}^2} \sum_i w_{ip}^n \mathbf{v}_i (\mathbf{x}_i^n - \mathbf{x}_p^n)^T
\\
\mathbf{F}_p(\mathbf{x}) = (\mathbf{I} + \Delta t \mathbf{C}) \mathbf{F}_p^n
$$

计算后可知 $\frac{\partial^2 \mathbf{F}_p}{\mathbf{x}_i \mathbf{x}_j} = 0$。事实上，该结论对 traditional mpm 同样成立。于是我们的得到了

$$
\frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j} = \frac{\partial^2 \Psi_p}{\partial \mathbf{F}_p \mathbf{F}_p} : \frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_i} : \frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_j}
$$

</p>

## 计算 $\frac{\partial^2 \Psi_p}{\partial \mathbf{F}_p \mathbf{F}_p}$

<p>
这一项只与本构模型有关，与算法无关。接下来我们将以 fixed-corotated 模型为例，对$\frac{\partial^2 \Psi_p}{\partial \mathbf{F}_p \mathbf{F}_p}$ 这一项进行推导。对于一个旋转不变且各项同性的本够模型，我们可以使用形变梯度 $\mathbf{F}_p$ 的特征值 $s_1, s_2$ 及其旋转分量分量 $u_1, v_1$ 来建立 $\mathbf{F}_p$ 各个分量与 $\Psi_p$ 之间的关系。对于 2D 的情况，我们可以使用一个 mathematica 程序来计算该项。这个程序基于 jiang 老师 mpm course 里提供的一个类似的 mathematica 程序。不过 jiang 老师的原程序并不能直接满足我们的需求，原程序是计算该项在 $u_1->0, v_1->0$ 时的值。这里直接将修改后的程序提供给大家：
</p>

``` 
var ={ s1 , s2 , u1 , v1 } ;
S=DiagonalMatrix [ { s1 , s2 } ] ;
U= { { Cos [ u1 ] , - Sin [ u1 ] } , { Sin [ u1 ] , Cos [ u1 ] } } ;
V= { { Cos [ v1 ] , - Sin [ v1 ] } , { Sin [ v1 ] , Cos [ v1 ] } } ;
F=U. S . Transpose [V ] ;
dFdS=D[ Flatten [ F ] , { var } ] ;
dSdF= Inverse[ dFdS] ;
(* fixed corotated model: mu and la are Lamé coefficients *)
Phat=DiagonalMatrix [ { 2*mu*(s1-1)+la*(s1*s2-1)*s2,  2*mu*(s2-1)+la*(s1*s2-1)*s1} ] ;
P=U. Phat . Transpose [V ] ;
dPdS=D[ Flatten [ P ] , { var } ] ;
dPdF=Simplify[ dPdS . dSdF ] 
```
这个式子最终计算出来之后大概长这样：

![][1]

我已经替大家抄了一遍这个式子，代码在[这里](https://gist.github.com/YuCrazing/52b4e5dbf98a6c4ea9b0d348a9a5ec02)。


## 计算 $\frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_i} $

这一项与本构模型无关，与算法的选取有关。对于 mls-mpm 和 traditional-mpm，该项的结果是不同的。该项的推导相对比较简单。这里我们以 mls-mpm 为例，其他 mpm 方法如 traditional mpm 也与此类似。为了方便起见，这里我们也使用 mathematica 来推导：

```
(*constants*)
id=IdentityMatrix[2];
Fp = {{F00, F01},{F10, F11}};
wi={wi0, wi1};
wj={wj0, wj1};
xp = {xp0, xp1};
xxi0 = {xii0, xii1};
xxj0 = {xjj0, xjj1};

(*variables*)
xi = {xi0, xi1};
v = (xi-xx0)/t;
xj = {xj0, xj1};
vj = (xj-xxj0)/t;

factor=4*invdx*invdx;

F =FullSimplify[ (id+t*factor*(Outer[Times,v,xx0-xp]*wi + Outer[Times,vj,xxj0-xp]*wj)).Fp];
dFdxi = FullSimplify[D[Flatten[F],{xi}]]
```

结果大概长这样：

![][2]

## 组装
</p>
现在我们有了 $\frac{\partial^2 \Psi_p}{\partial \mathbf{F}_p \mathbf{F}_p}$ 和 $\frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_i} $，便可以在代码中按照如下方式计算 

$$
\frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j} = \frac{\partial^2 \Psi_p}{\partial \mathbf{F}_p \mathbf{F}_p} : \frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_i} : \frac{\partial \mathbf{F}_p}{\partial \mathbf{x}_j}
$$

如果你想绕开上面拆分的两步而直接一步得到最终结果 $\frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j}$ 也是可以的。在 mathematica 里使用下面的代码就可以一步得到 $\frac{\partial^2 \Psi_p}{\partial \mathbf{x}_i \mathbf{x}_j}$ 的公式 （在下面代码中使用 $K$ 来表示该项）：
</p>

```
dFdxi = FullSimplify[D[Flatten[F],{xi}]]
dFdxj = FullSimplify[D[Flatten[F],{xj}]];
A = TensorContract[TensorProduct[dPdF,dFdxi],{{2,3}}];
K = TensorContract[TensorProduct[A,dFdxj],{{1,3}}]
```

这样虽然可以推到出最终的结果公式，但是我个人不建议这样做，因为分开各项独立计算更方便定位错误，并且能够更方便地将每个模块更换为其他本构模型或者mpm算法。

# 实验就跟


[1]: {{ site.ImgDir }}/PDE/transport.gif
[2]: {{ site.ImgDir }}/PDE/laplace.gif
[3]: {{ site.ImgDir }}/PDE/heat.gif
[4]: {{ site.ImgDir }}/PDE/wave_1200_16.gif
