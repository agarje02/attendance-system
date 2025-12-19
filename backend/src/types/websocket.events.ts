export type ATTENDANCE_MARKED = {
  event:"ATTENDANCE_MARKED"
  data:{
    studentId: string;
    status: "present" | "absent";
  }
}

export type TODAY_SUMMARY = {
  event:"TODAY_SUMMARY"
  data?: {
    present: number;
    absent: number;
    total: number;  
  }
}

export type MY_ATTENDANCE = {
  event:"MY_ATTENDANCE"
  data?:{
    status: "present" | "absent" | "not yet updated";
  }
}

export type DONE = {
  event:"DONE"
  data:{
    message: "Attendance persisted";
    present: number;
    absent: number;
    total: number;
  }
}

export type ERROR = {
  event:"ERROR"
  data:{
    message: string;
  }
}

export type EVENTS = ATTENDANCE_MARKED | TODAY_SUMMARY | MY_ATTENDANCE | DONE | ERROR;