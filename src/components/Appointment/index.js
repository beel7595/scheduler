
import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
const Appointment = (props) => {
    const { time, id, interview } = props;
    return (
        <article className="appointment">
            <Header time={time}></Header>
            {interview ? <Show student={interview.student} interviewer={interview.interviewer}></Show> : <Empty></Empty>}
        </article>
    )
}


export default Appointment;