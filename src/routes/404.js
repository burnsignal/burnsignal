import React from 'react';
import { Link } from 'react-router-dom'

export default function Error404(){
  return(
    <center>
      <div class='page404'>
        <h2> 404 not found </h2>
        <label> Oops, looks like you've made a wrong turn...
        <br /><Link to ='/'> Take me back! </Link></label>
     </div>
    </center>
  )
}
