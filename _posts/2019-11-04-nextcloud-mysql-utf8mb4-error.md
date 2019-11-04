---
layout: post
title:  "Nextcloud 解决 MySQL 没有支持 4 字节字符时报错： SQLSTATE[42000]，解决办法"
categories: 软件使用
tags: php
comments: 1
---
根据 Nextcloud 控制面板安全及设置警告，解决最后一个报警，不支持 4 字节的问题时，遇到该问题，
所使用的数据库为MySQL但没有对4字节字符的支持。为正确处理文件名或评论中使用的4字节字符（比如emoji表情），建议开启MySQL的4字节字符支持。详细信息请阅读相关文档页面。

本文撰写时所使用的版本：Nextcloud 16.0.4

# 问题过程
按照 Nextcloud 给出的文档需要需要进行一系列的修复，本文到最后一步执行以下命令时遇到问题：
```sh
sudo -u www-data php occ maintenance:repair
```
异常截图：
![image](/assets/res/img/219ac8fa9c61bb023bb783389d7ff12ee29c60ff.png)
```error
In AbstractMySQLDriver.php line 125:

  An exception occurred while executing 'ALTER TABLE `oc_systemtag_group` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;':

  SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long; max key length is 767 bytes

```
经过研究，发现是因为使用 3 字节的 utf8 编码时，索引长度最大 767 可以存储 767/3 = 255 个字符。
但使用 utf8mb4 时，因为是 4 字节，索引最大长度 767 不变的情况下，最多可以存储 767/4 = 191 个字符。

于是排查了数据库相关的字段，发现比较多的字段使用了 varchar(255)，经过手动处理后，上面的 repair 执行成功。
![image](/assets/res/img/9352add5b0cc26772b2334116adadfa25e8fb135.png)

以下将修复过程中使用的 SQL 进行了汇总整理，遇到此问题时，可以直接执行以下 SQL，不必手动去修复。
```sql
ALTER TABLE `oc_addressbooks`
MODIFY COLUMN `principaluri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `id`
MODIFY COLUMN `uri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `displayname`;

ALTER TABLE `oc_authtoken`
MODIFY COLUMN `token`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' AFTER `name`;

ALTER TABLE `oc_calendarobjects`
MODIFY COLUMN `uri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `calendardata`;

ALTER TABLE `oc_calendars`
MODIFY COLUMN `principaluri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `id`,
MODIFY COLUMN `uri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `displayname`;

ALTER TABLE `oc_calendarsubscriptions`
MODIFY COLUMN `uri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `id`,
MODIFY COLUMN `principaluri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `uri`;

ALTER TABLE `oc_dav_shares`
MODIFY COLUMN `principaluri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `id`,
MODIFY COLUMN `type`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `principaluri`,
MODIFY COLUMN `publicuri`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `resourceid`;

ALTER TABLE `oc_login_flow_v2`
MODIFY COLUMN `poll_token`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL AFTER `started`,
MODIFY COLUMN `login_token`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL AFTER `poll_token`;

ALTER TABLE `oc_migrations`
MODIFY COLUMN `app`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL FIRST ,
MODIFY COLUMN `version`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL AFTER `app`;

ALTER TABLE `oc_mimetypes`
MODIFY COLUMN `mimetype`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' AFTER `id`;

ALTER TABLE `oc_systemtag_group`
MODIFY COLUMN `gid`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL AFTER `systemtagid`;

ALTER TABLE `oc_trusted_servers`
MODIFY COLUMN `url_hash`  varchar(191) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT 'sha1 hash of the url without the protocol' AFTER `url`;
```
# 总结
我们在设计数据库时，也应该注意此问题，utf8 的情况下索引字段最大 varchar(255)，utf8mb4 的情况下索引最大 varchar(191)。我们可以修改 mysql.conf 最大索引长度，但不推荐这样做，这样会导致性能下降。我们应该尽量让索引字段低于限制，索引字段太长时，我们是不是应该考虑设计上有问题了？

# 版权
> 版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）<br/>
> 原创作者：10086@xiaoi.me 发表于 Xiaoi's Blog：[https://blog.xiaoi.me](https://blog.xiaoi.me)<br/>
> 原文链接：[{{site.url}}{{page.url}}]({{site.url}}{{page.url}})<br/>

扫码关注我，在线与我沟通、咨询
![Xiaoi's Blog](/assets/res/qrcode.png)

***转载请保留原文链接以及版权信息***