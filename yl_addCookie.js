/**
 * 
 * 用户提交伊利会员福利社CK
 * 
 * */

const { sendNotify, allEnvs, addEnvs, getUserInfo, updateUserInfo } = require('./quantum');

let user_id = process.env.user_id; //用户id
let command = process.env.command;

!(async () => {
    var encryptsessionid = null;
    try {
        encryptsessionid = command.match(/encryptsessionid=([^& ]+)(?=&?)/)[1]
    } catch {
        console.log("提交的信息中获取encryptsessionid失败！");
    }
    if (!encryptsessionid) {
        await sendNotify("提交的伊利会员福利社CK错误。")
        return;
    }
    console.log("CK：" + encryptsessionid);
    var c = {
        Name: 'raw_main_ylhyencryptsessionid',
        Enable: true,
        Value: `${encryptsessionid}`,
        UserRemark: encryptsessionid || "",
        USERID: user_id,
        EnvType: 2
    };
    if (!encryptsessionid) {
        console.log("没有encryptsessionid参数，直接做新增处理.");
    } else {
        var data2 = await allEnvs(encryptsessionid, 2);
        if (data2.length > 0) {
            console.log("重复的伊利会员福利社用户CK ，更新操作");
            c.Id = data2[0].Id;
            c.Weight = data2[0].Weight;
            c.UserRemark = data2[0].UserRemark;
            c.Remark = data2[0].Remark;
        }
    }
    console.log('开始提交快手伊利会员福利社到量子数据库');
    var data = await addEnvs([c]);
    console.log('提交结果：' + JSON.stringify(data));
    await sendNotify(
        '伊利会员福利社提交成功！' +
        '\n用户ID：' + (user_id || '' ) +
        '\nUID：' + encryptsessionid
    );
})();