import React, { createContext, useContext, useState, useCallback } from 'react';

export type AudienceTarget =
  | 'All Students'
  | 'All Teachers'
  | 'All Students & Teachers'
  | 'Grade 11 Students'
  | 'Grade 12 Students'
  | 'Grade 9 Students'
  | 'Grade 10 Students';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  postedBy: string;
  postedAt: string;
  audience: AudienceTarget;
  editedAt?: string;
}

export interface StudentGrade {
  subject: string;
  score: number;
  grade: string;
  teacher: string;
  submittedAt?: string;
  recentlyUpdated?: boolean;
}

interface PortalContextType {
  // Shared Announcements (Admin → Student / Teacher)
  announcements: Announcement[];
  postAnnouncement: (data: Omit<Announcement, 'id' | 'postedAt' | 'editedAt'>) => void;
  editAnnouncement: (id: number, data: Pick<Announcement, 'title' | 'content' | 'priority' | 'audience'>) => void;
  deleteAnnouncement: (id: number) => void;

  // Shared Grades (Teacher → Student)
  studentGrades: Record<string, StudentGrade>;
  submitGrades: (updates: Partial<Record<string, Partial<StudentGrade>>>) => void;
  gradesSubmitted: boolean;
  gradesSubmittedAt: string | null;

  // Shared Attendance
  attendanceSubmitted: boolean;
  submitAttendance: () => void;

  // Register User (Admin → system)
  registeredUsers: { name: string; role: string; email: string }[];
  registerUser: (user: { name: string; role: string; email: string }) => void;
}

const defaultGrades: Record<string, StudentGrade> = {
  Mathematics:        { subject: 'Mathematics',        score: 94, grade: 'A',  teacher: 'Prof. Wilson' },
  Physics:            { subject: 'Physics',            score: 88, grade: 'A−', teacher: 'Dr. Reed' },
  'English Literature': { subject: 'English Literature', score: 85, grade: 'B+', teacher: 'Ms. Thompson' },
  'World History':    { subject: 'World History',      score: 81, grade: 'B',  teacher: 'Mr. Garcia' },
  'Computer Science': { subject: 'Computer Science',   score: 97, grade: 'A+', teacher: 'Dr. Patel' },
  Biology:            { subject: 'Biology',            score: 89, grade: 'A−', teacher: 'Ms. Park' },
};

const defaultAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'End-of-Term Examination Schedule',
    content: 'Final examinations for Term 2 will be held from April 7–14. Please review the schedule on the portal.',
    priority: 'high',
    postedBy: 'Dr. Sarah Mitchell',
    postedAt: 'Mar 22, 2026 · 09:00 AM',
    audience: 'All Students',
  },
  {
    id: 2,
    title: 'Library Extended Hours',
    content: 'The school library will remain open until 8:00 PM on weekdays starting next week.',
    priority: 'medium',
    postedBy: 'Dr. Sarah Mitchell',
    postedAt: 'Mar 20, 2026 · 02:30 PM',
    audience: 'All Students & Teachers',
  },
  {
    id: 3,
    title: 'Grading Deadline — Term 2',
    content: 'All final grades must be submitted through the portal by March 31, 2026. Late submissions will not be accepted.',
    priority: 'high',
    postedBy: 'Dr. Sarah Mitchell',
    postedAt: 'Mar 18, 2026 · 10:00 AM',
    audience: 'All Teachers',
  },
];

const PortalContext = createContext<PortalContextType | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [studentGrades, setStudentGrades] = useState<Record<string, StudentGrade>>(defaultGrades);
  const [gradesSubmitted, setGradesSubmitted] = useState(false);
  const [gradesSubmittedAt, setGradesSubmittedAt] = useState<string | null>(null);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<{ name: string; role: string; email: string }[]>([]);

  const postAnnouncement = useCallback((data: Omit<Announcement, 'id' | 'postedAt' | 'editedAt'>) => {
    const now = new Date();
    const timeStr = now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    setAnnouncements(prev => [
      { ...data, id: Date.now(), postedAt: `${timeStr}` },
      ...prev,
    ]);
  }, []);

  const editAnnouncement = useCallback((id: number, data: Pick<Announcement, 'title' | 'content' | 'priority' | 'audience'>) => {
    const now = new Date();
    const timeStr = now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    setAnnouncements(prev =>
      prev.map(a => a.id === id ? { ...a, ...data, editedAt: timeStr } : a)
    );
  }, []);

  const deleteAnnouncement = useCallback((id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  const submitGrades = useCallback((updates: Partial<Record<string, Partial<StudentGrade>>>) => {
    setStudentGrades(prev => {
      const next = { ...prev };
      Object.entries(updates).forEach(([subject, update]) => {
        if (next[subject] && update) {
          next[subject] = {
            ...next[subject],
            ...update,
            recentlyUpdated: true,
            submittedAt: new Date().toLocaleString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }),
          };
        }
      });
      return next;
    });
    setGradesSubmitted(true);
    setGradesSubmittedAt(
      new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    );
  }, []);

  const submitAttendance = useCallback(() => {
    setAttendanceSubmitted(true);
  }, []);

  const registerUser = useCallback((user: { name: string; role: string; email: string }) => {
    setRegisteredUsers(prev => [user, ...prev]);
  }, []);

  return (
    <PortalContext.Provider value={{
      announcements, postAnnouncement, editAnnouncement, deleteAnnouncement,
      studentGrades, submitGrades, gradesSubmitted, gradesSubmittedAt,
      attendanceSubmitted, submitAttendance,
      registeredUsers, registerUser,
    }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider');
  return ctx;
}

/** Returns true if the announcement should appear on the Student dashboard */
export function isAnnouncementForStudents(audience: AudienceTarget): boolean {
  return audience.includes('Students');
}

/** Returns true if the announcement should appear on the Teacher dashboard */
export function isAnnouncementForTeachers(audience: AudienceTarget): boolean {
  return audience.includes('Teachers');
}