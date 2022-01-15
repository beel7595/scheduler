import classNames from 'classnames';
import React from 'react'
import "components/DayListItem.scss";
export default function DayListItem(props) {
    const { name, spots, setDay, selected } = props;
    const itemClass = classNames("day-list__item", { "day-list__item--selected": selected }, { "day-list__item--full": spots === 0 });

    const formatSpots = () => {
        if (spots === 0) {
            return `no spots remaining`;
        } else if (spots === 1) {
            return `${spots} spot remaining`;
        } else {
            return `${spots} spots remaining`;
        }
    }

    return (
        <li className={itemClass} onClick={() => setDay(name)}>
            <h2 className="text--regular">{name}</h2>
            <h3 className="text--light">{formatSpots()}</h3>
        </li>
    );
}
