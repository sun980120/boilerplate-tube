const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {  // 파일이 업로드될 경로 설정
		cb(null, 'uploads/')
	},
    filename: (req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req,file,cb)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'),false)
        }
        cb(null, true)
    }
})
const upload = multer({storage:storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles',(req,res)=>{
    // 비디오를 서버에 저장
    upload(req,res,err=>{
        console.log(res.req.file)
        if(err){
            return res.json({success: false,err})
        }
        return res.json({success: true, url:res.req.file.path,fileName:res.req.file.filename})
    })
})

router.post('/thumbnail',(req,res)=>{
    // 썸네일 생성 하고 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileDuration = "";
    console.log(2)

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url,function(err,metadata){
        console.log(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })
    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames',function(filenames){
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)
        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end',function(){
        console.log('Screenshots taken')
        console.log(filePath)
        return res.json({success:true, url:filePath,fileDuration:fileDuration})
    })
    .on('error',function(err){
        console.error(err);
        return res.json({success:false, err});
    })
    .screenshots({
        count:1,
        folder:'uploads/thumbnails',
        size:'320x240',
        filename:'thumbnail-%b.png'
    })
})

router.post('/uploadVideo',(req,res)=>{
    console.log(2)
    // 비디오 정보들을 저장한다.
    const video = new Video(req.body)
    video.save((err,doc)=>{
        if(err) return res.json({ success: false, err})
        res.status(200).json({success:true})
    })
})

router.get('/getVideo',(req,res)=>{
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다. Let
    console.log(1)
    Video.find()
        .populate('writer') // user의 정보를 가져오게 해주는 부분
        .exec((err,videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true,videos})
        })
})

module.exports = router;
