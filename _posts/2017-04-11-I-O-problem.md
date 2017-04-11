---
title: "[LightOJ 1114] Easily Readable 输出问题"
image: "http://lightoj.com/images/main.png"
hidden: true
---
## I/O 效率
众所周知，C 与 C++ 的 I/O 方法混合使用时，效率是极其低下的。因此一般不建议同时使用（如`cout`和`printf`）。在做题期间听人提起，C++ 为了兼容 C 的 I/O 方法而导致自己的 I/O 效率极其低下，但在程序开始，增加下面两行代码可显著提升 I/O 效率：
``` cpp
ios::sync_with_stdio(false);
cin.tie(NULL);
```
但是在这道题目中，这个方法失效了。

我们先离开这道题目，来谈一谈这两行代码的作用。

其中，`sync_with_stdio`控制 C 与 C++ 的 I/O 是否同步，该值默认为 true。该值为 true 时，程序会在 C 和 C++ 的不同 I/O 方法之间不断切换而导致 I/O 效率降低，但是这样能够保证程序的 I/O 顺序和你的预期一致。当该值为 false 时，程序会减少在不同 I/O 方法之间的切换以提升速度，然而在这种情况下，程序的 I/O 顺序和可能你的预期完全不同。以下面这段测试程序为例：
```cpp
#include<cstdio>
#include<iostream>
using namespace std;

int main(){
    ios::sync_with_stdio(false);
    freopen("io_test.txt", "w", stdout);

    for(int i = 0; i < 10000; i ++){
        printf("printf\n");
        cout << "cout" << endl;
    }
    return 0;
}
```
将`sync_with_stdio`的值分别修改为 true 和 false，运行这段代码，查看输出到 io_test.txt 文件的内容。当该值为 true 时，输出内容为：
```
printf
cout
printf
cout
printf
cout
...
```
该值为 false 的时候，输出内容为：
```
cout
cout
cout
cout
cout
cout
...
```
可见，该值为 false 时，为了提高 I/O 的效率，导致了 I/O 顺序的混乱。因此，在使用`sync_with_stdio(false)`的时候，不要将`cout`和`printf`混用。以这道题目为例，这里有一段[可以 Accepted 的代码][1]，注意其中使用了`sync_with_stdio(false)`。将其中的一行代码
```cpp
printf("Case %d:\n", ca);
```
修改为
```cpp
cout << "Case " << ca << ":" << endl;
```
这时提交上去就会返回 Wrong Answer 的结果。这就是因为设置`sync_with_stdio(false)`而导致的输出顺序错误。此时如果设置`sync_with_stdio(true)`，便可以 Accepted。

关于`cin.tie(NULL)`，这句代码的作用我现在还不是很理解。这件事以后再谈。

回到这道题目。对于上面这段 Accepted 代码，你可能会问，为什么输出使用的是`printf`而不是`cout`？——这正是我接下来要谈的。我们先将这段代码恢复成刚开始时可以 Accepted 时的样子。确保`sync_with_stdio(false)`，然后将代码中所有`printf`全部修改为`cout`，再次提交代码，查看返回结果—Time Limit Exceeded。

再来看运行时间，使用`printf`的代码运行时间为$$0.316$$s，而换成`cout`之后，运行时间达到了$$3.096$$s！我们看到，这一次，`sync_with_stdio(false)`和`cin.tie(NULL)`都失去了作用，具体原因不得而知。但这告诫我们，对于处理大量字符串的题目，还是使用 C 的 I/O 方法更可靠。以上便是这道题目在 I/O 上的问题，谈完了这一点，我们再来考虑这道题目的做法。

[返回原文][2]

[1]: https://github.com/YuCrazing/ACM-solutions/blob/master/LightOJ/1114%20-%20Easily%20Readable%20(static).cpp
[2]: /2017/04/11/LightOJ-1114-Easily-Readable
