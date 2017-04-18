---
title: "[LightOJ 1258] Making Huge Palindromes"
image: "http://lightoj.com/images/main.png"
category: "Knuth-Morris-Pratt algorithm"
---

## 题意描述
>在一个字符串的后面最少增加多少个字母，才能使之成为一个回文串？

## 题目分析
可以想到，我们需要在字符串中找到`包含最后一个字母`的`最长`的回文子串。记这个回文子串的长度为 $$m$$，原字符串的长度为 $$n$$，则在原字符串后面增加 $$n-m$$ 个字母就可以将原字符串变为回文串。$$n-m$$ 就是我们想要的答案。

方便起见，我们用$$S$$表示原字符串，用$$str$$表示$$S$$中`包含最后一个字母`的`最长`的回文子串。

接下来要考虑如何找到$$str$$。这里提供两个方法，第一个是使用[ Manacher 算法][1]，这个方法思维上的难度较小，这里不展开讨论。第二个是使用[ KMP 算法][2]，下面我们来谈一谈如何使用 KMP 算法来解决这道题目。

## KMP 算法

在讨论如何使用 KMP 算法解决这道题目之前，我们先来看一看 KMP 算法的匹配过程：
``` java
public void search(String text, String word, int next[]) {  
    int j = 0;  
    for (int i = 0; i < text.length(); i++) {  
        while (j > 0 && text.charAt(i) != word.charAt(j))  
            j = next[j];  
        if (text.charAt(i) == word.charAt(j))  
            j++;  
    }  
}  
```
让我们来关注一下代码中的变量`j`。当字符比较进行到文本串 text 的`text[i]`位置时，对`j`进行计算，得到的`j`表示的是文本串 text 中`以text[i]为结尾的后缀`与单词串 word 的`前缀`的最大匹配长度。如下图所示。
![][3]

因此，我们可以得到一个结论：当循环运行结束时，最终得到的`j`表示的是`文本串 text 的后缀`与`单词串 word 的前缀`所能匹配的最大长度。如下图所示。
![][4]


知道了这一点，我们再来思考这道题目。

$$str$$为$$S$$的一个后缀，如果我们将$$S$$反过来写，用$$S'$$表示$$S$$反过来后得到的字符串，则$$str$$为$$S'$$的一个前缀（$$str$$反过来还是$$str$$）。因此，我们只需要找到$$S$$后缀与$$S'$$前缀的最大匹配长度，就可以找到$$str$$。

根据上面我们分析过的 KMP 算法匹配过程，将$$S$$当做文本串，$$S'$$当做单词串进行匹配，最终得到的`j`的值，就是我们所寻找的$$str$$的长度$$m$$。

[代码][5]



[1]: http://www.cnblogs.com/biyeymyhjob/archive/2012/10/04/2711527.html
[2]: http://blog.csdn.net/yutianzuijin/article/details/11954939/
[3]: /assets/imgs/KMP.png
[4]: /assets/imgs/KMPend.png
[5]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1258%20-%20Making%20Huge%20Palindromes.cpp
