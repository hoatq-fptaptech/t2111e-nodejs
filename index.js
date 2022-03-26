const express = require("express");
const app = express();// tao hosting
const port = process.env.PORT | 2603;
// khoi chay ung dung
app.listen(port,function () {
  console.log("Server is running...");
});
// tao cau hinh va ket noi mysql
const mysql = require("mysql");
const conn = mysql.createConnection({
   host:"localhost",
   port:"3306",
   user:"root",
   password:"root", // xampp: để trống
   database:"T2111E"
});


// khai bao ejs lam view engine
app.set("view engine","ejs");
//  cap quyen truy cap cho thu muc public
app.use(express.static("public"));

// tao trang chu
app.get("/",function (req,res) {
    res.render("home");
});

app.get("/thoi-su",function (req,res) {
    res.send({
        message:"success",
        data:[
            {
                name:"Nguyen Van an",
                age:18
            }
        ]
    });
});
app.get("/login",function (req,res) {
    res.render("login");
});
app.get("/ds-hang",function (req,res) {
 // tra ve danh sach hang trong db
    const sql_txt = "select * from Ass3_Hang";
    conn.query(sql_txt,function (err,result) {
        if(err) res.send(err.message);
        else res.send({
            message:"Success",
            data:result
        });
    })
});

app.get("/ds-sp-hang",function (req,res) {
    // tra ve danh sach hang trong db
    const tenhang =  req.query.hang;
    const sql_txt = "select * from Ass3_SanPham left join Ass3_Hang on Ass3_SanPham.TenHang = Ass3_Hang.TenHang " +
        "where Ass3_SanPham.TenHang like '%"+tenhang+"%'";
    conn.query(sql_txt,function (err,result) {
        if(err) res.send(err.message);
        else res.send({
            message:"Success",
            data:result
        });
    })
});