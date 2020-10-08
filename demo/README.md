# 欢迎使用 SMARTY-PRESS


## 简单说明

### 文件目录
* demo 根目录下的.md文件为一级目录：
    * 如：level1-0.md、level1-1.md
* demo 根目录下的文件夹为二级目录：
    * 如：文件夹level2A、文件夹level2B
* 以此类推在二级目录下创建的文件夹为三级目录

### 实时预览

* 添加、修改、删除 demo 目录的文件，将在浏览器中可以实时显示修改结果

### 支持链接

* 链接到 [二级目录 A](/level2A/README.md)

* ' /level2A/README.md ' 路径中的 README.md 可以省略
 * 链接到 [二级目录 A](/level2A)

### 自动识别标题

* 自动识别 ”一级标题 # “ 为菜单中的链接

* 如果文件中不存在标题，则会显示 文件路径

### 文档自动排序

* 文档会按“路径”进行排序

*  **同级** 目录中，" README.md " 会排在第一个

### 支持多级目录显示

## 插件开发说明

查看[插件开发说明](https://github.com/su37josephxia/smarty-press/tree/master/src/markdown/provider/__test_files__/)
