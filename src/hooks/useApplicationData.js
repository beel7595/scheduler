import axios from "axios";
import { useEffect, useReducer } from "react";

import reducer, {
    SET_DAY,
    SET_APPLICATION_DATA,
    SET_INTERVIEW,
    SET_DAYS_SPOTS
  } from "reducers/application";

const useApplicationData = () => {
    const GET_DAYS = "/api/days";
    const GET_APPOINTMENTS = "/api/appointments";
    const GET_INTERVIEWERS = "/api/interviewers";
    const PUT_INTERVIEW = "/api/appointments/";


    const [state, dispatch] = useReducer(reducer, {
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {}
    });


    const setDay = day => dispatch({ type: SET_DAY, day });



    useEffect(() => {

        // let exampleSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        let exampleSocket = new WebSocket(`ws://localhost:8001`);
        exampleSocket.addEventListener('open', function (event) {
            exampleSocket.send('ping');
        });
        exampleSocket.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);
            if (data.type === SET_INTERVIEW) {
                const { interview, id } = data;
                dispatch({ type: SET_INTERVIEW, id, interview });
            }
        });
        Promise.all([axios.get(GET_DAYS), axios.get(GET_APPOINTMENTS), axios.get(GET_INTERVIEWERS)])
            .then(all => {
                const [days, appointments, interviewers] = all;
                dispatch({ type: SET_APPLICATION_DATA, days: days.data, appointments: appointments.data, interviewers: interviewers.data });
            })
        return () => {
            exampleSocket.close();
        };
    }, [])


    async function bookInterview(id, interview) {

        await axios.put(PUT_INTERVIEW + id, { interview }).then(() => {
            dispatch({ type: SET_INTERVIEW, id, interview });

            state.days.forEach((day, index) => {

                if (day.name === state.day) {
                    let spot = day.spots;
                    if (state.appointments[id].interview == null && interview) {
                        spot--;
                    }
                    const newDay = { ...day, spots: spot };
                    const newDays = [...state.days];
                    newDays[index] = newDay;
                    dispatch({ type: SET_DAYS_SPOTS, newDays });
                }
            })
        })
    }

    async function cancelInterview(id) {

        await axios.delete(PUT_INTERVIEW + id).then(() => {
            dispatch({ type: SET_INTERVIEW, id, interview: null });

            state.days.forEach((day, index) => {

                if (day.name === state.day) {
                    let spot = day.spots;
                    spot++;
                    const newDay = { ...day, spots: spot };
                    const newDays = [...state.days];
                    newDays[index] = newDay;
                    dispatch({ type: SET_DAYS_SPOTS, newDays });
                }
            })
        })

    }

    return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;
