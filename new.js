const fetch=require('isomorphic-fetch');
const cheerio = require('cheerio');

// console.log("hi");
// setTimeout(()=>console.log('hi2'),1000);
// console.log("hi3");
// async, await,
// then - Javascript Promise

fetch('https://comic.naver.com/webtoon/weekday.nhn')
.then(res=>{
    res.text().then(html=>{
        const $=cheerio.load(html);
        const objects=$('div.col');

        // cheerio에서 가져온 object를 mapping할 때 순서는 i,e 보통은 e, i 니까 주의
        const naverTitles=objects.map((i,e)=>{//순서
            const lists=$(e).children().children('ul').children();
            return lists.map((i,e)=>{
                const list=$(e).children('a').attr('title');
                const imgsrc=$(e).children('div').children('a').children('img').attr('src');
                
                const webtoon={
                    title: list,
                    imgsrc: imgsrc,
                }
                console.log(webtoon)
                return webtoon;

            })
        })
        // console.log(naverTitles);
        
    });
});
 
