/**
 * 
 * 用户提交饿了么CK
 * ADD_ELEMECOOKIE_USE_SCORE 添加饿了么 CK需要多少积分。（设置为0 或者 不设置时则表示不需要积分。）
 * 
 * */


let ADD_ELEMECOOKIE_USE_SCORE = (process.env.ADD_ELEMECOOKIE_USE_SCORE || 0) * 1;
const { sendNotify, allEnvs, addEnvs, getUserInfo, updateUserInfo } = require('./quantum');

let user_id = process.env.user_id; //用户id
let command = process.env.command;

!(async () => {
    command = command + ';';
    var SID = null;
    var cookie2 = null;
    var USERID = null;
    var _tb_token_ = null;
    var wxPuid = null;
    try {
        cookie2 = command.match(/cookie2=([^; ]+)(?=;?)/)[1];
        _tb_token_ = command.match(/_tb_token_=([^; ]+)(?=;?)/)[1];
        USERID = command.match(/USERID=([^; ]+)(?=;?)/)[1];
        SID = command.match(/SID=([^; ]+)(?=;?)/)[1]
        //wxPuid = command.match(/wxPuid=([^; ]+)(?=;?)/)[1];
    } catch {
        console.log("提交的信息中获取USERID失败！");
        await sendNotify("未获取到饿了么USERID!")
    }
    if (!cookie2) {
        await sendNotify("提交的饿了么CK错误。")
        return;
    }
    console.log("USERID：" + USERID);
    var c = {
        Name: 'elmck',
        Enable: true,
        Value: `SID=${SID};cookie2=${cookie2};${(USERID ? `USERID=${USERID}` : '')};_tb_token_=${_tb_token_};`,
        UserRemark: USERID || "",
        UserId: user_id,
        EnvType: 2
    };
    if (!USERID) {
        console.log("没有USERID参数，直接做新增处理.");
    } else {
        var data2 = await allEnvs(USERID, 2);
        if (data2.length > 0) {
            console.log("重复的饿了么用户CK ，更新操作");
            c.Id = data2[0].Id;
            c.Weight = data2[0].Weight;
            c.UserRemark = data2[0].UserRemark;
            c.Remark = data2[0].Remark;
        }
    }
    if (ADD_ELEMECOOKIE_USE_SCORE > 0) {
        var user = (await getUserInfo()) || {};
        user.MaxEnvCount -= ADD_ELEMECOOKIE_USE_SCORE;
        if (ADD_ELEMECOOKIE_USE_SCORE > 0 && user.MaxEnvCount < 0) {
            await sendNotify(`该操作需要${ADD_ELEMECOOKIE_USE_SCORE}积分
您当前积分剩余${user.MaxEnvCount + ADD_ELEMECOOKIE_USE_SCORE}`);
            return;
        }
        console.log(`扣除用户积分：${ADD_ELEMECOOKIE_USE_SCORE}，剩余积分：${user.MaxEnvCount}`)
        await updateUserInfo(user);
    }
    console.log('开始提交饿了么到量子数据库');
    var data = await addEnvs([c]);
    console.log('提交结果：' + JSON.stringify(data));
    await sendNotify(
        '饿了么提交成功！\n扣除积分：' +
        ADD_ELEMECOOKIE_USE_SCORE +
        '\n用户ID：' + (USERID || '')
    );
})();