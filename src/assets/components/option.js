import React, { Fragment, useState } from 'react'
import { Dropdown, DropdownToggle } from "reactstrap"
import { createURL } from "../../constants/operatives"
import { PINK_PRIMARY } from "../../constants/palette.js"
import { Col, Row } from "reactstrap"
var QRCode = require('qrcode.react');

function Option(props) {
  const [ triggerState, setTrigger ] = useState(false)
  const ENS = `${createURL(props.title)}.burnsignal.eth`

  return (
    <Fragment>
      <div class="modal fade" id="yes" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{props.title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Vote <span id="pink">YES</span> by sending any amount of ETH to <br/>
              <a href='https://etherscan.io'><span id="pink">yes</span>.{ENS}</a>
              <div class="poll-qr">
                <QRCode value={props.address.yes} />
              </div>
            To ensure that you vote counts, please link your ethereum account
            to your BrightID account at  <a href="https://ethereum.brightid.org">ethereum.brightid.org</a>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="no" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{props.title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Vote <span id="pink">NO</span> by sending any amount of ETH to <br/>
              <a href='https://etherscan.io'><span id="pink">no</span>.{ENS}</a>
              <div class="poll-qr">
                <QRCode value={props.address.no} />
              </div>
            To ensure that you vote counts, please link your ethereum account
            to your BrightID account at  <a href="https://ethereum.brightid.org">ethereum.brightid.org</a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Option
