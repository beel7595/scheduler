
import React from "react";

import "components/InterviewerListItem.scss";
import classNames from "classnames";

const InterviewerListItem = (props) => {
    const { name, avatar, selected, setInterviewer } = props;
    const itemClass = classNames("interviewers__item", { "interviewers__item--selected": selected });
    return (

        <li className={itemClass} onClick={setInterviewer}>
            <img
                className="interviewers__item-image"
                src={avatar}
                alt={name}
            />
            {selected ? name : null}
        </li>
    )
}

export default InterviewerListItem;