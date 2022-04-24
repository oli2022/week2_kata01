const http = require('http');

// 引用 room.js
const Room = require('./models/room.js');

// 載入nbm
const mongoose = require('mongoose');

// 載入 dotenv
const dotenv = require('dotenv');

// 載入 config.env 檔案
dotenv.config({ path: './config.env' });
console.log(process.env.PORT);

// mongodb+srv://learn_mongoDB:<password>@cluster0.crbep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const DB = process.env.DATABASE.replace(
    // replace 比對
    '<password>',
    process.env.DATABASE_PASSWORD
);
// 連接資料庫
// 這是一個 promise
mongoose
    .connect(DB)
    .then(() => {
        console.log('資料庫連線成功'); // 如果終端機有顯示，就表示成功連線
    })
    .catch((error) => {
        console.log(error);
    });

// // 刪除單筆資料
// Room.findByIdAndDelete('6264cd1ec1909d35fdcf6bb4').then(() => {
//     console.log('單筆刪除成功');
// });

// // 更新資料
// Room.findByIdAndUpdate('6264cd2ec1909d35fdcf6bb8', {
//     name: '更新資料_1',
// }).then(() => {
//     console.log('資料更新成功');
// });
// 設定 schema
// 這是比較簡化的版本
// const roomSchema = {
//     name: String,
//     price: {
//         type: Number,
//         required: [true, '價格必填'], //必填的資料
//     },
//     rating: Number,
// };

// mongoose的邏輯：Room => rooms
// 開頭會變成小寫
// 名稱後面會加上s

// 新增資料
// 實體、實例
// 寫法1 - 新增資料
// const testRoom = new Room({
//     name: '小叮噹單人房8',
//     price: 2000,
//     rating: 4.0,
// });

// // 資料儲存
// testRoom
//     .save()
//     .then(() => {
//         console.log('新增資料成功');
//     })
//     .catch((error) => {
//         console.log(error.errors.price.properties.message);
//     });
// const requestListener = (req, res) => {
//     console.log(req.url);
//     res.end();
// };

// 寫法2 - 新增資料
// Room.create({
//     name: '第二種寫法_3',
//     price: 2000,
//     rating: 4.5,
// })
//     .then(() => {
//         console.log('新增資料成功');
//     })
//     .catch((error) => {
//         console.log(error.errors.price.properties.message);
//     });
// const requestListener = (req, res) => {
//     console.log(req.url);
//     res.end();
// };

// 取得所有房型
const requestListener = async (req, res) => {
    // 新增房型
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json',
    };
    if (req.url == '/rooms' && req.method == 'GET') {
        const rooms = await Room.find(); // 抓到資料後才往下跑
        res.writeHead(200, headers);
        res.write(
            // 將資料轉成json
            JSON.stringify({
                status: 'success',
                rooms,
            })
        );
        res.end();
    } else if (req.url == '/rooms' && req.method == 'POST') {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const newRoom = await Room.create({
                    name: data.name,
                    price: data.price,
                    rating: data.rating,
                }); // 因為有加await所以後面就不用加.then跟.catch
                res.writeHead(200, headers);
                res.write(
                    // 將資料轉成json
                    JSON.stringify({
                        status: 'success',
                        rooms: newRoom,
                    })
                );
                res.end();
            } catch (error) {
                res.writeHead(400, headers);
                res.write(
                    JSON.stringify({
                        status: 'false',
                        message: '欄位沒有正確',
                        error: error,
                    })
                );
                res.end();
            }
        });
    } else if (req.url == '/rooms' && req.method == 'DELETE') {
        const rooms = await Room.deleteMany({});
        // 也可以這樣寫
        // await Room.deleteMany({});
        res.writeHead(200, headers);
        res.write(
            JSON.stringify({
                status: 'success',
                rooms,
            })
        );
        res.end();
    } else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(400, headers);
        res.write(
            JSON.stringify({
                status: 'false',
                message: '無此網路路由',
            })
        );
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
