import { ScheduleConferenceData } from '@/src/entities/ScheduleConferenceData';

export const conferenceRepository = {
  async scheduleConference(data: ScheduleConferenceData) {
    const response = await fetch(`${process.env.API_URL}/agenda-conferencias?populate=*`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    const json = await response.json();
    return json;
  },
};