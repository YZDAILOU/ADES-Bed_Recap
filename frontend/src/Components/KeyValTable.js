//importing components from other file
import KeyValueRow from "./KeyValueRow.js";

export default function KeyValTable(props){
return <table border={1}>
    <thead>
        <tr>
            <th>id</th>
            <th>key</th>
            <th>value</th>
            <th>expire on</th>
            <th>action</th>
        </tr>
    </thead>
    <tbody>
        {/* retrieve the rows obtain from query , use .map function to split the array to individual object */}
        {props.rows.map(({id,key,data,expire_on})=><KeyValueRow id={id} dataKey={key} data={data} expire_on={expire_on}/>)}
    </tbody>
</table>
}