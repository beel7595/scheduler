export function getAppointmentsForDay(state, day) {

    const { days, appointments } = state;

    const targetDay = days.find(element => {
        return element.name === day
    })

    if (!targetDay) {
        return [];
    }

    const result = targetDay.appointments.map(item => {
        return appointments[item]
    });

    return result;

}

export function getInterview(state, interview) {

    if (!interview) {
        return null;
    }
    const interviewer = state.interviewers[interview.interviewer];
    return { ...interview, interviewer: interviewer }
}
