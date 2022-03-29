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
   database:"T2111E",
   multipleStatements: true
});


// khai bao ejs lam view engine
app.set("view engine","ejs");
//  cap quyen truy cap cho thu muc public
app.use(express.static("public"));

// tao trang chu
app.get("/",function (req,res) {
    const sql_txt = "select * from Ass3_Hang;select * from Ass3_SanPham;";
    conn.query(sql_txt,function (err,result) {
        if(err) res.send(err.message);
        else res.render("home",{
            hangs:result[0],
            sanphams:result[1]
        });
    })
   // res.render("home");
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
app.get("/san-pham",function (req,res) {
    const sql_txt = "select * from Ass3_SanPham";
    var x = 10;
    conn.query(sql_txt,function (err,result) {
        if(err) res.send(err.message);
        else res.render("products",{
            products:result,
            abc:x
        });
    })
});
app.get("/chi-tiet",function (req,res) {
    const spid = req.query.id || 0;
    const sql_txt = "select * from Ass3_SanPham where ID = "+spid;
    conn.query(sql_txt,function (err,result) {
        if(err) res.send(err.message);
        else if(result.length > 0)
            res.render("detail",{
                product:result[0]
            });
        else res.send("404 Not found");
    })

})

app.get("/chi-tiet-hang",function (req,res) {
    const ms = req.query.masohang || "";
    const sql_txt = `select * from Ass3_Hang where MaSoHang = '${ms}'`;
    conn.query(sql_txt,function (err,result) {
        if(err) res.send(err.message);
        else if(result.length > 0)
        {
            // viet sql truy van san pham
            const sql_txt2 = `select * from Ass3_SanPham where TenHang like '${result[0].TenHang}'`;
            conn.query(sql_txt2,function (err2,result2) {
                if(err2) res.send(err2.message);
                else res.render("chitiethang",{
                    hang:result[0],
                    sanphams:result2
                })
            })
        }
        else res.send("404 Not found");
    })
})