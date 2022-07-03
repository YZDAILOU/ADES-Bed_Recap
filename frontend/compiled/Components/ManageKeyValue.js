var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { getAll } from '../api.js';
import KeyValControls from './KeyValControls.js';
import KeyValTable from "./keyValTable.js";

var _window$ReactQuery = window.ReactQuery,
    useQuery = _window$ReactQuery.useQuery,
    QueryClient = _window$ReactQuery.QueryClient,
    QueryClientProvider = _window$ReactQuery.QueryClientProvider;


function ManageKeyVal(props) {
    var _React$useState = React.useState({}),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        filter = _React$useState2[0],
        setFilter = _React$useState2[1];
    //this is the line that will be calling the function from backend


    var _useQuery = useQuery(['getAll', filter.lastId, filter.isExpired], function () {
        return getAll(filter.lastId, 5, filter.isExpired);
    }, { refetchOnWindowFocus: false }),
        data = _useQuery.data,
        isLoading = _useQuery.isLoading,
        error = _useQuery.error,
        isRefetching = _useQuery.isRefetching;
    //                                                        ——————————————————————————————
    //                                                                       |
    //use effect-->when lastId or isExpired is updated , i will refetch      |this array with the varaible works same as the useEffect to refetch , hence we can just replace useEffect with dat
    // React.useEffect(() => {   |                                           |
    //     refetch();            |———————————————————————————————————————————|
    // }, [lastId, isExpired]);  |

    // this will return the table and the next button and check box 


    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'ManageKeyVal'
        ),
        React.createElement(KeyValControls, { onChange: setFilter, data: data }),
        isLoading || isRefetching ? React.createElement(
            'p',
            null,
            'Loading....'
        ) : error ? React.createElement(
            'p',
            null,
            error.message
        ) : React.createElement(KeyValTable, { rows: data })
    );
}

// create a queryClient
var queryClient = new QueryClient();

// create a ManageKeyValApp to be displayed
function ManageKeyValApp(props) {
    return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(ManageKeyVal, null)
    );
}

// add a eventlistener DOMContentLoaded to display react to the html when page is loaded
window.addEventListener('DOMContentLoaded', function () {
    var root = ReactDOM.createRoot(document.querySelector('#root'));
    root.render(React.createElement(ManageKeyValApp, null));
});