export default function KeyValControls(props) {
    //this is state , for expire and last id --> we can set default state and then changes it state during a action
    const [isExpired, setIsExpired] = React.useState(true);//default
    const [lastId, setLastId] = React.useState(0);//default

    // extracting the data from props 
    const {data} = props;

    //hook 
    React.useEffect(() => {
        props.onChange({
            isExpired,
            lastId,
        })
    }, [isExpired, lastId]);

    return (
        <div>
            <div>
                {/* button when clicked will take the id of data.length - 1 -->changing of state */}
                <button onClick={() => {
                    setLastId(data[data.length - 1].id)
                }
                }>Next Page</button>
            </div>
            <div>
                <label>Is Expired</label>
                {/* changing of state for expired */}
                <input type="checkbox" checked={isExpired} onChange={(e) => setIsExpired(e.target.checked)}></input>
            </div>
        </div>
    )
}