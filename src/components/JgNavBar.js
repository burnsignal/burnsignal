import React, { Component } from 'react';
import { Container, Row, Col } from "reactstrap";


class JgNavBar extends Component {

  render() {
    return(

        <Row className='jg-nav'>
          <Col sm="12" md={{ size: 8, offset: 2 }}>
            <div className='jg-title'>BURN SIGNAL</div>
            <i className="tim-icons icon-single-02"></i>


          </Col>
        </Row>

    )

  }
}

export default JgNavBar
