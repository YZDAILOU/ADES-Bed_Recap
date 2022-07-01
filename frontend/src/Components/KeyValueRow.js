export default function KeyValueRow(props){
return <tr>
    <td>{props.id}</td>
    <td>{props.dataKey}</td>
    <td>{props.data}</td>
    <td>{new Date(props.expire_on).toLocaleString()}</td>
    <td><button>:)</button></td>
</tr>
}