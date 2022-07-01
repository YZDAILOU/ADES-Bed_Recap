import {getAll} from '../api.js';
import KeyValTable from "./keyValTable.js";

const {useQuery , QueryClient , QueryClientProvider} = window.ReactQuery;

function ManageKeyVal(props) {
    //setting to configure to enable the react query to work
    const { data, isLoading, error, } = useQuery('getAll', ()=>getAll(), { refetchOnWindowFocus: false });
    return <div>
        <h1>ManageKeyVal</h1>
        {/* check if is loading */}
        {/* |------check if the query is still on going , is loading anot  */}
        {/* |            |--if yes still loading , display loading  */}
        {/* |            |--else if error occur , display the error                                               */}
        {/* |            |                                                      |--else no loading done , displauy the table with the data obtain from the query */}
        {isLoading ? <p>Loading....</p> : error ? <p>{error.message}</p>:<KeyValTable rows={data}></KeyValTable>}

    </div>
}

const queryClient = new QueryClient();

function ManageKeyValApp(props){
   return (<QueryClientProvider client={queryClient}>
        <ManageKeyVal/>
    </QueryClientProvider>
);}

window.addEventListener('DOMContentLoaded', function () {
    const root = ReactDOM.createRoot(document.querySelector('#root'));
    root.render(<ManageKeyValApp/>);
})