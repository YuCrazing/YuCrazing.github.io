---
title: "两条线段之间的距离"
category: "Algorithm"
tags: ["Geometry", "Math"]
---
本文介绍了一种计算二、三维空间中两线段之间距离的方法。

在该方法中，无论何种情况下，两线段之间的距离最终都能被转化为点到线段的距离。该方法的优势在于：简单便捷，便于编程实现；不需要二分、三分等算法，精确度较高。另外，也不需要记忆复杂的计算公式。

## 点到线段的距离
在进入正题之前，我们先来学习一下如何计算点到线段的距离，作为本文的基础。下面这篇文章，介绍了一种简单的、便于编程实现的计算点到线段的距离的方法。

[Distance of a Point to a Segment][1]


## 线段到线段的距离
下面我们来介绍计算线段 $$AB$$ 与 $$CD$$ 之间距离的流程。 
### 二维空间
1. 判断 $$C$$，$$D$$是否位于直线 $$AB$$ 的异侧，判断 $$A$$，$$B$$ 是否位于直线 $$CD$$ 的异侧。
2. 若 $$C$$，$$D$$位于直线 $$AB$$ 的异侧且 $$A$$，$$B$$ 位于直线 $$CD$$ 的异侧，则：
	* 结论：线段 $$AB$$，$$CD$$ 相交。
	* <span class="redText">线段 $$AB$$，$$CD$$ 之间距离为：</span> $$0$$。
3. 若不满足上一条件，则：
	* 结论：线段 $$AB$$，$$CD$$ 不相交。
	* <span class="redText">线段 $$AB$$，$$CD$$ 之间距离为：</span> $$min(dis(A, CD), \ \  dis(B, CD), dis(C, AB), dis(D, AB))$$。 其中 $$dis(P, Seg)$$ 表示点 $$P$$ 到线段 $$Seg$$ 的距离。（证明略）

### 三维空间

1. 求解线段 $$AB$$，$$CD$$ 的公共法向量 $$\vec{n}$$。
2. 求解经过线段 $$AB$$ 的且平行于 $$\vec{n}$$ 的平面 $$C_1$$，判断 $$C$$，$$D$$ 是否位于平面 $$C_1$$ 的异侧。
3. 求解经过线段 $$CD$$ 的且平行于 $$\vec{n}$$ 的平面 $$C_2$$，判断 $$A$$，$$B$$ 是否位于平面 $$C_2$$ 的异侧。
4. 若 $$C$$，$$D$$ 位于平面 $$C_1$$ 的异侧 且 $$A$$，$$B$$ 位于平面 $$C_2$$ 的异侧，则：
	* 结论：存在一条平行于 $$\vec{n}$$ 的直线可以同时经过线段 $$AB$$ 和 $$CD$$。
	* <span class="redText">线段 $$AB$$，$$CD$$ 之间距离为：</span> $$\vec{AC}$$ （$$A$$ 可替换为线段 $$AB$$ 上任意一点，$$C$$ 可替换为线段 $$CD$$ 上任意一点）在法向量 $$\vec{n}$$ 上的投影。（证明略）
5. 若不满足上一条件，则：
	* 结论：不存在平行于 $$\vec{n}$$ 的直线可以同时经过线段 $$AB$$ 和 $$CD$$。
	* <span class="redText">线段 $$AB$$，$$CD$$ 之间距离为：</span> $$min(dis(A, CD), dis(B, CD), dis(C, AB), dis(D, AB))$$。 其中 $$dis(P, Seg)$$ 表示点 $$P$$ 到线段 $$Seg$$ 的距离。（证明略）

注：步骤 2 中所求解的平面，平行于 $$AB$$ 且 平行于 $$\vec{n}$$，可求解出 $$AB$$ 和 $$\vec{n}$$ 的公共法向量  $$\vec{m}$$。将问题转化为：求解过线段 $$AB$$ 上一点 $$P = (x_0, y_0, z_0)$$ 且法向量为 $$\vec{m} = (a, b, c)$$ 的平面 $$C$$。$$C$$ 的方程为：
$$ax + by + cz = ax_0 + by_0 + cz_0$$。

[1]: http://geomalgorithms.com/a02-_lines.html#Distance-to-Ray-or-Segment