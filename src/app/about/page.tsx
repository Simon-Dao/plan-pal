import React from "react";

function About() {
  return (
    <div className="flex w-full h-full justify-center items-center py-12">
      <div className="w-3/4 bg-gray-200 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-xl font-bold">About:</h1>
          <p className="text-gray-700 mt-2">
            This is a project created by a hobbyist programmer who needed to
            schedule a lot of meetings.
          </p>
        </div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Purpose:</h1>
          <p className="text-gray-700 mt-2">
            Online scheduling tool to find mutually convenient meeting times.
          </p>
        </div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Key Feature:</h1>
          <p className="text-gray-700 mt-2">
            Interactive calendar for participants to mark availability.
          </p>
        </div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Ease of Use:</h1>
          <p className="text-gray-700 mt-2">
            Simple, minimalist interfact with no manditory account creation.
          </p>
        </div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Process:</h1>
          <p className="text-gray-700 mt-2">
            Create an event, share the link, and gather input from participants.
          </p>
        </div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">Ideal For:</h1>
          <p className="text-gray-700 mt-2">
            Teams, organizations, and social groups coordinating schedules.
          </p>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold">Privacy:</h1>
          <p className="text-gray-700 mt-2">
            This application only stores emails used by google logins. All source code for this project is open source. You can check it out here: https://github.com/Simon-Dao/plan-pal
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
