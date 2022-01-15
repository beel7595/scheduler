
import React from "react";

import "components/InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

const InterviewerList = (props) => {
    const { interviewers, value, onChange } = props;

    const interviewsList = interviewers.map((interviewer) => {
        return (
            <InterviewerListItem
                key={interviewer.id}
                // id={interviewer.id}
                name={interviewer.name}
                avatar={interviewer.avatar}
                selected={interviewer.id === value}
                setInterviewer={() => onChange(interviewer.id)}
            ></InterviewerListItem>
        )
    })

    return (
        <section className="interviewers">
            <h4 className="interviewers__header text--light">Interviewer</h4>
            <ul className="interviewers__list">
                {interviewsList}
            </ul>
        </section>
    )
}
export default InterviewerList;


