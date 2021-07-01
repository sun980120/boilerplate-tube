import React from 'react'
import { Row, Col, List, Avatar } from 'antd'

function VideoDetailPage() {
    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src controls />
                        <List.Item actions>
                            <List.Item.Meta
                                avatar
                                title
                                description
                            />
                        </List.Item>
                        {/* Comment */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    side Video
                </Col>
            </Row>
        </div>
    )
}

export default VideoDetailPage
