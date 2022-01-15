import React from 'react'
import DayListItem from './DayListItem';
const DayList = (props) => {

    const { days, day: selectDay, setDay } = props;

    const dayList = days.map((day) => {
        return (
            <DayListItem
                key={day.id}
                name={day.name}
                spots={day.spots}
                selected={selectDay === day.name}
                setDay={setDay}>
            </DayListItem>
        )
    })

    return (
        <ul>
            {dayList}
        </ul>
    )
}
export default DayList;