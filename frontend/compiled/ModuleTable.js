function ModuleRow(props) {
    //TODO delete button
    return React.createElement(
        'tr',
        null,
        React.createElement(
            'th',
            null,
            props.name
        ),
        React.createElement(
            'th',
            null,
            props.credit
        ),
        React.createElement(
            'th',
            null,
            props.grade
        ),
        React.createElement(
            'th',
            null,
            React.createElement(
                'button',
                { onClick: props.onDelete },
                'Delete'
            )
        )
    );
}

function ModuleTable(props) {
    return React.createElement(
        'table',
        null,
        React.createElement(
            'thead',
            null,
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    null,
                    'Name'
                ),
                React.createElement(
                    'th',
                    null,
                    'Credit'
                ),
                React.createElement(
                    'th',
                    null,
                    'Grade'
                ),
                React.createElement(
                    'th',
                    null,
                    'Delete'
                )
            )
        ),
        React.createElement(
            'tbody',
            null,
            props.rows.map(function (row, index) {
                return !row.isDeleted && React.createElement(ModuleRow, {
                    name: row.name,
                    credit: row.credit,
                    grade: row.grade,
                    onDelete: function onDelete() {
                        return props.onDeleteRow(index);
                    }
                });
            })
        )
    );
}

var addRow = void 0; //other script can access 
var getRows = void 0;

window.addEventListener('DOMContentLoaded', function () {
    var rows = [];
    //creating the function to deleteRows
    function deleteRow(index) {
        if (index >= rows.length) return;
        rows[index].isDeleted = true;
        renderModuleTable();
        updateResult();
    }

    var root = ReactDOM.createRoot(document.getElementById('table-root'));

    //function to render the elements
    function renderModuleTable() {
        //                                            |--passed the delete row function to the parent element (ModuleTable) which later will passed it to its children (ModuleRow)        
        var element = React.createElement(ModuleTable, { rows: rows, onDeleteRow: deleteRow });
        root.render(element);
    }

    //function to render the elements will be called once array is updated
    addRow = function addRow(name, credit, grade) {
        rows.push({ name: name, credit: credit, grade: grade });
        renderModuleTable();
    };
    getRows = function getRows() {
        //... means create another copy as we dont want user to touch the original copy
        //return a new copy of our rows
        return rows.filter(function (row) {
            return !row.isDeleted;
        });
    };

    renderModuleTable();
});