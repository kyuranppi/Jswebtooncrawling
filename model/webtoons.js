const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const WebToonSchema=new Schema({
    day: Array,
    title: String,
    imgsrc: String,

});

module.exports=mongoose.model("WebToon",WebToonSchema);