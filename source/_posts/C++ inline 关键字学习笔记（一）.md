---
title: C++ inline 关键字学习笔记（一）
date: 2018-05-24 10:43:04
categories: C++
tags: 
    - C++ 
    - inline
---

## 初探 inline

最初是在一个工程中，考虑到数个函数需要多次调用，同时程序对性能要求也比较高，所以打算为其加上 inline 关键字以提高效率。但是，在链接的时候遇到了一个函数未编译的错误。

代码结构大致如下：

    // A.h
    class A
    {
    public:
        inline void function() const;
    };

    // A.cpp
    void A::function() const
    {
        std::cout << "inline test function" << std::endl;
    }

    // main.cpp
    int main()
    {
        A a;
        a.function();
        
        return 0;
    }


报错如下：
> error LNK2019: 无法解析的外部符号 "public: void __thiscall A::function(void)" (?function@A@@QAEXXZ)，该符号在函数 _main 中被引用

经过检查，A.cpp 和 main.cpp 都是包含在工程中的，也就是说编译的时候确实是两个文件都编译到了的，但是在编译 main.cpp 的时候却找不到 A::function 这个函数的定义了。

## inline 作用分析

首先是使用 inline 的目的，当然是为了提高函数的性能。具体些来说，使用 inline 以后可以提高函数调用时的性能，因为使用该关键字以后编译器会尝试把该函数使用类似宏替换的方法替换到需要调用的地方，这样就减少了函数调用时对栈的操作。同时，不同于宏的是，inline 函数在编译时还是作为一个函数，也就是说，编译器还是会去做类型检测，所以相比宏提高了安全性。

知道了 inline 的大致原理的同时也能直观看出 inline 的一些局限。因为是类似宏展开的方式，对于递归调用的函数当然是无法成功展开的。实际测试中在递归函数前加 inline 关键字也不会报错，所以说这个关键字其实是不一定生效的，换句话说这只是对编译器的一种建议。查阅资料还了解到，函数中如果包含了 while、switch 等复杂的控制语句同样会无法展开。这些是 inline 使用时的限制情况，但这还是无法说明为何在这段代码中会找不到函数定义。

## 其他尝试

1. 首先怀疑是否是因为函数声明时加了关键字 inline，而定义时未加而导致的报错，于是在函数定义处也加上相同的 inline 关键字：
 
        // A.cpp
        inline void A::function() const
        {
    
    > error LNK2019: 无法解析的外部符号 "public: void __thiscall A::function(void)const " (?function@A@@QBEXXZ)，该符号在函数 _main 中被引用

    依然是同样的错误，也就是说在函数定义时无论加不加 inline 关键字都是一样的。

2. 反过来，在函数定义时加上 inline，而在函数声明出不加的话，也依然是同样的错误。
    
        // A.h
        class A
        {
        public:
            void function() const;
        };
        
        // A.cpp
        inline void A::function() const
        {
    
    > error LNK2019: 无法解析的外部符号 "public: void __thiscall A::function(void)const " (?function@A@@QBEXXZ)，该符号在函数 _main 中被引用

3. 如果将函数的定义和声明一起写到 A.h 文件中，这个错误就不报了。
    
        // A.h
        class A
        {
        public:
            inline void function() const
            {
                std::cout << "inline test function" << std::endl;
            }
        };

    > inline test function

## inline 原理分析

在几次简单尝试后，我们发现首先声明带不带 inline 是不同的，因为第 2 次尝试中 A.h 里不带 inline 的声明和 A.cpp 里带 inline 的定义没有链接到一起；其次，编译器在链接的时候似乎没有去对应的 A.cpp 文件中寻找 function 函数的定义。

### 编译过程回顾

简单回顾一下，编译器在生成 .exe 可执行文件的时候其实是有两个步骤的，分别是编译和链接，而编译又分为预编译、编译和汇编三个阶段：

1. 预编译：
    预编译主要是处理 #include 和其他宏，可以将头文件加入到源文件当中，最终生成的文件还是一个文本文件；

2. 编译：
    编译过程则是将 C++ 代码转换为汇编代码，最终生成的也是一个文本文件；

3. 汇编：
    汇编过程则是把汇编代码转换成二进制程序，最终生成的是一个二进制文件；
    
4. 链接：
    以上编译的三个步骤都是针对的单个源文件，也就是说每个源文件在编译完都会生成一个对应的二进制文件，但是这些文件彼此是孤立的。对于一些函数调用，比如之前例子中 main.cpp 中调用了函数 function()，但是 main.cpp 和包含的 A.h 中都没有该函数的定义，于是就需要链接程序去其他文件中寻找并链接起来。

我们这里报的错误是链接错误，也就是说在之前的三个阶段预编译、编译和汇编都没有问题，只是链接程序在寻找 function 函数的定义的时候出了错。这同时也很好地解释了为什么第 3 次尝试中将函数定义写在头文件中就没有了错误，因为这时候预编译出来的对应 main.cpp 的文件中由于 #include "A.h" 其实已经包含了 function 函数的定义。

### inline 编译过程

通过以上的分析可以发现其实是 inline 这个关键字导致了链接过程中找不到函数的定义，所以其实只要弄清楚在整个编译链接的过程中对 inline 这个关键字做了怎样的处理就能清楚问题的具体所在了。

但是，这个地方真正麻烦的事情是，编译器对 inline 关键字的具体策略的影响因素很多，涉及到编译时的优化级别等，而且不同的编译器还存在差别，所以不好去直接探究编译器在编译阶段对 inline 的处理。

既然如此，只好退而求其次，通过其他办法来寻找出现这个错误的原因了。之前我们提到，第 3 次尝试中因为包含的头文件中直接有 function 函数的定义所以没有报错，而之前的情况中在 A.cpp 中的函数定义都没有被找到，那么这是否意味着对于加了 inline 关键字的函数编译器就不会再去其他源文件里寻找定义了呢？换句话说，inline 函数必须要在预编译、编译或者汇编这三个过程中就链接好并尝试展开，而不会再等到最后的链接过程去处理。这在目前只是一个假设，但是我们还是可以通过分析一些情况来论证这个假设。

假如说 inline 的处理在最终的链接阶段的话，那么就意味着要对二进制文件进行处理，这样来做无疑是会比直接对文本文件操作难上许多的，因为 inline 需要用类似宏定义的方式展开代码来减少调用，而对于二进制文件一点点插入操作都可能会影响到之后的跳转的地址，这样带来的额外开销是巨大的，所以从实现的角度来考虑其实是有很大的把握不会在链接的过程中再来处理 inline 关键字的。

如果确实是在前三个步骤中处理的 inline，那么就意味着 inline 函数的定义只能是在当前的源文件中，因为编译的三个步骤都只是针对某个单独的源文件本身的，并不会再去其他源文件中寻找定义。这似乎也非常符合目前的情况，只有第 3 次尝试中源文件中包含了定义，也只有这次没有报错。为了这一点，只需要将原本 A.cpp 中的定义转移到 main.cpp 中：

    // main.cpp
    void A::function() const
    {
        std::cout << "inline test function" << std::endl;
    }

    int main()
    {
        A a;
        a.function();

        return 0;
    }

最终输出为：

>  inline test function

更进一步的话，如果之前的假设成立，那么应该还会出现这样的情况：main.cpp 和 A.cpp 中都有 A::function 函数的定义，如果不报重复定义的错的话，真正执行时应该会使用 main.cpp 中的定义：

    // A.h
    class A
    {
    public:
        inline void function() const;
    }

    // A.cpp
    void A::function() const
    {
        std::cout << "inline test function in A.cpp" << std::endl;
    }

    // main.cpp
    void A::function() const
    {
        std::cout << "inline test function in main.cpp" << std::endl;
    }

最终输出结果为：

> inline test function in main.cpp

这个程序确实没有报错，尽管确实在 A.cpp 和 main.cpp 两个文件中都存在一个函数定义，并且这两个函数定义还不同。这说明编译器此时并没有找到另一个定义，或者找到了但不认为这两个是同一个函数的定义。所以，为了解决这一问题，只需要保证在当前 .cpp 文件里能找到 inline 函数的定义就行了。换句话说，将 inline 函数的定义写在有对应声明的 .h 文件就就能保证一定能找到定义了。

## 总结

所有测试目前都在 G++ 和 VC++ 中进行。虽然事实上只是部分验证了猜测，但是还是了解到了编译器在编译期间对 inline 关键字的部分的处理方式，并且基于这个方式给出了一种能完全解决问题的方案。虽然就个人来说将函数定义写在 .h 文件中显得有些丑陋，但是考虑到 inline 函数普遍会比较短小所以这件事本身也不是完全无法忍受，所以至此先告一段落。

