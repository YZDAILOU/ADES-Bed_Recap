import { getAll } from '../api.js';
import KeyValTable from "./keyValTable.js";

const { useQuery, QueryClient, QueryClientProvider } = window.ReactQuery;

function ManageKeyVal(props) {



    //this is state , for expire
    const [isExpired, setIsExpired] = React.useState(true);//default
    const [lastId, setLastId] = React.useState(0);//default
    //this is the line that will be calling the function from backend
    const { data, isLoading, error, refetch ,isRefetching } = useQuery('getAll', () => getAll(lastId, 5, isExpired), { refetchOnWindowFocus: false });

    //use effect-->when lastId or isExpired is updated , i will refetch
    React.useEffect(() => {
        refetch();
    }, [lastId , isExpired]);


    return (<div>
        <h1>ManageKeyVal</h1>
        <div>
            <div>
                <button onClick={()=>{
                    setLastId(data[data.length - 1].id)
                }
                }>Next Page</button>
            </div>
            <div>
                <label>Is Expired</label>
                <input type="checkbox" checked={isExpired} onChange={(e)=> setIsExpired(e.target.checked)}></input>
            </div>
        </div>
        {/* check if is loading */}
        {/* |------check if the query is still on going , is loading anot  */}
        {/* |            |--if yes still loading , display loading  */}
        {/* |            |--else if error occur , display the error                                               */}
        {/* |            |                                                      |--else no loading done , displauy the table with the data obtain from the query */}
        {isLoading || isRefetching ? (<p>Loading....</p>) : error ? (<p>{error.message}</p>) : (<KeyValTable rows={data}></KeyValTable>)}

    </div>)
}

const queryClient = new QueryClient();

function ManageKeyValApp(props) {
    return (<QueryClientProvider client={queryClient}>
        <ManageKeyVal />
    </QueryClientProvider>
    );
}

window.addEventListener('DOMContentLoaded', function () {
    const root = ReactDOM.createRoot(document.querySelector('#root'));
    root.render(<ManageKeyValApp />);
})