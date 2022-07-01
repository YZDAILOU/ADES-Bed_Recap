export default function KeyValueRow(props) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            props.id
        ),
        React.createElement(
            "td",
            null,
            props.dataKey
        ),
        React.createElement(
            "td",
            null,
            props.data
        ),
        React.createElement(
            "td",
            null,
            new Date(props.expire_on).toLocaleString()
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "button",
                null,
                ":)"
            )
        )
    );
}