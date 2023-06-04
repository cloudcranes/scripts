/**
 * 
 * 用户提交活力伊利奶卡CK
 * 
 * */

const { sendNotify, allEnvs, addEnvs, getUserInfo, updateUserInfo } = require('./quantum');

let user_id = process.env.user_id; //用户id
let command = process.env.command;

!(async () => {
    var access_token = null;
    try {
        access_token = command.split("#")[1]
    } catch {
        console.log("提交的信息中获取access_token失败！");
    }
    if (!access_token) {
        await sendNotify("提交的活力伊利奶卡access_token有误!")
        return;
    }
    console.log("CK：" + access_token);
    var c = {
        Name: 'ylnn',
        Enable: true,
        Value: `${access_token}`,
        UserRemark: '伊利牛奶@' + (access_token || ""),
        USERID: user_id,
        EnvType: 2
    };
    if (!access_token) {
        console.log("没有access_token参数，直接做新增处理.");
    } else {
        var data2 = await allEnvs(access_token, 2);
        if (data2.length > 0) {
            console.log("重复的活力伊利奶卡用户CK ，更新操作");
            c.Id = data2[0].Id;
            c.Weight = data2[0].Weight;
            c.UserRemark = data2[0].UserRemark;
            c.Remark = data2[0].Remark;
        }
    }
    console.log('开始提交活力伊利奶卡到量子数据库');
    var data = await addEnvs([c]);
    console.log('提交结果：' + JSON.stringify(data));
    await sendNotify(
        '活力伊利奶卡提交成功！' +
        '\n用户ID：' + (user_id || '' ) +
        '\naccess_token ' + access_token
    );
})();