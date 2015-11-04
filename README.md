# 用markdonw写PPT（Translate md to reveal）

由[reveal-md](https://github.com/webpro/reveal-md)更改而来

Modified from [reveal-md](https://github.com/webpro/reveal-md)


# 一些额外的使用提示（Extra Usage Hint）

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
<iframe style="width: 700px; height: 500px" data-src="./asset/ec-next/test/area.html">
</iframe>
```
如果想在每页或每fragment进入时候加载iframe中内容，就将src放在data-src下即可。

Put src in `data-src` attribute to enable auto reload iframe when
page changed or fragment changed


### 监视文件改变自动编译（Watch）

加入`-w`参数：

using `-w`

`md2reveal -w mySlides.md`