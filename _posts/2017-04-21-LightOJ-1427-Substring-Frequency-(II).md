---
title: "[LightOJ 1427] Substring Frequency (II)"
category: "Algorithm"
tags: ["AC自动机"]
---
## 题意描述
>给定一个长度为 $$10^6$$ 的文本串 $$text$$，和 $$500$$ 个长度为 $$500$$ 的单词，询问每个单词在文本串中出现的次数。

## 题目分析
记文本串 $$text$$ 的长度为 $$n$$，单词的最大长度为 $$max$$，单词个数为 $$k$$，所有单词长度之和为 $$sum$$。

如果使用 KMP 算法直接查找每个单词出现的次数，复杂度为 $$O(k\cdot n+sum)$$。对于这道题目来说，这个复杂度会 TLE。

[代码][1]

实际上，这道题目是经典 AC 自动机算法的入门题目。如果你还没有掌握 AC 自动机算法，建议理解了[ KMP 算法][2]和[ Trie ][3]之后再去学习 AC 自动机算法。研究透彻 KMP 算法和 Trie 之后，你就能够很容易地理解 AC 自动机算法。

## AC 自动机
关于 AC 自动机的基础知识这里不再赘述。下面我们来讨论一下 AC 自动机的时间复杂度。

这里有一个这道题目的[写法很 Naive 的 AC 自动机代码][4]。在这个代码中，可以注意到这样两处地方：

### 寻找最长后缀节点（失败节点）
有一些文章把这个东西叫做`失败节点`，我觉得把它叫做`最长后缀节点`会更好理解。


在`bfs`函数中，使用`while`循环寻找最长后缀节点`next`。
``` cpp
for(int i = 0; i < CHARS; i++) {
    int s = node[fa].son[i];
    if(!s) continue;

    int fanext = node[fa].next;
    while(fanext && !node[fanext].son[i]) fanext = node[fanext].next;

    if(node[fanext].son[i]) node[s].next = node[fanext].son[i];
    q.push(s);
}
```

### 计算匹配次数
在`search`函数中，使用`while`循环寻找匹配成功的单词并进行计数。
``` cpp
int tmp = cur;
while(tmp) { // important but slowly.
	if(node[tmp].end) node[tmp].cnt++;
	tmp = node[tmp].next;
}
```

可以发现，这两处代码是非常耗时的。这个写法的 AC 自动机，即使只考虑`search`函数，时间复杂度也有 $$O(max \cdot n)$$。比如，当文本串为`"aaa...aaa"`，单词分别为`{"a", "aa", "aaa", ..., "aaa...aaa"}`的时候，构造出的 AC 自动机如下图所示。

{% include ac.svg %}

这样的结构会使得在`计算匹配次数`的过程中，每次`while`循环都会遍历树上的所有节点。匹配到文本串任意位置 $$text[i]$$ 时，都有执行这样一次`while`循环，因此时间复杂度为 $$O(max \cdot n)$$。

## 线性时间的 AC 自动机

AC 自动机的时间复杂度，其实可以优化到线性时间。这个线性时间是指与树上节点的数量成线性关系。

### 寻找最长后缀节点（优化）
``` cpp
for(int i = 0; i < chars; i++) {
    int& son = node[fa].son[i];
    int next = node[fa].next;
    if(!son) {
        son = node[next].son[i];
        continue;
    }
    q.push(son);
    st.push(son);
    node[son].next = node[next].son[i];
}
```
这段代码中，当节点`fa`的某一儿子节点`son`不存在时，将其指向`node[node[fa].next].son[i]`。后面的节点寻找最长后缀节点时，如果寻找到这个不存在的节点`son`，便可以直接跳到节点`node[node[fa].next].son[i]`，而不需要一步一步地寻找，节约了大量时间。

### 计算匹配次数（优化）
``` cpp
while(!st.empty()) {
    int cur = st.top();
    st.pop();
    int next = node[cur].next;
    node[next].cnt += node[cur].cnt;
}
```

在 bfs 过程中，我们将所有的节点按 bfs 序加入到一个栈`st`中。在匹配时，我们先将文本串整个匹配一遍，记录整个过程中每个节点的匹配次数`node[cur].cnt`。之后，我们从栈顶依次访问这个栈中的节点，将每个节点`cur`的匹配次数`node[cur].cnt`增加到它的最长后缀节点`node[cur].next`上，便可以保证在线性时间内计算出所有节点的匹配次数。

[代码][5]

[1]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1427%20-%20Substring%20Frequency%20(II)%20(KMP).cpp

[2]: http://blog.csdn.net/yutianzuijin/article/details/11954939/
[3]: https://en.wikipedia.org/wiki/Trie
[4]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1427%20-%20Substring%20Frequency%20(II)%20(naive).cpp
[5]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1427%20-%20Substring%20Frequency%20(II)%20(code_optimized).cpp
