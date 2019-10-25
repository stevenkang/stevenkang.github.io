临时笔记



-- 更新超过转让时间的未失效状态
update `p2p_transfer` set state = 3
where create_date >= '2019-10-01'
and state = 1 and end_date < now();