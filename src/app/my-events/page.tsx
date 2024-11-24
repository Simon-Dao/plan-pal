"use client"

import React, { useEffect } from 'react'
import { useSessionStore } from '../_store/store'

function MyEvents() {

  //TODO - get events associated with the google client
  let session = useSessionStore(store => store.session);
  
  useEffect(() => {
    //TODO - get fresh batch of info from database every reload
  }, [])

  return (
    <div>
      {session.clientId}
      <br />
      {session.credential}
    </div>
  )
}

export default MyEvents