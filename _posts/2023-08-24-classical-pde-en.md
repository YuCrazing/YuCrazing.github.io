---
layout: latex_style
title: "Several Classical Partial Differential Equations: Numerical and Exact Solutions"
author: Yu Zhang
custom_date: April 2023
abstract: "Several classical linear partial differential equations, including the transport equation, Laplace's equation, the heat equation, and the wave equation, are analyzed. Their exact solutions and numerical solutions in two-dimensional space are then compared."
---

# Introduction

Numerical solutions of partial differential equations (PDE) are often employed in the field of physical simulations. Numerical methods are used for solving these equations because obtaining exact solutions is usually intricate and often requires specific analyses for each form. To demonstrate the differences between numerical and exact solutions, we present examples of classical PDEs in both forms. For the purpose of visualization, we provide examples in two-dimensional space. All code implementations in this article can be found at [Github](https://github.com/YuCrazing/PDE).

 
# Transport Equation

<p>
The transport equation, also known as the advection equation. The transport equation's initial value problem can be formulated as follows:

$$
\\
\begin{cases}
      u_t + \mathbf{b} \cdot Du = 0 & \text{in} \ R^n \times (0, \infty)\\
      \quad \quad \quad \quad \  u = g &\text{on} \ R^n \times \{t=0\}
\end{cases}  
$$
Here,
$\mathbf{b}$ is a fixed vector in $R^n$, $\mathbf{b} = (\mathbf{b}_1, \cdots, \mathbf{b}_n)$. The function $u:R^n \times  [0, \infty) \rightarrow R$ is the function to be solved, denoted as $u=u(\mathbf{x}, t)$. The variable $\mathbf{x} \in R^n$ represents a point in space, and $t \geq 0$ denotes time. $u_t$ is the partial derivative of $u$ with respect to time $t$, and $Du = D_{\mathbf{x}}u = (u_{\mathbf{x}_1}, \cdots, u_{\mathbf{x}_n})$ represents the gradient of $u$ with respect to spatial variable $\mathbf{x}$.
</p>

## Exact Solution

<p>
The analytical solution for the transport equation's initial value problem is given by

$$
u(\mathbf{x}, t) = g(\mathbf{x} - \mathbf{b}t),\quad (\mathbf{x} \in R^n, t \geq 0)
$$
</p>

## Numerical Solution

<p>
For solving the transport equation, a straightforward numerical method is the forward time-centered space (FTCS) method, a finite difference approach. In two dimensions, using $u^{n}_{i, j}$ to denote the numerical value of function $u$ at grid point $(i, j)$ and time step $\Delta t$ with grid spacing $\Delta x$, the equation becomes


$$
\frac{u^{n+1}_{i, j} - u^n_{i, j}}{\Delta t} + \mathbf{b} \cdot (\frac{u^n_{i+1, j}-u^n_{i-1, j}}{2 \Delta x}, \frac{u^n_{i, j+1}-u^n_{i, j-1}}{2 \Delta x}) = 0
$$
</p>

### Stability Analysis
In practice, the FTCS method is unconditionally unstable. To address this issue, we can replace the central difference scheme in space with an upwind scheme, resulting in a conditionally stable numerical method. Stability analysis of these numerical methods can be found [here](https://www.uni-muenster.de/imperia/md/content/physik_tp/lectures/ws2016-2017/num_methods_i/advection.pdf).


## Case Study

<p>
We provide a two-dimensional example with the following parameters:

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
The function $g$ is chosen for convenience, although not $C^1$ continuous.

</p>

The comparison between numerical and exact solutions is shown below:


![Animation][1]

In the figures, Figure 1 depicts the FTCS method, Figure 2 shows the upwind scheme, and Figure 3 presents the exact solution. From the experimental results, we observe numerical divergence with FTCS, while the upwind scheme maintains stability.



## Physical Interpretation


<p>
The transport equation describes the change of a physical quantity $u$ at every fixed point in space under the influence of a velocity field, as viewed in an Eulerian perspective. The value of $b$ in the equation corresponds to the velocity of the field. This explains the motion of the circular region in the upper-right direction in the presented case. Additionally, the transport equation can be associated with <a href="https://en.wikipedia.org/wiki/Material_derivative">the material derivative</a>. The material derivative is given by:

$$
\frac{Du}{Dt} = \frac{\partial u}{\partial t} + \mathbf{b} \cdot \nabla u
$$


Thus, the transport equation describes the evolution of the quantity in response to an external velocity field over time when the material derivative is zero (indicating no change in the physical quantity itself).

</p>

# Laplace's Equation
<p>
Laplace's equation is a special case of Poisson's equation:

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
Here, $u:\bar{U} \rightarrow R$ is the function to be solved, $u=u(\mathbf{x})$. $U \subset R^n$ is a given open set, and $\nabla^2 u = \sum_{i=1}^n u_{\mathbf{x}_i \mathbf{x}_i}$.
</p>

## Exact Solution

Several methods can be employed to find the exact solution of Laplace's equation, such as the Green's function method or separation of variables. Due to length constraints, we omit the detailed process. An example of solving Laplace's equation using separation of variables in polar coordinates can be found [here](https://www.math.usm.edu/lambers/mat417/class0425.pdf).

## Numerical Solution
In this section, we present the numerical results of the Laplace equation via the Jacobi iterative method, the Walk-on-spheres method, and the Walk-on-boundary method, respectively.

### Jacobi Method
<p>
A simple approach is to use the Jacobi iteration method to converge the equation to its solution, where $u^n$ denotes the result of the $n$-th iteration. Utilizing central difference discretization in space for $\nabla^2 u$, we have

$$
\nabla u^{n}_{i, j} = \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1} - 4u^n_{i, j}}{\Delta x^2}
$$

As we want $\nabla u^{n}_{i, j} = 0$, an iterative formula can be derived:
$$
\nabla u^{n+1}_{i, j} = \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1}}{4}
$$
</p>

### Walk-On-Spheres (WoS) And Walk-On-Boundary (WoB) Methods
A detailed introduction to Wos and WoB can be found on these two websites: [WoS](https://en.wikipedia.org/wiki/Walk-on-spheres_method) and [WoB](https://rsugimoto.net/WoBforBVPsProject/). 

In the implementation of these two methods, we employed the <i>Temporal Accumulation</i> technique to accumulate results from each frame, making it easier to visualize the process of convergence. For WoS, within each frame's sampling process, for each position in domain, we recursively sample until the sampled points approach the boundary. For WoB, we set the path length per frame to 1, meaning we stop after sampling one point on the boundary. The experimental results are as follows:

![Animation][5]

The first two animations show the convergence process of the WoS method, while the latter two show the convergence process of the WoB method.

### Convergence Analysis
Omitted.


## Case Study

<p>
We use <a href="https://www.math.usm.edu/lambers/mat417/class0425.pdf"> this example</a> as a case study. The Cauchy problem in polar coordinates is described as follows:
$$
\begin{cases}
    \nabla^2 u = 0, & 1 < r < 2 \\
    u(r, \theta) = 0, & r = 1 \\
    u(r, \theta) = \sin \theta, & r = 2
\end{cases}
$$
The numerical results are shown below:

</p>

![Animation][2]

Figures 1 and 3 depict the convergence process of the numerical method, while Figures 2 and 4 show the final exact solution.


# Heat Equation

<p>
The heat equation, also known as the diffusion equation, can be formulated as follows:

$$
\\
\begin{cases}
      u_t - \alpha \nabla^2 u = 0 & \text{in} \ R^n \times (0, \infty)\\
      \quad \quad \quad \  u = g &\text{on} \ R^n \times \{t=0\}
\end{cases}  
$$
</p>

## Exact Solution

As before, the exact solution's form is omitted due to its complexity.


## Numerical Solution

<p>
Similar to the transport equation, we can use the FTCS method to solve the heat equation. The finite difference form is as follows:

$$
\frac{u^{n+1}_{i, j} - u^n_{i, j}}{\Delta t} - \alpha \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1} - 4u^n_{i, j}}{\Delta x^2} = 0
$$
</p>

### Stability Analysis

<p>
In this case, the FTCS method is conditionally stable. In two dimensions, the stability condition is $\Delta t < \frac{\Delta x^2}{4}$. The detailed analysis can be found <a href="https://math.mit.edu/research/highschool/rsi/documents/2017Lee.pdf">here</a>.
</p>

## Case Study

<p>
A two-dimensional example is provided with the following parameters:

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

As there is no direct comparison case, we do not show the visualization of the exact solution. The figure below illustrates the numerical solution's evolution over time.
</p>

![][3]


## Physical Interpretation

In physical processes, $\alpha$  represents thermal diffusivity, impacting the stability of numerical methods. Its value must be positive. Two questions are left for readers: How would the stability of the numerical method be affected if $\alpha$ were negative? What is the physical interpretation of a negative $\alpha$ ?


# Wave Equation

<p>
The wave equation's initial value problem is given by 
$$
\\
\begin{cases}
      u_{tt} - c^2 \nabla^2 u = 0 & \text{in} \ R^n \times (0, \infty)\\
      u = g, \ \ u_t = h &\text{on} \ R^n \times \{t=0\}
\end{cases}  
$$
</p>

## Exact Solution
As with previous equations, the exact solution's form is omitted due to its complexity.


## Numerical Solution

<p>
Using central difference schemes in both time and space, we obtain
$$
\frac{u^{n+1}_{i, j} - 2u^n_{i, j} + u^{n-1}_{i, j}}{\Delta t^2} - c^2 \frac{u^n_{i+1, j} + u^n_{i-1, j} + u^n_{i, j+1} + u^n_{i, j-1} - 4u^n_{i, j}}{\Delta x^2} = 0
$$
</p>

### Stability Analysis
<p>
This numerical method is conditionally stable. In two dimensions, the stability condition is $\Delta t < \frac{\Delta x}{c}$. The detailed analysis can be found <a href="https://www.uni-muenster.de/imperia/md/content/physik_tp/lectures/ws2016-2017/num_methods_i/wave.pdf">here</a>.

</p>

## Case Study


<p>
A two-dimensional example is provided with the following parameters:

$$
\begin{aligned}
&c = 1,\\
&g(\mathbf{x}) = 2 e^{-\left(\frac{\mathbf{x}_1^2 + \mathbf{x}_2^2}{16}\right)}
\end{aligned}
\\
$$

Boundary conditions for the simulation region are set as fixed boundaries.
</p>


As there is no direct comparison case, we do not show the visualization of the exact solution. The figure below illustrates the numerical solution's evolution over time.

![][4]



[1]: {{ site.ImgDir }}/PDE/transport.gif
[2]: {{ site.ImgDir }}/PDE/laplace.gif
[3]: {{ site.ImgDir }}/PDE/heat.gif
[4]: {{ site.ImgDir }}/PDE/wave_1200_16.gif
[5]: {{ site.ImgDir }}/PDE/laplace_wos_wob.gif
