# 用markdonw写PPT（Translate md to reveal）

由[reveal-md](https://github.com/webpro/reveal-md)更改而来

Modified from [reveal-md](https://github.com/webpro/reveal-md)

# 使用方式（Usage）

* 安装

    * `git clone`
    * `npm install`
    * 定义命令（Define alias）：

```
alias md2reveal="node /your-folder/md2reveal/bin/cli.js"
```

* 开始编译（Compile）：

```
md2reveal mySlides.md
```

* 生成（Production）：`mySlides.html`

* 注意：资源文件（img/css/js...）须放到同级目录下的`asset`文件夹中。

Notice: put resource files (img/css/js...), if exists, in the directory named `asset` in the level of the `md` file.

* 监视文件改变自动编译（Watch, if you wish）

加入`-w`参数：

using `-w`

`md2reveal -w mySlides.md`



# Markdown中一些额外的使用提示（Extra Usage Hints of Markdown）

### 每页中的分步显示（Fragment）

```
{0|阿斯顿发送到}
{1|撒旦法撒旦}
```
or

```
<div class="fragment" data-fragment-index="0">阿斯顿发送到</div>
<div class="fragment" data-fragment-index="1">撒旦法撒旦</div>
```

### 嵌入iframe（Embed iframe）

```
~[70%*500](http://echarts.baidu.com/doc/example/line1.html)
```

会被转换为（will be translate to）：
```
<iframe style="width: 70%; height: 500px" data-md2r-src="./asset/ec-next/test/area.html">
</iframe>
```

宽度高度可以省略（width and height can be omitted）：
```
~[*500](http://echarts.baidu.com/doc/example/line1.html)
```
```
~[70%*](http://echarts.baidu.com/doc/example/line1.html)
```
```
~[](http://echarts.baidu.com/doc/example/line1.html)
```

将src放在data-src下意思是，在每页或每fragment进入时候加载iframe中内容。

Put src in `data-src` attribute to enable auto reload iframe when
page changed or fragment changed

### 写注释（Note）

```
Note:
这里的内容在注释中
```

# Reveal演示的一些提示（Presentation Hints）

reveal演示的时候，按`s`键，能开启后台看注释的模式。

Try pressing `s` when presenting.


