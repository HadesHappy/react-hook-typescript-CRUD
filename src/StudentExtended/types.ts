import { IEntity, IEntityState } from "../Entity/types";
import { IGrade } from "../Grades/types";

export interface IStudent extends IEntity {
	code: string;
	email: string;
	types: string[];
	avatar: string;
	grades: IStudentGrade[]
}

export interface IStudentState extends IEntityState<IStudent> {
	gradesAll: IGrade[]
}

export interface IStudentGrade {
	gradeId: number,
	grade: number,
	name?: string
}

export interface IStudentGradeIds {
	studentId: number,
	gradeId: number,
	grade?: number
}


