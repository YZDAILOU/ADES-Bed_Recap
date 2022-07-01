var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { getAll } from '../api.js';
import KeyValTable from "./keyValTable.js";

var _window$ReactQuery = window.ReactQuery,
    useQuery = _window$ReactQuery.useQuery,
    QueryClient = _window$ReactQuery.QueryClient,
    QueryClientProvider = _window$ReactQuery.QueryClientProvider;


function ManageKeyVal(props) {

    //this is state , for expire
    var _React$useState = React.useState(true),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        isExpired = _React$useState2[0],
        setIsExpired = _React$useState2[1]; //default


    var _React$useState3 = React.useState(0),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        lastId = _React$useState4[0],
        setLastId = _React$useState4[1]; //default
    //this is the line that will be calling the function from backend


    var _useQuery = useQuery('getAll', function () {
        return getAll(lastId, 5, isExpired);
    }, { refetchOnWindowFocus: false }),
        data = _useQuery.data,
        isLoading = _useQuery.isLoading,
        error = _useQuery.error,
        refetch = _useQuery.refetch,
        isRefetching = _useQuery.isRefetching;

    //use effect-->when lastId or isExpired is updated , i will refetch


    React.useEffect(function () {
        refetch();
    }, [lastId, isExpired]);

    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'ManageKeyVal'
        ),
        React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                null,
                React.createElement(
                    'button',
                    { onClick: function onClick() {
                            setLastId(data[data.length - 1].id);
                        } },
                    'Next Page'
                )
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'label',
                    null,
                    'Is Expired'
                ),
                React.createElement('input', { type: 'checkbox', checked: isExpired, onChange: function onChange(e) {
                        return setIsExpired(e.target.checked);
                    } })
            )
        ),
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