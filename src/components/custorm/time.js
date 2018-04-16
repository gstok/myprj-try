/**
 * @function 获取时间的函数timeForMat()
 * @param count:{type:number} 例如：之前的7天或者30天
 * @returns 对象 返回当前的日期和和你需要的过去的多少天的日期
 *
 */
exports.timeForMat = function (count) {
      // 拼接时间
      let time1 = new Date();
          time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000));

      let Y1 = time1.getFullYear();

      let M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1));

      let D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate());
      // 得到当前时间
      let timer1 = Y1 + '-' + M1 + '-' + D1;
      let time2 = new Date();
      time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count));
      let Y2 = time2.getFullYear();
      let M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1));
      let D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate());
      let timer2 = Y2 + '-' + M2 + '-' + D2;
      return {
        today: timer1,
        guoqu: timer2
      }
};
