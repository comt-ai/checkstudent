export type AttendanceStatus = 'present' | 'absent';

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  ownerId: string;
  createdAt: Date | any;
}

export interface AttendanceSession {
  id: string;
  name: string;
  date: string;
  ownerId: string;
  createdAt: Date | any;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  ownerId: string;
  updatedAt: Date | any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}
