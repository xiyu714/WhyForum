这是一个为了完成数据库课程设计而做的项目
使用了Express+EJS+SQL Server

创建数据库代码：
```mssql
-- 创建users表的代码:
create table users
(
    name nchar(20) primary key,
    password nvarchar(50),
    email char(20)
)
go

-- 创建posts表的代码:
create table posts
(
    Title nchar(100) primary key,
    Content ntext,
    AuthorName nchar(20),
    CreateDate datetime,
    LastDate datetime
)
go

-- 创建comments表的代码:
create table comments
(
    Title nchar(100),
    Content ntext,
    CreateDate datetime,
    Name nchar(20),
    [Index] int,
    primary key(Title, [Index])
)
go

-- 创建replies表的代码:
create table replies
(
    [Index] int,
    Title nchar(100),
    Content ntext,
    CreateDate datetime,
    primary key(Title, [Index])
)
go

-- 创建sessions表的代码: session表主要用来验证用户信息
CREATE TABLE [dbo].[sessions](
    [sid] [varchar](255) NOT NULL PRIMARY KEY,
    [session] [varchar](max) NOT NULL,
    [expires] [datetime] NOT NULL
)

```
