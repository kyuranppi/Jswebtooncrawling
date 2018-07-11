const express = require("express")
const app = express();
const port = 3000;
const bodyParser=require("body-parser");

const crawlNaver=require('./api/crawlNaver.js');

const mongoose=require('mongoose');
const Webtoon=require('./model/webtoons.js');
//ejs라는 템플릿을 사용해서 프론트를 보이게 함

const secret="abcdefg"
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.end("hello");
});

app.get('/test_json', (req,res)=>{
    res.json({
        path: '/test_json',
        asdf: 'ghjk'
    });
});

app.post('/crawl_naver', (req,res)=>{
    if(req.body.secret===secret){
        crawlNaver().then(()=>{
            console.log("promise!")
            res.json({
                path:'/crawl_naver',
                crawl: 'doing'
            })
        });
       
    }else{
    res.json({
        path: '/crawl_naver POST'
        });
    }   
})
.get('/crawl_naver',(req,res)=>{
    res.json({
        path: '/crawl_naver GET'
    });
})

app.get('/list_naver',(req,res)=>{
    Webtoon.find((err,data)=>{
        if(err)console.error(err);
        res.json(data);
    })
})

app.listen(port, ()=>{
    console.log(`server is listening on port ${port}.`);
});

mongoose.connect("mongodb://admin:qwer1234@ds233551.mlab.com:33551/naverwebtoon",{useNewUrlParser:true});