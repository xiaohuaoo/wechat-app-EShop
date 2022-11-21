// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  try {
    return await db.collection('product_shopping').doc(event.id).update({
      data:{
        name:event.name,
        fenlei:event.fenlei,
        price:event.price,
        desc:event.desc,
        image:event.fileID
      }
    })
  } catch (e) {
    console.log(e)
  }
}