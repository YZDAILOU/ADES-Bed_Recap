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
        {props.rows.map(({id,dataKey,value,expire_on})=><KeyValueRow id={id} dataKey={dataKey} value={value} expire_on={expire_on}/>)}
    </tbody>
</table>
}