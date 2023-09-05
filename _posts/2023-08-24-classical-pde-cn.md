---
layout: latex_style
title: "数个经典偏微分方程：数值解和精确解"
author: Yu Zhang
custom_date: April 2023
abstract: "我们对数个经典偏微分方程进行了分析：传输方程、Laplace方程、热传导方程和波动方程，对比了其在二维空间上的精确解和数值解。"
hidden: true
---

# Introduction


物理仿真领域往往涉及到偏微分方程的数值求解，之所以使用数值方法求解偏微分方程是因为偏微分方程的精确求解通常需要按照具体形式单独分析，往往难以显式写出。为了展示数值解和精确解的区别，这里我们来展示数个经典偏微分方程的数值解和精确解。为了方便可视化，我们展示的算例都是二维空间的形式。所有的代码实现都可以在 [这里](https://github.com/YuCrazing/PDE) 找到。

 
# Transport Equation

<p>
Transport Equation 也叫 Advection Equation。其初始值问题如下：
$$
\\
\begin{cases}
      u_t + \mathbf{b} \cdot Du = 0 & \text{in} \ R^n \times (0, \infty)\\
      \quad \quad \quad \quad \  u = g &\text{on} \ R^n \times \{t=0\}
\end{cases}  
$$
其中，
$\mathbf{b}$ 是一个 $R^n$ 的固定向量， $\mathbf{b} = (\mathbf{b}_1, \cdots, \mathbf{b}_n)$ 。 $u:R^n \times  [0, \infty) \rightarrow R$ 是待求的函数， $u=u(\mathbf{x}, t)$。这里的变量 $\mathbf{x} \in R^n$ 表示空间中的一个点， 变量 $t \geq 0$ 表示时间。$u_t$ 表示 $u$ 关于时间变量 $t$ 的导数。$Du = D_{\mathbf{x}}u = (u_{\mathbf{x}_1}, \cdots, u_{\mathbf{x}_n})$ 是 $u$ 关于空间变量 $\mathbf{x}$ 的梯度。
</p>

## 精确解
对于传输方程的初始值问题，其分析解为 

<p>
$$
u(\mathbf{x}, t) = g(\mathbf{x} - \mathbf{b}t),\quad (\mathbf{x} \in R^n, t \geq 0)
$$
</p>

## 数值解
<p>
对于求解传输方程，一个最简单的方法数值方法是 forward time-centered space (FTCS) 方法，该方法是一种有限差分方法：使用前向欧拉方法对时域进行离散化，使用中心欧拉方法对空间进行离散化。以二维为例，我们使用 $u^{n}_{i, j}$ 表示函数 $u$ 在 $n$ 时刻在网格点 $(i, j)$ 的数值，时间步长为 $\Delta t$，单个网格边长为 $\Delta x$，则有

$$
\frac{u^{n+1}_{i, j} - u^n_{i, j}}{\Delta t} + \mathbf{b} \cdot (\frac{u^n_{i+1, j}-u^n_{i-1, j}}{2 \Delta x}， \frac{u^n_{i, j+1}-u^n_{i, j-1}}{2 \Delta x}) = 0
$$
</p>

### Stability Analysis
在实践中，我们会注意到 FTCS 方法是无条件不稳定的，为了解决这个问题，我们可以将空间上的中心差分改成上风格式。之后，数值方法便可以变为有条件稳定的方法。

## 案例
<p>
一个二维例子：我们取 
$$
\begin{aligned}
&\mathbf{b} = (1, 1), 
\\
&\begin{cases}
      g(\mathbf{x}) = 1, &|\mathbf{x}| \leq 10 \\
      g(\mathbf{x}) = 0, &|\mathbf{x}| > 10
\end{cases}
\end{aligned}
\\
$$
这里 $g$ 并不是 $C^1$ 连续的，但是为了实现上更方便，我们选取了一个不连续的函数。
</p>

数值解和精确解的比较结果如下：

![Animation][1]

其中图1是 FTCS 方法，图2是上风格式，图3是精确解。从实验结果中可以看出， FTCS 发生了数值发散。上风格式保持了稳定性。


## 物理解释

<p>
传输方程描述的是在欧拉视角下，分布在空间中的每个固定点上的其物理量 $u$ 在一个速度场的作用下随时间的变化。从分析解可以看出，传输方程的 $b$ 数值即为速度场的速度，这也是为什么上面的案例中，圆形区域向右上角移动的原因。另一方面，传输方程可以与物理导数相关联。物质导数的形式为：

$$
\frac{Du}{Dt} = \frac{\partial u}{\partial t} + \mathbf{b} \cdot \nabla u
$$


因此，传输方程在物质导数等于0（物理量本身没有变化）时，物理量在外界速度场的作用下，随时间的变化。
</p>

# Laplace's Equation
<p>
Laplace's equation 是 Poisson equation 的一个特例：
<!-- $$
\begin{cases}
      \nabla^2 u = 0 & \text{in} \ U\\
      \quad \ u = g &\text{on} \ \partial U
\end{cases}
\\
$$ -->
$$
\left\{
\begin{eqnarray}
      \nabla^2 u &=& 0 & &\text{in} \ U\\
                u &=& g & &\text{on} \ \partial U
\end{eqnarray}
\right.
$$
其中，$u:\bar{U} \rightarrow R$ 是待求的函数， $u=u(\mathbf{x})$。$U \subset R^n$ 是一个给定的开集。$\nabla^2 u = \sum_{i=1}^n u_{\mathbf{x}_i \mathbf{x}_i}$。
</p>

## 精确解
有多种方法可以求解 Laplace's equation 的精确解，包括 Green 函数方法，或者变量分离法。因为过程比较冗长，这里不再展开。一个使用分离变量方法在极坐标下的求解过程可以见这个[二维案例](https://www.math.usm.edu/lambers/mat417/class0425.pdf)。

## 数值解

本章节中，我们分别使用 jacobi 迭代法、Walk-on-spheres 方法和 Walk-on-boundary 方法对 Laplace 方程进行求解。

### Jacobi 方法
<p>
一个简单的方法是使用 jacobi 迭代法使得方程收敛到最终的解，我们使用 $u^n$ 表示 jacobi 第 $n$ 次迭代的结果。另外我们使用空间中的中心差分方法对 $\nabla^2 u$ 进行离散化，则可以得到

$$
\nabla u^{n}_{i, j} = \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1} - 4u^n_{i, j}}{\Delta x^2}
$$

因为我们希望 $\nabla u^{n}_{i, j} = 0$，所以可以使用迭代法：
$$
\nabla u^{n+1}_{i, j} = \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1}}{4}
$$
</p>

### Walk-On-Spheres (WoS) 方法和 Walk-On-Boundary (WoB) 方法
WoS 方法和 WoB 方法的介绍可以参考 [WoS](https://en.wikipedia.org/wiki/Walk-on-spheres_method) 和 [WoB](https://rsugimoto.net/WoBforBVPsProject/)。


### 收敛性
略。

## 案例

<p>
我们使用 <a href="https://www.math.usm.edu/lambers/mat417/class0425.pdf">The Dirichlet Problem in an Annulus</a> 作为一个案例。在一个二维环面上以极坐标的方法考虑如下问题：
$$
\begin{cases}
    \nabla^2 u = 0, & 1 < r < 2 \\
    u(r, \theta) = 0, & r = 1 \\
    u(r, \theta) = \sin \theta, & r = 2
\end{cases}
$$
得到以下的模拟结果。
</p>

### Jacobi 方法

![Animation][2]

其中图1和图3是数值方法的收敛过程，图2和图4是最终的精确解。

### WoS 和 WoB
在实现这两种方法的过程中，我们使用了 “Temporal Accumulation” 方法，对积累每帧采样的结果。方便对收敛过程进行可视化。对于 WoS，每帧的采样中，对于每一个位置，我们会不断递归，直到采样点达到边界附近。对于 WoB ，我们每帧的 path length 设置为 1，即在边界上采样 1 个点后即停止。其实验结果如下所示：

![Animation][5]

前两个动画展示了wos方法的收敛过程，后两个动画是wob方法的收敛过程。

# Heat Equation

<p>
热传导方程也叫 Diffusion Equation 。其初始值问题如下：
$$
\\
\begin{cases}
      u_t - \alpha \nabla^2 u = 0 & \text{in} \ R^n \times (0, \infty)\\
      \quad \quad \quad \  u = g &\text{on} \ R^n \times \{t=0\}
\end{cases}  
$$
</p>

## 精确解
同上，因为热传导方程的精确解形式过程较为冗长，这里不再展开。

## 数值解
<p>
与传输方程类似，我们可以使用 FTCS 方法对热传导方程求解。其差分形式如下：
$$
\frac{u^{n+1}_{i, j} - u^n_{i, j}}{\Delta t} - \alpha \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1} - 4u^n_{i, j}}{\Delta x^2} = 0
$$
</p>

### Stability Analysis

<p>
在这个问题上， FTCS 不再是无条件不稳定的，而是有条件稳定的。在二维情况下，其稳定条件为： $\Delta t < \frac{\Delta x^2}{4}$ 。
</p>

## 案例
<p>
一个二维例子：我们取 
$$
\begin{aligned}
&\alpha = 1, 
\\
&\begin{cases}
      g(\mathbf{x}) = 1, &|\mathbf{x}| \leq 10 \\
      g(\mathbf{x}) = 0, &|\mathbf{x}| > 10
\end{cases}
\end{aligned}
\\
$$

因为没有具体案例可供对比，这里不再展示精确解的可视化结果。下图展示的是数值解随时间的变化过程。


</p>

![][3]


## 物理解释
在物理过程中， $\alpha$ 表示热扩散率（thermal diffusivity），这一项的取值影响了数值方法是否稳定，其取值必须是一个正值。这里可以给大家分别留一个计算题和思考题：计算一下如果 $alpha$ 的取值为负数会对数值方法的稳定性有什么样的影响呢？另外 $alpha$ 的取值为负数时表示什么物理含义呢？


# Wave Equation

<p>
波动方程的初始值问题如下：
$$
\\
\begin{cases}
      u_{tt} - c^2 \nabla^2 u = 0 & \text{in} \ R^n \times (0, \infty)\\
      u = g, \ \ u_t = h &\text{on} \ R^n \times \{t=0\}
\end{cases}  
$$
</p>

## 分析解
同上，因为热传导方程的精确解形式过程较为冗长，这里不再展开。

## 数值解
<p>
在时间和空间域上我们都使用中心差分形式，便可以得到：
$$
\frac{u^{n+1}_{i, j} - 2u^n_{i, j} + u^{n-1}_{i, j}}{\Delta t^2} - c^2 \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1} - 4u^n_{i, j}}{\Delta x^2} = 0
$$
</p>

### Stability Analysis
<p>
该数值方法是有条件稳定的，在二维情况下，其稳定性条件为： $\Delta t < \frac{\Delta x}{c}$ 。

</p>
## 案例

<p>
一个二维例子：我们取 
$$
\begin{aligned}
&c = 1,\\
&g(\mathbf{x}) = 2 e^{-\left(\frac{\mathbf{x}_1^2 + \mathbf{x}_2^2}{16}\right)}
\end{aligned}
\\
$$

对于模拟区域的边界部分，我们设置为固定边界条件。

因为没有具体案例可供对比，这里不再展示精确解的可视化结果。下图展示的是数值解随时间的变化过程。

</p>

![][4]



[1]: {{ site.ImgDir }}/PDE/transport.gif
[2]: {{ site.ImgDir }}/PDE/laplace.gif
[3]: {{ site.ImgDir }}/PDE/heat.gif
[4]: {{ site.ImgDir }}/PDE/wave_1200_16.gif
[5]: {{ site.ImgDir }}/PDE/laplace_wos_wob.gif
