---
layout: default
title: "Summary"
---
## 返回结果
### Wrong Answer
1. freopen() 函数是否注释掉。
2. 输出格式是否完全相同。
3. 极端样例（取n=0、n=MAXN等）。
4. 题意是否正确。
    * [HDU 1078 - FatMouse and Cheese][5]
5. 仔细debug。

### Time Limit Exceeded
1. 仔细计算时间复杂度，若复杂度合理，则程序可能出现（递归）死循环。

## 思维
1. 小球相遇反弹的模型
    * [POJ 1852 - Ants][3]

## 字符串
1. 字典序：字符串 ab 是由两个字符串 a 、b 拼接得到的字符串，字符串 AB 是由两个字符串 A 、B 拼接得到的字符串。
不能直接通过比较 a 和 A 的字典序大小来判断 ab 与 AB 的字典序大小。
    * [LightOJ 1073 - DNA Sequence][1]
    * [POJ 2581 - Sequence][2]

## 动态规划
1. 更新值时注意使用【=】、【+=】或者【min()】等。
    * $$ dp[i][j] = updateValue $$ <br>
    * $$ dp[i][j] += updateValue $$ <br>
    * $$ dp[i][j] = min(dp[i][j], updateValue) $$ <br>
    * [POJ 1661 - Help Jimmy][6]

2. 要证明状态具有最优子结构性质。可以通过反例推翻不具有最优子结构的状态。
    * [POJ 1015 - Jury Compromise][4]

## 数学
1. 规律题最好打表找规律。手推规律时草稿纸要整洁，推导步骤要清晰，保留每组样例的推算结果，避免重复计算。







[1]: http://lightoj.com/volume_showproblem.php?problem=1073
[2]: http://poj.org/problem?id=3581
[3]: http://poj.org/problem?id=1852
[4]: http://poj.org/problem?id=1015
[5]: http://acm.hdu.edu.cn/showproblem.php?pid=1160
[6]: http://poj.org/problem?id=1661