import axios from 'axios';

const API_BASE_URL = 'http://localhost:5046/api/v1/attendance';

export class AttendanceApi {

    getAttendances(params = {}) {
        return axios.get(API_BASE_URL, { params });
    }

    getAttendancesById(id) {
        return axios.get(`${API_BASE_URL}/${id}`);
    }
}