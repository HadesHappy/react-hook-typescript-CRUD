
import React, { createContext, useContext, useReducer, Dispatch, useCallback } from 'react';
import { IStudentState } from './types';
import { Reducer } from './studentReducer';
import { EntityActions } from '../Entity/EntityActions';
import jsonStudents from './Students.json'
import { IAppState } from '../AppData/types';


const initialState: IStudentState = { 
	entities: [],
	loading: false,
	formMode: 'display',
	canEdit: true,
	pageCount: 0,
	currentPage: 0,
	gradesAll: []
};

export interface IStudentContext {
	state: IStudentState;
	dispatch: Dispatch<any>; // AcceptedActions & StudentAcceptedActions>;
}

let StudentContext: React.Context<IStudentContext>;

interface IProps {
	children: React.ReactNode
}

export const StudentProvider: React.FC<IProps> = ({ children }) => {
	const [state, dispatch] = useReducer(Reducer, initialState)

	if (StudentContext === undefined)
  		StudentContext = createContext<IStudentContext>({ state, dispatch })

  	return (
   	<StudentContext.Provider value={{ state, dispatch }}>
   		{children}
   	</StudentContext.Provider>
  	)
}

const pageSize = 9;

const entityActions: EntityActions = new EntityActions({
	storageName: 'StudentGrades',
	getFromJSON: () => [...jsonStudents],
	pageSize: pageSize,
	baseURL: 'https//abc.com/students/'
});

export const useStudent = () => {
	const context = useContext(StudentContext);
	if (!context) {
		throw new Error('useStudent must be used within a StudentProvider')
	}

	const { state, dispatch } = context;

	const { 
		// getEntites, 
		displayEntity, 
		editEntity, 
		removeEntity, 
		storeEntity
	} = entityActions;

	// The way to override entity Actions
	const getEntites = useCallback(
		(dispatch: Dispatch<any>, query: string, currentPage: number, appState: IAppState) => { 
			return entityActions.getEntites(dispatch, query, currentPage, appState) 
		}, []
	)


	return { state, dispatch, getEntites, displayEntity, editEntity, removeEntity, storeEntity };
}
