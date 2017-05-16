---
title: "球与盒子"
category: "Algorithm"
tags: ["组合数学", "计数", "Stirling 数", "整数拆分", "Bell 数", "集合划分"]
---
本文讨论的内容为：在不同的限制条件下，将$$n$$ 个球放到 $$m$$ 个盒子中（$$n \ge m$$），有多少种放法。

文中出现的符号含义如下表所示。
<div class="responsiveTable">
	<table>
		<tr>
			<th>符号</th><th>含义</th>
		</tr>
		<tr>
			<th>$$p(n, m)$$</th>
			<td>正整数 n 拆分成最大分部不超过 m 的无序拆分方案数。</td>
		</tr>
		<tr>
			<th>$$B(n, m)$$</th>
			<td>正整数 n 拆分成 m 个正整数的无序拆分方案数。</td>
		</tr>
		<tr>
			<th>$$S(n, m)$$</th>
			<td>大小为 n 的集合划分为 m 个部分的方案数，即第二类 Stirling 数。</td>
		</tr>
	</table>
</div>

### <span class="redText">不允许空</span>
<div class="responsiveTable">
	<table>
		<tr>
			<th></th><th>盒子相同</th><th>盒子不同</th>
		</tr>
		<tr>
			<th>球相同</th>
			<td>整数的无序拆分 搜索、母函数 $$B(n, m) = \sum_{i = 1}^{m}B(n - m, i) = p(n, m) - p(n, m - 1)$$</td>
			<td>整数的有序拆分 隔板法 $$C_{n - 1}^{m - 1}$$</td>
		</tr>
		<tr>
			<th>球不同</th>
			<td>集合划分 第二类 Stirling 数 $$S(n, m) = S(n - 1, m - 1) + m \cdot S(n - 1, m)$$</td>
			<td>$$S(n, m) \cdot A_{m}^{m}$$</td>
		</tr>
	</table>
</div>
<br>
<br>
<br>

### <span class="redText">允许空</span>
<div class="responsiveTable">
	<table>
		<tr>
			<th></th><th>盒子相同</th><th>盒子不同</th>
		</tr>
		<tr>
			<th>球相同</th>
			<td>Ferrers图 $$\sum_{i = 1}^{m}B(n, i) = p(n, m)$$</td>
			<td>$$C_{n + m - 1}^{m - 1}$$</td>
		</tr>
		<tr>
			<th>球不同</th>
			<td>$$\sum_{i = 1}^{m}S(n, i)$$</td>
			<td>$$m^n$$</td>
		</tr>
	</table>
</div>

## 相同的球
### $$n$$ 个相同的球放到 $$m$$ 个不同的盒子中
#### <span class="redText">不允许空</span>
整数的有序拆分 隔板法 $$C_{n - 1}^{m - 1}$$
#### <span class="redText">允许空</span>
 $$C_{n + m - 1}^{m - 1}$$


### $$n$$ 个相同的球放到 $$m$$ 个相同的盒子中
#### <span class="redText">不允许空</span>
整数的无序拆分 搜索、母函数 $$B(n, m) = \sum_{i = 1}^{m}B(n - m, i) = p(n, m) - p(n, m - 1)$$
#### <span class="redText">允许空</span>
Ferrers图 $$\sum_{i = 1}^{m}B(n, i) = p(n, m)$$



## 不同的球
### $$n$$ 个不同的球放到 $$m$$ 个相同的盒子中
#### <span class="redText">不允许空</span>
集合划分 第二类 Stirling 数 $$S(n, m) = S(n - 1, m - 1) + m \cdot S(n - 1, m)$$
#### <span class="redText">允许空</span>
$$\sum_{i = 1}^{m}S(n, i)$$

$$n == m$$ 时为Bell 数 $$\sum_{i = 1}^{n}S(n, i) = B(n)$$

### $$n$$ 个不同的球放到 $$m$$ 个不同的盒子中
#### <span class="redText">不允许空</span>
$$S(n, m) \cdot A_{m}^{m}$$
#### <span class="redText">允许空</span>
$$m^n$$
