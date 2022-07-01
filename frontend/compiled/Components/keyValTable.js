//importing components from other file
import KeyValueRow from "./KeyValueRow.js";

export default function KeyValTable(props) {
    return React.createElement(
        "table",
        { border: 1 },
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    "id"
                ),
                React.createElement(
                    "th",
                    null,
                    "key"
                ),
                React.createElement(
                    "th",
                    null,
                    "value"
                ),
                React.createElement(
                    "th",
                    null,
                    "expire on"
                ),
                React.createElement(
                    "th",
                    null,
                    "action"
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            props.rows.map(function (_ref) {
                var id = _ref.id,
                    key = _ref.key,
                    data = _ref.data,
                    expire_on = _ref.expire_on;
                return React.createElement(KeyValueRow, { id: id, dataKey: key, data: data, expire_on: expire_on });
            })
        )
    );
}