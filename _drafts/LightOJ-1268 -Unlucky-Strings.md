---
title: "[LightOJ 1268] Unlucky Strings"
category: "Algorithm"
tags: ["KMP", "AC自动机", "矩阵快速幂"]
---
<style type="text/css">
	table {
		width: 20%;
	}
</style>

## 题意描述
>给定一个字符集，和一个非法字符串 $$ban$$。要求只能使用字符集中的字符来生成长度为 $$n$$ 的字符串 $$S$$，且 $$S$$ 的子串中不能含有 $$ban$$ 。询问合法的 $$S$$ 的个数。

如 $$n$$ 为2， 字符集为 "ab"， $$ban$$ 为"ba"，则合法的 $$S$$ 的个数为3个："aa"、"ab" 和 "bb"。

## 题目分析
虽然知道该题目位于`KMP`分类下，但刚读完题目，就情不自禁地往计数方法上想。但是仔细思考一下的话，就会发现问题：非法字符串 $$ban$$ 有可能出现前缀和后缀重合的情况，如 "abcab"，这样就很难计数。

下面来我们思考使用动态规划的方法解决这个问题。记 $$ban$$ 的长度为 $$l$$。如果使用 $$dp[i][j]$$ 表示：长度为`i`的字符串且`该字符串的后缀`与`ban 的前缀`的最大匹配长度为`j`的构造方案数。那么，我们想要的答案就是 $$\sum_{j = 0}^{l-1} dp[n][j]$$。当然要注意，在状态转移过程中，$$dp[i][j]$$ 中的`j`要始终小于 $$l$$，这样才能保证 $$ban$$ 不会出现在 $$S$$ 中。这是一个非常经典的动态规划方法，值得好好体会。

## KMP算法
有了动态规划的状态后，我们来考虑状态之间的转移：对于一个当前的一个状态 $$dp[i][j]$$，增加一个字符后，有可能转移到哪些状态呢？在状态 $$dp[i][j]$$ ，增加一个字符 $$x$$，我们需要求解<span style="color: rgb(200, 100, 100);">当前这个增加了字符 $$x$$ 的字符串与 $$ban$$ 的前缀所能匹配的最大长度 $$j'$$</span>，这时状态将转移到 $$dp[i+1][j']$$。

如果结合 KMP 算法中求解 [$$next$$ 数组][3]的过程。你会发现，上述求解 “<span style="color: rgb(200, 100, 100);">当前这个增加了字符 $$x$$ 的字符串与 $$ban$$ 的前缀所能匹配的最大长度 $$j'$$</span>” 的过程，其实就是将 $$ban[j]$$ 替换为字符 $$x$$后，根据 $$ban$$ 数组的 $$next[1 \sim j]$$ 来求解新 $$next[j+1]$$的过程。对于状态 $$dp[i][j]$$，增加字符 $$x$$ 后，将转移到状态 $$dp[i+1][ next[j+1] ]$$。

我们以字符集为 "abc"、$$ban$$ 为 "abcab"作为例子。来解释一下这个转移。单元格中的字符表示，当状态 $$dp[i][j]$$ 增加这些字符时，会转移到状态 $$dp[i+1][j]$$。对于本题目而言，状态 $$dp[i][5]$$ 与 $$dp[i+1][5]$$ 是非法状态，这里也一并展示了出来。



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

## 矩阵快速幂
知道了动态规划的状态转移,理论上我们就可以解决这道题目了。但是我们要考虑算法效率，不能直接遍历求解 $$dp[1 \sim n][1 \sim l]$$。这里，我们可以使用矩阵[快速幂][4]极大地减少计算量。根据上述的状态转移规则，我们可以构造出动态规划的转移矩阵：

$$\left[\begin{array}{c*4} a_{11} & a_{12} & \cdots & a_{1j} \\ a_{21} & a_{22} & \cdots & a_{2j} \\ \vdots & \vdots & \ddots & \vdots \\ a_{j1} & a_{j2} & \cdots & a_{jj} \end{array} \right] \cdot \left[ \begin{array}{c} dp[i][0] \\ dp[i][1] \\ \vdots \\ dp[i][j-1]  \end{array} \right] = \left[ \begin{array}{c} dp[i+1][0] \\ dp[i+1][1] \\ \vdots \\ dp[i+1][j-1]  \end{array} \right]$$

以字符集为 "abc"、$$ban$$ 为 "abcab"作为例子。转移矩阵（不包含非法状态）为：

$$\left[ \begin{array}{c*5} 2 & 1 & 1 & 2 & 1 \\ 1 & 1 & 1 & 0 & 1 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0  \end{array} \right] \cdot \left[ \begin{array}{c} dp[i][0] \\ dp[i][1] \\ dp[i][2] \\ dp[i][3] \\ dp[i][4]  \end{array} \right] = \left[ \begin{array}{c} dp[i+1][0] \\ dp[i+1][1] \\ dp[i+1][2] \\ dp[i+1][3] \\ dp[i+1][4]  \end{array} \right]$$

转化为矩阵的幂形式为：

$$\left[ \begin{array}{c*5} 2 & 1 & 1 & 2 & 1 \\ 1 & 1 & 1 & 0 & 1 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0  \end{array} \right]^n \cdot \left[ \begin{array}{c} 1 \\ 0 \\ 0 \\ 0 \\ 0  \end{array} \right] = \left[ \begin{array}{c} dp[n][0] \\ dp[n][1] \\ dp[n][2] \\ dp[n][3] \\ dp[n][4]  \end{array} \right]$$

使用矩阵快速幂，便可以很快求解出需要的结果。


## 确定有限状态自动机（DFA）
其实对于这种求解满足某一条件字符串个数的题目，更适合使用一种叫做[确定有限状态自动机（Deterministic finite automaton，DFA）][2]的方法来解决。在这道题目中，DFA 与动态规划方法在实质上是相同的，但是 DFA 有着自己的优势。

我们先来构造一个字符集为 "abc"、$$ban$$ 为 "abcab"的 DFA（[绘制方法][1]），如下图所示。在这个 DFA 中， S 表示开始时的状态，即字符串后缀与 $$ban$$ 的前缀最大匹配长度为0的状态。其他每个状态中的内容表示的是到达该状态时字符串的后缀。两个圈的状态是合法状态，一个圈的状态为非法状态。箭头及字符表示转移方式，如 S 状态读入字符 'a' 后进入 "a" 状态、读入字符 'b'、'c' 后仍留在 S 状态。

![]({{ site.url }}/assets/imgs/dfa.svg)



[1]: http://madebyevan.com/fsm/
[2]: https://en.wikipedia.org/wiki/Deterministic_finite_automaton
[3]: http://blog.csdn.net/yutianzuijin/article/details/11954939/
[4]: https://en.wikipedia.org/wiki/Exponentiation_by_squaring 