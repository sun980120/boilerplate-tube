import React, { useEffect, useState } from 'react'
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd'
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom'

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Video, setVideo] = useState([])
    useEffect(() => {
        axios.get('/api/video/getVideo')
            .then(response => {
                if (response.data.success) {
                    setVideo(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패했습니다')
                }
            })
    }, [])

    const renderCards = Video.map((video, index) => {
        
        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor((video.duration-minutes*60));

        return (
            <Col lg={6} md={8} xs={24}>
                {/*  */}
                <div style={{ position: 'relative' }}>
                    <Link to="">
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`}/>
                    <div className="duration">
                        <span>{minutes} : {seconds}</span>
                    </div>
                    </Link>
                </div>
                {/* */}
                <br />
                <Meta avatar={
                    <Avatar src={video.writer.image}/>
                } title={video.title}
                 description="" />
                 <span>{video.writer.name} </span> <br />
                 <span style={{marginLeft:'3rem'}}>{video.views} views </span><span>{moment(video.createdAt).format("MMM Do YY")}"</span>
            </Col>
        )
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage
