import { getAll } from '../api.js';
import KeyValControls from './KeyValControls.js';
import KeyValTable from "./keyValTable.js";

const { useQuery, QueryClient, QueryClientProvider } = window.ReactQuery;

// create a queryClient
const queryClient = new QueryClient({defaultOptions:{ queries : {refetchOnWindowFocus: false} }});

function ManageKeyVal(props) {

    const [filter, setFilter] = React.useState({});
    //this is the line that will be calling the function from backend
    //fetch is for GET request only , update , delete and add is under mutate
    const { data, isLoading, error, isRefetching,refetch } = useQuery(['getAll', filter.lastId, filter.isExpired], () => getAll(filter.lastId, 5, filter.isExpired));
    //                                                        ——————————————————————————————
    //                                                                       |
    //use effect-->when lastId or isExpired is updated , i will refetch      |this array with the varaible works same as the useEffect to refetch , hence we can just replace useEffect with dat
    // React.useEffect(() => {   |                                           |
    //     refetch();            |———————————————————————————————————————————|
    // }, [lastId, isExpired]);  |

    // this is a callback to refetch 
    const onExpireRow = React.useCallback(()=>{
        refetch();
    },[refetch]);

    // this will return the table and the next button and check box 
    return (<div>
        <h1>ManageKeyVal</h1>
        <KeyValControls onChange={setFilter} data={data} />
        {/* check if is loading */}
        {/*         |------check if the query is still on going , is loading anot  */}
        {/*         |                        |--if yes still loading , display loading  */}
        {/*         |                        |                       |--else if error occur , display the error                                               */}
        {/*         |                        |                       |                                 |--else no loading done , displauy the table with the data obtain from the query */}
        {isLoading || isRefetching ? (<p>Loading....</p>) : error ? (<p>{error.message}</p>) : (<KeyValTable onExpireRow={onExpireRow} rows={data}></KeyValTable>)}

    </div>)
}



// create a ManageKeyValApp to be displayed
function ManageKeyValApp(props) {
    return (<QueryClientProvider client={queryClient}>
        <ManageKeyVal />
    </QueryClientProvider>
    );
}


// add a eventlistener DOMContentLoaded to display react to the html when page is loaded
window.addEventListener('DOMContentLoaded', function () {
    const root = ReactDOM.createRoot(document.querySelector('#root'));
    root.render(<ManageKeyValApp />);
})