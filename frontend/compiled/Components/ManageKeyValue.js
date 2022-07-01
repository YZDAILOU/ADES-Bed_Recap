import { getAll } from '../api.js';
import KeyValTable from "./keyValTable.js";

var _window$ReactQuery = window.ReactQuery,
    useQuery = _window$ReactQuery.useQuery,
    QueryClient = _window$ReactQuery.QueryClient,
    QueryClientProvider = _window$ReactQuery.QueryClientProvider;


function ManageKeyVal(props) {
    //setting to configure to enable the react query to work
    var _useQuery = useQuery('getAll', function () {
        return getAll();
    }, { refetchOnWindowFocus: false }),
        data = _useQuery.data,
        isLoading = _useQuery.isLoading,
        error = _useQuery.error;

    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'ManageKeyVal'
        ),
        isLoading ? React.createElement(
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

var queryClient = new QueryClient();

function ManageKeyValApp(props) {
    return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(ManageKeyVal, null)
    );
}

window.addEventListener('DOMContentLoaded', function () {
    var root = ReactDOM.createRoot(document.querySelector('#root'));
    root.render(React.createElement(ManageKeyValApp, null));
});