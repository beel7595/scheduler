import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList';
import React, { useState } from 'react'
const Form = (props) => {
    const { interviewers, onSave, onCancel } = props;
    const [name, setName] = useState(props.name || "");
    const [interviewer, setInterviewer] = useState(props.interviewer || null);
    // const id = interviewer === null ? 0 : interviewer.id; 
    const reset = () => {
        setName("");
        setInterviewer(null);
    }
    const cancel = () => {
        reset();
        onCancel();
    }

    const save = () => {
        onSave(name, interviewer);
    }

    return (
        <main className="appointment__card appointment__card--create">
            <section className="appointment__card-left">
                <form autoComplete="off" onSubmit={event => event.preventDefault()}>
                    <input
                        className="appointment__create-input text--semi-bold"
                        name="name"
                        type="text"
                        value={name}
                        placeholder="Enter Student Name"
                        onChange={(e) => setName(e.target.value)}
                    /*
                      This must be a controlled component
                    */
                    />
                </form>
                <InterviewerList interviewers={interviewers} value={interviewer} onChange={setInterviewer} />
            </section>
            <section className="appointment__card-right">
                <section className="appointment__actions">
                    <Button onClick={cancel} danger>Cancel</Button>
                    <Button onClick={save} confirm>Save</Button>
                </section>
            </section>
        </main>
    )
}
export default Form;