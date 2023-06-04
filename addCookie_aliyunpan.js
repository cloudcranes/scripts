/**
 * 
 * 用户提交阿里云盘CK
 * 
 * */

const { sendNotify, allEnvs, addEnvs, getUserInfo, updateUserInfo } = require('./quantum');

let user_id = process.env.user_id; //用户id
let command = process.env.command;

!(async () => {
    var refresh_token = null;
    try {
        refresh_token = command.split("#")[1]
    } catch {
        console.log("提交的信息中获取refresh_token失败！");
    }
    if (!refresh_token) {
        await sendNotify("提交的阿里云盘refresh_token有误\n获取方式：https://alist.nn.ci/zh/guide/drivers/aliyundrive.html")
        return;
    }
    console.log("CK：" + refresh_token);
    var c = {
        Name: 'ALI_TOKEN',
        Enable: true,
        Value: `${refresh_token}`,
        UserRemark: '阿里云盘@' + (refresh_token || ""),
        USERID: user_id,
        EnvType: 2
    };
    if (!refresh_token) {
        console.log("没有refresh_token参数，直接做新增处理.");
    } else {
        var data2 = await allEnvs(refresh_token, 2);
        if (data2.length > 0) {
            console.log("重复的阿里云盘用户CK ，更新操作");
            c.Id = data2[0].Id;
            c.Weight = data2[0].Weight;
            c.UserRemark = data2[0].UserRemark;
            c.Remark = data2[0].Remark;
        }
    }
    console.log('开始提交阿里云盘到量子数据库');
    var data = await addEnvs([c]);
    console.log('提交结果：' + JSON.stringify(data));
    await sendNotify(
        '阿里云盘提交成功！' +
        '\n用户ID：' + (user_id || '' ) +
        '\nrefresh_token ' + refresh_token
    );
})();