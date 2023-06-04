/**
 * 
 * 用户提交渤海宣传员CK
 * 
 * */

const { sendNotify, allEnvs, addEnvs, getUserInfo, updateUserInfo } = require('./quantum');

let user_id = process.env.user_id; //用户id
let command = process.env.command;

!(async () => {
    var uid = null;
    var token = null;
    try {
        uid = command.match(/uid=([^& ]+)(?=&?)/)[1]
        token = command.match(/token=([^& ]+)(?=&?)/)[1]
    } catch {
        console.log("提交的信息中获取uid失败！");
    }
    if (!token) {
        await sendNotify("提交的渤海宣传员CK错误。")
        return;
    }
    console.log("UID：" + uid);
    var c = {
        Name: 'bhxcytoken',
        Enable: true,
        Value: `@uid=${uid}&token=${token}`,
        UserRemark: uid || "",
        USERID: user_id,
        EnvType: 2
    };
    if (!uid) {
        console.log("没有uid参数，直接做新增处理.");
    } else {
        var data2 = await allEnvs(uid, 2);
        if (data2.length > 0) {
            console.log("重复的渤海宣传员用户CK ，更新操作");
            c.Id = data2[0].Id;
            c.Weight = data2[0].Weight;
            c.UserRemark = data2[0].UserRemark;
            c.Remark = data2[0].Remark;
        }
    }
    console.log('开始提交快手渤海宣传员到量子数据库');
    var data = await addEnvs([c]);
    console.log('提交结果：' + JSON.stringify(data));
    await sendNotify(
        '渤海宣传员提交成功！' +
        '\n用户ID：' + (user_id || '') +
        '\nUID：' + uid
    );
})();