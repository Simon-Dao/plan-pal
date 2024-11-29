"use client"

import React, { useEffect, useState } from 'react';
import { useSessionStore } from '../_store/store';
import { DateString } from '../_utils/types';
import { jwtDecode } from 'jwt-decode';

type Event = {
  name: string,
  created: DateString
};

type DecodedJWT = {
  email: string;
  exp?: number;
  iat?: number;
};

function MyEvents() {
  const session = useSessionStore(store => store.session);
  const [events, ] = useState<Event[]>([
    {name: 'asdsaas', created:'11/24/2024'},
    {name: 'asdsaas', created:'11/24/2024'},
    {name: 'asdsaas', created:'11/24/2024'},
    {name: 'asdsaas', created:'11/24/2024'},
    {name: 'asdsaas', created:'11/24/2024'},
  ]);

  const [email, setEmail] = useState("n/a");

  useEffect(() => {
    // TODO - Placeholder for fetching events logic
    try {
      setEmail(jwtDecode<DecodedJWT>(session.credential).email); // Assuming session.credential is a valid JWT token
    } catch(error) {
      console.error("Invalid Token", error);
    }
    // This would typically involve fetching from an API and updating the state
  }, [session.credential]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
 

  return (
    <div className='flex flex-col items-center w-full mt-8'>
      <h1 className='text-2xl font-semibold'>Signed in with {email}</h1>

      <div className='mt-4 w-full max-w-4xl'>
        {events.length > 0 ? (
          events.map((event, i) => (
            <div key={i} className='flex justify-between items-center p-4 border-b border-gray-200'>
              <h2 className='text-lg font-medium'>{event.name}</h2>
              <span className='text-sm text-gray-500'>{event.created}</span>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>No events found.</p>
        )}
      </div>
    </div>
  );
}

export default MyEvents;
