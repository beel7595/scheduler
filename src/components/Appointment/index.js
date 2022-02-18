
import React, { useEffect } from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const Appointment = (props) => {

    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const DELETEING = "DELETEING";
    const CONFIRM = "CONFIRM";
    const EDIT = "EDIT";
    const CONFIRM_DELETE = "Are you sure you want to delete?";
    const ERROR_SAVE = "ERROR_SAVE";
    const ERROR_DELETE = "ERROR_DELETE";


    const { time, id, interview, interviewers, bookInterview, cancelInterview } = props;

    const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);
    const save = (name, interviewer) => {
        const interview = {
            student: name,
            interviewer
        };

        transition(SAVING);
        bookInterview(id, interview)
            .then(() => transition(SHOW))
            .catch(error => transition(ERROR_SAVE, true));
    }

    useEffect(() => {

        if (interview && mode === EMPTY) {
            transition(SHOW);
        }
        if (interview === null && mode === SHOW) {
            transition(EMPTY);
        }

    }, [interview, transition, mode]);




    const onConfirm_Delete = () => {

        transition(DELETEING);
        cancelInterview(id)
            .then(() => transition(EMPTY))
            .catch(error => transition(ERROR_DELETE, true));
    }

    return (
        <article data-testid="appointment" className="appointment">
            <Header time={time}></Header>

            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SHOW && interview && (
                <Show
                    student={interview.student}
                    interviewer={interview.interviewer}
                    onDelete={() => transition(CONFIRM)}
                    onEdit={() => { transition(EDIT) }}
                />
            )}
            {mode === CREATE && (
                <Form
                    interviewers={interviewers}
                    onCancel={() => back()}
                    onSave={save}
                />
            )}
            {mode === SAVING && (
                <Status
                    message={"Saving"}
                />
            )}
            {mode === DELETEING && (
                <Status
                    message={DELETEING}
                />
            )}
            {mode === CONFIRM && (
                <Confirm
                    message={CONFIRM_DELETE}
                    onConfirm={onConfirm_Delete}
                    onCancel={() => transition(SHOW)}
                />
            )}
            {mode === EDIT && (
                <Form
                    interviewer={interview.interviewer.id}
                    name={interview.student}
                    interviewers={interviewers}
                    onCancel={() => back()}
                    onSave={save}
                />
            )}
            {mode === ERROR_SAVE && (
                <Error
                    message={"could not save appointment"}
                    onClose={() => back()}
                />
            )}
            {mode === ERROR_DELETE && (
                <Error
                    message={"could not cancel appointment"}
                    onClose={() => back()}
                />
            )}
        </article>
    )
}


export default Appointment;