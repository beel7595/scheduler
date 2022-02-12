import axios from "axios";
import { useEffect, useReducer } from "react";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_DAYS_SPOTS = "SET_DAYS_SPOTS";

function reducer(state, action) {
    switch (action.type) {
        case SET_DAY: {
            return { ...state, day: action.day };
        }

        case SET_APPLICATION_DATA: {
            return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers };
        }

        case SET_INTERVIEW: {

            const appointment = {
                ...state.appointments[action.id],
                interview: action.interview
            };

            const appointments = {
                ...state.appointments,
                [action.id]: appointment
            };

            return { ...state, appointments }
        };

        case SET_DAYS_SPOTS: {
            return { ...state, days: action.newDays };
        }

        default:
            throw new Error(
                `Tried to reduce with unsupported action type: ${action.type}`
            );
    }
}

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
        // exampleSocket.addEventListener('open', function (event) {
        //     exampleSocket.send('ping');
        // });
        // exampleSocket.addEventListener('message', function (event) {
        //     const data = JSON.parse(event.data);

        //     if (data.type === SET_INTERVIEW) {
        //         const { interview, id } = data;
        //         dispatch({ type: SET_INTERVIEW, id, interview });
        //     }
        // });

        Promise.all([axios.get(GET_DAYS), axios.get(GET_APPOINTMENTS), axios.get(GET_INTERVIEWERS)])
            .then(all => {
                const [days, appointments, interviewers] = all;
                dispatch({ type: SET_APPLICATION_DATA, days: days.data, appointments: appointments.data, interviewers: interviewers.data });
            })
        // return () => {
        //     exampleSocket.close();
        // };
    }, [])


    async function bookInterview(id, interview) {

        await axios.put(PUT_INTERVIEW + id, { interview }).then(() => {
            // dispatch({ type: SET_INTERVIEW, id, interview });
            state.days.forEach((day, index) => {
                if (day.name === state.day) {
                    const newDay = { ...day, spots: day.spots - 1 };
                    const newDays = [...state.days];
                    newDays[index] = newDay;
                    dispatch({ type: SET_DAYS_SPOTS, newDays });

                }
            })
        })
    }

    async function cancelInterview(id) {

        await axios.delete(PUT_INTERVIEW + id).then(() => {
            // dispatch({ type: SET_INTERVIEW, id, interview: null });
            state.days.forEach((day, index) => {
                if (day.name === state.day) {
                    const newDay = { ...day, spots: day.spots + 1 };
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
