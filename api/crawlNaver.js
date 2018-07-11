//가져와서 DB에 저장을 시켜주는 js
const fetch=require('isomorphic-fetch');
const cheerio = require('cheerio');
const mongoose=require('mongoose');

mongoose.promise=require("bluebird");

const Webtoon=require('../model/webtoons.js')

const crawlNaver=()=>{
    return new Promise((resolve,reject)=>{ 
        fetch('https://comic.naver.com/webtoon/weekday.nhn')
        .then(res=>{
            res.text().then(html=>{
                const $=cheerio.load(html);
                const objects=$('div.col');

                const naverTitles=objects.map((i,e)=>{//순서
                    const lists=$(e).children().children('ul').children();
                    return lists.map((i,e)=>{
                        const list=$(e).children('a').attr('title');
                        const imgsrc=$(e).children('div').children('a').children('img').attr('src');
                        
                        const webtoon={
                            title: list,
                            imgsrc: imgsrc,
                        }
                        // console.log(webtoon)
                        return webtoon;

                    })
                });
                return naverTitles;
            }).then(data=>{
                //initialize
                console.log("initializing");
                Webtoon.find((err,toons)=>{
                    if(err)console.error(err);
                    toons.map(toon=>{
                        toon.remove({_id:toon._id},(err,datas)=>{
                            if(err)console.error(err);
                        })
                    })
                })
                .then(()=>{
                    console.log('initialized.');

                    console.log('saving')
                    let filtered=[{}];
                    data.map((i,e)=>{
                        e.map((j,f)=>{
                            const idx=filtered.findIndex(e=>{return e.title===f.title})
                            if(idx>=0){
                                filtered[idx].day=[...filtered[idx].day,i];
                            }else{
                                filtered.push({
                                    day:[i],
                                    title: f.title,
                                    imgsrc: f.imgsrc,
                                });
                            }
                        })
                    })

                    let len=filtered.length;
                    let idx=0;

                    filtered.map((e,i)=>{
                        let newtoon=new Webtoon();
                        newtoon.day= e.day;
                        newtoon.title=e.title;
                        newtoon.imgsrc=e.imgsrc;
                        newtoon.save((err)=>{
                            if(err)console.error(err);
                            idx++;
                            if(len===idx){
                                console.log("finished");
                                resolve();
                            }
                        })
                    })
                })
            })
        });
    })          
}
// crawlNaver()

mongoose.connect("mongodb://admin:qwer1234@ds233551.mlab.com:33551/naverwebtoon",{useNewUrlParser:true});

module.exports=crawlNaver;