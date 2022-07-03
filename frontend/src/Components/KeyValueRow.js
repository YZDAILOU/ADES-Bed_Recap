import { expireKey } from "../api.js";

const { useMutation } = window.ReactQuery;

export default function KeyValueRow(props) {
    const now = Math.floor(new Date() / 1000);
    const isExpired = props.expire_on <= now;

    const { error, isLoading , mutateAsync } = useMutation(()=>expireKey(props.dataKey , now));
    return <tr>
        <td>{props.id}</td>
        <td>{props.dataKey}</td>
        <td>{props.data}</td>
        <td>{new Date(props.expire_on * 1000).toLocaleString()}</td>
        <td>
            {isLoading ? ('Loading...') : error ? (<p>error.message</p>) : (<button onClick={()=>{mutateAsync().then(()=>props.onExpire())}} disabled={isExpired}>expire</button>) }
        </td>
    </tr>
}