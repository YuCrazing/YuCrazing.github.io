---
title: "[LightOJ 1268] Unlucky Strings"
category: "Algorithm"
tags: ["KMP", "AC自动机", "矩阵快速幂", "DFA"]
---


## 题意描述
>给定一个字符集，和一个非法字符串 $$ban$$。要求只能使用字符集中的字符来生成长度为 $$n$$ 的字符串 $$S$$，且 $$S$$ 的子串中不能含有 $$ban$$ 。询问合法的 $$S$$ 的个数。

如 $$n$$ 为2， 字符集为 "ab"， $$ban$$ 为"ba"，则合法的 $$S$$ 的个数为3个："aa"、"ab" 和 "bb"。

## 题目分析
虽然知道该题目位于`KMP`分类下，但刚读完题目，就情不自禁地往计数方法上想。但是仔细思考一下的话，就会发现问题：非法字符串 $$ban$$ 有可能出现前缀和后缀重合的情况，如 "abcab"，这样就很难计数。

下面来我们思考使用动态规划的方法解决这个问题。记 $$ban$$ 的长度为 $$l$$。如果使用 $$dp[i][j]$$ 表示：长度为`i`的字符串且`该字符串的后缀`与`ban 的前缀`的最大匹配长度为`j`的构造方案数。那么，我们想要的答案就是 $$\sum_{j = 0}^{l-1} dp[n][j]$$。当然要注意，在状态转移过程中，$$dp[i][j]$$ 中的`j`要始终小于 $$l$$，这样才能保证 $$ban$$ 不会出现在 $$S$$ 中。

这是一个非常经典的动态规划方法。但是，第一次尝试这种题目，可能很难立刻思考出这样一个状态记法。我们也不了解第一个想出这个方法的人是如何思考的，但结合[ DFA ](#DFA)可能能够更好地理解这种思路。

## KMP算法
有了动态规划的状态后，我们来考虑状态之间的转移：对于当前的一个状态 $$dp[i][j]$$，增加一个字符后，有可能转移到哪些状态呢？在状态 $$dp[i][j]$$ ，增加一个字符 $$x$$，我们需要求解<span style="color: rgb(200, 100, 100);">当前这个增加了字符 $$x$$ 的字符串与 $$ban$$ 的前缀所能匹配的最大长度 $$j'$$</span>，这时状态将转移到 $$dp[i+1][j']$$。

如果结合 KMP 算法中求解 [$$next$$ 数组][3]的过程。你会发现，上述求解 “<span style="color: rgb(200, 100, 100);">当前这个增加了字符 $$x$$ 的字符串与 $$ban$$ 的前缀所能匹配的最大长度 $$j'$$</span>” 的过程，其实就是将 $$ban[j]$$ 替换为字符 $$x$$后，根据 $$ban$$ 数组的 $$next[1 \sim j]$$ 来求解新的 $$next[j+1]$$的过程。对于状态 $$dp[i][j]$$，增加字符 $$x$$ 后，将转移到状态 $$dp[i+1][ next[j+1] ]$$。

我们以字符集为 "abc"、$$ban$$ 为 "abcab"作为例子，来解释一下这个转移。如下表所示，单元格中的字符表示，当状态 $$dp[i][j]$$ 增加这些字符时，会转移到状态 $$dp[i+1][j']$$。对于本题目而言，状态 $$dp[i][5]$$ 与 $$dp[i+1][5]$$ 是非法状态，这里也一并展示了出来，在实际的计算过程中并不需要。



<div class="responsiveTable">
	<table>
		<tr>
			<th> </th><th>$$dp[i+1][0]$$</th><th>$$dp[i+1][1]$$</th><th>$$dp[i+1][2]$$</th><th>$$dp[i+1][3]$$</th><th>$$dp[i+1][4]$$</th><th>$$dp[i+1][5]$$</th>
		</tr>
		<tr>
			<th>$$dp[i][0]$$</th><td>b, c</td><td>a</td><td></td><td></td><td></td><td></td>
		</tr>
		<tr>
			<th>$$dp[i][1]$$</th><td>c</td><td>a</td><td>b</td><td></td><td></td><td></td>
		</tr>
		<tr>
			<th>$$dp[i][2]$$</th><td>b</td><td>a</td><td></td><td>c</td><td></td><td></td>
		</tr>
		<tr>
			<th>$$dp[i][3]$$</th><td>b, c</td><td></td><td></td><td></td><td>a</td><td></td>
		</tr>
		<tr>
			<th>$$dp[i][4]$$</th><td>c</td><td>a</td><td></td><td></td><td></td><td>b</td>
		</tr>
		<tr>
		<th>$$dp[i][5]$$</th><td>b, c</td><td>a</td><td></td><td></td><td></td><td></td>
	</tr>
	</table>
</div>

## 矩阵快速幂
知道了动态规划的状态转移,理论上我们就可以解决这道题目了。但是我们还要考虑算法效率，不能直接遍历求解 $$dp[1 \sim n][1 \sim l-1]$$。这里，我们可以使用矩阵[快速幂][4]极大地加快计算速度。根据上述的状态转移规则，我们可以构造出动态规划的转移矩阵：

<div class="responsiveTable">
	$$\left[\begin{array}{c*4} a_{11} & a_{12} & \cdots & a_{1l} \\ a_{21} & a_{22} & \cdots & a_{2l} \\ \vdots & \vdots & \ddots & \vdots \\ a_{l1} & a_{l2} & \cdots & a_{ll} \end{array} \right] \cdot \left[ \begin{array}{c} dp[i][0] \\ dp[i][1] \\ \vdots \\ dp[i][l-1]  \end{array} \right] = \left[ \begin{array}{c} dp[i+1][0] \\ dp[i+1][1] \\ \vdots \\ dp[i+1][l-1]  \end{array} \right]$$
</div>

以字符集为 "abc"、$$ban$$ 为 "abcab"作为例子。转移矩阵（不包含非法状态）为：

<div class="responsiveTable">
	$$\left[ \begin{array}{c*5} 2 & 1 & 1 & 2 & 1 \\ 1 & 1 & 1 & 0 & 1 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0  \end{array} \right] \cdot \left[ \begin{array}{c} dp[i][0] \\ dp[i][1] \\ dp[i][2] \\ dp[i][3] \\ dp[i][4]  \end{array} \right] = \left[ \begin{array}{c} dp[i+1][0] \\ dp[i+1][1] \\ dp[i+1][2] \\ dp[i+1][3] \\ dp[i+1][4]  \end{array} \right]$$
</div>

转化为矩阵的幂形式为：

<div class="responsiveTable">
	$$\left[ \begin{array}{c*5} 2 & 1 & 1 & 2 & 1 \\ 1 & 1 & 1 & 0 & 1 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0  \end{array} \right]^n \cdot \left[ \begin{array}{c} 1 \\ 0 \\ 0 \\ 0 \\ 0  \end{array} \right] = \left[ \begin{array}{c} dp[n][0] \\ dp[n][1] \\ dp[n][2] \\ dp[n][3] \\ dp[n][4]  \end{array} \right]$$
</div>

使用矩阵快速幂，便可以很快求解出需要的结果。

[代码][5]


## 确定有限状态自动机（DFA） {#DFA}
其实对于这种求解满足某一条件字符串个数的题目，更适合使用一种叫做[确定有限状态自动机（Deterministic finite automaton，DFA）][2]的方法来解决。

与其说 DFA 是一种算法，不如说是一种思维方式。

我们先来构造一个字符集为 "abc"、$$ban$$ 为 "abcab"的 DFA（[绘制方法][1]），如下图所示。DFA 中的状态（节点）数由 $$ban$$ 的长度 $$l$$ 决定，状态数共有 $$l+1$$个，每个状态对应一个 $$ban$$ 的前缀。在这个 DFA 中，共有6个状态，每个状态中的内容表示的是到达该状态时字符串的后缀。S 表示开始时的状态，即字符串后缀与 $$ban$$ 的前缀最大匹配长度为0的状态。两个圈的状态是合法状态，一个圈的状态为非法状态。箭头及字符表示转移方式，如 S 状态读入字符 'a' 后进入 "a" 状态、读入字符 'b'、'c' 后仍留在 S 状态。

{% include dfa.svg %}

可以发现，DFA 就是一个有向图，所以可以在 DFA 中方便地使用各种图论算法。我们可以使用 KMP 算法构造出这个有向图的邻接矩阵，这个邻接矩阵其实与上面动态规划的状态转移基本一致。

在 DFA 中，我们可以把原来的字符串题目转化为一道图论题目：
>从节点 $$S$$ 出发，走长度为 $$n$$ 的距离，走的过程中不能经过非法节点，请问有多少种走法。

这是一个很经典的图论问题。求解出 DFA 的邻接矩阵 $$T$$（不包含非法节点）后，记$$M = T^n$$，$$\sum_{j=1}^{l} M_{1j}$$ 就是这道题目的答案。

虽然看起来 DFA 与动态规划方法在实质上是相同的，但是 DFA 这种思维方法是很值得学习的。这种思维方式使得 DFA 适用范围更广、理解上也更容易。


## AC 自动机
这道题目，也可以使用[ AC 自动机][6]来解决。但在只有一个非法字符串 $$ban$$ 的情况下，使用 AC 自动机似乎有些杀鸡用牛刀。这里不再介绍相关细节。

[代码][7]


[1]: http://madebyevan.com/fsm/
[2]: https://en.wikipedia.org/wiki/Deterministic_finite_automaton
[3]: http://blog.csdn.net/yutianzuijin/article/details/11954939/
[4]: https://en.wikipedia.org/wiki/Exponentiation_by_squaring 
[5]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1268%20-%20Unlucky%20Strings.cpp
[6]: https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm
[7]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1268%20-%20Unlucky%20Strings%20(AC).cpp