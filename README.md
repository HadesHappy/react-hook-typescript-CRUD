This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


Try it: <br /> 
[https://slavkopar.github.io/CRUD/](https://slavkopar.github.io/CRUD/)


<div>
			<h2>To CRUD or not to CRUD</h2>
			<div>
				<h3>Introduction</h3>
The CRUD paradigm is common in constructing web applications. The model must be able to Create, Read, Update, and Delete resources. We refer to these functions by the acronym CRUD.
<br/>In a REST environment, CRUD often corresponds to the HTTP methods POST, GET, PUT, and DELETE, respectively. 

<br/>We are going to implement CRUD functionality for the base type Entity.
<br/>After that we are going to implement CRUD functionality for Student, reusing functionality of Entity.				
				<br/><h3>Background</h3>
				<div>
				Most of the web applications initally create base framework, which will be applied for all the features of the application. That way any change of application done in the base framework, will be applied to whole application
				<br/>We are going to use the following technologies: React, Hooks and TypeScript.
<br/>You can learn about these technologies from many sources, one of them could be:<br />
<a href="https://react.christmas/2019/7?utm_campaign=React%2BNewsletter&utm_medium=email&utm_source=React_Newsletter_190" target="_blank">Manage Global State with Context API and Hooks</a>
				</div>
				<h3>Basic Idea</h3>
				<div>
We are going to develop component <b>EntityList</b> which uses <b>IEntity</b> interface.
<br/>
TypeScript enables extension of the interfaces,<br/>and we are going to create interface
<b>IStudent</b> which extends <b>IEntity</b> interface.<br />

```JSX
export interface IEntity {
	id: number; 
	name: string;
}
export interface IStudent extends IEntity {
	code: string;
	email: string;
	types: string[];
	avatar: string;
	grades: IStudentGrade[]
}
```
Now we can reuse <b>EntityList</b> component, because <b>IStudent</b> can be converted to <b>IEntity</b>.
<br/>
<a href="https://www.typescriptlang.org/docs/handbook/interfaces.html" target="_blank">Read about TypeScript Interfaces</a>
<br/>
				</div>
				<h3>Reuse Entity CRUD functionality for Student</h3>
				<div>
I implemented CRUD functionality for <b>Student</b>, reusing functionality of <b>Entity</b>.
<ul>
<li>Define folder <b>Student</b></li>
<li>Define types <b>IStudent</b> and <b>IStudentState</b></li>
<li>Define <b>StudentProvider</b> </li>
<li>Define Context <b>useStudent</b></li>
<li>Define <b>StudentPage</b> using <b>EntityList</b></li>
<li>Define <b>StudentForm</b></li>
</ul>


<br />

<h3>Manage app state without Redux.</h3>
1) Each feature (page) has its own provider with state. <br/>
   (<b>StudentProvider</b>, <b>StudentExtendedProvider</b>)<br/>
   Keep state as close to where it's needed as possible.<br/><br/>
2) Global AppState will keep  state shared between all the features.<br/>
	(<b>AppProvider</b>)<br/>

<a href="https://kentcdodds.com/blog/application-state-management-with-react" target="_blank">Application State Management with React</a><br/>

```JSX
<AppProvider>
	<Router>
		<nav>
			<Link to="/student">Student</Link>
			<Link to="/" className="push-right">Student Extended</Link>
		</nav>
		<div>
			<Switch>
				<Route path="/student">
					<StudentProvider>
						<Page query={props.query} />
					</StudentProvider>
				</Route>
				<Route path="/">
					<StudentExtendedProvider>
						<PageExetended query={props.query} />
					</StudentExtendedProvider>
				</Route>						
			</Switch>
		</div>	
	</Router>
</AppProvider>
```


<br/><h3>Reuse Entity CRUD functionality for Student Extended</h3>

Another example is <b>StudentExtended</b> where I extended <b>Entity</b>, creating <b>StudentActions</b> and <b>studentReducer.
</b> That way we override behavior of Entity. 
We process some actions in <b>studentReducer</b>, like GET_ENTITIES, without processing that action in the <b>entityReducer</b>.
<br />

```JSX
export const initialStudent: IStudent = { 
	id: 0, 
	name: '',
	url: '',
	code: '',
	email: '',
	avatar: 'https://img.pokemondb.net/artwork/diglett.jpg',
	types: [],
	grades: []
};

export const combineReducers: (
	entityReducer: React.Reducer<IStudentState, EntityAcceptedActions>, 
	studentReducer: React.Reducer<IStudentState, StudentAcceptedActions>) => 
		React.Reducer<
			IStudentState, 
			EntityAcceptedActions & StudentAcceptedActions
		> = (entityReducer, studentReducer) => {
	return (prevState, action) => {
		
		// when action is overriden in studentReducer, no need to call entityReducer
		if (action.type in StudentActionTypes)
			return studentReducer(prevState, action)

		const state = entityReducer(prevState, action);
		return studentReducer(state, action)
	};	
}

export const studentReducer: (initialEntity: IStudent) => 
	React.Reducer<IStudentState, StudentAcceptedActions> = (initialEntity) => {
	return (state, action) =>  {
		switch(action.type) {

			case StudentActionTypes.GET_ENTITIES:  {
				const { entities, pageCount, appState } = action.payload;
				entities.map(student => student.grades = studentJoins(student, appState));
				return {
					...state,
					entities,
					pageCount
				}
			}

			case StudentActionTypes.STUDENT_ASSIGN_GRADE: {
				const { studentId, gradeId, gradeName } = action.studentGradeIds
				const students = state.entities.map(student => 
					student.id !== studentId ?
						{...student} :
						{...student, grades: [...student.grades, { 
								name: gradeName,
								gradeId,
								grade: 0
							}]
						}
				)

				return {
					...state,
					entities: students,
					entity: { ...students.find(student => student.id === studentId)! }
				}				
			}

			default:
				return state
		}		
	}
}

export const Reducer = combineReducers(
	entityReducer(initialStudent), 
	studentReducer(initialStudent)
);
```
<br />

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can???t go back!**

If you aren???t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you???re on your own.

You don???t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn???t feel obligated to use this feature. However we understand that this tool wouldn???t be useful if you couldn???t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
