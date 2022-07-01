function ManageKeyVal(props) {
    return React.createElement(
        'h1',
        null,
        'Manage Key Val'
    );
}

window.addEventListener('DOMContentLoaded', function () {
    var root = ReactDOM.createRoot(document.querySelector('#root'));
    root.render(React.createElement(ManageKeyVal, null));
});