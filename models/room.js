// 載入nbm
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        name: String,
        price: {
            type: Number,
            required: [true, '價格必填'], //必填的資料
        },
        rating: Number,
        createdAt: {
            type: Date,
            default: Date.now, // 可設定預設
            select: false, // 不會讓前台看到這個資料
        },
    },
    {
        versionKey: false,
        //collection: 'room', // 讓collection不加s
        timestamps: true, //新增時間
    }
);

// 設定 Model - 要大寫
const Room = mongoose.model('Room', roomSchema);

// 讓其他檔案可以引用
module.exports = Room;
