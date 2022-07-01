export default function KeyValueRow(props){
return <tr>
    <td>{props.id}</td>
    <td>{props.dataKey}</td>
    <td>{props.value}</td>
    <td>{props.expire_on}</td>
    <td><button>:)</button></td>
</tr>
}