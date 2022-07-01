import KeyValTable from "./keyValTable.js";

function ManageKeyVal(props){
    return <div>
        <h1>ManageKeyVal</h1>
        <KeyValTable rows={[{id:1,dataKey:1,value:1,expire_on:1},{id:2,dataKey:2,value:2,expire_on:2},{id:3,dataKey:3,value:3,expire_on:3}]}></KeyValTable>
    </div>
}


window.addEventListener('DOMContentLoaded', function () {
const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<ManageKeyVal/>);
})