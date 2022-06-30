function ModuleRow(props) {
    //TODO delete button
    return (
        <tr>
            <th>{props.name}</th>
            <th>{props.credit}</th>
            <th>{props.grade}</th>
            {/*                      |-- calling the props which will trigger the function to delete a row */}
            <th><button onClick={props.onDelete}>Delete</button></th>
        </tr>
    )
}


function ModuleTable(props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Credit</th>
                    <th>Grade</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {/*                                                                                                   |-- this is a props onDelete whihc is a function that is calling the deleteRow function , this ondelete props will be passed to the children button */}
                {props.rows.map((row, index) => (
                    !row.isDeleted && <ModuleRow
                        name={row.name}
                        credit={row.credit}
                        grade={row.grade}
                        onDelete={() => props.onDeleteRow(index)}
                    />
                ))}

            </tbody>
        </table>
    );
}

let addRow; //other script can access 
let getRows;

window.addEventListener('DOMContentLoaded', function () {
    const rows = [];
    //creating the function to deleteRows
    function deleteRow(index) {
        if (index >= rows.length) return;
        rows[index].isDeleted = true;
        renderModuleTable();
        updateResult();
    }

    const root = ReactDOM.createRoot(
        document.getElementById('table-root')
    );

    //function to render the elements
    function renderModuleTable() {
        //                                            |--passed the delete row function to the parent element (ModuleTable) which later will passed it to its children (ModuleRow)        
        const element = <ModuleTable rows={rows} onDeleteRow={deleteRow} />;
        root.render(element);
    }

    //function to render the elements will be called once array is updated
    addRow = function (name, credit, grade) {
        rows.push({ name, credit, grade });
        renderModuleTable()
    };
    getRows = function () {
        //... means create another copy as we dont want user to touch the original copy
        //return a new copy of our rows
        return rows.filter((row) => !row.isDeleted);
    };

    renderModuleTable();

});