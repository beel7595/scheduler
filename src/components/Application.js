import React, { useEffect, useState } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

const GET_DAYS = "http://localhost:8001/api/days";
const GET_APPOINTMENTS = "http://localhost:8001/api/appointments";
const GET_INTERVIEWERS = "http://localhost:8001/api/interviewers";
const PUT_INTERVIEW = "http://localhost:8001/api/appointments/";


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));
  const setAppointments = appointments => setState(prev => ({ ...prev, appointments }));
  const setInterviewers = interviewers => setState(prev => ({ ...prev, interviewers }));

  useEffect(() => {
    Promise.all([axios.get(GET_DAYS), axios.get(GET_APPOINTMENTS), axios.get(GET_INTERVIEWERS)])
      .then(all => {
        const [days, appointments, interviewers] = all;
        setDays(days.data);
        setAppointments(appointments.data);
        setInterviewers(interviewers.data);
      })
  }, [])

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    await axios.put(PUT_INTERVIEW + id, { interview }).then(() => {
      setAppointments(appointments);
    })
  }

  async function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    await axios.delete(PUT_INTERVIEW + id).then(() => {
      setAppointments(appointments);
    })
  }

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  const appointmentList = dailyAppointments.map((appointment, index) => {
    if (appointment === undefined) {
      return null;
    }
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={index}
        {...appointment}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      ></Appointment>
    )
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={day => setDay(day)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
