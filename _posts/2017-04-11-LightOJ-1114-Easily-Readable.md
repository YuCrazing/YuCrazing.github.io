---
title: "[LightOJ 1114] Easily Readable"
category: "Algorithm"
tags: ["Trie", "Hash"]
---

## 题意描述
>“相似”定义：两个单词之间是“相似”的，则两个单词的首尾字母应该分别对应相同，且除首尾字母之外的中间字符串中包含的字母种类和数量相同。现在给出包含 $$10^4$$个单词的字典，字典的字符总数不超过$$10^5$$。接下来给出一些句子，所有句子的字符数目之和不超过$$10^5$$。问对于句子中的每个单词，字典中出现了多少与之“相似”的单词。

例如`axyzzb`与`azyxzb`是相似的，`nkakm`与`nkkam`是相似的，而`adbdfk`与`kdbdfa`、`adbbfk`均不相似。

## 题目分析
可以想到，对于相互之间“相似”的单词，将每个单词的中间字符串（不含首尾字母）按字典序排序后，得到的是相同的单词。
```cpp
string word;
if(word.size() > 2)
	sort(word.begin() + 1, word.end() - 1);
```
将每个单词按照此方法排序后，题目转化为：给定$$n$$个单词的字典，询问另外$$m$$个单词在字典中分别出现的次数。这是一个典型的 Trie 例题。但是还有没有其他方法可以解决这个问题呢？在解决这道题目以及用更多方法解决这道题目之前，我先谈一谈这道题目中的一个很重要的东西——输入输出。

## I/O 效率
这部分内容较长，请移步[此处][1]查看。

## Trie
我们先来考虑使用 Trie 解决这个问题。

将字典中每个单词的中间字符串（不含首尾字母）排序后，后得到的新单词插入到 Trie 中，在 Trie 的每个节点记录以该节点为结尾的单词数。然后对于句子中的每个单词，到 Trie 上查找，统计该单词出现了几次即可。

[代码][7]

这里有个问题要注意：

对于这道题来说，只能使用静态数组来建树。使用`new`动态申请内存的建树方法会导致 Memory Limit Exceeded。[这段代码][2]使用了动态建树，无法通过这道题目。

出现这个问题的原因：

字典中的字母总数为$$10^5$$，且 Trie 上的每个节点都有$$52$$个儿子。因此，使用静态`int`数组建树，内存使用为：$$10^5 \times 52 \times 4 B \approx 20 MB$$，题目的内存限制为$$32MB$$，内存的使用在限制范围内。动态建树的过程中，需要在内存中保存指针，而每个指针的大小为$$8B$$，比使用静态`int`数组建树的方法多使用了一倍的内存，因此会超出内存限制。

说到指针的大小，这里说一些题外话。指针的大小跟操作系统的位数没有关系，指针的大小受到编译器的控制，以32位项目方式编译，指针大小为32位；以64位项目方式编译，大小为64位。LightOJ 的评测机使用的是64位编译方式，其指针大小为64位（$$8B$$），这一点可以使用以下代码进行测试：
``` cpp
    assert(sizeof(int*) == 8);
    assert(sizeof(int) == 4);
```
将这两句添加到可以 Accpeted 的代码中（需要`assert.h`或者`cassert`头文件），提交代码，若代码顺利运行而不出现 Runtime Error 的结果，则说明以上的推断是正确的。

## Hash
除了 Trie，hash 也是处理字符串问题的有力工具。这里分享几个使用 Hash 通过这道题的方法。

### Naive Hash
这个方法之所以叫做 Naive Hash，第一个原因是它很不优美，第二个原因是，它是我写的。
这个方法是将每个单词全部字母进行排序，然后进行 hash，放到一个非常大的 vector 数组中防止每个 vector 中的单词太多导致查找效率下降。这个方法不用担心 hash 冲突，但是程序效率比较低。因为方法太 Naive 并且太不优美，所以不推荐使用。

[代码][3]

### Hash with vector

这是来自 LightOJ 用户 [MIA MUHAMMAD IMRAN][4]  的方法。该方法先将单词的中间字符串（不含首尾字母）排序，然后选用一个特别大的`MOD`对每个单词进行 hash，hash 结果保存在 vector 中。插入结束后，将 vector 排序，查找每个单词出现的次数只需要查询该单词的 hash 值在 vector 中出现了多少次即可。这个方法在理论上是不严谨的，但是在`MOD`特别大的情况下，发生 hash 冲突的概率是十分微小的，在随机数据下很容易通过。

[代码][5]

### Hash with unordered_map

这里的方法和上一个方法基本一致，但是保存 hash 值的容器不同。提到保存 hash 值，可能很多人首先会想到 `unordered_map`。`unordered_map`是一个非常好用的容器，然而在 C++11 才加入到标准库中，而且 LightOJ 并不支持 C++11。这是一件令人非常伤感的事。

但是，C++98 有一个叫做`tr1 (C++ Technical Report 1)`的扩展。它并不是标准库，但大多数编译器都自带这个库。其中就实现了我们所需要的 `unordered_map` 。想使用`unordered_map`，在文件中增加下面的代码即可。
``` cpp
#include<tr1/unordered_map>
using namespace std::tr1;
unordered_map<XX, XX> mp;
```
使用`unordered_map`我们可以方便地用 hash 方法通过这道题目。

[代码][6]



[1]: /2017/04/11/I-O-problem
[2]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1114%20-%20Easily%20Readable.cpp
[3]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1114%20-%20Easily%20Readable%20(naive%20hash).cpp
[4]: http://lightoj.com/volume_userstat.php?user_id=3952
[5]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1114%20-%20Easily%20Readable%20(hash%20vector).cpp
[6]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1114%20-%20Easily%20Readable%20(hash%20unordered_map).cpp
[7]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1114%20-%20Easily%20Readable%20(static).cpp
